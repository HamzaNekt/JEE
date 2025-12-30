package com.example.immobilier.biens.web;

import com.example.immobilier.biens.model.Bien;
import com.example.immobilier.biens.service.BienService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/biens")
public class BienController {

    private final BienService bienService;

    public BienController(BienService bienService) {
        this.bienService = bienService;
    }

    @GetMapping
    public List<Bien> search(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) BigDecimal prixMax,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean dispo
    ) {
        return bienService.filter(ville, prixMax, type, dispo);
    }

    @GetMapping("/{id}")
    public Bien getById(@PathVariable Long id) {
        return bienService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bien introuvable"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Bien create(@Valid @RequestBody Bien bien) {
        bien.setId(null);
        return bienService.save(bien);
    }

    @PutMapping("/{id}")
    public Bien update(@PathVariable Long id, @Valid @RequestBody Bien payload) {
        Bien existing = bienService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bien introuvable"));
        existing.setTitre(payload.getTitre());
        existing.setDescription(payload.getDescription());
        existing.setVille(payload.getVille());
        existing.setPrix(payload.getPrix());
        existing.setTypeBien(payload.getTypeBien());
        existing.setDisponible(payload.getDisponible());
        return bienService.save(existing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (bienService.findById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Bien introuvable");
        }
        bienService.deleteById(id);
    }
}

