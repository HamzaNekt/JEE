## Architecture microservices Spring Cloud – Gestion immobilière

Ce dépôt contient un squelette complet conforme au cahier des charges décrit dans `Projets J2EE.pdf` (microservices Spring Cloud : Config Server, Eureka, Gateway, deux microservices métier et une API d’agrégation).

### Modules
- `config-repo/` : dépôt Git de configuration centralisée (YAML versionnés).
- `config-server/` : serveur Spring Cloud Config.
- `eureka-server/` : Service Discovery.
- `gateway/` : API Gateway avec routage dynamique.
- `biens-service/` : microservice de gestion des biens immobiliers.
- `clients-reservations-service/` : microservice clients & réservations (intègre la propriété `mes-config-ms.commandes-last`).
- `immobilier-api/` : API d’agrégation orientée front (sécurisable JWT).

### Lancement local (aperçu)
1. Backend : `mvn -B -DskipTests package` à la racine.
2. Front : `cd frontend && npm install && npm run dev` (ou `npm run build`).
3. Docker Compose : `docker-compose up --build` (front exposé sur 3000, gateway 8080, config 8888, eureka 8761, DB MySQL sur 3307/3308).
4. Accès santé : `/actuator/health` sur chaque service via Gateway ou directement.

### Points clés respectés
- Architecture Spring Cloud : Config Server, Eureka, Gateway, OpenFeign, Actuator.
- Propriété centralisée : `mes-config-ms.commandes-last` (clients-reservations-service).
- Bases dédiées MySQL (seed automatiques + hash BCrypt pour l’utilisateur `admin/password`).
- Résilience : Resilience4j + timeouts Feign.
- Sécurité : JWT (HS256) émis par Gateway après vérification BDD (`/auth/verify`), scopes = rôles.
- Frontend React (Vite + Tailwind) : dashboard, Biens, Réservations, login JWT ; intercepteur axios.

### CI
- Workflow GitHub Actions `.github/workflows/ci.yml` : build Maven (skip tests) et build front.

### Observabilité (option Prometheus/Grafana)
- Actuator expose `/actuator/prometheus` sur chaque service.
- Exemple de `prometheus.yml` :
  ```yaml
  global:
    scrape_interval: 15s
  scrape_configs:
    - job_name: 'gateway'
      metrics_path: /actuator/prometheus
      static_configs:
        - targets: ['gateway:8080']
    - job_name: 'biens-service'
      metrics_path: /actuator/prometheus
      static_configs:
        - targets: ['biens-service:8082']
    - job_name: 'clients-reservations-service'
      metrics_path: /actuator/prometheus
      static_configs:
        - targets: ['clients-reservations-service:8083']
    - job_name: 'immobilier-api'
      metrics_path: /actuator/prometheus
      static_configs:
        - targets: ['immobilier-api:8084']
  ```
- Docker Compose peut ajouter Prometheus + Grafana (branché sur le network `backend-net`).
### Variables utiles
- `JWT_SECRET` (gateway, immobilier-api).
- `CONFIG_SERVER_URL`, `EUREKA_HOST`, `BIENS_DB_*`, `RESERVATIONS_DB_*`.
- Front : `VITE_API_BASE_URL` (ex. `http://localhost:8080` en local, déjà `http://gateway:8080` en Compose).

