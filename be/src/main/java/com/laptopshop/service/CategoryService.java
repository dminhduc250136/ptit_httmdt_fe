package com.laptopshop.service;

import com.laptopshop.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {

    List<CategoryDTO> getAllCategories();

    CategoryDTO getCategoryBySlug(String slug);
}
