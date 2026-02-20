# Audit: Image Dimensions Set on Upload (One-Step Flow)

**Date:** 2025-02-20  
**Summary:** Image dimensions (width/height) for catalog ordering are now written to the `imageDimensions` table in the same flow as uploading an image. Previously, admins had to run a separate "Update catalog order" batch to populate dimensions.

**Catalog order rule (unchanged):** subcategory → image height (tallest first) → Nazwa. Dimensions are stored per **thumbnail** storage ID so the grid order matches what users see.

---

## 1. Files Changed

| File | Change type |
|------|-------------|
| `src/lib/types.ts` | Type extended |
| `src/lib/image/process.ts` | Logic + return shape |
| `src/app/api/image/route.ts` | No code change (response shape follows process) |
| `src/components/admin/ImageUploadCell.tsx` | New mutation call + response type |
| `convex/catalog.ts` | Comment + `requireAdmin` in one mutation |
| `src/app/admin/page.tsx` | Copy only (button description) |

---

## 2. Change Details by File

### 2.1 `src/lib/types.ts`

- **Change:** Extended `ImageVariants.thumbnail` with `width` and `height`.
- **Before:**  
  `thumbnail: { base64: string; filename: string };`
- **After:**  
  `thumbnail: { base64: string; filename: string; width: number; height: number };`
- **Reason:** API response from image processing must include thumbnail dimensions so the client can call `setImageDimensions` after upload.

---

### 2.2 `src/lib/image/process.ts`

- **Change:** Thumbnail is built with Sharp’s `toBuffer({ resolveWithObject: true })` and thumbnail dimensions are returned; large variant unchanged.
- **Before:**  
  - `Promise.all` of two pipelines, both `.toBuffer()` (no metadata).  
  - Return: `thumbnail: { base64, filename }`, `large: { base64, filename }`.
- **After:**  
  - Thumbnail: single pipeline, `.toBuffer({ resolveWithObject: true })` → `thumbResult.data`, `thumbResult.info.width`, `thumbResult.info.height`.  
  - Large: still `.toBuffer()` only.  
  - Return: `thumbnail: { base64, filename, width: thumbResult.info.width ?? 0, height: thumbResult.info.height ?? 0 }`, `large` unchanged.
- **Reason:** Catalog order uses thumbnail dimensions; we need them from the same pipeline that produces the thumbnail buffer (so they match the actual thumbnail size).

---

### 2.3 `src/app/api/image/route.ts`

- **Change:** None. It returns `body` from `processImageToVariants(...)`, so the response now automatically includes `thumbnail.width` and `thumbnail.height`. Dev-only file writes still use `body.thumbnail.base64` and `body.thumbnail.filename` only.

---

### 2.4 `src/components/admin/ImageUploadCell.tsx`

- **Changes:**
  1. **New mutation:** `const setImageDimensions = useMutation(api.catalog.setImageDimensions);`
  2. **Response type:** The typed shape for `processRes.json()` now includes `thumbnail: { base64, filename, width, height }` (and `large` unchanged).
  3. **After `addProductImage`:** If `thumbnailStorageId` is set and `thumbnail.width > 0` and `thumbnail.height > 0`, the component calls:
     ```ts
     await setImageDimensions({
       storageId: thumbnailStorageId,
       width: thumbnail.width,
       height: thumbnail.height,
     });
     ```
     This runs in the same `handleUpload` try block, after the product image is added and before the success toast. No extra user step.
- **Reason:** One-step flow: upload image → add to product → write dimensions for that thumbnail so catalog order is correct immediately.

---

### 2.5 `convex/catalog.ts`

- **Change:** In `setImageDimensions` mutation:
  1. Comment updated from “Used only by admin ‘Update catalog order’ API route” to “Called on upload (admin) and by ‘Update catalog order’ batch.”
  2. First line of handler: `await requireAdmin(ctx);` added before the existing logic (lookup/patch or insert).
- **Note:** `requireAdmin` in this codebase is currently a no-op (auth is enforced in Next.js). The batch route `POST /api/admin/populate-image-dimensions` calls `setImageDimensions` via `fetchMutation` from the server; that path remains valid because the route itself is protected by admin session check and `requireAdmin` does not block.

---

### 2.6 `src/app/admin/page.tsx`

- **Change:** Copy only. The “Catalog order” section description was updated.
- **Before:**  
  “Catalog order: subcategory → image height (tallest first) → Nazwa. Store image dimensions (thumbnails) so the backend can apply this order. Run after adding or changing product images, or after switching to thumbnail-based sort.”
- **After:**  
  “Catalog order: subcategory → image height (tallest first) → Nazwa. New uploads set dimensions automatically. Use this button only to backfill dimensions for existing images (e.g. uploaded before that change).”
- **Reason:** Clarify that the “Update catalog order” button is now only for backfilling, not for normal uploads.

---

## 3. Behaviour Summary

- **New uploads (admin):** Upload image → `/api/image` returns thumbnail + large (base64) and thumbnail `width`/`height` → client uploads both to Convex storage → `addProductImage(kod, storageId, thumbnailStorageId)` → `setImageDimensions(thumbnailStorageId, width, height)` → done. One flow, no second step.
- **Existing / backfill:** “Update catalog order” button and `POST /api/admin/populate-image-dimensions` unchanged; they still fetch catalog, download thumbnails, run Sharp to get dimensions, and call `setImageDimensions` for each. Use only for images that were uploaded before this change or where dimensions are missing.
- **Catalog ordering:** Unchanged. `listCatalogSections` and `getCatalogSection` still use `imageDimensions` keyed by thumbnail `storageId`; products without a dimension row still sort as height 0.

---

## 4. What Was Not Changed

- Schema: `imageDimensions` table and indexes unchanged.
- Catalog sort logic: `sortProductsBySubcategoryThenHeightThenNazwa`, `getCatalogSection`, `listCatalogSections` unchanged.
- Image pipeline: Still thumbnail (640px) + large (1920px) WebP; only the thumbnail path in `process.ts` now also returns dimensions.
- `/api/image` request/response contract: Same endpoint; response gains two numeric fields on `thumbnail` only.
- “Update catalog order” button: Still present and functional for backfill.

---

## 5. Audit Checklist (for reviewer)

- [ ] Confirm `ImageVariants` and all consumers expect `thumbnail.width` / `thumbnail.height` (only `ImageUploadCell` and API response use them; API route does not reference them except via `body`).
- [ ] Confirm Sharp `resolveWithObject` usage: `thumbResult.info.width` / `thumbResult.info.height` may be undefined; we use `?? 0` so dimensions are never undefined.
- [ ] Confirm `setImageDimensions` is only called when `thumbnailStorageId` and both dimensions are positive, so we never write zero dimensions for new uploads.
- [ ] Confirm no other code assumes `thumbnail` has only `base64` and `filename` (e.g. tests or other API consumers).
- [ ] Optional: run admin upload flow and then “Update catalog order” for an old product; confirm catalog order and that new uploads appear in correct order without running the button.
