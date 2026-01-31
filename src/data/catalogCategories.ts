/**
 * Catalog category types. Category rules live in public/catalogCategoryRules.json (admin CSV).
 * Catalog data lives in Convex.
 */

/** Product row shape (Kartoteki CSV columns). */
export type KartotekaRow = {
  Rodzaj: string;
  'Jednostka miary': string;
  'Stawka VAT': string;
  Kod: string;
  Nazwa: string;
  'Cena netto': string;
  'Kod klasyfikacji': string;
  Uwagi: string;
  'Ostatnia cena zakupu': string;
  'Ostatnia data zakupu': string;
};

export type CatalogCategorySlug =
  | 'gloves'
  | 'polbuty'
  | 'trzewiki'
  | 'sandaly'
  | 'kalosze'
  | 'spodnie'
  | 'vests'
  | 'koszula'
  | 'helmets'
  | 'eyewear'
  | 'earProtection'
  | 'masks'
  | 'kneeProtection'
  | 'rainwear'
  | 'firstAid'
  | 'signage'
  | 'other';

/** Product row with optional image path. */
export type CatalogProduct = KartotekaRow & { image?: string };

export type CatalogSection = {
  slug: CatalogCategorySlug;
  titleKey: string;
  items: CatalogProduct[];
};
