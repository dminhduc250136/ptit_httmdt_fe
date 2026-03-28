package com.laptopshop.repository;

import com.laptopshop.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Integer> {

    @Query("SELECT fs FROM FlashSale fs WHERE fs.isActive = true AND fs.startTime <= :now AND fs.endTime > :now")
    Optional<FlashSale> findActiveFlashSale(LocalDateTime now);
}
