package com.bookfair.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {
    @NotBlank(message = "Event Name is required")
    private String eventName;

    @NotNull(message = "Reservation Date is required")
    @FutureOrPresent(message = "Reservation Date must be on or after the current date")
    private LocalDate reservationDate;

    @NotBlank(message = "Stall Type is required")
    private String stallType;

    @NotBlank(message = "Preferred Stall Size is required")
    private String preferredStallSize;

    @NotNull(message = "Number of stalls is required")
    @Min(value = 1, message = "At least 1 stall must be requested")
    @Max(value = 5, message = "Maximum 5 stalls per reservation request")
    private Integer numberOfStalls;

    @NotBlank(message = "Business Category is required")
    private String businessCategory;

    @Size(max = 1000, message = "Special requirements text is too long")
    private String specialRequirements;
}