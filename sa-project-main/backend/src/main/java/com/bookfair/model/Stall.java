package com.bookfair.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stalls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stall {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String stallCode;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private Boolean isAvailable;
    
    @Column(nullable = false)
    private Integer rowPosition;
    
    @Column(nullable = false)
    private Integer columnPosition;
    
    @OneToOne(mappedBy = "stall", cascade = CascadeType.ALL)
    private Reservation reservation;
    
    public enum StallSize {
        SMALL, MEDIUM, LARGE
    }
}