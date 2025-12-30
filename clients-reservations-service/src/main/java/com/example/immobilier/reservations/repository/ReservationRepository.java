package com.example.immobilier.reservations.repository;

import com.example.immobilier.reservations.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByClientId(Long clientId);
}

