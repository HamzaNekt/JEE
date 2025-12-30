package com.example.immobilier.api.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.List;

@FeignClient(name = "biens-service")
public interface BiensClient {

    @GetMapping("/biens")
    List<BienSummary> list();

    @GetMapping("/biens/{id}")
    BienSummary byId(@PathVariable("id") Long id);

    record BienSummary(Long id, String titre, String description, String ville,
                       BigDecimal prix, String typeBien, Boolean disponible) {
    }
}

