package com.laptopshop.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderListDTO {

    private Long id;
    private String orderCode;
    private Long total;
    private String orderStatus;
    private String paymentMethod;
    private String paymentStatus;
    private Integer itemCount;
    private LocalDateTime createdAt;
}
