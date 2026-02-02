import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const productFieldValidators = {
  Rodzaj: v.string(),
  JednostkaMiary: v.string(),
  StawkaVAT: v.string(),
  Kod: v.string(),
  Nazwa: v.string(),
  CenaNetto: v.string(),
  KodKlasyfikacji: v.string(),
  Uwagi: v.string(),
  OstatniaCenaZakupu: v.string(),
  OstatniaDataZakupu: v.string(),
};

/** Section shape for catalog UI and CSV replace. */
const sectionValidator = v.object({
  slug: v.string(),
  titleKey: v.string(),
  items: v.array(
    v.object({
      ...productFieldValidators,
      categorySlug: v.optional(v.string()),
    })
  ),
});

/** Sort: admin-created (with createdAt) first by newest, then rest by slug. */
function sortCategories<T extends { slug: string; createdAt?: number }>(
  cats: T[]
): T[] {
  return [...cats].sort((a, b) => {
    const aT = a.createdAt ?? 0;
    const bT = b.createdAt ?? 0;
    if (aT !== bT) return bT - aT; // Newest first
    return a.slug.localeCompare(b.slug);
  });
}

/** Sort product items alphabetically by Nazwa (name). */
function sortItemsByNazwa<T extends { Nazwa?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    (a.Nazwa ?? '').localeCompare(b.Nazwa ?? '', undefined, {
      sensitivity: 'base',
    })
  );
}

/** List catalog grouped by category (for admin and public). Includes empty categories. */
export const listCatalogSections = query({
  args: {},
  handler: async (ctx) => {
    const categories = sortCategories(
      await ctx.db.query('categories').collect()
    );
    const sections: {
      slug: string;
      titleKey: string;
      displayName?: string;
      items: Record<string, string>[];
    }[] = [];
    for (const cat of categories) {
      const products = await ctx.db
        .query('products')
        .withIndex('by_category', (q) => q.eq('categorySlug', cat.slug))
        .collect();
      const items = await Promise.all(
        products.map(async (p) => {
          const {
            _id,
            _creationTime,
            imageStorageId,
            thumbnailStorageId,
            ...rest
          } = p;
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
        })
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
  handler: async (ctx) => {
    return sortCategories(await ctx.db.query('categories').collect());
  },
});

/** List category slugs only (for sitemap, static params). Single source of truth from Convex. */
export const listCategorySlugs = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query('categories').collect();
    return sortCategories(cats).map((c) => c.slug);
  },
});

/** Get one category's products (for /products/[slug] when migrated from placeholder). */
export const getCatalogSection = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const cat = await ctx.db
      .query('categories')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (!cat) return null;
    const products = await ctx.db
      .query('products')
      .withIndex('by_category', (q) => q.eq('categorySlug', slug))
      .collect();
    const items = await Promise.all(
      products.map(async (p) => {
        const {
          _id,
          _creationTime,
          imageStorageId,
          thumbnailStorageId,
          ...rest
        } = p;
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
      })
    );
    return {
      slug: cat.slug,
      titleKey: cat.titleKey,
      displayName: cat.displayName,
      items: sortItemsByNazwa(items),
    };
  },
});

/** Update one product by Kod. */
export const updateProduct = mutation({
  args: {
    kod: v.string(),
    updates: v.record(v.string(), v.string()),
  },
  handler: async (ctx, { kod, updates }) => {
    const product = await ctx.db
      .query('products')
      .withIndex('by_kod', (q) => q.eq('Kod', kod))
      .unique();
    if (!product) throw new Error(`Product not found: ${kod}`);
    const allowedKeys = new Set([
      'Rodzaj',
      'JednostkaMiary',
      'StawkaVAT',
      'Kod',
      'Nazwa',
      'CenaNetto',
      'KodKlasyfikacji',
      'Uwagi',
      'OstatniaCenaZakupu',
      'OstatniaDataZakupu',
      'categorySlug',
      'imageStorageId',
      'thumbnailStorageId',
    ]);
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (allowedKeys.has(k) && typeof v === 'string') patch[k] = v;
    }
    if (Object.keys(patch).length === 0) {
      const { _id, _creationTime, ...rest } = product;
      return rest as Record<string, string>;
    }
    await ctx.db.patch(product._id, patch);
    const { _id, _creationTime, ...rest } = product;
    return { ...rest, ...patch } as Record<string, string>;
  },
});

/** Generate a short-lived URL for uploading a file to Convex. */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

/** Update a product's image storage IDs (large + optional thumbnail). */
export const updateProductImage = mutation({
  args: {
    kod: v.string(),
    storageId: v.string(),
    thumbnailStorageId: v.optional(v.string()),
  },
  handler: async (ctx, { kod, storageId, thumbnailStorageId }) => {
    const product = await ctx.db
      .query('products')
      .withIndex('by_kod', (q) => q.eq('Kod', kod))
      .unique();
    if (!product) throw new Error(`Product not found: ${kod}`);

    const toDelete: string[] = [];
    if (product.imageStorageId) toDelete.push(product.imageStorageId);
    if (product.thumbnailStorageId) toDelete.push(product.thumbnailStorageId);
    await Promise.all(toDelete.map((id) => ctx.storage.delete(id)));

    const patch: { imageStorageId: string; thumbnailStorageId?: string } = {
      imageStorageId: storageId,
    };
    if (thumbnailStorageId !== undefined)
      patch.thumbnailStorageId = thumbnailStorageId;
    await ctx.db.patch(product._id, patch);
    return { ok: true };
  },
});

/** Remove a product's images (large + thumbnail) from storage and clear IDs. */
export const clearProductImage = mutation({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    const product = await ctx.db
      .query('products')
      .withIndex('by_kod', (q) => q.eq('Kod', kod))
      .unique();
    if (!product) throw new Error(`Product not found: ${kod}`);

    const toDelete: string[] = [];
    if (product.imageStorageId) toDelete.push(product.imageStorageId);
    if (product.thumbnailStorageId) toDelete.push(product.thumbnailStorageId);
    await Promise.all(toDelete.map((id) => ctx.storage.delete(id)));

    await ctx.db.patch(product._id, {
      imageStorageId: undefined,
      thumbnailStorageId: undefined,
    });
    return { ok: true };
  },
});

const productRowValidator = v.object(productFieldValidators);

/** Create a new category (admin). */
export const createCategory = mutation({
  args: {
    slug: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, { slug, displayName }) => {
    const normalizedSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!normalizedSlug) throw new Error('Slug is required');
    const existing = await ctx.db
      .query('categories')
      .withIndex('by_slug', (q) => q.eq('slug', normalizedSlug))
      .unique();
    if (existing) throw new Error(`Category ${normalizedSlug} already exists`);
    await ctx.db.insert('categories', {
      slug: normalizedSlug,
      titleKey: 'products.catalogCustomCategory',
      displayName: displayName.trim() || normalizedSlug,
      createdAt: Date.now(),
    });
    return { ok: true, slug: normalizedSlug };
  },
});

/** Delete a category (admin). Only allowed when it has no products. */
export const deleteCategory = mutation({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const cat = await ctx.db
      .query('categories')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (!cat) throw new Error(`Category ${slug} not found`);

    const products = await ctx.db
      .query('products')
      .withIndex('by_category', (q) => q.eq('categorySlug', slug))
      .collect();
    if (products.length > 0) {
      throw new Error(
        `Cannot delete category ${slug}: it has ${products.length} product(s). Remove products first.`
      );
    }

    await ctx.db.delete(cat._id);
    return { ok: true, slug };
  },
});

/** Create one product (admin "Add product"). */
export const createProduct = mutation({
  args: {
    categorySlug: v.string(),
    row: productRowValidator,
  },
  handler: async (ctx, { categorySlug, row }) => {
    const kod = row.Kod ?? '';
    const existing = await ctx.db
      .query('products')
      .withIndex('by_kod', (q) => q.eq('Kod', kod))
      .unique();
    if (existing) throw new Error(`Product with Kod ${kod} already exists`);
    await ctx.db.insert('products', {
      Rodzaj: row.Rodzaj ?? '',
      JednostkaMiary: row.JednostkaMiary ?? '',
      StawkaVAT: row.StawkaVAT ?? '',
      Kod: row.Kod ?? '',
      Nazwa: row.Nazwa ?? '',
      CenaNetto: row.CenaNetto ?? '',
      KodKlasyfikacji: row.KodKlasyfikacji ?? '',
      Uwagi: row.Uwagi ?? '',
      OstatniaCenaZakupu: row.OstatniaCenaZakupu ?? '',
      OstatniaDataZakupu: row.OstatniaDataZakupu ?? '',
      categorySlug,
    });
    return { ok: true, kod };
  },
});

/** Delete one product by Kod (admin row delete). Cascades to image and thumbnail storage. */
export const deleteProduct = mutation({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    const product = await ctx.db
      .query('products')
      .withIndex('by_kod', (q) => q.eq('Kod', kod))
      .unique();
    if (!product) throw new Error(`Product not found: ${kod}`);

    const toDelete: string[] = [];
    if (product.imageStorageId) toDelete.push(product.imageStorageId);
    if (product.thumbnailStorageId) toDelete.push(product.thumbnailStorageId);
    await Promise.all(toDelete.map((id) => ctx.storage.delete(id)));

    await ctx.db.delete(product._id);
    return { ok: true, kod };
  },
});

/** Replace entire catalog from categorized sections (e.g. after CSV upload). */
export const replaceCatalogFromSections = mutation({
  args: {
    sections: v.array(sectionValidator),
  },
  handler: async (ctx, { sections }) => {
    const existingProducts = await ctx.db.query('products').collect();
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
    const slugToTitleKey = new Map<string, string>();
    for (const s of sections) {
      slugToTitleKey.set(s.slug, s.titleKey);
      for (const item of s.items) {
        const categorySlug =
          'categorySlug' in item && typeof item.categorySlug === 'string'
            ? item.categorySlug
            : s.slug;
        const row = { ...item, categorySlug } as Record<string, string>;
        const kod = row.Kod ?? '';
        const existingImages = imagesByKod.get(kod);
        await ctx.db.insert('products', {
          Rodzaj: row.Rodzaj ?? '',
          JednostkaMiary: row.JednostkaMiary ?? row['Jednostka miary'] ?? '',
          StawkaVAT: row.StawkaVAT ?? row['Stawka VAT'] ?? '',
          Kod: kod,
          Nazwa: row.Nazwa ?? '',
          CenaNetto: row.CenaNetto ?? row['Cena netto'] ?? '',
          KodKlasyfikacji: row.KodKlasyfikacji ?? row['Kod klasyfikacji'] ?? '',
          Uwagi: row.Uwagi ?? '',
          OstatniaCenaZakupu:
            row.OstatniaCenaZakupu ?? row['Ostatnia cena zakupu'] ?? '',
          OstatniaDataZakupu:
            row.OstatniaDataZakupu ?? row['Ostatnia data zakupu'] ?? '',
          categorySlug,
          ...(existingImages?.imageStorageId && {
            imageStorageId: existingImages.imageStorageId,
          }),
          ...(existingImages?.thumbnailStorageId && {
            thumbnailStorageId: existingImages.thumbnailStorageId,
          }),
        });
      }
    }
    const existingCats = await ctx.db.query('categories').collect();
    for (const c of existingCats) {
      // Preserve admin-created categories (have displayName)
      if (c.displayName) continue;
      if (!slugToTitleKey.has(c.slug)) await ctx.db.delete(c._id);
    }
    for (const [slug, titleKey] of slugToTitleKey) {
      const existing = await ctx.db
        .query('categories')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, { titleKey });
      } else {
        await ctx.db.insert('categories', { slug, titleKey });
      }
    }
    return { ok: true, sectionsCount: sections.length };
  },
});

/** Seed categories from slug+titleKey list (run once or when rules change). */
export const setCategories = mutation({
  args: {
    categories: v.array(v.object({ slug: v.string(), titleKey: v.string() })),
  },
  handler: async (ctx, { categories: cats }) => {
    const existing = await ctx.db.query('categories').collect();
    for (const c of existing) {
      await ctx.db.delete(c._id);
    }
    for (const { slug, titleKey } of cats) {
      await ctx.db.insert('categories', { slug, titleKey });
    }
    return { ok: true, count: cats.length };
  },
});
