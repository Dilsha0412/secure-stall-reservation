package com.bookfair.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String eventName;

    @Column(nullable = false)
    private LocalDate reservationDate;

    @Column(nullable = false)
    private String stallType;

    @Column(nullable = false)
    private String preferredStallSize;

    @Column(nullable = false)
    private Integer numberOfStalls;

    @Column(nullable = false)
    private String businessCategory;

    @Column(columnDefinition = "TEXT")
    private String specialRequirements;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stall_id")
    private Stall stall;
    
    @Column(columnDefinition = "TEXT")
    private String qrCode;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private String confirmationEmail;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ReservationStatus.PENDING;
        }
    }

    public enum ReservationStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}