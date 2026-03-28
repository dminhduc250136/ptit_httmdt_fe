package com.laptopshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 3, max = 100, message = "Họ tên phải từ 3 đến 100 ký tự")
    private String fullName;

    @Size(max = 20, message = "Số điện thoại không hợp lệ")
    private String phone;

    @Size(max = 500, message = "Ảnh đại diện không hợp lệ")
    private String avatarUrl;
}
