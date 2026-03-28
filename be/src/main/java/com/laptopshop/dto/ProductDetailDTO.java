package com.laptopshop.dto;

import com.laptopshop.entity.ProductSpecs;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailDTO {

    private Long id;
    private String name;
    private String slug;
    private Map<String, Object> brand;
    private Map<String, Object> category;
    private Long price;
    private Long originalPrice;
    private Integer discountPercent;
    private String image;
    private List<String> gallery;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer soldCount;
    private String badge;
    private ProductSpecs specs;
    private List<ProductSpecDTO> detailedSpecs;
    private String description;
    private List<String> gifts;
    private Integer stockQuantity;
    private Boolean isFlashSale;
}
