package com.laptopshop.dto;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSummaryDTO {

    private Double avgRating;
    private Long totalReviews;
    private Map<Integer, Long> distribution;
}
