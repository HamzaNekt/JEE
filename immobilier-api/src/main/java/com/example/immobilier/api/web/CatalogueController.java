package com.example.immobilier.api.web;

import com.example.immobilier.api.clients.ReservationsClient;
import com.example.immobilier.api.clients.BiensClient;
import com.example.immobilier.api.service.CatalogueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/catalogue")
public class CatalogueController {

    private final CatalogueService catalogueService;

    public CatalogueController(CatalogueService catalogueService) {
        this.catalogueService = catalogueService;
    }

    @GetMapping("/biens")
    public List<BiensClient.BienSummary> biens() {
        return catalogueService.biens();
    }

    @GetMapping("/biens/{id}")
    public BiensClient.BienSummary bien(@PathVariable Long id) {
        return catalogueService.bien(id);
    }

    @PostMapping("/reservations")
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationsClient.ReservationResponse reserver(@Valid @RequestBody ReservationsClient.ReservationRequest request) {
        return catalogueService.reserver(request);
    }

    @GetMapping("/clients/{clientId}/reservations")
    public List<ReservationsClient.ReservationResponse> reservationsClient(@PathVariable Long clientId) {
        return catalogueService.reservationsClient(clientId);
    }
}

