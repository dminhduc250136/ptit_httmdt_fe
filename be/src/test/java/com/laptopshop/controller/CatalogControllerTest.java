package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CatalogControllerTest extends BaseIntegrationTest {

    @Test
    void testGetCategoriesSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/categories")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].name").isNotEmpty())
                .andExpect(jsonPath("$[0].slug").isNotEmpty())
                .andExpect(jsonPath("$[0].icon").isNotEmpty())
                .andExpect(jsonPath("$[0].productCount").exists());
    }

    @Test
    void testGetCategoryBySlug() throws Exception {
        mockMvc.perform(get("/api/v1/categories/gaming")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Gaming"))
                .andExpect(jsonPath("$.slug").value("gaming"))
                .andExpect(jsonPath("$.productCount").isNumber());
    }

    @Test
    void testGetCategoryBySlugNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/categories/not-exist")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetBrandsSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/brands")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].name").isNotEmpty())
                .andExpect(jsonPath("$[0].slug").isNotEmpty())
                .andExpect(jsonPath("$[0].productCount").isNumber());
    }

    @Test
    void testGetProductsNoFilter() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("page", "0")
                .param("size", "18")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.totalElements").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber())
                .andExpect(jsonPath("$.content[0].id").isNotEmpty())
                .andExpect(jsonPath("$.content[0].name").isNotEmpty())
                .andExpect(jsonPath("$.content[0].price").isNumber());
    }

    @Test
    void testGetProductsFilterByCategory() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("category", "gaming")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.content[0].category").value("Gaming"));
    }

    @Test
    void testGetProductsFilterByBrand() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("brand", "apple")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.content[0].brand").value("Apple"));
    }

    @Test
    void testGetProductsFilterByPrice() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("priceMin", "20000000")
                .param("priceMax", "40000000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].price").isNumber());
    }

    @Test
    void testGetProductsFilterByBadge() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("badge", "Hot")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].badge").value("Hot"));
    }

    @Test
    void testGetProductsSearch() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("search", "macbook")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name", containsString("MacBook")));
    }

    @Test
    void testGetProductsSortByPriceAsc() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                .param("sortBy", "price-asc")
                .param("page", "0")
                .param("size", "5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].price").isNumber());
    }

    @Test
    void testGetProductsById() throws Exception {
        mockMvc.perform(get("/api/v1/products/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").isNotEmpty())
                .andExpect(jsonPath("$.price").isNumber())
                .andExpect(jsonPath("$.originalPrice").isNumber())
                .andExpect(jsonPath("$.gallery", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.detailedSpecs", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.gifts", hasSize(greaterThan(0))));
    }

    @Test
    void testGetProductsByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/products/9999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetRelatedProducts() throws Exception {
        mockMvc.perform(get("/api/v1/products/1/related")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$[0].id").isNotEmpty())
                .andExpect(jsonPath("$[0].name").isNotEmpty());
    }
}
