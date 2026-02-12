import type { Doc } from "../_generated/dataModel";

/** Shape for db.insert('products', ...) */
export type ProductInsert = {
  Rodzaj: string;
  JednostkaMiary: string;
  StawkaVAT: string;
  Kod: string;
  Nazwa: string;
  Opis?: string;
  ProductDescription?: string;
  CenaNetto: string;
  KodKlasyfikacji: string;
  Uwagi: string;
  OstatniaCenaZakupu: string;
  OstatniaDataZakupu: string;
  categorySlug: string;
  imageStorageId?: string;
  thumbnailStorageId?: string;
};

/** Product document from Convex. */
export type ProductDoc = Doc<"products">;

/** Catalog section with items (for UI and CSV replace). */
export type CatalogSection = {
  slug: string;
  titleKey: string;
  displayName?: string;
  items: Record<string, string>[];
};

/** Product item with image URLs (for display). */
export type ProductItem = Record<string, string>;

/** Product update result with explicit fields. */
export type ProductUpdateResult = {
  Rodzaj: string;
  JednostkaMiary: string;
  StawkaVAT: string;
  Kod: string;
  Nazwa: string;
  Opis?: string;
  ProductDescription?: string;
  CenaNetto: string;
  KodKlasyfikacji: string;
  Uwagi: string;
  OstatniaCenaZakupu: string;
  OstatniaDataZakupu: string;
  categorySlug: string;
  imageStorageId?: string;
  thumbnailStorageId?: string;
};

/** Image storage IDs preserved during catalog replace. */
export type ProductImageIds = {
  imageStorageId?: string;
  thumbnailStorageId?: string;
};

/** Standard success response for mutations. */
export type MutationSuccess = {
  ok: true;
  [key: string]: unknown;
};

/** Storage deletion result. */
export type StorageDeletionResult = {
  deleted: number;
  failed: number;
};
