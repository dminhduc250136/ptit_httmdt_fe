package com.laptopshop.dto;

import com.laptopshop.entity.ProductSpecs;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleDTO {

    private Integer id;
    private String title;
    private String startTime;
    private String endTime;
    private List<FlashSaleProductDTO> products;
}
