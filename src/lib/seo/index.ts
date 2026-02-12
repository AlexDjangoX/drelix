/**
 * SEO public API (React 19 + Next.js 16).
 * Use @/lib/seo for canonicals, metadata, sitemap URL, robots content, and title/description limits.
 */
export {
  getCanonicalBaseUrl,
  TITLE_IDEAL_MAX,
  DESC_IDEAL_MAX,
} from "@/lib/seo/seo";
export { getRobotsTxt } from "@/lib/seo/robotsContent";
