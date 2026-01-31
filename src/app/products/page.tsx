import type { Metadata } from 'next';
import { getCatalog } from '@/data/kartoteki';
import { getCatalogGroupedByCategory } from '@/data/catalogCategories';
import CatalogClient from './CatalogClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';

export const dynamic = 'force-static';
export const revalidate = false;

const catalogTitle = 'Katalog produktów';
const catalogDescription = 'Pełna oferta odzieży roboczej i ochronnej. Rękawice, obuwie, spodnie, koszule i inne artykuły BHP. Drelix Wadowice.';

export const metadata: Metadata = {
  title: catalogTitle,
  description: catalogDescription,
  alternates: { canonical: `${siteUrl}/products` },
  openGraph: {
    url: `${siteUrl}/products`,
    title: `${catalogTitle} | Drelix`,
    description: catalogDescription,
  },
  twitter: { card: 'summary_large_image', title: `${catalogTitle} | Drelix` },
};

export default function ProductsCatalogPage() {
  const items = getCatalog();
  const sections = getCatalogGroupedByCategory(items);
  return <CatalogClient sections={sections} totalCount={items.length} />;
}
