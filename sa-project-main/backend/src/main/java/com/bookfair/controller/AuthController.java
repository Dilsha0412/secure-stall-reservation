package com.bookfair.controller;

import com.bookfair.dto.*;
import com.bookfair.model.User;
import com.bookfair.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @Value("${oidc.logout-url:https://dev-bookfair.us.auth0.com/v2/logout}")
    private String idpLogoutUrl;

    @Value("${oidc.client-id:bookfair-app-client-id}")
    private String oidcClientId;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request, User.UserType.VENDOR));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/employee/login")
    public ResponseEntity<AuthResponse> employeeLogin(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        if (!"EMPLOYEE".equals(response.getUserType()) && !"ORGANIZER".equals(response.getUserType())) {
            throw new RuntimeException("Access denied: Not an organizer/employee account");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        response.put("idpLogoutUrl", idpLogoutUrl + "?client_id=" + oidcClientId + "&returnTo=http://localhost:3000/login");
        return ResponseEntity.ok(response);
    }
}