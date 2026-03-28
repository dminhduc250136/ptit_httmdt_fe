package com.laptopshop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDTO {

    private Integer id;
    private String name;
    private String slug;
    private Long productCount;
}
