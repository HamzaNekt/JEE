package com.example.immobilier.biens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BiensServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BiensServiceApplication.class, args);
    }
}

