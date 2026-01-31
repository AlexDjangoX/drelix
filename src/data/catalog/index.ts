/**
 * Catalog data loader. Reads generated JSON from scripts/split-catalog-by-category.mjs.
 * Image path by convention: public/{categorySlug}/{Kod}.jpg (e.g. public/gloves/R-BAW.jpg).
 * Individual pages can import getCatalogBySlug(slug) or a specific file, e.g. gloves.json.
 */

import type { KartotekaRow } from '@/data/kartoteki';
import type { CatalogCategorySlug, CatalogSection } from '@/data/catalogCategories';

import categoriesMeta from './categories.json';
import gloves from './gloves.json';
import polbuty from './polbuty.json';
import trzewiki from './trzewiki.json';
import sandaly from './sandaly.json';
import kalosze from './kalosze.json';
import spodnie from './spodnie.json';
import vests from './vests.json';
import koszula from './koszula.json';
import helmets from './helmets.json';
import eyewear from './eyewear.json';
import earProtection from './earProtection.json';
import masks from './masks.json';
import kneeProtection from './kneeProtection.json';
import rainwear from './rainwear.json';
import firstAid from './firstAid.json';
import signage from './signage.json';
import other from './other.json';

const BY_SLUG: Record<CatalogCategorySlug, readonly KartotekaRow[]> = {
  gloves: gloves as KartotekaRow[],
  polbuty: polbuty as KartotekaRow[],
  trzewiki: trzewiki as KartotekaRow[],
  sandaly: sandaly as KartotekaRow[],
  kalosze: kalosze as KartotekaRow[],
  spodnie: spodnie as KartotekaRow[],
  vests: vests as KartotekaRow[],
  koszula: koszula as KartotekaRow[],
  helmets: helmets as KartotekaRow[],
  eyewear: eyewear as KartotekaRow[],
  earProtection: earProtection as KartotekaRow[],
  masks: masks as KartotekaRow[],
  kneeProtection: kneeProtection as KartotekaRow[],
  rainwear: rainwear as KartotekaRow[],
  firstAid: firstAid as KartotekaRow[],
  signage: signage as KartotekaRow[],
  other: other as KartotekaRow[],
};

export type CatalogCategoryMeta = { slug: string; titleKey: string };

const categories = categoriesMeta as CatalogCategoryMeta[];

export function getCategories(): readonly CatalogCategoryMeta[] {
  return categories;
}

export function getCatalogBySlug(slug: CatalogCategorySlug): readonly KartotekaRow[] {
  return BY_SLUG[slug] ?? [];
}

const COD = 'Kod' as const;

export function getCatalogGroupedByCategory(): CatalogSection[] {
  return categories
    .map(({ slug, titleKey }) => {
      const rows = BY_SLUG[slug as CatalogCategorySlug] ?? [];
      const items = rows.map((row) => ({
        ...row,
        image: `/${slug}/${row[COD]}.jpg`,
      }));
      return { slug: slug as CatalogCategorySlug, titleKey, items };
    })
    .filter((section) => section.items.length > 0);
}
