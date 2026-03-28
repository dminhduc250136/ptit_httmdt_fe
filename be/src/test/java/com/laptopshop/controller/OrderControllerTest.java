package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import com.laptopshop.dto.AddToCartRequest;
import com.laptopshop.dto.CreateOrderRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class OrderControllerTest extends BaseIntegrationTest {

    @Test
    void testCreateOrderSuccess() throws Exception {
        // First add item to cart
        AddToCartRequest cartRequest = new AddToCartRequest();
        cartRequest.setProductId(1L);

        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cartRequest)))
                .andExpect(status().isOk());

        // Create order
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        CreateOrderRequest.OrderItemRequest item = new CreateOrderRequest.OrderItemRequest();
        item.setProductId(1L);
        item.setQuantity(1);
        orderRequest.setItems(Arrays.asList(item));

        CreateOrderRequest.ShippingInfo shipping = new CreateOrderRequest.ShippingInfo();
        shipping.setFullName("Nguyen Van A");
        shipping.setPhone("0987654321");
        shipping.setEmail("nguyenvana@gmail.com");
        shipping.setProvince("Ho Chi Minh");
        shipping.setDistrict("District 1");
        shipping.setAddress("123 Nguyen Hue");
        orderRequest.setShippingAddress(shipping);
        orderRequest.setPaymentMethod("cod");
        orderRequest.setNote("Please deliver ASAP");

        mockMvc.perform(post("/api/v1/orders")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderCode").isNotEmpty())
                .andExpect(jsonPath("$.orderStatus").value("PENDING"))
                .andExpect(jsonPath("$.paymentStatus").value("PENDING"))
                .andExpect(jsonPath("$.total").isNumber())
                .andExpect(jsonPath("$.shippingFee").isNumber());
    }

    @Test
    void testGetUserOrders() throws Exception {
        mockMvc.perform(get("/api/v1/orders")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void testGetOrderByCode() throws Exception {
        mockMvc.perform(get("/api/v1/orders/ORD-00000001")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(
                        equalTo(200),  // Order exists
                        equalTo(404)   // Order doesn't exist
                )));
    }

    @Test
    void testCancelOrder() throws Exception {
        mockMvc.perform(patch("/api/v1/orders/ORD-00000001/cancel")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(
                        equalTo(200),  // Successfully cancelled
                        equalTo(404),  // Order not found
                        equalTo(409)   // Cannot cancel (not in PENDING/CONFIRMED status)
                )));
    }

    @Test
    void testOrderNoAuth() throws Exception {
        mockMvc.perform(get("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(equalTo(401), equalTo(403))));
    }
}
