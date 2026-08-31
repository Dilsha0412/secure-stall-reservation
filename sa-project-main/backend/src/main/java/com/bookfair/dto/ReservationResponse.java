package com.bookfair.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {
    private Long id;
    private String username;
    private String vendorName;
    private String businessName;
    private String contactPhone;
    private String eventName;
    private LocalDate reservationDate;
    private String stallType;
    private String preferredStallSize;
    private Integer numberOfStalls;
    private String businessCategory;
    private String specialRequirements;
    private String status;
    private String stallCode;
    private String qrCode;
    private LocalDateTime createdAt;
}