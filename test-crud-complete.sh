#!/bin/bash

echo "========================================="
echo "Test CRUD Complet - Système Immobilier"
echo "========================================="

# 1. Authentification
echo -e "\n1️⃣  AUTHENTIFICATION"
TOKEN=$(curl -s -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"subject":"admin","password":"test123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Échec de l'authentification"
  exit 1
fi

echo "✅ Token obtenu: ${TOKEN:0:50}..."

# 2. CRUD Clients
echo -e "\n2️⃣  CRUD CLIENTS"

echo -e "\n📋 Liste tous les clients (GET /clients)"
curl -s -X GET http://localhost:8080/clients \
  -H "Authorization: Bearer $TOKEN" | head -c 500
echo ""

echo -e "\n👤 Récupérer client ID 1 (GET /clients/1)"
curl -s -X GET http://localhost:8080/clients/1 \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n➕ Créer un nouveau client (POST /clients)"
NEW_CLIENT=$(curl -s -X POST http://localhost:8080/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom":"François Dupont","email":"francois.dupont@example.com"}')
echo "$NEW_CLIENT"
NEW_CLIENT_ID=$(echo "$NEW_CLIENT" | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Nouveau client créé avec ID: $NEW_CLIENT_ID"

echo -e "\n✏️  Modifier le client (PUT /clients/$NEW_CLIENT_ID)"
curl -s -X PUT http://localhost:8080/clients/$NEW_CLIENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom":"François Dupont-Martin","email":"francois.martin@example.com"}'
echo ""

echo -e "\n🗑️  Supprimer le client (DELETE /clients/$NEW_CLIENT_ID)"
curl -s -X DELETE http://localhost:8080/clients/$NEW_CLIENT_ID \
  -H "Authorization: Bearer $TOKEN" -w "\nStatut HTTP: %{http_code}\n"

# 3. CRUD Biens
echo -e "\n3️⃣  CRUD BIENS"

echo -e "\n📋 Liste tous les biens (GET /biens)"
curl -s -X GET http://localhost:8080/biens \
  -H "Authorization: Bearer $TOKEN" | head -c 500
echo ""

echo -e "\n🏠 Récupérer bien ID 1 (GET /biens/1)"
curl -s -X GET http://localhost:8080/biens/1 \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n➕ Créer un nouveau bien (POST /biens)"
NEW_BIEN=$(curl -s -X POST http://localhost:8080/biens \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titre":"Test Appartement",
    "description":"Appartement de test",
    "ville":"Paris",
    "prix":500000,
    "typeBien":"APPARTEMENT",
    "disponible":true
  }')
echo "$NEW_BIEN"
NEW_BIEN_ID=$(echo "$NEW_BIEN" | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "✅ Nouveau bien créé avec ID: $NEW_BIEN_ID"

echo -e "\n✏️  Modifier le bien (PUT /biens/$NEW_BIEN_ID)"
curl -s -X PUT http://localhost:8080/biens/$NEW_BIEN_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titre":"Test Appartement Modifié",
    "description":"Description mise à jour",
    "ville":"Lyon",
    "prix":550000,
    "typeBien":"APPARTEMENT",
    "disponible":false
  }'
echo ""

echo -e "\n🗑️  Supprimer le bien (DELETE /biens/$NEW_BIEN_ID)"
curl -s -X DELETE http://localhost:8080/biens/$NEW_BIEN_ID \
  -H "Authorization: Bearer $TOKEN" -w "\nStatut HTTP: %{http_code}\n"

# 4. Tests de filtrage
echo -e "\n4️⃣  FILTRAGE DES BIENS"

echo -e "\n🔍 Biens à Lyon"
curl -s -X GET "http://localhost:8080/biens?ville=Lyon" \
  -H "Authorization: Bearer $TOKEN" | head -c 300
echo ""

echo -e "\n💰 Biens < 300000€"
curl -s -X GET "http://localhost:8080/biens?prixMax=300000" \
  -H "Authorization: Bearer $TOKEN" | head -c 300
echo ""

echo -e "\n🏠 Studios uniquement"
curl -s -X GET "http://localhost:8080/biens?type=STUDIO" \
  -H "Authorization: Bearer $TOKEN" | head -c 300
echo ""

echo -e "\n✅ Biens disponibles"
curl -s -X GET "http://localhost:8080/biens?dispo=true" \
  -H "Authorization: Bearer $TOKEN" | head -c 300
echo ""

# 5. Tests de réservations
echo -e "\n5️⃣  RÉSERVATIONS"

echo -e "\n📅 Créer une réservation pour bien disponible (ID 3)"
curl -s -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId":1,
    "bienId":3,
    "dateDebut":"2025-02-01",
    "dateFin":"2025-02-08"
  }'
echo ""

echo -e "\n❌ Tenter de réserver un bien indisponible (ID 9)"
curl -s -X POST http://localhost:8080/catalogue/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId":2,
    "bienId":9,
    "dateDebut":"2025-02-01",
    "dateFin":"2025-02-08"
  }' -w "\nStatut HTTP: %{http_code}\n"

echo -e "\n📋 Réservations du client Alice (ID 1)"
curl -s -X GET "http://localhost:8080/catalogue/clients/1/reservations" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo -e "\n========================================="
echo "✅ TOUS LES TESTS TERMINÉS"
echo "========================================="
