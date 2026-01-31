# Drelix – SEO reference guide

This document is the single source of truth for SEO on the Drelix project. Use it when adding pages, changing metadata, or auditing search and social behaviour.

---

## 1. Overview

- **Default language:** Polish (`pl`). English is available via client-side switch; same URL for both.
- **Site URL:** Set via `NEXT_PUBLIC_SITE_URL` (e.g. `https://drelix.pl`). Used for canonicals, sitemap, Open Graph, and JSON-LD.
- **Rendering:** Static (no revalidation). All important content is in the initial HTML for crawlers.

---

## 2. Modern SEO principles (alignment with current best practices)

These principles inform how we implement the items in §2 “What we maintain”. They align with Google Search Essentials, Core Web Vitals, and helpful content guidance.

| Principle | What we do |
|-----------|------------|
| **Title length** | Aim for **50–60 characters** (or ~600 px) so titles display fully in SERPs; ~90% of titles under 60 chars display without truncation. Front-load important terms; avoid keyword stuffing and repetitive boilerplate (Google may rewrite titles otherwise). |
| **Meta description length** | Aim for **150–160 characters**. Descriptions don’t directly rank but influence CTR; keep them concise, informative, and relevant. Google may replace with page content if it fits the query better. |
| **Canonical URLs** | Every indexable page has `alternates.canonical`. Canonicals tell Google which URL is the “main” version and help consolidate duplicate signals. |
| **Core Web Vitals** | LCP (loading), INP (responsiveness), CLS (visual stability) matter for UX and search. We support them via static/SSG where possible, `next/image`, and minimal layout shift. Monitor in Search Console → Core Web Vitals. |
| **Helpful content & E-E-A-T** | Content should be created for users first. We signal **Experience, Expertise, Authoritativeness, Trustworthiness** via: accurate business info in JSON-LD and footer, real product data, clear contact and opening hours, and unique per-page titles/descriptions (no thin or copied content). |
| **Structured data (JSON-LD)** | Schema helps Google understand meaning and context; it can unlock rich results (e.g. breadcrumbs, local business). Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) or Search Console. |
| **Mobile-first** | Google primarily uses the mobile version for indexing. Responsive layout, readable tap targets, and `viewport`/theme are already in place. |

---

## 3. What we maintain

| Area | Purpose |
|------|--------|
| **Metadata** | Title, description, keywords, Open Graph, Twitter, canonicals |
| **Sitemap** | Lists all indexable URLs for search engines |
| **robots.txt** | Tells crawlers what to allow/disallow and where the sitemap is |
| **JSON-LD** | LocalBusiness + WebPage structured data for rich results |
| **Semantic HTML** | One `<h1>` per page, `<main>`, sections, meaningful headings |
| **Image alt text** | Descriptive `alt` on all content images |

---

## 4. File map

| File | Role |
|------|------|
| `src/app/layout.tsx` | Root metadata (title template, default description, OG, Twitter, robots, canonical for homepage). |
| `src/app/robots.txt/route.ts` | Serves `/robots.txt` dynamically. Uses same `NEXT_PUBLIC_SITE_URL` as sitemap so Sitemap URL in robots.txt always aligns with sitemap. Policy: Content-signal, search engines allowed, AI blocked; body from `src/lib/robotsContent.ts`. |
| `src/app/sitemap.ts` | Generates `/sitemap.xml`: homepage, `/products`, and all product category URLs. Imports `PRODUCT_SLUGS` from `@/components/products/productConfig`. |
| `src/components/JsonLd.tsx` | Injects LocalBusiness + WebPage JSON-LD in root `<head>`. |
| `src/app/products/page.tsx` | Catalog index: metadata (title, description, keywords, canonical, OG with image, Twitter), ItemList JSON-LD. |
| `src/app/products/[slug]/layout.tsx` | Product category layout: `generateMetadata`, `generateStaticParams`, BreadcrumbList JSON-LD; metadata per slug from `productConfig`. |
| `src/components/products/productConfig.ts` | Single source for all category slugs (23): `PRODUCT_SLUGS`, `productConfig` (metadata per slug). Used by sitemap, layout, pages. Add new categories here; sitemap picks them up automatically. |

---

## 5. Metadata conventions

### Root (`layout.tsx`)

- **Title template:** `%s | Drelix` so child pages get “Page title | Drelix”.
- **Default title:** “Drelix - Odzież Robocza i Ochronna | Wadowice”.
- **Canonical:** `metadataBase` + `alternates.canonical` = homepage URL.
- **Open Graph:** locale `pl_PL`, alternateLocale `en_GB`, image `/og-image.png` (1200×630).

**Best practice:** Keep page titles within **50–60 characters** where possible; keep meta descriptions within **150–160 characters**. Avoid keyword stuffing; front-load the most important terms. Descriptions should be unique and informative per page.

### Catalog index (`/products`)

- **title**, **description**, **keywords** – Set in `src/app/products/page.tsx`.
- **alternates.canonical** – `{siteUrl}/products`.
- **openGraph** – `type`, `url`, `siteName`, `title`, `description`, `locale`, `images` (1200×630).
- **twitter** – `card`, `title`, `description`.

### Product category pages (`products/[slug]`)

Product metadata is driven by **`productConfig`** in `src/components/products/productConfig.ts`. The shared layout uses `generateMetadata({ params })` to set:

- **title**, **description**, **keywords** – From `productConfig[slug].metadata` plus slug/title.
- **alternates.canonical** – `{siteUrl}/products/{slug}`.
- **openGraph** – `type`, `url`, `siteName`, `title`, `description`, `locale`, `images` (default OG image).
- **twitter** – `card`, `title`, `description`.

**When adding a new product category:** Add the slug and metadata to `productConfig` in `src/components/products/productConfig.ts` (and to `CATEGORY_SLUGS` in `src/data/catalogCategories.ts` if needed). The sitemap imports `PRODUCT_SLUGS` from productConfig and includes all slugs automatically.

---

## 6. Sitemap

- **Source:** `src/app/sitemap.ts`.
- **Output:** `https://{siteUrl}/sitemap.xml`.

**Included URLs:**

- Homepage (priority 1, weekly).
- `/products` catalog (priority 0.9, weekly).
- One URL per slug in `PRODUCT_SLUGS` (23 categories, e.g. `/products/gloves`, `/products/spodnie`; priority 0.9, weekly). The sitemap imports `PRODUCT_SLUGS` from `@/components/products/productConfig`.

**When adding a new product category:** Add the slug and metadata in `src/components/products/productConfig.ts` (and `src/data/catalogCategories.ts`); the sitemap will include it automatically.

---

## 7. robots.txt

- **Source:** `src/app/robots.txt/route.ts` (dynamic; served at `/robots.txt`). Body built in `src/lib/robotsContent.ts`.
- **Alignment with sitemap:** Both robots and sitemap use **the same** `NEXT_PUBLIC_SITE_URL` (fallback `https://drelix.pl`). The Sitemap URL in robots.txt is `${baseUrl}/sitemap.xml`, so it always matches the sitemap origin — no manual sync.
- **Policy:**
  - **Content-signal** (modern standard): `search=yes`, `ai-train=no`, `ai-input=no` — allows search indexing, reserves rights for AI training/input per EU Copyright Directive.
  - **Search engines (SEO):** Googlebot, Bingbot, Slurp, DuckDuckBot, YandexBot, Baiduspider — **Allow** `/`, **Disallow** `/api/`, `/admin/`. Only public pages (home, products, category pages) are crawlable; API and admin are excluded to eliminate useless traffic.
  - **AI / training crawlers:** Long list of bots (GPTBot, CCBot, ClaudeBot, PerplexityBot, etc.) — **Disallow** `/` to reduce non-search traffic and protect content use.
  - **Sitemap:** `${baseUrl}/sitemap.xml` (same origin as `src/app/sitemap.ts`).
- **Result:** Excellent SEO (all important pages allowed, sitemap referenced) and no crawl waste on API/admin or AI scrapers.

Change policy in `src/lib/robotsContent.ts`; add/remove crawlers there. Sitemap URL stays aligned automatically.

---

## 8. JSON-LD

### Root (`src/components/JsonLd.tsx`)

- **LocalBusiness:** name, description, url, telephone, email, address, geo, opening hours, priceRange, image.
- **WebPage:** url, name, description, isPartOf, about, inLanguage.

Update when: business name, address, phone, email, or hours change; or when adding “sameAs” URLs.

### Catalog page (`/products`)

- **ItemList:** name, description, numberOfItems, itemListElement (each category as ListItem with name + url). Injected in `src/app/products/page.tsx`.

### Product category pages (`/products/[slug]`)

- **BreadcrumbList:** Strona główna → Katalog produktów → [category title]. Injected in `src/app/products/[slug]/layout.tsx`.

**Validation:** Use [Google Rich Results Test](https://search.google.com/test/rich-results) or Search Console to confirm structured data is valid and eligible for rich results.

---

## 9. Semantic HTML & headings

- **One `<h1>` per page:** Home = hero title; product pages = product category title (e.g. “Rękawice robocze i ochronne”).
- **Sections:** Use `<section>` with clear headings (e.g. `<TwoToneHeading as="h2">`) for “O nas”, “Produkty”, “Kontakt”, etc.
- **Main content:** Wrapped in `<main id="main-content" role="main" aria-label="…">` on the homepage; product pages use their own main structure.

Keep a logical heading order (h1 → h2 → h3) and avoid skipping levels.

---

## 10. Images

- **Content images:** Always set a meaningful `alt` (e.g. product name or short description). Product grid and lightbox images already do this. Good alt text supports accessibility and image search.
- **OG image:** `/public/og-image.png` at **1200×630** (recommended for Facebook/LinkedIn; Twitter supports same ratio). Used as default for social shares; product pages inherit unless overridden. Use descriptive `alt` on OG images in metadata where supported.

---

## 11. Checklist for new pages

When you add a new public page (e.g. a new product category):

1. [ ] Add **metadata** in that route’s `layout.tsx`: title (50–60 chars ideal), description (150–160 chars ideal), canonical, openGraph, twitter.
2. [ ] Add the URL to **`sitemap.ts`** (or the appropriate list in it).
3. [ ] Ensure the page has **exactly one `<h1>`** and sensible heading hierarchy (h1 → h2 → h3).
4. [ ] If the page has content images, give them **descriptive `alt`** text.
5. [ ] (Optional) Add **JSON-LD** (e.g. ItemList, Product) if you want rich results; validate with Google Rich Results Test.

---

## 12. Environment

- **`NEXT_PUBLIC_SITE_URL`** – Must be set in production to the live domain (e.g. `https://drelix.pl`). Used for:
  - Canonical URLs  
  - Sitemap URLs  
  - Open Graph URLs  
  - JSON-LD `url` and `@id`  

Without it, the app falls back to `https://drelix.pl` in code; ensure the deployed value matches your real domain.

---

## 13. Optional enhancements (not required)

- **Product JSON-LD:** Add `ItemList` or `Product` schema on product pages for richer search results.
- **hreflang:** If you later use separate URLs per language (e.g. `/en/products/gloves`), add `hreflang` and alternate links in metadata.
- **OG image per product:** Override `openGraph.images` in a product layout if you want a dedicated share image for that category.

---

## 14. Further reading

- [Google Search Central – SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central – Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Influencing title links and snippets](https://developers.google.com/search/docs/appearance/snippet) (title/description display)
- [Google Rich Results Test](https://search.google.com/test/rich-results) (validate JSON-LD)

---

## 15. Quick reference

| I want to… | Do this… |
|------------|-----------|
| Change site-wide title/description | Edit `src/app/layout.tsx` metadata. |
| Change business info in search/snippets | Edit `src/components/JsonLd.tsx`. |
| Add a new product/category page | Add slug + metadata in `src/components/products/productConfig.ts` (and `src/data/catalogCategories.ts`). Sitemap and layout pick it up; ensure one h1 and good alt on images. |
| Change what’s crawlable | Edit `src/lib/robotsContent.ts` (and route in `src/app/robots.txt/route.ts` if needed). |
| See what URLs are in the sitemap | Open `/sitemap.xml` or read `src/app/sitemap.ts`. |
| Set production URL | Set `NEXT_PUBLIC_SITE_URL` in hosting (e.g. Vercel env). |

---

*Last updated: alignment with modern SEO (title/description length, Core Web Vitals, E-E-A-T, helpful content); file map and JSON-LD (ItemList, BreadcrumbList); robots /admin/; further reading.*
