package com.example.immobilier.gateway.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final WebClient.Builder webClient;

    public AuthController(JwtService jwtService, WebClient.Builder webClient) {
        this.jwtService = jwtService;
        this.webClient = webClient;
    }

    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public reactor.core.publisher.Mono<Map<String, String>> token(@RequestBody AuthRequest request) {
        // Vérification côté microservice clients-réservations (BDD)
        return webClient.build()
                .post()
                .uri("lb://clients-reservations-service/auth/verify")
                .bodyValue(Map.of(
                        "username", request.username() == null ? "" : request.username(),
                        "password", request.password() == null ? "" : request.password()
                ))
                .retrieve()
                .onStatus(s -> s.value() == 401, r -> r.createException().flatMap(ex -> {
                    return reactor.core.publisher.Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));
                }))
                .bodyToMono(VerifyResponse.class)
                .map(verify -> {
                    List<String> scopes = verify != null && verify.roles() != null && !verify.roles().isEmpty()
                            ? verify.roles()
                            : (request.scopes() == null || request.scopes().isEmpty() ? List.of("USER") : request.scopes());

                    String token = jwtService.generate(request.username(), scopes);
                    return Map.of("token", token);
                });
    }

    public record AuthRequest(String username, String password, List<String> scopes) {
    }

    public record VerifyResponse(String username, List<String> roles) {
    }
}

