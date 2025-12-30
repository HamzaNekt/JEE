package com.example.immobilier.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route pour Immobilier-API (catalogue)
                .route("immobilier-api", r -> r
                        .path("/catalogue/**")
                        .uri("lb://immobilier-api"))

                // Route pour Biens-Service
                .route("biens-service", r -> r
                        .path("/biens/**")
                        .uri("lb://biens-service"))

                // Route pour Clients-Reservations-Service (clients)
                .route("clients-service", r -> r
                        .path("/clients/**")
                        .uri("lb://clients-reservations-service"))

                // Route pour Clients-Reservations-Service (reservations)
                .route("reservations-service", r -> r
                        .path("/reservations/**")
                        .uri("lb://clients-reservations-service"))

                .build();
    }
}
