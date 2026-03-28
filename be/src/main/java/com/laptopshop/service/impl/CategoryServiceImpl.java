package com.laptopshop.service.impl;

import com.laptopshop.dto.CategoryDTO;
import com.laptopshop.entity.Category;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.CategoryRepository;
import com.laptopshop.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "slug", slug));
        return mapToDTO(category);
    }

    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .icon(category.getIcon())
                .description(category.getDescription())
                .productCount(categoryRepository.countProductsByCategoryId(category.getId()))
                .build();
    }
}
