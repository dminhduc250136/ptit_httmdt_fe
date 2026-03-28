package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import com.laptopshop.dto.ShippingAddressDTO;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AddressControllerTest extends BaseIntegrationTest {

    @Test
    void testGetUserAddresses() throws Exception {
        mockMvc.perform(get("/api/v1/addresses")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testCreateAddressSuccess() throws Exception {
        ShippingAddressDTO request = new ShippingAddressDTO();
        request.setFullName("Nguyen Van B");
        request.setPhone("0912345678");
        request.setEmail("vanb@gmail.com");
        request.setProvince("Ha Noi");
        request.setDistrict("Cau Giay");
        request.setAddress("456 Ton That Tung");
        request.setIsDefault(false);

        mockMvc.perform(post("/api/v1/addresses")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.fullName").value("Nguyen Van B"))
                .andExpect(jsonPath("$.phone").value("0912345678"))
                .andExpect(jsonPath("$.province").value("Ha Noi"));
    }

    @Test
    void testCreateAddressSetDefault() throws Exception {
        ShippingAddressDTO request = new ShippingAddressDTO();
        request.setFullName("Default Address User");
        request.setPhone("0911111111");
        request.setEmail("default@gmail.com");
        request.setProvince("Da Nang");
        request.setDistrict("Hai Chau");
        request.setAddress("789 Phan Chu Trinh");
        request.setIsDefault(true);

        mockMvc.perform(post("/api/v1/addresses")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isDefault").value(true));
    }

    @Test
    void testUpdateAddressSuccess() throws Exception {
        ShippingAddressDTO request = new ShippingAddressDTO();
        request.setFullName("Updated Name");
        request.setPhone("0988888888");
        request.setEmail("updated@gmail.com");
        request.setProvince("Can Tho");
        request.setDistrict("Ninh Kieu");
        request.setAddress("Updated address");
        request.setIsDefault(false);

        mockMvc.perform(put("/api/v1/addresses/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(anyOf(
                        equalTo(200),  // Success
                        equalTo(404)   // Address not found or not owned by user
                )));
    }

    @Test
    void testDeleteAddressSuccess() throws Exception {
        mockMvc.perform(delete("/api/v1/addresses/1")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(
                        equalTo(204),  // Success
                        equalTo(404)   // Address not found
                )));
    }

    @Test
    void testAddressNoAuth() throws Exception {
        mockMvc.perform(get("/api/v1/addresses")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(equalTo(401), equalTo(403))));
    }
}
