package com.laptopshop.controller;

import com.laptopshop.dto.CreateOrderRequest;
import com.laptopshop.dto.OrderDTO;
import com.laptopshop.dto.OrderListDTO;
import com.laptopshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(Authentication authentication,
                                                 @Valid @RequestBody CreateOrderRequest request) {
        OrderDTO order = orderService.createOrder(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<Page<OrderListDTO>> getOrders(Authentication authentication,
                                                         @RequestParam(required = false) String status,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getOrders(authentication.getName(), status, page, size));
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<OrderDTO> getOrderByCode(Authentication authentication,
                                                    @PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.getOrderByCode(authentication.getName(), orderCode));
    }

    @PatchMapping("/{orderCode}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(Authentication authentication,
                                                 @PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.cancelOrder(authentication.getName(), orderCode));
    }
}
