package com.laptopshop.service.impl;

import com.laptopshop.dto.BrandDTO;
import com.laptopshop.repository.BrandRepository;
import com.laptopshop.repository.ProductRepository;
import com.laptopshop.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    @Override
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(brand -> BrandDTO.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .slug(brand.getSlug())
                        .productCount(productRepository.countProductsByBrandId(brand.getId()))
                        .build())
                .collect(Collectors.toList());
    }
}
