package com.bookfair.controller;

import com.bookfair.dto.GenreRequest;
import com.bookfair.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin(origins = "http://localhost:3000")
public class GenreController {
    
    @Autowired
    private GenreService genreService;
    
    @PostMapping
    public ResponseEntity<Void> addGenre(@RequestBody GenreRequest request, Authentication authentication) {
        String email = authentication.getName();
        genreService.addGenre(email, request);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/my-genres")
    public ResponseEntity<List<String>> getMyGenres(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(genreService.getUserGenres(email));
    }
}