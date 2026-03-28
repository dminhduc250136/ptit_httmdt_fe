package com.laptopshop.controller;

import com.laptopshop.dto.ShippingAddressDTO;
import com.laptopshop.service.ShippingAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class ShippingAddressController {

    private final ShippingAddressService shippingAddressService;

    @GetMapping
    public ResponseEntity<List<ShippingAddressDTO>> getAddresses(Authentication authentication) {
        return ResponseEntity.ok(shippingAddressService.getAddresses(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<ShippingAddressDTO> createAddress(Authentication authentication,
                                                             @Valid @RequestBody ShippingAddressDTO request) {
        ShippingAddressDTO address = shippingAddressService.createAddress(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShippingAddressDTO> updateAddress(Authentication authentication,
                                                             @PathVariable Long id,
                                                             @Valid @RequestBody ShippingAddressDTO request) {
        return ResponseEntity.ok(shippingAddressService.updateAddress(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication,
                                               @PathVariable Long id) {
        shippingAddressService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
