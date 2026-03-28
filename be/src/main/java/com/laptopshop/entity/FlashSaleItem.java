package com.laptopshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "flash_sale_items", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"flash_sale_id", "product_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlashSaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_sale_id", nullable = false)
    private FlashSale flashSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sale_price", nullable = false)
    private Long salePrice;

    @Column(name = "stock_limit")
    private Integer stockLimit;

    @Builder.Default
    @Column(name = "sold_count", nullable = false)
    private Integer soldCount = 0;
}
