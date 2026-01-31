# Drelix

**Drelix** is the website for Drelix – a supplier of **workwear and safety clothing (BHP)** in **Wadowice**, Poland. The application is a marketing and product catalog site: it presents the business, explains why to choose Drelix, and showcases the full range of products (gloves, footwear, clothing, PPE, and more) across 23 categories. The catalog is backed by [Convex](https://convex.dev); an admin area allows uploading and editing products via CSV import and inline edits.

The site is built for **discoverability and search**. **Excellent SEO is the main requirement**: we aim for strong visibility in search results (especially local and product-related queries) and clear, trustworthy signals for both users and search engines. This README describes what the application is and how we achieve that.

---

## What the application does

- **Public site (Polish default, English via language switch)**  
  Homepage with Hero, About, Products, Why Us, and Contact. A “View full catalog” entry point and 23 category cards on the homepage link to category pages. Each category page shows a grid of products (image, name, price) with a lightbox. The full catalog at `/products` lists all products grouped by category with search.

- **Product catalog**  
  Stored in Convex (products + categories). Data can be seeded or updated via the admin: upload a Kartoteki-style CSV (Windows-1250, semicolon-delimited) to replace the catalog, or edit products inline. Category rules for CSV mapping live in `public/catalogCategoryRules.json` (23 categories aligned with the site).

- **Admin**  
  Protected area at `/admin`: login, then upload CSV or edit products (category, code, name, price, unit, image upload). API and admin paths are excluded from crawling via `robots.txt`.

---

## How we achieve excellent SEO

SEO is treated as a first-class requirement. We follow current best practices (Google Search Essentials, Core Web Vitals, helpful content, E-E-A-T) and keep a dedicated **[SEO_Guide.md](./docs/SEO_Guide.md)** as the single source of truth. Below is a concise overview of what we do.

### 1. Metadata and canonicals

- **Every indexable page** has a unique **title** (aim 50–60 characters) and **meta description** (150–160 characters), plus **canonical URL** so search engines know the preferred URL.
- **Open Graph and Twitter** cards are set on all public pages (including default OG image 1200×630) so shares look correct and stay on-brand.
- **Keywords** are set where useful (e.g. catalog and category pages) without stuffing.

### 2. Sitemap and robots.txt

- **Sitemap** (`/sitemap.xml`) is generated from code (`src/app/sitemap.ts`) and includes the homepage, `/products`, and all 23 category URLs. It uses `NEXT_PUBLIC_SITE_URL` so the same app works across environments.
- **robots.txt** (`/robots.txt`) is generated dynamically (`src/app/robots.txt/route.ts` + `src/lib/robotsContent.ts`) and **stays aligned with the sitemap**: the Sitemap URL in robots uses the same base URL. We allow search engines on `/` and disallow `/api/` and `/admin/` to avoid useless traffic. We also use **Content-signal** (search=yes, ai-train=no, ai-input=no) and block a long list of **AI/training crawlers** (e.g. GPTBot, CCBot, ClaudeBot, PerplexityBot) to reduce non-search traffic and reserve rights.

### 3. Structured data (JSON-LD)

- **Root:** LocalBusiness and WebPage schema (name, description, url, address, phone, email, opening hours, etc.) in `src/components/JsonLd.tsx`.
- **Catalog page:** ItemList with all category URLs and names.
- **Category pages:** BreadcrumbList (Home → Catalog → category name).

This helps search engines understand the business and content and can unlock rich results (e.g. breadcrumbs, local panel). We validate with Google Rich Results Test / Search Console.

### 4. Semantic HTML and content quality

- **One `<h1>` per page** (hero on home, category title on category pages), with a clear heading hierarchy (h1 → h2 → h3).
- **Landmarks:** `<main>`, `<nav>`, `<section>`, `<footer>` used consistently.
- **Images:** Meaningful `alt` on all content images (product name or short description).
- **E-E-A-T / helpful content:** Real business and contact info, unique per-page titles and descriptions, and real product data (no thin or copied content).

### 5. Technical and UX foundations

- **Static/SSG where possible** so important content is in the initial HTML for crawlers.
- **Core Web Vitals:** We support LCP, INP, and CLS via static rendering, `next/image`, and minimal layout shift; monitoring is done in Search Console.
- **Mobile-first:** Responsive layout, viewport and theme set; tap targets and readability considered.

All of the above is documented in more detail in **[SEO_Guide.md](./docs/SEO_Guide.md)** (file map, metadata conventions, checklist for new pages, further reading).

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, design tokens in `src/app/globals.css`
- **Catalog backend:** Convex (products, categories, CSV replace, image upload)
- **State:** React (useState, useContext); language in `LanguageContext`, theme in `next-themes`
- **UI:** shadcn-style components in `@/components/ui`; shared sections and product components in `@/components`

---

## Getting started

### Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site works with placeholder catalog data if Convex is not configured.

### Convex (catalog)

To use the real product catalog and admin:

1. **Create/link a Convex project:** run `npx convex dev` and follow the prompts. This generates `convex/_generated` and sets `CONVEX_DEPLOYMENT` in `.env.local`.
2. **Set the Convex URL:** add `NEXT_PUBLIC_CONVEX_URL=<your deployment URL>` to `.env.local` (from Convex dashboard or `npx convex dev` output).
3. **Seed the catalog:** log in at `/admin/login`, then use the admin “Process new CSV” area to upload a Kartoteki CSV (Windows-1250, semicolon-delimited). That replaces the Convex catalog with categorized products.

Without `NEXT_PUBLIC_CONVEX_URL`, the app still builds and runs using a placeholder URL for Convex.

### Environment

- **`NEXT_PUBLIC_SITE_URL`** – Used for canonicals, sitemap, Open Graph, and JSON-LD. Set in production to your live domain (e.g. `https://drelix.pl`). Default in code: `https://drelix.pl`.
- **`NEXT_PUBLIC_CONVEX_URL`** – Convex deployment URL (see above).

See `.env.example` for a template.

---

## Project documentation

| Document | Purpose |
|----------|---------|
| **[SEO_Guide.md](./docs/SEO_Guide.md)** | SEO reference: metadata, sitemap, robots, JSON-LD, checklist, further reading. |
| **[docs/AGENTS.md](./docs/AGENTS.md)** | Conventions for AI tools and developers: stack, SEO rules, i18n, routing, UI, accessibility. |
| **[docs/CONVEX_DATA_PLAN.md](./docs/CONVEX_DATA_PLAN.md)** | Convex data model, CRUD, and fetch strategy for the catalog. |

---

## Deploy

The app can be deployed to [Vercel](https://vercel.com) or any Next.js-compatible host. Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONVEX_URL` in the deployment environment so the sitemap, robots.txt, canonicals, and catalog all use the correct URLs.
