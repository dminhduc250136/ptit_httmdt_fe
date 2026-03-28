package com.laptopshop.service;

import com.laptopshop.dto.CartDTO;

public interface CartService {

    CartDTO getCart(String email);

    CartDTO addToCart(String email, Long productId);

    CartDTO updateCartItem(String email, Long productId, int quantity);

    void removeCartItem(String email, Long productId);

    void clearCart(String email);
}
