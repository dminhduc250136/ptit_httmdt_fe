# KẾ HOẠCH TRIỂN KHAI BACKEND — LaptopVerse

> Dựa trên: `database_api_spec.md`, `schema.sql`, `data.sql`, `data_extra.sql`
> Stack: Spring Boot 3.2.5 / Java 17 / PostgreSQL / JPA Hibernate

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### Đã triển khai (Phase 0 — Catalog cơ bản)
| Thành phần | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Entity: `Category`, `Product`, `ProductImage`, `ProductSpecs` | ✅ Có | Nhưng dùng `UUID` thay vì `BIGSERIAL/SERIAL` như schema, thiếu nhiều trường |
| DTO: `CategoryDTO`, `ProductListDTO`, `ProductDetailDTO`, `ProductImageDTO` | ✅ Có | Thiếu nhiều trường so với API spec |
| `GET /api/v1/categories` | ✅ Có | Thiếu `icon`, `description`, `productCount` |
| `GET /api/v1/products` (filter cơ bản) | ✅ Có | Chỉ filter `categoryId`, `brand` — thiếu price range, sort, search, v.v. |
| `GET /api/v1/products/{id}` | ✅ Có | Thiếu `gallery`, `detailedSpecs`, `gifts`, `reviewSummary`, `discountPercent` |
| Exception handling | ✅ Có | `ResourceNotFoundException` + `GlobalExceptionHandler` |
| `application.yml` + PostgreSQL | ✅ Có | |
| `pom.xml` (Spring Boot, JPA, Lombok, SpringDoc) | ✅ Có | Thiếu Spring Security, JWT, Validation |

### Vấn đề cần sửa (Entity mismatch vs schema.sql)
| Entity hiện tại | Schema.sql | Cần sửa |
|----------------|-----------|---------|
| `Product.id` = UUID | `products.id` = BIGSERIAL | ⚠️ Đổi sang `Long` |
| `Category.id` = UUID | `categories.id` = SERIAL | ⚠️ Đổi sang `Integer` |
| `ProductImage.id` = UUID | `product_images.id` = BIGSERIAL | ⚠️ Đổi sang `Long` |
| `Product.sku` | Không có trong schema | ⚠️ Xóa field |
| `Product.brand` = String | `products.brand_id` = FK → brands | ⚠️ Đổi sang `@ManyToOne Brand` |
| `Product.thumbnailUrl` | `products.image` | ⚠️ Đổi tên |
| Thiếu: `slug`, `rating`, `reviewCount`, `soldCount`, `badge`, `isActive` | Có trong schema | ⚠️ Thêm |
| `ProductSpecs.vga`, `screen` | Schema: `cpu`, `ram`, `storage`, `display` | ⚠️ Đổi tên field |
| Thiếu entity: `Brand`, `ProductGift`, `ProductSpec(detailed)` | Có trong schema | ⚠️ Tạo mới |

---

## 🗺️ KẾ HOẠCH TRIỂN KHAI — 7 PHASE

---

### PHASE 1: Fix Entity Layer + Align với Schema
> **Mục tiêu:** Toàn bộ entity khớp 100% với `schema.sql`
> **Ưu tiên:** 🔴 Cao nhất (nền tảng)

#### 1.1. Sửa Entity hiện có

**`Category.java`** — Thêm/sửa:
```
- id: UUID → Integer (SERIAL)
- Thêm: icon (VARCHAR 50), description (VARCHAR 255), displayOrder (INT), isActive (BOOLEAN)
- Xóa: updatedAt (schema không có)
```

**`Product.java`** — Thay đổi lớn:
```
- id: UUID → Long (BIGSERIAL)
- Xóa: sku (không có trong schema)
- brand: String → @ManyToOne Brand entity
- thumbnailUrl → image (VARCHAR 500)
- Thêm: slug, rating, reviewCount, soldCount, badge, isActive
- price/originalPrice: BigDecimal → Long (VNĐ, không decimal)
- specs JSONB giữ nguyên nhưng sửa field name
```

**`ProductImage.java`** — Sửa:
```
- id: UUID → Long (BIGSERIAL)
```

**`ProductSpecs.java`** — Sửa field names:
```
- vga → (xóa, không có trong JSONB spec)
- screen → display
- Giữ: cpu, ram, storage
- Thêm: display
```

#### 1.2. Tạo Entity mới

| Entity | Bảng DB | Các trường chính |
|--------|---------|-----------------|
| **`Brand`** | `brands` | id (Integer), name, slug, logoUrl, isActive |
| **`ProductSpec`** | `product_specs` | id (Long), product, label, value, displayOrder |
| **`ProductGift`** | `product_gifts` | id (Long), product, description, displayOrder, isActive |
| **`User`** | `users` | id (Long), email, passwordHash, fullName, phone, avatarUrl, role, isActive |
| **`CartItem`** | `cart_items` | id (Long), user, product, quantity |
| **`ShippingAddress`** | `shipping_addresses` | id (Long), user, fullName, phone, email, province, district, address, isDefault |
| **`Order`** | `orders` | id (Long), orderCode, user, shippingAddress, subtotal, shippingFee, total, paymentMethod, paymentStatus, orderStatus, note |
| **`OrderItem`** | `order_items` | id (Long), order, product, productName, productImage, price, originalPrice, quantity, subtotal |
| **`FlashSale`** | `flash_sales` | id (Integer), title, startTime, endTime, isActive |
| **`FlashSaleItem`** | `flash_sale_items` | id (Long), flashSale, product, salePrice, stockLimit, soldCount |
| **`Review`** | `reviews` | id (Long), product, user, rating, title, content, helpfulCount, isVerified, isActive |
| **`ReviewImage`** | `review_images` | id (Long), review, imageUrl, displayOrder |

#### 1.3. Tạo Enum

| Enum | Giá trị |
|------|--------|
| `UserRole` | `CUSTOMER`, `ADMIN` |
| `Badge` | `Hot`, `New`, `Sale` |
| `PaymentMethod` | `COD`, `VNPAY` |
| `PaymentStatus` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `OrderStatus` | `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPING`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED` |

#### 1.4. Cập nhật Repository

```
- CategoryRepository: JpaRepository<Category, Integer>
- ProductRepository: JpaRepository<Product, Long> — thêm nhiều query methods
- BrandRepository: JpaRepository<Brand, Integer>
- ReviewRepository, OrderRepository, CartItemRepository, ...
```

**Deliverables Phase 1:**
- [ ] 12 entity classes khớp schema
- [ ] 5 enum classes
- [ ] Repository interfaces cho tất cả entity
- [ ] `mvn clean compile` thành công

---

### PHASE 2: Hoàn thiện Catalog API (Public)
> **Mục tiêu:** Hoàn thiện 100% các API public cho Catalog
> **Ưu tiên:** 🔴 Cao

#### 2.1. `GET /api/v1/categories` — Cập nhật
```
Response thêm: icon, description, productCount (COUNT products theo category)
```

#### 2.2. `GET /api/v1/brands` — MỚI
```
Response: id, name, slug, productCount
```

#### 2.3. `GET /api/v1/products` — Nâng cấp filter + sort
Thêm query params:
```
- category (slug thay vì categoryId)
- brand[] (multi-select)
- priceMin, priceMax
- cpuFamily[]
- ram[]
- badge
- search (LIKE trên name)
- sortBy: popular, newest, price-asc, price-desc, rating
- page (1-indexed theo spec), size (default 18)
```

Response thêm fields:
```
- slug, category, discountPercent, rating, reviewCount, soldCount, badge, specs
```

**Kỹ thuật:** Dùng `JpaSpecificationExecutor` hoặc `@Query` native cho dynamic filter.

#### 2.4. `GET /api/v1/products/{id}` — Nâng cấp
Response thêm:
```
- brand object: {id, name}
- category object: {id, name, slug}
- gallery[] (từ product_images)
- detailedSpecs[] (từ product_specs)
- gifts[] (từ product_gifts)
- discountPercent (tính toán)
- isFlashSale (check flash_sale_items)
```

#### 2.5. `GET /api/v1/products/{id}/related` — MỚI
```
Cùng category, khác ID, limit 6, trả về ProductListDTO[]
```

**Deliverables Phase 2:**
- [ ] CategoryDTO mở rộng (icon, description, productCount)
- [ ] BrandController + BrandDTO + BrandService
- [ ] ProductListDTO mở rộng (slug, category, discount, rating, badge, specs)
- [ ] ProductDetailDTO mở rộng (gallery, detailedSpecs, gifts, brand obj, category obj)
- [ ] Advanced filtering với Specification pattern
- [ ] Sorting 5 options
- [ ] Related products endpoint
- [ ] Tất cả API trả đúng format JSON như spec

---

### PHASE 3: Flash Sale API (Public)
> **Mục tiêu:** API flash sale cho trang chủ
> **Ưu tiên:** 🟡 Trung bình

#### 3.1. `GET /api/v1/flash-sales/active` — MỚI

Logic:
```
1. Tìm flash_sale có is_active=true AND NOW() BETWEEN start_time AND end_time
2. JOIN flash_sale_items → products
3. Trả về: thông tin flash sale + danh sách SP kèm flashSalePrice, stockLimit, flashSaleSold
```

**Deliverables Phase 3:**
- [ ] FlashSaleController
- [ ] FlashSaleService / FlashSaleServiceImpl
- [ ] FlashSaleDTO, FlashSaleProductDTO
- [ ] FlashSaleRepository, FlashSaleItemRepository
- [ ] Query tìm flash sale đang active

---

### PHASE 4: Authentication & Security
> **Mục tiêu:** JWT Auth cho các API protected
> **Ưu tiên:** 🔴 Cao (blocker cho Cart, Order, Review)

#### 4.1. Thêm Dependencies (pom.xml)
```xml
- spring-boot-starter-security
- spring-boot-starter-validation
- jjwt-api + jjwt-impl + jjwt-jackson (io.jsonwebtoken 0.12.x)
```

#### 4.2. Security Config
```
- SecurityFilterChain: permit public endpoints, authenticate còn lại
- JwtAuthenticationFilter: đọc token từ header Authorization: Bearer <token>
- JwtTokenProvider: generate/validate/parse JWT
- UserDetailsService implementation
- PasswordEncoder (BCrypt)
- CORS config cho frontend (localhost:3000)
```

#### 4.3. Auth Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/auth/register` | POST | Đăng ký |
| `/api/v1/auth/login` | POST | Đăng nhập |
| `/api/v1/auth/me` | GET 🔒 | Thông tin user hiện tại |

#### 4.4. DTOs
```
- RegisterRequest: fullName, email, phone, password
- LoginRequest: email, password
- AuthResponse: id, email, fullName, role, token
- UserProfileDTO: id, email, fullName, phone, avatarUrl, role
```

**Deliverables Phase 4:**
- [ ] Spring Security config (SecurityFilterChain)
- [ ] JWT token provider (generate, validate, parse)
- [ ] JwtAuthenticationFilter
- [ ] AuthController + AuthService
- [ ] Register (BCrypt hash, check duplicate email/phone)
- [ ] Login (verify credentials, trả JWT)
- [ ] GET /auth/me (trả profile từ token)
- [ ] CORS config
- [ ] Validation annotations (@Valid, @NotBlank, @Email, @Pattern)

---

### PHASE 5: Cart API (Authenticated)
> **Mục tiêu:** CRUD giỏ hàng
> **Ưu tiên:** 🔴 Cao

#### 5.1. Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/cart` | GET 🔒 | Lấy giỏ hàng |
| `/api/v1/cart/items` | POST 🔒 | Thêm SP (hoặc +1 nếu đã có) |
| `/api/v1/cart/items/{productId}` | PUT 🔒 | Cập nhật quantity |
| `/api/v1/cart/items/{productId}` | DELETE 🔒 | Xóa 1 SP |
| `/api/v1/cart` | DELETE 🔒 | Clear cart |

#### 5.2. Business Logic
```
- Thêm SP đã có → quantity + 1 (max 10)
- Update quantity ≤ 0 → xóa item
- Max 10 SP cùng loại
- Trả về CartDTO: items[], totalItems, totalPrice
- Mỗi item kèm thông tin SP (name, price, image, specs, stockQuantity)
```

**Deliverables Phase 5:**
- [ ] CartItemRepository
- [ ] CartController
- [ ] CartService / CartServiceImpl
- [ ] CartDTO, CartItemDTO, AddToCartRequest, UpdateCartRequest
- [ ] Business logic: duplicate handling, max quantity, auto-delete

---

### PHASE 6: Order API (Authenticated)
> **Mục tiêu:** Đặt hàng + quản lý đơn
> **Ưu tiên:** 🔴 Cao

#### 6.1. Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/orders` | POST 🔒 | Tạo đơn hàng |
| `/api/v1/orders` | GET 🔒 | Danh sách đơn (paginated) |
| `/api/v1/orders/{orderCode}` | GET 🔒 | Chi tiết đơn |
| `/api/v1/orders/{orderCode}/cancel` | PUT 🔒 | Hủy đơn |

#### 6.2. Business Logic — Tạo đơn
```
1. Validate shipping address (fullName 3+, phone regex, address 10+)
2. Validate items: check stock_quantity >= ordered quantity
3. Snapshot giá SP vào order_items (không dùng giá hiện tại sau này)
4. Tính subtotal = SUM(price × quantity)
5. shippingFee = subtotal >= 20,000,000 ? 0 : 150,000
6. total = subtotal + shippingFee
7. Generate orderCode: "LV-" + 8 random digits
8. Save order + order_items
9. Giảm stock_quantity, tăng sold_count cho mỗi SP
10. Xóa cart items đã đặt
11. Save/reuse shipping address
```

#### 6.3. Hủy đơn
```
- Chỉ cho phép khi status = PENDING hoặc CONFIRMED
- Set orderStatus = CANCELLED
- Hoàn lại stock_quantity, giảm sold_count
```

**Deliverables Phase 6:**
- [ ] OrderController
- [ ] OrderService / OrderServiceImpl
- [ ] CreateOrderRequest, OrderDTO, OrderListDTO, OrderItemDTO, ShippingAddressDTO
- [ ] Order code generator (LV-XXXXXXXX)
- [ ] Stock management (giảm khi đặt, hoàn khi hủy)
- [ ] Shipping fee calculation
- [ ] Transactional consistency

---

### PHASE 7: Reviews + Addresses + Admin APIs
> **Mục tiêu:** Hoàn thiện toàn bộ API spec
> **Ưu tiên:** 🟡 Trung bình

#### 7.1. Review Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/products/{productId}/reviews` | GET | Lấy reviews (paginated + summary) |
| `/api/v1/products/{productId}/reviews` | POST 🔒 | Tạo review (chỉ khi đã mua) |
| `/api/v1/reviews/{reviewId}/helpful` | POST 🔒 | Vote hữu ích |

Business logic:
```
- 1 user / 1 review / 1 SP
- is_verified = true nếu user có order COMPLETED chứa SP đó
- Khi thêm/xóa review → recalc products.rating & review_count
- Summary: avgRating, totalReviews, distribution {5: x, 4: x, ...}
```

#### 7.2. Shipping Addresses

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/addresses` | GET 🔒 | Danh sách địa chỉ |
| `/api/v1/addresses` | POST 🔒 | Thêm địa chỉ |
| `/api/v1/addresses/{id}` | PUT 🔒 | Cập nhật |
| `/api/v1/addresses/{id}` | DELETE 🔒 | Xóa |

#### 7.3. Admin APIs (role = ADMIN)

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/admin/products` | POST | Tạo SP |
| `/api/v1/admin/products/{id}` | PUT | Cập nhật SP |
| `/api/v1/admin/products/{id}` | DELETE | Soft delete SP |
| `/api/v1/admin/categories` | POST | Tạo danh mục |
| `/api/v1/admin/categories/{id}` | PUT | Cập nhật danh mục |
| `/api/v1/admin/brands` | POST | Tạo thương hiệu |
| `/api/v1/admin/flash-sales` | POST | Tạo flash sale |
| `/api/v1/admin/flash-sales/{id}` | PUT | Cập nhật flash sale |
| `/api/v1/admin/orders` | GET | Tất cả đơn hàng |
| `/api/v1/admin/orders/{orderCode}/status` | PUT | Cập nhật trạng thái đơn |
| `/api/v1/admin/dashboard/stats` | GET | Thống kê dashboard |

**Deliverables Phase 7:**
- [ ] ReviewController, ReviewService
- [ ] ReviewDTO, ReviewSummaryDTO, CreateReviewRequest
- [ ] ShippingAddressController, ShippingAddressService
- [ ] AdminProductController, AdminOrderController, AdminDashboardController
- [ ] Role-based authorization (`@PreAuthorize("hasRole('ADMIN')")`)

---

## 📁 CẤU TRÚC THƯ MỤC SAU KHI HOÀN THÀNH

```
src/main/java/com/laptopshop/
├── LaptopShopApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── JacksonConfig.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── SecurityUtils.java
├── controller/
│   ├── AuthController.java
│   ├── CategoryController.java
│   ├── BrandController.java
│   ├── ProductController.java
│   ├── FlashSaleController.java
│   ├── CartController.java
│   ├── OrderController.java
│   ├── ReviewController.java
│   ├── ShippingAddressController.java
│   └── admin/
│       ├── AdminProductController.java
│       ├── AdminCategoryController.java
│       ├── AdminBrandController.java
│       ├── AdminFlashSaleController.java
│       ├── AdminOrderController.java
│       └── AdminDashboardController.java
├── service/
│   ├── AuthService.java
│   ├── CategoryService.java
│   ├── BrandService.java
│   ├── ProductService.java
│   ├── FlashSaleService.java
│   ├── CartService.java
│   ├── OrderService.java
│   ├── ReviewService.java
│   ├── ShippingAddressService.java
│   └── impl/
│       ├── AuthServiceImpl.java
│       ├── CategoryServiceImpl.java
│       ├── BrandServiceImpl.java
│       ├── ProductServiceImpl.java
│       ├── FlashSaleServiceImpl.java
│       ├── CartServiceImpl.java
│       ├── OrderServiceImpl.java
│       ├── ReviewServiceImpl.java
│       └── ShippingAddressServiceImpl.java
├── repository/
│   ├── UserRepository.java
│   ├── CategoryRepository.java
│   ├── BrandRepository.java
│   ├── ProductRepository.java
│   ├── ProductSpecRepository.java
│   ├── ProductGiftRepository.java
│   ├── ProductImageRepository.java
│   ├── FlashSaleRepository.java
│   ├── FlashSaleItemRepository.java
│   ├── CartItemRepository.java
│   ├── ShippingAddressRepository.java
│   ├── OrderRepository.java
│   ├── OrderItemRepository.java
│   ├── ReviewRepository.java
│   └── ReviewImageRepository.java
├── entity/
│   ├── User.java
│   ├── Category.java
│   ├── Brand.java
│   ├── Product.java
│   ├── ProductImage.java
│   ├── ProductSpecs.java          (JSONB value object)
│   ├── ProductSpec.java           (detailed specs table)
│   ├── ProductGift.java
│   ├── FlashSale.java
│   ├── FlashSaleItem.java
│   ├── CartItem.java
│   ├── ShippingAddress.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── Review.java
│   └── ReviewImage.java
├── entity/enums/
│   ├── UserRole.java
│   ├── Badge.java
│   ├── PaymentMethod.java
│   ├── PaymentStatus.java
│   └── OrderStatus.java
├── dto/
│   ├── auth/
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   ├── AuthResponse.java
│   │   └── UserProfileDTO.java
│   ├── category/
│   │   └── CategoryDTO.java
│   ├── brand/
│   │   └── BrandDTO.java
│   ├── product/
│   │   ├── ProductListDTO.java
│   │   ├── ProductDetailDTO.java
│   │   ├── ProductImageDTO.java
│   │   ├── ProductSpecDTO.java
│   │   └── ProductSpecsDTO.java
│   ├── flashsale/
│   │   ├── FlashSaleDTO.java
│   │   └── FlashSaleProductDTO.java
│   ├── cart/
│   │   ├── CartDTO.java
│   │   ├── CartItemDTO.java
│   │   ├── AddToCartRequest.java
│   │   └── UpdateCartRequest.java
│   ├── order/
│   │   ├── CreateOrderRequest.java
│   │   ├── OrderDTO.java
│   │   ├── OrderListDTO.java
│   │   ├── OrderItemDTO.java
│   │   └── ShippingAddressDTO.java
│   └── review/
│       ├── ReviewDTO.java
│       ├── ReviewSummaryDTO.java
│       └── CreateReviewRequest.java
└── exception/
    ├── ResourceNotFoundException.java
    ├── BadRequestException.java
    ├── DuplicateResourceException.java
    ├── InsufficientStockException.java
    ├── UnauthorizedException.java
    ├── ErrorResponse.java
    └── GlobalExceptionHandler.java
```

---

## 📦 DEPENDENCIES CẦN THÊM (pom.xml)

```xml
<!-- Phase 4: Security + JWT -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Phase 4: Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## 🔄 THỨ TỰ TRIỂN KHAI ĐỀ XUẤT

```
Phase 1 ──→ Phase 2 ──→ Phase 3
  (Entity)    (Catalog)   (Flash Sale)
                │
                ▼
             Phase 4 ──→ Phase 5 ──→ Phase 6 ──→ Phase 7
             (Auth/JWT)   (Cart)      (Order)     (Review+Admin)
```

| Phase | Số file mới/sửa (ước tính) | Độ phức tạp |
|-------|---------------------------|------------|
| Phase 1 | ~17 files (12 entity + 5 enum) | ⭐⭐ |
| Phase 2 | ~12 files (controller, service, DTO, repo) | ⭐⭐⭐ |
| Phase 3 | ~6 files | ⭐⭐ |
| Phase 4 | ~10 files (security chain) | ⭐⭐⭐⭐ |
| Phase 5 | ~8 files | ⭐⭐ |
| Phase 6 | ~10 files | ⭐⭐⭐⭐ |
| Phase 7 | ~15 files | ⭐⭐⭐ |

**Tổng: ~78 files Java** (entity + enum + DTO + service + controller + security + config + exception)

---

## ✅ CHECKLIST TỔNG QUAN

### API Endpoints (24 endpoints)

| # | Endpoint | Method | Auth | Phase |
|---|----------|--------|------|-------|
| 1 | `/api/v1/auth/register` | POST | — | 4 |
| 2 | `/api/v1/auth/login` | POST | — | 4 |
| 3 | `/api/v1/auth/me` | GET | 🔒 | 4 |
| 4 | `/api/v1/categories` | GET | — | 2 |
| 5 | `/api/v1/brands` | GET | — | 2 |
| 6 | `/api/v1/products` | GET | — | 2 |
| 7 | `/api/v1/products/{id}` | GET | — | 2 |
| 8 | `/api/v1/products/{id}/related` | GET | — | 2 |
| 9 | `/api/v1/flash-sales/active` | GET | — | 3 |
| 10 | `/api/v1/cart` | GET | 🔒 | 5 |
| 11 | `/api/v1/cart/items` | POST | 🔒 | 5 |
| 12 | `/api/v1/cart/items/{productId}` | PUT | 🔒 | 5 |
| 13 | `/api/v1/cart/items/{productId}` | DELETE | 🔒 | 5 |
| 14 | `/api/v1/cart` | DELETE | 🔒 | 5 |
| 15 | `/api/v1/orders` | POST | 🔒 | 6 |
| 16 | `/api/v1/orders` | GET | 🔒 | 6 |
| 17 | `/api/v1/orders/{orderCode}` | GET | 🔒 | 6 |
| 18 | `/api/v1/orders/{orderCode}/cancel` | PUT | 🔒 | 6 |
| 19 | `/api/v1/products/{productId}/reviews` | GET | — | 7 |
| 20 | `/api/v1/products/{productId}/reviews` | POST | 🔒 | 7 |
| 21 | `/api/v1/reviews/{reviewId}/helpful` | POST | 🔒 | 7 |
| 22 | `/api/v1/addresses` | GET/POST | 🔒 | 7 |
| 23 | `/api/v1/addresses/{id}` | PUT/DELETE | 🔒 | 7 |
| 24 | `/api/v1/admin/*` (11 endpoints) | Various | 🔐 ADMIN | 7 |

### Database Tables (15 bảng)

| # | Bảng | Entity | Phase |
|---|------|--------|-------|
| 1 | `users` | `User` | 1 |
| 2 | `categories` | `Category` | 1 (sửa) |
| 3 | `brands` | `Brand` | 1 |
| 4 | `products` | `Product` | 1 (sửa) |
| 5 | `product_images` | `ProductImage` | 1 (sửa) |
| 6 | `product_specs` | `ProductSpec` | 1 |
| 7 | `product_gifts` | `ProductGift` | 1 |
| 8 | `flash_sales` | `FlashSale` | 1 |
| 9 | `flash_sale_items` | `FlashSaleItem` | 1 |
| 10 | `cart_items` | `CartItem` | 1 |
| 11 | `shipping_addresses` | `ShippingAddress` | 1 |
| 12 | `orders` | `Order` | 1 |
| 13 | `order_items` | `OrderItem` | 1 |
| 14 | `reviews` | `Review` | 1 |
| 15 | `review_images` | `ReviewImage` | 1 |

---

> 📅 Kế hoạch tạo: 2026-03-12
> 🎯 Tiếp theo: Bắt đầu **Phase 1** — Fix Entity Layer
