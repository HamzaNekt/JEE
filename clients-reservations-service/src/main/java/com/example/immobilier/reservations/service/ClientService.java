package com.example.immobilier.reservations.service;

import com.example.immobilier.reservations.model.Client;
import com.example.immobilier.reservations.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClientService {

    private final ClientRepository repository;

    public ClientService(ClientRepository repository) {
        this.repository = repository;
    }

    public Client save(Client client) {
        return repository.save(client);
    }

    public Optional<Client> findById(Long id) {
        return repository.findById(id);
    }

    public List<Client> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}

