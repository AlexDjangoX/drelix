# Convex data plan

**Source of truth:** Kartoteki CSV (300+ products). Uploaded to Convex and can be replaced at any time.

**Who changes data:** Only the admin does CRUD. The rest of the application is read-only (static) for viewers.

**Goals:**
1. Upload initial data; replace anytime with a new CSV.
2. Admin page loads data from Convex; admin can CRUD products.
3. Public `/products` and `/products/[slug]` use Convex as the data source (read-only).
4. Fetch strategy suited to mostly static data (rarely changes).

---

## 1. Data flow

```
CSV (source of truth)
    │
    ▼  Admin: "Process new CSV" (upload → parse → categorize → replaceCatalogFromSections)
Convex DB
    │  products (by categorySlug, by Kod)
    │  categories (slug, titleKey)
    ├──────────────────────────────────────────────────────────────
    │
    ├──► Admin page: useQuery(listCatalogSections) + useMutation(updateProduct / createProduct / deleteProduct)
    │    On revisit: data comes from Convex (no file read).
    │
    ├──► /products: useQuery(listCatalogSections) → full catalog by category
    │
    └──► /products/[slug]: (future) useQuery(getCatalogSection(slug)) → one category’s products
         Currently: placeholder from src/data/*.ts; will switch to Convex.
```

---

## 2. Convex schema and functions

**Tables:**
- **products** – One row per product (Kartoteki columns + `categorySlug`). Indexes: `by_category`, `by_kod`.
- **categories** – One row per category (`slug`, `titleKey`). Index: `by_slug`.

**Queries (read):**
| Function | Purpose |
|----------|---------|
| `listCatalogSections` | All categories with their products (admin table + `/products` page). |
| `listCategories` | Category list only (nav / dropdowns). |
| `getCatalogSection(slug)` | Single category’s products (for `/products/[slug]` when migrated). |

**Mutations (write):**
| Function | Purpose |
|----------|---------|
| `replaceCatalogFromSections` | Replace entire catalog (CSV upload). |
| `updateProduct` | Edit one product by Kod (admin inline edit). |
| `createProduct` | Add one product (admin “Add product”). |
| `deleteProduct` | Remove one product by Kod (admin row delete). |
| `setCategories` | Seed/update categories (slug + titleKey). |

---

## 3. Admin flow

- **Initial / replace data:** Admin uploads CSV → client parses (Windows-1250, semicolon) → fetches `/catalogCategoryRules.json` → `categorizeCatalog(rows, rules)` → `replaceCatalogFromSections({ sections })`. Convex replaces all products and syncs categories.
- **On revisit:** Admin opens `/admin` → `useQuery(api.catalog.listCatalogSections)` loads data from Convex. No file read.
- **CRUD:**
  - **Read:** Same query; table shows all sections/rows.
  - **Update:** Inline edit → `useMutation(api.catalog.updateProduct)({ kod, updates })`.
  - **Create:** (When UI exists) “Add product” → `useMutation(api.catalog.createProduct)({ categorySlug, row })`.
  - **Delete:** (When UI exists) Delete row → `useMutation(api.catalog.deleteProduct)({ kod })`.

---

## 4. Public routes and data source

- **`/products`** – Already uses Convex. Client: `useQuery(api.catalog.listCatalogSections)` → map to sections with image paths → `<CatalogClient />`. Data is from Convex only.
- **`/products/[slug]`** – Currently uses placeholder `src/data/gloves.ts` etc. (see AGENTS.md). **Future:** Client will call `useQuery(api.catalog.getCatalogSection, { slug })` and render the same grid/lightbox from Convex. Slug must match a Convex category slug (e.g. `gloves`, `polbuty`).

---

## 5. Fetch strategy (mostly static data)

- **Choice:** Keep **client-side `useQuery`** for both admin and public product pages.
- **Why it’s fine for “hardly ever changes”:**
  - Convex subscriptions only refetch when the underlying data changes. If nothing changes, no extra server work; the client keeps the last result.
  - No need for manual cache invalidation or revalidate intervals; Convex handles consistency.
- **Alternatives considered:**
  - **SSR/prefetch:** Could prefetch in a server component and pass props. Would require Convex server/client usage in RSC and still need client for mutations. Adds complexity; current client `useQuery` is simpler and sufficient.
  - **Static generation at build:** Would require pulling from Convex at build time; catalog would be stale until next deploy. Not ideal when admin can update anytime.
- **Conclusion:** Use `useQuery` everywhere for product/catalog data. When data rarely changes, Convex’s model (subscribe once, update when changed) is efficient and keeps the UI correct after admin CRUD or CSV replace.

---

## 7. File reference

| Purpose | Location |
|---------|----------|
| Convex schema | `convex/schema.ts` |
| Convex catalog API | `convex/catalog.ts` |
| Admin page (table + CSV) | `src/app/admin/page.tsx` |
| Full catalog page | `src/app/products/page.tsx` → `ProductsCatalogClient.tsx` |
| Category page (placeholder) | `src/app/products/[slug]/` + `productConfig.ts` + `src/data/*.ts` |
| Category rules (CSV import) | `public/catalogCategoryRules.json` |
| Categorize logic | `src/lib/catalogCategorize.ts` |
| CSV parse (client) | `src/lib/csvParseClient.ts` |

---

## 8. Future migration: `/products/[slug]` from Convex

When replacing placeholder `src/data` for category pages:

1. Add route(s) or slug set for Convex-driven categories (e.g. all slugs from `listCategories` or a fixed list that matches Convex).
2. In `ProductPageClient` (or a wrapper), call `useQuery(api.catalog.getCatalogSection, { slug })` instead of `getProductItems(slug)`.
3. Map Convex products to `{ id, src, name }` (e.g. `id` = Kod, `src` = `/${slug}/${Kod}.jpg`, `name` = Nazwa).
4. Remove dependency on `src/data/gloves.ts`, `boots.ts`, `spodnie.ts`, `koszula.ts` and use Convex as the single source for those pages.
