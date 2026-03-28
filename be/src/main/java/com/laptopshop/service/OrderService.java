package com.laptopshop.service;

import com.laptopshop.dto.CreateOrderRequest;
import com.laptopshop.dto.OrderDTO;
import com.laptopshop.dto.OrderListDTO;
import org.springframework.data.domain.Page;

public interface OrderService {

    OrderDTO createOrder(String email, CreateOrderRequest request);

    Page<OrderListDTO> getOrders(String email, String status, int page, int size);

    OrderDTO getOrderByCode(String email, String orderCode);

    OrderDTO cancelOrder(String email, String orderCode);
}
