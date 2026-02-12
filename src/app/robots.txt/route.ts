import { getCanonicalBaseUrl, getRobotsTxt } from "@/lib/seo";

/**
 * Next.js 16: serves /robots.txt (Route Handler for full control; app/robots.ts would not allow custom comments/AI block list).
 * Content: @/lib/seo/robotsContent.ts. Base URL: getCanonicalBaseUrl() (same as sitemap).
 * Policy: search engines allowed; /api/ and /admin/ disallowed; AI/training crawlers blocked.
 */
export const dynamic = "force-static";

export function GET() {
  const baseUrl = getCanonicalBaseUrl();
  const body = getRobotsTxt(baseUrl);
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
