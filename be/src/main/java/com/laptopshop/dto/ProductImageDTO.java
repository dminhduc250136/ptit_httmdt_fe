package com.laptopshop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDTO {

    private String imageUrl;
    private Integer displayOrder;
    private Boolean isPrimary;
}
