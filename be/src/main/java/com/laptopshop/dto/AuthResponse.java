package com.laptopshop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String token;
}
