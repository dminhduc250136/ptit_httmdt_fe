package com.laptopshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotEmpty(message = "Danh sách sản phẩm không được trống")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Thông tin giao hàng không được trống")
    @Valid
    private ShippingInfo shippingAddress;

    @NotBlank(message = "Phương thức thanh toán không được trống")
    private String paymentMethod;

    private String note;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull
        @Min(1)
        @Max(10)
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingInfo {
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
        @Size(min = 10, message = "Địa chỉ phải ít nhất 10 ký tự")
        private String address;
    }
}
