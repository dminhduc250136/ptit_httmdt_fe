package com.laptopshop.controller;

import com.laptopshop.dto.ProductDetailDTO;
import com.laptopshop.dto.ProductListDTO;
import com.laptopshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductListDTO>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) Long priceMin,
            @RequestParam(required = false) Long priceMax,
            @RequestParam(required = false) String badge,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "18") int size) {

        Page<ProductListDTO> products = productService.getProducts(
                category, brand, priceMin, priceMax, badge, search, sortBy, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductById(@PathVariable Long id) {
        ProductDetailDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductListDTO>> getRelatedProducts(@PathVariable Long id) {
        List<ProductListDTO> products = productService.getRelatedProducts(id);
        return ResponseEntity.ok(products);
    }
}
