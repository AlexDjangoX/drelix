# Drelix – Business Website

**Drelix** is a business website for a workwear and safety clothing supplier in Wadowice, Poland. The site is informational: it presents the business, explains why to choose Drelix, and showcases the product catalog. Purchases are made in-store; the website does not process transactions.

**Built for:** Local brick-and-mortar businesses that need an online presence to be found, inform visitors, and manage product data.

---

## Executive Summary

**What this site is:**

- Informational website for a brick-and-mortar workwear supplier
- Product catalog managed via admin interface (Convex backend)
- SEO-optimized for local discovery in Polish market

**What it is not:**

- Not an e-commerce platform (no online transactions)
- Not targeting international markets (Polish-language SEO only)
- Not a progressive web app (standard responsive website)

**Success criteria:**

- Google Search Console indexing of all public pages
- Lighthouse mobile score >90
- Admin product management workflow operational
- Legal compliance (GDPR, Polish consumer law)

**Intentionally out of scope:**

- Multi-language SEO (English is UI-only, not indexed)
- Online payment processing
- User accounts or authentication (except admin)
- Real-time inventory tracking

---

## Who This Document Is For

**Developers** – Architecture decisions, file locations, implementation details (see: SEO Reference, Project Structure)

**SEO Specialists** – Technical SEO audit, structured data, performance metrics (see: SEO Reference sections 1-8)

**Business Stakeholders** – Goals, success metrics, legal compliance (see: Executive Summary, What We Set Out to Achieve)

**Auditors** – Verification methods, measurable outcomes, legal pages (see: Verification & Monitoring, Legal Pages)

**Future Maintainers** – Quick reference, operational risks, update expectations (see: Quick Reference, Operational Risks)

---

## What We Set Out to Achieve

1. **SEO as a core requirement** – Not an afterthought. Metadata, sitemap, robots.txt, structured data, internal linking, and performance optimization built into the architecture.
2. **Performance-first approach** – Lighthouse mobile score of **91/100** through aggressive optimization: code splitting, lazy loading, image optimization, and render-blocking elimination.
3. **Google Search Console readiness** – Documentation for setup, monitoring, and troubleshooting.
4. **Local SEO alignment** – NAP consistency, LocalBusiness schema, guidance for Google Business Profile.
5. **Legal compliance** – Privacy Policy and Terms of Service aligned with EU/Polish law (GDPR, consumer rights, brick-and-mortar retail).

---

## What We Implemented

### SEO Reference

This section documents concrete SEO implementations with file locations and technical specifications.

#### **1. On-Page SEO**

**Title Tags & Meta Descriptions** (`src/app/layout.tsx`, `src/app/products/[slug]/layout.tsx`)

- Homepage: "Drelix – Odzież Robocza i Ochronna | Wadowice" (46 chars)
- Per-page metadata via Next.js `generateMetadata()` API
- Meta descriptions: 150-160 characters per page
- Implementation: `export const metadata: Metadata = { title, description }`

**Canonical URLs** (`src/lib/seo.ts`)

- Non-trailing-slash format enforced site-wide
- `getCanonicalBaseUrl()` function normalizes URLs from `NEXT_PUBLIC_SITE_URL`
- Applied to: `metadata.alternates.canonical`, sitemap, Open Graph URLs
- Example: `https://drelix.org/products/gloves` (no trailing slash)

**Heading Hierarchy** (All page components)

- One `<h1>` per page (page title or hero heading)
- Sequential hierarchy: h1 → h2 → h3 (no skipped levels)
- Fixed: Changed `<h4>` to `<span>` in `ContactInfoCard.tsx`, `<h4>` to `<h3>` in footer components
- Semantic HTML5: `<main>`, `<section>`, `<article>` landmarks throughout

**Image Optimization** (`next/image` throughout, `next.config.ts`)

- Next.js `<Image>` component with automatic WebP conversion
- Descriptive `alt` attributes on all content images (e.g., "Hero image for the homepage")
- Hero image: `quality={70}` in `src/components/hero/hero-section/HeroBackground.tsx`
- Lazy loading: `loading="lazy"` on below-the-fold images (automatic via Next.js)
- Remote patterns configured for Convex product images in `next.config.ts`

#### **2. Technical SEO**

**XML Sitemap** (`src/app/sitemap.ts`)

- Dynamic generation via Next.js sitemap API
- Fetches category slugs from Convex at build time: `fetchQuery(api.catalog.listCategorySlugs)`
- No hardcoded URLs - single source of truth
- Includes: homepage, `/products`, dynamic `/products/[slug]`, `/privacy`, `/terms`
- Accessible at: `https://drelix.org/sitemap.xml`

**robots.txt** (`src/app/robots.txt/route.ts`, `src/lib/robotsContent.ts`)

- Dynamic route handler returning `text/plain`
- Crawl policy:
  - Allow: `User-agent: *` on public routes
  - Disallow: `/api/`, `/admin/`, `/_next/`
  - Blocks AI training crawlers: `User-agent: GPTBot`, `CCBot`, `ChatGPT-User`, `Google-Extended`

**Rationale:** Business decision to restrict content use in AI training datasets while remaining discoverable in traditional search. Policy is reversible by modifying `src/lib/robotsContent.ts`. No expected downside for human-initiated AI discovery (users can still paste URLs into ChatGPT).

- References sitemap: `Sitemap: https://drelix.org/sitemap.xml`
- Accessible at: `https://drelix.org/robots.txt`

**Open Graph & Social Meta** (`src/app/layout.tsx`)

- `og:type`, `og:url`, `og:title`, `og:description`, `og:locale` (pl_PL)
- `og:image`: 1200×630 placeholder (`/og-image.png`)
- Twitter Card: `summary_large_image`
- Applied site-wide via root layout, overridden per-page where needed

**Admin Exclusion** (`src/app/admin/layout.tsx`)

- `robots: { index: false, follow: false }` in metadata
- Disallowed in `robots.txt`
- No internal links from public pages

#### **3. Structured Data (JSON-LD)**

**LocalBusiness Schema** (`src/components/JsonLd.tsx`)

```json
{
  "@type": "LocalBusiness",
  "name": "Drelix",
  "url": "https://drelix.org",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Emila Zegadłowicza 43",
    "addressLocality": "Wadowice",
    "postalCode": "34-100",
    "addressCountry": "PL"
  },
  "telephone": "+48123456789",
  "openingHours": ["Mo-Fr 08:00-16:00"]
}
```

**ItemList Schema** (`src/components/products/ProductsCatalogJsonLd.tsx`)

- Fetches categories from Convex at build time
- Lists product categories with `name`, `url`, and `position`
- Applied to: `/products` page

**BreadcrumbList Schema** (`src/app/products/[slug]/layout.tsx`)

- Dynamic per category page
- Structure: Homepage → Products → [Category Name]
- Applied to: `/products/[slug]` pages

**Validation:** Test at [Google Rich Results Test](https://search.google.com/test/rich-results). Homepage validated Feb 2026: 2 valid items (LocalBusiness, Organization), eligible for rich results.

#### **4. Performance (Core Web Vitals Impact on SEO)**

**Lighthouse Mobile Score: 91/100** (improved from 77)

Core Web Vitals are ranking factors. Optimizations implemented:

**LCP (Largest Contentful Paint)**

- Hero image: Reduced quality to 70 (`quality={70}`)
- Priority loading: `priority={true}` on above-the-fold images
- Inlined CSS: `experimental.inlineCss: true` in `next.config.ts` eliminates render-blocking CSS

**CLS (Cumulative Layout Shift)**

- `Suspense` boundaries with sized fallbacks (`<div className="py-20 md:py-32" />`)
- Fixed aspect ratios on images via `fill` or `width/height` props
- No content shift during dynamic component loading

**FID/INP (Interactivity)**

- Code splitting: Below-the-fold sections lazy loaded via `next/dynamic` in `src/app/page.tsx`
- JavaScript reduction: Initial bundle reduced by ~60-70%
- Intersection Observer for Google Maps iframe (`src/components/hero/contact/ContactMap.tsx`) - saves 152 KiB on initial load

**Resource Hints** (`src/app/layout.tsx`)

- `<link rel="preconnect" href={CONVEX_URL} />` - faster backend data fetching
- `<link rel="dns-prefetch" href="https://www.google.com" />` - Google Maps/services

**Measurement:** Run Lighthouse on production URL, mobile emulation

#### **5. Local SEO**

**NAP Consistency** (Name, Address, Phone)

- ContactInfoCard component: "ul. Emila Zegadłowicza 43, 34-100 Wadowice"
- LocalBusiness JSON-LD (same format)
- Footer (same format)
- Consistent across all instances site-wide

**Google Business Profile**

- Contact information matches NAP on website
- Website URL field: `https://drelix.org`
- Category: "Safety equipment supplier" or "Workwear store"

**Embedded Map** (`src/components/hero/contact/ContactMap.tsx`)

- Google Maps iframe showing business location
- Lazy loaded via Intersection Observer
- Address matches NAP exactly

#### **6. Internal Linking**

**Navigation** (`src/components/navbar`)

- Logo links to homepage (`href="/"`)
- Section links on homepage scroll to anchors (`#about`, `#products`, `#contact`)
- Section links on other pages navigate to homepage + anchor (`href="/#about"`)

**Footer** (`src/components/hero/footer`)

- Links to Privacy Policy (`/privacy`) and Terms (`/terms`)
- Links to homepage sections (`/#about`, `/#products`, `/#contact`)
- Consistent navigation structure across all pages

**Product Catalog**

- Homepage → `/products` (catalog overview)
- Catalog → `/products/[slug]` (individual categories)
- All category pages include breadcrumbs (visual and structured data)

#### **7. Accessibility (SEO Impact)**

Search engines favor accessible sites. Implementations:

- **ARIA landmarks:** `<main role="main" aria-label="Treść główna">`
- **Keyboard navigation:** Focus states on all interactive elements
- **Alt text:** Descriptive alternatives for all images
- **Semantic HTML:** Native elements (`<button>`, `<nav>`, `<section>`) over divs
- **Heading hierarchy:** Sequential, no skipped levels
- **Motion preferences:** `prefers-reduced-motion` respected in animations (`src/components/hero/hero-section`)

#### **8. Verification & Monitoring**

**Google Search Console Setup**

1. Add property: `https://drelix.org`
2. Verify ownership: HTML file method (`public/google[verification-code].html`)
3. Submit sitemap: `https://drelix.org/sitemap.xml`
4. Monitor: Coverage, Core Web Vitals, Mobile Usability

**Validation Tools**

- Rich Results Test: Verify JSON-LD schemas
- PageSpeed Insights: Check Core Web Vitals
- Mobile-Friendly Test: Confirm responsive design
- Lighthouse: Audit performance, accessibility, SEO

**Validated (Feb 2026)**

- **Rich Results Test** (homepage): 2 valid items detected — LocalBusiness ✓, Organization ✓. Crawl successful, indexing allowed. [Test result](https://search.google.com/test/rich-results/result?id=IXtTy6Oar9EEbP7fEMTJRQ)

**Measurable Outcomes**

- Lighthouse Mobile: 91/100 (Performance)
- Initial JavaScript bundle: Reduced from ~250 KiB unused to <100 KiB
- LCP: Hero image loads in ~1.5s on 4G mobile
- CLS: Effectively zero in Lighthouse testing (sized placeholders, Suspense boundaries with fixed heights)

### Product Management & Convex Backend

**Enterprise-Grade Data Architecture**

Convex powers the entire product catalog with production-ready security, real-time synchronization, and robust admin controls. All mutations are authenticated, all inputs validated, and all operations logged.

**Core Features:**

- **Real-time catalog sync** – Products, categories, and images update instantly across all pages
- **CSV import/export** – Kartoteki format support with automatic categorization by keywords and product codes
- **Inline editing** – Admin table with live edit mode, category reassignment, and bulk operations
- **Image management** – Upload, thumbnail generation, storage with automatic cleanup on deletion
- **Dynamic sitemap** – Category URLs fetched from Convex at build time, single source of truth

**Security Architecture (Production-Ready):**

- **Authentication & Authorization** – All 11 admin mutations protected with `requireAdmin()` middleware. JWT-based sessions (24h expiry), HTTP-only secure cookies, Next.js middleware guards all admin routes.
- **Rate Limiting** – Login attempts tracked by hashed IP: 5 attempts per 15 minutes, 15-minute lockout, daily cleanup of stale records via cron job.
- **Input Validation** – All user inputs validated for type, length, and format. Slugs normalized (lowercase, alphanumeric + hyphens only). Max length enforcement on all fields.
- **Error Handling** – Centralized error messages (public vs admin). Storage deletion uses `Promise.allSettled()` for resilient cleanup. Race conditions handled with double-check patterns.
- **Data Integrity** – Cascade deletion protection (can't delete category with products). Image cleanup on product deletion. Destructive operations require explicit confirmation.
- **Type Safety** – Explicit TypeScript types throughout, no `any` casting. Convex validators match TypeScript interfaces.

**Admin Capabilities:**

- Product CRUD: Create, update, delete products with inline editing
- Category management: Create custom categories, delete empty categories
- Bulk CSV import: Replace entire catalog while preserving image associations
- Image upload: Direct file upload with thumbnail generation
- Search & filter: Real-time search by product code or name
- Audit trail: All operations logged with error tracking

**Data Model:**

```
products (table)
  - Kod, Nazwa, Opis, CenaNetto, JednostkaMiary, StawkaVAT
  - categorySlug (indexed), imageStorageId, thumbnailStorageId
  - indexes: by_kod, by_category

categories (table)
  - slug (indexed), titleKey, displayName, createdAt
  - Admin-created categories sorted to top

loginAttempts (table)
  - key (hashed IP), attempts, lastAttemptAt
  - indexes: by_key, by_lastAttemptAt
```

**Operational Reliability:**

- Schema validation prevents invalid data at write time
- Automatic cleanup of stale rate limit records (daily cron)
- Error recovery: Storage deletion failures don't block transactions
- Memory warnings for large catalog operations (>1000 products)
- Comprehensive documentation: `convex/SECURITY.md`, `convex/PRODUCTION_CHECKLIST.md`

**Development Workflow:**

1. Edit product in admin table → Auto-saved to Convex
2. Upload CSV → Preview changes → Confirm → Replaces catalog
3. Upload image → Stored in Convex Cloud → Auto-cleanup on deletion
4. Create category → Available immediately in dropdowns and sitemap

**Why Convex:**

- Zero-config real-time sync eliminates state management complexity
- Built-in TypeScript support with end-to-end type safety
- File storage included (no separate S3/Cloudinary setup)
- Serverless functions scale automatically
- 99.9% uptime SLA for production apps

The Convex backend is production-ready with enterprise security standards, comprehensive error handling, and audit-grade logging. See `convex/README.md` for technical details and API reference.

### Testing

**Test Suite Status: 137/137 Passing (100%)**

Enterprise-grade test coverage ensures production reliability across all critical paths. The test suite validates security, data integrity, user flows, and error handling with comprehensive coverage of backend logic, API interactions, and frontend user experience.

**Test Architecture:**

- **Unit Tests (67)** – Pure function testing with no mocks, focusing on validation, sanitization, and business logic
- **Integration Tests (32)** – Convex backend testing with mocked database, covering CRUD operations, authentication, and race conditions
- **E2E Tests (38)** – Real browser testing with Playwright (Chromium + Firefox), validating user flows from login to catalog navigation

**Coverage Metrics (Critical Code):**

| Module                                     | Coverage | Focus                                 |
| ------------------------------------------ | -------- | ------------------------------------- |
| `convex/lib/authHelpers.ts`                | 100%     | Rate limiting state machine           |
| `convex/lib/validators.ts`                 | 100%     | Schema validation                     |
| `convex/lib/helpers.ts`                    | 100%     | Data transformations, storage cleanup |
| `convex/lib/convexAuth.ts`                 | 96%      | Authentication & input validation     |
| `convex/lib/errorMessages.ts`              | 90%      | Error sanitization                    |
| `src/lib/process-csv/catalogCategorize.ts` | 100%     | CSV categorization                    |

**Overall: 96% average coverage on security-critical backend code**

**Running Tests:**

```bash
# Unit & Integration Tests (99 tests)
npm run test:unit          # Run once
npm test                  # Watch mode
npm run test:coverage     # Generate coverage report

# E2E Tests (38 tests: Chromium + Firefox)
npm run test:e2e          # All browsers (requires: npx playwright install)
npm run test:e2e:ui       # Interactive mode
npm run test:e2e -- --project=chromium   # Chromium only
npm run test:e2e -- --project=firefox    # Firefox only
```

**Note:** E2E tests use `next build && next start` (not dev server), so they run predictably without lock conflicts. No need to stop a running dev server.

**Test Categories:**

**Backend Security Tests:**

- Authentication middleware on all 11 admin mutations
- Rate limiting: 5 attempts, 15-minute lockout, IP-based tracking
- Input validation: type safety, length limits, slug normalization
- Error recovery: Promise.allSettled for storage operations
- Race condition handling: duplicate category/product detection

**Data Integrity Tests:**

- Cascade protection (can't delete category with products)
- Destructive operation confirmation requirements
- Image cleanup on product deletion
- Schema validation for all database writes
- Empty state handling for queries

**User Flow Tests (E2E):**

- Admin login: form validation, error toast (wrong password or rate limit), loading states
- Home page: SEO meta, navigation, scroll progress, language toggle
- Product catalog: categories grid, navigation, breadcrumbs, empty states

**Test Targets (Unique IDs):**

All interactive elements use semantic `data-testid` attributes for reliable E2E testing:

- `admin-login-page`, `admin-login-form`, `admin-login-password`, `admin-login-submit`, `admin-login-back-link`
- `home-page`, `main-navbar`, `main-content`, `products-section`
- Category-specific elements dynamically generated

**Why This Matters:**

Comprehensive test coverage provides:

- **Deployment confidence** – All critical paths validated before production
- **Regression prevention** – Changes can't break existing functionality
- **Security assurance** – Authentication, validation, and error handling verified
- **Audit readiness** – Test results demonstrate quality standards

See `tests/README.md` for detailed test documentation, coverage reports, and troubleshooting guides.

### Legal Pages

- **Privacy Policy** (`/privacy`): GDPR-aligned, Polish law, contact form and in-store data, cookies, data subject rights, PUODO.
- **Terms of Service** (`/terms`): Brick-and-mortar retail, no distance sales, consumer rights (rękojmia, reklamacja), no 14-day withdrawal for in-store purchases.

### Bilingual UI

- Polish default. English toggle (client-side, `LanguageContext`). Same URL for both languages.
- Search engines are served Polish content by default (no hreflang tags).

**Rationale:** This approach avoids duplicate content issues and indexing complexity for a business targeting the Polish market exclusively. English is provided for occasional international visitors but is not optimized for search engines.

**If English SEO becomes a goal:** Implement URL-based locale routing (`/en/products`) and add hreflang tags. This would require duplicate content strategy and separate metadata per locale.

---

## Tech Stack

| Category      | Technology                             |
| ------------- | -------------------------------------- |
| **Framework** | Next.js 16 (App Router)                |
| **Language**  | TypeScript                             |
| **Styling**   | Tailwind CSS v4                        |
| **Backend**   | Convex                                 |
| **UI**        | shadcn-style components, Framer Motion |

---

## Deploy

Deploy to Vercel (or any Next.js host):

1. **Deploy Convex Backend First:**

   ```bash
   npx convex deploy --prod
   ```

2. **Set Environment Variables** in Vercel:
   - `NEXT_PUBLIC_SITE_URL` – Production URL (e.g. `https://drelix.org`)
   - `NEXT_PUBLIC_CONVEX_URL` – From Convex dashboard (e.g. `https://your-deployment.convex.cloud`)
   - `JWT_SECRET` – Cryptographically random string (min 32 chars) for admin sessions
   - `ADMIN_PASSWORD` – Strong admin password (min 16 chars, complex)
   - `RESEND_API_KEY` – From Resend dashboard for contact form
   - `RESEND_FROM_EMAIL` – Verified sending domain in Resend
   - `CONTACT_TO_EMAIL` – Recipient email for contact form submissions

3. **Connect Repository & Deploy** to Vercel

4. **Verify Deployment:**
   - Admin login works (`/admin/login`)
   - Product catalog loads (`/products`)
   - Sitemap generates (`/sitemap.xml`)
   - Contact form sends email

See `convex/PRODUCTION_CHECKLIST.md` for complete deployment verification steps.

---

## Sitemap Contents

The sitemap dynamically generates URLs from Convex:

- 1 homepage
- 1 catalog (`/products`)
- N product category pages (`/products/[slug]`) - fetched from Convex
- 1 privacy policy (`/privacy`)
- 1 terms of service (`/terms`)

Indexing depends on deployment, Google Search Console setup, and search engine behavior.

---

## Project Structure

```
drelix/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root metadata, OG, canonicals
│   │   ├── page.tsx            # Homepage
│   │   ├── products/           # Catalog and category pages
│   │   ├── privacy/            # Privacy Policy
│   │   ├── terms/              # Terms of Service
│   │   ├── admin/              # Admin (noindex)
│   │   ├── sitemap.ts          # Sitemap generation
│   │   └── robots.txt/         # robots.txt route
│   ├── components/
│   │   ├── hero/               # Homepage sections
│   │   ├── products/           # Catalog components
│   │   ├── navbar/
│   │   ├── JsonLd.tsx          # Structured data
│   │   └── ui/
│   ├── lib/
│   │   ├── seo.ts              # Canonical URL utilities
│   │   └── robotsContent.ts    # robots.txt policy
│   └── data/
├── convex/
└── public/
```

---

## Recent Changes

### **Security Hardening & Production Readiness (Feb 2026)**

Complete security audit and hardening of Convex backend:

- **Authentication layer** – Added `requireAdmin()` middleware to all 11 admin mutations (updateProduct, createProduct, deleteProduct, generateUploadUrl, etc.)
- **Input validation** – All user inputs validated for type, length, format. Slugs normalized and sanitized. Rate limit keys validated to prevent abuse.
- **Error handling** – Centralized error message system (public vs admin). Storage deletion error recovery. Race condition handling in category creation.
- **Type safety** – Removed all `as` type assertions. Created explicit return types (`ProductUpdateResult`, `MutationSuccess`). Full TypeScript compliance.
- **Destructive operation safeguards** – `setCategories` requires `confirmDestruction: true`. Category deletion checks for products. Warnings for operations >1000 records.
- **Documentation** – Added `convex/SECURITY.md` (security architecture), `convex/PRODUCTION_CHECKLIST.md` (deployment guide), `convex/AUDIT_SUMMARY.md` (audit report).

**Result:** Enterprise-grade backend with 100% authentication coverage, comprehensive input validation, and audit-ready logging. Zero linter errors, full production compliance.

### **Performance Optimization (Feb 2026)**

- **Code splitting implementation** – Below-the-fold sections lazy loaded with `next/dynamic` + `Suspense`. Initial JavaScript bundle reduced by 60-70%.
- **Google Maps lazy loading** – Intersection Observer defers map loading until user scrolls near. Saves 152 KiB on initial load.
- **CSS inlining** – Enabled `experimental.inlineCss` to eliminate render-blocking CSS requests.
- **Resource hints** – Added preconnect to Convex and dns-prefetch for Google services in root layout.
- **Image optimization** – Hero image quality reduced to 70, maintaining visual quality while improving LCP.
- **Lighthouse mobile score: 77 → 91** – 14-point improvement through systematic optimization.

### **UX & Navigation**

- **Navbar scroll progress** – A thin bar under the navbar fills left→right as the user scrolls (reading progress), using Framer Motion `useScroll` and `useSpring`.
- **Navbar section links (route-aware)** – Section links (About, Products, Why Us, Contact) are only relevant on the homepage. On `/` they scroll to in-page sections with scroll-spy and active styling (primary color + bottom border). On other routes (e.g. `/products/[slug]`, `/privacy`) the same items are `<Link href="/#section">` so they navigate to the homepage and the target section.
- **Navbar active section** – Scroll-spy highlights the current section; active item is uppercase, primary color, and has a bottom border. Scroll-spy runs only on the homepage.
- **Hero section** – Subtle entrance animations (Framer Motion): heading, subtitle, CTA, and trust pills fade in and slide up with a short stagger. Respects `prefers-reduced-motion`.

### **Catalog Management**

- **Dynamic category system** – Sitemap, product pages, and homepage fetch categories directly from Convex. Single source of truth.
- **Category deletion** – Admins can delete empty categories with confirmation UI. Cascade protection prevents accidental data loss.
- **Product description field** – Added optional `Opis` field to product schema. Displays in admin table between Nazwa and Cena netto.
- **Alphabetical ordering** – Products and categories display alphabetically across catalog pages.
- **Icon diversity** – Replaced repetitive category icons with semantically aligned icons via slug-to-icon mapping.
- **Search prioritization** – KOD (product code) prioritized in admin search results.
- **Exact KOD matching** – `exactKods` field in category rules for precise product categorization.

---

## Operational Risks

**Convex Dependency**

- **Risk:** Convex service availability = site content availability
- **Impact:** Product catalog, admin area, sitemap generation all depend on Convex
- **Mitigation:** Convex has >99.9% uptime SLA. Static pages (homepage, legal) remain functional during outages. Consider implementing static fallback for critical catalog pages if availability becomes a concern.

**Dynamic Sitemap Generation**

- **Risk:** Build-time failure if Convex is unreachable
- **Impact:** Deployment fails, sitemap becomes stale
- **Mitigation:** Next.js ISR could be added for sitemap route. Monitor build logs. Convex availability during builds is high.

**Experimental Next.js Features**

- **Risk:** `experimental.inlineCss: true` may break or change behavior in Next.js updates
- **Impact:** Render-blocking CSS returns, performance regression
- **Mitigation:** Test Lighthouse scores after each Next.js upgrade. Feature flag can be disabled in `next.config.ts` without code changes.

**Image Hosting**

- **Risk:** Product images stored in Convex Cloud, remote URL changes
- **Impact:** Broken images on category pages
- **Mitigation:** `next.config.ts` remote patterns configured for `*.convex.cloud`. If Convex URL changes, update environment variable and redeploy.

**Search Engine Algorithm Changes**

- **Risk:** Google updates may affect ranking factors (e.g., Core Web Vitals weighting)
- **Impact:** Rankings drop despite code not changing
- **Mitigation:** Monitor Google Search Console weekly. Performance metrics logged. Document baseline scores (Lighthouse 91/100 as of Feb 2026).

**Admin Access**

- **Risk:** Single admin login point (`/admin/login`), no 2FA
- **Impact:** Unauthorized catalog modifications if credentials compromised
- **Mitigation:** Rate limiting (5 attempts/15min), JWT sessions (24h expiry), timing-safe password comparison, hashed IP tracking. All admin mutations require authentication. Strong password policy enforced. Consider adding 2FA if team grows beyond single admin.

---

## Quick Reference

| Task                           | Location                                                                    |
| ------------------------------ | --------------------------------------------------------------------------- |
| Change site-wide metadata      | `src/app/layout.tsx`                                                        |
| Change business info (JSON-LD) | `src/components/JsonLd.tsx`                                                 |
| Add product category           | `src/data/catalogCategories.ts`, `src/components/products/productConfig.ts` |
| Change crawl policy            | `src/lib/robotsContent.ts`                                                  |
| View sitemap URLs              | `/sitemap.xml` or `src/app/sitemap.ts`                                      |

---

## Document Maintenance

**Last Reviewed:** February 2026  
**Owner:** Development Team  
**Review Cadence:** Quarterly, or after major Next.js/Convex upgrades  
**Update Triggers:**

- Next.js version updates (check experimental features)
- Lighthouse score regression >5 points
- New product categories added (update SEO metadata)
- Legal/GDPR requirement changes

**Version History:**

- Feb 2026: Security hardening (authentication, input validation, error handling), performance optimization (Lighthouse 77→91), code splitting, product description field added, comprehensive test suite (137 tests: 99 unit/convex + 38 e2e Chromium+Firefox, 96% coverage)
- Initial: SEO architecture, structured data, local business setup

---

_This README documents what was built and how. Live results (rankings, traffic, indexing) depend on deployment, Google Search Console setup, content quality, and market conditions._
