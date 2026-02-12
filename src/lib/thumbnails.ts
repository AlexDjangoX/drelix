import type { CategorySlug } from "@/lib/types";

/** Slugs that have a thumbnail in /thumbnails (name matches slug; .png or .jpeg). */
const THUMBNAIL_PATHS: Partial<Record<CategorySlug, string>> = {
  gloves: "/thumbnails/gloves.png",
  kalosze: "/thumbnails/kalosze.jpeg",
  koszula: "/thumbnails/koszula.jpeg",
  polbuty: "/thumbnails/polbuty.jpeg",
  sandaly: "/thumbnails/sandaly.jpeg",
  spodnie: "/thumbnails/spodnie.jpeg",
};

export function getThumbnailPath(slug: string): string | null {
  return THUMBNAIL_PATHS[slug as CategorySlug] ?? null;
}
