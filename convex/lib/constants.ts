/** Product field keys (single source of truth). Kartoteki CSV columns. */
export const PRODUCT_FIELD_KEYS = [
  'Rodzaj',
  'JednostkaMiary',
  'StawkaVAT',
  'Kod',
  'Nazwa',
  'Opis',
  'CenaNetto',
  'KodKlasyfikacji',
  'Uwagi',
  'OstatniaCenaZakupu',
  'OstatniaDataZakupu',
] as const;

export type ProductFieldKey = (typeof PRODUCT_FIELD_KEYS)[number];

/** Keys allowed in product update mutations. */
export const ALLOWED_UPDATE_KEYS = new Set([
  ...PRODUCT_FIELD_KEYS,
  'categorySlug',
  'imageStorageId',
  'thumbnailStorageId',
]);

/** Canonical key → alternate CSV column name (with spaces) for fallback lookup. */
export const CSV_ALT_BY_CANONICAL: Partial<Record<ProductFieldKey, string>> = {
  JednostkaMiary: 'Jednostka miary',
  StawkaVAT: 'Stawka VAT',
  CenaNetto: 'Cena netto',
  KodKlasyfikacji: 'Kod klasyfikacji',
  OstatniaCenaZakupu: 'Ostatnia cena zakupu',
  OstatniaDataZakupu: 'Ostatnia data zakupu',
};

/** Title key for admin-created categories. */
export const CUSTOM_CATEGORY_TITLE_KEY = 'products.catalogCustomCategory';

// --- Auth rate limiting ---

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 min lockout after max attempts
export const LOGIN_ATTEMPTS_CLEANUP_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// --- Pagination ---

export const DEFAULT_PAGE_SIZE = 100;
export const MAX_PAGE_SIZE = 500;
export const CATALOG_MEMORY_WARNING_THRESHOLD = 1000; // Warn when catalog operations exceed this count
