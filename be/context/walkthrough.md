# Spring Boot E-commerce Catalog API — Walkthrough

## What Was Built

A complete RESTful API for the **Catalog flow** (Products & Categories) of a Laptop E-commerce system using Spring Boot 3.2.5 + Java 17 + PostgreSQL.

## Project Structure

```
be/
├── pom.xml
└── src/main/
    ├── resources/
    │   └── application.yml
    └── java/com/laptopshop/
        ├── LaptopShopApplication.java
        ├── controller/
        │   ├── CategoryController.java
        │   └── ProductController.java
        ├── service/
        │   ├── CategoryService.java          (interface)
        │   ├── ProductService.java           (interface)
        │   └── impl/
        │       ├── CategoryServiceImpl.java
        │       └── ProductServiceImpl.java
        ├── repository/
        │   ├── CategoryRepository.java
        │   └── ProductRepository.java
        ├── entity/
        │   ├── Category.java
        │   ├── Product.java
        │   ├── ProductImage.java
        │   └── ProductSpecs.java
        ├── dto/
        │   ├── CategoryDTO.java
        │   ├── ProductListDTO.java
        │   ├── ProductDetailDTO.java
        │   └── ProductImageDTO.java
        └── exception/
            ├── ResourceNotFoundException.java
            ├── ErrorResponse.java
            └── GlobalExceptionHandler.java
```

## Enterprise Patterns Applied

| Pattern | Implementation |
|---|---|
| **Constructor Injection** | `@RequiredArgsConstructor` on all services and controllers — no `@Autowired` |
| **Service Interface + Impl** | [CategoryService](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/service/CategoryService.java#7-11) / [CategoryServiceImpl](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/service/impl/CategoryServiceImpl.java#13-31), [ProductService](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/service/ProductService.java#9-15) / [ProductServiceImpl](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/service/impl/ProductServiceImpl.java#21-80) |
| **Entity Isolation** | All controllers return DTOs only, never `@Entity` classes |
| **Global Exception Handling** | `@RestControllerAdvice` catching [ResourceNotFoundException](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/exception/ResourceNotFoundException.java#3-13) → 404 JSON |
| **JSONB Mapping** | `@JdbcTypeCode(SqlTypes.JSON)` on `Product.specs` mapped to [ProductSpecs](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/entity/ProductSpecs.java#7-20) class |
| **Pagination** | `Page<ProductListDTO>` via Spring Data `Pageable` |

## API Endpoints

| Method | Endpoint | Response | Description |
|---|---|---|---|
| `GET` | `/api/v1/categories` | `List<CategoryDTO>` | All categories |
| `GET` | `/api/v1/products?categoryId=&brand=&page=0&size=12` | `Page<ProductListDTO>` | Paginated product grid |
| `GET` | `/api/v1/products/{id}` | [ProductDetailDTO](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/be/src/main/java/com/laptopshop/dto/ProductDetailDTO.java#10-29) | Full product details |

## Build Verification

✅ `mvn clean compile` — **BUILD SUCCESS** (Java 17, 7.1s)

## How to Run

```bash
# Set JAVA_HOME to Java 17
set JAVA_HOME=C:\Program Files\Java\jdk-17

# Run the application (requires PostgreSQL at localhost:5432/laptop_db)
mvn spring-boot:run
```

> [!NOTE]
> The database must already exist with tables `categories`, `products`, `product_images` since `ddl-auto=none`.
