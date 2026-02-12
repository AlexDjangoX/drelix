import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "convex/_generated/api";
import { getCanonicalBaseUrl } from "@/lib/seo";

/**
 * Next.js 16 sitemap convention – served at /sitemap.xml, cached by default.
 * Base URL from getCanonicalBaseUrl() (no trailing slash). Category slugs from Convex.
 */
const baseUrl = getCanonicalBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await fetchQuery(api.catalog.listCategorySlugs);
  const now = new Date();
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...slugs.map((slug) => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
