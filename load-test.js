// load-test.js
// Run with: k6 run load-test.js
//
// This simulates realistic traffic against the EventConnect API Gateway:
// - browsing vendors (GET, read-heavy, most common action)
// - viewing events (GET)
// - creating bookings (POST, triggers Kafka publish in booking-service)
// - checking notifications (GET, hits notification-service which is fed by Kafka)

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE_URL = 'http://localhost:8090';

// Custom metrics so the summary clearly shows error rate and booking latency
const errorRate = new Rate('errors');
const bookingDuration = new Trend('booking_duration');

// Replace these with real IDs from your seeded data if you want bookings
// to succeed end-to-end. If left as-is, booking calls may 400, which is
// fine for a pure throughput/latency test but won't tell you about the
// Kafka path specifically.
const SAMPLE_EVENT_ID = '74a7c37f-320a-4d7b-9013-6e268fdfe96e';
const SAMPLE_VENDOR_ID = '1d64264c-8f76-4fa6-ac6c-ab208e441a74';
const SAMPLE_CUSTOMER_ID = '2d1d9bbe-7749-460e-b799-67e0667d8278';

export const options = {
  scenarios: {
    ramping_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 200 },   // warm up
        { duration: '30s', target: 500 },   // ramp
        { duration: '1m',  target: 1000 },  // target concurrency from the resume claim
        { duration: '2m',  target: 1000 },  // hold at 1000 concurrent VUs
        { duration: '30s', target: 0 },     // ramp down
      ],
    },
  },
  thresholds: {
    // Define what "fault-tolerant" and "handles load" actually mean numerically
    http_req_failed: ['rate<0.05'],     // less than 5% errors at peak load
    http_req_duration: ['p(95)<1500'],  // 95% of requests under 1.5s
  },
};

export default function () {
  const group = Math.random();

  if (group < 0.5) {
    // 50% of traffic: browse vendors (most common real-world action)
    const res = http.get(`${BASE_URL}/api/vendors`);
    check(res, { 'vendors status 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);

  } else if (group < 0.75) {
    // 25% of traffic: view events
    const res = http.get(`${BASE_URL}/api/events`);
    check(res, { 'events status 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);

  } else if (group < 0.9) {
    // 15% of traffic: check notifications (downstream of Kafka consumer)
    const res = http.get(`${BASE_URL}/api/notifications?customerId=${SAMPLE_CUSTOMER_ID}`);
    check(res, { 'notifications status 200': (r) => r.status === 200 });
    errorRate.add(res.status !== 200);

  } else {
    // 10% of traffic: create a booking (write path, publishes to Kafka)
    const payload = JSON.stringify({
      eventId: SAMPLE_EVENT_ID,
      vendorId: SAMPLE_VENDOR_ID,
      customerId: SAMPLE_CUSTOMER_ID,
      totalAmount: Math.floor(Math.random() * 1000) + 100,
    });
    const start = Date.now();
    const res = http.post(`${BASE_URL}/api/bookings`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    bookingDuration.add(Date.now() - start);
    check(res, { 'booking status 201': (r) => r.status === 201 });
    errorRate.add(res.status !== 201);
  }

  sleep(Math.random() * 1 + 0.5); // 0.5-1.5s between requests per VU, mimics real user pacing
}
