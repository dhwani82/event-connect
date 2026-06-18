# Event Connect

Event Connect is a full-stack event planning platform that connects customers with vendors (catering, photography, décor, music, and more). Customers can plan events, browse vendors, and send booking requests. Vendors can create business profiles and manage inquiries. Booking activity is streamed through Apache Kafka to power real-time notifications.

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
- **k6** (optional, for load testing) — [install guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)
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

### 3. (Optional) Seed sample data

With the stack running on port **8090**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\seed.ps1
```

This creates sample customers, vendors, events, and bookings via the API.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

Place your logo at `frontend/public/logo.png` for the navbar and auth pages.

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

Event Connect includes a **k6** load test (`load-test.js`) that exercises the full stack through the API gateway under realistic, mixed traffic. The test validates that the platform stays fault-tolerant at high concurrency and that read paths, write paths, and the Kafka-backed notification flow all perform acceptably.

### What it tests

Traffic is weighted to mirror typical usage:

| Share | Endpoint | Purpose |
|-------|----------|---------|
| 50% | `GET /api/vendors` | Browse vendors (read-heavy) |
| 25% | `GET /api/events` | List events |
| 15% | `GET /api/notifications?customerId=` | Notification reads (downstream of Kafka consumer) |
| 10% | `POST /api/bookings` | Create booking (write path → Kafka `booking-created`) |

Each virtual user waits **0.5–1.5 s** between requests to simulate real user pacing.

### Load profile

The script uses a **ramping VU** scenario:

| Stage | Duration | Virtual users |
|-------|----------|---------------|
| Warm up | 30s | 0 → 200 |
| Ramp | 30s | 200 → 500 |
| Ramp to peak | 1m | 500 → **1000** |
| Hold at peak | 2m | 1000 |
| Ramp down | 30s | 1000 → 0 |

**Peak concurrency: 1000 virtual users** for 2 minutes.

### Pass / fail thresholds

| Metric | Threshold |
|--------|-----------|
| `http_req_failed` | &lt; 5% error rate at peak load |
| `http_req_duration` | p95 &lt; 1500 ms |

Custom metrics in the summary:

- `errors` — rate of failed checks per request type
- `booking_duration` — latency trend for `POST /api/bookings`

### Prerequisites

1. Full stack running (`docker compose up -d`) with gateway on **8090**
2. Sample data seeded (`.\seed.ps1`) so GET endpoints return data
3. For end-to-end booking success (201 responses), update the sample UUIDs at the top of `load-test.js` with real IDs from your seed output:

```javascript
const SAMPLE_EVENT_ID = '...';
const SAMPLE_VENDOR_ID = '...';
const SAMPLE_CUSTOMER_ID = '...';
```

If IDs are stale, booking POSTs may return 400 — the test still measures gateway throughput and latency, but won't fully exercise the Kafka publish path.

### Run the test

```bash
cd event-connect
k6 run load-test.js
```

Example with JSON output for reporting:

```bash
k6 run --out json=results.json load-test.js
```

### What a successful run looks like

- **Vendors / events / notifications** — majority of requests return **200**
- **Bookings** — **201** when sample UUIDs match seeded data
- **Summary** — `http_req_failed` under 5%, p95 latency under 1.5s
- **Docker** — all containers remain healthy (`docker compose ps`); no OOM or restart loops during the 2-minute peak

Monitor services while the test runs:

```bash
docker compose logs -f api-gateway booking-service notification-service kafka
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

**k6 thresholds exceeded**  
Check `docker compose ps` and service logs. Postgres connection pool exhaustion or Kafka lag under 1000 VUs are common causes — scale down stages in `load-test.js` for local machines with limited RAM.

## License

This project is provided for educational and demonstration purposes.
