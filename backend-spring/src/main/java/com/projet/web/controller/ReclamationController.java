package com.projet.web.controller;

import com.projet.web.exception.ApiException;
import io.jsonwebtoken.Claims;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclamations")
public class ReclamationController {
    private final JdbcTemplate jdbc;

    public ReclamationController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public List<Map<String, Object>> all(Authentication authentication) {
        requireAdmin(authentication);
        return jdbc.queryForList(
            "SELECT r.*,u.nom AS utilisateur_nom,u.email AS utilisateur_email," +
            "u.telephone AS utilisateur_telephone,mu.nom AS moniteur_nom," +
            "mu.telephone AS moniteur_telephone FROM reclamations r " +
            "LEFT JOIN utilisateurs u ON u.id=r.utilisateur_id " +
            "LEFT JOIN reservations b ON r.reservation_ref LIKE 'booking#%' " +
            "AND b.id=CAST(SUBSTRING_INDEX(r.reservation_ref,'#',-1) AS UNSIGNED) " +
            "LEFT JOIN utilisateurs mu ON mu.id=b.moniteur_id ORDER BY r.date_creation DESC");
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body, Authentication authentication) {
        Claims claims = requireClaims(authentication);
        String reason = String.valueOf(body.getOrDefault("raison", "")).trim();
        if (reason.isEmpty()) throw ApiException.badRequest("Veuillez saisir la raison.");
        Integer userId = body.get("utilisateurId") == null
            ? claims.get("id", Number.class).intValue()
            : parseInt(body.get("utilisateurId"));
        String reference = String.valueOf(body.getOrDefault("reservationRef", ""));
        String pieceName = String.valueOf(body.getOrDefault("pieceNom", ""));
        String pieceType = String.valueOf(body.getOrDefault("pieceType", ""));
        String pieceData = String.valueOf(body.getOrDefault("pieceData", ""));
        jdbc.update(
            "INSERT INTO reclamations(utilisateur_id,reservation_ref,raison,piece_nom,piece_type,piece_data,statut) " +
            "VALUES(?,?,?,?,?, ?, 'nouvelle')",
            userId, reference, reason,
            pieceName.isEmpty() ? null : pieceName,
            pieceType.isEmpty() ? null : pieceType,
            pieceData.isEmpty() ? null : pieceData);
        Number id = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Number.class);
        return Map.of("id", id.intValue(), "success", true);
    }

    @PatchMapping("/{id}/traiter")
    public Map<String, Object> treat(@PathVariable int id, Authentication authentication) {
        requireAdmin(authentication);
        if (jdbc.update("UPDATE reclamations SET statut='traitee' WHERE id=?", id) == 0)
            throw ApiException.notFound("Reclamation introuvable.");
        return Map.of("success", true);
    }

    private Integer parseInt(Object value) {
        try { return Integer.valueOf(String.valueOf(value)); }
        catch (Exception ignored) { return null; }
    }

    private Claims requireClaims(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        return claims;
    }

    private void requireAdmin(Authentication authentication) {
        Claims claims = requireClaims(authentication);
        if (!"admin".equals(claims.get("role", String.class)))
            throw ApiException.forbidden("Acces reserve a l'administrateur.");
    }
}
