package com.laptopshop.service.impl;

import com.laptopshop.dto.CartDTO;
import com.laptopshop.dto.CartItemDTO;
import com.laptopshop.entity.CartItem;
import com.laptopshop.entity.Product;
import com.laptopshop.entity.User;
import com.laptopshop.exception.BadRequestException;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.CartItemRepository;
import com.laptopshop.repository.ProductRepository;
import com.laptopshop.repository.UserRepository;
import com.laptopshop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public CartDTO getCart(String email) {
        User user = getUserByEmail(email);
        List<CartItem> items = cartItemRepository.findByUserIdWithProduct(user.getId());
        return buildCartDTO(items);
    }

    @Override
    @Transactional
    public CartDTO addToCart(String email, Long productId) {
        User user = getUserByEmail(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại"));

        if (!product.getIsActive()) {
            throw new BadRequestException("Sản phẩm không còn bán");
        }

        CartItem existingItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElse(null);

        if (existingItem != null) {
            if (existingItem.getQuantity() >= 10) {
                throw new BadRequestException("Số lượng tối đa cho mỗi sản phẩm là 10");
            }
            existingItem.setQuantity(existingItem.getQuantity() + 1);
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(1)
                    .build();
            cartItemRepository.save(cartItem);
        }

        List<CartItem> items = cartItemRepository.findByUserIdWithProduct(user.getId());
        return buildCartDTO(items);
    }

    @Override
    @Transactional
    public CartDTO updateCartItem(String email, Long productId, int quantity) {
        User user = getUserByEmail(email);

        if (quantity == 0) {
            cartItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
        } else {
            if (quantity > 10) {
                throw new BadRequestException("Số lượng tối đa cho mỗi sản phẩm là 10");
            }
            CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không có trong giỏ hàng"));
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        List<CartItem> items = cartItemRepository.findByUserIdWithProduct(user.getId());
        return buildCartDTO(items);
    }

    @Override
    @Transactional
    public void removeCartItem(String email, Long productId) {
        User user = getUserByEmail(email);
        cartItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    @Override
    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
    }

    private CartDTO buildCartDTO(List<CartItem> items) {
        List<CartItemDTO> itemDTOs = items.stream()
                .map(this::mapToCartItemDTO)
                .collect(Collectors.toList());

        long totalPrice = itemDTOs.stream()
                .mapToLong(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        int totalItems = itemDTOs.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        return CartDTO.builder()
                .items(itemDTOs)
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .build();
    }

    private CartItemDTO mapToCartItemDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();
        CartItemDTO.CartProductDTO productDTO = CartItemDTO.CartProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .image(product.getImage())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .build();

        return CartItemDTO.builder()
                .id(cartItem.getId())
                .product(productDTO)
                .quantity(cartItem.getQuantity())
                .build();
    }
}
