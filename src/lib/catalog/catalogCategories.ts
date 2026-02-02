/**
 * Category slugs and titleKeys aligned with public/catalogCategoryRules.json.
 * Used for homepage cards, product pages, and sitemap.
 */
export const CATEGORY_SLUGS = [
  'gloves',
  'wkladki',
  'polbuty',
  'trzewiki',
  'sandaly',
  'kalosze',
  'caps',
  'aprons',
  'sweatshirts',
  'koszula',
  'jackets',
  'polar',
  'spodnie',
  'vests',
  'helmets',
  'eyewear',
  'earProtection',
  'masks',
  'kneeProtection',
  'rainwear',
  'firstAid',
  'signage',
  'other',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_TITLE_KEYS: Record<CategorySlug, string> = {
  gloves: 'productNames.gloves',
  wkladki: 'productNames.wkladki',
  polbuty: 'productNames.polbuty',
  trzewiki: 'productNames.trzewiki',
  sandaly: 'productNames.sandaly',
  kalosze: 'productNames.kalosze',
  caps: 'productNames.caps',
  aprons: 'productNames.aprons',
  sweatshirts: 'productNames.sweatshirts',
  koszula: 'productNames.koszula',
  jackets: 'productNames.jackets',
  polar: 'productNames.polar',
  spodnie: 'productNames.clothing',
  vests: 'productNames.vests',
  helmets: 'productNames.helmets',
  eyewear: 'productNames.eyewear',
  earProtection: 'productNames.earProtection',
  masks: 'productNames.masks',
  kneeProtection: 'productNames.kneeProtection',
  rainwear: 'productNames.rainwear',
  firstAid: 'productNames.firstAid',
  signage: 'productNames.signage',
  other: 'products.catalogOther',
};
