/**
 * SEO config – optimized for React 19 + Next.js 16.
 * Single source for metadata, sitemap, robots.txt, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in .env (no trailing slash) so canonicals and sitemap match.
 */

const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drelix.org";

/**
 * Canonical base URL with no trailing slash. All canonicals, sitemap URLs, and
 * JSON-LD urls must use this so we stay consistent (SEO_Guide: non–trailing-slash).
 */
export function getCanonicalBaseUrl(): string {
  return raw.replace(/\/+$/, "") || raw;
}

/** Target max length for page titles (SERPs; ~60 chars ideal). */
export const TITLE_IDEAL_MAX = 60;

/** Target max length for meta descriptions (~160 chars ideal). */
export const DESC_IDEAL_MAX = 160;
