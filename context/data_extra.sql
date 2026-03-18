-- ============================================================
-- LaptopVerse — Seed Data bổ sung
-- Chạy SAU data.sql
-- Product Images, Detailed Specs, Gifts, Flash Sale, Reviews
-- ============================================================

BEGIN;

-- ============================================================
-- 5. PRODUCT_IMAGES — Gallery ảnh (5 ảnh/sản phẩm cho 18 SP)
-- ============================================================

-- SP 1: ASUS ROG Strix G16 2024
INSERT INTO product_images (product_id, image_url, display_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 0, TRUE),
(1, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 1, FALSE),
(1, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 2, FALSE),
(1, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', 3, FALSE),
(1, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 4, FALSE),
-- SP 2: MacBook Pro 16 M3 Max
(2, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 0, TRUE),
(2, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', 1, FALSE),
(2, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop', 2, FALSE),
(2, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop', 3, FALSE),
(2, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 4, FALSE),
-- SP 3: MSI Titan 18 HX 2024
(3, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop', 0, TRUE),
(3, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 1, FALSE),
(3, 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop', 2, FALSE),
(3, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop', 3, FALSE),
(3, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 4, FALSE),
-- SP 4: Dell XPS 16 9640
(4, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 0, TRUE),
(4, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 1, FALSE),
(4, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 2, FALSE),
(4, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 3, FALSE),
(4, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 4, FALSE),
-- SP 5: Lenovo ThinkPad X1 Carbon Gen 12
(5, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 0, TRUE),
(5, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 1, FALSE),
(5, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 2, FALSE),
(5, 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop', 3, FALSE),
(5, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 4, FALSE),
-- SP 6: MacBook Air 15 M3
(6, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop', 0, TRUE),
(6, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop', 1, FALSE),
(6, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 2, FALSE),
(6, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', 3, FALSE),
(6, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 4, FALSE),
-- SP 7: Razer Blade 16 2024
(7, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 0, TRUE),
(7, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 1, FALSE),
(7, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop', 2, FALSE),
(7, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop', 3, FALSE),
(7, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', 4, FALSE),
-- SP 8: HP Spectre x360 16
(8, 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop', 0, TRUE),
(8, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 1, FALSE),
(8, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 2, FALSE),
(8, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 3, FALSE),
(8, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 4, FALSE),
-- SP 9: Acer Predator Helios Neo 16
(9, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', 0, TRUE),
(9, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 1, FALSE),
(9, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop', 2, FALSE),
(9, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 3, FALSE),
(9, 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop', 4, FALSE),
-- SP 10: MacBook Pro 14 M3 Pro
(10, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', 0, TRUE),
(10, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 1, FALSE),
(10, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop', 2, FALSE),
(10, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop', 3, FALSE),
(10, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 4, FALSE),
-- SP 11-18: Gallery ảnh
(11, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 0, TRUE),
(11, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 1, FALSE),
(11, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 2, FALSE),
(11, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 3, FALSE),
(11, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 4, FALSE),
(12, 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&h=600&fit=crop', 0, TRUE),
(12, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop', 1, FALSE),
(12, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 2, FALSE),
(12, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', 3, FALSE),
(12, 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop', 4, FALSE),
(13, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=600&fit=crop', 0, TRUE),
(13, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 1, FALSE),
(13, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 2, FALSE),
(13, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 3, FALSE),
(13, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 4, FALSE),
(14, 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop', 0, TRUE),
(14, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', 1, FALSE),
(14, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 2, FALSE),
(14, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop', 3, FALSE),
(14, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop', 4, FALSE),
(15, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 0, TRUE),
(15, 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=600&fit=crop', 1, FALSE),
(15, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 2, FALSE),
(15, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 3, FALSE),
(15, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 4, FALSE),
(16, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop', 0, TRUE),
(16, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=600&fit=crop', 1, FALSE),
(16, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 2, FALSE),
(16, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', 3, FALSE),
(16, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 4, FALSE),
(17, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&h=600&fit=crop', 0, TRUE),
(17, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop', 1, FALSE),
(17, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop', 2, FALSE),
(17, 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&h=600&fit=crop', 3, FALSE),
(17, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop', 4, FALSE),
(18, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop', 0, TRUE),
(18, 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=600&fit=crop', 1, FALSE),
(18, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop', 2, FALSE),
(18, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop', 3, FALSE),
(18, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=600&fit=crop', 4, FALSE);

-- ============================================================
-- 6. PRODUCT_SPECS — Thông số kỹ thuật chi tiết
-- ============================================================

-- SP 1: ASUS ROG Strix G16 2024
INSERT INTO product_specs (product_id, label, value, display_order) VALUES
(1, 'CPU', 'Intel Core i9-14900HX (24 nhân, 5.8GHz Boost)', 1),
(1, 'GPU', 'NVIDIA GeForce RTX 4080 12GB GDDR6', 2),
(1, 'RAM', '32GB DDR5-5600MHz (2x16GB, tối đa 64GB)', 3),
(1, 'Ổ cứng', '1TB PCIe 4.0 NVMe SSD', 4),
(1, 'Màn hình', '16" QHD+ (2560x1600) 240Hz, IPS, 3ms, 100% DCI-P3', 5),
(1, 'Pin', '90Wh | Sạc 240W', 6),
(1, 'Hệ điều hành', 'Windows 11 Home', 7),
(1, 'Trọng lượng', '2.5 kg', 8),
(1, 'Kết nối', 'Wi-Fi 6E, Bluetooth 5.3', 9),
(1, 'Cổng', '2x USB-C Thunderbolt 4, 3x USB-A 3.2, HDMI 2.1, SD Card', 10),
(1, 'Kích thước', '355 x 259 x 27.2 mm', 11),
(1, 'Bàn phím', 'RGB Per-key, chống nước IPX4', 12),
-- SP 2: MacBook Pro 16 M3 Max
(2, 'Chip', 'Apple M3 Max (16 nhân CPU, 40 nhân GPU)', 1),
(2, 'RAM', '48GB Unified Memory', 2),
(2, 'Ổ cứng', '1TB SSD', 3),
(2, 'Màn hình', '16.2" Liquid Retina XDR, ProMotion 120Hz, 3456x2234, 1000 nits', 4),
(2, 'Pin', '100Wh | Sạc MagSafe 140W', 5),
(2, 'Hệ điều hành', 'macOS Sonoma', 6),
(2, 'Trọng lượng', '2.15 kg', 7),
(2, 'Kết nối', 'Wi-Fi 6E, Bluetooth 5.3', 8),
(2, 'Cổng', '3x Thunderbolt 4, HDMI 2.1, SD Card, MagSafe 3', 9),
(2, 'Camera', '12MP Center Stage', 10),
(2, 'Kích thước', '355.7 x 248.1 x 16.8 mm', 11),
-- SP 3: MSI Titan 18 HX 2024
(3, 'CPU', 'Intel Core i9-14900HX (24 nhân, 5.8GHz Boost)', 1),
(3, 'GPU', 'NVIDIA GeForce RTX 4090 16GB GDDR6', 2),
(3, 'RAM', '64GB DDR5-5600MHz (4x16GB, tối đa 128GB)', 3),
(3, 'Ổ cứng', '2TB PCIe 4.0 NVMe SSD (RAID 0)', 4),
(3, 'Màn hình', '18" UHD+ (3840x2400) 120Hz Mini LED, 1000 nits HDR', 5),
(3, 'Pin', '99.9Wh | Sạc 330W', 6),
(3, 'Hệ điều hành', 'Windows 11 Pro', 7),
(3, 'Trọng lượng', '3.3 kg', 8),
(3, 'Kết nối', 'Wi-Fi 6E, Bluetooth 5.3, 2.5G LAN', 9),
(3, 'Cổng', '2x Thunderbolt 4, 4x USB-A 3.2, HDMI 2.1, SD Card, RJ45', 10),
-- SP 4: Dell XPS 16 9640
(4, 'CPU', 'Intel Core Ultra 9 185H (16 nhân, 5.1GHz Boost)', 1),
(4, 'GPU', 'NVIDIA GeForce RTX 4060 8GB GDDR6', 2),
(4, 'RAM', '32GB LPDDR5x-6400MHz (hàn chìm)', 3),
(4, 'Ổ cứng', '1TB PCIe 4.0 NVMe SSD', 4),
(4, 'Màn hình', '16" OLED InfinityEdge Touch 3.8K (3840x2400), 120Hz, 400 nits, 100% DCI-P3', 5),
(4, 'Pin', '86Wh | Sạc USB-C 130W', 6),
(4, 'Hệ điều hành', 'Windows 11 Home', 7),
(4, 'Trọng lượng', '1.89 kg', 8),
(4, 'Kết nối', 'Wi-Fi 6E, Bluetooth 5.3', 9),
(4, 'Cổng', '2x Thunderbolt 4, 1x USB-C 3.2, SD Card', 10),
(4, 'Kích thước', '354.4 x 230.6 x 17.5 mm', 11),
-- SP 5: Lenovo ThinkPad X1 Carbon Gen 12
(5, 'CPU', 'Intel Core Ultra 7 155H (22 nhân, 4.8GHz Boost)', 1),
(5, 'GPU', 'Intel Arc Graphics (tích hợp)', 2),
(5, 'RAM', '32GB LPDDR5x-7467MHz (hàn chìm)', 3),
(5, 'Ổ cứng', '512GB PCIe 4.0 NVMe SSD', 4),
(5, 'Màn hình', '14" 2.8K (2880x1800) OLED, 90Hz, 400 nits, 100% DCI-P3', 5),
(5, 'Pin', '57Wh | Sạc USB-C 65W', 6),
(5, 'Hệ điều hành', 'Windows 11 Pro', 7),
(5, 'Trọng lượng', '1.12 kg', 8),
(5, 'Kết nối', 'Wi-Fi 6E, Bluetooth 5.3, 4G LTE (tùy chọn)', 9),
(5, 'Cổng', '2x Thunderbolt 4, 2x USB-A 3.2, HDMI 2.0, SD Card', 10),
(5, 'Bảo mật', 'Vân tay, nhận diện khuôn mặt IR, TPM 2.0', 11),
-- SP 6: MacBook Air 15 M3
(6, 'Chip', 'Apple M3 (8 nhân CPU, 10 nhân GPU)', 1),
(6, 'RAM', '24GB Unified Memory', 2),
(6, 'Ổ cứng', '512GB SSD', 3),
(6, 'Màn hình', '15.3" Liquid Retina, 2880x1864, 224ppi, 500 nits', 4),
(6, 'Pin', '66.5Wh, lên đến 18 giờ | Sạc MagSafe 35W', 5),
(6, 'Hệ điều hành', 'macOS Sonoma', 6),
(6, 'Trọng lượng', '1.51 kg', 7),
(6, 'Kết nối', 'Wi-Fi 6E, Bluetooth 5.3', 8),
(6, 'Cổng', '2x Thunderbolt 3, MagSafe 3, jack 3.5mm', 9),
(6, 'Camera', '12MP Center Stage', 10),
(6, 'Màu sắc', 'Midnight, Starlight, Space Gray, Silver', 11),
-- SP 7: Razer Blade 16 2024
(7, 'CPU', 'Intel Core i9-14900HX (24 nhân, 5.8GHz Boost)', 1),
(7, 'GPU', 'NVIDIA GeForce RTX 4090 16GB GDDR6', 2),
(7, 'RAM', '32GB DDR5-5600MHz', 3),
(7, 'Ổ cứng', '1TB PCIe 4.0 NVMe SSD', 4),
(7, 'Màn hình', '16" UHD+ OLED (3840x2400) 120Hz, 0.1ms, 100% DCI-P3', 5),
(7, 'Pin', '95.2Wh | Sạc 330W', 6),
(7, 'Hệ điều hành', 'Windows 11 Home', 7),
(7, 'Trọng lượng', '2.14 kg', 8),
(7, 'Thân máy', 'CNC nhôm nguyên khối màu đen', 9),
-- SP 8: HP Spectre x360 16
(8, 'CPU', 'Intel Core Ultra 7 155H (22 nhân, 4.8GHz Boost)', 1),
(8, 'GPU', 'Intel Arc Graphics', 2),
(8, 'RAM', '32GB LPDDR5x', 3),
(8, 'Ổ cứng', '1TB PCIe 4.0 NVMe SSD', 4),
(8, 'Màn hình', '16" 3K (2880x1800) OLED Touch, 120Hz, 400 nits, 100% DCI-P3', 5),
(8, 'Pin', '83Wh | Sạc USB-C 140W', 6),
(8, 'Hệ điều hành', 'Windows 11 Home', 7),
(8, 'Trọng lượng', '2.0 kg', 8),
(8, 'Xoay', '360 độ, hỗ trợ bút HP ISPO 2048 cấp áp lực', 9),
-- SP 9: Acer Predator Helios Neo 16
(9, 'CPU', 'Intel Core i7-14700HX (20 nhân, 5.5GHz Boost)', 1),
(9, 'GPU', 'NVIDIA GeForce RTX 4070 8GB GDDR6', 2),
(9, 'RAM', '16GB DDR5-5600MHz (tối đa 32GB)', 3),
(9, 'Ổ cứng', '1TB PCIe 4.0 NVMe SSD', 4),
(9, 'Màn hình', '16" WQXGA (2560x1600) 165Hz, IPS, sRGB 100%', 5),
(9, 'Pin', '90Wh | Sạc 330W', 6),
(9, 'Hệ điều hành', 'Windows 11 Home', 7),
(9, 'Trọng lượng', '2.8 kg', 8),
-- SP 10: MacBook Pro 14 M3 Pro
(10, 'Chip', 'Apple M3 Pro (12 nhân CPU, 18 nhân GPU)', 1),
(10, 'RAM', '36GB Unified Memory', 2),
(10, 'Ổ cứng', '1TB SSD', 3),
(10, 'Màn hình', '14.2" Liquid Retina XDR, ProMotion 120Hz, 3024x1964, 1000 nits', 4),
(10, 'Pin', '72.4Wh, lên đến 18 giờ | Sạc MagSafe 96W', 5),
(10, 'Hệ điều hành', 'macOS Sonoma', 6),
(10, 'Trọng lượng', '1.61 kg', 7),
(10, 'Cổng', '3x Thunderbolt 4, HDMI 2.1, SD Card, MagSafe 3', 8),
(10, 'Camera', '12MP Center Stage', 9),
-- SP 11-18 specs
(11, 'CPU', 'Intel Core Ultra 7 155H', 1), (11, 'RAM', '16GB LPDDR5x', 2),
(11, 'Ổ cứng', '512GB PCIe 4.0 SSD', 3), (11, 'Màn hình', '14" 2.8K OLED, 120Hz, 100% DCI-P3', 4),
(11, 'Pin', '75Wh | Sạc 65W', 5), (11, 'Trọng lượng', '1.39 kg', 6),
(12, 'CPU', 'Intel Core i9-14900HX', 1), (12, 'GPU', 'NVIDIA RTX 4080 12GB', 2),
(12, 'RAM', '32GB DDR5-5600', 3), (12, 'Ổ cứng', '2TB PCIe 4.0 NVMe', 4),
(12, 'Màn hình', '16" QHD+ 240Hz IPS', 5), (12, 'Trọng lượng', '2.0 kg', 6),
(13, 'CPU', 'Intel Core i7-13700H', 1), (13, 'RAM', '16GB DDR5', 2),
(13, 'Ổ cứng', '512GB SSD', 3), (13, 'Màn hình', '16" 2.5K IPS 120Hz', 4),
(13, 'Trọng lượng', '1.86 kg', 5),
(14, 'CPU', 'Intel Core i9-14900HX', 1), (14, 'GPU', 'NVIDIA RTX 4070 Ti Super 16GB', 2),
(14, 'RAM', '32GB DDR5', 3), (14, 'Ổ cứng', '1TB NVMe SSD', 4),
(14, 'Màn hình', '16" WQXGA 240Hz IPS', 5), (14, 'Trọng lượng', '2.4 kg', 6),
(15, 'CPU', 'Intel Core i7-13700H', 1), (15, 'RAM', '16GB DDR5', 2),
(15, 'Ổ cứng', '1TB SSD', 3), (15, 'Màn hình', '16" 2.5K IPS 120Hz Touch', 4),
(15, 'Trọng lượng', '1.97 kg', 5),
(16, 'Chip', 'Apple M3 (8 nhân CPU, 10 nhân GPU)', 1), (16, 'RAM', '16GB Unified Memory', 2),
(16, 'Ổ cứng', '256GB SSD', 3), (16, 'Màn hình', '13.6" Liquid Retina 2560x1664, 500 nits', 4),
(16, 'Pin', '52.6Wh, 18 giờ', 5), (16, 'Trọng lượng', '1.24 kg', 6),
(17, 'CPU', 'AMD Ryzen 9 8945HS (8 nhân, 5.2GHz Boost)', 1), (17, 'GPU', 'NVIDIA RTX 4070 8GB GDDR6', 2),
(17, 'RAM', '32GB LPDDR5x', 3), (17, 'Ổ cứng', '1TB NVMe SSD', 4),
(17, 'Màn hình', '14" 2.8K OLED 120Hz, 0.2ms, 100% DCI-P3', 5), (17, 'Trọng lượng', '1.65 kg', 6),
(18, 'CPU', 'Intel Core Ultra 5 125H', 1), (18, 'RAM', '16GB LPDDR5x', 2),
(18, 'Ổ cứng', '512GB SSD', 3), (18, 'Màn hình', '16" 2.5K IPS 144Hz', 4),
(18, 'Trọng lượng', '1.56 kg', 5);

-- ============================================================
-- 7. PRODUCT_GIFTS — Quà tặng kèm
-- ============================================================
INSERT INTO product_gifts (product_id, description, display_order) VALUES
-- SP 1
(1, 'Chuột gaming ASUS ROG Chakram X Origin trị giá 3.990.000đ', 1),
(1, 'Tai nghe ROG Delta S Core trị giá 1.990.000đ', 2),
(1, 'Balo ROG Ranger BP2702 trị giá 1.290.000đ', 3),
(1, 'Bảo hành VIP 1 đổi 1 trong 12 tháng đầu', 4),
-- SP 2
(2, 'AppleCare+ 2 năm trị giá 4.990.000đ', 1),
(2, 'Magic Mouse trị giá 2.290.000đ', 2),
(2, 'Balo đựng laptop premium trị giá 1.490.000đ', 3),
-- SP 3
(3, 'Chuột MSI Clutch GM41 Lightweight trị giá 1.590.000đ', 1),
(3, 'Tai nghe MSI Immerse GH50 trị giá 1.890.000đ', 2),
(3, 'Bảo hành VIP 2 năm tại nhà', 3),
-- SP 4
(4, 'Dell Premier Wireless Mouse trị giá 1.290.000đ', 1),
(4, 'Túi đựng laptop Dell Premier Sleeve 16" trị giá 890.000đ', 2),
(4, 'Bảo hành ProSupport 3 năm tại nhà', 3),
-- SP 5
(5, 'Lenovo Go USB-C Laptop Power Bank 20000mAh trị giá 1.890.000đ', 1),
(5, 'Chuột Lenovo Go Wireless Multi-Device trị giá 790.000đ', 2),
(5, 'Bảo hành Premier 3 năm tại nhà', 3),
-- SP 6
(6, 'Magic Mouse trị giá 2.290.000đ', 1),
(6, 'Bảo hành AppleCare 1 năm tại nhà', 2),
-- SP 7
(7, 'Razer DeathAdder V3 Mouse trị giá 1.990.000đ', 1),
(7, 'Túi đựng Razer Concourse Pro 16 trị giá 1.190.000đ', 2),
-- SP 8
(8, 'Bút HP ISPO Rechargeable MPP 2.0 trị giá 1.390.000đ', 1),
(8, 'Bảo hành HP Care Pack 3 năm', 2),
-- SP 9
(9, 'Chuột gaming Acer Predator Cestus 335 trị giá 990.000đ', 1),
(9, 'Bảo hành Acer Care 2 năm', 2),
-- SP 10
(10, 'Bảo hành AppleCare 1 năm tại nhà', 1),
(10, 'Túi đựng laptop cao cấp trị giá 790.000đ', 2),
-- SP 11
(11, 'Túi đựng ASUS ZenBook Sleeve trị giá 590.000đ', 1),
-- SP 12
(12, 'Chuột MSI M98 trị giá 890.000đ', 1),
(12, 'Bảo hành MSI Service 2 năm', 2),
-- SP 13
(13, 'Chuột Dell MS3320W Wireless trị giá 490.000đ', 1),
-- SP 14
(14, 'Chuột Lenovo Legion M600 RGB trị giá 890.000đ', 1),
(14, 'Bảo hành Legion 2 năm', 2),
-- SP 15
(15, 'HP Care Pack 2 năm tại nhà', 1),
-- SP 16
(16, 'Bảo hành Apple 1 năm', 1),
-- SP 17
(17, 'Chuột ROG Keris II Ace trị giá 1.590.000đ', 1),
(17, 'Tai nghe ROG Cetra II Core trị giá 990.000đ', 2),
-- SP 18
(18, 'Bảo hành Acer 2 năm tại nhà', 1);

-- ============================================================
-- 8. FLASH_SALES — Chương trình Flash Sale
-- ============================================================
INSERT INTO flash_sales (title, start_time, end_time, is_active) VALUES
('Flash Sale Cuối Tuần', NOW(), NOW() + INTERVAL '8 hours', TRUE);

-- Flash sale items (SP có isFlashSale = true: 1,2,3,4,9)
INSERT INTO flash_sale_items (flash_sale_id, product_id, sale_price, stock_limit, sold_count) VALUES
(1, 1,  42990000, 50, 12),
(1, 2,  89990000, 30, 8),
(1, 3, 119990000, 15, 3),
(1, 4,  45990000, 40, 15),
(1, 9,  34990000, 55, 20);

-- ============================================================
-- 9. REVIEWS — Đánh giá mẫu
-- ============================================================
INSERT INTO reviews (product_id, user_id, rating, title, content, helpful_count, is_verified) VALUES
-- Reviews cho SP 1 (ASUS ROG Strix G16)
(1, 2, 5, 'Máy gaming quá đỉnh, đáng đồng tiền!',
 'Sau 1 tháng sử dụng, mình thực sự hài lòng với ROG Strix G16. Chơi mọi game AAA ở setting Ultra ổn định 60fps+. Tản nhiệt tốt, bàn phím RGB rất đẹp.', 42, TRUE),
(1, 3, 5, 'Hiệu năng vượt trội, thiết kế đẹp',
 'i9-14900HX + RTX 4080 combo thực sự mạnh mẽ. Render video 4K nhanh hơn rất nhiều so với laptop cũ.', 28, TRUE),
(1, 4, 4, 'Máy tốt nhưng hơi nặng',
 'Hiệu năng rất ổn, nhưng 2.5kg hơi nặng để mang đi. Quạt cũng khá ồn khi gaming.', 15, TRUE),
-- Reviews cho SP 2 (MacBook Pro 16 M3 Max)
(2, 2, 5, 'Đỉnh cao công nghệ Apple!',
 'M3 Max cực kỳ mạnh mẽ. Edit video 8K ProRes mượt mà, export nhanh gấp 3 lần M1 Max.', 56, TRUE),
(2, 4, 5, 'Pin trâu, màn hình đẹp',
 'Pin dùng được 15-16 tiếng thực tế. Màn hình XDR hiển thị màu sắc chuẩn tuyệt đối cho công việc design.', 34, TRUE),
-- Reviews cho SP 6 (MacBook Air 15 M3)
(6, 3, 5, 'Nhẹ và mạnh!',
 'Chiếc Air 15 inch nhẹ đáng kinh ngạc. Không quạt hoàn toàn im lặng. Dùng cả ngày không cần sạc.', 38, TRUE),
(6, 5, 4, 'Tốt nhưng thiếu cổng',
 'Máy rất ổn cho công việc văn phòng. Chỉ tiếc là chỉ có 2 cổng USB-C, cần mua thêm hub.', 12, TRUE),
-- Reviews cho SP 16 (MacBook Air 13 M3)
(16, 2, 5, 'Best laptop cho sinh viên!',
 'Nhẹ, pin trâu, mượt mà. Dùng cho code, note-taking, xem phim đều tốt. Giá hợp lý cho dòng MacBook.', 67, TRUE),
(16, 3, 5, 'Mua cho vợ, rất hài lòng',
 'Thiết kế đẹp, nhẹ 1.24kg mang đi làm rất tiện. Vợ dùng cho công việc văn phòng quá ổn.', 45, TRUE),
(16, 5, 4, 'Tốt nhưng SSD 256GB hơi ít',
 'Máy chạy tốt mọi thứ, nhưng 256GB thực sự hơi eo hẹp. Nên chọn bản 512GB.', 23, FALSE);

-- ============================================================
-- 10. SHIPPING_ADDRESSES — Địa chỉ mẫu
-- ============================================================
INSERT INTO shipping_addresses (user_id, full_name, phone, email, province, district, address, is_default) VALUES
(2, 'Nguyễn Văn A', '0912345678', 'nguyenvana@gmail.com', 'TP. Hồ Chí Minh', 'Quận 7', '123 Nguyễn Văn Linh, Phường Tân Phú', TRUE),
(3, 'Trần Thị B', '0923456789', 'tranthib@gmail.com', 'Hà Nội', 'Cầu Giấy', '45 Xuân Thủy, Phường Dịch Vọng Hậu', TRUE),
(4, 'Lê Văn C', '0934567890', 'levanc@gmail.com', 'Đà Nẵng', 'Hải Châu', '78 Trần Phú, Phường Hải Châu 1', TRUE);

COMMIT;
