package com.laptopshop.service;

import com.laptopshop.dto.ProductDetailDTO;
import com.laptopshop.dto.ProductListDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

    Page<ProductListDTO> getProducts(
            String category,
            List<String> brands,
            Long priceMin,
            Long priceMax,
            String badge,
            String search,
            String sortBy,
            int page,
            int size
    );

    ProductDetailDTO getProductById(Long id);

    List<ProductListDTO> getRelatedProducts(Long productId);
}
