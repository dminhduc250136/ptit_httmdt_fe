package com.laptopshop.repository;

import com.laptopshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p JOIN FETCH p.brand JOIN FETCH p.category WHERE p.id = :id AND p.isActive = true")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT p FROM Product p JOIN FETCH p.brand JOIN FETCH p.category " +
            "WHERE p.category.id = :categoryId AND p.id <> :excludeId AND p.isActive = true")
    List<Product> findRelatedProducts(@Param("categoryId") Integer categoryId,
                                      @Param("excludeId") Long excludeId,
                                      Pageable pageable);

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.brand.id = :brandId AND p.isActive = true")
    long countProductsByBrandId(@Param("brandId") Integer brandId);

    long countByStockQuantityLessThanEqualAndIsActiveTrue(Integer stockQuantity);
}
