package com.laptopshop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartRequest {

    @NotNull(message = "quantity không được để trống")
    @Min(value = 0, message = "quantity tối thiểu là 0")
    @Max(value = 10, message = "quantity tối đa là 10")
    private Integer quantity;
}
