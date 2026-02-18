import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { productFieldValidators } from "./lib/validators";

/** One image slot: large + optional thumbnail storage IDs. */
const imageEntryValidator = v.object({
  imageStorageId: v.string(),
  thumbnailStorageId: v.optional(v.string()),
});

/** Product row from Kartoteki (CSV) plus assigned category. */
const productFields = {
  ...productFieldValidators,
  categorySlug: v.string(),
  /** Optional subcategory within the category (references subcategories table by slug). */
  subcategorySlug: v.optional(v.string()),
  imageStorageId: v.optional(v.string()), // Legacy: single large image
  thumbnailStorageId: v.optional(v.string()), // Legacy: single thumbnail
  /** Multiple images per product. When set, preferred over legacy single image. */
  imageEntries: v.optional(v.array(imageEntryValidator)),
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

  /** Subcategories within a category (e.g. gloves → podgumowane, gumowe). Slug unique per category. */
  subcategories: defineTable({
    categorySlug: v.string(),
    slug: v.string(),
    displayName: v.string(),
    order: v.optional(v.number()), // For dropdown and section order
    createdAt: v.optional(v.number()),
  })
    .index("by_category", ["categorySlug"])
    .index("by_category_slug", ["categorySlug", "slug"]),
});
