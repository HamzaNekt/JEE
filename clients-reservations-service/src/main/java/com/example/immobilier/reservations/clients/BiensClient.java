package com.example.immobilier.reservations.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "biens-service")
public interface BiensClient {

    @GetMapping("/biens/{id}")
    BienResponse getBien(@PathVariable("id") Long id);

    record BienResponse(Long id, String titre, String ville, Boolean disponible) {
    }
}

