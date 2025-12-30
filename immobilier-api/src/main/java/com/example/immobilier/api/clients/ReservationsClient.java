package com.example.immobilier.api.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;

@FeignClient(name = "clients-reservations-service")
public interface ReservationsClient {

    @PostMapping("/reservations")
    ReservationResponse create(@RequestBody ReservationRequest request);

    @GetMapping(value = "/reservations")
    List<ReservationResponse> byClient(@RequestParam("clientId") Long clientId);

    record ReservationRequest(Long clientId, Long bienId, LocalDate dateDebut, LocalDate dateFin) {
    }

    record ReservationResponse(Long id, Long clientId, Long bienId, LocalDate dateDebut,
                               LocalDate dateFin, String statut) {
    }
}

