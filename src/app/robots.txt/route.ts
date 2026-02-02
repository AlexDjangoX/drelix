import { getRobotsTxt } from '@/lib/SEO/robotsContent';
import { getCanonicalBaseUrl } from '@/lib/SEO/seo';

/**
 * Serves /robots.txt with the same baseUrl as sitemap (getCanonicalBaseUrl).
 * Policy (in lib/robotsContent.ts): Content-signal, search engines allowed, /api/ and /admin/ disallowed, AI crawlers blocked.
 */
const baseUrl = getCanonicalBaseUrl();

export function GET() {
  const body = getRobotsTxt(baseUrl);
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
