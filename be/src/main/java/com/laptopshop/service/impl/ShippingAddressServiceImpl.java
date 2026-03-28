package com.laptopshop.service.impl;

import com.laptopshop.dto.ShippingAddressDTO;
import com.laptopshop.entity.ShippingAddress;
import com.laptopshop.entity.User;
import com.laptopshop.exception.BadRequestException;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.OrderRepository;
import com.laptopshop.repository.ShippingAddressRepository;
import com.laptopshop.repository.UserRepository;
import com.laptopshop.service.ShippingAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingAddressServiceImpl implements ShippingAddressService {

    private final ShippingAddressRepository shippingAddressRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ShippingAddressDTO> getAddresses(String email) {
        User user = getUserByEmail(email);
        return shippingAddressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ShippingAddressDTO createAddress(String email, ShippingAddressDTO request) {
        User user = getUserByEmail(email);

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(user.getId());
        }

        ShippingAddress address = ShippingAddress.builder()
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .province(request.getProvince())
                .district(request.getDistrict())
                .address(request.getAddress())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        return mapToDTO(shippingAddressRepository.save(address));
    }

    @Override
    @Transactional
    public ShippingAddressDTO updateAddress(String email, Long addressId, ShippingAddressDTO request) {
        User user = getUserByEmail(email);
        ShippingAddress address = shippingAddressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ không tồn tại"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(user.getId());
        }

        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setEmail(request.getEmail());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setAddress(request.getAddress());
        address.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));

        return mapToDTO(shippingAddressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = getUserByEmail(email);
        ShippingAddress address = shippingAddressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Địa chỉ không tồn tại"));

        boolean usedByOrder = orderRepository.existsByShippingAddressId(addressId);
        if (usedByOrder) {
            throw new BadRequestException("Địa chỉ này đã được dùng trong đơn hàng, vui lòng chọn địa chỉ khác để xóa");
        }

        try {
            shippingAddressRepository.delete(address);
            shippingAddressRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Địa chỉ này đã được dùng trong đơn hàng, vui lòng chọn địa chỉ khác để xóa");
        }
    }

    private void unsetDefaultAddresses(Long userId) {
        List<ShippingAddress> addresses = shippingAddressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        for (ShippingAddress addr : addresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                shippingAddressRepository.save(addr);
            }
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));
    }

    private ShippingAddressDTO mapToDTO(ShippingAddress address) {
        return ShippingAddressDTO.builder()
                .id(address.getId())
                .fullName(address.getFullName())
                .phone(address.getPhone())
                .email(address.getEmail())
                .province(address.getProvince())
                .district(address.getDistrict())
                .address(address.getAddress())
                .isDefault(address.getIsDefault())
                .build();
    }
}
