package com.laptopshop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "productId không được để trống")
    private Long productId;
}
