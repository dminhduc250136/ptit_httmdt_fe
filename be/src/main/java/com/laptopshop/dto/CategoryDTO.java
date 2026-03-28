package com.laptopshop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {

    private Integer id;
    private String name;
    private String slug;
    private String icon;
    private String description;
    private Long productCount;
}
