/** Product field keys (single source of truth). Kartoteki CSV columns + display fields. */
export const PRODUCT_FIELD_KEYS = [
  "Rodzaj",
  "JednostkaMiary",
  "StawkaVAT",
  "Kod",
  "Nazwa",
  "Opis",
  "ProductDescription",
  "CenaNetto",
  "KodKlasyfikacji",
  "Uwagi",
  "OstatniaCenaZakupu",
  "OstatniaDataZakupu",
  "Heading",
  "Subheading",
  "Description",
] as const;

export type ProductFieldKey = (typeof PRODUCT_FIELD_KEYS)[number];

/** Keys allowed in product update mutations. */
export const ALLOWED_UPDATE_KEYS = new Set([
  ...PRODUCT_FIELD_KEYS,
  "categorySlug",
  "subcategorySlug",
  "imageStorageId",
  "thumbnailStorageId",
]);

/** Canonical key → alternate CSV column name (with spaces / locale) for fallback lookup. */
export const CSV_ALT_BY_CANONICAL: Partial<Record<ProductFieldKey, string>> = {
  JednostkaMiary: "Jednostka miary",
  StawkaVAT: "Stawka VAT",
  CenaNetto: "Cena netto",
  KodKlasyfikacji: "Kod klasyfikacji",
  OstatniaCenaZakupu: "Ostatnia cena zakupu",
  OstatniaDataZakupu: "Ostatnia data zakupu",
  /** CSV/Kartoteki often uses "Opis" for long description; map to Description for display. */
  Description: "Opis",
};

/** Title key for admin-created categories. */
export const CUSTOM_CATEGORY_TITLE_KEY = "products.catalogCustomCategory";

/**
 * Catalog order (single source of truth for wording):
 * subcategory (by order) → first image height (tallest first) → Nazwa.
 * Used by getCatalogSection, listCatalogSections, and admin "Update catalog order".
 */

// --- Auth rate limiting ---

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 min lockout after max attempts
export const LOGIN_ATTEMPTS_CLEANUP_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// --- Pagination ---

export const DEFAULT_PAGE_SIZE = 100;
export const MAX_PAGE_SIZE = 500;
export const CATALOG_MEMORY_WARNING_THRESHOLD = 1000; // Warn when catalog operations exceed this count
