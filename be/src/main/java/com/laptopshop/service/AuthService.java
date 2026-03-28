package com.laptopshop.service;

import com.laptopshop.dto.AuthResponse;
import com.laptopshop.dto.LoginRequest;
import com.laptopshop.dto.RegisterRequest;
import com.laptopshop.dto.UpdateProfileRequest;
import com.laptopshop.dto.UserProfileDTO;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserProfileDTO getProfile(String email);

    UserProfileDTO updateProfile(String email, UpdateProfileRequest request);
}
