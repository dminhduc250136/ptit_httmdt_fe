package com.laptopshop.repository;

import com.laptopshop.entity.FlashSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashSaleItemRepository extends JpaRepository<FlashSaleItem, Long> {

    @Query("SELECT fsi FROM FlashSaleItem fsi JOIN FETCH fsi.product p JOIN FETCH p.brand " +
            "WHERE fsi.flashSale.id = :flashSaleId")
    List<FlashSaleItem> findByFlashSaleIdWithProduct(@Param("flashSaleId") Integer flashSaleId);

    boolean existsByFlashSaleIdAndProductId(Integer flashSaleId, Long productId);
}
