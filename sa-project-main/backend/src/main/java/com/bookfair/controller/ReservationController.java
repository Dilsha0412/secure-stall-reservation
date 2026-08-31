package com.bookfair.controller;

import com.bookfair.dto.ReservationRequest;
import com.bookfair.dto.ReservationResponse;
import com.bookfair.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reservationService.createReservation(email, request));
    }
    
    @GetMapping("/my-reservations")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reservationService.getUserReservations(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reservationService.getReservationByIdForUser(id, email));
    }

    @GetMapping("/organizer")
    public ResponseEntity<List<ReservationResponse>> getAllReservationsForOrganizer() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReservationResponse> updateReservationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null) {
            throw new IllegalArgumentException("Status field is required");
        }
        return ResponseEntity.ok(reservationService.updateStatus(id, status));
    }
}