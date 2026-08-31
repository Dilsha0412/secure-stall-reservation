package com.bookfair.service;

import com.bookfair.dto.ReservationRequest;
import com.bookfair.dto.ReservationResponse;
import com.bookfair.model.Reservation;
import com.bookfair.model.User;
import com.bookfair.repository.ReservationRepository;
import com.bookfair.repository.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    private static final int MAX_RESERVATIONS_PER_USER = 5;
    
    @Transactional
    public ReservationResponse createReservation(String email, ReservationRequest request) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        
        // Date validation: Reservation date must be on or after current date
        if (request.getReservationDate() == null || request.getReservationDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Reservation Date must be on or after the current date");
        }

        long existingCount = reservationRepository.countByUserId(user.getId());
        if (existingCount >= MAX_RESERVATIONS_PER_USER) {
            throw new IllegalStateException("Maximum " + MAX_RESERVATIONS_PER_USER + " reservation requests allowed per vendor");
        }

        String username = user.getUsername() != null ? user.getUsername() : user.getEmail().split("@")[0];
        String qrCode = generateQRCode(user.getBusinessName(), request.getEventName(), username);

        Reservation reservation = Reservation.builder()
            .user(user)
            .username(username)
            .eventName(request.getEventName())
            .reservationDate(request.getReservationDate())
            .stallType(request.getStallType())
            .preferredStallSize(request.getPreferredStallSize())
            .numberOfStalls(request.getNumberOfStalls())
            .businessCategory(request.getBusinessCategory())
            .specialRequirements(request.getSpecialRequirements())
            .status(Reservation.ReservationStatus.PENDING)
            .qrCode(qrCode)
            .confirmationEmail(user.getEmail())
            .build();

        reservationRepository.save(reservation);

        try {
            emailService.sendReservationConfirmation(
                user.getEmail(),
                user.getBusinessName(),
                request.getEventName(),
                request.getPreferredStallSize(),
                qrCode
            );
        } catch (Exception e) {
            // Log email failure without breaking reservation creation
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }

        return mapToResponse(reservation);
    }
    
    private String generateQRCode(String businessName, String eventName, String username) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            String data = String.format("EXHIBITION:%s:%s:%s:%d", eventName, businessName, username, System.currentTimeMillis());
            
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            
            BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 300, 300, hints);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            return Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (Exception e) {
            return "QR_GENERATION_FAILED";
        }
    }
    
    public List<ReservationResponse> getUserReservations(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse updateStatus(Long reservationId, String statusStr) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + reservationId));

        Reservation.ReservationStatus newStatus = Reservation.ReservationStatus.valueOf(statusStr.toUpperCase());
        reservation.setStatus(newStatus);
        reservationRepository.save(reservation);

        return mapToResponse(reservation);
    }
    
    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
            .id(reservation.getId())
            .username(reservation.getUsername())
            .vendorName(reservation.getUser().getContactPerson())
            .businessName(reservation.getUser().getBusinessName())
            .contactPhone(reservation.getUser().getPhone())
            .eventName(reservation.getEventName())
            .reservationDate(reservation.getReservationDate())
            .stallType(reservation.getStallType())
            .preferredStallSize(reservation.getPreferredStallSize())
            .numberOfStalls(reservation.getNumberOfStalls())
            .businessCategory(reservation.getBusinessCategory())
            .specialRequirements(reservation.getSpecialRequirements())
            .status(reservation.getStatus() != null ? reservation.getStatus().name() : "PENDING")
            .stallCode(reservation.getStall() != null ? reservation.getStall().getStallCode() : "N/A")
            .qrCode(reservation.getQrCode())
            .createdAt(reservation.getCreatedAt())
            .build();
    }
}