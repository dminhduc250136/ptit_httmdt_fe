package com.laptopshop.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {

    private List<CartItemDTO> items;
    private Integer totalItems;
    private Long totalPrice;
}
