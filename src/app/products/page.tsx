import type { Metadata } from 'next';
import ProductsCatalogClient from '@/components/products/ProductsCatalogClient';
import { PRODUCT_SLUGS, productConfig } from '@/components/products/productConfig';
import { getCanonicalBaseUrl } from '@/lib/seo';

const siteUrl = getCanonicalBaseUrl();

export const dynamic = 'force-dynamic';

const catalogTitle = 'Katalog produktów';
const catalogDescription =
  'Pełna oferta odzieży roboczej i ochronnej. Rękawice, obuwie, spodnie, koszule i inne artykuły BHP. Drelix Wadowice.';

export const metadata: Metadata = {
  title: catalogTitle,
  description: catalogDescription,
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/products`,
    siteName: 'Drelix - Odzież Robocza i Ochronna',
    title: `${catalogTitle} | Drelix`,
    description: catalogDescription,
    locale: 'pl_PL',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: catalogTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${catalogTitle} | Drelix`,
    description: catalogDescription,
  },
};

function CatalogItemListJsonLd() {
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

export default function ProductsCatalogPage() {
  return (
    <>
      <CatalogItemListJsonLd />
      <ProductsCatalogClient />
    </>
  );
}
