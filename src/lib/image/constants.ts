/** Allowed MIME types for upload. */
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

/** Allowed file extensions. */
export const IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
] as const;

/** Max upload size (10MB). */
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/** Max dimension (width/height) for validation. */
export const MAX_DIMENSION = 10_000;

/** Thumbnail: grids, lists, admin table. Max 640px on longest side, WebP 82. */
export const THUMBNAIL_MAX = 640;
export const THUMBNAIL_QUALITY = 82;

/** Large: lightbox, hero. Max 1920px on longest side, WebP 88 for crisp 2x. */
export const LARGE_MAX = 1920;
export const LARGE_QUALITY = 88;
