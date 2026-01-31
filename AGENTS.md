# Drelix – Agent & code quality guidelines

This file is used by **Vercel Agent** (Code Review), Cursor, and other AI tools to align feedback with this project’s conventions. Keep it updated when you change architecture or standards.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, design tokens in `src/app/globals.css`
- **State:** React (useState, useContext). Language: `LanguageContext`; theme: `next-themes`
- **UI primitives:** `@/components/ui` (shadcn-style); shared sections in `@/components`

---

## SEO (critical for this business)

- **Reference:** Follow [SEO_Guide.md](./SEO_Guide.md) for all SEO work.
- **New public pages:** Must have metadata (title, description), canonical URL, Open Graph, and an entry in `src/app/sitemap.ts`.
- **One `<h1>` per page.** Use `TwoToneHeading` for main headings; keep hierarchy (h1 → h2 → h3).
- **Images:** Always set a meaningful `alt` (e.g. product name or short description).
- **Canonicals:** Every indexable page must have `alternates.canonical` in its layout metadata.
- Do not remove or weaken metadata, sitemap entries, or JSON-LD without an explicit SEO decision.

---

## i18n (internationalization)

- **Default language:** Polish (`pl`). English (`en`) via client-side switch; same URL for both.
- **Translations:** All user-facing strings live in `src/context/LanguageContext.tsx` under `translations.pl` and `translations.en`.
- **In components:** Use `<AnimateText k="key.path" />` or `t.some.key` from `useLanguage()` so text is never hardcoded in one language.
- **New copy:** Add keys to the `Translations` interface and to both `pl` and `en` in `translations`.

---

## Static rendering & data

- **Strategy:** Static. Root and product layouts use `dynamic = "force-static"` and `revalidate = false`.
- **Product data:** Static arrays in `src/data/` (e.g. `gloves.ts`, `boots.ts`, `spodnie.ts`, `koszula.ts`). Each exports a list of `{ id, src, name }` for images in `public/`.
- **New product category:** Add a data file in `src/data/`, a route under `src/app/products/[slug]/` (layout + page), and a sitemap entry. See existing gloves/boots/spodnie/koszula for the pattern.

---

## Routing & pages

- **Home:** `src/app/page.tsx` – sections (Hero, About, Products, Why Us, Contact).
- **Product catalog pages:** Single dynamic route `src/app/products/[slug]/` – shared layout (`generateMetadata`, `generateStaticParams`), `productConfig.ts` (slug → metadata + data), one client page component (grid + lightbox). Add new categories by updating `productConfig` and data in `src/data/`.
- **API:** Prefer not adding `/api` routes unless required; if added, keep them in `robots` disallow as per current `src/app/robots.ts`.

---

## UI & components

- **Headings:** Use `<TwoToneHeading as="h1" | "h2" ... />` for two-tone section titles (theme-aware: dark/light).
- **Translated text:** Use `<AnimateText k="..." />` or `t` from `useLanguage()`.
- **Exports:** Shared components are re-exported from `src/components/index.ts`; use `@/components` for imports.
- **Styling:** Prefer Tailwind; use design tokens (e.g. `text-foreground`, `bg-primary`, `border-border`) from `globals.css`. Avoid arbitrary values unless necessary.
- **Product grid images:** Use `object-contain` when the full image must be visible (e.g. boots); use `object-cover` only when intentional cropping is acceptable (e.g. gloves). Always provide `alt`.

---

## Accessibility & semantics

- **Landmarks:** Use `<main>`, `<nav>`, `<section>`, `<footer>` with clear structure.
- **Interactive elements:** Buttons and links must have clear labels (`aria-label` or visible text). Product cards that open lightboxes use `role="button"`, `tabIndex={0}`, and keyboard (Enter).
- **Lightbox/dialogs:** Use `role="dialog"`, `aria-modal="true"`, and safe-area insets; trap focus or ensure Escape/arrows work as documented.

---

## Performance & assets

- **Images:** Use `next/image` with appropriate `sizes` for responsive loading. Static product images live in `public/` and are referenced by path (e.g. `/gloves/...`, `/boots/...`).
- **Caching:** Static pages and product routes use long-lived Cache-Control headers in `next.config.ts` (immutable where applicable).
- **No client-only for static content:** Prefer server components where possible; use `"use client"` only when state, hooks, or browser APIs are needed.

---

## Conventions to preserve

- **Language persistence:** Stored in `localStorage` under `drelix-language`; default `pl`.
- **Theme persistence:** Handled by `next-themes` with `storageKey="drelix-theme"`; default dark.
- **Product section links:** Category cards in `ProductSection` link to `/products/gloves`, `/products/boots`, `/products/spodnie`, `/products/koszula`; keep this in sync when adding/removing categories.
- **Contact:** Display email/phone/address in `ContactSection` and in `JsonLd.tsx`; keep them consistent.

---

## What to avoid

- Do not add indexable routes without updating the sitemap and adding full metadata (title, description, canonical, OG).
- Do not hardcode Polish or English strings in the UI; use translation keys.
- Do not remove or bypass `TwoToneHeading` / `AnimateText` for main headings and nav/CTAs without a design decision.
- Do not change `robots` or sitemap in a way that hides public product or marketing pages from crawlers.
- Do not introduce `object-cover` on product grids where it would crop important content (e.g. sides of product images); prefer `object-contain` when in doubt.

---

## File reference

| Purpose              | Location / file                          |
|----------------------|------------------------------------------|
| SEO rules & checklist| [SEO_Guide.md](./SEO_Guide.md)           |
| Root metadata        | `src/app/layout.tsx`                     |
| Sitemap              | `src/app/sitemap.ts`                    |
| robots.txt           | `src/app/robots.ts`                     |
| Structured data      | `src/components/JsonLd.tsx`             |
| Translations         | `src/context/LanguageContext.tsx`       |
| Product data         | `src/data/*.ts`                         |
| Cache headers        | `next.config.ts` → `headers()`         |

When in doubt, prefer consistency with existing product pages (gloves, boots, spodnie, koszula) and with [SEO_Guide.md](./SEO_Guide.md).
