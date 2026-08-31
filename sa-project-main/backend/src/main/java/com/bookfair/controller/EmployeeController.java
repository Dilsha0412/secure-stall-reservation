package com.bookfair.controller;

import com.bookfair.dto.ReservationResponse;
import com.bookfair.dto.StallDTO;
import com.bookfair.service.ReservationService;
import com.bookfair.service.StallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "http://localhost:3001")
public class EmployeeController {
    
    @Autowired
    private StallService stallService;
    
    @Autowired
    private ReservationService reservationService;
    
    @GetMapping("/stalls")
    public ResponseEntity<List<StallDTO>> getAllStalls() {
        return ResponseEntity.ok(stallService.getAllStalls());
    }
    
    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }
}