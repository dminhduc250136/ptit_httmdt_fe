package com.laptopshop.repository;

import com.laptopshop.entity.ProductGift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductGiftRepository extends JpaRepository<ProductGift, Long> {

    List<ProductGift> findByProductIdAndIsActiveTrueOrderByDisplayOrderAsc(Long productId);
}
