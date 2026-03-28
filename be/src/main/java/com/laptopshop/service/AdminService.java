package com.laptopshop.service;

import com.laptopshop.dto.OrderDTO;
import com.laptopshop.dto.admin.*;
import org.springframework.data.domain.Page;

public interface AdminService {

    AdminDashboardDTO getDashboard();

    Page<AdminProductDTO> getProducts(String search, int page, int size);

    AdminProductDTO getProductById(Long id);

    AdminProductDTO createProduct(AdminUpsertProductRequest request);

    AdminProductDTO updateProduct(Long id, AdminUpsertProductRequest request);

    AdminProductDTO updateProductActive(Long id, boolean active);

    void deleteProduct(Long id);

    Page<AdminOrderDTO> getOrders(String status, String search, int page, int size);

    OrderDTO getOrderDetail(String orderCode);

    AdminOrderDTO updateOrder(String orderCode, AdminUpdateOrderRequest request);

    Page<AdminUserDTO> getUsers(String search, String role, Boolean isActive, int page, int size);

    AdminUserDTO getUserById(Long userId);

    AdminUserDTO updateUser(Long userId, AdminUpdateUserRequest request, String actorEmail);

    void deleteUser(Long userId, String actorEmail);
}
