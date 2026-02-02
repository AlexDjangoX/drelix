import type { MetadataRoute } from 'next';
import { PRODUCT_SLUGS } from '@/components/products/productConfig';
import { getCanonicalBaseUrl } from '@/lib/seo';

/**
 * Next.js serves this at /sitemap.xml (no public/sitemap.xml needed).
 * Base URL: single source from getCanonicalBaseUrl() (no trailing slash).
 */
const baseUrl = getCanonicalBaseUrl();

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
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...PRODUCT_SLUGS.map((slug) => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
