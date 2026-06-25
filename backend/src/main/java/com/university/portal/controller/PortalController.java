package com.university.portal.controller;

import com.university.portal.model.ApplicationEntity;
import com.university.portal.model.DocumentRecord;
import com.university.portal.model.UserEntity;
import com.university.portal.service.PortalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortalController {
    private final PortalService portalService;

    public PortalController(PortalService portalService) {
        this.portalService = portalService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserEntity user) {
        return ResponseEntity.ok(portalService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        return portalService.login(email, password)
                .map(user -> ResponseEntity.ok(Map.of("message", "Login successful", "userId", user.getId())))
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("message", "Invalid credentials")));
    }

    @PostMapping("/applications")
    public ResponseEntity<ApplicationEntity> submitApplication(@RequestBody ApplicationEntity application) {
        return ResponseEntity.status(HttpStatus.CREATED).body(portalService.submitApplication(application));
    }

    @GetMapping("/applications/{userId}")
    public ResponseEntity<List<ApplicationEntity>> getApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(portalService.getApplications(userId));
    }

    @PostMapping("/documents")
    public ResponseEntity<DocumentRecord> saveDocument(@RequestBody DocumentRecord document) {
        return ResponseEntity.ok(portalService.saveDocument(document));
    }

    @GetMapping("/documents/{userId}")
    public ResponseEntity<List<DocumentRecord>> getDocuments(@PathVariable Long userId) {
        return ResponseEntity.ok(portalService.getDocuments(userId));
    }
}
