package com.bookfair.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@bookfair.lk}")
    private String fromEmail;
    
    public JavaMailSender getMailSender() {
        return mailSender;
    }
    
    public void sendReservationConfirmation(String toEmail, String businessName, 
                                           String stallCode, String stallSize, String qrCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Colombo International Book Fair - Stall Reservation Confirmed");
            
            StringBuilder html = new StringBuilder();
            html.append("<html><body style='font-family: Arial, sans-serif;'>");
            html.append("<h2>Stall Reservation Confirmation</h2>");
            html.append("<p>Dear ").append(businessName).append("</p>");
            html.append("<p>Your stall reservation at the Colombo International Book Fair has been confirmed.</p>");
            html.append("<div style='background: #f5f5f5; padding: 20px; margin: 20px 0;'>");
            html.append("<h3>Reservation Details:</h3>");
            html.append("<p><strong>Business Name:</strong> ").append(businessName).append("</p>");
            html.append("<p><strong>Stall Code:</strong> ").append(stallCode).append("</p>");
            html.append("<p><strong>Stall Size:</strong> ").append(stallSize).append("</p>");
            html.append("</div>");
            html.append("<p>Your QR code pass is shown below. Please present this at the entrance.</p>");
            html.append("<img src='data:image/png;base64,").append(qrCode).append("' alt='QR Code' style='margin-top: 20px;'/>");
            html.append("<p style='margin-top: 30px;'>Best regards,<br/>Colombo International Book Fair Team</p>");
            html.append("</body></html>");
            
            helper.setText(html.toString(), true);
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}