/**
 * Builds robots.txt body. Call with getCanonicalBaseUrl() from @/lib/seo so the
 * Sitemap URL in robots.txt aligns with the sitemap (no trailing slash).
 */

const AI_CRAWLERS = [
  'AI2Bot',
  'Ai2Bot-Dolma',
  'Amazonbot',
  'anthropic-ai',
  'Applebot',
  'Applebot-Extended',
  'Brightbot 1.0',
  'Bytespider',
  'CCBot',
  'ChatGPT-User',
  'Claude-Web',
  'ClaudeBot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Crawlspace',
  'Diffbot',
  'DuckAssistBot',
  'FacebookBot',
  'FriendlyCrawler',
  'Google-Extended',
  'GoogleOther',
  'GoogleOther-Image',
  'GoogleOther-Video',
  'GPTBot',
  'iaskspider/2.0',
  'ICC-Crawler',
  'ImagesiftBot',
  'img2dataset',
  'ISSCyberRiskCrawler',
  'Kangaroo Bot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'meta-externalagent',
  'OAI-SearchBot',
  'omgili',
  'omgilibot',
  'PanguBot',
  'PerplexityBot',
  'PetalBot',
  'Scrapy',
  'SemrushBot-OCOB',
  'SemrushBot-SWA',
  'Sidetrade indexer bot',
  'Timpibot',
  'VelenPublicWebCrawler',
  'Webzio-Extended',
  'YouBot',
];

export function getRobotsTxt(baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '') || baseUrl;
  const sitemapUrl = `${base}/sitemap.xml`;
  const aiBlock = AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nDisallow: /`).join('\n\n');

  return `# ===========================================
# CONTENT SIGNALS POLICY
# Modern standard for expressing content rights
# ===========================================
#
# As a condition of accessing this website, you agree to abide by the
# following content signals:
#
# (a)  If a content-signal = yes, you may collect content for the
#      corresponding use.
# (b)  If a content-signal = no, you may not collect content for the
#      corresponding use.
# (c)  If the website operator does not include a content signal for a
#      corresponding use, the website operator neither grants nor restricts
#      permission via content signal with respect to the corresponding use.
#
# The content signals and their meanings are:
#
# search: building a search index and providing search results (e.g., returning
#         hyperlinks and short excerpts from your website's contents). Search
#         does not include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval
#           augmented generation, grounding, or other real-time taking of
#           content for generative AI search answers).
# ai-train: training or fine-tuning AI models.
#
# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.
# (Content-signal is not in RFC 9309; omitted so Google validates. AI bots blocked below.)

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# ===========================================
# SEARCH ENGINE CRAWLERS – ALLOWED (SEO)
# ===========================================
# Public pages: /, /products, /products/[slug]. Blocked: /api/, /admin/.

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: Slurp
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: DuckDuckBot
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: YandexBot
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: Baiduspider
Allow: /
Disallow: /api/
Disallow: /admin/

# ===========================================
# AI / TRAINING CRAWLERS – BLOCKED
# ===========================================
# Reduces useless traffic and reserves rights (Content-signal above).

${aiBlock}

# ===========================================
# SITEMAP (same origin as sitemap.ts – NEXT_PUBLIC_SITE_URL)
# ===========================================

Sitemap: ${sitemapUrl}
`;
}