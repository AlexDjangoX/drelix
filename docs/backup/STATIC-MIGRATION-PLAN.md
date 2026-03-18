# Migration Plan: Dual-Mode Static + Convex

A plan to support **both** modes in the same codebase:

- **Convex mode** – For admin work. Live data, full CRUD, image uploads. Use when editing the catalog.
- **Static mode** – For production. Backup JSON + local images. No Convex at runtime. Deploy this to Vercel/production.

Switch via environment variable. Same codebase, two deployment targets.

---

## Architecture Overview

| Mode | When | Data source | Admin | Deploy |
|------|------|-------------|-------|--------|
| **Convex** | Admin editing | Convex (live) | ✅ Full access | Staging / local |
| **Static** | Production | Backup JSON + `public/product-images/` | ❌ Not available | Vercel / CDN |

**Workflow:**
1. Admin edits catalog in Convex mode (staging or local).
2. Run `npm run export:download` to create backup.
3. Build with `USE_STATIC_CATALOG=true` → static export.
4. Deploy static output to production.

---

## Prerequisites

- A recent backup from `npm run export:download`:
  - `backups/export-YYYY-MM-DD-HHMMSS/data/data.json`
  - `backups/export-YYYY-MM-DD-HHMMSS/manifest.json`
  - `backups/product-images/Large/*.webp`
  - `backups/product-images/Thumbnails/*.webp`

---

## Phase 1: Data Source Abstraction

### 1.1 Environment flag

```bash
# .env.production (or Vercel env)
USE_STATIC_CATALOG=true

# .env.local / .env.development (admin)
USE_STATIC_CATALOG=false
# NEXT_PUBLIC_CONVEX_URL=...
```

### 1.2 Create static data loader

Create `src/lib/staticCatalog.ts` that:

- Loads backup JSON (from `src/data/catalog.json` or a fixed path)
- Exposes the same shape as Convex:
  - `listCategorySlugs()` → `string[]`
  - `listCatalogSections()` → `CatalogSection[]`
  - `getCatalogSection(slug)` → `CatalogSection | null`
- Maps `storageId` → local paths using manifest (e.g. `/product-images/thumbnails/{filename}`)

### 1.3 Create catalog facade

Create `src/lib/catalogSource.ts` (or similar):

```ts
// Pseudo-code
export async function listCategorySlugs(): Promise<string[]> {
  if (process.env.USE_STATIC_CATALOG === 'true') {
    return getStaticCatalog().listCategorySlugs();
  }
  return fetchQuery(api.catalog.listCategorySlugs);
}
```

Same pattern for `listCatalogSections`, `getCatalogSection`. Public catalog code calls the facade instead of Convex directly.

### 1.4 Image paths

- **Static:** Images live in `public/product-images/{large,thumbnails}/`. Backup script copies from `backups/product-images/{Large,Thumbnails}/` before build.
- **Convex:** Images stay as Convex storage URLs (no change).

---

## Phase 2: Switch Public Catalog to Facade

### 2.1 Server-side (static-safe)

| File | Change |
|------|--------|
| `src/app/sitemap.ts` | Use `listCategorySlugs()` from facade |
| `src/app/products/[slug]/page.tsx` | Use `getCatalogSection(slug)` from facade |
| `src/app/products/[slug]/layout.tsx` | Use facade for slugs + section |
| `src/components/products/ProductsCatalog/ProductsCatalogJsonLd.tsx` | Use `listCatalogSections()` from facade |

### 2.2 Client-side (ProductsCatalog)

`ProductsCatalogClient` uses `useQuery(api.catalog.listCatalogSections)`. In static mode there is no Convex.

**Options:**
- **A)** Fetch sections on the server, pass as prop. Catalog page becomes a server component that fetches and passes data.
- **B)** In static mode, embed sections as JSON in the page (e.g. in a script tag or `__NEXT_DATA__`), read client-side. No Convex call.
- **C)** Make `/products` a server-rendered page that reads from the facade and renders `ProductsCatalogContent` with the data. No client-side Convex.

Prefer **C** for simplicity: catalog page is server-rendered, passes `sections` to the content component.

### 2.3 ProductPageClient

Currently uses `useQuery(api.catalog.getCatalogSection)` for live updates. In static mode the page already receives `section` from the server. Use that when `USE_STATIC_CATALOG` is true; otherwise keep the `useQuery` for live data in admin mode.

---

## Phase 3: Admin Stays Convex-Only

- Admin routes (`/admin/*`) always use Convex.
- Wrap app in `ConvexClientProvider` only when **not** in static mode, or always include it but have it no-op when Convex URL is missing (current placeholder behavior).
- In static production build: exclude admin routes or show a "Admin not available in static mode" message.

**Simpler approach:** Build two entry points or use middleware:
- Production build: `output: 'export'`, no admin, static catalog.
- Admin build: Normal Next.js, Convex, no static export. Deploy to a separate URL (e.g. `admin.drelix.pl` or `drelix-admin.vercel.app`).

**Or:** One app, conditional:
- If `USE_STATIC_CATALOG=true`: hide/disable admin nav, use static catalog.
- If `USE_STATIC_CATALOG=false`: full Convex, admin works.

---

## Phase 4: Build Pipelines

### 4.1 Production (static)

```bash
npm run export:download          # Get latest from Convex
npm run prepare-static          # Copy backup → public, data.json → src/data
USE_STATIC_CATALOG=true next build
next export                     # or output: 'export' in config
```

### 4.2 Admin / staging (Convex)

```bash
# Normal dev
npm run dev

# Or build for staging (no static export)
USE_STATIC_CATALOG=false next build
```

---

## Phase 5: Conditional Convex Provider

In `layout.tsx`:

```tsx
// Only wrap with Convex when using Convex for catalog
const useConvex = process.env.USE_STATIC_CATALOG !== 'true';

return (
  <html>
    <body>
      {useConvex ? (
        <ConvexClientProvider>{children}</ConvexClientProvider>
      ) : (
        children
      )}
    </body>
  </html>
);
```

Admin pages will need Convex. Options:
- Admin is a separate app or subdomain that always uses Convex.
- Or: always include `ConvexClientProvider`, but in static mode the catalog never calls it; admin would need to be on a different deployment (Convex mode).

---

## Summary: Dual-Mode Design

| Concern | Convex mode | Static mode |
|---------|-------------|-------------|
| Catalog data | `fetchQuery` / `useQuery` | `staticCatalog.ts` |
| Images | Convex storage URLs | `/product-images/{large,thumbnails}/` |
| Admin | ✅ Full access | ❌ Not available |
| Sitemap | Convex slugs | Static slugs |
| Product pages | Convex section | Static section |
| Build | `next build` (no export) | `next build` + `output: 'export'` |
| Deploy | Staging URL | Production URL |

---

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/lib/staticCatalog.ts` – load backup JSON, expose catalog API |
| Create | `src/lib/catalogSource.ts` – facade: Convex vs static based on env |
| Create | `scripts/prepare-static-build.js` – copy backup → public, data.json → src/data |
| Modify | `src/app/sitemap.ts` – use catalog facade |
| Modify | `src/app/products/[slug]/page.tsx` – use catalog facade |
| Modify | `src/app/products/[slug]/layout.tsx` – use catalog facade |
| Modify | `src/app/products/page.tsx` – server-fetch sections, pass to client (or keep Convex when not static) |
| Modify | `src/components/products/ProductsCatalog/ProductsCatalogClient.tsx` – accept sections as prop when static |
| Modify | `src/components/products/ProductPage/ProductPageClient.tsx` – use server section when static |
| Modify | `layout.tsx` – conditional Convex provider (or separate admin app) |
| Modify | `next.config.js` – `output: 'export'` only for production build script |

---

## Risks & Notes

- **Two deployments** – Production (static) and admin (Convex) may be separate URLs.
- **Catalog order** – Static mode needs `imageDimensions` in backup or a simpler sort.
- **Admin URL** – Consider protecting admin with auth and a separate subdomain or path.
- **Seamless switch** – Toggling `USE_STATIC_CATALOG` and rebuilding switches mode; no code changes.
