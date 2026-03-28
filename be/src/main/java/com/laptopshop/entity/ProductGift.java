package com.laptopshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_gifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductGift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 255)
    private String description;

    @Builder.Default
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
