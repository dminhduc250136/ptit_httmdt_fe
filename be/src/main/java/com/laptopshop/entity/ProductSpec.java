package com.laptopshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 50)
    private String label;

    @Column(nullable = false, length = 255)
    private String value;

    @Builder.Default
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
