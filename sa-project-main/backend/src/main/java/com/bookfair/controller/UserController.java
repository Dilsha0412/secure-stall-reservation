package com.bookfair.controller;

import com.bookfair.dto.UserProfileDTO;
import com.bookfair.model.User;
import com.bookfair.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        UserProfileDTO profile = UserProfileDTO.builder()
            .username(user.getUsername() != null ? user.getUsername() : user.getEmail().split("@")[0])
            .name(user.getContactPerson())
            .email(user.getEmail())
            .phone(user.getPhone())
            .businessName(user.getBusinessName())
            .address(user.getAddress())
            .userType(user.getUserType().name())
            .build();

        return ResponseEntity.ok(profile);
    }
}
