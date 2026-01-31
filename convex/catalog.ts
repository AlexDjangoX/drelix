import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

/** List catalog grouped by category (for admin and public). */
export const listCatalogSections = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").order("asc").collect();
    const sections: { slug: string; titleKey: string; items: Record<string, string>[] }[] = [];
    for (const cat of categories) {
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categorySlug", cat.slug))
        .collect();
      const items = await Promise.all(products.map(async (p) => {
        const { _id, _creationTime, categorySlug, imageStorageId, ...rest } = p;
        const imageUrl = imageStorageId ? await ctx.storage.getUrl(imageStorageId) : null;
        return { 
          ...rest, 
          imageStorageId: imageStorageId ?? "", 
          imageUrl: imageUrl ?? "" 
        } as Record<string, string>;
      }));
      if (items.length > 0) {
        sections.push({ slug: cat.slug, titleKey: cat.titleKey, items });
      }
    }
    return sections;
  },
});

/** List categories only (for nav / dropdowns). */
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("categories").order("asc").collect();
  },
});

/** Get one category's products (for /products/[slug] when migrated from placeholder). */
export const getCatalogSection = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const cat = await ctx.db.query("categories").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    if (!cat) return null;
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categorySlug", slug))
      .collect();
    const items = await Promise.all(products.map(async (p) => {
      const { _id, _creationTime, categorySlug, imageStorageId, ...rest } = p;
      const imageUrl = imageStorageId ? await ctx.storage.getUrl(imageStorageId) : null;
      return { 
        ...rest, 
        imageStorageId: imageStorageId ?? "", 
        imageUrl: imageUrl ?? "" 
      } as Record<string, string>;
    }));
    return { slug: cat.slug, titleKey: cat.titleKey, items };
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
      .query("products")
      .withIndex("by_kod", (q) => q.eq("Kod", kod))
      .unique();
    if (!product) throw new Error(`Product not found: ${kod}`);
    const allowedKeys = new Set([
      "Rodzaj", "JednostkaMiary", "StawkaVAT", "Kod", "Nazwa",
      "CenaNetto", "KodKlasyfikacji", "Uwagi", "OstatniaCenaZakupu", "OstatniaDataZakupu", "categorySlug", "imageStorageId"
    ]);
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (allowedKeys.has(k) && typeof v === "string") patch[k] = v;
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

/** Update a product's image storage ID. */
export const updateProductImage = mutation({
  args: {
    kod: v.string(),
    storageId: v.string(),
  },
  handler: async (ctx, { kod, storageId }) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_kod", (q) => q.eq("Kod", kod))
      .unique();
    if (!product) throw new Error(`Product not found: ${kod}`);
    
    // Delete old image if it exists
    if (product.imageStorageId) {
      await ctx.storage.delete(product.imageStorageId);
    }
    
    await ctx.db.patch(product._id, { imageStorageId: storageId });
    return { ok: true };
  },
});

const productRowValidator = v.object(productFieldValidators);

/** Create one product (admin "Add product"). */
export const createProduct = mutation({
  args: {
    categorySlug: v.string(),
    row: productRowValidator,
  },
  handler: async (ctx, { categorySlug, row }) => {
    const kod = row.Kod ?? "";
    const existing = await ctx.db.query("products").withIndex("by_kod", (q) => q.eq("Kod", kod)).unique();
    if (existing) throw new Error(`Product with Kod ${kod} already exists`);
    await ctx.db.patch(product._id, {
      Rodzaj: row.Rodzaj ?? "",
      JednostkaMiary: row.JednostkaMiary ?? row["Jednostka miary"] ?? "",
      StawkaVAT: row.StawkaVAT ?? row["Stawka VAT"] ?? "",
      Kod: row.Kod ?? "",
      Nazwa: row.Nazwa ?? "",
      CenaNetto: row.CenaNetto ?? row["Cena netto"] ?? "",
      KodKlasyfikacji: row.KodKlasyfikacji ?? row["Kod klasyfikacji"] ?? "",
      Uwagi: row.Uwagi ?? "",
      OstatniaCenaZakupu: row.OstatniaCenaZakupu ?? row["Ostatnia cena zakupu"] ?? "",
      OstatniaDataZakupu: row.OstatniaDataZakupu ?? row["Ostatnia data zakupu"] ?? "",
      categorySlug,
    });
    return { ok: true, kod };
  },
});

/** Delete one product by Kod (admin row delete). */
export const deleteProduct = mutation({
  args: { kod: v.string() },
  handler: async (ctx, { kod }) => {
    const product = await ctx.db.query("products").withIndex("by_kod", (q) => q.eq("Kod", kod)).unique();
    if (!product) throw new Error(`Product not found: ${kod}`);
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
    const existingProducts = await ctx.db.query("products").collect();
    for (const p of existingProducts) {
      await ctx.db.delete(p._id);
    }
    const slugToTitleKey = new Map<string, string>();
    for (const s of sections) {
      slugToTitleKey.set(s.slug, s.titleKey);
      for (const item of s.items) {
        const categorySlug = "categorySlug" in item && typeof item.categorySlug === "string"
          ? item.categorySlug
          : s.slug;
        const row = { ...item, categorySlug } as Record<string, string>;
        await ctx.db.insert("products", {
          Rodzaj: row.Rodzaj ?? "",
          JednostkaMiary: row.JednostkaMiary ?? row["Jednostka miary"] ?? "",
          StawkaVAT: row.StawkaVAT ?? row["Stawka VAT"] ?? "",
          Kod: row.Kod ?? "",
          Nazwa: row.Nazwa ?? "",
          CenaNetto: row.CenaNetto ?? row["Cena netto"] ?? "",
          KodKlasyfikacji: row.KodKlasyfikacji ?? row["Kod klasyfikacji"] ?? "",
          Uwagi: row.Uwagi ?? "",
          OstatniaCenaZakupu: row.OstatniaCenaZakupu ?? row["Ostatnia cena zakupu"] ?? "",
          OstatniaDataZakupu: row.OstatniaDataZakupu ?? row["Ostatnia data zakupu"] ?? "",
          categorySlug,
        });
      }
    }
    const existingCats = await ctx.db.query("categories").collect();
    for (const c of existingCats) {
      if (!slugToTitleKey.has(c.slug)) await ctx.db.delete(c._id);
    }
    for (const [slug, titleKey] of slugToTitleKey) {
      const existing = await ctx.db.query("categories").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
      if (existing) {
        await ctx.db.patch(existing._id, { titleKey });
      } else {
        await ctx.db.insert("categories", { slug, titleKey });
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
    const existing = await ctx.db.query("categories").collect();
    for (const c of existing) {
      await ctx.db.delete(c._id);
    }
    for (const { slug, titleKey } of cats) {
      await ctx.db.insert("categories", { slug, titleKey });
    }
    return { ok: true, count: cats.length };
  },
});
