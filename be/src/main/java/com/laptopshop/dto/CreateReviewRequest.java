package com.laptopshop.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank(message = "Tiêu đề không được trống")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Nội dung không được trống")
    private String content;

    private List<String> images;
}
