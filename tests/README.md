# Drelix Test Suite

Comprehensive tests for application logic. **No mocks** unless required (e.g. Convex backend).

## Structure

```
tests/
├── setup.ts              # Vitest setup (jest-dom)
├── unit/                 # Pure function tests (no mocks)
│   ├── convexAuth.test.ts
│   ├── convexHelpers.test.ts
│   ├── authHelpers.test.ts
│   ├── catalogCategorize.test.ts
│   ├── errorMessages.test.ts
│   ├── helpers-storage.test.ts
│   ├── price.test.ts           # Brutto price computation
│   ├── sanitizeHtml.test.ts    # Product description HTML sanitization & XSS
│   ├── editProductSchema.test.ts  # Edit Product form validation (Zod)
│   ├── editProductFormBackendContract.test.ts  # Form update keys ⊆ ALLOWED_UPDATE_KEYS
│   └── EditProductModal.test.tsx               # Form wiring: zod blocks submit when Nazwa empty
├── convex/               # Convex function tests (convex-test mock)
│   ├── auth.test.ts
│   ├── catalog.test.ts
│   └── integration.test.ts
e2e/
├── admin-login.spec.ts  # Admin login E2E
├── home.spec.ts         # Home page E2E
└── products.spec.ts     # Products page E2E
```

## Running Tests

```bash
# All unit + Convex tests
npm run test:unit

# Watch mode
npm run test

# Coverage report
npm run test:coverage

# Convex tests only
npm run test:convex

# E2E tests (builds app, starts production server, Chromium + Firefox)
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

## Targeting Elements

All E2E tests use `data-testid` attributes. Key IDs:

| Component        | data-testid             |
| ---------------- | ----------------------- |
| Home page        | `home-page`             |
| Main content     | `main-content`          |
| Navbar           | `main-navbar`           |
| Products section | `products-section`      |
| Admin login      | `admin-login-page`      |
| Login form       | `admin-login-form`      |
| Password input   | `admin-login-password`  |
| Submit button    | `admin-login-submit`    |
| Back link        | `admin-login-back-link` |
| Catalog table    | `catalog-table`         |
| Catalog search   | `catalog-search`        |

## Convex Tests

Convex tests use `convex-test` (mock backend) because Convex functions require `ctx` and `db`. This is the only place we use mocks—the real Convex backend cannot run in Vitest.

## Unit Tests

Unit tests cover pure logic with **no mocks**:

- `convexAuth` (25 tests): sanitizeString, validateSlug, validateRateLimitKey, requireAdmin, isAdmin - comprehensive edge cases and validation
- `convexHelpers` (14 tests): sortCategories, sortItemsByNazwa, toProductInsert, filterAllowedUpdates, productToUpdateResult - data transformation and system field stripping
- `authHelpers` (5 tests): getLoginAttemptState - rate limiting state machine, lockout scenarios, window expiration
- `catalogCategorize` (6 tests): categorizeCatalog - grouping, exclusions, exact KOD matching
- `errorMessages` (12 tests): PUBLIC_ERRORS, ADMIN_ERRORS, sanitizeErrorForPublic, logError - error sanitization and logging
- `helpers-storage` (5 tests): deleteProductImages - error recovery, partial failures, Promise.allSettled resilience
- `price` (6 tests): computeBruttoPrice - netto + VAT to brutto, comma decimals, invalid input, formatting
- `sanitizeHtml` (23 tests): sanitizeProductDescriptionHtml, isHtml - XSS stripping (script, events, javascript:), allowed tags/style, plain text→HTML (paragraphs, lists, **bold**), escaping, edge cases
- `editProductSchema` (22 tests): Edit Product form Zod schema - required fields (Kod, Nazwa, categorySlug), max lengths (500/50/100/100k), optional fields, type safety
- `editProductFormBackendContract` (2 tests): Every key the Edit Product form sends to updateProduct is in Convex ALLOWED_UPDATE_KEYS; form does not send Kod
- `EditProductModal` (2 tests, component): useForm + zodResolver – validation blocks submit when Nazwa is empty (mutation not called, error message shown); no error before submit when valid

## Convex Integration Tests

Convex tests (32 tests) use `convex-test` mock backend:

- **Catalog mutations** (24 tests): CRUD operations, error cases, duplicate handling, cascade protection, Opis field support, validation errors, empty updates, slug normalization; **updateProduct accepts payload shaped like Edit Product form** (all form keys applied); **updateProduct ignores keys not in ALLOWED_UPDATE_KEYS**
- **Auth mutations** (6 tests): Rate limiting, lockout after 5 attempts, validation errors, key format checks, clear attempts
- **Integration workflows** (4 tests): Full admin workflow, catalog replacement, multi-product sorting, category ordering

## E2E Tests

E2E tests (38 tests: 19 specs × Chromium + Firefox) use Playwright for real browser testing:

- **Admin login** (6 tests): Form rendering, password input, loading states, error toast (wrong password or rate limit), back navigation
- **Home page** (7 tests): Layout, meta tags, products section, navbar, scroll progress, language toggle, hero section
- **Products catalog** (6 tests): Page title, categories grid (with empty state handling), category cards, navigation, breadcrumbs

## Coverage (156+ Tests Total)

**Production Security Code Coverage (Non-Duplicate Files):**

- `authHelpers.ts`: **100%** ✅ (rate limiting logic)
- `validators.ts`: **100%** ✅ (schema validation)
- `helpers.ts`: **100%** ✅ (data transformations, storage error handling)
- `catalogCategorize.ts`: **100%** ✅ (CSV categorization)
- `convexAuth.ts`: **96.49%** ✅ (authentication & input validation)
- `errorMessages.ts`: **89.83%** ✅ (error handling & sanitization)
- `constants.ts`: **100%** ✅ (configuration constants)

**Overall: 96% average coverage across all critical production code**

All security-critical code (authentication, validation, error handling, rate limiting) has **comprehensive test coverage**.

Run `npm run test:coverage` to generate HTML report in `/coverage`

## E2E Test Configuration

```bash
# Run all E2E tests (builds app, starts production server, Chromium + Firefox)
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui

# Run specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
```

**Note:** E2E tests use `next build && next start` (not dev server), so they run predictably without lock conflicts. No need to stop a running dev server. Requires `npx playwright install` for Firefox.

All interactive elements use unique `data-testid` attributes for reliable test targeting.
