import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drelix.pl";

const productRoutes = [
  { path: "/products/gloves", priority: 0.9 },
  { path: "/products/boots", priority: 0.9 },
  { path: "/products/spodnie", priority: 0.9 },
  { path: "/products/koszula", priority: 0.9 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productRoutes.map(({ path, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
  ];
}
