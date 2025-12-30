package com.example.immobilier.reservations.web;

import com.example.immobilier.reservations.model.User;
import com.example.immobilier.reservations.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthVerifyController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthVerifyController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.OK)
    public AuthVerifyResponse verify(@RequestBody AuthVerifyRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur inconnu"));
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe invalide");
        }
        List<String> roles = Arrays.stream(user.getRoles().split(","))
                .map(String::trim)
                .filter(r -> !r.isEmpty())
                .toList();
        return new AuthVerifyResponse(user.getUsername(), roles);
    }

    public record AuthVerifyRequest(String username, String password) {
    }

    public record AuthVerifyResponse(String username, List<String> roles) {
    }
}

