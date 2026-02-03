# Stress & Load Testing

## Where to See Results

- **Load test (Artillery):** Output appears in the **terminal** where you run `npm run test:load`. Scroll to the bottom for the Summary report.
- **JSON report:** Run `npm run test:load:report` to save `stress/report.json`. The `artillery report` HTML command is deprecated; use [Artillery Cloud](https://app.artillery.io) for visualization.

## E2E Stress Tests (Playwright)

Runs E2E tests with high parallelism and repetition to stress the app and surface flakiness:

```bash
npm run test:e2e:stress
```

- **4 workers** – parallel browser instances
- **5× repeat** – each test runs 5 times (190 total test runs)
- Requires app built and running (uses same webServer as `test:e2e`)

## HTTP Load Tests (Artillery)

Load tests key public endpoints with configurable ramp-up:

```bash
# Default: http://localhost:3000 (start app first: npm run build && npm run start)
npm run test:load

# Against production (https://drelix.org)
npm run test:load:prod
```

**Phases:**

- Ramp up: 2 req/s for 10s
- Sustained: 5 req/s for 20s
- Stress: 10 req/s for 10s

**Thresholds:** &lt;5% error rate, p95 &lt;3s

### Baseline Results (localhost, Feb 2026)

| Metric                  | Value  |
| ----------------------- | ------ |
| Requests                | 660    |
| Failures                | 0      |
| Response time (median)  | 4 ms   |
| Response time (p95)     | 257 ms |
| Response time (max)     | 400 ms |
| Virtual users completed | 220    |

All thresholds passed. App handles ~30 req/s sustained load with no errors.

## k6 (Optional)

For more control, use the k6 script. Requires [k6](https://k6.io/docs/getting-started/installation/) installed separately:

```bash
# Windows: choco install k6
# macOS: brew install k6

k6 run stress/load.js
BASE_URL=https://drelix.org k6 run stress/load.js
```
