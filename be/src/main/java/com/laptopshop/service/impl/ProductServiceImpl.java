package com.laptopshop.service.impl;

import com.laptopshop.dto.ProductDetailDTO;
import com.laptopshop.dto.ProductListDTO;
import com.laptopshop.dto.ProductSpecDTO;
import com.laptopshop.entity.Product;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.FlashSaleItemRepository;
import com.laptopshop.repository.FlashSaleRepository;
import com.laptopshop.repository.ProductRepository;
import com.laptopshop.service.ProductService;
import com.laptopshop.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;

    @Override
    public Page<ProductListDTO> getProducts(
            String category,
            List<String> brands,
            Long priceMin,
            Long priceMax,
            String badge,
            String search,
            String sortBy,
            int page,
            int size
    ) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Product> spec = ProductSpecification.withFilters(category, brands, priceMin, priceMax, badge, search);

        return productRepository.findAll(spec, pageable)
                .map(this::mapToProductListDTO);
    }

    @Override
    public ProductDetailDTO getProductById(Long id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));

        return mapToProductDetailDTO(product);
    }

    @Override
    public List<ProductListDTO> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", productId));

        return productRepository.findRelatedProducts(
                product.getCategory().getId(),
                productId,
                PageRequest.of(0, 6)
        ).stream().map(this::mapToProductListDTO).collect(Collectors.toList());
    }

    private ProductListDTO mapToProductListDTO(Product product) {
        Integer discountPercent = calcDiscountPercent(product.getOriginalPrice(), product.getPrice());

        return ProductListDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brand(product.getBrand().getName())
                .category(product.getCategory().getName())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .discountPercent(discountPercent)
                .image(product.getImage())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .soldCount(product.getSoldCount())
                .badge(product.getBadge() != null ? product.getBadge().name() : null)
                .specs(product.getSpecs())
                .build();
    }

    private ProductDetailDTO mapToProductDetailDTO(Product product) {
        Integer discountPercent = calcDiscountPercent(product.getOriginalPrice(), product.getPrice());

        List<String> gallery = product.getImages().stream()
                .sorted(Comparator.comparing(img -> img.getDisplayOrder()))
                .map(img -> img.getImageUrl())
                .collect(Collectors.toList());

        List<ProductSpecDTO> detailedSpecs = product.getDetailedSpecs().stream()
                .map(s -> ProductSpecDTO.builder()
                        .label(s.getLabel())
                        .value(s.getValue())
                        .build())
                .collect(Collectors.toList());

        List<String> gifts = product.getGifts().stream()
                .filter(g -> g.getIsActive())
                .map(g -> g.getDescription())
                .collect(Collectors.toList());

        Map<String, Object> brandMap = new LinkedHashMap<>();
        brandMap.put("id", product.getBrand().getId());
        brandMap.put("name", product.getBrand().getName());

        Map<String, Object> categoryMap = new LinkedHashMap<>();
        categoryMap.put("id", product.getCategory().getId());
        categoryMap.put("name", product.getCategory().getName());
        categoryMap.put("slug", product.getCategory().getSlug());

        // Check flash sale
        boolean isFlashSale = false;
        var activeFlashSale = flashSaleRepository.findActiveFlashSale(LocalDateTime.now());
        if (activeFlashSale.isPresent()) {
            isFlashSale = flashSaleItemRepository.existsByFlashSaleIdAndProductId(
                    activeFlashSale.get().getId(), product.getId());
        }

        return ProductDetailDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brand(brandMap)
                .category(categoryMap)
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .discountPercent(discountPercent)
                .image(product.getImage())
                .gallery(gallery)
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .soldCount(product.getSoldCount())
                .badge(product.getBadge() != null ? product.getBadge().name() : null)
                .specs(product.getSpecs())
                .detailedSpecs(detailedSpecs)
                .description(product.getDescription())
                .gifts(gifts)
                .stockQuantity(product.getStockQuantity())
                .isFlashSale(isFlashSale)
                .build();
    }

    private Integer calcDiscountPercent(Long originalPrice, Long price) {
        if (originalPrice == null || originalPrice <= 0 || price == null) return 0;
        if (originalPrice.equals(price)) return 0;
        return (int) Math.round(((double) (originalPrice - price) / originalPrice) * 100);
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null) return Sort.by("createdAt").descending();
        return switch (sortBy) {
            case "popular" -> Sort.by("soldCount").descending();
            case "newest" -> Sort.by("createdAt").descending();
            case "price-asc" -> Sort.by("price").ascending();
            case "price-desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
