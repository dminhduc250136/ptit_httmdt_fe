package com.laptopshop.service.impl;

import com.laptopshop.dto.AuthResponse;
import com.laptopshop.dto.LoginRequest;
import com.laptopshop.dto.RegisterRequest;
import com.laptopshop.dto.UpdateProfileRequest;
import com.laptopshop.dto.UserProfileDTO;
import com.laptopshop.entity.User;
import com.laptopshop.entity.enums.UserRole;
import com.laptopshop.exception.BadRequestException;
import com.laptopshop.exception.DuplicateResourceException;
import com.laptopshop.exception.ResourceNotFoundException;
import com.laptopshop.repository.UserRepository;
import com.laptopshop.security.JwtTokenProvider;
import com.laptopshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email đã được sử dụng");
        }

        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Số điện thoại đã được sử dụng");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(UserRole.CUSTOMER)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = jwtTokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            String token = jwtTokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

            return AuthResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .phone(user.getPhone())
                    .role(user.getRole().name())
                    .token(token)
                    .build();
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional
    public UserProfileDTO updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User không tồn tại"));

        String normalizedPhone = request.getPhone() != null ? request.getPhone().trim() : null;
        if (normalizedPhone != null && normalizedPhone.isEmpty()) {
            normalizedPhone = null;
        }

        if (normalizedPhone != null
                && !normalizedPhone.equals(user.getPhone())
                && userRepository.existsByPhone(normalizedPhone)) {
            throw new DuplicateResourceException("Số điện thoại đã được sử dụng");
        }

        user.setFullName(request.getFullName().trim());
        user.setPhone(normalizedPhone);
        user.setAvatarUrl(request.getAvatarUrl());
        userRepository.save(user);

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .build();
    }
}
