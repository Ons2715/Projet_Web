package com.projet.web.controller;

import com.projet.web.exception.ApiException;
import io.jsonwebtoken.Claims;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final JdbcTemplate jdbc;

    public BookingController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public List<Map<String, Object>> all(Authentication authentication) {
        Claims claims = requireClaims(authentication);
        String role = claims.get("role", String.class);
        int id = claims.get("id", Number.class).intValue();
        if ("eleve".equals(role)) return forStudent(id);
        if ("moniteur".equals(role)) return forMonitor(id);
        if ("admin".equals(role)) return withDetails("WHERE r.statut IS NOT NULL");
        throw ApiException.forbidden("Acces refuse.");
    }

    @GetMapping("/me")
    public List<Map<String, Object>> mine(Authentication authentication) {
        Claims claims = requireClaims(authentication);
        String role = claims.get("role", String.class);
        int id = claims.get("id", Number.class).intValue();
        if ("eleve".equals(role)) return forStudent(id);
        if ("moniteur".equals(role)) return forMonitor(id);
        if ("admin".equals(role)) return withDetails("WHERE r.statut IS NOT NULL");
        throw ApiException.forbidden("Acces refuse.");
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body, Authentication authentication) {
        Claims claims = requireClaims(authentication);
        if (!"eleve".equals(claims.get("role", String.class)))
            throw ApiException.forbidden("Seuls les eleves peuvent reserver.");
        int studentId = claims.get("id", Number.class).intValue();
        String date = String.valueOf(body.getOrDefault("date", ""));
        String time = String.valueOf(body.getOrDefault("time", ""));
        if (!date.matches("\\d{4}-\\d{2}-\\d{2}") || !time.matches("\\d{2}:\\d{2}"))
            throw ApiException.badRequest("Date ou horaire invalide.");

        LocalDateTime lessonDate;
        try {
            lessonDate = LocalDateTime.parse(date + "T" + time, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (Exception ignored) {
            throw ApiException.badRequest("Date ou horaire invalide.");
        }
        if (lessonDate.isBefore(LocalDateTime.now()))
            throw ApiException.badRequest("Impossible de reserver un horaire passe.");

        int duration = String.valueOf(body.getOrDefault("duration", "1h")).startsWith("2") ? 120 : 60;
        String place = String.valueOf(body.getOrDefault("place", ""));
        String note = String.valueOf(body.getOrDefault("note", ""));

        List<Map<String, Object>> studentRows = jdbc.queryForList(
            "SELECT e.id,e.id_formation FROM eleves e WHERE e.id=?", studentId);
        if (studentRows.isEmpty()) throw ApiException.badRequest("Profil eleve introuvable.");
        int formationId = ((Number) studentRows.get(0).get("id_formation")).intValue();

        List<Map<String, Object>> monitors = jdbc.queryForList(
            "SELECT m.id,u.nom,COUNT(r.id) AS charge FROM moniteurs m " +
            "JOIN utilisateurs u ON u.id=m.id LEFT JOIN reservations r ON r.moniteur_id=m.id AND r.statut='reservee' " +
            "WHERE m.id_formation=? GROUP BY m.id,u.nom ORDER BY charge ASC,m.id ASC LIMIT 1", formationId);
        if (monitors.isEmpty())
            throw ApiException.conflict("Aucun moniteur disponible pour cette formation.");
        int monitorId = ((Number) monitors.get(0).get("id")).intValue();

        if (!jdbc.queryForList(
            "SELECT id FROM reservations WHERE moniteur_id=? AND date_reservation=? AND statut='reservee'",
            monitorId, lessonDate).isEmpty())
            throw ApiException.conflict("Ce creneau est deja reserve.");
        if (!jdbc.queryForList(
            "SELECT id FROM reservations WHERE eleve_id=? AND date_reservation=? AND statut='reservee'",
            studentId, lessonDate).isEmpty())
            throw ApiException.conflict("Vous avez deja une reservation a cette heure.");

        jdbc.update(
            "INSERT INTO reservations(eleve_id,moniteur_id,date_reservation,duree_minutes,adresse_depart,statut,note_client) " +
            "VALUES(?,?,?,?,?, 'reservee',?)",
            studentId, monitorId, lessonDate, duration, place, note);
        Number id = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Number.class);
        List<Map<String, Object>> rows = withDetails("WHERE r.id=?", id);
        for (Map<String, Object> row : rows) {
            if (((Number) row.get("id")).intValue() == id.intValue()) return row;
        }
        throw ApiException.notFound("Reservation creee mais introuvable.");
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> cancel(@PathVariable int id, Authentication authentication) {
        Claims claims = requireClaims(authentication);
        String role = claims.get("role", String.class);
        int currentId = claims.get("id", Number.class).intValue();
        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT eleve_id,moniteur_id FROM reservations WHERE id=?", id);
        if (rows.isEmpty()) throw ApiException.notFound("Reservation introuvable.");
        Map<String, Object> row = rows.get(0);
        int studentId = ((Number) row.get("eleve_id")).intValue();
        int monitorId = ((Number) row.get("moniteur_id")).intValue();
        if (!"admin".equals(role) && !("eleve".equals(role) && studentId == currentId)
            && !("moniteur".equals(role) && monitorId == currentId))
            throw ApiException.forbidden("Vous ne pouvez pas annuler cette reservation.");
        jdbc.update("UPDATE reservations SET statut='annulee' WHERE id=?", id);
        return Map.of("success", true);
    }

    private List<Map<String, Object>> forStudent(int studentId) {
        return withDetails("WHERE r.eleve_id=?", studentId);
    }

    private List<Map<String, Object>> forMonitor(int monitorId) {
        return withDetails("WHERE r.moniteur_id=?", monitorId);
    }

    private List<Map<String, Object>> withDetails(String suffix, Object... args) {
        String sql =
            "SELECT r.id,r.eleve_id,r.moniteur_id,r.date_reservation AS date_lecon,r.duree_minutes,r.adresse_depart,r.statut,r.note_client AS note,r.date_creation," +
            "eu.nom AS eleve_nom,eu.email AS eleve_email,eu.telephone AS eleve_telephone," +
            "mu.nom AS moniteur_nom,mu.email AS moniteur_email,m.voiture,f.nom AS formation_nom " +
            "FROM reservations r JOIN utilisateurs eu ON eu.id=r.eleve_id JOIN eleves e ON e.id=r.eleve_id " +
            "JOIN formations f ON f.id=e.id_formation JOIN utilisateurs mu ON mu.id=r.moniteur_id " +
            "LEFT JOIN moniteurs m ON m.id=r.moniteur_id " + suffix +
            " ORDER BY r.date_reservation DESC";
        return jdbc.queryForList(sql, args);
    }

    private Claims requireClaims(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        return claims;
    }
}
