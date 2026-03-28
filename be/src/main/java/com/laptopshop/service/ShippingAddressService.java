package com.laptopshop.service;

import com.laptopshop.dto.ShippingAddressDTO;

import java.util.List;

public interface ShippingAddressService {

    List<ShippingAddressDTO> getAddresses(String email);

    ShippingAddressDTO createAddress(String email, ShippingAddressDTO request);

    ShippingAddressDTO updateAddress(String email, Long addressId, ShippingAddressDTO request);

    void deleteAddress(String email, Long addressId);
}
