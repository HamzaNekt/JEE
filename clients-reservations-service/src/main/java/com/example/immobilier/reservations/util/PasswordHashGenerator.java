package com.example.immobilier.reservations.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "test123";
        String hash = encoder.encode(password);

        System.out.println("==============================================");
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("==============================================");
        System.out.println("\nVerification test:");
        System.out.println("Password matches hash: " + encoder.matches(password, hash));
        System.out.println("==============================================");
    }
}
