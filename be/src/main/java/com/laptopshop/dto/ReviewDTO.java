package com.laptopshop.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {

    private Long id;
    private Integer rating;
    private String title;
    private String content;
    private Integer helpfulCount;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private String userName;
    private String userAvatar;
    private List<String> images;
}
