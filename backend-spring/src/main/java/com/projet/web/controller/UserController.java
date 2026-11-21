package com.projet.web.controller;

import com.projet.web.exception.ApiException;
import io.jsonwebtoken.Claims;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final JdbcTemplate jdbc;

    public UserController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public List<Map<String, Object>> users(Authentication authentication) {
        requireAdmin(authentication);
        return jdbc.queryForList(
            "SELECT u.*, COALESCE(fe.nom,fm.nom) AS formation_nom, " +
            "COALESCE(fe.heures_totales,fm.heures_totales) AS heures_totales, e.heures_effectuees, " +
            "COALESCE(e.id_formation,m.id_formation) AS id_formation, m.voiture, " +
            "(SELECT CONCAT(mu.nom) FROM eleves ee JOIN moniteurs mm ON mm.id_formation=ee.id_formation " +
            "JOIN utilisateurs mu ON mu.id=mm.id WHERE ee.id=u.id LIMIT 1) AS encadre_par " +
            "FROM utilisateurs u LEFT JOIN eleves e ON e.id=u.id " +
            "LEFT JOIN formations fe ON fe.id=e.id_formation LEFT JOIN moniteurs m ON m.id=u.id " +
            "LEFT JOIN formations fm ON fm.id=m.id_formation " +
            "ORDER BY u.date_creation DESC");
    }

    @GetMapping("/{id}")
    public Map<String, Object> getOne(@PathVariable int id, Authentication authentication) {
        requireSelfOrAdmin(authentication, id);
        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT u.id,u.nom,u.email,u.role,u.telephone,u.adresse,u.photo_profil,u.date_creation," +
            "COALESCE(fe.nom,fm.nom) AS formation_nom,COALESCE(fe.heures_totales,fm.heures_totales) AS heures_totales," +
            "e.heures_effectuees,m.voiture,COALESCE(e.id_formation,m.id_formation) AS id_formation " +
            "FROM utilisateurs u LEFT JOIN eleves e ON e.id=u.id LEFT JOIN moniteurs m ON m.id=u.id " +
            "LEFT JOIN formations fe ON fe.id=e.id_formation LEFT JOIN formations fm ON fm.id=m.id_formation WHERE u.id=?", id);
        if (rows.isEmpty()) throw ApiException.notFound("Utilisateur introuvable.");
        return toClientProfile(rows.get(0));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body, Authentication authentication) {
        requireAdmin(authentication);
        String role = String.valueOf(body.getOrDefault("role", "eleve"));
        if (!List.of("eleve", "moniteur", "admin").contains(role)) role = "eleve";
        String nom = String.valueOf(body.getOrDefault("nom", "")).trim();
        String email = String.valueOf(body.getOrDefault("email", "")).trim().toLowerCase();
        String phone = String.valueOf(body.getOrDefault("telephone", "")).trim();
        String address = String.valueOf(body.getOrDefault("adresse", "")).trim();
        String password = String.valueOf(body.getOrDefault("password", "EduCar2026"));
        int formationId = parseInt(body.get("formationId"), 1);

        if (nom.isEmpty() || email.isEmpty()) throw ApiException.badRequest("Nom et email obligatoires.");
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw ApiException.badRequest("Adresse email invalide.");
        if (!phone.matches("^[0-9]{8}$")) throw ApiException.badRequest("Le telephone doit contenir 8 chiffres.");
        if (!jdbc.queryForList("SELECT id FROM utilisateurs WHERE email=?", email).isEmpty())
            throw ApiException.conflict("Cet email est deja utilise.");

        String photo = String.valueOf(body.getOrDefault("photo", ""));
        jdbc.update("INSERT INTO utilisateurs(nom,email,mot_de_passe,role,telephone,adresse,photo_profil) VALUES(?,?,?,?,?,?,?)",
            nom, email, com.projet.web.security.ScryptPassword.hash(password), role, phone, address,
            photo.isEmpty() ? null : photo);
        Number id = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Number.class);
        if ("eleve".equals(role)) {
            jdbc.update("INSERT INTO eleves(id,id_formation,date_inscription) VALUES(?,?,CURDATE())", id.intValue(), formationId);
        } else if ("moniteur".equals(role)) {
            String car = String.valueOf(body.getOrDefault("voiture", formationId == 2 ? "Kia Picanto" : "Renault Clio"));
            if (!List.of("Kia Picanto", "Renault Clio").contains(car)) car = "Renault Clio";
            jdbc.update("INSERT INTO moniteurs(id,id_formation,voiture) VALUES(?,?,?)", id.intValue(), formationId, car);
        }
        Map<String, Object> created = getOne(id.intValue(), authentication);
        return created;
    }

    @PatchMapping("/me")
    public Map<String, Object> updateMe(@RequestBody Map<String, Object> body, Authentication authentication) {
        int id = currentId(authentication);
        updateProfile(id, body);
        return getOne(id, authentication);
    }

    @PatchMapping("/me/photo")
    public Map<String, Object> updatePhoto(@RequestBody Map<String, Object> body, Authentication authentication) {
        int id = currentId(authentication);
        String photo = String.valueOf(body.getOrDefault("photo", ""));
        jdbc.update("UPDATE utilisateurs SET photo_profil=? WHERE id=?", photo.isEmpty() ? null : photo, id);
        return getOne(id, authentication);
    }

    @PatchMapping("/me/formation")
    public Map<String, Object> updateFormation(@RequestBody Map<String, Object> body, Authentication authentication) {
        int id = currentId(authentication);
        int formationId = parseInt(body.get("formationId"), 1);
        if (jdbc.queryForList("SELECT id FROM formations WHERE id=?", formationId).isEmpty())
            throw ApiException.badRequest("Formation invalide.");
        if (jdbc.update("UPDATE eleves SET id_formation=? WHERE id=?", formationId, id) == 0)
            throw ApiException.badRequest("Seuls les eleves peuvent modifier leur formation.");
        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT formation_nom, heures_totales, heures_effectuees FROM (SELECT f.nom AS formation_nom,f.heures_totales,e.heures_effectuees FROM eleves e JOIN formations f ON f.id=e.id_formation WHERE e.id=?) x",
            id);
        return rows.isEmpty() ? Map.of() : rows.get(0);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable int id, Authentication authentication) {
        requireAdmin(authentication);
        if (id == 0) throw ApiException.badRequest("Compte administrateur invalide.");
        int deleted = jdbc.update("DELETE FROM utilisateurs WHERE id=?", id);
        if (deleted == 0) throw ApiException.notFound("Utilisateur introuvable.");
        return Map.of("success", true);
    }

    private void updateProfile(int id, Map<String, Object> body) {
        String first = String.valueOf(body.getOrDefault("firstName", "")).trim();
        String last = String.valueOf(body.getOrDefault("lastName", "")).trim();
        String nom = (first + " " + last).trim();
        if (!nom.isEmpty()) jdbc.update("UPDATE utilisateurs SET nom=? WHERE id=?", nom, id);
        if (body.containsKey("email")) {
            String email = String.valueOf(body.get("email")).trim().toLowerCase();
            if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw ApiException.badRequest("Adresse email invalide.");
            if (!jdbc.queryForList("SELECT id FROM utilisateurs WHERE email=? AND id<>?", email, id).isEmpty())
                throw ApiException.conflict("Cet email est deja utilise.");
            jdbc.update("UPDATE utilisateurs SET email=? WHERE id=?", email, id);
        }
        if (body.containsKey("telephone")) {
            String phone = String.valueOf(body.get("telephone")).trim();
            if (!phone.matches("^[0-9]{8}$")) throw ApiException.badRequest("Le telephone doit contenir 8 chiffres.");
            jdbc.update("UPDATE utilisateurs SET telephone=? WHERE id=?", phone, id);
        }
        if (body.containsKey("adresse")) jdbc.update("UPDATE utilisateurs SET adresse=? WHERE id=?", String.valueOf(body.get("adresse")).trim(), id);
    }

    private Map<String, Object> toClientProfile(Map<String, Object> row) {
        String nom = String.valueOf(row.get("nom"));
        String[] parts = nom.trim().split("\\s+", 2);
        String role = String.valueOf(row.get("role"));
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id", ((Number) row.get("id")).intValue());
        user.put("firstName", parts.length > 0 ? parts[0] : "");
        user.put("lastName", parts.length > 1 ? parts[1] : "");
        user.put("name", nom);
        user.put("nom", nom);
        user.put("email", row.get("email"));
        user.put("role", "eleve".equals(role) ? "student" : "moniteur".equals(role) ? "monitor" : "admin");
        user.put("serverRole", role);
        user.put("phone", row.get("telephone") == null ? "" : row.get("telephone"));
        user.put("telephone", row.get("telephone"));
        user.put("address", row.get("adresse") == null ? "" : row.get("adresse"));
        user.put("adresse", row.get("adresse"));
        user.put("photo", row.get("photo_profil") == null ? "" : row.get("photo_profil"));
        user.put("avatar", row.get("photo_profil") == null ? "" : row.get("photo_profil"));
        user.put("formation", row.get("formation_nom") == null ? "Permis B" : row.get("formation_nom"));
        user.put("formation_nom", row.get("formation_nom"));
        user.put("voiture", row.get("voiture") == null ? "" : row.get("voiture"));
        user.put("heuresEffectuees", row.get("heures_effectuees") == null ? 0 : row.get("heures_effectuees"));
        user.put("heures_effectuees", row.get("heures_effectuees"));
        user.put("heuresTotales", row.get("heures_totales") == null ? 0 : row.get("heures_totales"));
        user.put("heures_totales", row.get("heures_totales"));
        user.put("id_formation", row.get("id_formation"));
        user.put("date_creation", row.get("date_creation"));
        return user;
    }

    private int currentId(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        return claims.get("id", Number.class).intValue();
    }

    private void requireSelfOrAdmin(Authentication authentication, int id) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        String role = claims.get("role", String.class);
        int current = claims.get("id", Number.class).intValue();
        if (!"admin".equals(role) && current != id) throw ApiException.forbidden("Acces refuse.");
    }

    private void requireAdmin(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        if (!"admin".equals(claims.get("role", String.class)))
            throw ApiException.forbidden("Acces reserve a l'administrateur.");
    }

    private int parseInt(Object value, int fallback) {
        try { return Integer.parseInt(String.valueOf(value)); }
        catch (Exception ignored) { return fallback; }
    }
}
