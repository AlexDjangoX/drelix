/**
 * Catalog categories: slug, translation key, and keywords to match on Nazwa (and optionally Kod).
 * First matching category wins. Order here is the display order.
 */

import type { KartotekaRow } from './kartoteki';

export type CatalogCategorySlug =
  | 'gloves'
  | 'footwear'
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

export type CatalogCategoryConfig = {
  slug: CatalogCategorySlug;
  /** Translation key for section title (productNames.* or products.catalogOther) */
  titleKey: string;
  /** Keywords to match in Nazwa (uppercase). Product is in this category if any keyword is contained. */
  keywords: string[];
  /** If set, product is in this category when Kod starts with one of these prefixes. */
  kodPrefixes?: string[];
};

const NAZWA = 'Nazwa' as const;
const KOD = 'Kod' as const;

/** Display order and matching rules. First match wins. */
export const CATALOG_CATEGORIES: CatalogCategoryConfig[] = [
  {
    slug: 'gloves',
    titleKey: 'productNames.gloves',
    keywords: ['RĘKAWICE', 'REKAWICE'],
    kodPrefixes: ['R-'],
  },
  {
    slug: 'footwear',
    titleKey: 'productNames.footwear',
    keywords: ['BUTY', 'OBUWIE', 'KALOSZE', 'KALOSZ', 'PÓŁBUT', 'TRZEWIK', 'GUMOFILCE', 'TRAMPKI'],
  },
  {
    slug: 'spodnie',
    titleKey: 'productNames.clothing',
    keywords: ['SPODNIE', 'OGRODNICZKI'],
  },
  {
    slug: 'vests',
    titleKey: 'productNames.vests',
    keywords: ['ODBLASKOWA', 'ODBLASKOWY'],
  },
  {
    slug: 'koszula',
    titleKey: 'productNames.koszula',
    keywords: [
      'KOSZULA', 'KOSZULE', 'BLUZA', 'KURTKA', 'FARTUCH', 'KAMIZELKA', 'POLAR', 'PŁASZCZ',
      'CZAPKA', 'ZAPASKA', 'KOMBINEZON', 'PODKOSZULEK', 'BEZRĘKAWNIK', 'UBRANIE', 'LHHCL',
    ],
  },
  {
    slug: 'helmets',
    titleKey: 'productNames.helmets',
    keywords: ['KASK', 'HEŁM', 'HELM'],
  },
  {
    slug: 'eyewear',
    titleKey: 'productNames.eyewear',
    keywords: ['OKULARY'],
  },
  {
    slug: 'earProtection',
    titleKey: 'productNames.earProtection',
    keywords: ['NAUSZNIKI', 'ZATYCZKI', 'SŁUCH', 'przeciw hałasowe'],
  },
  {
    slug: 'masks',
    titleKey: 'productNames.masks',
    keywords: ['MASKA', 'PÓŁMASK', 'WKŁADY DO MASEK', 'PRZECIWGAZOWYCH', 'WŁADY POCHŁANIAJĄCE'],
  },
  {
    slug: 'kneeProtection',
    titleKey: 'productNames.kneeProtection',
    keywords: ['NAKOLANNIKI', 'NAKOLANNIK'],
  },
  {
    slug: 'rainwear',
    titleKey: 'productNames.rainwear',
    keywords: ['PRZECIWDESZCZOWY', 'PRZECIWDESZCZOWA', 'KOMPLET PCV', 'PCV PRZECIWDESZCZOWY'],
  },
  {
    slug: 'firstAid',
    titleKey: 'productNames.firstAid',
    keywords: ['APTECZKA'],
  },
  {
    slug: 'signage',
    titleKey: 'productNames.signage',
    keywords: ['ZNAK BEZPIECZEŃSTWA'],
  },
  {
    slug: 'other',
    titleKey: 'products.catalogOther',
    keywords: [],
  },
];

function matchesCategory(row: KartotekaRow, config: CatalogCategoryConfig): boolean {
  const nazwaUpper = (row[NAZWA] ?? '').toUpperCase();
  const kod = (row[KOD] ?? '').toUpperCase();

  if (config.keywords.length > 0) {
    for (const kw of config.keywords) {
      if (nazwaUpper.includes(kw.toUpperCase())) return true;
    }
  }
  if (config.kodPrefixes?.length) {
    for (const prefix of config.kodPrefixes) {
      if (kod.startsWith(prefix.toUpperCase())) return true;
    }
  }
  return config.slug === 'other';
}

export function getCategoryForProduct(row: KartotekaRow): CatalogCategorySlug {
  for (const config of CATALOG_CATEGORIES) {
    if (matchesCategory(row, config)) return config.slug;
  }
  return 'other';
}

export type CatalogSection = {
  slug: CatalogCategorySlug;
  titleKey: string;
  items: KartotekaRow[];
};

export function getCatalogGroupedByCategory(items: readonly KartotekaRow[]): CatalogSection[] {
  const bySlug = new Map<CatalogCategorySlug, KartotekaRow[]>();

  for (const config of CATALOG_CATEGORIES) {
    bySlug.set(config.slug, []);
  }

  for (const row of items) {
    const slug = getCategoryForProduct(row);
    bySlug.get(slug)!.push(row);
  }

  return CATALOG_CATEGORIES
    .map((config) => ({
      slug: config.slug,
      titleKey: config.titleKey,
      items: bySlug.get(config.slug) ?? [],
    }))
    .filter((section) => section.items.length > 0);
}
