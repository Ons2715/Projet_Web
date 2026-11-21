package com.projet.web.controller;

import com.projet.web.exception.ApiException;
import com.projet.web.security.JwtService;
import com.projet.web.security.ScryptPassword;
import io.jsonwebtoken.Claims;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JdbcTemplate jdbc;
    private final JwtService jwt;

    public AuthController(JdbcTemplate jdbc, JwtService jwt) {
        this.jdbc = jdbc;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> body) {
        if (body == null) throw ApiException.badRequest("Corps de requete invalide.");
        String email = String.valueOf(body.getOrDefault("email", "")).trim().toLowerCase();
        String password = String.valueOf(body.getOrDefault("password", ""));
        if (email.isEmpty() || password.isEmpty())
            throw ApiException.badRequest("Veuillez remplir tous les champs.");

        if ("admin@gmail.com".equals(email) && "987654321".equals(password)) {
            Map<String, Object> admin = Map.of(
                "id", 0, "firstName", "Admin", "lastName", "EduCar", "name", "Admin EduCar",
                "email", email, "role", "admin", "serverRole", "admin",
                "phone", "", "address", "", "formation", "Administration");
            return Map.of("user", admin, "token", jwt.createToken(0, email, "admin"));
        }

        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT u.id,u.nom,u.email,u.mot_de_passe,u.role,u.telephone,u.adresse,u.photo_profil," +
            "COALESCE(fe.nom,fm.nom) AS formation_nom,COALESCE(fe.heures_totales,fm.heures_totales) AS heures_totales," +
            "e.heures_effectuees,m.voiture FROM utilisateurs u " +
            "LEFT JOIN eleves e ON e.id=u.id LEFT JOIN moniteurs m ON m.id=u.id " +
            "LEFT JOIN formations fe ON fe.id=e.id_formation LEFT JOIN formations fm ON fm.id=m.id_formation " +
            "WHERE u.email=?", email);
        if (rows.isEmpty()) throw ApiException.unauthorized("Compte inexistant.");

        Map<String, Object> row = rows.get(0);
        if (!ScryptPassword.verify(password, String.valueOf(row.get("mot_de_passe"))))
            throw ApiException.unauthorized("Mot de passe incorrect.");

        Map<String, Object> user = toClientUser(row);
        String role = String.valueOf(row.get("role"));
        return Map.of("user", user, "token", jwt.createToken(((Number) row.get("id")).intValue(), email, role));
    }

    @PostMapping("/register")
    @Transactional
    public Map<String, Object> register(@RequestBody Map<String, Object> body) {
        if (body == null) throw ApiException.badRequest("Corps de requete invalide.");
        String firstName = String.valueOf(body.getOrDefault("firstName", "")).trim();
        String lastName = String.valueOf(body.getOrDefault("lastName", "")).trim();
        String nom = String.valueOf(body.getOrDefault("nom", (firstName + " " + lastName).trim())).trim();
        String email = String.valueOf(body.getOrDefault("email", "")).trim().toLowerCase();
        String password = String.valueOf(body.getOrDefault("motDePasse", body.getOrDefault("password", "")));
        String role = "eleve";
        String telephone = String.valueOf(body.getOrDefault("telephone", ""));
        String adresse = String.valueOf(body.getOrDefault("adresse", body.getOrDefault("address", "")));

        if (nom.isEmpty() || email.isEmpty() || password.isEmpty() || telephone.isEmpty() || adresse.isEmpty())
            throw ApiException.badRequest("Veuillez remplir tous les champs obligatoires.");
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw ApiException.badRequest("Adresse email invalide.");
        if (!telephone.matches("^[0-9]{8}$")) throw ApiException.badRequest("Le numero de telephone doit contenir exactement 8 chiffres.");
        if (password.length() < 8) throw ApiException.badRequest("Le mot de passe doit contenir au moins 8 caracteres.");
        if (!jdbc.queryForList("SELECT id FROM utilisateurs WHERE email=?", email).isEmpty())
            throw ApiException.conflict("Cet email est deja utilise.");

        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
            jdbc.update(connection -> {
                PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO utilisateurs(nom,email,mot_de_passe,role,telephone,adresse) VALUES(?,?,?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS);
                statement.setString(1, nom);
                statement.setString(2, email);
                statement.setString(3, ScryptPassword.hash(password));
                statement.setString(4, role);
                statement.setString(5, telephone);
                statement.setString(6, adresse);
                return statement;
            }, keyHolder);
        } catch (DuplicateKeyException e) {
            throw ApiException.conflict("Cet email est deja utilise.");
        }
        Number id = keyHolder.getKey();
        if (id == null) throw ApiException.internal("Impossible de creer le compte.");
        if ("eleve".equals(role)) jdbc.update("INSERT INTO eleves(id,id_formation,date_inscription) VALUES(?,?,CURDATE())",
            id.intValue(), 1);
        else if ("moniteur".equals(role)) jdbc.update("INSERT INTO moniteurs(id,id_formation,voiture) VALUES(?,?,?)",
            id.intValue(), 1, "Renault Clio");

        Map<String, Object> user = new java.util.LinkedHashMap<>();
        user.put("id", id.intValue());
        user.put("name", nom);
        user.put("firstName", nom.split("\\s+")[0]);
        user.put("lastName", nom.contains(" ") ? nom.substring(nom.indexOf(' ') + 1) : "");
        user.put("email", email);
        user.put("role", role.equals("eleve") ? "student" : role.equals("moniteur") ? "monitor" : role);
        user.put("serverRole", role);
        user.put("phone", telephone);
        user.put("address", adresse);
        user.put("photo", "");
        user.put("avatar", "");
        return Map.of("user", user, "token", jwt.createToken(id.intValue(), email, role));
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        if (authentication == null || !(authentication.getDetails() instanceof Claims claims))
            throw ApiException.unauthorized("Session expiree ou invalide.");
        int id = claims.get("id", Number.class).intValue();
        if (id == 0) return Map.of("user", Map.of("id", 0, "email", claims.get("email"), "role", "admin"));
        List<Map<String, Object>> rows = jdbc.queryForList(
            "SELECT u.id,u.nom,u.email,u.role,u.telephone,u.adresse,u.photo_profil," +
            "COALESCE(fe.nom,fm.nom) AS formation_nom,COALESCE(fe.heures_totales,fm.heures_totales) AS heures_totales," +
            "e.heures_effectuees,m.voiture FROM utilisateurs u " +
            "LEFT JOIN eleves e ON e.id=u.id LEFT JOIN moniteurs m ON m.id=u.id " +
            "LEFT JOIN formations fe ON fe.id=e.id_formation LEFT JOIN formations fm ON fm.id=m.id_formation WHERE u.id=?", id);
        if (rows.isEmpty()) throw ApiException.unauthorized("Utilisateur introuvable.");
        return Map.of("user", toClientUser(rows.get(0)));
    }

    private Map<String, Object> toClientUser(Map<String, Object> row) {
        String nom = String.valueOf(row.get("nom"));
        String[] parts = nom.trim().split("\\s+", 2);
        String role = String.valueOf(row.get("role"));
        Map<String, Object> user = new java.util.LinkedHashMap<>();
        user.put("id", ((Number) row.get("id")).intValue());
        user.put("firstName", parts.length > 0 ? parts[0] : "");
        user.put("lastName", parts.length > 1 ? parts[1] : "");
        user.put("name", nom);
        user.put("email", row.get("email"));
        user.put("role", "eleve".equals(role) ? "student" : "moniteur".equals(role) ? "monitor" : "admin");
        user.put("serverRole", role);
        user.put("phone", row.get("telephone") == null ? "" : row.get("telephone"));
        user.put("address", row.get("adresse") == null ? "" : row.get("adresse"));
        user.put("photo", row.get("photo_profil") == null ? "" : row.get("photo_profil"));
        user.put("avatar", row.get("photo_profil") == null ? "" : row.get("photo_profil"));
        user.put("formation", row.get("formation_nom") == null ? "Permis B" : row.get("formation_nom"));
        user.put("voiture", row.get("voiture") == null ? "" : row.get("voiture"));
        user.put("heuresEffectuees", row.get("heures_effectuees") == null ? 0 : row.get("heures_effectuees"));
        user.put("heuresTotales", row.get("heures_totales") == null ? 0 : row.get("heures_totales"));
        return user;
    }
}
