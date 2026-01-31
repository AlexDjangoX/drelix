# Drelix – SEO reference guide

This document is the single source of truth for SEO on the Drelix project. Use it when adding pages, changing metadata, or auditing search and social behaviour.

---

## 1. Overview

- **Default language:** Polish (`pl`). English is available via client-side switch; same URL for both.
- **Site URL:** Set via `NEXT_PUBLIC_SITE_URL` (e.g. `https://drelix.pl`). Used for canonicals, sitemap, Open Graph, and JSON-LD.
- **Rendering:** Static (no revalidation). All important content is in the initial HTML for crawlers.

---

## 2. What we maintain

| Area | Purpose |
|------|--------|
| **Metadata** | Title, description, keywords, Open Graph, Twitter, canonicals |
| **Sitemap** | Lists all indexable URLs for search engines |
| **robots.txt** | Tells crawlers what to allow/disallow and where the sitemap is |
| **JSON-LD** | LocalBusiness + WebPage structured data for rich results |
| **Semantic HTML** | One `<h1>` per page, `<main>`, sections, meaningful headings |
| **Image alt text** | Descriptive `alt` on all content images |

---

## 3. File map

| File | Role |
|------|------|
| `src/app/layout.tsx` | Root metadata (title template, default description, OG, Twitter, robots, canonical for homepage). |
| `src/app/robots.ts` | Generates `/robots.txt`: allow `/`, disallow `/api/`, sitemap URL. |
| `src/app/sitemap.ts` | Generates `/sitemap.xml`: homepage + all product routes. |
| `src/components/JsonLd.tsx` | Injects LocalBusiness + WebPage JSON-LD in `<head>`. |
| `src/app/products/*/layout.tsx` | Per-product metadata: title, description, canonical, Open Graph, Twitter. |

---

## 4. Metadata conventions

### Root (`layout.tsx`)

- **Title template:** `%s | Drelix` so child pages get “Page title | Drelix”.
- **Default title:** “Drelix - Odzież Robocza i Ochronna | Wadowice”.
- **Canonical:** `metadataBase` + `alternates.canonical` = homepage URL.
- **Open Graph:** locale `pl_PL`, alternateLocale `en_GB`, image `/og-image.png` (1200×630).

### Product pages (e.g. `products/gloves/layout.tsx`)

Each product layout must define:

- **title** – Short, descriptive (e.g. “Rękawice robocze i ochronne”).
- **description** – One or two sentences, include “Drelix” and location/context where relevant.
- **alternates.canonical** – Full URL: `{siteUrl}/products/{slug}`.
- **openGraph** – `url` (same as canonical), `title`, `description`.
- **twitter** – At least `card: 'summary_large_image'` and `title`.

Use the same pattern for any new product or category route.

---

## 5. Sitemap

- **Source:** `src/app/sitemap.ts`.
- **Output:** `https://{siteUrl}/sitemap.xml`.

**Included URLs:**

- Homepage (priority 1, changeFrequency weekly).
- `/products/gloves`, `/products/boots`, `/products/spodnie`, `/products/koszula` (priority 0.9, weekly).

**When adding a new page:** Add a corresponding entry in the `productRoutes` array (or equivalent) in `sitemap.ts` so it is included in the sitemap.

---

## 6. robots.txt

- **Source:** `src/app/robots.ts`.
- **Rules:** Allow all user agents on `/`, disallow `/api/`, reference sitemap.

Change only if you add new areas that should be blocked (e.g. `/admin/`) or new sitemaps.

---

## 7. JSON-LD (JsonLd.tsx)

- **LocalBusiness:** name, description, url, telephone, email, address, geo, opening hours, priceRange, image.
- **WebPage:** url, name, description, isPartOf, about, inLanguage.

Update `JsonLd.tsx` when:

- Business name, address, phone, email, or hours change.
- You add an official social or other “sameAs” URL.

---

## 8. Semantic HTML & headings

- **One `<h1>` per page:** Home = hero title; product pages = product category title (e.g. “Rękawice robocze i ochronne”).
- **Sections:** Use `<section>` with clear headings (e.g. `<TwoToneHeading as="h2">`) for “O nas”, “Produkty”, “Kontakt”, etc.
- **Main content:** Wrapped in `<main id="main-content" role="main" aria-label="…">` on the homepage; product pages use their own main structure.

Keep a logical heading order (h1 → h2 → h3) and avoid skipping levels.

---

## 9. Images

- **Content images:** Always set a meaningful `alt` (e.g. product name or short description). Product grid and lightbox images already do this.
- **OG image:** `/public/og-image.png` at 1200×630. Used as default for social shares; product pages inherit unless overridden.

---

## 10. Checklist for new pages

When you add a new public page (e.g. a new product category):

1. [ ] Add **metadata** in that route’s `layout.tsx`: title, description, canonical, openGraph, twitter.
2. [ ] Add the URL to **`sitemap.ts`** (or the appropriate list in it).
3. [ ] Ensure the page has **exactly one `<h1>`** and sensible heading hierarchy.
4. [ ] If the page has content images, give them **descriptive `alt`** text.
5. [ ] (Optional) Add **JSON-LD** (e.g. ItemList, Product) if you want rich results for that page.

---

## 11. Environment

- **`NEXT_PUBLIC_SITE_URL`** – Must be set in production to the live domain (e.g. `https://drelix.pl`). Used for:
  - Canonical URLs  
  - Sitemap URLs  
  - Open Graph URLs  
  - JSON-LD `url` and `@id`  

Without it, the app falls back to `https://drelix.pl` in code; ensure the deployed value matches your real domain.

---

## 12. Optional enhancements (not required)

- **Product JSON-LD:** Add `ItemList` or `Product` schema on product pages for richer search results.
- **hreflang:** If you later use separate URLs per language (e.g. `/en/products/gloves`), add `hreflang` and alternate links in metadata.
- **OG image per product:** Override `openGraph.images` in a product layout if you want a dedicated share image for that category.

---

## 13. Quick reference

| I want to… | Do this… |
|------------|-----------|
| Change site-wide title/description | Edit `src/app/layout.tsx` metadata. |
| Change business info in search/snippets | Edit `src/components/JsonLd.tsx`. |
| Add a new product/category page | Add metadata + canonical + OG in that route’s layout; add URL to `sitemap.ts`; one h1, good alt on images. |
| Change what’s crawlable | Edit `src/app/robots.ts`. |
| See what URLs are in the sitemap | Open `/sitemap.xml` or read `src/app/sitemap.ts`. |
| Set production URL | Set `NEXT_PUBLIC_SITE_URL` in hosting (e.g. Vercel env). |

---

*Last updated to reflect: root + product metadata, sitemap including all product routes, canonicals and Open Graph on product layouts, JSON-LD, and semantic structure.*
