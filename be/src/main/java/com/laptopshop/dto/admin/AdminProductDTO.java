package com.laptopshop.dto.admin;

import com.laptopshop.entity.ProductSpecs;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductDTO {

    private Long id;
    private String name;
    private String slug;
    private Integer brandId;
    private String brandName;
    private Integer categoryId;
    private String categoryName;
    private Long price;
    private Long originalPrice;
    private String image;
    private String badge;
    private ProductSpecs specs;
    private String description;
    private Integer stockQuantity;
    private Integer soldCount;
    private Integer reviewCount;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
