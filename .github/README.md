# GitHub Actions

## CI Workflow

Runs on every push and pull request to `main`/`master`:

1. **Lint** – ESLint
2. **Unit tests** – Vitest (unit + Convex integration)
3. **E2E tests** – Playwright (Chromium only, for speed)

## E2E Tests in CI

E2E tests need a live Convex backend. For full E2E coverage in CI, add these **repository secrets** (Settings → Secrets and variables → Actions):

| Secret                   | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL (e.g. `https://xxx.convex.cloud`) |
| `ADMIN_PASSWORD`         | Admin password (for login API)                               |
| `JWT_SECRET`             | JWT signing secret (min 32 chars)                            |

Without these, the app uses a placeholder Convex URL and E2E tests may fail on pages that require backend data (products, admin login). Lint and unit tests will still pass.
