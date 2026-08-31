package com.bookfair.config;

import com.bookfair.service.StallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    
    @Autowired
    private StallService stallService;
    
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            stallService.initializeStalls();
        };
    }
}