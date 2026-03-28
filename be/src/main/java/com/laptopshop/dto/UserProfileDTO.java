package com.laptopshop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String role;
}
