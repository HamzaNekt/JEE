package com.example.immobilier.reservations.service;

import com.example.immobilier.reservations.clients.BiensClient;
import com.example.immobilier.reservations.model.Reservation;
import com.example.immobilier.reservations.repository.ReservationRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReservationService {

    private final ReservationRepository repository;
    private final BiensClient biensClient;

    public ReservationService(ReservationRepository repository, BiensClient biensClient) {
        this.repository = repository;
        this.biensClient = biensClient;
    }

    @CircuitBreaker(name = "biensClient", fallbackMethod = "fallbackReservation")
    public Reservation create(Reservation reservation) {
        BiensClient.BienResponse bien = biensClient.getBien(reservation.getBienId());
        if (bien == null || Boolean.FALSE.equals(bien.disponible())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bien indisponible pour réservation");
        }
        reservation.setStatut("EN_ATTENTE");
        return repository.save(reservation);
    }

    @SuppressWarnings("unused")
    private Reservation fallbackReservation(Reservation reservation, Throwable ex) {
        throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Service biens indisponible", ex);
    }

    public Optional<Reservation> findById(Long id) {
        return repository.findById(id);
    }

    public List<Reservation> findByClient(Long clientId) {
        return repository.findByClientId(clientId);
    }
}

