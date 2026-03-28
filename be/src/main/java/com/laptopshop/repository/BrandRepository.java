package com.laptopshop.repository;

import com.laptopshop.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {

    List<Brand> findByIsActiveTrueOrderByNameAsc();

    Optional<Brand> findBySlug(String slug);
}
