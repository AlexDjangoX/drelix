// Product category config for /products/[slug]. Aligned with catalogCategoryRules (23 categories).
import {
  CATEGORY_SLUGS,
  CATEGORY_TITLE_KEYS,
  type CategorySlug,
} from '@/data/catalogCategories';

export type ProductSlug = CategorySlug;

export const PRODUCT_SLUGS: readonly ProductSlug[] = CATEGORY_SLUGS;

export type ProductItem = {
  id: string;
  src: string;
  name: string;
  price?: string;
  unit?: string;
};

type MetadataEntry = { title: string; description: string };

const metadataBySlug: Record<ProductSlug, MetadataEntry> = {
  gloves: {
    title: 'Rękawice robocze i ochronne',
    description: 'Katalog rękawic roboczych i ochronnych. Różne modele i zastosowania. Drelix Wadowice.',
  },
  wkladki: {
    title: 'Wkładki do obuwia',
    description: 'Wkładki do butów roboczych i ochronnych. Drelix Wadowice.',
  },
  polbuty: {
    title: 'Półbuty robocze i ochronne',
    description: 'Katalog półbutów roboczych i ochronnych. Drelix Wadowice.',
  },
  trzewiki: {
    title: 'Trzewiki i obuwie bezpieczne',
    description: 'Trzewiki robocze, spawalnicze, obuwie bezpieczne. Drelix Wadowice.',
  },
  sandaly: {
    title: 'Sandały i klapki robocze',
    description: 'Sandały robocze, klapki. Drelix Wadowice.',
  },
  kalosze: {
    title: 'Kalosze i gumowce',
    description: 'Kalosze robocze, gumowce. Drelix Wadowice.',
  },
  caps: {
    title: 'Czapki i nakrycia głowy',
    description: 'Czapki robocze, bejsbolówki. Drelix Wadowice.',
  },
  aprons: {
    title: 'Fartuchy i zapaski',
    description: 'Fartuchy robocze, zapaski. Drelix Wadowice.',
  },
  sweatshirts: {
    title: 'Bluzy robocze',
    description: 'Bluzy robocze i odzież. Drelix Wadowice.',
  },
  koszula: {
    title: 'Koszule robocze',
    description: 'Katalog koszul roboczych. Różne modele i zastosowania. Drelix Wadowice.',
  },
  jackets: {
    title: 'Kurtki robocze',
    description: 'Kurtki, wiatrówki robocze. Drelix Wadowice.',
  },
  polar: {
    title: 'Polary',
    description: 'Polary robocze. Drelix Wadowice.',
  },
  spodnie: {
    title: 'Spodnie robocze i ochronne',
    description: 'Katalog spodni roboczych i ochronnych. Ogrzebniczki, bojówki. Drelix Wadowice.',
  },
  vests: {
    title: 'Kamizelki odblaskowe',
    description: 'Kamizelki odblaskowe, bezrękawne. Drelix Wadowice.',
  },
  helmets: {
    title: 'Kaski i hełmy ochronne',
    description: 'Kaski ochronne, hełmy. Drelix Wadowice.',
  },
  eyewear: {
    title: 'Okulary i gogle ochronne',
    description: 'Okulary ochronne, gogle, przyłbice. Drelix Wadowice.',
  },
  earProtection: {
    title: 'Ochrona słuchu',
    description: 'Nauszniki, zatyczki przeciwsłuchowe. Drelix Wadowice.',
  },
  masks: {
    title: 'Maski i półmaski',
    description: 'Maski ochronne, półmaski, wkłady. Drelix Wadowice.',
  },
  kneeProtection: {
    title: 'Nakolanniki',
    description: 'Nakolanniki ochronne. Drelix Wadowice.',
  },
  rainwear: {
    title: 'Odzież przeciwdeszczowa',
    description: 'Odzież przeciwdeszczowa, płaszcze, komplety PCV. Drelix Wadowice.',
  },
  firstAid: {
    title: 'Apteczki pierwszej pomocy',
    description: 'Apteczki pierwszej pomocy. Drelix Wadowice.',
  },
  signage: {
    title: 'Znaki bezpieczeństwa',
    description: 'Znaki bezpieczeństwa BHP. Drelix Wadowice.',
  },
  other: {
    title: 'Inne produkty BHP',
    description: 'Pozostałe produkty BHP i robocze. Drelix Wadowice.',
  },
};

export function getProductItems(): readonly ProductItem[] {
  return [];
}

export const productConfig: Record<
  ProductSlug,
  { titleKey: string; metadata: MetadataEntry }
> = Object.fromEntries(
  PRODUCT_SLUGS.map((slug) => [
    slug,
    {
      titleKey: CATEGORY_TITLE_KEYS[slug],
      metadata: metadataBySlug[slug],
    },
  ])
) as Record<ProductSlug, { titleKey: string; metadata: MetadataEntry }>;
