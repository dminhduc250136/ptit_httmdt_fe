package com.laptopshop.controller;

import com.laptopshop.dto.CreateReviewRequest;
import com.laptopshop.dto.ReviewDTO;
import com.laptopshop.dto.ReviewSummaryDTO;
import com.laptopshop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/reviews/product/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, page, size));
    }

    @GetMapping("/reviews/product/{productId}/summary")
    public ResponseEntity<ReviewSummaryDTO> getReviewSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewSummary(productId));
    }

    @PostMapping("/reviews/product/{productId}")
    public ResponseEntity<ReviewDTO> createReview(Authentication authentication,
                                                   @PathVariable Long productId,
                                                   @Valid @RequestBody CreateReviewRequest request) {
        ReviewDTO review = reviewService.createReview(authentication.getName(), productId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }
}
