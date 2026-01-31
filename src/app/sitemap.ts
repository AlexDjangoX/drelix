import type { MetadataRoute } from 'next';
import { PRODUCT_SLUGS } from '@/components/products/productConfig';

/**
 * Next.js serves this at /sitemap.xml (no public/sitemap.xml needed).
 * Edit this file to change sitemap URLs; baseUrl comes from NEXT_PUBLIC_SITE_URL.
 */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    ...PRODUCT_SLUGS.map((slug) => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
