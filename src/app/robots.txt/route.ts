import { getRobotsTxt } from '@/lib/robotsContent';

/**
 * Serves /robots.txt with the same baseUrl as sitemap.ts (NEXT_PUBLIC_SITE_URL).
 * Policy (in lib/robotsContent.ts) is unchanged:
 * - Content-signal: search=yes, ai-train=no, ai-input=no (blocks AI training/input)
 * - Search engines: allowed on /, blocked from /api/, /admin/
 * - AI/training crawlers (GPTBot, CCBot, ClaudeBot, PerplexityBot, etc.): Disallow /
 * So AI training and other costly non-search traffic remain blocked.
 */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://drelix.pl';

export function GET() {
  const body = getRobotsTxt(baseUrl);
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
