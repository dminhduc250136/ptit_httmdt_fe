package com.laptopshop.repository;

import com.laptopshop.entity.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {

    List<ShippingAddress> findByUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);

    Optional<ShippingAddress> findByIdAndUserId(Long id, Long userId);

    void deleteByUserId(Long userId);
}
