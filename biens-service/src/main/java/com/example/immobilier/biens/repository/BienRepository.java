package com.example.immobilier.biens.repository;

import com.example.immobilier.biens.model.Bien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BienRepository extends JpaRepository<Bien, Long> {
}

