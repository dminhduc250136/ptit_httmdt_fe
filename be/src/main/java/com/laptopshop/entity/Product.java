package com.laptopshop.entity;

import com.laptopshop.entity.enums.Badge;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Long price;

    @Column(name = "original_price", nullable = false)
    private Long originalPrice;

    @Column(nullable = false, length = 500)
    private String image;

    @Builder.Default
    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "review_count", nullable = false)
    private Integer reviewCount = 0;

    @Builder.Default
    @Column(name = "sold_count", nullable = false)
    private Integer soldCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Badge badge;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "specs", nullable = false, columnDefinition = "jsonb")
    private ProductSpecs specs;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("displayOrder ASC")
    private List<ProductSpec> detailedSpecs = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @OrderBy("displayOrder ASC")
    private List<ProductGift> gifts = new ArrayList<>();
}
