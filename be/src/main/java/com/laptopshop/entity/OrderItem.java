package com.laptopshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    @Column(name = "product_image", nullable = false, length = 500)
    private String productImage;

    @Column(nullable = false)
    private Long price;

    @Column(name = "original_price", nullable = false)
    private Long originalPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Long subtotal;
}
