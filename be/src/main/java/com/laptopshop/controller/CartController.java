package com.laptopshop.controller;

import com.laptopshop.dto.AddToCartRequest;
import com.laptopshop.dto.CartDTO;
import com.laptopshop.dto.UpdateCartRequest;
import com.laptopshop.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<CartDTO> addToCart(Authentication authentication,
                                             @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), request.getProductId()));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<CartDTO> updateCartItem(Authentication authentication,
                                                   @PathVariable Long productId,
                                                   @Valid @RequestBody UpdateCartRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(authentication.getName(), productId, request.getQuantity()));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeCartItem(Authentication authentication,
                                                @PathVariable Long productId) {
        cartService.removeCartItem(authentication.getName(), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
