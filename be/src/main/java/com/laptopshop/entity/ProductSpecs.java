package com.laptopshop.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecs implements Serializable {

    private String cpu;
    private String ram;
    private String storage;
    private String display;
}
