import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Product row from Kartoteki (CSV) plus assigned category. */
const productFields = {
  Rodzaj: v.string(),
  "Jednostka miary": v.string(),
  "Stawka VAT": v.string(),
  Kod: v.string(),
  Nazwa: v.string(),
  "Cena netto": v.string(),
  "Kod klasyfikacji": v.string(),
  Uwagi: v.string(),
  "Ostatnia cena zakupu": v.string(),
  "Ostatnia data zakupu": v.string(),
  categorySlug: v.string(),
  imageStorageId: v.optional(v.string()), // Store the storageId from Convex
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
