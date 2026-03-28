package com.laptopshop.dto.admin;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
