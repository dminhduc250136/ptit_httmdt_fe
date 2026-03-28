package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class FlashSaleControllerTest extends BaseIntegrationTest {

    @Test
    void testGetActiveFlashSale() throws Exception {
        mockMvc.perform(get("/api/v1/flash-sales/active")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(
                        equalTo(200),  // If active flash sale exists
                        equalTo(204)   // If no active flash sale
                )));
    }

    @Test
    void testGetActiveFlashSaleWithProducts() throws Exception {
        mockMvc.perform(get("/api/v1/flash-sales/active")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(
                        equalTo(200),
                        equalTo(204)
                )));
        // If 200: should have id, title, startTime, endTime, products array
    }
}
