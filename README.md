# Event Connect

Event Connect is a full-stack event planning platform that connects customers with vendors (catering, photography, décor, music, and more). Customers can plan events, browse vendors, and send booking requests. Vendors can create business profiles and manage inquiries. Booking activity is streamed through Apache Kafka to power real-time notifications.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Ports](#ports)
- [API Overview](#api-overview)
- [Frontend](#frontend)
- [Database](#database)
- [Development](#development)
- [Load Testing (k6)](#load-testing-k6)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────────────────────┐
│   React     │────▶│  API Gateway │────▶│  user-service        (8081)         │
│   Frontend  │     │  (8090)      │     │  vendor-service      (8082)         │
│   (5173)    │     └──────────────┘     │  event-service       (8083)         │
└─────────────┘                        │  booking-service     (8084) ──Kafka─┐
                                         │  notification-service(8085) ◀───────┘
                                         └─────────────────────────────────────┘
                                                          │
                                                    PostgreSQL (5432)
```

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TypeScript, Framer Motion, React Router, Axios |
| API Gateway | Spring Cloud Gateway |
| Microservices | Spring Boot 3.2.5, Java 17, Spring Data JPA |
| Messaging | Apache Kafka (Confluent 7.5) |
| Database | PostgreSQL 16 (one database per service) |
| Containers | Docker Compose |
| Load testing | Grafana k6 |

## Project Structure

```
event-connect/
├── api-gateway/           # Spring Cloud Gateway, CORS, routing
├── user-service/          # Registration, login, user profiles
├── vendor-service/        # Vendor profiles and availability
├── event-service/         # Event CRUD and status
├── booking-service/       # Bookings + Kafka producer
├── notification-service/  # Kafka consumer + notification storage
├── frontend/              # React SPA
├── docker-compose.yml     # Full stack orchestration
├── init.sql               # PostgreSQL database bootstrap
├── seed.ps1               # Sample data seeder (PowerShell)
├── load-test.js           # k6 load / performance test script
└── pom.xml                # Maven parent POM
```

## Prerequisites

- **Java 17** and **Maven 3.8+**
- **Node.js 18+** and **npm**
- **Docker** and **Docker Compose**
- **k6** (optional, for load testing) — [install guide](https://grafana.com/docs/k6/latest/set-up/install-k6/) or use Docker (see below)
- **Git** (optional)

## Quick Start

### 1. Build backend services

```bash
cd event-connect
mvn clean package -DskipTests
```

### 2. Start infrastructure and services

```bash
docker compose up --build -d
```

Wait until all containers are healthy:

```bash
docker compose ps
docker compose logs -f
```

### 3. Seed sample data

With the stack running on port **8090**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\seed.ps1
```

This creates 6 customers, 10 vendors, 6 events, and multiple bookings via the API. All test accounts use password `password123`.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

Place your logo at `frontend/public/logo.png` for the navbar and auth pages.

### 5. Run the k6 load test (optional)

See [Load Testing (k6)](#load-testing-k6) for full details.

```bash
k6 run load-test.js
```

## Ports

| Service | URL / Port |
|---------|------------|
| Frontend (dev) | http://localhost:5173 |
| API Gateway | http://localhost:8090 |
| User Service | http://localhost:8081 |
| Vendor Service | http://localhost:8082 |
| Event Service | http://localhost:8083 |
| Booking Service | http://localhost:8084 |
| Notification Service | http://localhost:8085 |
| PostgreSQL | localhost:5432 |
| Kafka | localhost:9092 |

> The API gateway is mapped to host port **8090** (container port 8080) to avoid conflicts with other local services.

## API Overview

All public API calls go through the gateway at `http://localhost:8090`.

| Service | Endpoints |
|---------|-----------|
| **Users** | `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/{id}` |
| **Vendors** | `POST /api/vendors`, `GET /api/vendors`, `GET /api/vendors/{id}`, `PUT /api/vendors/{id}/availability` |
| **Events** | `POST /api/events`, `GET /api/events`, `GET /api/events/{id}`, `PUT /api/events/{id}/status` |
| **Bookings** | `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/{id}`, `PUT /api/bookings/{id}/status` |
| **Notifications** | `GET /api/notifications?customerId=` |

### Kafka topics

| Topic | Producer | Consumer |
|-------|----------|----------|
| `booking-created` | booking-service | notification-service |
| `booking-updated` | booking-service | notification-service |

## Frontend

### Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/vendors` | Browse vendors |
| `/vendors/:id` | Vendor detail and booking |
| `/events` | List events |
| `/events/create` | Create event |
| `/notifications` | Notification lookup |
| `/signup` | Role selection (customer / vendor) |
| `/signup/customer` | Customer registration |
| `/signup/vendor` | Vendor registration (2-step) |
| `/login` | Sign in |
| `/dashboard/customer` | Customer dashboard |
| `/dashboard/vendor` | Vendor dashboard |

### Auth

- Registration and login store the user in `localStorage` under `ec_user`.
- Customers are redirected to `/dashboard/customer`; vendors to `/dashboard/vendor`.
- The main navbar is hidden on auth and dashboard routes.

### Configuration

The frontend API client points to the gateway:

```typescript
// frontend/src/api/client.ts
baseURL: 'http://localhost:8090'
```

## Database

PostgreSQL credentials (local / Docker):

- **User:** `postgres`
- **Password:** `secret`

Databases created by `init.sql`:

- `users_db`
- `vendors_db`
- `events_db`
- `bookings_db`
- `notifications_db`

Each microservice uses `spring.jpa.hibernate.ddl-auto=update` for schema management.

## Development

### Run a single service locally

```bash
mvn spring-boot:run -pl user-service
```

Ensure PostgreSQL (and Kafka for booking/notification services) are reachable. Service configs use Docker hostnames (`postgres`, `kafka`) by default — adjust `application.yml` for local runs if needed.

### Rebuild one service in Docker

```bash
mvn package -pl booking-service -DskipTests
docker compose up --build -d booking-service
```

### Frontend production build

```bash
cd frontend
npm run build
npm run preview
```

## Tech Stack Details

| Component | Version |
|-----------|---------|
| Java | 17 |
| Spring Boot | 3.2.5 |
| Spring Cloud | 2023.0.1 |
| PostgreSQL | 16 |
| Kafka | 7.5.0 (Confluent) |
| React | 19 |
| Vite | 8 |
| k6 | Load testing |

## Load Testing (k6)

Event Connect includes a **k6** load test (`load-test.js`) that simulates realistic traffic against the API gateway. The test validates read-heavy browsing, event listing, notification reads (Kafka consumer path), and booking creation (Kafka producer path) under high concurrency.

### Test workflow

```
mvn package → docker compose up → seed.ps1 → k6 run load-test.js
```

1. Build and start the full Docker stack
2. Run `seed.ps1` to populate vendors, events, and bookings
3. Confirm `load-test.js` sample UUIDs match seeded data (or update them)
4. Run k6 and review the summary output

### What it tests

| Share | Endpoint | Purpose |
|-------|----------|---------|
| 50% | `GET /api/vendors` | Browse vendors (read-heavy) |
| 25% | `GET /api/events` | List events |
| 15% | `GET /api/notifications?customerId=` | Notification reads (Kafka consumer path) |
| 10% | `POST /api/bookings` | Create booking → Kafka `booking-created` |

Each virtual user waits **0.5–1.5 s** between requests to mimic real user pacing.

### Load profile

| Stage | Duration | Virtual users |
|-------|----------|---------------|
| Warm up | 30s | 0 → 200 |
| Ramp | 30s | 200 → 500 |
| Ramp to peak | 1m | 500 → **1000** |
| Hold at peak | 2m | 1000 |
| Ramp down | 30s | 1000 → 0 |

**Total duration:** ~4m 30s · **Peak concurrency:** 1000 VUs for 2 minutes

### Pass / fail thresholds

| Metric | Target |
|--------|--------|
| `http_req_failed` | &lt; 5% |
| `http_req_duration` | p95 &lt; 1500 ms |

Custom metrics: `errors` (check failure rate), `booking_duration` (POST booking latency)

### Configuration

`load-test.js` targets the gateway. Override the base URL when running k6 inside Docker:

```javascript
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8090';
```

Pre-configured sample IDs (update after `seed.ps1` if your database was reset):

```javascript
const SAMPLE_EVENT_ID    = '74a7c37f-320a-4d7b-9013-6e268fdfe96e';
const SAMPLE_VENDOR_ID   = '1d64264c-8f76-4fa6-ac6c-ab208e441a74';
const SAMPLE_CUSTOMER_ID = '2d1d9bbe-7749-460e-b799-67e0667d8278';
```

### How to run

**Local (k6 installed):**

```bash
cd event-connect
k6 run load-test.js
```

**Via Docker (no local k6 install):**

```powershell
docker run --rm --add-host=host.docker.internal:host-gateway `
  -v "${PWD}/load-test.js:/scripts/load-test.js" `
  -e BASE_URL=http://host.docker.internal:8090 `
  grafana/k6 run /scripts/load-test.js
```

**Save results to JSON:**

```bash
k6 run --out json=results.json load-test.js
```

**Monitor during the test:**

```bash
docker compose logs -f api-gateway booking-service notification-service kafka
```

### Results (1000 VU ramp test)

A full run was executed against the Docker stack with seeded data:

| Metric | Result |
|--------|--------|
| Total duration | ~4m 55s |
| Peak VUs | 1000 |
| Total HTTP requests | 15,413 |
| Throughput | ~52 req/s |
| Iterations completed | 15,404 |
| Overall check pass rate | **91.66%** |

**Per-endpoint check pass rates:**

| Endpoint | Pass rate | Notes |
|----------|-----------|-------|
| `GET /api/vendors` | **99%** (7,768 / 7,792) | Stable under load |
| `GET /api/events` | **99%** (3,820 / 3,827) | Stable under load |
| `POST /api/bookings` | **99%** (1,592 / 1,597) | Kafka write path held up |
| `GET /api/notifications` | **43%** (949 / 2,197) | Primary bottleneck at peak |

**Latency:**

| Metric | Value |
|--------|-------|
| `http_req_duration` avg | 11.95s |
| `http_req_duration` p95 | 59.99s |
| `booking_duration` p95 | 18.3s |
| `http_req_failed` | 8.33% |

**Thresholds at 1000 VUs (local Docker):**

| Threshold | Target | Result |
|-----------|--------|--------|
| `http_req_failed` | &lt; 5% | ✗ 8.33% |
| `http_req_duration` p95 | &lt; 1500 ms | ✗ 59.99s |

### Interpretation

At **1000 concurrent virtual users** on a local Docker deployment:

- **Read paths** (vendors, events) and the **booking write path** (including Kafka publish) performed well with ~99% success.
- **Notifications** degraded first under peak load — likely due to notification-service + Postgres contention when many VUs query the same `customerId` simultaneously.
- Global latency thresholds were exceeded because request timeouts (`60s`) were hit during the 1000-VU hold phase on limited local hardware.

For local development machines, reduce peak VUs in `load-test.js` (e.g. 200–500) to stay within thresholds. The test confirms the microservice architecture handles mixed read/write traffic and exercises the full gateway → service → Kafka path.

### Example k6 summary output

```
  █ THRESHOLDS
    http_req_duration
    ✗ 'p(95)<1500' p(95)=59.99s
    http_req_failed
    ✗ 'rate<0.05' rate=8.33%

  █ TOTAL RESULTS
    checks_succeeded...: 91.66% 14129 out of 15413
    http_reqs............: 15413  52.217411/s
    http_req_failed......: 8.33%  1284 out of 15413
    http_req_duration....: avg=11.95s  p(95)=59.99s
    vus_max..............: 1000
```

## Troubleshooting

**API gateway won't start (port in use)**  
Another process may be using port 8090. Check with `netstat -ano | findstr ":8090"` on Windows.

**Frontend can't reach API**  
Confirm `docker compose ps` shows `api-gateway` running and that `frontend/src/api/client.ts` uses `http://localhost:8090`.

**Kafka consumer errors on startup**  
Notification service may log `LEADER_NOT_AVAILABLE` briefly while Kafka initializes. It should recover within a few seconds.

**Empty vendor/event lists**  
Run `seed.ps1` or create data through the UI signup and create flows.

**k6 booking checks failing (not 201)**  
Update `SAMPLE_EVENT_ID`, `SAMPLE_VENDOR_ID`, and `SAMPLE_CUSTOMER_ID` in `load-test.js` with IDs from a fresh `seed.ps1` run.

**k6 thresholds exceeded at 1000 VUs**  
Expected on local Docker with limited CPU/RAM. Lower peak VUs in `load-test.js`, or scale infrastructure. Notification endpoint is the first to degrade — consider connection pooling and read replicas for production.

**k6 via Docker can't reach gateway**  
Use `-e BASE_URL=http://host.docker.internal:8090` as shown above.

## License

This project is provided for educational and demonstration purposes.
