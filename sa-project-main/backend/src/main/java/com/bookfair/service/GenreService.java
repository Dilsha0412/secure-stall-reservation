package com.bookfair.service;

import com.bookfair.dto.GenreRequest;
import com.bookfair.model.Genre;
import com.bookfair.model.User;
import com.bookfair.repository.GenreRepository;
import com.bookfair.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenreService {
    
    @Autowired
    private GenreRepository genreRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void addGenre(String email, GenreRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Genre genre = Genre.builder()
            .genreName(request.getGenreName())
            .user(user)
            .build();
        
        genreRepository.save(genre);
    }
    
    public List<String> getUserGenres(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return genreRepository.findByUserId(user.getId())
            .stream()
            .map(Genre::getGenreName)
            .collect(Collectors.toList());
    }
}