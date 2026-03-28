package com.laptopshop.service;

import com.laptopshop.dto.CreateReviewRequest;
import com.laptopshop.dto.ReviewDTO;
import com.laptopshop.dto.ReviewSummaryDTO;
import org.springframework.data.domain.Page;

public interface ReviewService {

    Page<ReviewDTO> getProductReviews(Long productId, int page, int size);

    ReviewSummaryDTO getReviewSummary(Long productId);

    ReviewDTO createReview(String email, Long productId, CreateReviewRequest request);
}
