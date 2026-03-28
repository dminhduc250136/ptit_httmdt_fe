package com.laptopshop.controller;

import com.laptopshop.dto.FlashSaleDTO;
import com.laptopshop.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    @GetMapping("/active")
    public ResponseEntity<FlashSaleDTO> getActiveFlashSale() {
        FlashSaleDTO flashSale = flashSaleService.getActiveFlashSale();
        if (flashSale == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(flashSale);
    }
}
