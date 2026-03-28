package com.laptopshop.service.impl;

import com.laptopshop.dto.FlashSaleDTO;
import com.laptopshop.dto.FlashSaleProductDTO;
import com.laptopshop.entity.FlashSale;
import com.laptopshop.entity.FlashSaleItem;
import com.laptopshop.repository.FlashSaleItemRepository;
import com.laptopshop.repository.FlashSaleRepository;
import com.laptopshop.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FlashSaleServiceImpl implements FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;

    @Override
    public FlashSaleDTO getActiveFlashSale() {
        FlashSale flashSale = flashSaleRepository.findActiveFlashSale(LocalDateTime.now())
                .orElse(null);

        if (flashSale == null) {
            return null;
        }

        List<FlashSaleItem> items = flashSaleItemRepository.findByFlashSaleIdWithProduct(flashSale.getId());

        List<FlashSaleProductDTO> products = items.stream()
                .filter(item -> item.getProduct().getIsActive())
                .map(this::mapToFlashSaleProductDTO)
                .collect(Collectors.toList());

        return FlashSaleDTO.builder()
                .id(flashSale.getId())
                .title(flashSale.getTitle())
                .startTime(flashSale.getStartTime().toString())
                .endTime(flashSale.getEndTime().toString())
                .products(products)
                .build();
    }

    private FlashSaleProductDTO mapToFlashSaleProductDTO(FlashSaleItem item) {
        var product = item.getProduct();
        int discountPercent = 0;
        if (product.getOriginalPrice() > 0) {
            discountPercent = (int) ((1 - (double) item.getSalePrice() / product.getOriginalPrice()) * 100);
        }

        return FlashSaleProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brand(product.getBrand().getName())
                .category(product.getCategory().getName())
                .price(item.getSalePrice())
                .originalPrice(product.getOriginalPrice())
                .discountPercent(discountPercent)
                .image(product.getImage())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .soldCount(product.getSoldCount())
                .badge(product.getBadge() != null ? product.getBadge().name() : null)
                .flashSalePrice(item.getSalePrice())
                .stockLimit(item.getStockLimit())
                .flashSaleSold(item.getSoldCount())
                .build();
    }
}
