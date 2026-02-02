import sharp from 'sharp';
import {
  THUMBNAIL_MAX,
  THUMBNAIL_QUALITY,
  LARGE_MAX,
  LARGE_QUALITY,
} from '@/lib/image/constants';
import { sanitizeFilename, slugifyForFilename } from '@/utils/utils';
import type { ImageVariants } from '@/lib/types/types';

export type { ImageVariants } from '@/lib/types/types';

/**
 * Process a raw image buffer into thumbnail + large WebP variants.
 * Filename base: KOD-NAZWA (e.g. R-REXG-rekawice-odblaskowe).
 */
export async function processImageToVariants(
  buffer: Buffer,
  options: { kod?: string; nazwa?: string; originalFilename?: string }
): Promise<ImageVariants> {
  const { kod: kodRaw, nazwa: nazwaRaw, originalFilename = '' } = options;
  const kod =
    typeof kodRaw === 'string' && kodRaw.trim()
      ? sanitizeFilename(kodRaw.trim())
      : '';
  const nazwaSlug = slugifyForFilename(
    typeof nazwaRaw === 'string' ? nazwaRaw : ''
  );
  const baseName =
    kod && nazwaSlug
      ? `${kod}-${nazwaSlug}`
      : kod
        ? kod
        : nazwaSlug
          ? nazwaSlug
          : sanitizeFilename(originalFilename).replace(/\.[^/.]+$/, '') ||
            `upload-${Date.now()}`;
  const thumbnailFilename = `${baseName}-thumb.webp`;
  const largeFilename = `${baseName}.webp`;

  const [thumbnailBuffer, largeBuffer] = await Promise.all([
    sharp(buffer)
      .resize({
        width: THUMBNAIL_MAX,
        height: THUMBNAIL_MAX,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: THUMBNAIL_QUALITY,
        lossless: false,
        nearLossless: false,
      })
      .toBuffer(),
    sharp(buffer)
      .resize({
        width: LARGE_MAX,
        height: LARGE_MAX,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: LARGE_QUALITY,
        lossless: false,
        nearLossless: false,
      })
      .toBuffer(),
  ]);

  return {
    thumbnail: {
      base64: thumbnailBuffer.toString('base64'),
      filename: thumbnailFilename,
    },
    large: {
      base64: largeBuffer.toString('base64'),
      filename: largeFilename,
    },
  };
}
