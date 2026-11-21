package com.projet.web.controller;

import com.projet.web.exception.ApiException;
import io.jsonwebtoken.Claims;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final JdbcTemplate jdbc;

    public StudentController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/monitor/me")
    public List<Map<String, Object>> forMonitor(Authentication authentication) {
        Claims claims = requireClaims(authentication);
        if (!"moniteur".equals(claims.get("role", String.class)))
            throw ApiException.forbidden("Acces reserve aux moniteurs.");
        int monitorId = claims.get("id", Number.class).intValue();
        return jdbc.queryForList(
            "SELECT DISTINCT u.id,u.nom,u.email,u.telephone,u.photo_profil AS photo,e.heures_effectuees,e.date_inscription," +
            "f.nom AS formation_nom,f.heures_totales " +
            "FROM reservations r JOIN eleves e ON e.id=r.eleve_id " +
            "JOIN utilisateurs u ON u.id=e.id JOIN formations f ON f.id=e.id_formation " +
            "WHERE r.moniteur_id=? AND r.statut<>'annulee' ORDER BY u.nom", monitorId);
    }

    private Claims requireClaims(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree.");
        return claims;
    }
}
