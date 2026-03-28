package com.laptopshop.controller;

import com.laptopshop.BaseIntegrationTest;
import com.laptopshop.dto.LoginRequest;
import com.laptopshop.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest extends BaseIntegrationTest {

    @Test
    void testRegisterSuccess() throws Exception {
        long suffix = System.currentTimeMillis();
        String email = "testuser-" + suffix + "@gmail.com";
        String phone = "09" + (10_000_000L + (suffix % 89_999_999L));

        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail(email);
        request.setPhone(phone);
        request.setPassword("Password@123");

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Duplicate");
        request.setEmail(testCustomerEmail);
        request.setPhone("0999888777");
        request.setPassword("Password@123");

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value(containsString("Email")));
    }

    @Test
    void testRegisterInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test");
        request.setEmail("not-an-email");  // Invalid format
        request.setPhone("0987654321");
        request.setPassword("Password@123");

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail(testCustomerEmail);
        request.setPassword(testPassword);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.email").value(testCustomerEmail))
                .andExpect(jsonPath("$.fullName").value("Test Customer"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void testLoginWrongPassword() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail(testCustomerEmail);
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("không đúng")));
    }

    @Test
    void testGetProfileSuccess() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                .header("Authorization", getAuthHeader(customerToken))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(testCustomerEmail))
                .andExpect(jsonPath("$.fullName").value("Test Customer"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    @Test
    void testGetProfileNoToken() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is(anyOf(equalTo(401), equalTo(403))));
    }
}
