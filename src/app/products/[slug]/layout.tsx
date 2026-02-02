import type { Metadata } from 'next';
import {
  PRODUCT_SLUGS,
  productConfig,
} from '@/components/products/productConfig';
import { BreadcrumbJsonLd } from '@/components/products/BreadcrumbJsonLd';
import { getCanonicalBaseUrl } from '@/lib/seo';

const siteUrl = getCanonicalBaseUrl();

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = PRODUCT_SLUGS.includes(slug as (typeof PRODUCT_SLUGS)[number])
    ? productConfig[slug as keyof typeof productConfig]
    : null;
  if (!config) return { title: 'Produkty | Drelix' };

  const path = `/products/${slug}`;
  const canonical = `${siteUrl}${path}`;
  const { title, description } = config.metadata;

  return {
    title: config.metadata.title,
    description: config.metadata.description,
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
  const config = PRODUCT_SLUGS.includes(slug as (typeof PRODUCT_SLUGS)[number])
    ? productConfig[slug as keyof typeof productConfig]
    : null;

  return (
    <>
      {config && <BreadcrumbJsonLd slug={slug} name={config.metadata.title} />}
      {children}
    </>
  );
}
