package com.projet.web.controller;

import com.projet.web.exception.ApiException;
import io.jsonwebtoken.Claims;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/monitors")
public class MonitorController {
    private final JdbcTemplate jdbc;

    public MonitorController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/me/assigned")
    public Map<String, Object> assigned(Authentication authentication) {
        Claims claims = requireClaims(authentication);
        int studentId = claims.get("id", Number.class).intValue();
        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT u.id,u.nom,u.email,u.telephone,u.photo_profil,f.nom AS formation_nom,m.voiture " +
            "FROM eleves e JOIN formations f ON f.id=e.id_formation " +
            "JOIN moniteurs m ON m.id_formation=e.id_formation JOIN utilisateurs u ON u.id=m.id " +
            "LEFT JOIN reservations r ON r.moniteur_id=m.id AND r.statut='reservee' " +
            "WHERE e.id=? GROUP BY u.id,u.nom,u.email,u.telephone,u.photo_profil,f.nom,m.voiture " +
            "ORDER BY COUNT(r.id),u.id LIMIT 1", studentId);
        if (rows.isEmpty()) throw ApiException.notFound("Aucun moniteur affecte.");
        Map<String, Object> row = rows.get(0);
        String nom = String.valueOf(row.get("nom"));
        String[] parts = nom.trim().split("\\s+", 2);
        Map<String, Object> result = new java.util.LinkedHashMap<>(row);
        result.put("firstName", parts.length > 0 ? parts[0] : "");
        result.put("lastName", parts.length > 1 ? parts[1] : "");
        result.put("phone", row.get("telephone"));
        result.put("photo", row.get("photo_profil"));
        result.put("formation", row.get("formation_nom"));
        return result;
    }

    private Claims requireClaims(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        return claims;
    }
}
