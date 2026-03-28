-- ============================================================
-- LaptopVerse — PostgreSQL Schema
-- Database: laptop_db
-- Tạo từ database_api_spec.md
-- ============================================================

-- Xóa các bảng nếu tồn tại (thứ tự ngược lại quan hệ FK)
DROP TABLE IF EXISTS review_images CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS shipping_addresses CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS flash_sale_items CASCADE;
DROP TABLE IF EXISTS flash_sales CASCADE;
DROP TABLE IF EXISTS product_gifts CASCADE;
DROP TABLE IF EXISTS product_specs CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. USERS — Người dùng
-- ============================================================
CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(100)    NOT NULL,
    phone           VARCHAR(15)     UNIQUE,
    avatar_url      VARCHAR(500),
    role            VARCHAR(20)     NOT NULL DEFAULT 'CUSTOMER',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- ============================================================
-- 2. CATEGORIES — Danh mục sản phẩm
-- ============================================================
CREATE TABLE categories (
    id              SERIAL          PRIMARY KEY,
    name            VARCHAR(50)     NOT NULL UNIQUE,
    slug            VARCHAR(50)     NOT NULL UNIQUE,
    icon            VARCHAR(50),
    description     VARCHAR(255),
    display_order   INT             NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. BRANDS — Thương hiệu
-- ============================================================
CREATE TABLE brands (
    id              SERIAL          PRIMARY KEY,
    name            VARCHAR(50)     NOT NULL UNIQUE,
    slug            VARCHAR(50)     NOT NULL UNIQUE,
    logo_url        VARCHAR(500),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE
);

-- ============================================================
-- 4. PRODUCTS — Sản phẩm (Bảng chính)
-- ============================================================
CREATE TABLE products (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    slug            VARCHAR(200)    NOT NULL UNIQUE,
    brand_id        INT             NOT NULL REFERENCES brands(id),
    category_id     INT             NOT NULL REFERENCES categories(id),
    price           BIGINT          NOT NULL CHECK (price > 0),
    original_price  BIGINT          NOT NULL CHECK (original_price >= price),
    image           VARCHAR(500)    NOT NULL,
    rating          DECIMAL(2,1)    NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count    INT             NOT NULL DEFAULT 0,
    sold_count      INT             NOT NULL DEFAULT 0,
    badge           VARCHAR(10)     CHECK (badge IN ('Hot', 'New', 'Sale')),
    specs           JSONB           NOT NULL DEFAULT '{}',
    description     TEXT,
    stock_quantity  INT             NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Indexes cho products
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_sold ON products(sold_count DESC);
CREATE INDEX idx_products_badge ON products(badge) WHERE badge IS NOT NULL;
CREATE INDEX idx_products_specs ON products USING GIN (specs);
CREATE INDEX idx_products_slug ON products(slug);

-- ============================================================
-- 5. PRODUCT_IMAGES — Ảnh gallery sản phẩm
-- ============================================================
CREATE TABLE product_images (
    id              BIGSERIAL       PRIMARY KEY,
    product_id      BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url       VARCHAR(500)    NOT NULL,
    display_order   INT             NOT NULL DEFAULT 0,
    is_primary      BOOLEAN         NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ============================================================
-- 6. PRODUCT_SPECS — Thông số kỹ thuật chi tiết
-- ============================================================
CREATE TABLE product_specs (
    id              BIGSERIAL       PRIMARY KEY,
    product_id      BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    label           VARCHAR(50)     NOT NULL,
    value           VARCHAR(255)    NOT NULL,
    display_order   INT             NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_specs_product ON product_specs(product_id);

-- ============================================================
-- 7. PRODUCT_GIFTS — Quà tặng kèm sản phẩm
-- ============================================================
CREATE TABLE product_gifts (
    id              BIGSERIAL       PRIMARY KEY,
    product_id      BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    description     VARCHAR(255)    NOT NULL,
    display_order   INT             NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_product_gifts_product ON product_gifts(product_id);

-- ============================================================
-- 8. FLASH_SALES — Chương trình Flash Sale
-- ============================================================
CREATE TABLE flash_sales (
    id              SERIAL          PRIMARY KEY,
    title           VARCHAR(100)    NOT NULL,
    start_time      TIMESTAMPTZ     NOT NULL,
    end_time        TIMESTAMPTZ     NOT NULL CHECK (end_time > start_time),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. FLASH_SALE_ITEMS — SP tham gia Flash Sale
-- ============================================================
CREATE TABLE flash_sale_items (
    id              BIGSERIAL       PRIMARY KEY,
    flash_sale_id   INT             NOT NULL REFERENCES flash_sales(id),
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    sale_price      BIGINT          NOT NULL,
    stock_limit     INT,
    sold_count      INT             NOT NULL DEFAULT 0,
    UNIQUE (flash_sale_id, product_id)
);

CREATE INDEX idx_flash_sale_items_sale ON flash_sale_items(flash_sale_id);
CREATE INDEX idx_flash_sale_items_product ON flash_sale_items(product_id);

-- ============================================================
-- 10. CART_ITEMS — Giỏ hàng
-- ============================================================
CREATE TABLE cart_items (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity        INT             NOT NULL CHECK (quantity >= 1 AND quantity <= 10),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- ============================================================
-- 11. SHIPPING_ADDRESSES — Địa chỉ giao hàng
-- ============================================================
CREATE TABLE shipping_addresses (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    full_name       VARCHAR(100)    NOT NULL,
    phone           VARCHAR(15)     NOT NULL,
    email           VARCHAR(255),
    province        VARCHAR(50)     NOT NULL,
    district        VARCHAR(50)     NOT NULL,
    address         VARCHAR(255)    NOT NULL CHECK (LENGTH(address) >= 10),
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_addresses_user ON shipping_addresses(user_id);

-- ============================================================
-- 12. ORDERS — Đơn hàng
-- ============================================================
CREATE TABLE orders (
    id                  BIGSERIAL       PRIMARY KEY,
    order_code          VARCHAR(20)     NOT NULL UNIQUE,
    user_id             BIGINT          NOT NULL REFERENCES users(id),
    shipping_address_id BIGINT          NOT NULL REFERENCES shipping_addresses(id),
    subtotal            BIGINT          NOT NULL,
    shipping_fee        BIGINT          NOT NULL DEFAULT 0,
    total               BIGINT          NOT NULL,
    payment_method      VARCHAR(10)     NOT NULL CHECK (payment_method IN ('cod', 'vnpay')),
    payment_status      VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                        CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    order_status        VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                        CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PROCESSING',
                               'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'RETURNED')),
    note                TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_code ON orders(order_code);
CREATE INDEX idx_orders_status ON orders(order_status);

-- ============================================================
-- 13. ORDER_ITEMS — Chi tiết đơn hàng
-- ============================================================
CREATE TABLE order_items (
    id              BIGSERIAL       PRIMARY KEY,
    order_id        BIGINT          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      BIGINT          NOT NULL REFERENCES products(id),
    product_name    VARCHAR(200)    NOT NULL,
    product_image   VARCHAR(500)    NOT NULL,
    price           BIGINT          NOT NULL,
    original_price  BIGINT          NOT NULL,
    quantity        INT             NOT NULL CHECK (quantity >= 1 AND quantity <= 10),
    subtotal        BIGINT          NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- 14. REVIEWS — Đánh giá sản phẩm
-- ============================================================
CREATE TABLE reviews (
    id              BIGSERIAL       PRIMARY KEY,
    product_id      BIGINT          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    rating          INT             NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title           VARCHAR(200)    NOT NULL,
    content         TEXT            NOT NULL,
    helpful_count   INT             NOT NULL DEFAULT 0,
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, user_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================
-- 15. REVIEW_IMAGES — Ảnh đánh giá
-- ============================================================
CREATE TABLE review_images (
    id              BIGSERIAL       PRIMARY KEY,
    review_id       BIGINT          NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    image_url       VARCHAR(500)    NOT NULL,
    display_order   INT             NOT NULL DEFAULT 0
);

CREATE INDEX idx_review_images_review ON review_images(review_id);

-- ============================================================
-- TRIGGER: Tự động cập nhật updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
