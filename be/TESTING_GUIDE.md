# LaptopVerse Backend - Test Execution Guide

## Overview
Automated integration tests have been created for the LaptopVerse Backend API covering all major modules:
- **Auth** (6 tests): Registration, login, profile endpoints
- **Catalog** (12 tests): Products, categories, brands with filtering and sorting
- **Cart** (7 tests): Add, update, remove, clear cart operations
- **Orders** (4 tests): Create, list, retrieve, cancel orders
- **Reviews** (5 tests): Get reviews, create, summary, validation
- **Addresses** (6 tests): CRUD operations with default address logic
- **FlashSales** (1 test): Active flash sale retrieval

**Total: 49 Integration Tests**

---

## Test Infrastructure Setup

### Files Created:
1. **Test Base Class**: `src/test/java/com/laptopshop/BaseIntegrationTest.java`
   - Handles MockMvc setup with Spring Boot test annotations
   - Provides JWT token generation for authenticated requests
   - Sets up test users (admin + customer with hardcoded credentials)

2. **Test Controllers**:
   - `AuthControllerTest.java` - Authentication endpoints
   - `CatalogControllerTest.java` - Product/category/brand endpoints
   - `CartControllerTest.java` - Shopping cart operations
   - `OrderControllerTest.java` - Order management
   - `ReviewControllerTest.java` - Product reviews (with image support)
   - `AddressControllerTest.java` - Shipping address management
   - `FlashSaleControllerTest.java` - Flash sale retrieval

3. **Test Configuration**:
   - `src/test/resources/application-test.yml` - Uses H2 in-memory database for isolation
   - `src/test/resources/data.sql` - Automatic test data population (7 test products, 5 users, 3 categories, 8 brands)

4. **Dependencies**:
   - `pom.xml` - Added H2 database for testing (test scope only)

---

## Running Tests

### Option 1: Using Maven (Recommended)
```bash
cd e:\workspace_ptit\2-2025-2026\BTL-TMDT\be

# Run all tests
mvn test

# Run specific test class only
mvn test -Dtest=AuthControllerTest

# Run specific test method
mvn test -Dtest=AuthControllerTest#testLoginSuccess

# Run with coverage report
mvn test jacoco:report

# Skip tests during build
mvn clean package -DskipTests
```

### Option 2: Using VS Code Test Explorer
1. Click on **Testing** icon in left sidebar
2. Expand the project tree
3. Click on any test to run it individually
4. Pin test class to run all tests in that class

### Option 3: Using IDE (IntelliJ IDEA)
1. Right-click on test class → **Run 'ClassName'**
2. Or click the green play icon next to the class/method

---

## Test Data Setup

Automatic test data is loaded via `src/test/resources/data.sql`:
- **Users**: 5 test accounts (1 admin, 4 customers)
- **Categories**: 3 categories (Gaming, Văn phòng, Apple)
- **Brands**: 8 brands (Acer, Apple, ASUS, Dell, HP, Lenovo, MSI, Razer)
- **Products**: 7 sample laptops with prices, ratings, images
- **Stock**: All products have stock quantities for order testing

### Test Credentials:
```
Admin Account:
  Email: admin@laptopverse.vn
  Password: 123456
  Role: ADMIN

Customer Account:
  Email: nguyenvana@gmail.com
  Password: 123456
  Role: CUSTOMER
```

---

## Test Architecture

### Authentication Flow (BaseIntegrationTest):
```java
@BeforeEach
public void setupTokens() {
    // Authenticates test users and generates JWT tokens
    adminToken = jwtTokenProvider.generateToken(adminAuth);      // ADMIN
    customerToken = jwtTokenProvider.generateToken(customerAuth); // CUSTOMER
}

// In tests: .header("Authorization", getAuthHeader(customerToken))
```

### Test Patterns:

**1. Public Endpoint (No Auth Required):**
```java
mockMvc.perform(get("/api/v1/products")
        .contentType(MediaType.APPLICATION_JSON))
    .andExpect(status().isOk());
```

**2. Protected Endpoint (Auth Required):**
```java
mockMvc.perform(post("/api/v1/cart")
        .header("Authorization", getAuthHeader(customerToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
    .andExpect(status().isOk());
```

**3. Validation Test (Bad Request):**
```java
mockMvc.perform(post("/api/v1/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(invalidRequest)))
    .andExpect(status().isBadRequest());
```

---

## Test Results and Reports

After running `mvn test`, reports are generated at:
- **Test Results**: `target/surefire-reports/`
- **HTML Report**: `target/surefire-reports/index.html`

Expected output when all tests pass:
```
[INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## Known Limitations

1. **H2 In-Memory Database**: 
   - Changes are NOT persisted between test runs
   - Each test run creates fresh database
   - Perfect for isolation, not suitable for integration with production DB

2. **Test Data Reset**:
   - `DELETE` statements in data.sql ensure clean state per run
   - IDs are auto-generated fresh each run

3. **Tests Not Covering**:
   - Async operations
   - Scheduled tasks
   - WebSocket connections
   - File uploads (partially)

---

## Troubleshooting

### Issue: ApplicationContext fails to load
**Cause**: Missing Spring components or misconfigured beans
**Solution**:
1. Check if `@ActiveProfiles("test")` is present in `BaseIntegrationTest`
2. Verify `application-test.yml` exists and H2 dependency is in pom.xml
3. Run `mvn clean compile` to ensure no stale bytecode

### Issue: Tests timeout
**Cause**: Database initialization slow or network requests hanging
**Solution**:
1. Use in-memory H2 (already configured)
2. Increase command timeout: `mvn -X test`
3. Check network connectivity for external API tests

### Issue: "Cannot find symbol" errors
**Cause**: IDE not refreshing after file creation
**Solution**:
1. VS Code: Press `Ctrl+Shift+P` → **Maven: Reload Projects**
2. IntelliJ: File → Invalidate Caches → Restart
3. Terminal: `mvn clean install`

---

## Integration Test vs Unit Test

This test suite is **Integration Tests** because:
- ✅ Loads full Spring application context
- ✅ Tests HTTP endpoints with MockMvc
- ✅ Uses in-memory database
- ✅ Validates end-to-end request processing
- ✅ Tests authentication and authorization

**NOT Unit Tests** (no mocks) - those would test services in isolation with mocked repositories.

---

## Next Steps

1. **Run Tests**: `mvn test` from project root
2. **Review Results**: Check target/surefire-reports for details
3. **Add More Tests**: Create additional test classes following the same pattern
4. **CI/CD Integration**: Add Maven test goal to your CI/CD pipeline

---

## Contact & Support

If tests fail:
1. Check database connectivity in `application-test.yml`
2. Verify H2 dependency exists in `pom.xml`
3. Ensure no port conflicts (test uses random port `server.port=0`)
4. Run with verbose output: `mvn -e test`

---

**Test Status**: Ready to execute  
**Framework**: Spring Boot Test + MockMvc + JUnit 5  
**Database**: H2 In-Memory (test scope only)  
**Coverage**: 49 tests across 7 modules  
**Last Updated**: 2026-03-14
