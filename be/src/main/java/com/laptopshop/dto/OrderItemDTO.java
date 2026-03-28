package com.laptopshop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long productId;
    private String productName;
    private String productImage;
    private Long price;
    private Long originalPrice;
    private Integer quantity;
    private Long subtotal;
}
