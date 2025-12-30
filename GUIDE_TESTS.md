# Guide de Tests - Système de Vente Immobilière

## 📋 Vue d'ensemble du système

### Architecture Microservices

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend React                          │
│                    (http://localhost:3000)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Gateway (Port 8080)                        │
│              - Authentification JWT                             │
│              - Routing vers les services                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ↓                         ↓
┌───────────────────────────┐   ┌──────────────────────────────────┐
│   Immobilier-API          │   │   Autres endpoints directs       │
│   (MS Interface)          │   │   (si configuré)                 │
│   - Agrégateur            │   └──────────────────────────────────┘
│   - Circuit Breaker       │
└──────────┬────────────────┘
           │
           ├─────────────────────────────┐
           ↓                             ↓
┌──────────────────────────┐   ┌─────────────────────────────────┐
│  Biens-Service (MS1)     │   │ Clients-Reservations-Service    │
│  - Catalogue immobilier  │   │ (MS2)                           │
│  - CRUD biens            │   │ - Gestion clients               │
│  - Recherche/Filtrage    │   │ - Gestion réservations          │
│                          │   │ - Authentification utilisateurs │
│  DB: biens_db           │   │ DB: reservations_db             │
└──────────────────────────┘   └─────────────────────────────────┘
           ↑                             │
           └─────────────────────────────┘
              Communication Feign Client
           (vérification disponibilité)
```

### Données de test disponibles

#### 🏠 Biens immobiliers (10 biens)

**Biens disponibles :**
- ID 1: Appartement Paris 16e - 750 000€ - APPARTEMENT
- ID 2: Maison Lyon Confluence - 520 000€ - MAISON
- ID 3: Studio Grenoble - 145 000€ - STUDIO
- ID 4: Villa Marseille Calanques - 1 250 000€ - VILLA
- ID 5: Appartement Bordeaux Chartrons - 380 000€ - APPARTEMENT
- ID 6: Maison Toulouse Capitole - 465 000€ - MAISON
- ID 7: Studio Nice Promenade - 225 000€ - STUDIO
- ID 8: Loft Nantes Île de Nantes - 485 000€ - LOFT

**Biens indisponibles (déjà réservés) :**
- ID 9: Appartement Lyon Part-Dieu - 425 000€ - APPARTEMENT ❌
- ID 10: Maison Strasbourg Neudorf - 550 000€ - MAISON ❌

#### 👥 Clients (5 clients)

- ID 1: Alice Martin - alice.martin@example.com
- ID 2: Bob Durand - bob.durand@example.com
- ID 3: Claire Dubois - claire.dubois@example.com
- ID 4: David Leroy - david.leroy@example.com
- ID 5: Emma Bernard - emma.bernard@example.com

#### 🔐 Utilisateurs pour l'authentification

Tous les utilisateurs ont le mot de passe : **test123**

- **admin** - ROLE_ADMIN
- **agent** - ROLE_USER
- **client1** - ROLE_USER

#### 📅 Réservations existantes (6 réservations)

- Réservation 1: Alice (client 1) → Bien 1 (Paris) - dans 5 jours
- Réservation 2: Bob (client 2) → Bien 2 (Lyon) - dans 10 jours
- Réservation 3: Claire (client 3) → Bien 4 (Marseille) - dans 15 jours
- Réservation 4: David (client 4) → Bien 9 (Lyon Part-Dieu) - EN COURS ⏳
- Réservation 5: Emma (client 5) → Bien 10 (Strasbourg) - EN COURS ⏳
- Réservation 6: Alice (client 1) → Bien 5 (Bordeaux) - dans 20 jours

---

## 🧪 Scénarios de Test

### 1️⃣ Test d'Authentification

#### Obtenir un token JWT

```bash
# Test avec admin
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "admin",
    "password": "test123"
  }'
```

**Réponse attendue :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpbW1vYmlsaWVyLWdhdGV3YXkiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc2NzA5NzMxMywiaWF0IjoxNzY3MDkzNzEzLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.xjaBQ35zcCyZxHuXeYkgbZVCYMLvVnca_q2siA5DVlM"
}
```

**Statut HTTP :** 200 OK

**💡 Note :** Copiez le token pour l'utiliser dans les requêtes suivantes.

#### Test avec mauvais mot de passe

```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "admin",
    "password": "wrongpassword"
  }' \
  -v
```

**Réponse attendue :** 401 Unauthorized

---

### 2️⃣ Tests MS1 - Biens-Service (via Immobilier-API)

#### Lister tous les biens disponibles

```bash
# Récupérer d'abord un token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"subject":"admin","password":"test123"}' | jq -r '.token')

# Lister les biens
curl -X GET http://localhost:8080/catalogue/biens \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :**
```json
[
  {
    "id": 1,
    "titre": "Appartement centre-ville Paris 16e",
    "description": "Appartement T3 de 85m² avec balcon...",
    "ville": "Paris",
    "prix": 750000,
    "typeBien": "APPARTEMENT",
    "disponible": true
  },
  {
    "id": 2,
    "titre": "Maison familiale Lyon Confluence",
    ...
  }
  // ... 10 biens au total
]
```

#### Récupérer un bien spécifique

```bash
curl -X GET http://localhost:8080/catalogue/biens/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :**
```json
{
  "id": 1,
  "titre": "Appartement centre-ville Paris 16e",
  "description": "Appartement T3 de 85m² avec balcon, proche tram et commerces, parking inclus",
  "ville": "Paris",
  "prix": 750000,
  "typeBien": "APPARTEMENT",
  "disponible": true
}
```

#### Test d'un bien inexistant

```bash
curl -X GET http://localhost:8080/catalogue/biens/999 \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

**Réponse attendue :** 404 Not Found ou 503 Service Unavailable (avec circuit breaker)

---

### 3️⃣ Tests MS2 - Clients-Reservations-Service

#### Créer un nouveau client

```bash
# Via le service direct (si exposé) ou via une future API
curl -X POST http://localhost:8080/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "François Dupont",
    "email": "francois.dupont@example.com"
  }'
```

**Réponse attendue :**
```json
{
  "id": 6,
  "nom": "François Dupont",
  "email": "francois.dupont@example.com"
}
```

**Statut HTTP :** 201 Created

---

### 4️⃣ Tests Réservations (Flux complet MS Interface → MS2 → MS1)

#### Créer une réservation pour un bien disponible ✅

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"subject":"admin","password":"test123"}' | jq -r '.token')

curl -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "bienId": 3,
    "dateDebut": "2025-02-01",
    "dateFin": "2025-02-08"
  }'
```

**Réponse attendue :**
```json
{
  "id": 7,
  "clientId": 1,
  "bienId": 3,
  "dateDebut": "2025-02-01",
  "dateFin": "2025-02-08",
  "statut": "EN_ATTENTE"
}
```

**Statut HTTP :** 201 Created

**✅ Comportement attendu :**
1. Immobilier-API reçoit la demande
2. Immobilier-API appelle Clients-Reservations-Service
3. Clients-Reservations-Service appelle Biens-Service via Feign pour vérifier disponibilité du bien ID 3
4. Bien ID 3 est disponible → réservation créée

#### Tenter de réserver un bien indisponible ❌

```bash
curl -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 2,
    "bienId": 9,
    "dateDebut": "2025-02-01",
    "dateFin": "2025-02-08"
  }' \
  -v
```

**Réponse attendue :** 400 Bad Request

**Message d'erreur :**
```json
{
  "error": "Bad Request",
  "message": "Le bien n'est pas disponible"
}
```

**✅ Comportement attendu :**
1. Le bien ID 9 a `disponible = false` dans la base
2. La vérification via Feign détecte l'indisponibilité
3. Erreur 400 retournée avant la création de la réservation

#### Consulter les réservations d'un client

```bash
# Voir toutes les réservations d'Alice (client ID 1)
curl -X GET "http://localhost:8080/catalogue/clients/1/reservations" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :**
```json
[
  {
    "id": 1,
    "clientId": 1,
    "bienId": 1,
    "dateDebut": "2025-01-05",
    "dateFin": "2025-01-12",
    "statut": "EN_ATTENTE"
  },
  {
    "id": 6,
    "clientId": 1,
    "bienId": 5,
    "dateDebut": "2025-01-20",
    "dateFin": "2025-01-27",
    "statut": "EN_ATTENTE"
  }
]
```

**💡 Note :** Alice a 2 réservations (ID 1 et ID 6)

---

### 5️⃣ Tests de Recherche et Filtrage (MS1)

#### Rechercher des biens par ville

```bash
# Tous les biens à Lyon
curl -X GET "http://localhost:8080/biens?ville=Lyon" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :** Biens ID 2 et 9 (Lyon)

#### Filtrer par prix maximum

```bash
# Biens à moins de 300 000€
curl -X GET "http://localhost:8080/biens?prixMax=300000" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :** Biens ID 3 (145 000€) et ID 7 (225 000€)

#### Filtrer par type de bien

```bash
# Tous les studios
curl -X GET "http://localhost:8080/biens?type=STUDIO" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :** Biens ID 3 et ID 7

#### Filtrer uniquement les biens disponibles

```bash
# Seulement les biens disponibles
curl -X GET "http://localhost:8080/biens?dispo=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :** 8 biens (tous sauf ID 9 et 10)

#### Combinaison de filtres

```bash
# Appartements à Paris disponibles à moins de 800 000€
curl -X GET "http://localhost:8080/biens?ville=Paris&type=APPARTEMENT&prixMax=800000&dispo=true" \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :** Bien ID 1 uniquement

---

### 6️⃣ Tests de Résilience (Circuit Breaker)

#### Test avec Biens-Service arrêté

```bash
# Arrêter le service biens
docker-compose stop biens-service

# Essayer de lister les biens via Immobilier-API
curl -X GET http://localhost:8080/catalogue/biens \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

**Réponse attendue :** 503 Service Unavailable (après timeout du circuit breaker)

ou

**Fallback :** Liste vide `[]` selon la configuration

**✅ Comportement attendu :**
- Le circuit breaker détecte que biens-service ne répond pas
- Fallback activé pour éviter un crash complet
- Message d'erreur ou réponse par défaut retournée

#### Redémarrer le service

```bash
docker-compose start biens-service

# Attendre 10 secondes pour l'enregistrement Eureka

# Réessayer
curl -X GET http://localhost:8080/catalogue/biens \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue :** Liste complète des biens (retour à la normale)

---

## 🔍 Tests avancés

### Test de charge - Créer plusieurs réservations

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"subject":"admin","password":"test123"}' | jq -r '.token')

# Réserver le bien 6 pour le client 3
curl -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 3,
    "bienId": 6,
    "dateDebut": "2025-03-01",
    "dateFin": "2025-03-08"
  }'

# Réserver le bien 7 pour le client 4
curl -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 4,
    "bienId": 7,
    "dateDebut": "2025-03-10",
    "dateFin": "2025-03-17"
  }'

# Réserver le bien 8 pour le client 5
curl -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 5,
    "bienId": 8,
    "dateDebut": "2025-03-20",
    "dateFin": "2025-03-27"
  }'
```

### Vérifier les logs pour le tracing distribué

```bash
# Logs du Gateway
docker-compose logs -f gateway | grep "auth/token"

# Logs de Immobilier-API
docker-compose logs -f immobilier-api | grep "catalogue"

# Logs de Clients-Reservations-Service
docker-compose logs -f clients-reservations-service | grep "reservations"

# Logs de Biens-Service
docker-compose logs -f biens-service | grep "biens"
```

---

## 📊 Vérification des données dans MySQL

### Accéder à la base biens_db

```bash
docker exec -it mysql_biens mysql -u root -proot biens_db

# Vérifier les biens
SELECT id, titre, ville, prix, type_bien, disponible FROM biens;

# Quitter
exit
```

### Accéder à la base reservations_db

```bash
docker exec -it mysql_reservations mysql -u root -proot reservations_db

# Vérifier les clients
SELECT * FROM clients;

# Vérifier les réservations
SELECT r.id, c.nom as client, r.bien_id, r.date_debut, r.date_fin, r.statut
FROM reservations r
JOIN clients c ON r.client_id = c.id
ORDER BY r.created_at DESC;

# Vérifier les utilisateurs
SELECT username, roles FROM users;

# Quitter
exit
```

---

## 🎯 Checklist de Test Complet

- [ ] 1. Authentification réussie avec admin/test123
- [ ] 2. Authentification échoue avec mauvais mot de passe
- [ ] 3. Lister tous les biens (10 biens retournés)
- [ ] 4. Récupérer un bien spécifique (ID 1)
- [ ] 5. Filtrer les biens par ville (Lyon)
- [ ] 6. Filtrer les biens par prix max (< 300000)
- [ ] 7. Filtrer les biens par type (STUDIO)
- [ ] 8. Filtrer uniquement les biens disponibles (8 biens)
- [ ] 9. Créer une réservation pour un bien disponible (bien ID 3)
- [ ] 10. Tenter de réserver un bien indisponible (bien ID 9) → Erreur 400
- [ ] 11. Consulter les réservations d'Alice (2 réservations)
- [ ] 12. Créer un nouveau client
- [ ] 13. Tester le circuit breaker (arrêter biens-service)
- [ ] 14. Vérifier les données en base MySQL

---

## 🛠️ Commandes utiles

### Redémarrer tous les services avec nouvelles données

```bash
# Rebuild et redémarrage complet
cd c:\Users\Hamza\Desktop\JEE

# Rebuild les JARs
cd biens-service && mvn clean package -DskipTests && cd ..
cd clients-reservations-service && mvn clean package -DskipTests && cd ..
cd immobilier-api && mvn clean package -DskipTests && cd ..

# Rebuild les images Docker
docker-compose build

# Supprimer les volumes MySQL pour charger les nouvelles données
docker-compose down
docker volume rm jee_mysql_biens_data jee_mysql_reservations_data

# Redémarrer tout
docker-compose up -d

# Attendre 60 secondes pour l'initialisation
sleep 60

# Vérifier les services
docker-compose ps
```

### Vérifier l'état des services

```bash
# Tous les containers
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f gateway
docker-compose logs -f immobilier-api
docker-compose logs -f biens-service
docker-compose logs -f clients-reservations-service
```

### Vérifier Eureka

Ouvrez http://localhost:8761 dans votre navigateur pour voir tous les services enregistrés.

**Services attendus :**
- GATEWAY
- IMMOBILIER-API
- BIENS-SERVICE
- CLIENTS-RESERVATIONS-SERVICE

---

## 📝 Notes importantes

1. **Token JWT** : Expire après 1 heure. Regénérez-le si nécessaire.
2. **Circuit Breaker** : Timeout configuré à 3 secondes par défaut.
3. **Dates de réservation** : Utilisez le format `YYYY-MM-DD` et dates futures obligatoires.
4. **IDs des biens** : 1-8 disponibles, 9-10 indisponibles.
5. **Mot de passe** : Tous les utilisateurs ont `test123` comme mot de passe.

---

## 🚀 Scénario de démonstration complet

```bash
# 1. Authentification
TOKEN=$(curl -s -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"subject":"admin","password":"test123"}' | jq -r '.token')

echo "Token obtenu: $TOKEN"

# 2. Lister les biens disponibles
echo "\n=== Biens disponibles ==="
curl -s -X GET "http://localhost:8080/catalogue/biens" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 3. Chercher un bien spécifique à Lyon
echo "\n=== Biens à Lyon ==="
curl -s -X GET "http://localhost:8080/biens?ville=Lyon&dispo=true" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Voir les réservations d'Alice
echo "\n=== Réservations d'Alice ==="
curl -s -X GET "http://localhost:8080/catalogue/clients/1/reservations" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 5. Créer une nouvelle réservation
echo "\n=== Création réservation ==="
curl -s -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 2,
    "bienId": 4,
    "dateDebut": "2025-04-01",
    "dateFin": "2025-04-08"
  }' | jq '.'

# 6. Tenter de réserver un bien indisponible
echo "\n=== Test réservation bien indisponible ==="
curl -s -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 2,
    "bienId": 9,
    "dateDebut": "2025-04-01",
    "dateFin": "2025-04-08"
  }' | jq '.'

echo "\n✅ Tests terminés!"
```

Copiez ce script dans un fichier `test-demo.sh` et exécutez-le pour une démonstration complète.
