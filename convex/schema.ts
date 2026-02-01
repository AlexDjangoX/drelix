import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Product row from Kartoteki (CSV) plus assigned category. */
const productFields = {
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
  categorySlug: v.string(),
  imageStorageId: v.optional(v.string()), // Large image (lightbox, hero)
  thumbnailStorageId: v.optional(v.string()), // Small image (grids, lists)
};

export default defineSchema({
  products: defineTable(productFields)
    .index("by_category", ["categorySlug"])
    .index("by_kod", ["Kod"]),

  categories: defineTable({
    slug: v.string(),
    titleKey: v.string(),
  }).index("by_slug", ["slug"]),
});
