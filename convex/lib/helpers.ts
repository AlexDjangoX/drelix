import type { QueryCtx, MutationCtx } from "../_generated/server";
import type {
  ProductDoc,
  ProductInsert,
  ProductImageIds,
  ProductImageEntry,
  ProductUpdateResult,
  StorageDeletionResult,
} from "./types";
import {
  PRODUCT_FIELD_KEYS,
  CSV_ALT_BY_CANONICAL,
  ALLOWED_UPDATE_KEYS,
} from "./constants";
import { ADMIN_ERRORS } from "./errorMessages";

export type Ctx = QueryCtx | MutationCtx;

/**
 * Pagination parameters for large queries.
 */
export type PaginationParams = {
  cursor?: string;
  limit?: number;
};

/**
 * Paginated result wrapper.
 */
export type PaginatedResult<T> = {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
  totalReturned: number;
};

/** Sort: admin-created (with createdAt) first by newest, then rest by slug. */
export function sortCategories<T extends { slug: string; createdAt?: number }>(
  cats: T[],
): T[] {
  return [...cats].sort((a, b) => {
    const aT = a.createdAt ?? 0;
    const bT = b.createdAt ?? 0;
    if (aT !== bT) return bT - aT;
    return a.slug.localeCompare(b.slug);
  });
}

/** Sort product items alphabetically by Nazwa (name). */
export function sortItemsByNazwa<T extends { Nazwa?: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) =>
    (a.Nazwa ?? "").localeCompare(b.Nazwa ?? "", undefined, {
      sensitivity: "base",
    }),
  );
}

/** Fetch product by Kod. Throws if not found. */
export async function getProductByKod(
  ctx: Ctx,
  kod: string,
): Promise<ProductDoc> {
  const product = await ctx.db
    .query("products")
    .withIndex("by_kod", (q) => q.eq("Kod", kod))
    .unique();
  if (!product) {
    throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND(kod));
  }
  return product;
}

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

/** Convert product doc to item shape with image URLs. */
export async function productToItem(
  ctx: Ctx,
  p: ProductDoc,
): Promise<Record<string, string>> {
  const entries = getProductImageEntries(p);
  const { imageStorageId, thumbnailStorageId, imageEntries, ...rest } =
    Object.fromEntries(
      Object.entries(p).filter(([k]) => k !== "_id" && k !== "_creationTime"),
    ) as Omit<ProductDoc, "_id" | "_creationTime">;

  const resolvedEntries = entries.length > 0 ? entries : [];
  const imageUrls = await Promise.all(
    resolvedEntries.map(async (e) => {
      const [imageUrl, thumbnailUrl] = await Promise.all([
        ctx.storage.getUrl(e.imageStorageId),
        e.thumbnailStorageId
          ? ctx.storage.getUrl(e.thumbnailStorageId)
          : null,
      ]);
      return {
        imageUrl: imageUrl ?? "",
        thumbnailUrl: thumbnailUrl ?? imageUrl ?? "",
      };
    }),
  );

  const first = imageUrls[0];
  const imageUrl = first?.imageUrl ?? "";
  const thumbnailUrl = first?.thumbnailUrl ?? first?.imageUrl ?? "";
  const imagesJson =
    imageUrls.length > 0 ? JSON.stringify(imageUrls) : "[]";

  return {
    ...rest,
    imageStorageId: resolvedEntries[0]?.imageStorageId ?? "",
    imageUrl,
    thumbnailStorageId: resolvedEntries[0]?.thumbnailStorageId ?? "",
    thumbnailUrl,
    imagesJson,
  } as Record<string, string>;
}

/**
 * Delete product images from storage with error handling.
 * Deletes all IDs from imageEntries plus legacy single image.
 * Continues on individual deletion failures (e.g., already deleted files).
 * (Mutation-only: storage.delete)
 */
export async function deleteProductImages(
  ctx: MutationCtx,
  product: ProductDoc,
): Promise<StorageDeletionResult> {
  const entries = getProductImageEntries(product);
  const toDelete: string[] = [];
  for (const e of entries) {
    toDelete.push(e.imageStorageId);
    if (e.thumbnailStorageId) toDelete.push(e.thumbnailStorageId);
  }
  // Legacy single image if not already in entries
  if (!entries.length && product.imageStorageId)
    toDelete.push(product.imageStorageId);
  if (!entries.length && product.thumbnailStorageId)
    toDelete.push(product.thumbnailStorageId);
  const unique = [...new Set(toDelete)];

  if (unique.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const results = await Promise.allSettled(
    unique.map((id) => ctx.storage.delete(id)),
  );

  const deleted = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  if (failed > 0) {
    console.warn(
      `Failed to delete ${failed} of ${unique.length} storage files for product ${product.Kod}`,
    );
  }

  return { deleted, failed };
}

/** Map row to product insert shape. Handles both camelCase and CSV alt keys. */
export function toProductInsert(
  row: Record<string, string>,
  categorySlug: string,
  existingImages?: ProductImageIds,
): ProductInsert {
  const get = (key: (typeof PRODUCT_FIELD_KEYS)[number]) =>
    row[key] ?? row[CSV_ALT_BY_CANONICAL[key] ?? ""] ?? "";

  const insert: ProductInsert = {
    ...(Object.fromEntries(
      PRODUCT_FIELD_KEYS.map((k) => [k, get(k)]),
    ) as Record<(typeof PRODUCT_FIELD_KEYS)[number], string>),
    categorySlug,
  };
  if (existingImages?.imageEntries?.length) {
    insert.imageEntries = existingImages.imageEntries;
  } else if (
    existingImages?.imageStorageId ||
    existingImages?.thumbnailStorageId
  ) {
    if (existingImages?.imageStorageId)
      insert.imageStorageId = existingImages.imageStorageId;
    if (existingImages?.thumbnailStorageId)
      insert.thumbnailStorageId = existingImages.thumbnailStorageId;
  }
  return insert;
}

/** Filter updates to allowed keys only. */
export function filterAllowedUpdates(
  updates: Record<string, string>,
): Record<string, string> {
  const patch: Record<string, string> = {};
  for (const [k, val] of Object.entries(updates)) {
    if (ALLOWED_UPDATE_KEYS.has(k) && typeof val === "string") patch[k] = val;
  }
  return patch;
}

/**
 * Strip Convex system fields from a product document.
 * Returns a properly typed product result.
 */
export function productToUpdateResult(doc: ProductDoc): ProductUpdateResult {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _creationTime,
    ...rest
  } = doc;
  return rest as ProductUpdateResult;
}
