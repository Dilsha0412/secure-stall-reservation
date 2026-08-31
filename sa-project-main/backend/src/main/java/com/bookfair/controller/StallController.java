package com.bookfair.controller;

import com.bookfair.dto.StallDTO;
import com.bookfair.service.StallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stalls")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class StallController {
    
    @Autowired
    private StallService stallService;
    
    @GetMapping
    public ResponseEntity<List<StallDTO>> getAllStalls() {
        return ResponseEntity.ok(stallService.getAllStalls());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<StallDTO>> getAvailableStalls() {
        return ResponseEntity.ok(stallService.getAvailableStalls());
    }
}