package com.laptopshop.dto;

import com.laptopshop.entity.ProductSpecs;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {

    private Long id;
    private CartProductDTO product;
    private Integer quantity;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CartProductDTO {
        private Long id;
        private String name;
        private String slug;
        private Long price;
        private Long originalPrice;
        private String image;
        private ProductSpecs specs;
        private Integer stockQuantity;
    }
}
