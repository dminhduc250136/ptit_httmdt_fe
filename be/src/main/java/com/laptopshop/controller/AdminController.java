package com.laptopshop.controller;

import com.laptopshop.dto.OrderDTO;
import com.laptopshop.dto.admin.*;
import com.laptopshop.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/products")
    public ResponseEntity<Page<AdminProductDTO>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getProducts(search, page, size));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<AdminProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getProductById(id));
    }

    @PostMapping("/products")
    public ResponseEntity<AdminProductDTO> createProduct(@Valid @RequestBody AdminUpsertProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<AdminProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpsertProductRequest request) {
        return ResponseEntity.ok(adminService.updateProduct(id, request));
    }

    @PatchMapping("/products/{id}/active")
    public ResponseEntity<AdminProductDTO> updateProductActive(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        boolean active = Boolean.TRUE.equals(payload.get("active"));
        return ResponseEntity.ok(adminService.updateProductActive(id, active));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<AdminOrderDTO>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getOrders(status, search, page, size));
    }

    @GetMapping("/orders/{orderCode}")
    public ResponseEntity<OrderDTO> getOrderDetail(@PathVariable String orderCode) {
        return ResponseEntity.ok(adminService.getOrderDetail(orderCode));
    }

    @PatchMapping("/orders/{orderCode}")
    public ResponseEntity<AdminOrderDTO> updateOrder(
            @PathVariable String orderCode,
            @RequestBody AdminUpdateOrderRequest request) {
        return ResponseEntity.ok(adminService.updateOrder(orderCode, request));
    }

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserDTO>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(search, role, isActive, page, size));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> updateUser(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request, authentication.getName()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(Authentication authentication, @PathVariable Long id) {
        adminService.deleteUser(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
