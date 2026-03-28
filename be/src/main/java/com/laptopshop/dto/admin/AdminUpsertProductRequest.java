package com.laptopshop.dto.admin;

import com.laptopshop.entity.ProductSpecs;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpsertProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String slug;

    @NotNull(message = "Thiếu brandId")
    private Integer brandId;

    @NotNull(message = "Thiếu categoryId")
    private Integer categoryId;

    @NotNull(message = "Giá bán không được để trống")
    @Min(value = 1, message = "Giá bán phải lớn hơn 0")
    private Long price;

    @NotNull(message = "Giá gốc không được để trống")
    @Min(value = 1, message = "Giá gốc phải lớn hơn 0")
    private Long originalPrice;

    @NotBlank(message = "Ảnh đại diện không được để trống")
    private String image;

    private String badge;

    private ProductSpecs specs;

    private String description;

    @NotNull(message = "Số lượng tồn không được để trống")
    @Min(value = 0, message = "Số lượng tồn không hợp lệ")
    private Integer stockQuantity;

    private Boolean isActive;
}
