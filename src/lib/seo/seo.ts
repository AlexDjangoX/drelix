/**
 * Single source for SEO-related values. Used by metadata, sitemap, robots, and JSON-LD.
 * See docs/SEO_Guide.md.
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
