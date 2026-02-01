# Drelix – Business Website

**Drelix** is a business website for a workwear and safety clothing supplier in Wadowice, Poland. The site is informational: it presents the business, explains why to choose Drelix, and showcases the product catalog. Purchases are made in-store; the website does not process transactions.

**Built for:** Local brick-and-mortar businesses that need an online presence to be found, inform visitors, and manage product data.

---

## What We Set Out to Achieve

1. **SEO as a core requirement** – Not an afterthought. Metadata, sitemap, robots.txt, structured data, and internal linking are built into the architecture.
2. **Google Search Console readiness** – Documentation for setup, monitoring, and troubleshooting.
3. **Local SEO alignment** – NAP consistency, LocalBusiness schema, guidance for Google Business Profile.
4. **Performance** – Static generation where possible, optimized images, minimal layout shift.
5. **Legal compliance** – Privacy Policy and Terms of Service aligned with EU/Polish law (GDPR, consumer rights, brick-and-mortar retail).

---

## What We Implemented

### SEO

- **Metadata:** Unique title and meta description per page (target 50–60 chars / 150–160 chars). Canonical URLs (non–trailing-slash). Open Graph and Twitter cards.
- **Sitemap:** `src/app/sitemap.ts` generates `/sitemap.xml` with 27 URLs (homepage, catalog, 23 product categories, privacy, terms). Uses `getCanonicalBaseUrl()` for consistency.
- **robots.txt:** Dynamic route at `/robots.txt`. Allows search engines on public pages; disallows `/api/` and `/admin/`. Blocks AI training crawlers. Content-signal policy. References sitemap.
- **Structured data (JSON-LD):** LocalBusiness, WebPage (root); ItemList (catalog); BreadcrumbList (category pages). Validate with [Google Rich Results Test](https://search.google.com/test/rich-results).
- **Semantic HTML:** One H1 per page, heading hierarchy (h1 → h2 → h3), `<main>`, sections.
- **Image alt text:** Descriptive `alt` on product images.
- **Internal linking:** Footer and navbar (on non-home routes) link to homepage sections, privacy, terms. Logo links to home.
- **Admin noindex:** Admin area excluded from indexing via metadata and robots.txt.

### Product Management

- **Convex backend:** Products and categories. CSV import (Kartoteki format). Inline editing. Image upload.
- **23 product categories:** Metadata and slugs in `productConfig` and `catalogCategories`. Sitemap picks them up automatically.
- **Admin area:** Protected at `/admin`. Not indexed.

### Legal Pages

- **Privacy Policy** (`/privacy`): GDPR-aligned, Polish law, contact form and in-store data, cookies, data subject rights, PUODO.
- **Terms of Service** (`/terms`): Brick-and-mortar retail, no distance sales, consumer rights (rękojmia, reklamacja), no 14-day withdrawal for in-store purchases.

### Bilingual UI

- Polish default. English toggle (client-side). Same URL for both. Bots see Polish only. No hreflang.

---

## Documentation

| Document | Purpose |
|----------|---------|
| **[SEO_Guide.md](./docs/SEO_Guide.md)** | SEO reference: metadata, sitemap, robots, JSON-LD, GSC monitoring, local SEO, content guidelines, checklist for new pages. |
| **[AGENTS.md](./docs/AGENTS.md)** | Development conventions: stack, routing, i18n, accessibility. |
| **[CONVEX_DATA_PLAN.md](./docs/CONVEX_DATA_PLAN.md)** | Convex data model, queries, CSV import. |
| **[VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md)** | Vercel deployment and domain setup. |
| **[SEO_AUDIT_REPORT.md](./docs/SEO_AUDIT_REPORT.md)** | Codebase audit against SEO guide. |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Convex |
| **UI** | shadcn-style components, Framer Motion |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment

- **`NEXT_PUBLIC_SITE_URL`** – Production domain (e.g. `https://drelix.org`). Used for canonicals, sitemap, OG, JSON-LD.
- **`NEXT_PUBLIC_CONVEX_URL`** – Convex deployment URL (for catalog/admin).
- **`RESEND_API_KEY`** – Resend API key (for contact form email). Get one at [resend.com](https://resend.com).
- **`RESEND_FROM_EMAIL`** – Sender address for contact form (e.g. `noreply@drelix.org`). Must be a verified domain in Resend.
- **`CONTACT_TO_EMAIL`** – (Optional) Recipient for contact form. Defaults to `annabadura7@gmail.com`.

### Convex (catalog)

1. Run `npx convex dev` and follow prompts.
2. Add `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.
3. Log in at `/admin/login` and upload CSV or edit products inline.

---

## Deploy

Deploy to Vercel (or any Next.js host). Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONVEX_URL` in the environment. See [VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md) for domain setup.

---

## Sitemap Contents

The sitemap contains **27 URLs**:

- 1 homepage
- 1 catalog (`/products`)
- 23 product category pages (`/products/[slug]`)
- 1 privacy policy (`/privacy`)
- 1 terms of service (`/terms`)

Indexing depends on deployment, GSC setup, and search engine behavior. Monitoring steps are in [SEO_Guide.md](./docs/SEO_Guide.md).

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
├── docs/
└── public/
```

---

## Recent Changes

- **Navbar scroll progress** – A thin bar under the navbar fills left→right as the user scrolls (reading progress), using Framer Motion `useScroll` and `useSpring`.
- **Navbar section links (route-aware)** – Section links (About, Products, Why Us, Contact) are only relevant on the homepage. On `/` they scroll to in-page sections with scroll-spy and active styling (primary color + bottom border). On other routes (e.g. `/products/[slug]`, `/privacy`) the same items are `<Link href="/#section">` so they navigate to the homepage and the target section. Fixes broken behavior on product and legal pages.
- **Navbar active section** – Scroll-spy highlights the current section; active item is uppercase, primary color, and has a bottom border. Scroll-spy runs only on the homepage.
- **Hero section** – Subtle entrance animations (Framer Motion): heading, subtitle, CTA, and trust pills fade in and slide up with a short stagger. Respects `prefers-reduced-motion`. Horizontal spacing increased (padding, subtitle width, gaps between trust pills).
- **Navbar styling** – Section labels are uppercase; active tab uses a bottom border instead of text underline for visibility. Navbar uses `cn()` for conditional Tailwind classes and plain function components (no `React.FC`).

---

## Quick Reference

| Task | Location |
|------|----------|
| Change site-wide metadata | `src/app/layout.tsx` |
| Change business info (JSON-LD) | `src/components/JsonLd.tsx` |
| Add product category | `src/data/catalogCategories.ts`, `src/components/products/productConfig.ts` |
| Change crawl policy | `src/lib/robotsContent.ts` |
| View sitemap URLs | `/sitemap.xml` or `src/app/sitemap.ts` |

---

*This README documents what was built and how. Live results (rankings, traffic, indexing) depend on deployment, GSC setup, content, and market conditions.*
