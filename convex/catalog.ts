import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  productRowValidator,
  sectionValidator,
  categorySeedValidator,
} from "./lib/validators";
import type { CatalogSection, MutationSuccess } from "./lib/types";
import {
  CUSTOM_CATEGORY_TITLE_KEY,
  CATALOG_MEMORY_WARNING_THRESHOLD,
} from "./lib/constants";
import {
  sortCategories,
  sortItemsByNazwa,
  getProductByKod,
  productToItem,
  deleteProductImages,
  toProductInsert,
  filterAllowedUpdates,
  productToUpdateResult,
} from "./lib/helpers";
import { requireAdmin, sanitizeString, validateSlug } from "./lib/convexAuth";
import { ADMIN_ERRORS } from "./lib/errorMessages";

// --- Queries ---

/** List catalog grouped by category (for admin and public). Includes empty categories. */
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
      const items = await Promise.all(
        products.map((p) => productToItem(ctx, p)),
      );
      sections.push({
        slug: cat.slug,
        titleKey: cat.titleKey,
        displayName: cat.displayName,
        items: sortItemsByNazwa(items),
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

/** Get one category's products (for /products/[slug] when migrated from placeholder). */
export const getCatalogSection = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const cat = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!cat) return null;
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categorySlug", slug))
      .collect();
    const items = await Promise.all(products.map((p) => productToItem(ctx, p)));
    return {
      slug: cat.slug,
      titleKey: cat.titleKey,
      displayName: cat.displayName,
      items: sortItemsByNazwa(items),
    };
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

/** Update a product's image storage IDs (large + optional thumbnail). (Admin only) */
export const updateProductImage = mutation({
  args: {
    kod: v.string(),
    storageId: v.string(),
    thumbnailStorageId: v.optional(v.string()),
  },
  handler: async (ctx, { kod, storageId, thumbnailStorageId }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate inputs
    const validatedKod = sanitizeString(kod, 100, "Product code");
    const validatedStorageId = sanitizeString(storageId, 500, "Storage ID");

    const product = await getProductByKod(ctx, validatedKod);

    // Delete old images (with error handling)
    await deleteProductImages(ctx, product);

    const patch: { imageStorageId: string; thumbnailStorageId?: string } = {
      imageStorageId: validatedStorageId,
    };

    if (thumbnailStorageId !== undefined) {
      patch.thumbnailStorageId = sanitizeString(
        thumbnailStorageId,
        500,
        "Thumbnail storage ID",
      );
    }

    await ctx.db.patch(product._id, patch);
    return { ok: true } as MutationSuccess;
  },
});

/** Remove a product's images (large + thumbnail) from storage and clear IDs. (Admin only) */
export const clearProductImage = mutation({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    // Require admin authentication
    await requireAdmin(ctx);

    // Validate kod input
    const validatedKod = sanitizeString(kod, 100, "Product code");

    const product = await getProductByKod(ctx, validatedKod);

    // Delete images with error handling
    await deleteProductImages(ctx, product);

    await ctx.db.patch(product._id, {
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

/** Create one product (admin only). */
export const createProduct = mutation({
  args: {
    categorySlug: v.string(),
    row: productRowValidator,
  },
  handler: async (ctx, { categorySlug, row }) => {
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
      toProductInsert(row as Record<string, string>, validatedCategorySlug),
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

    if (existingProducts.length > CATALOG_MEMORY_WARNING_THRESHOLD) {
      console.warn(ADMIN_ERRORS.MEMORY_WARNING(existingProducts.length));
    }

    // Preserve image storage IDs
    const imagesByKod = new Map<
      string,
      { imageStorageId?: string; thumbnailStorageId?: string }
    >();

    for (const p of existingProducts) {
      if (p.imageStorageId || p.thumbnailStorageId) {
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

    if (customCats.length > 0) {
      console.warn(
        `Warning: Deleting ${customCats.length} custom admin-created categories: ` +
          customCats.map((c) => c.slug).join(", "),
      );
    }

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
