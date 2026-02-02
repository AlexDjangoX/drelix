import {
  PRODUCT_SLUGS,
  productConfig,
} from '@/components/products/productConfig';
import { getCanonicalBaseUrl } from '@/lib/seo/seo';

const siteUrl = getCanonicalBaseUrl();
const catalogTitle = 'Katalog produktów';
const catalogDescription =
  'Pełna oferta odzieży roboczej i ochronnej. Rękawice, obuwie, spodnie, koszule i inne artykuły BHP. Drelix Wadowice.';

export function ProductsCatalogJsonLd() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: catalogTitle,
    description: catalogDescription,
    numberOfItems: PRODUCT_SLUGS.length,
    itemListElement: PRODUCT_SLUGS.map((slug, index) => {
      const config = productConfig[slug as keyof typeof productConfig];
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: config?.metadata.title ?? slug,
        url: `${siteUrl}/products/${slug}`,
      };
    }),
  };
  const json = JSON.stringify(itemListSchema).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
