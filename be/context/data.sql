-- ============================================================
-- LaptopVerse — Seed Data cho PostgreSQL
-- Chạy SAU schema.sql
-- Dữ liệu trích xuất từ mockData.ts (FE)
-- ============================================================

BEGIN;

-- ============================================================
-- 1. USERS — Tài khoản mẫu
-- password_hash = BCrypt('123456')
-- ============================================================
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@laptopverse.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin LaptopVerse', '0901000000', 'ADMIN'),
('nguyenvana@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nguyễn Văn A', '0912345678', 'CUSTOMER'),
('tranthib@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Trần Thị B', '0923456789', 'CUSTOMER'),
('levanc@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lê Văn C', '0934567890', 'CUSTOMER'),
('phamthid@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Phạm Thị D', '0945678901', 'CUSTOMER');

-- ============================================================
-- 2. CATEGORIES — Danh mục
-- ============================================================
INSERT INTO categories (name, slug, icon, description, display_order) VALUES
('Gaming',    'gaming',    'Gamepad2',  'Laptop gaming hiệu năng cao', 1),
('Văn phòng', 'van-phong', 'Briefcase', 'Laptop văn phòng cao cấp',    2),
('Apple',     'apple',     'Laptop',    'MacBook chính hãng',           3);

-- ============================================================
-- 3. BRANDS — Thương hiệu
-- ============================================================
INSERT INTO brands (name, slug) VALUES
('Acer',   'acer'),
('Apple',  'apple'),
('ASUS',   'asus'),
('Dell',   'dell'),
('HP',     'hp'),
('Lenovo', 'lenovo'),
('MSI',    'msi'),
('Razer',  'razer');

-- ============================================================
-- 4. PRODUCTS — 18 sản phẩm từ mockData.ts
-- brand_id: 1=Acer, 2=Apple, 3=ASUS, 4=Dell, 5=HP, 6=Lenovo, 7=MSI, 8=Razer
-- category_id: 1=Gaming, 2=Văn phòng, 3=Apple
-- ============================================================
INSERT INTO products (id, name, slug, brand_id, category_id, price, original_price, image, rating, review_count, sold_count, badge, specs, description, stock_quantity) VALUES
-- 1. ASUS ROG Strix G16 2024
(1, 'ASUS ROG Strix G16 2024', 'asus-rog-strix-g16-2024', 3, 1, 42990000, 49990000,
 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop',
 4.8, 234, 1520, 'Hot',
 '{"cpu":"Intel Core i9-14900HX","ram":"32GB DDR5","storage":"1TB SSD NVMe","display":"16\" QHD+ 240Hz"}',
 'ASUS ROG Strix G16 2024 là chiếc laptop gaming đỉnh cao được trang bị bộ vi xử lý Intel Core i9-14900HX thế hệ mới nhất cùng card đồ họa NVIDIA GeForce RTX 4080, mang đến hiệu năng gaming vượt trội trong mọi tựa game AAA hiện đại.', 50),

-- 2. MacBook Pro 16 M3 Max
(2, 'MacBook Pro 16 M3 Max', 'macbook-pro-16-m3-max', 2, 3, 89990000, 96990000,
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
 4.9, 567, 2340, 'Hot',
 '{"cpu":"Apple M3 Max","ram":"48GB Unified","storage":"1TB SSD","display":"16.2\" Liquid Retina XDR"}',
 'MacBook Pro 16 inch với chip M3 Max là đỉnh cao của dòng laptop chuyên nghiệp từ Apple. Chip M3 Max với 16 nhân CPU và 40 nhân GPU mang lại hiệu năng phi thường cho mọi tác vụ.', 30),

-- 3. MSI Titan 18 HX 2024
(3, 'MSI Titan 18 HX 2024', 'msi-titan-18-hx-2024', 7, 1, 119990000, 129990000,
 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop',
 4.7, 89, 456, 'New',
 '{"cpu":"Intel Core i9-14900HX","ram":"64GB DDR5","storage":"2TB SSD NVMe RAID","display":"18\" UHD+ 120Hz Mini LED"}',
 'MSI Titan 18 HX 2024 — Đỉnh cao của công nghệ laptop gaming với màn hình Mini LED 18 inch UHD+ lần đầu được tích hợp vào laptop.', 15),

-- 4. Dell XPS 16 9640
(4, 'Dell XPS 16 9640', 'dell-xps-16-9640', 4, 2, 45990000, 52990000,
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop',
 4.6, 345, 1890, 'Sale',
 '{"cpu":"Intel Core Ultra 9 185H","ram":"32GB LPDDR5x","storage":"1TB SSD","display":"16\" OLED 3.8K Touch"}',
 'Dell XPS 16 9640 là biểu tượng của sự tinh tế trong thiết kế laptop. Màn hình OLED InfinityEdge 3.8K cảm ứng mang lại trải nghiệm hình ảnh sống động.', 40),

-- 5. Lenovo ThinkPad X1 Carbon Gen 12
(5, 'Lenovo ThinkPad X1 Carbon Gen 12', 'lenovo-thinkpad-x1-carbon-gen-12', 6, 2, 38990000, 42990000,
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
 4.5, 678, 3200, 'Hot',
 '{"cpu":"Intel Core Ultra 7 155H","ram":"32GB LPDDR5x","storage":"512GB SSD","display":"14\" 2.8K OLED"}',
 'ThinkPad X1 Carbon Gen 12 tiếp tục di sản huyền thoại với chất lượng xây dựng đạt chuẩn quân sự MIL-SPEC 810H. Siêu nhẹ chỉ 1.12kg.', 60),

-- 6. MacBook Air 15 M3
(6, 'MacBook Air 15 M3', 'macbook-air-15-m3', 2, 3, 37990000, 39990000,
 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop',
 4.8, 890, 4500, 'Hot',
 '{"cpu":"Apple M3","ram":"24GB Unified","storage":"512GB SSD","display":"15.3\" Liquid Retina"}',
 'MacBook Air 15 inch M3 — Chiếc laptop 15 inch mỏng nhẹ nhất thế giới. Thiết kế không quạt hoàn toàn im lặng.', 80),

-- 7. Razer Blade 16 2024
(7, 'Razer Blade 16 2024', 'razer-blade-16-2024', 8, 1, 79990000, 89990000,
 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop',
 4.6, 156, 670, 'Sale',
 '{"cpu":"Intel Core i9-14900HX","ram":"32GB DDR5","storage":"1TB SSD NVMe","display":"16\" UHD+ 120Hz OLED"}',
 'Razer Blade 16 2024 — Bezel mỏng nhất trong lịch sử dòng Blade với màn hình OLED UHD+ 16 inch 120Hz.', 20),

-- 8. HP Spectre x360 16
(8, 'HP Spectre x360 16', 'hp-spectre-x360-16', 5, 2, 41990000, 47990000,
 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop',
 4.5, 234, 1100, 'New',
 '{"cpu":"Intel Core Ultra 7 155H","ram":"32GB LPDDR5x","storage":"1TB SSD","display":"16\" 3K OLED Touch"}',
 'HP Spectre x360 16 — 2-in-1 cao cấp nhất của HP với khả năng xoay 360 độ. Màn hình OLED cảm ứng 3K.', 35),

-- 9. Acer Predator Helios Neo 16
(9, 'Acer Predator Helios Neo 16', 'acer-predator-helios-neo-16', 1, 1, 34990000, 39990000,
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop',
 4.4, 445, 2100, 'Sale',
 '{"cpu":"Intel Core i7-14700HX","ram":"16GB DDR5","storage":"1TB SSD NVMe","display":"16\" WQXGA 165Hz"}',
 'Acer Predator Helios Neo 16 — Gaming laptop với hiệu năng cao cấp ở mức giá cạnh tranh.', 55),

-- 10. MacBook Pro 14 M3 Pro
(10, 'MacBook Pro 14 M3 Pro', 'macbook-pro-14-m3-pro', 2, 3, 54990000, 59990000,
 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
 4.9, 1023, 5600, NULL,
 '{"cpu":"Apple M3 Pro","ram":"36GB Unified","storage":"1TB SSD","display":"14.2\" Liquid Retina XDR"}',
 'MacBook Pro 14 M3 Pro — Sức mạnh chuyên nghiệp trong form factor nhỏ gọn.', 70),

-- 11. ASUS ZenBook 14 OLED
(11, 'ASUS ZenBook 14 OLED', 'asus-zenbook-14-oled', 3, 2, 28990000, 32990000,
 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop',
 4.5, 312, 1800, 'Sale',
 '{"cpu":"Intel Core Ultra 7 155H","ram":"16GB LPDDR5x","storage":"512GB SSD","display":"14\" 2.8K OLED"}',
 'ASUS ZenBook 14 OLED — Laptop văn phòng cao cấp với màn hình OLED sắc nét tuyệt đối.', 45),

-- 12. MSI Stealth 16 Studio
(12, 'MSI Stealth 16 Studio', 'msi-stealth-16-studio', 7, 1, 62990000, 69990000,
 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop',
 4.6, 178, 890, 'New',
 '{"cpu":"Intel Core i9-14900HX","ram":"32GB DDR5","storage":"2TB SSD NVMe","display":"16\" QHD+ 240Hz"}',
 'MSI Stealth 16 Studio — Thiết kế mỏng nhẹ kết hợp sức mạnh RTX 4080 cho sáng tạo nội dung chuyên nghiệp.', 25),

-- 13. Dell Inspiron 16 Plus
(13, 'Dell Inspiron 16 Plus', 'dell-inspiron-16-plus', 4, 2, 24990000, 27990000,
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop',
 4.3, 567, 2800, NULL,
 '{"cpu":"Intel Core i7-13700H","ram":"16GB DDR5","storage":"512GB SSD","display":"16\" 2.5K IPS"}',
 'Dell Inspiron 16 Plus — Laptop phổ thông cao cấp với màn hình 2.5K rộng lớn.', 90),

-- 14. Lenovo Legion Pro 5 16
(14, 'Lenovo Legion Pro 5 16', 'lenovo-legion-pro-5-16', 6, 1, 48990000, 54990000,
 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop',
 4.7, 234, 1340, 'Hot',
 '{"cpu":"Intel Core i9-14900HX","ram":"32GB DDR5","storage":"1TB SSD NVMe","display":"16\" WQXGA 240Hz"}',
 'Lenovo Legion Pro 5 16 — Hiệu năng gaming cực đỉnh với RTX 4070 Ti Super và màn hình 240Hz.', 40),

-- 15. HP Envy 16
(15, 'HP Envy 16', 'hp-envy-16', 5, 2, 32990000, 36990000,
 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop',
 4.4, 189, 950, NULL,
 '{"cpu":"Intel Core i7-13700H","ram":"16GB DDR5","storage":"1TB SSD","display":"16\" 2.5K IPS Touch"}',
 'HP Envy 16 — Laptop sáng tạo cao cấp với màn hình cảm ứng 2.5K và GPU rời.', 50),

-- 16. MacBook Air 13 M3
(16, 'MacBook Air 13 M3', 'macbook-air-13-m3', 2, 3, 27990000, 29990000,
 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
 4.8, 1456, 7200, 'Hot',
 '{"cpu":"Apple M3","ram":"16GB Unified","storage":"256GB SSD","display":"13.6\" Liquid Retina"}',
 'MacBook Air 13 M3 — Laptop siêu nhẹ 1.24kg với hiệu năng vượt trội và thời lượng pin 18 giờ.', 100),

-- 17. ASUS ROG Zephyrus G14
(17, 'ASUS ROG Zephyrus G14', 'asus-rog-zephyrus-g14', 3, 1, 46990000, 52990000,
 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop',
 4.7, 298, 1670, 'Sale',
 '{"cpu":"AMD Ryzen 9 8945HS","ram":"32GB LPDDR5x","storage":"1TB SSD NVMe","display":"14\" 2.8K OLED 120Hz"}',
 'ASUS ROG Zephyrus G14 — Gaming laptop nhỏ gọn nhất với AMD Ryzen 9 và RTX 4070, màn hình OLED 2.8K.', 35),

-- 18. Acer Swift Go 16
(18, 'Acer Swift Go 16', 'acer-swift-go-16', 1, 2, 22990000, 25990000,
 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
 4.2, 145, 780, NULL,
 '{"cpu":"Intel Core Ultra 5 125H","ram":"16GB LPDDR5x","storage":"512GB SSD","display":"16\" 2.5K IPS"}',
 'Acer Swift Go 16 — Laptop siêu nhẹ 1.56kg với màn hình 2.5K lớn, pin cả ngày làm việc.', 65);

-- Reset sequence cho products
SELECT setval('products_id_seq', 18);

COMMIT;
