import type { Metadata } from 'next';
import { PRODUCT_SLUGS, productConfig } from "./productConfig";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';

/** Static until redeploy; no revalidation. */
export const dynamic = 'force-static';
export const revalidate = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
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
      url: canonical,
      title: `${title} | Drelix`,
      description,
    },
    twitter: { card: 'summary_large_image', title: `${title} | Drelix` },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
