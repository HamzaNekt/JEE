package com.example.immobilier.reservations.web;

import com.example.immobilier.reservations.config.CommandesConfigProperties;
import com.example.immobilier.reservations.model.Reservation;
import com.example.immobilier.reservations.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationsController {

    private final ReservationService reservationService;
    private final CommandesConfigProperties configProperties;

    public ReservationsController(ReservationService reservationService,
                                  CommandesConfigProperties configProperties) {
        this.reservationService = reservationService;
        this.configProperties = configProperties;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reservation create(@Valid @RequestBody Reservation reservation) {
        reservation.setId(null);
        return reservationService.create(reservation);
    }

    @GetMapping("/{id}")
    public Reservation get(@PathVariable Long id) {
        return reservationService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réservation introuvable"));
    }

    @GetMapping
    public List<Reservation> byClient(@RequestParam Long clientId) {
        return reservationService.findByClient(clientId);
    }

    @GetMapping("/config/last")
    public Map<String, Object> lastWindow() {
        return Map.of("commandesLast", configProperties.getCommandesLast());
    }
}

