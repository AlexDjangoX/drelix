// Product category config for /products/[slug]. Aligned with catalogCategoryRules (23 categories).
// SEO: aim for title ≤ TITLE_IDEAL_MAX (60), description ≤ DESC_IDEAL_MAX (160) — see @/lib/seo.
import {
  CATEGORY_SLUGS,
  CATEGORY_TITLE_KEYS,
} from '@/components/products/catalogCategories';
import type { ProductItem, ProductSlug } from '@/lib/types/types';

export type { ProductItem, ProductSlug } from '@/lib/types/types';

export const PRODUCT_SLUGS: readonly ProductSlug[] = CATEGORY_SLUGS;

type MetadataEntry = { title: string; description: string };

const metadataBySlug: Record<ProductSlug, MetadataEntry> = {
  gloves: {
    title: 'Rękawice robocze i ochronne',
    description:
      'Profesjonalne rękawice robocze w Wadowicach. Skórzane, nitrylowe, antyprzecięciowe. Zgodne z EN 388, EN 407. Różne rozmiary. Drelix.',
  },
  wkladki: {
    title: 'Wkładki do obuwia',
    description:
      'Wkładki ortopedyczne do butów roboczych w Wadowicach. Antybakteryjne, amortyzujące, termoizolacyjne. Komfort dla stóp. Drelix.',
  },
  polbuty: {
    title: 'Półbuty robocze i ochronne',
    description:
      'Półbuty robocze w Wadowicach zgodne z EN ISO 20345. Podnosek stalowy, podeszwa antyprzebiją, klasy SB-S3. Drelix.',
  },
  trzewiki: {
    title: 'Trzewiki i obuwie bezpieczne',
    description:
      'Trzewiki robocze w Wadowicach zgodne z EN ISO 20345. Spawalnicze, budowlane, zimowe. Podnosek stalowy/kompozytowy. Drelix.',
  },
  sandaly: {
    title: 'Sandały i klapki robocze',
    description:
      'Sandały robocze w Wadowicach zgodne z EN ISO 20345 SB. Podnosek ochronny, przewiewne, antypoślizgowe. Drelix.',
  },
  kalosze: {
    title: 'Kalosze i gumowce',
    description:
      'Kalosze robocze w Wadowicach zgodne z EN ISO 20345 S5. Wodoodporne, podnosek stalowy, odporne na chemikalia. Drelix.',
  },
  caps: {
    title: 'Czapki i nakrycia głowy',
    description:
      'Czapki robocze, bejsbolówki, bandany w Wadowicach. Bawełniane, oddychające, z daszkiem. Ochrona przed słońcem. Drelix.',
  },
  aprons: {
    title: 'Fartuchy i zapaski',
    description:
      'Fartuchy robocze w Wadowicach. Spawalnicze, kuchenne, mięsne. Skórzane, bawełniane, wodoodporne. Różne rozmiary. Drelix.',
  },
  sweatshirts: {
    title: 'Bluzy robocze',
    description:
      'Bluzy robocze w Wadowicach. Z kapturem, rozpinane, polar-flisowe. Ciepłe, wygodne, trwałe. Różne kolory. Drelix.',
  },
  koszula: {
    title: 'Koszule robocze',
    description:
      'Koszule robocze w Wadowicach. Flanelowe, bawełniane, z krótkim/długim rękawem. W kratę i jednolite. Drelix.',
  },
  jackets: {
    title: 'Kurtki robocze',
    description:
      'Kurtki robocze w Wadowicach. Zimowe, softshellowe, przeciwwiatrowe. Wodoodporne, z odblaskami, kapturem. Drelix.',
  },
  polar: {
    title: 'Polary',
    description:
      'Polary robocze w Wadowicach. Fleece, z zamkiem, ciepłe. Różne gramatury i kolory. Idealne pod kurtkę. Drelix.',
  },
  spodnie: {
    title: 'Spodnie robocze i ochronne',
    description:
      'Spodnie robocze w Wadowicach. Ogrodniczki, bojówki, monterskie. Z kieszeniami, nakolannikami, wzmocnieniami. Drelix.',
  },
  vests: {
    title: 'Kamizelki odblaskowe',
    description:
      'Kamizelki odblaskowe w Wadowicach zgodne z EN ISO 20471. Klasy 1-3. Żółte, pomarańczowe. Maksymalna widoczność. Drelix.',
  },
  helmets: {
    title: 'Kaski i hełmy ochronne',
    description:
      'Kaski ochronne w Wadowicach zgodne z EN 397. Budowlane, przemysłowe, spawalnicze. Z wentylacją, regulacją. Drelix.',
  },
  eyewear: {
    title: 'Okulary i gogle ochronne',
    description:
      'Okulary ochronne w Wadowicach zgodne z EN 166. Przezroczyste, przyciemniane, spawalnicze. Gogle, przyłbice. Drelix.',
  },
  earProtection: {
    title: 'Ochrona słuchu',
    description:
      'Nauszniki i zatyczki przeciwhałasowe w Wadowicach zgodne z EN 352. Redukcja 20-35 dB. Pasywne, aktywne. Drelix.',
  },
  masks: {
    title: 'Maski i półmaski',
    description:
      'Maski ochronne w Wadowicach zgodne z EN 149, EN 140. FFP1, FFP2, FFP3. Półmaski z filtrami wymiennymi. Drelix.',
  },
  kneeProtection: {
    title: 'Nakolanniki',
    description:
      'Nakolanniki ochronne w Wadowicach zgodne z EN 14404. Piankowe, żelowe, twarde. Do prac płytkarskich, ogrodowych. Drelix.',
  },
  rainwear: {
    title: 'Odzież przeciwdeszczowa',
    description:
      'Odzież przeciwdeszczowa w Wadowicach. Płaszcze, kurtki, spodnie, komplety PCV. Wodoodporne, z kapturem, odblaskami. Drelix.',
  },
  firstAid: {
    title: 'Apteczki pierwszej pomocy',
    description:
      'Apteczki pierwszej pomocy w Wadowicach zgodne z przepisami BHP. Pełne wyposażenie. Małe, średnie, duże. Drelix.',
  },
  signage: {
    title: 'Znaki bezpieczeństwa',
    description:
      'Znaki BHP w Wadowicach zgodne z EN ISO 7010. Ostrzegawcze, nakazy, zakazy, ewakuacyjne. PCV, aluminium. Drelix.',
  },
  other: {
    title: 'Inne produkty BHP',
    description:
      'Inne produkty BHP w Wadowicach. Latarki, torby na narzędzia, szelki bezpieczeństwa, maty antyzmęczeniowe. Szeroki wybór. Drelix.',
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
