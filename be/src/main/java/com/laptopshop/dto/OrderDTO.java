package com.laptopshop.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private String orderCode;
    private Long subtotal;
    private Long shippingFee;
    private Long total;
    private String paymentMethod;
    private String paymentStatus;
    private String orderStatus;
    private String note;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
    private ShippingAddressDTO shippingAddress;
}
