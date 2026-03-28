package com.laptopshop.controller;

import com.laptopshop.dto.AuthResponse;
import com.laptopshop.dto.LoginRequest;
import com.laptopshop.dto.RegisterRequest;
import com.laptopshop.dto.UpdateProfileRequest;
import com.laptopshop.dto.UserProfileDTO;
import com.laptopshop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        UserProfileDTO profile = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(Authentication authentication,
                                                        @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileDTO profile = authService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(profile);
    }
}
