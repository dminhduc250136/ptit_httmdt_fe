package com.laptopshop.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest {

    private String fullName;
    private String phone;
    private String role;
    private Boolean isActive;
}
