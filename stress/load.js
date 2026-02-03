/**
 * k6 HTTP load test for Drelix.
 * Run: k6 run stress/load.js
 * Override base URL: k6 run -e BASE_URL=https://drelix.org stress/load.js
 *
 * Install k6: https://k6.io/docs/getting-started/installation/
 *   - Windows: choco install k6
 *   - macOS: brew install k6
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp up to 10 VUs
    { duration: '1m', target: 10 }, // Stay at 10 VUs
    { duration: '30s', target: 25 }, // Ramp up to 25 VUs
    { duration: '1m', target: 25 }, // Stay at 25 VUs
    { duration: '30s', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
    http_req_failed: ['rate<0.05'], // <5% failure rate
  },
};

function runLoadTest() {
  // Homepage
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, { 'homepage status 200': (r) => r.status === 200 });
  sleep(0.5);

  // Products catalog
  const productsRes = http.get(`${BASE_URL}/products`);
  check(productsRes, { 'products status 200': (r) => r.status === 200 });
  sleep(0.5);

  // Admin login page (GET only - no POST to avoid rate limiting)
  const loginRes = http.get(`${BASE_URL}/admin/login`);
  check(loginRes, { 'admin login status 200': (r) => r.status === 200 });
  sleep(1);
}

export default runLoadTest;
