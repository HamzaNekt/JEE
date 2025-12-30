package com.example.immobilier.reservations.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "mes-config-ms")
public class CommandesConfigProperties {

    /**
     * Fenêtre des dernières réservations/commandes à afficher.
     */
    private int commandesLast = 10;

    public int getCommandesLast() {
        return commandesLast;
    }

    public void setCommandesLast(int commandesLast) {
        this.commandesLast = commandesLast;
    }
}

