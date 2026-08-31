package com.bookfair.config;

import com.bookfair.model.User;
import com.bookfair.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class EmployeeInitializer {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Bean
    public CommandLineRunner initEmployee() {
        return args -> {
            if (!userRepository.existsByEmail("organizer@bookfair.lk")) {
                User organizer = User.builder()
                    .username("organizer")
                    .email("organizer@bookfair.lk")
                    .password(passwordEncoder.encode("organizer123"))
                    .businessName("Exhibition Organizing Authority")
                    .contactPerson("Exhibition Organizer")
                    .phone("+94 11 2345678")
                    .address("Colombo, Sri Lanka")
                    .userType(User.UserType.ORGANIZER)
                    .build();
                userRepository.save(organizer);
                System.out.println("Default organizer account created: organizer@bookfair.lk");
            }
            if (!userRepository.existsByEmail("employee@bookfair.lk")) {
                User employee = User.builder()
                    .username("employee")
                    .email("employee@bookfair.lk")
                    .password(passwordEncoder.encode("employee123"))
                    .businessName("Book Fair Organizers")
                    .contactPerson("Admin Employee")
                    .phone("+94 11 2345678")
                    .address("Colombo, Sri Lanka")
                    .userType(User.UserType.EMPLOYEE)
                    .build();
                userRepository.save(employee);
                System.out.println("Default employee account created: employee@bookfair.lk");
            }
        };
    }
}