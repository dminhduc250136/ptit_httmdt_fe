package com.laptopshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddressDTO {

    private Long id;

    @NotBlank(message = "Họ tên không được trống")
    @Size(min = 3)
    private String fullName;

    @NotBlank(message = "Số điện thoại không được trống")
    @Pattern(regexp = "^0[3-9]\\d{8}$")
    private String phone;

    private String email;

    @NotBlank(message = "Tỉnh/Thành không được trống")
    private String province;

    @NotBlank(message = "Quận/Huyện không được trống")
    private String district;

    @NotBlank(message = "Địa chỉ không được trống")
    @Size(min = 10)
    private String address;

    private Boolean isDefault;
}
