import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import {
  productRowValidator,
  sectionValidator,
  categorySeedValidator,
} from "./lib/validators";
import type {
  CatalogSection,
  MutationSuccess,
  ProductImageIds,
} from "./lib/types";
import {
  CUSTOM_CATEGORY_TITLE_KEY,
  CATALOG_MEMORY_WARNING_THRESHOLD,
} from "./lib/constants";
import {
  sortCategories,
  sortItemsByNazwa,
  sortItemsBySubcategoryThenNazwa,
  sortProductsBySubcategoryThenHeightThenNazwa,
  sortSubcategories,
  getProductByKod,
  productToItem,
  deleteProductImages,
  getProductImageEntries,
  toProductInsert,
  filterAllowedUpdates,
  productToUpdateResult,
} from "./lib/helpers";
import { requireAdmin, sanitizeString, validateSlug } from "./lib/convexAuth";
import { slugifyDisplayName, shortRandomId } from "./lib/slugify";
import { ADMIN_ERRORS } from "./lib/errorMessages";

const MAX_SUBCATEGORY_SLUG_LENGTH = 100;
const UNIQUE_SUFFIX_LENGTH = 5;
const MAX_SLUG_GENERATION_ATTEMPTS = 10;

// --- Queries ---

/** List catalog grouped by category (for admin and public). Catalog order: subcategory → image height (tallest first) → Nazwa. */
export const listCatalogSections = query({
  args: {},
  handler: async (ctx) => {
    const categories = sortCategories(
      await ctx.db.query("categories").collect(),
    );
    const sections: CatalogSection[] = [];
    for (const cat of categories) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categorySlug", cat.slug))
        .collect();
      const subs = await ctx.db
        .query("subcategories")
        .withIndex("by_category", (q) => q.eq("categorySlug", cat.slug))
        .collect();
      const subcategories = sortSubcategories(
        subs.map((s) => ({ slug: s.slug, displayName: s.displayName, order: s.order })),
      );
      const subSlugs = subcategories.map((s) => s.slug);

      const storageIds = products
        .map((p) => {
          const e = getProductImageEntries(p)[0];
          return e?.thumbnailStorageId ?? e?.imageStorageId;
        })
        .filter((id): id is string => Boolean(id));
      const dimsByStorageId: Record<string, { width: number; height: number }> = {};
      for (const id of [...new Set(storageIds)]) {
        const row = await ctx.db
          .query("imageDimensions")
          .withIndex("by_storageId", (q) => q.eq("storageId", id))
          .unique();
        if (row) dimsByStorageId[id] = { width: row.width, height: row.height };
      }

      const sorted = sortProductsBySubcategoryThenHeightThenNazwa(
        products,
        subSlugs,
        dimsByStorageId,
      );
      const items = await Promise.all(sorted.map((p) => productToItem(ctx, p)));
      sections.push({
        slug: cat.slug,
        titleKey: cat.titleKey,
        displayName: cat.displayName,
        items,
        subcategories,
      });
    }
    return sections;
  },
});

/** List categories only (for nav / dropdowns). Admin-created first (newest), then rest by slug. */
export const listCategories = query({
  args: {},
  handler: async (ctx) =>
    sortCategories(await ctx.db.query("categories").collect()),
});

/** List category slugs only (for sitemap, static params). Single source of truth from Convex. */
export const listCategorySlugs = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("categories").collect();
    return sortCategories(cats).map((c) => c.slug);
  },
});

/** Get one product as catalog item by Kod (for admin edit form so form always has latest DB data). */
export const getProductItemByKod = query({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    if (!kod.trim()) return null;
    const product = await ctx.db
      .query("products")
      .withIndex("by_kod", (q) => q.eq("Kod", kod.trim()))
      .unique();
    if (!product) return null;
    return productToItem(ctx, product);
  },
});

/** List subcategories for a category (for admin dropdown and product page headings). */
export const listSubcategories = query({
  args: { categorySlug: v.string() },
  handler: async (ctx, { categorySlug }) => {
    const subs = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categorySlug", categorySlug))
      .collect();
    return sortSubcategories(
      subs.map((s) => ({
        slug: s.slug,
        displayName: s.displayName,
        order: s.order,
      })),
    );
  },
});

/** Get dimensions for many storage IDs (catalog order: tallest first). */
export const getImageDimensionsBatch = query({
  args: { storageIds: v.array(v.string()) },
  handler: async (ctx, { storageIds }) => {
    const unique = [...new Set(storageIds)].filter(Boolean);
    const out: Record<string, { width: number; height: number }> = {};
    for (const id of unique) {
      const row = await ctx.db
        .query("imageDimensions")
        .withIndex("by_storageId", (q) => q.eq("storageId", id))
        .unique();
      if (row) out[id] = { width: row.width, height: row.height };
    }
    return out;
  },
});

/** Set or overwrite dimensions for one image (storage ID). Used only by admin "Update catalog order" API route. */
export const setImageDimensions = mutation({
  args: {
    storageId: v.string(),
    width: v.number(),
    height: v.number(),
  },
  handler: async (ctx, { storageId, height, width }) => {
    const existing = await ctx.db
      .query("imageDimensions")
      .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
      .unique();
    const data = { storageId, width, height };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("imageDimensions", data);
    }
    return { ok: true } as MutationSuccess;
  },
});

/** Get one category's products (for /products/[slug]). Catalog order: subcategory → image height (tallest first) → Nazwa. */
export const getCatalogSection = query({
  args: { slug: v.string(), debug: v.optional(v.boolean()) },
  handler: async (ctx, { slug, debug: debugFlag }) => {
    const cat = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!cat) return null;
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categorySlug", slug))
      .collect();
    const subs = await ctx.db
      .query("subcategories")
      .withIndex("by_category", (q) => q.eq("categorySlug", slug))
      .collect();
    const subcategories = sortSubcategories(
      subs.map((s) => ({ slug: s.slug, displayName: s.displayName, order: s.order })),
    );
    const subSlugs = subcategories.map((s) => s.slug);

    const productData = products.map((p) => {
      const e = getProductImageEntries(p)[0];
      const sortStorageId = e?.thumbnailStorageId ?? e?.imageStorageId ?? null;
      return {
        _id: p._id,
        Kod: p.Kod,
        Nazwa: p.Nazwa,
        subcategorySlug: p.subcategorySlug ?? "",
        sortStorageId,
      };
    });

    const storageIds = products
      .map((p) => {
        const e = getProductImageEntries(p)[0];
        return e?.thumbnailStorageId ?? e?.imageStorageId;
      })
      .filter((id): id is string => Boolean(id));
    const dimsByStorageId: Record<string, { width: number; height: number }> = {};
    for (const id of [...new Set(storageIds)]) {
      const row = await ctx.db
        .query("imageDimensions")
        .withIndex("by_storageId", (q) => q.eq("storageId", id))
        .unique();
      if (row) dimsByStorageId[id] = { width: row.width, height: row.height };
    }

    const sorted = sortProductsBySubcategoryThenHeightThenNazwa(
      products,
      subSlugs,
      dimsByStorageId,
    );

    const orderAfterSort = sorted.map((p, idx) => {
      const e = getProductImageEntries(p)[0];
      const sid = e?.thumbnailStorageId ?? e?.imageStorageId;
      const dim = sid ? dimsByStorageId[sid] : undefined;
      const portraitRatio = dim?.width ? +(dim.height / dim.width).toFixed(3) : 0;
      return { index: idx, Nazwa: p.Nazwa, subcategorySlug: p.subcategorySlug ?? "", portraitRatio, width: dim?.width ?? null, height: dim?.height ?? null, storageId: sid ?? null };
    });

    const items = await Promise.all(sorted.map((p) => productToItem(ctx, p)));
    const sectionPayload = {
      slug: cat.slug,
      titleKey: cat.titleKey,
      displayName: cat.displayName,
      items,
      subcategories,
    };
    if (debugFlag) {
      const ratiosUsed = sorted.map((p) => {
        const e = getProductImageEntries(p)[0];
        const sid = e?.thumbnailStorageId ?? e?.imageStorageId;
        const dim = sid ? dimsByStorageId[sid] : undefined;
        return dim?.width ? dim.height / dim.width : 0;
      });
      (sectionPayload as Record<string, unknown>).__debug = {
        slug,
        productCount: products.length,
        uniqueStorageIdsWithDimensions: Object.keys(dimsByStorageId).length,
        productData,
        dimsByStorageId,
        orderAfterSort,
        portraitRatioRange:
          ratiosUsed.length
            ? { min: +Math.min(...ratiosUsed).toFixed(3), max: +Math.max(...ratiosUsed).toFixed(3), distinct: new Set(ratiosUsed.map((r) => r.toFixed(3))).size }
            : null,
      };
    }
    return sectionPayload;
  },
});

// --- Mutations ---

/** Update one product by Kod. (Admin only) */
export const updateProduct = mutation({
  args: {
    kod: v.string(),
    updates: v.record(v.string(), v.string()),
  },
  handler: async (ctx, { kod, updates }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate kod input
    const validatedKod = sanitizeString(kod, 100, "Product code");

    const product = await getProductByKod(ctx, validatedKod);
    const patch = filterAllowedUpdates(updates);

    if (Object.keys(patch).length === 0) {
      return productToUpdateResult(product);
    }

    await ctx.db.patch(product._id, patch);
    const updated = await ctx.db.get(product._id);
    if (!updated) {
      throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND(validatedKod));
    }

    return productToUpdateResult(updated);
  },
});

/** Generate a short-lived URL for uploading a file to Convex. (Admin only) */
export const generateUploadUrl = mutation(async (ctx) => {
  // Require admin authentication
  await requireAdmin(ctx);

  return await ctx.storage.generateUploadUrl();
});

const imageEntryValidator = v.object({
  imageStorageId: v.string(),
  thumbnailStorageId: v.optional(v.string()),
});

/** Set all images for a product. Replaces existing; deletes from storage any IDs no longer in the list. (Admin only) */
export const setProductImages = mutation({
  args: {
    kod: v.string(),
    images: v.array(imageEntryValidator),
  },
  handler: async (ctx, { kod, images }) => {
    await requireAdmin(ctx);
    const validatedKod = sanitizeString(kod, 100, "Product code");
    const product = await getProductByKod(ctx, validatedKod);
    const currentEntries = getProductImageEntries(product);
    const newIds = new Set<string>();
    for (const img of images) {
      newIds.add(sanitizeString(img.imageStorageId, 500, "Storage ID"));
      if (img.thumbnailStorageId)
        newIds.add(
          sanitizeString(img.thumbnailStorageId, 500, "Thumbnail storage ID"),
        );
    }
    const toDelete: string[] = [];
    for (const e of currentEntries) {
      if (!newIds.has(e.imageStorageId)) toDelete.push(e.imageStorageId);
      if (e.thumbnailStorageId && !newIds.has(e.thumbnailStorageId))
        toDelete.push(e.thumbnailStorageId);
    }
    if (!currentEntries.length && product.imageStorageId)
      toDelete.push(product.imageStorageId);
    if (!currentEntries.length && product.thumbnailStorageId)
      toDelete.push(product.thumbnailStorageId);
    await Promise.allSettled(toDelete.map((id) => ctx.storage.delete(id)));
    const imageEntries = images.map((img) => ({
      imageStorageId: sanitizeString(img.imageStorageId, 500, "Storage ID"),
      thumbnailStorageId: img.thumbnailStorageId
        ? sanitizeString(img.thumbnailStorageId, 500, "Thumbnail storage ID")
        : undefined,
    }));
    await ctx.db.patch(product._id, {
      imageEntries,
      imageStorageId: undefined,
      thumbnailStorageId: undefined,
    });
    return { ok: true } as MutationSuccess;
  },
});

/** Append one image to a product. (Admin only) */
export const addProductImage = mutation({
  args: {
    kod: v.string(),
    storageId: v.string(),
    thumbnailStorageId: v.optional(v.string()),
  },
  handler: async (ctx, { kod, storageId, thumbnailStorageId }) => {
    await requireAdmin(ctx);
    const validatedKod = sanitizeString(kod, 100, "Product code");
    const validatedStorageId = sanitizeString(storageId, 500, "Storage ID");
    const product = await getProductByKod(ctx, validatedKod);
    const entries = getProductImageEntries(product);
    const newEntry = {
      imageStorageId: validatedStorageId,
      thumbnailStorageId:
        thumbnailStorageId !== undefined
          ? sanitizeString(thumbnailStorageId, 500, "Thumbnail storage ID")
          : undefined,
    };
    const imageEntries = [...entries, newEntry];
    await ctx.db.patch(product._id, {
      imageEntries,
      imageStorageId: undefined,
      thumbnailStorageId: undefined,
    });
    return { ok: true } as MutationSuccess;
  },
});

/** Remove one image at index from a product and delete it from storage. (Admin only) */
export const removeProductImage = mutation({
  args: { kod: v.string(), index: v.number() },
  handler: async (ctx, { kod, index }) => {
    await requireAdmin(ctx);
    const validatedKod = sanitizeString(kod, 100, "Product code");
    const product = await getProductByKod(ctx, validatedKod);
    const entries = getProductImageEntries(product);
    if (index < 0 || index >= entries.length) {
      throw new Error(ADMIN_ERRORS.PRODUCT_NOT_FOUND(validatedKod));
    }
    const [removed] = entries.splice(index, 1);
    const toDelete = [
      removed.imageStorageId,
      ...(removed.thumbnailStorageId ? [removed.thumbnailStorageId] : []),
    ];
    await Promise.allSettled(toDelete.map((id) => ctx.storage.delete(id)));
    await ctx.db.patch(product._id, {
      imageEntries: entries.length > 0 ? entries : [],
      imageStorageId: undefined,
      thumbnailStorageId: undefined,
    });
    return { ok: true } as MutationSuccess;
  },
});

/** Update a product's single image (legacy). Replaces all images with this one. (Admin only) */
export const updateProductImage = mutation({
  args: {
    kod: v.string(),
    storageId: v.string(),
    thumbnailStorageId: v.optional(v.string()),
  },
  handler: async (ctx, { kod, storageId, thumbnailStorageId }) => {
    await requireAdmin(ctx);
    const validatedKod = sanitizeString(kod, 100, "Product code");
    const validatedStorageId = sanitizeString(storageId, 500, "Storage ID");
    const product = await getProductByKod(ctx, validatedKod);
    await deleteProductImages(ctx, product);
    const imageEntries = [
      {
        imageStorageId: validatedStorageId,
        thumbnailStorageId:
          thumbnailStorageId !== undefined
            ? sanitizeString(thumbnailStorageId, 500, "Thumbnail storage ID")
            : undefined,
      },
    ];
    await ctx.db.patch(product._id, {
      imageEntries,
      imageStorageId: undefined,
      thumbnailStorageId: undefined,
    });
    return { ok: true } as MutationSuccess;
  },
});

/** Remove all images for a product from storage and clear IDs. (Admin only) */
export const clearProductImage = mutation({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    await requireAdmin(ctx);
    const validatedKod = sanitizeString(kod, 100, "Product code");
    const product = await getProductByKod(ctx, validatedKod);
    await deleteProductImages(ctx, product);
    await ctx.db.patch(product._id, {
      imageEntries: undefined,
      imageStorageId: undefined,
      thumbnailStorageId: undefined,
    });
    return { ok: true } as MutationSuccess;
  },
});

/** Create a new category (admin only). */
export const createCategory = mutation({
  args: {
    slug: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, { slug, displayName }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate and normalize inputs
    const normalizedSlug = validateSlug(slug);
    const validatedDisplayName = sanitizeString(
      displayName,
      200,
      "Display name",
    );

    // Check for existing category
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
      .unique();

    if (existing) {
      throw new Error(ADMIN_ERRORS.CATEGORY_EXISTS(normalizedSlug));
    }

    // Insert new category
    try {
      await ctx.db.insert("categories", {
        slug: normalizedSlug,
        titleKey: CUSTOM_CATEGORY_TITLE_KEY,
        displayName: validatedDisplayName,
        createdAt: Date.now(),
      });
    } catch (error) {
      // Handle race condition - another request may have inserted the same slug
      const doubleCheck = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
        .unique();

      if (doubleCheck) {
        throw new Error(ADMIN_ERRORS.CATEGORY_EXISTS(normalizedSlug));
      }
      // Re-throw if it's a different error
      throw error;
    }

    return { ok: true, slug: normalizedSlug } as MutationSuccess;
  },
});

/** Delete a category (admin only). Only allowed when it has no products. */
export const deleteCategory = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate slug
    const validatedSlug = validateSlug(slug);

    const cat = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", validatedSlug))
      .unique();

    if (!cat) {
      throw new Error(ADMIN_ERRORS.CATEGORY_NOT_FOUND(validatedSlug));
    }

    // Check for products in this category
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categorySlug", validatedSlug))
      .collect();

    if (products.length > 0) {
      throw new Error(
        ADMIN_ERRORS.CATEGORY_HAS_PRODUCTS(validatedSlug, products.length),
      );
    }

    await ctx.db.delete(cat._id);
    return { ok: true, slug: validatedSlug } as MutationSuccess;
  },
});

/** Generate a unique subcategory slug from display name (slugify + random suffix on collision). */
async function generateUniqueSubcategorySlug(
  ctx: MutationCtx,
  categorySlug: string,
  displayName: string,
): Promise<string> {
  const base = slugifyDisplayName(displayName);
  const maxBaseLength = MAX_SUBCATEGORY_SLUG_LENGTH - 1 - UNIQUE_SUFFIX_LENGTH; // leave room for "-" + 5 chars
  const baseSlug = base.slice(0, maxBaseLength).replace(/-+$/, "") || "sub";

  const candidate = validateSlug(baseSlug, MAX_SUBCATEGORY_SLUG_LENGTH);
  const existing = await ctx.db
    .query("subcategories")
    .withIndex("by_category_slug", (q) =>
      q.eq("categorySlug", categorySlug).eq("slug", candidate),
    )
    .unique();
  if (!existing) return candidate;

  for (let i = 0; i < MAX_SLUG_GENERATION_ATTEMPTS; i++) {
    const suffix = shortRandomId();
    const slug = `${baseSlug}-${suffix}`;
    const validated = validateSlug(slug, MAX_SUBCATEGORY_SLUG_LENGTH);
    const again = await ctx.db
      .query("subcategories")
      .withIndex("by_category_slug", (q) =>
        q.eq("categorySlug", categorySlug).eq("slug", validated),
      )
      .unique();
    if (!again) return validated;
  }
  throw new Error("Could not generate unique subcategory slug after retries");
}

/** Create a subcategory (admin only). Slug unique within category. If slug omitted, auto-generated from displayName. */
export const createSubcategory = mutation({
  args: {
    categorySlug: v.string(),
    slug: v.optional(v.string()),
    displayName: v.string(),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { categorySlug, slug: slugArg, displayName, order }) => {
    await requireAdmin(ctx);
    const validatedCategorySlug = validateSlug(categorySlug);
    const validatedDisplayName = sanitizeString(displayName, 200, "Display name");

    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", validatedCategorySlug))
      .unique();
    if (!category) {
      throw new Error(ADMIN_ERRORS.CATEGORY_NOT_FOUND(validatedCategorySlug));
    }

    const validatedSlug =
      slugArg !== undefined && slugArg.trim() !== ""
        ? validateSlug(slugArg.trim(), MAX_SUBCATEGORY_SLUG_LENGTH)
        : await generateUniqueSubcategorySlug(
            ctx,
            validatedCategorySlug,
            validatedDisplayName,
          );

    const existing = await ctx.db
      .query("subcategories")
      .withIndex("by_category_slug", (q) =>
        q.eq("categorySlug", validatedCategorySlug).eq("slug", validatedSlug),
      )
      .unique();
    if (existing) {
      throw new Error(
        ADMIN_ERRORS.SUBCATEGORY_EXISTS(validatedSlug, validatedCategorySlug),
      );
    }

    await ctx.db.insert("subcategories", {
      categorySlug: validatedCategorySlug,
      slug: validatedSlug,
      displayName: validatedDisplayName,
      order: order ?? undefined,
      createdAt: Date.now(),
    });
    return { ok: true, slug: validatedSlug } as MutationSuccess;
  },
});

/** Update a subcategory (admin only). */
export const updateSubcategory = mutation({
  args: {
    categorySlug: v.string(),
    slug: v.string(),
    updates: v.object({
      displayName: v.optional(v.string()),
      order: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { categorySlug, slug, updates }) => {
    await requireAdmin(ctx);
    const validatedCategorySlug = validateSlug(categorySlug);
    const validatedSlug = validateSlug(slug);

    const sub = await ctx.db
      .query("subcategories")
      .withIndex("by_category_slug", (q) =>
        q.eq("categorySlug", validatedCategorySlug).eq("slug", validatedSlug),
      )
      .unique();
    if (!sub) {
      throw new Error(
        ADMIN_ERRORS.SUBCATEGORY_NOT_FOUND(validatedSlug, validatedCategorySlug),
      );
    }

    const patch: { displayName?: string; order?: number } = {};
    if (updates.displayName !== undefined)
      patch.displayName = sanitizeString(updates.displayName, 200, "Display name");
    if (updates.order !== undefined) patch.order = updates.order;
    if (Object.keys(patch).length > 0) await ctx.db.patch(sub._id, patch);
    return { ok: true, slug: validatedSlug } as MutationSuccess;
  },
});

/** Delete a subcategory (admin only). Only when no products use it. */
export const deleteSubcategory = mutation({
  args: { categorySlug: v.string(), slug: v.string() },
  handler: async (ctx, { categorySlug, slug }) => {
    await requireAdmin(ctx);
    const validatedCategorySlug = validateSlug(categorySlug);
    const validatedSlug = validateSlug(slug);

    const sub = await ctx.db
      .query("subcategories")
      .withIndex("by_category_slug", (q) =>
        q.eq("categorySlug", validatedCategorySlug).eq("slug", validatedSlug),
      )
      .unique();
    if (!sub) {
      throw new Error(
        ADMIN_ERRORS.SUBCATEGORY_NOT_FOUND(validatedSlug, validatedCategorySlug),
      );
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categorySlug", validatedCategorySlug))
      .collect();
    const count = products.filter(
      (p) => p.subcategorySlug === validatedSlug,
    ).length;
    if (count > 0) {
      throw new Error(ADMIN_ERRORS.SUBCATEGORY_HAS_PRODUCTS(validatedSlug, count));
    }

    await ctx.db.delete(sub._id);
    return { ok: true, slug: validatedSlug } as MutationSuccess;
  },
});

/** Seed default gloves subcategories (admin only). Idempotent: skips existing. */
const GLOVES_SUBCATEGORIES = [
  { slug: "podgumowane", displayName: "Podgumowane", order: 1 },
  { slug: "gumowe", displayName: "Gumowe", order: 2 },
  { slug: "skorzane-i-wzmocnione-skora", displayName: "Skórzane i wzmocnione skórą", order: 3 },
  { slug: "bawelniane", displayName: "Bawełniane", order: 4 },
  { slug: "ocieplane", displayName: "Ocieplane", order: 5 },
] as const;

export const seedGlovesSubcategories = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", "gloves"))
      .unique();
    if (!category) return { ok: true, created: 0 };
    let created = 0;
    for (const { slug, displayName, order } of GLOVES_SUBCATEGORIES) {
      const existing = await ctx.db
        .query("subcategories")
        .withIndex("by_category_slug", (q) =>
          q.eq("categorySlug", "gloves").eq("slug", slug),
        )
        .unique();
      if (!existing) {
        await ctx.db.insert("subcategories", {
          categorySlug: "gloves",
          slug,
          displayName,
          order,
          createdAt: Date.now(),
        });
        created++;
      }
    }
    return { ok: true, created } as MutationSuccess;
  },
});

/** Create one product (admin only). */
export const createProduct = mutation({
  args: {
    categorySlug: v.string(),
    row: productRowValidator,
    subcategorySlug: v.optional(v.string()),
  },
  handler: async (ctx, { categorySlug, row, subcategorySlug }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate category slug
    const validatedCategorySlug = validateSlug(categorySlug);

    // Verify category exists
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", validatedCategorySlug))
      .unique();

    if (!category) {
      throw new Error(ADMIN_ERRORS.CATEGORY_NOT_FOUND(validatedCategorySlug));
    }

    const rawSub = subcategorySlug?.trim();
    if (rawSub) {
      const sub = await ctx.db
        .query("subcategories")
        .withIndex("by_category_slug", (q) =>
          q.eq("categorySlug", validatedCategorySlug).eq("slug", rawSub),
        )
        .unique();
      if (!sub) {
        throw new Error(
          ADMIN_ERRORS.SUBCATEGORY_NOT_FOUND(rawSub, validatedCategorySlug),
        );
      }
    }

    // Validate product code
    const kod = row.Kod ?? "";
    const validatedKod = sanitizeString(kod, 100, "Product code");

    // Check for existing product
    const existing = await ctx.db
      .query("products")
      .withIndex("by_kod", (q) => q.eq("Kod", validatedKod))
      .unique();

    if (existing) {
      throw new Error(ADMIN_ERRORS.PRODUCT_EXISTS(validatedKod));
    }

    await ctx.db.insert(
      "products",
      toProductInsert(
        row as Record<string, string>,
        validatedCategorySlug,
        undefined,
        rawSub ?? undefined,
      ),
    );

    return { ok: true, kod: validatedKod } as MutationSuccess;
  },
});

/** Delete one product by Kod (admin only). Cascades to image and thumbnail storage. */
export const deleteProduct = mutation({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate kod
    const validatedKod = sanitizeString(kod, 100, "Product code");

    const product = await getProductByKod(ctx, validatedKod);

    // Delete images with error handling
    await deleteProductImages(ctx, product);

    await ctx.db.delete(product._id);

    return { ok: true, kod: validatedKod } as MutationSuccess;
  },
});

/**
 * Replace entire catalog from categorized sections (admin only).
 * WARNING: This is a destructive operation that deletes all existing products.
 * Note: Collects all products in memory. For catalogs >1000 products, consider batching.
 */
export const replaceCatalogFromSections = mutation({
  args: { sections: v.array(sectionValidator) },
  handler: async (ctx, { sections }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate sections array is not empty
    if (!Array.isArray(sections) || sections.length === 0) {
      throw new Error(ADMIN_ERRORS.EMPTY_INPUT("Sections array"));
    }

    // Count products for memory safety warning
    const existingProducts = await ctx.db.query("products").collect();

    // Preserve image storage IDs (imageEntries or legacy single)
    const imagesByKod = new Map<string, ProductImageIds>();

    for (const p of existingProducts) {
      const entries = getProductImageEntries(p);
      if (entries.length > 0) {
        imagesByKod.set(p.Kod, { imageEntries: entries });
      } else if (p.imageStorageId || p.thumbnailStorageId) {
        imagesByKod.set(p.Kod, {
          imageStorageId: p.imageStorageId,
          thumbnailStorageId: p.thumbnailStorageId,
        });
      }
      await ctx.db.delete(p._id);
    }

    // Build category map and insert products
    const slugToTitleKey = new Map<string, string>();
    let productsInserted = 0;

    for (const s of sections) {
      // Validate section slug
      const validatedSlug = validateSlug(s.slug);
      slugToTitleKey.set(validatedSlug, s.titleKey);

      for (const item of s.items) {
        const categorySlug =
          "categorySlug" in item && typeof item.categorySlug === "string"
            ? item.categorySlug
            : validatedSlug;

        const row = { ...item, categorySlug } as Record<string, string>;
        const kod = row.Kod ?? "";
        const existingImages = imagesByKod.get(kod);
        const productInsert = toProductInsert(
          row,
          categorySlug,
          existingImages,
        );

        await ctx.db.insert("products", productInsert);
        productsInserted++;
      }
    }

    // Clean up obsolete categories (preserve custom admin-created ones)
    const existingCats = await ctx.db.query("categories").collect();
    let categoriesDeleted = 0;

    for (const c of existingCats) {
      // Keep admin-created categories (they have displayName)
      if (c.displayName) {
        continue;
      }
      // Delete categories not in the new catalog
      if (!slugToTitleKey.has(c.slug)) {
        await ctx.db.delete(c._id);
        categoriesDeleted++;
      }
    }

    // Update or create categories from sections
    for (const [slug, titleKey] of slugToTitleKey) {
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { titleKey });
      } else {
        await ctx.db.insert("categories", { slug, titleKey });
      }
    }

    return {
      ok: true,
      sectionsCount: sections.length,
      productsInserted,
      categoriesDeleted,
    } as MutationSuccess;
  },
});

/**
 * Seed categories from slug+titleKey list (admin only).
 * WARNING: This deletes ALL categories including custom admin-created ones.
 * Use only for initial setup or when rules change.
 */
export const setCategories = mutation({
  args: {
    categories: v.array(categorySeedValidator),
    confirmDestruction: v.optional(v.boolean()),
  },
  handler: async (ctx, { categories: cats, confirmDestruction = false }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate categories array
    if (!Array.isArray(cats) || cats.length === 0) {
      throw new Error(ADMIN_ERRORS.EMPTY_INPUT("Categories array"));
    }

    // Safety check: require explicit confirmation
    if (!confirmDestruction) {
      throw new Error(ADMIN_ERRORS.DESTRUCTIVE_OPERATION_REQUIRES_CONFIRMATION);
    }

    // Check if there are custom categories that will be lost
    const existing = await ctx.db.query("categories").collect();
    const customCats = existing.filter((c) => c.displayName);

    // Delete all existing categories
    for (const c of existing) {
      await ctx.db.delete(c._id);
    }

    // Insert new categories with validation
    const insertedSlugs = new Set<string>();

    for (const { slug, titleKey } of cats) {
      const validatedSlug = validateSlug(slug);
      const validatedTitleKey = sanitizeString(titleKey, 200, "Title key");

      // Check for duplicates within the input array
      if (insertedSlugs.has(validatedSlug)) {
        throw new Error(`Duplicate category slug in input: ${validatedSlug}`);
      }

      await ctx.db.insert("categories", {
        slug: validatedSlug,
        titleKey: validatedTitleKey,
      });

      insertedSlugs.add(validatedSlug);
    }

    return {
      ok: true,
      count: cats.length,
      deletedCustomCategories: customCats.length,
    } as MutationSuccess;
  },
});
