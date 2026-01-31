import { GLOVES } from '@/data/gloves';
import { BOOTS } from '@/data/boots';
import { SPODNIE } from '@/data/spodnie';
import { KOSZULA } from '@/data/koszula';

export type ProductSlug = 'gloves' | 'boots' | 'spodnie' | 'koszula';

export const PRODUCT_SLUGS: ProductSlug[] = ['gloves', 'boots', 'spodnie', 'koszula'];

export type ProductItem = { id: string; src: string; name: string };

const productData: Record<ProductSlug, readonly ProductItem[]> = {
  gloves: GLOVES,
  boots: BOOTS,
  spodnie: SPODNIE,
  koszula: KOSZULA,
};

export function getProductItems(slug: ProductSlug): readonly ProductItem[] {
  return productData[slug] ?? [];
}

export const productConfig: Record<
  ProductSlug,
  { titleKey: 'productNames.gloves' | 'productNames.footwear' | 'productNames.clothing' | 'productNames.koszula'; metadata: { title: string; description: string } }
> = {
  gloves: {
    titleKey: 'productNames.gloves',
    metadata: {
      title: 'Rękawice robocze i ochronne',
      description: 'Katalog rękawic roboczych i ochronnych. Różne modele i zastosowania. Drelix Wadowice.',
    },
  },
  boots: {
    titleKey: 'productNames.footwear',
    metadata: {
      title: 'Obuwie ochronne i robocze',
      description: 'Katalog obuwia ochronnego i roboczego. Różne modele i zastosowania. Drelix Wadowice.',
    },
  },
  spodnie: {
    titleKey: 'productNames.clothing',
    metadata: {
      title: 'Spodnie robocze i ochronne',
      description: 'Katalog spodni roboczych i ochronnych. Różne modele i zastosowania. Drelix Wadowice.',
    },
  },
  koszula: {
    titleKey: 'productNames.koszula',
    metadata: {
      title: 'Koszule robocze',
      description: 'Katalog koszul roboczych. Różne modele i zastosowania. Drelix Wadowice.',
    },
  },
};
