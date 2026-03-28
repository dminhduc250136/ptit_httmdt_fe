package com.laptopshop.service.impl;

import com.laptopshop.dto.*;
import com.laptopshop.entity.*;
import com.laptopshop.entity.enums.OrderStatus;
import com.laptopshop.entity.enums.PaymentMethod;
import com.laptopshop.entity.enums.PaymentStatus;
import com.laptopshop.exception.BadRequestException;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.*;
import com.laptopshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public OrderDTO createOrder(String email, CreateOrderRequest request) {
        User user = getUserByEmail(email);

        // Resolve or create shipping address
        ShippingAddress shippingAddress = resolveShippingAddress(user, request.getShippingAddress());

        // Calculate order items
        List<OrderItem> orderItems = new ArrayList<>();
        long subtotal = 0;

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + itemReq.getProductId()));

            if (!product.getIsActive()) {
                throw new BadRequestException("Sản phẩm " + product.getName() + " không còn bán");
            }

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Sản phẩm " + product.getName() + " không đủ hàng");
            }

            long price = product.getPrice();
            long originalPrice = product.getOriginalPrice();
            long itemSubtotal = price * itemReq.getQuantity();
            subtotal += itemSubtotal;

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .productImage(product.getImage())
                    .price(price)
                    .originalPrice(originalPrice)
                    .quantity(itemReq.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();
            orderItems.add(orderItem);

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            product.setSoldCount(product.getSoldCount() + itemReq.getQuantity());
            productRepository.save(product);
        }

        // Shipping fee calculation
        long shippingFee = subtotal >= 10000000 ? 0 : 30000; // Free shipping for orders >= 10M VNĐ
        long total = subtotal + shippingFee;

        // Generate order code
        String orderCode = generateOrderCode();

        // Create order
        Order order = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .shippingAddress(shippingAddress)
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .total(total)
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PENDING)
                .note(request.getNote())
                .build();

        order = orderRepository.save(order);

        // Save order items
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        orderItemRepository.saveAll(orderItems);

        // Clear cart items for ordered products
        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            cartItemRepository.deleteByUserIdAndProductId(user.getId(), itemReq.getProductId());
        }

        return mapToOrderDTO(order, orderItems);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderListDTO> getOrders(String email, String status, int page, int size) {
        User user = getUserByEmail(email);
        Pageable pageable = PageRequest.of(page, size);

        Page<Order> orders;
        if (status != null && !status.isEmpty()) {
            orders = orderRepository.findByUserIdAndStatus(user.getId(), OrderStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            orders = orderRepository.findByUserIdAndStatus(user.getId(), null, pageable);
        }

        return orders.map(this::mapToOrderListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderByCode(String email, String orderCode) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Đơn hàng không tồn tại");
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return mapToOrderDTO(order, items);
    }

    @Override
    @Transactional
    public OrderDTO cancelOrder(String email, String orderCode) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Đơn hàng không tồn tại");
        }

        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Không thể hủy đơn hàng ở trạng thái " + order.getOrderStatus());
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            // Pending orders can be cancelled immediately by buyer, so restore stock now.
            for (OrderItem item : items) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                product.setSoldCount(Math.max(0, product.getSoldCount() - item.getQuantity()));
                productRepository.save(product);
            }
        } else if (order.getOrderStatus() == OrderStatus.CONFIRMED) {
            // Confirmed orders require seller-side approval before actual cancellation.
            order.setOrderStatus(OrderStatus.CANCEL_REQUESTED);
            orderRepository.save(order);
        }

        return mapToOrderDTO(order, items);
    }

    private ShippingAddress resolveShippingAddress(User user, CreateOrderRequest.ShippingInfo shippingInfo) {
        if (shippingInfo.getId() != null) {
            return shippingAddressRepository.findByIdAndUserId(shippingInfo.getId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ giao hàng không tồn tại"));
        }

        ShippingAddress address = ShippingAddress.builder()
                .user(user)
                .fullName(shippingInfo.getFullName())
                .phone(shippingInfo.getPhone())
                .email(shippingInfo.getEmail())
                .province(shippingInfo.getProvince())
                .district(shippingInfo.getDistrict())
                .address(shippingInfo.getAddress())
                .isDefault(false)
                .build();
        return shippingAddressRepository.save(address);
    }

    private String generateOrderCode() {
        String code;
        do {
            code = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (orderRepository.existsByOrderCode(code));
        return code;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
    }

    private OrderDTO mapToOrderDTO(Order order, List<OrderItem> items) {
        List<OrderItemDTO> itemDTOs = items.stream()
                .map(item -> OrderItemDTO.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .price(item.getPrice())
                        .originalPrice(item.getOriginalPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

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

    private OrderListDTO mapToOrderListDTO(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        List<OrderItemDTO> itemDTOs = items.stream()
                .map(item -> OrderItemDTO.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage())
                        .price(item.getPrice())
                        .originalPrice(item.getOriginalPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderListDTO.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .itemCount(itemDTOs.size())
                .total(order.getTotal())
                .orderStatus(order.getOrderStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
