package com.example.immobilier.gateway.auth;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final String secret;
    private final String issuer;
    private final long expMinutes;
    private final JWSSigner signer;

    public JwtService(
            @Value("${spring.security.oauth2.resourceserver.jwt.secret-key}") String secret,
            @Value("${security.jwt.issuer:immobilier-gateway}") String issuer,
            @Value("${security.jwt.exp-minutes:60}") long expMinutes
    ) throws Exception {
        this.secret = secret;
        this.issuer = issuer;
        this.expMinutes = expMinutes;
        this.signer = new MACSigner(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(String subject, List<String> scopes) {
        Instant now = Instant.now();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(subject)
                .issuer(issuer)
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plus(expMinutes, ChronoUnit.MINUTES)))
                .claim("scope", String.join(" ", scopes))
                .build();
        SignedJWT jwt = new SignedJWT(
                new com.nimbusds.jose.JWSHeader(JWSAlgorithm.HS256),
                claims
        );
        try {
            jwt.sign(signer);
            return jwt.serialize();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to sign JWT", e);
        }
    }

    public boolean isValid(String token) {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            return jwt.verify(new com.nimbusds.jose.crypto.MACVerifier(secret.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return false;
        }
    }
}

