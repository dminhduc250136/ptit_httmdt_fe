package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import com.laptopshop.dto.AddToCartRequest;
import com.laptopshop.dto.UpdateCartRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CartControllerTest extends BaseIntegrationTest {

    @Test
    void testGetCartEmpty() throws Exception {
        mockMvc.perform(get("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray())
                .andExpect(jsonPath("$.totalItems").value(0))
                .andExpect(jsonPath("$.totalPrice").value(0));
    }

    @Test
    void testAddToCartSuccess() throws Exception {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);

        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].product.id").value(1))
                .andExpect(jsonPath("$.items[0].quantity").value(1))
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.totalPrice").isNumber());
    }

    @Test
    void testAddToCartDuplicate() throws Exception {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);

        // Add first time
        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Add second time (should increment quantity)
        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

    @Test
    void testAddToCartProductNotFound() throws Exception {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(9999L);

        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateCartItemSuccess() throws Exception {
        AddToCartRequest addRequest = new AddToCartRequest();
        addRequest.setProductId(1L);

        // Add to cart first
        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addRequest)))
                .andExpect(status().isOk());

        // Update quantity
        UpdateCartRequest updateRequest = new UpdateCartRequest();
        updateRequest.setQuantity(3);

        mockMvc.perform(put("/api/v1/cart/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].quantity").value(3));
    }

    @Test
    void testUpdateCartItemToZero() throws Exception {
        AddToCartRequest addRequest = new AddToCartRequest();
        addRequest.setProductId(1L);

        // Add to cart
        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addRequest)))
                .andExpect(status().isOk());

        // Update to 0 (should remove)
        UpdateCartRequest updateRequest = new UpdateCartRequest();
        updateRequest.setQuantity(0);

        mockMvc.perform(put("/api/v1/cart/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items").isArray());
    }

    @Test
    void testRemoveCartItem() throws Exception {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);

        // Add to cart
        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Remove
        mockMvc.perform(delete("/api/v1/cart/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void testClearCart() throws Exception {
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);

        // Add to cart
        mockMvc.perform(post("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Clear
        mockMvc.perform(delete("/api/v1/cart")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void testCartNoAuth() throws Exception {
        mockMvc.perform(get("/api/v1/cart")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(equalTo(401), equalTo(403))));
    }
}
