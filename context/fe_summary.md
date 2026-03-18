# Tóm Tắt Source Code Frontend — LaptopVerse

**Project**: Trang TMDT bán Laptop cao cấp  
**Stack**: Next.js 14 (App Router) + TypeScript + Vanilla CSS + Lucide Icons

---

## 1. Cấu Trúc Thư Mục

```
src/
├── app/                        # Pages (Next.js App Router)
│   ├── layout.tsx              # Root layout (Header, Footer, CartProvider)
│   ├── page.tsx                # Trang chủ
│   ├── laptops/
│   │   ├── page.tsx            # Danh sách sản phẩm + lọc/sort
│   │   └── [id]/page.tsx       # Chi tiết sản phẩm (dynamic route)
│   ├── cart/page.tsx           # Giỏ hàng
│   └── checkout/page.tsx       # Thanh toán
│
├── components/                 # UI Components tái sử dụng
│   ├── layout/Header.tsx       # Header + thanh tìm kiếm + icon giỏ hàng
│   ├── layout/Footer.tsx       # Footer
│   ├── home/HeroSection.tsx    # Banner trang chủ
│   ├── home/FlashSale.tsx      # Flash Sale + đếm ngược
│   ├── home/CategoryShowcase.tsx # Show 3 danh mục
│   ├── ProductCard.tsx         # Card sản phẩm (dùng ở listing)
│   ├── FilterSidebar.tsx       # Bộ lọc (brand, giá, CPU, RAM)
│   ├── SortBar.tsx             # Sort + chuyển grid/list view
│   ├── ImageGallery.tsx        # Gallery ảnh sản phẩm (thumbnail)
│   ├── AddToCartButton.tsx     # Nút "Thêm vào giỏ"
│   ├── ReviewSection.tsx       # Danh sách đánh giá
│   ├── RelatedProducts.tsx     # Sản phẩm liên quan
│   ├── CountdownTimer.tsx      # Đồng hồ đếm ngược flash sale
│   ├── Breadcrumb.tsx          # Navigation breadcrumb
│   ├── cart/CartItemRow.tsx    # Hàng sản phẩm trong giỏ
│   └── cart/CartSummary.tsx    # Tóm tắt + nút checkout
│
├── context/
│   └── CartContext.tsx         # Global state quản lý giỏ hàng
│
└── lib/
    ├── mockData.ts             # Dữ liệu sản phẩm tĩnh (18 sản phẩm)
    ├── reviewData.ts           # Dữ liệu đánh giá
    └── utils.ts                # Helper: formatPrice, calculateDiscount
```

---

## 2. Luồng Hoạt Động Chính

### A. Trang Chủ (`/`)
```
page.tsx → HeroSection + FlashSale + CategoryShowcase
```
- `FlashSale` dùng `CountdownTimer` — đếm ngược bằng `setInterval`
- Lấy dữ liệu từ `flashSaleProducts` (filter từ `mockData`)

### B. Listing Sản Phẩm (`/laptops`)
```
User chọn filter → filteredProducts (useMemo) → render ProductCard grid
```
- **State**: `filters (brands, priceRange, cpuFamily, ram)` + `sortBy` + `viewMode`
- **Logic lọc**: dùng `useMemo` — chạy lại khi `filters` hoặc `sortBy` thay đổi
- **Sort**: theo `soldCount`, [id](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/app/checkout/page.tsx#53-74) (newest), `price`, `rating`
- **Mobile**: Filter hiển thị dạng drawer (slide-in panel)

### C. Chi Tiết Sản Phẩm (`/laptops/[id]`)
```
Server Component → find product by id → render gallery + specs + review + related
```
- [generateStaticParams()](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/app/laptops/%5Bid%5D/page.tsx#16-19) → pre-render tất cả sản phẩm lúc build
- [generateMetadata()](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/app/laptops/%5Bid%5D/page.tsx#20-29) → SEO title/description động theo từng sản phẩm
- Gồm: `ImageGallery`, bảng specs zebra-striping, `ReviewSection`, `RelatedProducts`
- `AddToCartButton` là Client Component riêng (cần [useCart](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/context/CartContext.tsx#148-153))

### D. Giỏ Hàng (`/cart`)
```
useCart() → hiển thị items → user tích chọn → CartSummary → /checkout
```
- **Selection state**: `Set<number>` lưu ID sản phẩm được tích
- **Chọn 1 số**: trạng thái "indeterminate" (dấu `-` ở checkbox tổng)
- **Tính tiền**: chỉ tính những sản phẩm được tích chọn (`selectedItems`)
- **Truyền sang Checkout**: gọi `setCheckoutItems(selectedItems)` → navigate `/checkout`

### E. Thanh Toán (`/checkout`)
```
checkoutItems (từ CartContext) → form điền thông tin → validate → đặt hàng
```
- **Form fields**: fullName, phone, email, province, district, address, note, paymentMethod
- **Validation**: real-time khi `onBlur`, full validate khi submit
  - Phone: regex `^(0[3-9]\d{8})$`
  - Address: tối thiểu 10 ký tự
- **Payment**: COD hoặc VNPay (UI radio card)
- **Phí ship**: Miễn phí nếu tổng ≥ 20 triệu, còn lại 150.000đ
- **Submit**: giả lập 1.8s delay → `clearCart()` → màn hình "Đặt hàng thành công"

---

## 3. State Management — CartContext

**Vị trí**: [src/context/CartContext.tsx](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/context/CartContext.tsx) — bọc toàn bộ app trong [layout.tsx](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/app/layout.tsx)

```typescript
// Reducer actions
ADD_ITEM      // Thêm sp, nếu đã có → tăng qty (max 10)
REMOVE_ITEM   // Xóa sp theo id
UPDATE_QTY    // Cập nhật số lượng (qty ≤ 0 → tự xóa)
CLEAR         // Xóa toàn bộ giỏ
```

**Tính năng nổi bật**:
- ✅ **Persist localStorage**: tự lưu/khôi phục khi refresh trang (key: `laptopverse_cart`)
- ✅ **checkoutItems**: state riêng chứa items đã được chọn để thanh toán
- `totalItems` + `totalPrice` tính toán real-time từ state

**Hook dùng**:
```typescript
const { items, addItem, removeItem, updateQty, clearCart, 
        totalItems, totalPrice, checkoutItems, setCheckoutItems } = useCart();
```

---

## 4. Data Layer — mockData.ts

**18 sản phẩm** với đầy đủ thông tin:

| Field | Mô tả |
|---|---|
| `id, name, brand, category` | Thông tin cơ bản |
| `price, originalPrice` | Giá (VND) — tính discount tự động |
| `image, gallery[]` | Ảnh chính + ảnh gallery (Unsplash URLs) |
| `specs` | CPU, RAM, Storage, Display (ngắn) |
| `detailedSpecs[]` | Bảng thông số đầy đủ |
| `rating, reviewCount, soldCount` | Số liệu đánh giá |
| `badge` | `"Hot" / "New" / "Sale"` |
| `gifts[]` | Quà tặng kèm |
| `isFlashSale` | Hiển thị trong Flash Sale section |

**Exported constants**:
- `flashSaleProducts` — filter theo `isFlashSale: true`
- `brandOptions` — danh sách brand unique (sort ABC)
- `priceRanges` — 4 khoảng giá lọc
- `cpuFamilies`, `ramOptions` — options cho filter

---

## 5. Điểm Kỹ Thuật Đáng Chú Ý

| Điểm | Chi tiết |
|---|---|
| **App Router** | Server & Client Components tách biệt rõ ràng |
| **Static Generation** | [generateStaticParams](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/app/laptops/%5Bid%5D/page.tsx#16-19) pre-build tất cả trang detail |
| **useReducer** | Cart dùng reducer pattern thay vì useState đơn giản |
| **useCallback** | Wrap `addItem/removeItem/updateQty/clearCart` tránh re-render |
| **useMemo** | Filter products tính lại khi cần, không tính mỗi render |
| **Responsive** | Mobile filter dùng drawer overlay, grid 2/3 col |
| **Form validation** | touched + errors state, scroll-to-first-error |
| **SEO** | [generateMetadata](file:///e:/workspace_ptit/2-2025-2026/BTL-TMDT/fe/src/app/laptops/%5Bid%5D/page.tsx#20-29) động + semantic HTML `<h1>` mỗi trang |
