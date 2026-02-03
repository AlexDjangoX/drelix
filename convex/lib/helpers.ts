import type { QueryCtx, MutationCtx } from '../_generated/server';
import type {
  ProductDoc,
  ProductInsert,
  ProductImageIds,
  ProductUpdateResult,
  StorageDeletionResult,
} from './types';
import {
  PRODUCT_FIELD_KEYS,
  CSV_ALT_BY_CANONICAL,
  ALLOWED_UPDATE_KEYS,
} from './constants';
import { ADMIN_ERRORS } from './errorMessages';

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
  cats: T[]
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
  items: T[]
): T[] {
  return [...items].sort((a, b) =>
    (a.Nazwa ?? '').localeCompare(b.Nazwa ?? '', undefined, {
      sensitivity: 'base',
    })
  );
}

/** Fetch product by Kod. Throws if not found. */
export async function getProductByKod(
  ctx: Ctx,
  kod: string
): Promise<ProductDoc> {
  const product = await ctx.db
    .query('products')
    .withIndex('by_kod', (q) => q.eq('Kod', kod))
    .unique();
  if (!product) {
    throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND(kod));
  }
  return product;
}

/** Convert product doc to item shape with image URLs. */
export async function productToItem(
  ctx: Ctx,
  p: ProductDoc
): Promise<Record<string, string>> {
  const { imageStorageId, thumbnailStorageId, ...rest } = Object.fromEntries(
    Object.entries(p).filter(([k]) => k !== '_id' && k !== '_creationTime')
  ) as Omit<ProductDoc, '_id' | '_creationTime'>;
  const [imageUrl, thumbnailUrl] = await Promise.all([
    imageStorageId ? ctx.storage.getUrl(imageStorageId) : null,
    thumbnailStorageId ? ctx.storage.getUrl(thumbnailStorageId) : null,
  ]);
  return {
    ...rest,
    imageStorageId: imageStorageId ?? '',
    imageUrl: imageUrl ?? '',
    thumbnailStorageId: thumbnailStorageId ?? '',
    thumbnailUrl: thumbnailUrl ?? '',
  } as Record<string, string>;
}

/**
 * Delete product images from storage with error handling.
 * Continues on individual deletion failures (e.g., already deleted files).
 * (Mutation-only: storage.delete)
 */
export async function deleteProductImages(
  ctx: MutationCtx,
  product: ProductDoc
): Promise<StorageDeletionResult> {
  const toDelete = [product.imageStorageId, product.thumbnailStorageId].filter(
    Boolean
  ) as string[];

  if (toDelete.length === 0) {
    return { deleted: 0, failed: 0 };
  }

  const results = await Promise.allSettled(
    toDelete.map((id) => ctx.storage.delete(id))
  );

  const deleted = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  // Log failures for debugging but don't throw
  if (failed > 0) {
    console.warn(
      `Failed to delete ${failed} of ${toDelete.length} storage files for product ${product.Kod}`
    );
  }

  return { deleted, failed };
}

/** Map row to product insert shape. Handles both camelCase and CSV alt keys. */
export function toProductInsert(
  row: Record<string, string>,
  categorySlug: string,
  existingImages?: ProductImageIds
): ProductInsert {
  const get = (key: (typeof PRODUCT_FIELD_KEYS)[number]) =>
    row[key] ?? row[CSV_ALT_BY_CANONICAL[key] ?? ''] ?? '';

  const insert: ProductInsert = {
    ...(Object.fromEntries(
      PRODUCT_FIELD_KEYS.map((k) => [k, get(k)])
    ) as Record<(typeof PRODUCT_FIELD_KEYS)[number], string>),
    categorySlug,
  };
  if (existingImages?.imageStorageId)
    insert.imageStorageId = existingImages.imageStorageId;
  if (existingImages?.thumbnailStorageId)
    insert.thumbnailStorageId = existingImages.thumbnailStorageId;
  return insert;
}

/** Filter updates to allowed keys only. */
export function filterAllowedUpdates(
  updates: Record<string, string>
): Record<string, string> {
  const patch: Record<string, string> = {};
  for (const [k, val] of Object.entries(updates)) {
    if (ALLOWED_UPDATE_KEYS.has(k) && typeof val === 'string') patch[k] = val;
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
