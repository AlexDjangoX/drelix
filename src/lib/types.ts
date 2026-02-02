/**
 * Shared app types. Re-exports data-driven slug type; defines catalog, image, and product types.
 */
import type { CategorySlug } from '@/lib/catalog/catalogCategories';

export type { CategorySlug };

export type CatalogRow = Record<string, string>;

export type CategoryRule = {
  slug: string;
  titleKey: string;
  keywords?: string[];
  kodPrefixes?: string[];
  /** Exact Kod values that always match this category (overrides keyword/prefix scoring). */
  exactKods?: string[];
};

export type CatalogSection = {
  slug: string;
  titleKey: string;
  displayName?: string;
  items: CatalogRow[];
};

export type ImageVariants = {
  thumbnail: { base64: string; filename: string };
  large: { base64: string; filename: string };
};

export type ProductSlug = CategorySlug;

export type ProductItem = {
  id: string;
  src: string;
  largeSrc: string;
  name: string;
  price?: string;
  unit?: string;
};

/** Admin product table column config (label + field key). */
export const DISPLAY_KEYS = [
  { label: 'Kod', key: 'Kod' },
  { label: 'Nazwa', key: 'Nazwa' },
  { label: 'Cena netto', key: 'CenaNetto' },
  { label: 'Jednostka miary', key: 'JednostkaMiary' },
  { label: 'Stawka VAT', key: 'StawkaVAT' },
] as const;
