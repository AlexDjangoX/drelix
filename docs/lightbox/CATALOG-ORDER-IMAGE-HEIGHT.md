# Catalog Order by Image Height — Implementation & Troubleshooting

This document describes the goal, implementation, and current failure mode for **sorting the product catalog by image height (tallest first)** so the grid order matches a consistent, predictable UX.

---

## 1. What We're Trying to Achieve

**Canonical rule (single source of truth):**

> **Catalog order:** subcategory (by order) → first image height (tallest first) → Nazwa.

- Within each category, products are grouped by **subcategory** (using the subcategory `order` from the DB).
- Within each subcategory, products are ordered by **first image height, descending** (tallest image first).
- When height is equal (or missing), tie-break by **Nazwa** (product name).

**Constraints:**

- We **cannot change how images are uploaded**. Many images already exist; we must work with current data.
- Dimensions are **not** stored at upload time. We determine them **on the server** and cache them for sorting.
- The **grid displays thumbnails** (640px max); the lightbox uses the large variant (1920px max). Sort should reflect the **thumbnail** (what the user sees in the grid).

**Reference:** `convex/lib/constants.ts`:

```ts
/**
 * Catalog order (single source of truth for wording):
 * subcategory (by order) → first image height (tallest first) → Nazwa.
 * Used by getCatalogSection, listCatalogSections, and admin "Update catalog order".
 */
```

---

## 2. Image Pipeline (Upload → Two Variants)

Each upload produces **two** WebP files via Sharp (no change to this flow):

| Variant    | Max size | Use case        | Storage ID field          |
|-----------|----------|-----------------|---------------------------|
| Thumbnail | 640px    | Grid, lists     | `thumbnailStorageId`      |
| Large     | 1920px   | Lightbox, hero  | `imageStorageId`          |

**Constants** (`src/lib/image/constants.ts`):

```ts
/** Thumbnail: grids, lists, admin table. Max 640px on longest side, WebP 70. */
export const THUMBNAIL_MAX = 640;
export const THUMBNAIL_QUALITY = 70;

/** Large: lightbox, hero. Max 1920px on longest side, WebP 75. */
export const LARGE_MAX = 1920;
export const LARGE_QUALITY = 75;
```

**Processing** (`src/lib/image/process.ts`): one buffer → `thumbnail` + `large` WebP buffers; both uploaded to Convex storage. Product documents store both `imageStorageId` (large) and `thumbnailStorageId` (thumbnail) per image entry.

The **product grid** uses `thumbnailUrl` (thumbnail first) for the card image. So sort-by-height must use **thumbnail dimensions** so order matches what the user sees.

---

## 3. Schema: Dimension Cache

We cache dimensions in Convex so catalog queries can sort without re-fetching images.

**Table** (`convex/schema.ts`):

```ts
/** Cache of image dimensions by storage ID. Populated via admin "Update catalog order"; used for catalog order (tallest first). */
imageDimensions: defineTable({
  storageId: v.string(),
  width: v.number(),
  height: v.number(),
}).index("by_storageId", ["storageId"]),
```

- **Key:** `storageId` (Convex file storage ID). We use the **thumbnail** storage ID when present so the cache matches the grid image.
- **Population:** Filled by the admin “Update catalog order” flow (Next.js API route + Sharp), not at upload time.

---

## 4. Convex: Helpers (Sort & Image Entries)

### 4.1 Getting image entries for a product

Products have either:

- `imageEntries[]` with `imageStorageId` and optional `thumbnailStorageId`, or
- Legacy single image: `imageStorageId` and optional `thumbnailStorageId` at top level.

**Function** (`convex/lib/helpers.ts`):

```ts
/** Get all image entries for a product (imageEntries or legacy single image). */
export function getProductImageEntries(p: ProductDoc): ProductImageEntry[] {
  if (p.imageEntries && p.imageEntries.length > 0) {
    return p.imageEntries;
  }
  if (p.imageStorageId) {
    return [
      {
        imageStorageId: p.imageStorageId,
        thumbnailStorageId: p.thumbnailStorageId,
      },
    ];
  }
  return [];
}
```

We use the **first** entry only for “first image height.”

### 4.2 Product → catalog item (with URLs)

**Function** (`convex/lib/helpers.ts`):

```ts
/** Convert product doc to item shape with image URLs. */
export async function productToItem(
  ctx: Ctx,
  p: ProductDoc,
): Promise<Record<string, string>> {
  const entries = getProductImageEntries(p);
  // ... resolve storage.getUrl for each entry's imageStorageId and thumbnailStorageId ...
  return {
    ...rest,
    imageStorageId: resolvedEntries[0]?.imageStorageId ?? "",
    imageUrl,           // large variant URL
    thumbnailStorageId: resolvedEntries[0]?.thumbnailStorageId ?? "",
    thumbnailUrl,       // thumbnail URL
    imagesJson,
    // ... other fields
  } as Record<string, string>;
}
```

Catalog items therefore expose both `imageStorageId`/`imageUrl` and `thumbnailStorageId`/`thumbnailUrl`.

### 4.3 Sort: subcategory → height (tallest first) → Nazwa

**Function** (`convex/lib/helpers.ts`):

```ts
/** Catalog order: subcategory order → first image height (tallest first) → Nazwa. */
export function sortProductsBySubcategoryThenHeightThenNazwa(
  products: ProductDoc[],
  subcategorySlugs: string[],
  heightByStorageId: Record<string, number>,
): ProductDoc[] {
  const orderMap = new Map(subcategorySlugs.map((slug, i) => [slug, i]));
  // Use thumbnail storage ID when present (grid displays thumbnails); else main image.
  const heightsUsed = products.map((p) => {
    const e = getProductImageEntries(p)[0];
    const sid = e?.thumbnailStorageId ?? e?.imageStorageId;
    return sid ? heightByStorageId[sid] ?? 0 : 0;
  });
  // ... console.log for debugging ...
  return [...products].sort((a, b) => {
    const keyA = a.subcategorySlug ?? "";
    const keyB = b.subcategorySlug ?? "";
    const orderA = orderMap.get(keyA) ?? 999;
    const orderB = orderMap.get(keyB) ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    const entriesA = getProductImageEntries(a);
    const entriesB = getProductImageEntries(b);
    const storageIdA = entriesA[0]?.thumbnailStorageId ?? entriesA[0]?.imageStorageId;
    const storageIdB = entriesB[0]?.thumbnailStorageId ?? entriesB[0]?.imageStorageId;
    const heightA = (storageIdA && heightByStorageId[storageIdA]) ?? 0;
    const heightB = (storageIdB && heightByStorageId[storageIdB]) ?? 0;
    if (heightA !== heightB) return heightB - heightA; // tallest first
    return (a.Nazwa ?? "").localeCompare(b.Nazwa ?? "", undefined, { sensitivity: "base" });
  });
}
```

- **Sort key for height:** `thumbnailStorageId ?? imageStorageId` (thumbnail preferred to match grid).
- **Lookup:** `heightByStorageId[storageId]`; if missing, height is 0 and order falls back to Nazwa.

---

## 5. Convex: Catalog Queries

### 5.1 `listCatalogSections`

Used by admin and any consumer that needs the full catalog. Returns sections with items already in catalog order.

**Logic (excerpt):**

- For each category, load products and subcategories.
- Build list of storage IDs for dimension lookup: for each product, `thumbnailStorageId ?? imageStorageId` (same as sort).
- For each unique ID, read `imageDimensions` by `by_storageId`, build `heightByStorageId`.
- Sort products with `sortProductsBySubcategoryThenHeightThenNazwa(products, subSlugs, heightByStorageId)`.
- Map sorted products to items via `productToItem` and return sections.

### 5.2 `getCatalogSection(slug)` — main query for product page

Used by `/products/[slug]` to render one category. Optional `debug: true` returns a `__debug` payload for troubleshooting.

**Args:** `slug: string`, `debug?: boolean`.

**Logic:**

1. Load category by slug, products by `by_category`, subcategories by category.
2. Build `storageIds` = products.map(p => first entry’s `thumbnailStorageId ?? imageStorageId`), filtered.
3. For each unique `storageId`, query `imageDimensions` with index `by_storageId`, build `heightByStorageId: Record<string, number>`.
4. Call `sortProductsBySubcategoryThenHeightThenNazwa(products, subSlugs, heightByStorageId)`.
5. Map sorted products to items with `productToItem`, return section (and optionally `__debug`).

**Critical point:** If `heightByStorageId` is empty (no rows in `imageDimensions` for those IDs), every product gets height 0 and the sort is effectively **subcategory → Nazwa**, which looks random.

### 5.3 `getImageDimensionsBatch` (optional helper)

Takes `storageIds: string[]`, returns `Record<storageId, { width, height }>`. Not used inside other Convex queries (we do direct DB lookups in the same handler to avoid query-from-query).

### 5.4 `setImageDimensions` (mutation)

Called only by the Next.js populator (admin-only route).

**Args:** `storageId`, `width`, `height`.

**Logic:** Upsert one row in `imageDimensions` keyed by `storageId` (patch if exists, else insert). No auth check in the mutation; the API route is protected.

---

## 6. Populator: Filling the Dimension Cache

**Route:** `POST /api/admin/populate-image-dimensions`  
**File:** `src/app/api/admin/populate-image-dimensions/route.ts`

**Auth:** Admin session cookie (`drelix-admin-session`). No cookie → 401.

**Flow:**

1. **Fetch catalog:** `fetchQuery(api.catalog.listCatalogSections)`.
2. **Collect (storageId, url) to process:** For each section and each item, use **thumbnail first** so we store dimensions for the same image the grid shows:
   - `storageId = (item.thumbnailStorageId ?? item.imageStorageId ?? "").trim()`
   - `imageUrl = (item.thumbnailUrl ?? item.imageUrl ?? "").trim()`
   - Dedupe by `storageId`, push to `toProcess`.
3. **For each (storageId, imageUrl):**
   - Resolve relative URLs with request origin.
   - `fetch(url)` with timeout 15s, headers `Accept: image/*`, `User-Agent: DrelixCatalogPopulator/1.0`.
   - Buffer response, `sharp(buffer).metadata()` → `width`, `height`.
   - If both > 0, `fetchMutation(api.catalog.setImageDimensions, { storageId, width, height })`.
4. **Response:** `{ ok: true, populated, total }`; if all fail, include `firstError` for debugging.

**Full route (core logic):**

```ts
const sections = await fetchQuery(api.catalog.listCatalogSections);
const seen = new Set<string>();
const toProcess: { storageId: string; imageUrl: string }[] = [];
for (const section of sections) {
  for (const item of section.items) {
    const row = item as {
      imageStorageId?: string;
      imageUrl?: string;
      thumbnailStorageId?: string;
      thumbnailUrl?: string;
    };
    const storageId = (row.thumbnailStorageId ?? row.imageStorageId ?? "").trim();
    const imageUrl = (row.thumbnailUrl ?? row.imageUrl ?? "").trim();
    if (storageId && imageUrl && !seen.has(storageId)) {
      seen.add(storageId);
      toProcess.push({ storageId, imageUrl });
    }
  }
}
// ... then for each toProcess: fetch URL → sharp metadata → setImageDimensions
```

---

## 7. Admin UI: “Update catalog order”

**File:** `src/app/admin/page.tsx`

- Section **“Catalog order”** with description and button **“Update catalog order”**.
- On click: `POST /api/admin/populate-image-dimensions` with `credentials: "include"`.
- Shows loading state, then: “Stored dimensions for N of M images. Catalog order updated.” or error / firstError.

The button is the only way to populate or refresh `imageDimensions`; there is no automatic run on upload.

---

## 8. Product Page: Data Flow

**Page (server):** `src/app/products/[slug]/page.tsx`

- Calls `fetchQuery(api.catalog.getCatalogSection, { slug, debug?: true })`.
- If `DEBUG_CATALOG=1` (or `true`) in env and response has `__debug`, writes `section.__debug` to `logs/catalog-debug-{slug}.json`, then strips `__debug` before passing to client.
- Passes section to `ProductPageClient`.

**Client:** `src/components/products/ProductPage/ProductPageClient.tsx`

- Receives `section` with `items` and `subcategories`.
- **Does not sort.** It groups `section.items` by `subcategorySlug` preserving the order of `items` (server order).
- Grid image source: `thumbnailUrl ?? imageUrl` (thumbnail first).

So the **only** place order is defined is in Convex (`getCatalogSection` / `listCatalogSections`). The client only groups and renders.

---

## 9. Debug Payload (when `debug: true`)

When `getCatalogSection` is called with `debug: true`, the response includes `__debug`:

- `slug`, `productCount`, `uniqueStorageIdsWithHeight`
- `productData`: per-product `_id`, `Kod`, `Nazwa`, `subcategorySlug`, `sortStorageId` (thumbnail ?? image)
- `heightByStorageId`: map used for sort
- `correlation`: per-product `Nazwa`, `Kod`, `storageId`, `heightFromTable`
- `orderAfterSort`: final order with `index`, `Nazwa`, `subcategorySlug`, `height`, `storageId`
- `heightsRange`: `{ min, max, distinct }`

With `DEBUG_CATALOG=1` in env, the product page writes this to `logs/catalog-debug-{slug}.json` for inspection.

---

## 10. What We've Tried and What’s Not Working

### 10.1 Tried

1. **Sort by main image height only**  
   - Large images are often normalized to 1920 or 1024; many products got the same height, so order collapsed to Nazwa and looked random.

2. **Switch to thumbnail for sort**  
   - Sort and lookup use `thumbnailStorageId ?? imageStorageId`.  
   - Populator stores dimensions for `thumbnailStorageId ?? imageStorageId` and fetches `thumbnailUrl ?? imageUrl`.  
   - Intent: same ID and same image as the grid.

3. **Populator run**  
   - Admin runs “Update catalog order”; response: “Stored dimensions for 158 of 158 images.” So the populator reports success and writes 158 rows.

4. **Debug log**  
   - With `DEBUG_CATALOG=1`, opening a category writes `logs/catalog-debug-{slug}.json`.  
   - In the captured log, **`heightByStorageId` is `{}`** and **`uniqueStorageIdsWithHeight` is 0**.  
   - Every product has **`heightFromTable: null`** and **`heightsRange: { min: 0, max: 0, distinct: 1 }`**.  
   - So at the time that log was written, the catalog was not finding any dimensions for the storage IDs it uses (thumbnail-first IDs).

### 10.2 What’s not working

- **Observed:** Catalog order still looks random (effectively subcategory → Nazwa).
- **Cause from logs:** No dimensions are found when building `heightByStorageId` in `getCatalogSection`. So either:
  1. **ID mismatch:** The storage IDs we use for lookup (from product docs: `thumbnailStorageId ?? imageStorageId`) are not the same as the IDs the populator wrote (from catalog items: `thumbnailStorageId ?? imageStorageId`). For example, different Convex deployment for populator vs page, or products/items out of sync.
  2. **Timing/cache:** Populator writes to one deployment or one point in time; the product page (or its Convex query) runs against another deployment or a cached snapshot where `imageDimensions` is empty.
  3. **ISR:** Next.js page has `revalidate = 60`. Cached page might have been generated before the populator ran; that cached section would have empty `heightByStorageId` and thus random order until revalidation.

### 10.3 Recommended next steps for handoff

1. **Confirm deployment and table:**  
   - Ensure the same Convex deployment is used when (a) the admin runs “Update catalog order” and (b) the product page calls `getCatalogSection`.  
   - In the Convex dashboard for that deployment, inspect `imageDimensions`: after a successful “Update catalog order”, there should be many rows. Check a few `storageId` values.

2. **Compare IDs:**  
   - In `logs/catalog-debug-{slug}.json`, take a few `sortStorageId` values from `productData` (or `storageId` from `orderAfterSort`).  
   - In Convex dashboard, check whether `imageDimensions` has rows with those exact `storageId` values.  
   - If not, trace where the mismatch comes from (e.g. populator using a different Convex URL or different catalog snapshot).

3. **Fallback for height lookup:**  
   - In catalog handlers, when building `heightByStorageId`, consider loading dimensions for **both** thumbnail and main image IDs (e.g. collect all `thumbnailStorageId` and `imageStorageId`, query dimensions for all, merge into one map).  
   - In the sort, use: `height = heightByStorageId[thumbnailStorageId] ?? heightByStorageId[imageStorageId] ?? 0`.  
   - That way, if only one of the two IDs was ever populated, sort still gets a height.

4. **Cache / revalidate:**  
   - After running the populator, force a fresh catalog read: e.g. hard refresh, or temporarily set `revalidate = 0` (or 1) for the product page and reload, then check the new `logs/catalog-debug-{slug}.json` to see if `heightByStorageId` is now populated.

5. **Remove or reduce logging:**  
   - Once the issue is fixed, remove or gate the verbose `console.log` and optional `__debug` payload so production stays clean.

---

## 11. File Reference

| Area            | File(s) |
|-----------------|--------|
| Schema          | `convex/schema.ts` (imageDimensions table) |
| Catalog order   | `convex/lib/constants.ts` (comment) |
| Helpers         | `convex/lib/helpers.ts` (`getProductImageEntries`, `productToItem`, `sortProductsBySubcategoryThenHeightThenNazwa`) |
| Catalog API     | `convex/catalog.ts` (`listCatalogSections`, `getCatalogSection`, `getImageDimensionsBatch`, `setImageDimensions`) |
| Populator       | `src/app/api/admin/populate-image-dimensions/route.ts` |
| Admin button    | `src/app/admin/page.tsx` (Catalog order section) |
| Product page    | `src/app/products/[slug]/page.tsx` (fetch, optional debug write) |
| Client render   | `src/components/products/ProductPage/ProductPageClient.tsx` (group by subcategory, no sort) |
| Image pipeline  | `src/lib/image/constants.ts`, `src/lib/image/process.ts`, `src/app/api/image/route.ts` |

---

## 12. Environment / Debug

- **Debug file:** Set `DEBUG_CATALOG=1` or `DEBUG_CATALOG=true` in `.env` or `.env.local`, restart dev server, then open a category (e.g. `/products/gloves`). Check `logs/catalog-debug-{slug}.json`.
- **Logs directory:** `logs/` is in `.gitignore`; do not commit debug JSON.
- **Convex logs:** Convex `console.log` output (e.g. from `getCatalogSection` and the sort helper) appears in the Convex dashboard or in the terminal running `npx convex dev`.
