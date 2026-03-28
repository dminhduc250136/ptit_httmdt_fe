package com.laptopshop.repository;

import com.laptopshop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByIsActiveTrueOrderByDisplayOrderAsc();

    Optional<Category> findBySlug(String slug);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true")
    long countProductsByCategoryId(Integer categoryId);
}
