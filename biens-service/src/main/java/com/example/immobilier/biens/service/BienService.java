package com.example.immobilier.biens.service;

import com.example.immobilier.biens.model.Bien;
import com.example.immobilier.biens.repository.BienRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BienService {

    private final BienRepository repository;

    public BienService(BienRepository repository) {
        this.repository = repository;
    }

    public List<Bien> findAll() {
        return repository.findAll();
    }

    public Optional<Bien> findById(Long id) {
        return repository.findById(id);
    }

    public Bien save(Bien bien) {
        return repository.save(bien);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<Bien> filter(String ville, BigDecimal prixMax, String typeBien, Boolean dispo) {
        return repository.findAll().stream()
                .filter(b -> ville == null || b.getVille().equalsIgnoreCase(ville))
                .filter(b -> prixMax == null || b.getPrix().compareTo(prixMax) <= 0)
                .filter(b -> typeBien == null || b.getTypeBien().equalsIgnoreCase(typeBien))
                .filter(b -> dispo == null || b.getDisponible().equals(dispo))
                .toList();
    }
}

