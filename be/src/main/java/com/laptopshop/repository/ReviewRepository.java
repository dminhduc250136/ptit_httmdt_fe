package com.laptopshop.repository;

import com.laptopshop.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProductIdAndIsActiveTrue(Long productId, Pageable pageable);

    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);

    boolean existsByUserId(Long userId);

    void deleteByUserId(Long userId);

    boolean existsByProductIdAndUserId(Long productId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.isActive = true")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isActive = true")
    long countByProductIdAndIsActiveTrue(@Param("productId") Long productId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId AND r.isActive = true GROUP BY r.rating")
    java.util.List<Object[]> getRatingDistribution(@Param("productId") Long productId);
}
