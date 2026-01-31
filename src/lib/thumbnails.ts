/**
 * Thumbnail images in /public/thumbnails. Filenames match category slugs.
 * Used for hero background and product category cards (homepage).
 */
import type { CategorySlug } from '@/data/catalogCategories';

/** Slugs that have a thumbnail in /thumbnails (name matches slug; .png or .jpeg). */
const THUMBNAIL_PATHS: Partial<Record<CategorySlug, string>> = {
  gloves: '/thumbnails/gloves.png',
  kalosze: '/thumbnails/kalosze.jpeg',
  koszula: '/thumbnails/koszula.jpeg',
  polbuty: '/thumbnails/polbuty.jpeg',
  sandaly: '/thumbnails/sandaly.jpeg',
  spodnie: '/thumbnails/spodnie.jpeg',
};

export function getThumbnailPath(slug: CategorySlug): string | null {
  return THUMBNAIL_PATHS[slug] ?? null;
}

/** Slug used for hero background (must have a thumbnail). */
export const HERO_THUMBNAIL_SLUG: CategorySlug = 'gloves';

export function getHeroThumbnailPath(): string {
  return getThumbnailPath(HERO_THUMBNAIL_SLUG) ?? '/thumbnails/gloves.png';
}
