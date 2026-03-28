package com.laptopshop.service.impl;

import com.laptopshop.dto.CreateReviewRequest;
import com.laptopshop.dto.ReviewDTO;
import com.laptopshop.dto.ReviewSummaryDTO;
import com.laptopshop.entity.Product;
import com.laptopshop.entity.Review;
import com.laptopshop.entity.ReviewImage;
import com.laptopshop.entity.User;
import com.laptopshop.exception.BadRequestException;
import com.laptopshop.exception.DuplicateResourceException;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.*;
import com.laptopshop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getProductReviews(Long productId, int page, int size) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        Page<Review> reviews = reviewRepository.findByProductIdAndIsActiveTrue(
                productId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        return reviews.map(this::mapToReviewDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummaryDTO getReviewSummary(Long productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        Double avgRatingVal = reviewRepository.getAverageRatingByProductId(productId);
        long totalReviews = reviewRepository.countByProductIdAndIsActiveTrue(productId);

        List<Object[]> ratingDist = reviewRepository.getRatingDistribution(productId);
        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        for (Object[] row : ratingDist) {
            distribution.put((Integer) row[0], (Long) row[1]);
        }

        return ReviewSummaryDTO.builder()
                .avgRating(avgRatingVal != null ? avgRatingVal : 0D)
                .totalReviews(totalReviews)
                .distribution(distribution)
                .build();
    }

    @Override
    @Transactional
    public ReviewDTO createReview(String email, Long productId, CreateReviewRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new DuplicateResourceException("Bạn đã đánh giá sản phẩm này");
        }

        boolean hasPurchased = orderRepository.hasUserPurchasedProduct(user.getId(), productId);

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .title(request.getTitle())
                .content(request.getContent())
                .helpfulCount(0)
                .isVerified(hasPurchased)
                .isActive(true)
                .build();

        review = reviewRepository.save(review);

        // Save images if provided
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            final Review savedReview = review;
            List<ReviewImage> images = request.getImages().stream()
                    .map(url -> ReviewImage.builder()
                            .review(savedReview)
                            .imageUrl(url)
                            .displayOrder(request.getImages().indexOf(url))
                            .build())
                    .collect(Collectors.toList());
            reviewImageRepository.saveAll(images);
        }

        // Update product rating
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        long reviewCount = reviewRepository.countByProductIdAndIsActiveTrue(productId);
        product.setRating(avgRating != null ? BigDecimal.valueOf(avgRating) : BigDecimal.ZERO);
        product.setReviewCount((int) reviewCount);
        productRepository.save(product);

        return mapToReviewDTO(review);
    }

    private ReviewDTO mapToReviewDTO(Review review) {
        List<String> images = review.getImages() != null ?
                review.getImages().stream()
                        .map(ReviewImage::getImageUrl)
                        .collect(Collectors.toList()) : List.of();

        return ReviewDTO.builder()
                .id(review.getId())
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .helpfulCount(review.getHelpfulCount())
                .isVerified(review.getIsVerified())
                .createdAt(review.getCreatedAt())
                .userName(review.getUser().getFullName())
                .userAvatar(review.getUser().getAvatarUrl())
                .images(images)
                .build();
    }
}
