package com.laptopshop.dto.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateOrderRequest {

    private String orderStatus;
    private String paymentStatus;
}
