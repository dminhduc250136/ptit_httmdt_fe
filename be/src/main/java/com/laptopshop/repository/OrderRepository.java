package com.laptopshop.repository;

import com.laptopshop.entity.Order;
import com.laptopshop.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND (:status IS NULL OR o.orderStatus = :status) ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdAndStatus(@Param("userId") Long userId,
                                       @Param("status") OrderStatus status,
                                       Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.shippingAddress JOIN FETCH o.items WHERE o.orderCode = :orderCode")
    Optional<Order> findByOrderCodeWithDetails(@Param("orderCode") String orderCode);

    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByUserId(Long userId);

    boolean existsByOrderCode(String orderCode);

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM Order o WHERE o.shippingAddress.id = :shippingAddressId")
    boolean existsByShippingAddressId(@Param("shippingAddressId") Long shippingAddressId);

    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.user.id = :userId AND oi.product.id = :productId AND o.orderStatus = 'COMPLETED'")
    boolean hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);

    long countByOrderStatus(OrderStatus orderStatus);

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.orderStatus IN ('DELIVERED', 'COMPLETED')")
    Long sumRevenueFromSuccessfulOrders();
}
