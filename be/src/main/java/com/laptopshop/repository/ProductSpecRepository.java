package com.laptopshop.repository;

import com.laptopshop.entity.ProductSpec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSpecRepository extends JpaRepository<ProductSpec, Long> {

    List<ProductSpec> findByProductIdOrderByDisplayOrderAsc(Long productId);
}
