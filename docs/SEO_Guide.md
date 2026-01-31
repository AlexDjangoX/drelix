# Drelix – SEO reference guide

This document is the single source of truth for SEO on the Drelix project. Use it when adding pages, changing metadata, or auditing search and social behaviour.

---

## 1. Overview

- **Default language:** Polish (`pl`). English is available via client-side switch; same URL for both. **English content is not intended to rank independently in search** — Google indexes the default Polish view; the English toggle is for on-site UX only. Bots will only see Polish content as they do not execute JavaScript language toggles.
- **Site URL:** Set via `NEXT_PUBLIC_SITE_URL` (e.g. `https://drelix.org`). Used for canonicals, sitemap, Open Graph, and JSON-LD.
- **Canonicals:** All canonicals resolve to the **non–trailing-slash** form; keep sitemap and internal links consistent (e.g. `https://drelix.org/products/gloves`, not `.../gloves/`).
- **Rendering:** Static (no revalidation). All important content is in the initial HTML for crawlers. **Trade-off:** JSON-LD and metadata (opening hours, address, phone) do not update until the next deploy; that's a conscious choice for CWV and crawlability.
- **HTTPS:** All pages served over HTTPS. Ensure SSL certificate is valid and auto-renewing; monitor Security Issues in Google Search Console.
- **Expected index coverage:** 25 pages (1 homepage + 1 catalog + 23 product categories). Monitor actual coverage in Google Search Console → Coverage report.

---

## 2. Modern SEO principles (alignment with current best practices)

These principles inform how we implement the items in §3 "What we maintain". They align with Google Search Essentials, Core Web Vitals, and helpful content guidance.

| Principle | What we do |
|-----------|------------|
| **Title length** | Aim for **50–60 characters** (or ~600 px) so titles display fully in SERPs; ~90% of titles under 60 chars display without truncation. Front-load important terms; avoid keyword stuffing and repetitive boilerplate (Google may rewrite titles otherwise). |
| **Meta description length** | Aim for **150–160 characters**. Descriptions don't directly rank but influence CTR; keep them concise, informative, and relevant. Google may replace with page content if it fits the query better. |
| **Canonical URLs** | Every indexable page has `alternates.canonical`. Canonicals tell Google which URL is the "main" version and help consolidate duplicate signals. |
| **Core Web Vitals** | LCP (loading), INP (responsiveness), CLS (visual stability) matter for UX and search. We support them via static/SSG where possible, `next/image`, and minimal layout shift. **Monitor:** Search Console → Core Web Vitals report (real user metrics at 75th percentile); one-off checks: [PageSpeed Insights](https://pagespeed.web.dev/) or Lighthouse in DevTools (lab data). |
| **Helpful content & E-E-A-T** | Content should be created for users first. We signal **Experience, Expertise, Authoritativeness, Trustworthiness** via: accurate business info in JSON-LD and footer, real product data, clear contact and opening hours, unique per-page titles/descriptions (no thin or copied content), consistent NAP (Name, Address, Phone) across all pages, and substantive product category descriptions (minimum 150-200 words per category page). |
| **Structured data (JSON-LD)** | Schema helps Google understand meaning and context; it can unlock rich results (e.g. breadcrumbs, local business). Validate with [Google Rich Results Test](https://search.google.com/test/rich-results) or Search Console → Enhancements. |
| **Mobile-first** | Google primarily uses the mobile version for indexing. Responsive layout, readable tap targets, and `viewport`/theme are already in place. Test mobile usability in Search Console. |
| **Content quality** | Each page must have unique, substantive content. Product category pages should have 150-200+ words of original description; avoid manufacturer boilerplate. Thin content risks being flagged as low-quality or excluded from indexing. |

---

## 3. What we maintain

| Area | Purpose |
|------|--------|
| **Metadata** | Title, description, Open Graph, Twitter, canonicals. **Keywords meta tag:** ~~REMOVED~~ — Google officially ignores it; it adds page weight with zero benefit. If still present, delete it. |
| **Sitemap** | Lists all indexable URLs for search engines. Note: `priority` and `changefreq` are largely ignored by Google; we keep them for other crawlers. |
| **robots.txt** | Tells crawlers what to allow/disallow and where the sitemap is |
| **JSON-LD** | LocalBusiness + WebPage + BreadcrumbList + ItemList structured data for rich results |
| **Semantic HTML** | One `<h1>` per page, `<main>`, sections, meaningful headings |
| **Image alt text** | Descriptive `alt` on all content images |
| **Internal linking** | Clear navigation hierarchy from homepage → catalog → categories with keyword-rich anchor text |
| **NAP consistency** | Name, Address, Phone identical across all pages, JSON-LD, footer, contact section |

---

## 4. Google Search Console – Monitoring & Maintenance

**CRITICAL:** Google Search Console is the primary tool for monitoring site health and search performance. Set it up immediately if not already configured.

### Setup

1. **Verify ownership:** Add property at [Google Search Console](https://search.google.com/search-console) using DNS TXT record or HTML file upload (recommended for persistence).
2. **Submit sitemap:** In GSC → Sitemaps, submit `https://drelix.org/sitemap.xml`.
3. **Set up email alerts:** Ensure you receive notifications for critical issues (manual actions, security issues, indexing problems).

### Weekly monitoring (5-10 minutes)

| Report | What to check | Action if issues found |
|--------|---------------|------------------------|
| **Coverage** | "Valid" should show 25 pages. Watch for "Excluded" (soft 404s, noindex) or "Error" (server errors, 404s). | Investigate excluded/error pages; use URL Inspection Tool to debug. |
| **Performance** | Click-through rate (CTR), impressions, average position for key queries (e.g. "odzież robocza Wadowice"). Identify low-CTR pages (< 2%) for meta description improvements. | Optimize titles/descriptions for low-CTR high-impression pages. |
| **Core Web Vitals** | "Good" URLs should be majority (green). Watch for "Poor" URLs (red). CWV uses **real user metrics** (75th percentile); this is different from PageSpeed Insights lab data. | Investigate poor pages; check for large images, layout shift, slow interactivity. |

### Monthly monitoring (15-30 minutes)

| Report | What to check | Action if issues found |
|--------|---------------|------------------------|
| **Enhancements** | Structured data validation (LocalBusiness, BreadcrumbList, ItemList). Watch for errors/warnings. | Fix invalid markup; re-validate with Rich Results Test. |
| **Mobile Usability** | Should show zero errors. Watch for "Text too small", "Clickable elements too close", "Content wider than screen". | Fix responsive issues; test on real devices. |
| **Security Issues** | Should always be zero. Hacked content or malware detection is critical. | Immediate action required if flagged. |
| **Manual Actions** | Should always be zero. Manual penalties require immediate attention. | Follow GSC guidance; submit reconsideration request after fixes. |
| **Links** | Top linking sites (external backlinks), internal link distribution. Identify orphan pages (no internal links). | Build internal links to orphan pages; disavow spammy backlinks if necessary. |

### Tools

- **URL Inspection Tool:** Debug individual page indexing. Shows: indexed status, mobile usability, structured data, crawl date. Use "Test Live URL" to see real-time render.
- **Index coverage reports:** Export "Excluded" pages CSV monthly to track trends.
- **Performance exports:** Download query/page performance data for deeper analysis in spreadsheets.

**Expected metrics for Drelix:**
- **Coverage:** 25 valid, 0 errors, excluded pages only for admin/api (as designed)
- **Average CTR:** 2-5% (industry standard for branded local business queries)
- **Average position:** Top 3 for "drelix wadowice", "odzież robocza wadowice"
- **Core Web Vitals:** 100% good URLs (with static rendering, this should be achievable)

---

## 5. Local SEO Strategy

**Wadowice is a competitive advantage.** Dominate local search with these tactics:

### Google Business Profile (highest priority)

1. **Claim/verify profile:** [Google Business Profile](https://business.google.com) — ensure business name, address, phone, hours, website URL match JSON-LD exactly.
2. **Add photos:** Upload high-quality images of products, storefront, team (if applicable). Update monthly.
3. **Enable reviews:** Encourage customers to leave Google reviews. Respond to all reviews (positive and negative) within 48 hours.
4. **Posts:** Share updates, new products, promotions weekly/bi-weekly.
5. **Service area:** Define service area (Wadowice + surrounding areas if applicable).
6. **Categories:** Select primary category "Safety Equipment Supplier" or "Workwear Store"; add secondary categories.

### NAP Consistency (critical)

**Name, Address, Phone must be identical everywhere:**
- Homepage footer
- Contact section
- JSON-LD LocalBusiness
- Google Business Profile
- Any external directories (e.g. Panorama Firm, Polish business directories)

**Current NAP (verify):**
- Name: Drelix
- Address: [exact address from JSON-LD]
- Phone: [exact phone from JSON-LD]

Inconsistent NAP confuses Google and dilutes local rankings.

### Local citations

Submit to Polish business directories:
- Panorama Firm
- Polish Chamber of Commerce
- Industry-specific directories (safety equipment, workwear)

Ensure NAP + website URL are identical across all listings.

### Review schema (recommended)

Add `AggregateRating` and `Review` schema to LocalBusiness JSON-LD once you have 5+ Google reviews. This can trigger star ratings in search results.

### Local content signals

- Keep "Wadowice" in homepage title (already done: "Drelix - Odzież Robocza i Ochronna | Wadowice")
- Mention service area in homepage content (e.g. "Obsługujemy Wadowice i okolice")
- Include local landmarks or service area pages if expanding

### Geo-targeting in GSC

Google Search Console → Settings → Check that "Target users in: Poland" is set (or left default if auto-detected).

---

## 6. File map

| File | Role |
|------|------|
| `src/lib/seo.ts` | **Single source for canonical base URL:** `getCanonicalBaseUrl()` (strips trailing slash from `NEXT_PUBLIC_SITE_URL`). Used by layout, sitemap, robots, products pages, JsonLd. Also exports `TITLE_IDEAL_MAX` (60), `DESC_IDEAL_MAX` (160) for contributor reference. |
| `src/app/layout.tsx` | Root metadata (title template, default description, OG, Twitter, robots, canonical for homepage). Uses `getCanonicalBaseUrl()` for `metadataBase` and canonical. |
| `src/app/robots.txt/route.ts` | Serves `/robots.txt` dynamically. Uses `getCanonicalBaseUrl()` so Sitemap URL aligns with sitemap. Policy: Content-signal, search engines allowed, AI blocked; body from `src/lib/robotsContent.ts`. |
| `src/app/admin/layout.tsx` | Admin area: `robots: { index: false, follow: false }` so admin pages are not indexed (edge case when linked). Primary block is robots.txt Disallow /admin/. |
| `src/app/sitemap.ts` | Generates `/sitemap.xml`: homepage, `/products`, and all product category URLs. Uses `getCanonicalBaseUrl()`; imports `PRODUCT_SLUGS` from `@/components/products/productConfig`. Sets `lastmod` to current date (consider dynamic dates if content changes frequently). |
| `src/components/JsonLd.tsx` | Injects LocalBusiness + WebPage JSON-LD in root `<head>`. Uses `getCanonicalBaseUrl()` for `url` and `@id`. **Update here** when business info changes (name, address, phone, hours, email). |
| `src/app/products/page.tsx` | Catalog index: metadata (title, description, ~~keywords~~, canonical, OG with image, Twitter), ItemList JSON-LD. |
| `src/app/products/[slug]/layout.tsx` | Product category layout: `generateMetadata`, `generateStaticParams`, BreadcrumbList JSON-LD; metadata per slug from `productConfig`. |
| `src/components/products/productConfig.ts` | Category metadata (title, description per slug) and re-exports `PRODUCT_SLUGS` from `src/data/catalogCategories.ts`. Used by sitemap, layout, pages. Add new category metadata here; slugs come from catalogCategories. |
| `src/data/catalogCategories.ts` | Source for category slugs (23): `CATEGORY_SLUGS`, `CATEGORY_TITLE_KEYS`. Used by productConfig, homepage cards, sitemap. Add new slugs here first. |

---

## 7. Metadata conventions

### Root (`layout.tsx`)

- **Title template:** `%s | Drelix` so child pages get "Page title | Drelix".
- **Default title:** "Drelix - Odzież Robocza i Ochronna | Wadowice".
- **Canonical:** `metadataBase` + `alternates.canonical` = homepage URL. All canonicals use the non–trailing-slash form.
- **Open Graph:** locale `pl_PL`, alternateLocale `en_GB`, image `/og-image.png` (1200×630).
- **Keywords meta tag:** ~~REMOVE if present~~ — Google ignores it; provides zero ranking benefit and adds page weight.

**Best practice:** Keep page titles within **50–60 characters** where possible; keep meta descriptions within **150–160 characters**. Avoid keyword stuffing; front-load the most important terms. Descriptions should be unique and informative per page.

### Catalog index (`/products`)

- **title**, **description**, ~~**keywords**~~ – Set in `src/app/products/page.tsx`. Remove keywords if present.
- **alternates.canonical** – `{siteUrl}/products`.
- **openGraph** – `type`, `url`, `siteName`, `title`, `description`, `locale`, `images` (1200×630).
- **twitter** – `card`, `title`, `description`.

### Product category pages (`products/[slug]`)

Product metadata is driven by **`productConfig`** in `src/components/products/productConfig.ts`. The shared layout uses `generateMetadata({ params })` to set:

- **title**, **description**, ~~**keywords**~~ – From `productConfig[slug].metadata` plus slug/title. Remove keywords if present.
- **alternates.canonical** – `{siteUrl}/products/{slug}`.
- **openGraph** – `type`, `url`, `siteName`, `title`, `description`, `locale`, `images` (default OG image).
- **twitter** – `card`, `title`, `description`.

**Content quality requirement:** Each product category page must have **150-200+ words** of unique, substantive content. Thin pages (< 100 words) risk exclusion or low rankings. Avoid manufacturer boilerplate; write original descriptions focused on user needs (durability, safety, use cases, Polish regulations/standards).

**When adding a new product category:** (1) Add the slug and `titleKey` to `src/data/catalogCategories.ts` (`CATEGORY_SLUGS`, `CATEGORY_TITLE_KEYS`). (2) Add metadata (title, description) to `src/components/products/productConfig.ts` (`metadataBySlug`, and the built `productConfig`). (3) Write 150-200+ words of unique content. The sitemap imports `PRODUCT_SLUGS` from productConfig (which re-exports from catalogCategories), so the new category is included automatically. Also add the category to `public/catalogCategoryRules.json` if you use CSV import.

---

## 8. Sitemap

- **Source:** `src/app/sitemap.ts`.
- **Output:** `https://{siteUrl}/sitemap.xml`.

**Included URLs:**

- Homepage (priority 1, weekly, lastmod: current date).
- `/products` catalog (priority 0.9, weekly, lastmod: current date).
- One URL per slug in `PRODUCT_SLUGS` (23 categories, e.g. `/products/gloves`, `/products/spodnie`; priority 0.9, weekly, lastmod: current date). The sitemap imports `PRODUCT_SLUGS` from `@/components/products/productConfig`.

**Note on priority and changefreq:** Google [largely ignores](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps) `priority` and `changefreq` in sitemaps. We include them for other crawlers and standards compliance, but don't rely on them for Google crawl behavior. `lastmod` is more useful — set it accurately to help Google identify changed pages.

**When adding a new product category:** Add the slug in `src/data/catalogCategories.ts` and metadata in `src/components/products/productConfig.ts`; the sitemap uses `PRODUCT_SLUGS` from productConfig and will include it automatically. No change to `sitemap.ts` is needed.

---

## 9. robots.txt

- **Source:** `src/app/robots.txt/route.ts` (dynamic; served at `/robots.txt`). Body built in `src/lib/robotsContent.ts`.
- **Alignment with sitemap:** Both robots and sitemap use **the same** `NEXT_PUBLIC_SITE_URL` (fallback `https://drelix.org`). The Sitemap URL in robots.txt is `${baseUrl}/sitemap.xml`, so it always matches the sitemap origin — no manual sync.
- **Policy:**
  - **Content-signal** (modern standard): `search=yes`, `ai-train=no`, `ai-input=no` — allows search indexing, reserves rights for AI training/input per EU Copyright Directive.
  - **Search engines (SEO):** Googlebot, Bingbot, Slurp, DuckDuckBot, YandexBot, Baiduspider — **Allow** `/`, **Disallow** `/api/`, `/admin/`. Only public pages (home, products, category pages) are crawlable; API and admin are excluded to eliminate useless traffic.
  - **AI / training crawlers:** Long list of bots (GPTBot, CCBot, ClaudeBot, PerplexityBot, etc.) — **Disallow** `/` to reduce non-search traffic and protect content use.
  - **Sitemap:** `${baseUrl}/sitemap.xml` (same origin as `src/app/sitemap.ts`).
- **Result:** Excellent SEO (all important pages allowed, sitemap referenced) and no crawl waste on API/admin or AI scrapers.

**Note:** Blocking AI crawlers is a **content/rights policy** (e.g. EU Copyright Directive), not an SEO optimization. Google does not use Content-signal for ranking. Some AI-driven search products may send traffic; we accept that trade-off.

Change policy in `src/lib/robotsContent.ts`; add/remove crawlers there. Sitemap URL stays aligned automatically.

---

## 10. JSON-LD

### Root (`src/components/JsonLd.tsx`)

- **LocalBusiness:** name, description, url, telephone, email, address, geo, opening hours, priceRange, image.
- **WebPage:** url, name, description, isPartOf, about, inLanguage.

**E-E-A-T enhancement:** Ensure all LocalBusiness fields are accurate and complete. When you have 5+ Google reviews, add `AggregateRating` and `Review` schema here.

Update when: business name, address, phone, email, or hours change; or when adding "sameAs" URLs (social media profiles, business directory listings).

### Catalog page (`/products`)

- **ItemList:** name, description, numberOfItems, itemListElement (each category as ListItem with name + url). Injected in `src/app/products/page.tsx`.

### Product category pages (`/products/[slug]`)

- **BreadcrumbList:** Strona główna → Katalog produktów → [category title]. Injected in `src/app/products/[slug]/layout.tsx`.

**Validation:** Use [Google Rich Results Test](https://search.google.com/test/rich-results) or Search Console → Enhancements to confirm structured data is valid and eligible for rich results. Re-validate after any JSON-LD changes.

---

## 11. Index control & crawl error handling

### Index control strategy

- **Crawl vs. index:** We use **robots.txt** Disallow for `/api/` and `/admin/` so crawlers don't request those URLs. That's usually enough; crawlers won't index what they don't fetch.
- **noindex:** For edge cases (e.g. a temporary or non-public page that is linked but must not be indexed), set `robots: { index: false, follow: false }` (or `noindex, nofollow`) in that route's metadata.
- **404/410:** Next.js returns 404 for unknown routes; crawlers treat that as "not found" and drop the URL over time. Use 410 for permanently removed content if you need an explicit "gone" signal.

### GSC Coverage monitoring

**Expected state:**
- **Valid:** 25 pages (homepage + catalog + 23 categories)
- **Excluded:** `/api/*`, `/admin/*` (by design, blocked in robots.txt), `/_next/*` (Next.js internals, not public)
- **Error:** 0 pages

**Common issues and fixes:**

| Issue | Cause | Fix |
|-------|-------|-----|
| **Soft 404** | Page returns 200 but has thin content or looks like an error page to Google. | Add substantive unique content (150-200+ words). Ensure proper heading structure. |
| **Crawled - currently not indexed** | Page was crawled but not indexed; usually due to low quality, thin content, or duplicate. | Improve content quality and uniqueness. Add internal links. Check for duplicates. |
| **Discovered - currently not indexed** | URL found in sitemap/links but not yet crawled. Wait or request indexing via URL Inspection Tool. | Be patient; ensure page has unique, substantive content. Use URL Inspection → "Request indexing" if urgent. |
| **404 errors** | Broken internal links or old URLs. | Fix broken links; set up 301 redirects if needed. Monitor "Not found (404)" in Coverage report. |
| **Server error (5xx)** | Server downtime or error during crawl. | Check hosting logs; ensure site stability. Re-request indexing after fix. |
| **Redirect error** | Redirect chains (A→B→C) or redirect loops. | Simplify redirects to direct 301s (A→C). Avoid loops. |

**Action:** Check GSC Coverage report weekly. Export "Excluded" and "Error" pages; investigate any unexpected entries.

---

## 12. Internal linking architecture

**Strong internal linking improves crawlability, distributes link equity, and helps users navigate.**

### Current structure

```
Homepage (nav)
  ├─ O nas (section)
  ├─ Produkty (section) → links to /products
  ├─ Dlaczego my (section)
  └─ Kontakt (section)

/products (catalog index)
  ├─ Links to all 23 categories (grid)
  └─ BreadcrumbList: Home → Katalog

/products/[slug] (category page)
  ├─ BreadcrumbList: Home → Katalog → Category
  └─ Link back to /products
```

### Best practices

1. **Every page should be ≤3 clicks from homepage.** ✅ Already achieved (home → catalog → category = 2 clicks).
2. **Use keyword-rich anchor text.** Link to `/products/gloves` with "rękawice robocze", not "kliknij tutaj".
3. **Add contextual internal links.** If you create an "O nas" page or blog, link to relevant product categories within content (e.g. "oferujemy wysokiej jakości [rękawice ochronne](/products/gloves)").
4. **Avoid orphan pages.** Every public page must have ≥1 internal link from another page. Use GSC Links report to identify orphans.
5. **Footer links:** Add footer navigation (Home, Produkty, Kontakt, O nas if/when created) for sitewide linking.
6. **Breadcrumbs:** Already implemented via JSON-LD BreadcrumbList. Ensure visible breadcrumbs in UI for user navigation (currently structural only).

**Action:** Review GSC → Links → Top linked pages. All 25 public pages should appear. If any are missing, they're orphans — add internal links.

---

## 13. Semantic HTML & headings

- **One `<h1>` per page:** Home = hero title; product pages = product category title (e.g. "Rękawice robocze i ochronne").
- **Sections:** Use `<section>` with clear headings (e.g. `<TwoToneHeading as="h2">`) for "O nas", "Produkty", "Kontakt", etc.
- **Main content:** Wrapped in `<main id="main-content" role="main" aria-label="…">` on the homepage; product pages use their own main structure.
- **Heading hierarchy:** Follow logical order (h1 → h2 → h3) and avoid skipping levels. Use h2 for major sections, h3 for subsections.

**Accessibility & SEO:** Proper semantic HTML helps screen readers and search engines understand page structure. It's a ranking signal for accessibility and UX.

Keep a logical heading order (h1 → h2 → h3) and avoid skipping levels.

---

## 14. Images

- **Content images:** Always set a meaningful `alt` (e.g. product name or short description). Product grid and lightbox images already do this. Good alt text supports accessibility and image search.
- **Alt best practices:** Be descriptive but concise (< 125 chars). Avoid "image of" or "picture of". Example: "Rękawice robocze skórzane z mankietem" not "Obraz rękawic roboczych".
- **OG image:** `/public/og-image.png` at **1200×630** (recommended for Facebook/LinkedIn; Twitter supports same ratio). Used as default for social shares; product pages inherit unless overridden. Use descriptive `alt` on OG images in metadata where supported.
- **Image sitemap (optional):** If product images are critical to search, consider adding `<image:image>` tags to sitemap.xml for each category page. Google Image Search can drive traffic.

**Performance:** Use `next/image` (already in place) for automatic optimization, lazy loading, and modern formats (WebP). Avoid large unoptimized images; they harm LCP and CWV.

---

## 15. Performance monitoring (Core Web Vitals)

**Core Web Vitals are a ranking factor.** Monitor both lab and field data.

### Field data (Real User Monitoring - RUM)

- **Source:** Google Search Console → Core Web Vitals report.
- **Data:** Real user metrics from Chrome users who visit your site. Uses **75th percentile** (not average) — 75% of users must have "Good" experience.
- **Thresholds:**
  - **LCP (Largest Contentful Paint):** < 2.5s = Good, 2.5-4s = Needs Improvement, > 4s = Poor
  - **INP (Interaction to Next Paint):** < 200ms = Good, 200-500ms = Needs Improvement, > 500ms = Poor
  - **CLS (Cumulative Layout Shift):** < 0.1 = Good, 0.1-0.25 = Needs Improvement, > 0.25 = Poor

**Action:** Check GSC CWV report monthly. Aim for 100% "Good URLs" (green). If any pages show "Poor", click through to see specific metrics and affected URLs.

### Lab data (Synthetic testing)

- **Tools:** PageSpeed Insights, Lighthouse in DevTools.
- **Data:** Simulated load on a test device. Useful for debugging but not representative of real users.
- **Use case:** Diagnose specific issues (large images, blocking scripts, render-blocking CSS) before deployment.

**Difference:** Lab data is instant and reproducible; field data is real-world but requires traffic and time to accumulate. Both are important.

### Common CWV issues and fixes

| Metric | Issue | Fix |
|--------|-------|-----|
| **LCP** | Large hero image loads slowly | Use `next/image` with priority; optimize image size; use WebP; consider CDN. |
| **LCP** | Slow server response | Ensure fast hosting (Vercel recommended for Next.js); use static generation (already done). |
| **INP** | Heavy JavaScript blocking interactions | Code-split heavy components; lazy load non-critical JS; avoid long tasks. |
| **CLS** | Layout shift from images without dimensions | Always set `width` and `height` on images; reserve space for dynamic content. |
| **CLS** | Fonts loading cause text shift | Use `font-display: swap` with font fallback; preload critical fonts. |

**Expected performance for Drelix:** With static rendering and Next.js optimizations, you should achieve 100% Good URLs. If not, investigate page-by-page.

---

## 16. Security & HTTPS

- **HTTPS everywhere:** All pages served over HTTPS (already enforced by most modern hosting). Ensure `NEXT_PUBLIC_SITE_URL` starts with `https://`.
- **SSL certificate:** Use a valid SSL certificate from a trusted CA (Let's Encrypt, Cloudflare, etc.). Ensure auto-renewal is configured.
- **Mixed content:** Avoid loading HTTP resources (images, scripts, fonts) on HTTPS pages. Use protocol-relative URLs (`//`) or HTTPS URLs only.
- **Security headers:** Consider adding security headers (CSP, X-Frame-Options, X-Content-Type-Options) via Next.js config or CDN.
- **GSC monitoring:** Check Search Console → Security Issues weekly. Any flags require immediate action.

**HTTPS is a ranking signal and trust factor.** Non-HTTPS sites are penalized and flagged as "Not Secure" in browsers.

---

## 17. Checklist for new pages

When you add a new public page (e.g. a new product category):

1. [ ] Add **metadata** in that route's `layout.tsx` (or page): title (50–60 chars ideal), description (150–160 chars ideal), canonical, openGraph, twitter. **Do NOT add keywords meta tag.**
2. [ ] Write **150-200+ words** of unique, substantive content. Avoid thin pages.
3. [ ] **Sitemap:** For **product categories**, add the slug to `src/data/catalogCategories.ts` and metadata to `src/components/products/productConfig.ts` — the sitemap picks them up automatically. For **any other** new page, add its URL to `src/app/sitemap.ts`.
4. [ ] Ensure the page has **exactly one `<h1>`** and sensible heading hierarchy (h1 → h2 → h3).
5. [ ] If the page has content images, give them **descriptive `alt`** text (< 125 chars, no "image of").
6. [ ] Add **internal links** from other pages (e.g. homepage, catalog) to prevent orphan pages.
7. [ ] (Optional) Add **JSON-LD** (e.g. BreadcrumbList, Product) if you want rich results; validate with Google Rich Results Test.
8. [ ] After deployment, use **GSC URL Inspection Tool** to request indexing and verify mobile usability.

---

## 18. Environment

- **`NEXT_PUBLIC_SITE_URL`** – Must be set in production to the live domain (e.g. `https://drelix.org`). Used for:
  - Canonical URLs  
  - Sitemap URLs  
  - Open Graph URLs  
  - JSON-LD `url` and `@id`  

Without it, the app falls back to `https://drelix.org` in code; ensure the deployed value matches your real domain.

**Important:** Use `https://` (not `http://`) in production.

---

## 19. Content quality guidelines

**Thin content is the enemy of SEO.** Every page must provide unique value.

### Minimum standards per page type

| Page type | Minimum words | Requirements |
|-----------|---------------|--------------|
| Homepage | 200+ | Hero + sections (O nas, Produkty, Kontakt, Dlaczego my) with substantive text. |
| Catalog (`/products`) | 150+ | Introduction to product range; explain categories. |
| Product category | 150-200+ | Unique description of category; use cases; benefits; Polish safety standards if applicable. Avoid manufacturer boilerplate. |

### Content freshness

- **Static trade-off:** Current implementation has no revalidation; content only updates on deploy. This is acceptable for static product data but limits freshness signals.
- **Recommendation:** If you add a blog or news section, deploy updates regularly (weekly/monthly) to signal freshness.
- **Google freshness:** Not a direct ranking factor for evergreen content, but Google favors recently updated pages for trending/time-sensitive queries.

### Avoiding duplicate content

- **Internal duplicates:** Ensure each product category description is unique. Don't copy-paste manufacturer descriptions across multiple pages.
- **External duplicates:** If you use manufacturer descriptions, rewrite them in your own words. Google penalizes copy-pasted content.
- **Canonicals:** Already in place to handle URL variations. No additional action needed.

### Product descriptions best practices

- **Focus on user intent:** Why would someone buy this product? What problems does it solve?
- **Include Polish context:** Reference Polish safety regulations (e.g. "zgodne z normą EN 388" for gloves), common use cases in Polish industries (construction, manufacturing, food service).
- **Use natural language:** Avoid keyword stuffing. Write for humans first; Google understands natural language.

---

## 20. Optional enhancements (not required)

- **Product JSON-LD:** Add individual `Product` schema per product on category pages for richer search results (we already have ItemList on catalog and BreadcrumbList on category pages).
- **hreflang:** If you later use separate URLs per language (e.g. `/en/products/gloves`), add `hreflang` and alternate links in metadata. **Note:** Not needed for current client-side language toggle.
- **OG image per product:** Override `openGraph.images` in a product layout if you want a dedicated share image for that category.
- **Blog/content section:** Add a blog for industry news, safety tips, product guides. This builds authority, freshness signals, and long-tail keyword coverage.
- **FAQ schema:** Add FAQ structured data if you create FAQ content. This can trigger rich results (expandable Q&A in SERPs).
- **Video schema:** If you add product videos, mark them up with VideoObject schema for video-rich results.

---

## 21. Further reading

- [Google Search Central – SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central – Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Google Search Console Help](https://support.google.com/webmasters)
- [PageSpeed Insights](https://pagespeed.web.dev/) (CWV and performance)
- [Influencing title links and snippets](https://developers.google.com/search/docs/appearance/snippet) (title/description display)
- [Google Rich Results Test](https://search.google.com/test/rich-results) (validate JSON-LD)
- [Google's guidance on sitemap priority/changefreq](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps)

---

## 22. Quick reference

| I want to… | Do this… |
|------------|-----------|
| Check if Google is indexing my pages | Open Google Search Console → Coverage. Expect 25 valid pages. |
| See my search performance (clicks, impressions, CTR) | Open Google Search Console → Performance. Check weekly. |
| Monitor Core Web Vitals (real users) | Open Google Search Console → Core Web Vitals. Aim for 100% good URLs. |
| Check if structured data is valid | Google Search Console → Enhancements, or use [Rich Results Test](https://search.google.com/test/rich-results). |
| Debug why a page isn't indexed | Google Search Console → URL Inspection Tool. Paste URL, see status and issues. |
| Change site-wide title/description | Edit `src/app/layout.tsx` metadata. |
| Change business info in search/snippets | Edit `src/components/JsonLd.tsx` (JSON-LD). Ensure NAP matches Google Business Profile. |
| Add a new product/category page | Add slug to `src/data/catalogCategories.ts`, metadata to `src/components/products/productConfig.ts`, write 150-200+ words, add category rule to `public/catalogCategoryRules.json` if using CSV. Sitemap and layout pick it up; ensure one h1 and good alt on images. |
| Change what's crawlable | Edit `src/lib/robotsContent.ts` (and route in `src/app/robots.txt/route.ts` if needed). |
| See what URLs are in the sitemap | Open `/sitemap.xml` or read `src/app/sitemap.ts`. |
| Set production URL | Set `NEXT_PUBLIC_SITE_URL=https://drelix.org` in hosting (e.g. Vercel env). |
| Claim/optimize Google Business Profile | Go to [business.google.com](https://business.google.com); ensure NAP matches site. |
| Request immediate indexing of a new page | Google Search Console → URL Inspection Tool → "Request indexing". |
| Remove keywords meta tag (recommended) | Delete `keywords` field from metadata objects in layouts/pages. |

---

*Last updated: Comprehensive audit incorporating Google Search Console monitoring, local SEO strategy (Google Business Profile, NAP consistency, reviews), E-E-A-T enhancements, performance monitoring (RUM vs lab, CWV thresholds), internal linking architecture, security & HTTPS, content quality guidelines (minimum 150-200 words, avoid thin content), crawl error handling (Coverage report, common issues), keywords meta tag removal (Google ignores it), sitemap notes (priority/changefreq largely ignored), and expanded GSC weekly/monthly monitoring checklist. Location: docs/SEO_Guide.md.*
