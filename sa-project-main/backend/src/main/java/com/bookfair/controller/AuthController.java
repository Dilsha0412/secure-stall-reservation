package com.bookfair.controller;

import com.bookfair.dto.*;
import com.bookfair.model.User;
import com.bookfair.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
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
        if (!"EMPLOYEE".equals(response.getUserType())) {
            throw new RuntimeException("Access denied: Not an employee account");
        }
        return ResponseEntity.ok(response);
    }
}