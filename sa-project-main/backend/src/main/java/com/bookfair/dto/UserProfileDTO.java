package com.bookfair.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private String username;
    private String name;
    private String email;
    private String phone;
    private String businessName;
    private String address;
    private String userType;
}
