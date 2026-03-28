package com.laptopshop.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String slug;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
