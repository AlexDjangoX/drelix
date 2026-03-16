import { action } from './_generated/server';
import { api } from './_generated/api';
import { getProductImageEntries } from './lib/helpers';
import { slugifyDisplayName } from './lib/slugify';
import type { ProductDoc } from './lib/types';

export type ImageExportEntry = {
  storageId: string;
  productKod: string;
  productNazwa: string;
  imageIndex: number;
  variant: 'large' | 'thumbnail';
  url: string;
  /** Filename for public/product-images/{large|thumbnails}/ */
  filename: string;
};

export type ExportResult = {
  products: ProductDoc[];
  categories: { _id: string; slug: string; titleKey: string; displayName?: string; createdAt?: number }[];
  subcategories: { _id: string; categorySlug: string; slug: string; displayName: string; order?: number; createdAt?: number }[];
  imageManifest: ImageExportEntry[];
};

/** Sanitize Kod for filename: remove path chars, limit length. */
function sanitizeKod(s: string): string {
  return (
    s
      .replace(/[/\\:*?"<>|]/g, '')
      .replace(/\.\./g, '')
      .trim()
      .slice(0, 80) || 'product'
  );
}

/**
 * Export all data + image URLs for download. Used by scripts/download-export.js.
 * URLs are short-lived (~1h); run the download script immediately after.
 */
export const exportAllData = action({
  args: {},
  handler: async (ctx): Promise<ExportResult> => {
    const [products, categories, subcategories] = await Promise.all([
      ctx.runQuery(api.catalog.listAllProductsForExport, {}),
      ctx.runQuery(api.catalog.listCategories, {}),
      ctx.runQuery(api.catalog.listAllSubcategoriesForExport, {}),
    ]);

    const imageManifest: ImageExportEntry[] = [];
    const seenStorageIds = new Set<string>();
    const usedFilenames = new Set<string>();

    function uniqueFilename(
      base: string,
      suffix: string,
      variant: 'large' | 'thumbnail',
    ): string {
      const ext = variant === 'thumbnail' ? '-thumb.webp' : '.webp';
      let candidate = `${base}${suffix}${ext}`;
      let n = 0;
      while (usedFilenames.has(candidate)) {
        n++;
        candidate = `${base}${suffix}-${n}${ext}`;
      }
      usedFilenames.add(candidate);
      return candidate;
    }

    for (const p of products) {
      const entries = getProductImageEntries(p);
      const kod = sanitizeKod(p.Kod);
      const nazwaSlug = slugifyDisplayName(p.Nazwa ?? '').slice(0, 50);
      const base = nazwaSlug ? `${kod}-${nazwaSlug}` : kod;

      for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        const suffix = entries.length > 1 ? `-${i}` : '';

        // Large image
        if (!seenStorageIds.has(e.imageStorageId)) {
          seenStorageIds.add(e.imageStorageId);
          const url = await ctx.storage.getUrl(e.imageStorageId);
          if (url) {
            imageManifest.push({
              storageId: e.imageStorageId,
              productKod: p.Kod,
              productNazwa: p.Nazwa ?? '',
              imageIndex: i,
              variant: 'large',
              url,
              filename: uniqueFilename(base, suffix, 'large'),
            });
          }
        }

        // Thumbnail
        if (e.thumbnailStorageId && !seenStorageIds.has(e.thumbnailStorageId)) {
          seenStorageIds.add(e.thumbnailStorageId);
          const url = await ctx.storage.getUrl(e.thumbnailStorageId);
          if (url) {
            imageManifest.push({
              storageId: e.thumbnailStorageId,
              productKod: p.Kod,
              productNazwa: p.Nazwa ?? '',
              imageIndex: i,
              variant: 'thumbnail',
              url,
              filename: uniqueFilename(base, suffix, 'thumbnail'),
            });
          }
        }
      }
    }

    return {
      products,
      categories,
      subcategories,
      imageManifest,
    };
  },
});
