import { fetchQuery } from 'convex/nextjs';
import { api } from 'convex/_generated/api';
import { productConfig } from '@/components/products/productConfig';
import { getCanonicalBaseUrl } from '@/lib/seo';

const siteUrl = getCanonicalBaseUrl();
const catalogTitle = 'Katalog produktów';
const catalogDescription =
  'Pełna oferta odzieży roboczej i ochronnej. Rękawice, obuwie, spodnie, koszule i inne artykuły BHP. Drelix Wadowice.';

export async function ProductsCatalogJsonLd() {
  const sections = await fetchQuery(api.catalog.listCatalogSections);
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: catalogTitle,
    description: catalogDescription,
    numberOfItems: sections.length,
    itemListElement: sections.map((section, index) => {
      const config = productConfig[section.slug as keyof typeof productConfig];
      const name =
        section.displayName ?? config?.metadata.title ?? section.slug;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        url: `${siteUrl}/products/${section.slug}`,
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
