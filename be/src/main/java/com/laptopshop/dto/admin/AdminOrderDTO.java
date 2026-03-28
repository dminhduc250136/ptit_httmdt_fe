package com.laptopshop.dto.admin;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOrderDTO {

    private Long id;
    private String orderCode;
    private Long total;
    private String orderStatus;
    private String paymentStatus;
    private String paymentMethod;
    private String customerName;
    private String customerEmail;
    private Integer itemCount;
    private LocalDateTime createdAt;
}
