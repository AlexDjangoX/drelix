import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { productFieldValidators } from "./lib/validators";

/** Product row from Kartoteki (CSV) plus assigned category. */
const productFields = {
  ...productFieldValidators,
  categorySlug: v.string(),
  imageStorageId: v.optional(v.string()), // Large image (lightbox, hero)
  thumbnailStorageId: v.optional(v.string()), // Small image (grids, lists)
};

/** Rate limiting for admin login. Key = hashed IP, cleaned periodically. */
const loginAttemptsTable = defineTable({
  key: v.string(),
  attempts: v.number(),
  lastAttemptAt: v.number(),
})
  .index("by_key", ["key"])
  .index("by_lastAttemptAt", ["lastAttemptAt"]);

export default defineSchema({
  loginAttempts: loginAttemptsTable,

  products: defineTable(productFields)
    .index("by_category", ["categorySlug"])
    .index("by_kod", ["Kod"]),

  categories: defineTable({
    slug: v.string(),
    titleKey: v.string(),
    displayName: v.optional(v.string()), // Custom name for admin-created categories
    createdAt: v.optional(v.number()), // Timestamp; admin-created categories get this, sorted to top
  }).index("by_slug", ["slug"]),
});
