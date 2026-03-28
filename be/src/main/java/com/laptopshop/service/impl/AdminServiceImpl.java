package com.laptopshop.service.impl;

import com.laptopshop.dto.OrderDTO;
import com.laptopshop.dto.OrderItemDTO;
import com.laptopshop.dto.ShippingAddressDTO;
import com.laptopshop.dto.admin.*;
import com.laptopshop.entity.*;
import com.laptopshop.entity.enums.Badge;
import com.laptopshop.entity.enums.OrderStatus;
import com.laptopshop.entity.enums.PaymentStatus;
import com.laptopshop.entity.enums.UserRole;
import com.laptopshop.exception.BadRequestException;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.*;
import com.laptopshop.service.AdminService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardDTO getDashboard() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long totalProducts = productRepository.count();
        long lowStockProducts = productRepository.countByStockQuantityLessThanEqualAndIsActiveTrue(5);
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByOrderStatus(OrderStatus.PENDING)
                + orderRepository.countByOrderStatus(OrderStatus.CANCEL_REQUESTED);
        long totalRevenue = orderRepository.sumRevenueFromSuccessfulOrders();

        List<AdminOrderDTO> recentOrders = orderRepository
                .findAll(PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::mapOrder)
                .toList();

        return AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalProducts(totalProducts)
                .lowStockProducts(lowStockProducts)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .totalRevenue(totalRevenue)
                .recentOrders(recentOrders)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminProductDTO> getProducts(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findAll(buildProductSpec(search), pageable).map(this::mapProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        return mapProduct(product);
    }

    @Override
    public AdminProductDTO createProduct(AdminUpsertProductRequest request) {
        validatePrice(request.getPrice(), request.getOriginalPrice());

        String slug = resolveSlug(request.getSlug(), request.getName());
        if (productRepository.existsBySlug(slug)) {
            throw new BadRequestException("Slug sản phẩm đã tồn tại");
        }

        Product product = new Product();
        applyProductRequest(product, request, slug);

        return mapProduct(productRepository.save(product));
    }

    @Override
    public AdminProductDTO updateProduct(Long id, AdminUpsertProductRequest request) {
        validatePrice(request.getPrice(), request.getOriginalPrice());

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));

        String slug = resolveSlug(request.getSlug(), request.getName());
        if (!slug.equals(product.getSlug()) && productRepository.existsBySlug(slug)) {
            throw new BadRequestException("Slug sản phẩm đã tồn tại");
        }

        applyProductRequest(product, request, slug);

        return mapProduct(productRepository.save(product));
    }

    @Override
    public AdminProductDTO updateProductActive(Long id, boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        product.setIsActive(active);
        return mapProduct(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));

        if (orderItemRepository.existsByProductId(id)) {
            throw new BadRequestException("Không thể xóa sản phẩm đã phát sinh trong đơn hàng");
        }

        productRepository.delete(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminOrderDTO> getOrders(String status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findAll(buildOrderSpec(status, search), pageable).map(this::mapOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderDetail(String orderCode) {
        Order order = orderRepository.findByOrderCodeWithDetails(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));
        return mapOrderDetail(order);
    }

    @Override
    public AdminOrderDTO updateOrder(String orderCode, AdminUpdateOrderRequest request) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (request.getOrderStatus() != null && !request.getOrderStatus().isBlank()) {
            OrderStatus newStatus = parseOrderStatus(request.getOrderStatus());
            if (newStatus == OrderStatus.CANCELLED && order.getOrderStatus() != OrderStatus.CANCELLED) {
                restoreStockForOrder(order);
            }
            order.setOrderStatus(newStatus);
        }

        if (request.getPaymentStatus() != null && !request.getPaymentStatus().isBlank()) {
            order.setPaymentStatus(parsePaymentStatus(request.getPaymentStatus()));
        }

        return mapOrder(orderRepository.save(order));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getUsers(String search, String role, Boolean isActive, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return userRepository.findAll(buildUserSpec(search, role, isActive), pageable).map(this::mapUser);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));
        return mapUser(user);
    }

    @Override
    public AdminUserDTO updateUser(Long userId, AdminUpdateUserRequest request, String actorEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().isBlank() ? null : request.getPhone().trim());
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(parseUserRole(request.getRole()));
        }

        if (request.getIsActive() != null) {
            if (!request.getIsActive() && user.getEmail().equalsIgnoreCase(actorEmail)) {
                throw new BadRequestException("Không thể tự khóa chính tài khoản admin đang đăng nhập");
            }
            user.setIsActive(request.getIsActive());
        }

        return mapUser(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long userId, String actorEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", userId));

        if (user.getEmail().equalsIgnoreCase(actorEmail)) {
            throw new BadRequestException("Không thể tự xóa tài khoản admin đang đăng nhập");
        }

        if (orderRepository.existsByUserId(userId)) {
            throw new BadRequestException("Không thể xóa người dùng đã có đơn hàng");
        }

        if (reviewRepository.existsByUserId(userId)) {
            reviewRepository.deleteByUserId(userId);
        }
        cartItemRepository.deleteByUserId(userId);
        shippingAddressRepository.deleteByUserId(userId);

        userRepository.delete(user);
    }

    private Specification<Product> buildProductSpec(String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("slug")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Specification<Order> buildOrderSpec(String status, String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("orderStatus"), parseOrderStatus(status)));
            }

            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("orderCode")), like),
                        cb.like(cb.lower(root.join("user").get("email")), like),
                        cb.like(cb.lower(root.join("user").get("fullName")), like)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Specification<User> buildUserSpec(String search, String role, Boolean isActive) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("fullName")), like),
                        cb.like(cb.lower(cb.coalesce(root.get("phone"), "")), like)
                ));
            }

            if (role != null && !role.isBlank()) {
                predicates.add(cb.equal(root.get("role"), parseUserRole(role)));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void applyProductRequest(Product product, AdminUpsertProductRequest request, String slug) {
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", request.getBrandId()));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));

        product.setName(request.getName().trim());
        product.setSlug(slug);
        product.setBrand(brand);
        product.setCategory(category);
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setImage(request.getImage().trim());
        product.setBadge(parseBadge(request.getBadge()));
        product.setSpecs(defaultSpecs(request.getSpecs()));
        product.setDescription(request.getDescription());
        product.setStockQuantity(request.getStockQuantity());
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        } else if (product.getIsActive() == null) {
            product.setIsActive(true);
        }
    }

    private ProductSpecs defaultSpecs(ProductSpecs specs) {
        if (specs != null) {
            return specs;
        }
        return ProductSpecs.builder()
                .cpu("N/A")
                .ram("N/A")
                .storage("N/A")
                .display("N/A")
                .build();
    }

    private String resolveSlug(String slug, String name) {
        String source = (slug != null && !slug.isBlank()) ? slug : name;
        String normalized = source.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
        if (normalized.isBlank()) {
            throw new BadRequestException("Slug sản phẩm không hợp lệ");
        }
        return normalized;
    }

    private void validatePrice(Long price, Long originalPrice) {
        if (price == null || originalPrice == null || price <= 0 || originalPrice <= 0) {
            throw new BadRequestException("Giá sản phẩm không hợp lệ");
        }
        if (originalPrice < price) {
            throw new BadRequestException("Giá gốc phải lớn hơn hoặc bằng giá bán");
        }
    }

    private Badge parseBadge(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return Badge.valueOf(raw.trim());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Badge không hợp lệ. Chỉ chấp nhận: Hot, New, Sale");
        }
    }

    private OrderStatus parseOrderStatus(String raw) {
        try {
            return OrderStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new BadRequestException("Trạng thái đơn hàng không hợp lệ: " + raw);
        }
    }

    private PaymentStatus parsePaymentStatus(String raw) {
        try {
            return PaymentStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new BadRequestException("Trạng thái thanh toán không hợp lệ: " + raw);
        }
    }

    private UserRole parseUserRole(String raw) {
        try {
            return UserRole.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new BadRequestException("Vai trò người dùng không hợp lệ: " + raw);
        }
    }

    private void restoreStockForOrder(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            product.setSoldCount(Math.max(0, product.getSoldCount() - item.getQuantity()));
            productRepository.save(product);
        }
    }

    private AdminProductDTO mapProduct(Product product) {
        return AdminProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brandId(product.getBrand().getId())
                .brandName(product.getBrand().getName())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .image(product.getImage())
                .badge(product.getBadge() != null ? product.getBadge().name() : null)
                .specs(product.getSpecs())
                .description(product.getDescription())
                .stockQuantity(product.getStockQuantity())
                .soldCount(product.getSoldCount())
                .reviewCount(product.getReviewCount())
                .isActive(product.getIsActive())
                .createdAt(product.getCreatedAt())
                .build();
    }

            private OrderDTO mapOrderDetail(Order order) {
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> OrderItemDTO.builder()
                    .productId(item.getProduct().getId())
                    .productName(item.getProductName())
                    .productImage(item.getProductImage())
                    .price(item.getPrice())
                    .originalPrice(item.getOriginalPrice())
                    .quantity(item.getQuantity())
                    .subtotal(item.getSubtotal())
                    .build())
                .toList();

            ShippingAddress addr = order.getShippingAddress();
            ShippingAddressDTO addressDTO = ShippingAddressDTO.builder()
                .id(addr.getId())
                .fullName(addr.getFullName())
                .phone(addr.getPhone())
                .email(addr.getEmail())
                .province(addr.getProvince())
                .district(addr.getDistrict())
                .address(addr.getAddress())
                .isDefault(addr.getIsDefault())
                .build();

            return OrderDTO.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .items(itemDTOs)
                .shippingAddress(addressDTO)
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .total(order.getTotal())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .orderStatus(order.getOrderStatus().name())
                .note(order.getNote())
                .createdAt(order.getCreatedAt())
                .build();
            }

    private AdminOrderDTO mapOrder(Order order) {
        return AdminOrderDTO.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .total(order.getTotal())
                .orderStatus(order.getOrderStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .customerName(order.getUser().getFullName())
                .customerEmail(order.getUser().getEmail())
                .itemCount(order.getItems() != null ? order.getItems().size() : 0)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private AdminUserDTO mapUser(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
