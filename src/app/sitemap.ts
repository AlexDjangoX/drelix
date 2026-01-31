import type { MetadataRoute } from "next";
import { PRODUCT_SLUGS } from "./products/[slug]/productConfig";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drelix.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...PRODUCT_SLUGS.map((slug) => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
