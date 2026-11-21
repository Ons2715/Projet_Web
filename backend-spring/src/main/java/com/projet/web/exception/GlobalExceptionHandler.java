package com.projet.web.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> api(ApiException e) {
        return ResponseEntity.status(e.getStatus())
                .body(Map.of("success", false, "message", e.getMessage(), "error", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + " : " + f.getDefaultMessage())
                .findFirst().orElse("Données invalides");
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", msg, "error", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> other(Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Erreur serveur", "error", "Erreur serveur"));
    }
}