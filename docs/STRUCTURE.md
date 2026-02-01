# Drelix – Project Structure

Health-checked layout: routes thin, logic in `lib`, shared types in one place, components grouped by feature.

---

## `src/`

### `app/` – Routes & API

| Path | Purpose |
|------|--------|
| **`layout.tsx`**, **`page.tsx`** | Root layout and homepage |
| **`globals.css`**, **`app.css`** | Global styles |
| **`admin/`** | Admin UI (catalog, CSV, product images) |
| `admin/page.tsx` | Composes CSV section + catalog table; uses `@/app/admin/components` and `@/app/admin/hooks` |
| `admin/layout.tsx` | Admin layout (auth) |
| `admin/login/page.tsx` | Login (React 19 `useActionState` + `useFormStatus`) |
| `admin/components/` | CategorySelect, CategoryLabel, ImageUploadCell, ProductRow, CsvUploadSection, CatalogTable + `index.ts` barrel |
| `admin/hooks/` | useCsvPreview, useCatalogFilter + `index.ts` barrel |
| **`api/`** | API route handlers only |
| `api/image/route.ts` | POST: validate + process image via `@/lib/image` |
| `api/contact/route.ts` | POST: contact form → Resend |
| `api/admin/login/` | POST: admin login (JWT cookie) |
| `api/admin/logout/` | POST: clear admin session |
| **`privacy/`**, **`terms/`** | Static legal pages |
| **`products/`** | Products catalog: `page.tsx`, `[slug]/page.tsx` + layout |
| **`robots.txt/route.ts`** | Robots.txt (from `@/lib/robotsContent`) |
| **`sitemap.ts`** | Sitemap |

---

### `lib/` – Shared logic & types

| File / folder | Purpose |
|---------------|--------|
| **`types.ts`** | Single source of types: `CategorySlug`, `CatalogRow`, `CatalogSection`, `CategoryRule`, `ImageVariants`, `ProductSlug`, `ProductItem`, `DISPLAY_KEYS` |
| **`utils.ts`** | Helpers: `cn()`, `PLACEHOLDER_PRODUCT_IMAGE`, `base64ToBlob()`, `sanitizeFilename()` |
| **`image/`** | Image processing (used by `api/image`): constants, validate, process; barrel `index.ts` |
| **`catalogCategorize.ts`** | CSV → categorized sections (re-exports types from `@/lib/types`) |
| **`csvParseClient.ts`** | CSV parsing (browser) |
| **`thumbnails.ts`** | Thumbnail paths by category slug |
| **`robotsContent.ts`** | Robots.txt content |
| **`seo.ts`** | SEO helpers |

---

### `data/` – Static / config data

| File | Purpose |
|------|--------|
| **`catalogCategories.ts`** | `CATEGORY_SLUGS`, `CategorySlug`, `CATEGORY_TITLE_KEYS` (aligned with `catalogCategoryRules.json`) |

---

### `components/` – UI

| Path | Purpose |
|------|--------|
| **`index.ts`** | Barrel: AnimateText, TwoToneHeading, hero sections, Navbar, NavLink, ProductSection, etc. |
| **`hero/`** | AboutSection, ContactSection, Footer, HeroSection, WhyUsSection |
| **`navbar/`** | Navbar, NavLink |
| **`products/`** | ProductSection, productConfig, ProductPageClient, CatalogClient, ProductsCatalogClient |
| **`reusable/`** | AnimateText, DarkToggle, LanguageSelector, Logo, TwoToneHeading |
| **`ui/`** | button, card, input, sonner, textarea |
| **`JsonLd.tsx`** | JSON-LD for SEO |

---

### `context/`

| File | Purpose |
|------|--------|
| **`LanguageContext.tsx`** | i18n (pl/en) |
| **`ConvexClientProvider.tsx`** | Convex provider |

---

## Conventions

- **Types**: Import from `@/lib/types` (and re-export where needed, e.g. `lib/catalogCategorize`, `lib/image`, `productConfig`).
- **Helpers**: Import from `@/lib/utils`.
- **API routes**: Keep only `route.ts` in `app/api/*`; logic lives in `lib` (e.g. `lib/image`).
- **Admin**: Page composes via `@/app/admin/components` and `@/app/admin/hooks`; components use relative imports between themselves to avoid circular deps.
- **Paths**: Prefer `@/` for app, lib, components, data; relative only for colocated siblings.

---

## Health

- **Build**: `npm run build` ✓  
- **Lint**: No errors ✓  
- **Structure**: Routes thin, lib modular, single types file, single utils file, barrels where useful ✓  
