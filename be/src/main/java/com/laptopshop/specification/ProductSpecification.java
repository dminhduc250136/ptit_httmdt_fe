package com.laptopshop.specification;

import com.laptopshop.entity.Product;
import com.laptopshop.entity.enums.Badge;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> withFilters(
            String category,
            List<String> brands,
            Long priceMin,
            Long priceMax,
            String badge,
            String search
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only active products
            predicates.add(cb.isTrue(root.get("isActive")));

            // Category filter by slug
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), category));
            }

            // Brand filter (multi-select by slug)
            if (brands != null && !brands.isEmpty()) {
                predicates.add(root.get("brand").get("slug").in(brands));
            }

            // Price range
            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), priceMin));
            }
            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), priceMax));
            }

            // Badge filter
            if (badge != null && !badge.isBlank()) {
                try {
                    Badge badgeEnum = Badge.valueOf(badge);
                    predicates.add(cb.equal(root.get("badge"), badgeEnum));
                } catch (IllegalArgumentException ignored) {
                }
            }

            // Search by name
            if (search != null && !search.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
            }

            // Join fetch for list queries to avoid N+1
            if (query != null && query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("brand", JoinType.LEFT);
                root.fetch("category", JoinType.LEFT);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
