import type { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from 'convex/_generated/api';
import { productConfig } from '@/components/products/productConfig';
import { BreadcrumbJsonLd } from '@/components/products';
import { getCanonicalBaseUrl } from '@/lib/seo';

const siteUrl = getCanonicalBaseUrl();

type Props = { params: Promise<{ slug: string }> };

/**
 * While building: force-dynamic so new images/catalog changes show in production
 * without redeploying. When the site is ready for the customer, remove this
 * and uncomment generateStaticParams below for better SEO (static pre-render).
 */
// export const dynamic = "force-dynamic";

// Uncomment when site is ready for customer (better SEO):
export async function generateStaticParams() {
  const slugs = await fetchQuery(api.catalog.listCategorySlugs);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = await fetchQuery(api.catalog.getCatalogSection, { slug });
  if (!section) return { title: 'Produkty | Drelix' };

  const config = productConfig[slug as keyof typeof productConfig];
  const title = config?.metadata.title ?? section.displayName ?? slug;
  const description = config?.metadata.description ?? '';

  const path = `/products/${slug}`;
  const canonical = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Drelix - Odzież Robocza i Ochronna',
      title: `${title} | Drelix`,
      description,
      locale: 'pl_PL',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Drelix`,
      description,
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = await fetchQuery(api.catalog.getCatalogSection, { slug });
  const config = productConfig[slug as keyof typeof productConfig];
  const name = config?.metadata.title ?? section?.displayName ?? slug;

  return (
    <>
      {section && <BreadcrumbJsonLd slug={slug} name={name} />}
      {children}
    </>
  );
}
