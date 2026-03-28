package com.laptopshop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laptopshop.entity.User;
import com.laptopshop.entity.enums.UserRole;
import com.laptopshop.repository.UserRepository;
import com.laptopshop.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.concurrent.ThreadLocalRandom;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    protected String adminToken;
    protected String customerToken;
    protected Long adminUserId;
    protected Long customerUserId;
    protected String testAdminEmail;
    protected String testCustomerEmail;
    protected String testPassword;

    @BeforeEach
    public void setupTestData() {
        long suffix = System.currentTimeMillis();
        testPassword = "password123";
        testAdminEmail = "test-admin-" + suffix + "@laptopverse.vn";
        testCustomerEmail = "test-customer-" + suffix + "@gmail.com";

        // Create admin user
        User adminUser = new User();
        adminUser.setEmail(testAdminEmail);
        adminUser.setPasswordHash(passwordEncoder.encode(testPassword));
        adminUser.setFullName("Test Admin");
        adminUser.setPhone(randomPhone());
        adminUser.setRole(UserRole.ADMIN);
        adminUser.setIsActive(true);
        User savedAdmin = userRepository.save(adminUser);
        adminUserId = savedAdmin.getId();

        // Create customer user
        User customerUser = new User();
        customerUser.setEmail(testCustomerEmail);
        customerUser.setPasswordHash(passwordEncoder.encode(testPassword));
        customerUser.setFullName("Test Customer");
        customerUser.setPhone(randomPhone());
        customerUser.setRole(UserRole.CUSTOMER);
        customerUser.setIsActive(true);
        User savedCustomer = userRepository.save(customerUser);
        customerUserId = savedCustomer.getId();

        // Generate JWT tokens using test method
        adminToken = jwtTokenProvider.generateTokenForTest(savedAdmin.getEmail());
        customerToken = jwtTokenProvider.generateTokenForTest(savedCustomer.getEmail());
    }

    private String randomPhone() {
        long eightDigits = ThreadLocalRandom.current().nextLong(10_000_000L, 99_999_999L);
        return "09" + eightDigits;
    }

    protected String getAuthHeader(String token) {
        return "Bearer " + token;
    }
}

