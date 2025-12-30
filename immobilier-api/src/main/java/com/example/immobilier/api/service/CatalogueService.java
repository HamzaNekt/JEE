package com.example.immobilier.api.service;

import com.example.immobilier.api.clients.BiensClient;
import com.example.immobilier.api.clients.ReservationsClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

@Service
public class CatalogueService {

    private final BiensClient biensClient;
    private final ReservationsClient reservationsClient;

    public CatalogueService(BiensClient biensClient, ReservationsClient reservationsClient) {
        this.biensClient = biensClient;
        this.reservationsClient = reservationsClient;
    }

    @CircuitBreaker(name = "biensClient", fallbackMethod = "fallbackBiens")
    public List<BiensClient.BienSummary> biens() {
        return biensClient.list();
    }

    @CircuitBreaker(name = "biensClient", fallbackMethod = "fallbackBien")
    public BiensClient.BienSummary bien(Long id) {
        return biensClient.byId(id);
    }

    @CircuitBreaker(name = "reservationsClient", fallbackMethod = "fallbackReservation")
    public ReservationsClient.ReservationResponse reserver(ReservationsClient.ReservationRequest request) {
        return reservationsClient.create(request);
    }

    @CircuitBreaker(name = "reservationsClient", fallbackMethod = "fallbackReservationsClient")
    public List<ReservationsClient.ReservationResponse> reservationsClient(Long clientId) {
        return reservationsClient.byClient(clientId);
    }

    @SuppressWarnings("unused")
    private List<BiensClient.BienSummary> fallbackBiens(Throwable ex) {
        return Collections.emptyList();
    }

    @SuppressWarnings("unused")
    private BiensClient.BienSummary fallbackBien(Long id, Throwable ex) {
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Service biens indisponible", ex);
    }

    @SuppressWarnings("unused")
    private ReservationsClient.ReservationResponse fallbackReservation(ReservationsClient.ReservationRequest request, Throwable ex) {
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Service reservations indisponible", ex);
    }

    @SuppressWarnings("unused")
    private List<ReservationsClient.ReservationResponse> fallbackReservationsClient(Long clientId, Throwable ex) {
        return Collections.emptyList();
    }
}

