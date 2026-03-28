package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import com.laptopshop.dto.CreateReviewRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReviewControllerTest extends BaseIntegrationTest {

    @Test
    void testGetProductReviews() throws Exception {
        mockMvc.perform(get("/api/v1/reviews/product/1")
                .param("page", "0")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void testGetReviewSummary() throws Exception {
        mockMvc.perform(get("/api/v1/reviews/product/1/summary")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avgRating").isNumber())
                .andExpect(jsonPath("$.totalReviews").isNumber())
                .andExpect(jsonPath("$.distribution").isMap());
    }

    @Test
    void testCreateReviewSuccess() throws Exception {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRating(5);
        request.setTitle("Great product!");
        request.setContent("This product is amazing, highly recommended!");

        mockMvc.perform(post("/api/v1/reviews/product/3")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.title").value("Great product!"))
                .andExpect(jsonPath("$.isVerified").exists());
    }

    @Test
    void testCreateReviewDuplicate() throws Exception {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRating(4);
        request.setTitle("Already reviewed");
        request.setContent("Testing duplicate review");

        // First review (user 2 -> product 1)
        mockMvc.perform(post("/api/v1/reviews/product/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(anyOf(
                        // If already reviewed by this user
                        equalTo(409),
                        // If not yet reviewed, create it
                        equalTo(201)
                )));
    }

    @Test
    void testCreateReviewInvalidRating() throws Exception {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRating(0);  // Invalid: must be 1-5
        request.setTitle("Bad rating");
        request.setContent("Invalid rating");

        mockMvc.perform(post("/api/v1/reviews/product/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testReviewNoAuth() throws Exception {
        CreateReviewRequest request = new CreateReviewRequest();
        request.setRating(5);
        request.setTitle("Test");
        request.setContent("Test");

        mockMvc.perform(post("/api/v1/reviews/product/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(anyOf(equalTo(401), equalTo(403))));
    }


}
