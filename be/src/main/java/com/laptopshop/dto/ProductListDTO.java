package com.laptopshop.dto;

import com.laptopshop.entity.ProductSpecs;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductListDTO {

    private Long id;
    private String name;
    private String slug;
    private String brand;
    private String category;
    private Long price;
    private Long originalPrice;
    private Integer discountPercent;
    private String image;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer soldCount;
    private String badge;
    private ProductSpecs specs;
}
