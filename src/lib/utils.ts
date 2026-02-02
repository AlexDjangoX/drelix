import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Path to placeholder image when a product has no photo (public URL). */
export const PLACEHOLDER_PRODUCT_IMAGE = '/placeholder-product.svg';

/** Decode a base64 string into a Blob (e.g. for API response → upload). */
export function base64ToBlob(base64: string, mime: string): Blob {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Sanitize a string for use as a filename (remove path chars, limit length). */
export function sanitizeFilename(filename: string): string {
  const sanitized = filename
    .replace(/[/\\:*?"<>|]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
    .trim();
  if (!sanitized || sanitized.length > 255) {
    return `upload-${Date.now()}`;
  }
  return sanitized;
}

/** Hyphenate product name (e.g. Nazwa) for filenames: lowercase, Polish diacritics folded, spaces → hyphens. */
export function slugifyForFilename(name: string): string {
  if (!name || typeof name !== 'string') return '';
  const folded = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining marks (ę→e, ł→l, etc.)
    .replace(/ł/g, 'l') // Polish ł not in NFD strip
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return folded || '';
}
