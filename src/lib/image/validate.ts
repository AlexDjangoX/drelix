import { NextResponse } from 'next/server';
import sharp from 'sharp';
import {
  IMAGE_MIME_TYPES,
  IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE,
  MAX_DIMENSION,
} from '@/lib/image/constants';

export function createFileValidationError(message: string): NextResponse {
  return new NextResponse(message, {
    status: 400,
    headers: { 'Content-Type': 'text/plain' },
  });
}

export async function validateImageFile(
  file: File
): Promise<{ isValid: boolean; error?: string }> {
  try {
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
      };
    }
    if (file.size === 0) {
      return { isValid: false, error: 'File appears to be empty' };
    }
    if (
      file.type &&
      !IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])
    ) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${IMAGE_MIME_TYPES.join(', ')}`,
      };
    }
    if (file.name) {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (
        !IMAGE_EXTENSIONS.includes(ext as (typeof IMAGE_EXTENSIONS)[number])
      ) {
        return {
          isValid: false,
          error: `File extension ${ext} is not allowed. Allowed extensions: ${IMAGE_EXTENSIONS.join(', ')}`,
        };
      }
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format) {
      return { isValid: false, error: 'Invalid or corrupted image file' };
    }
    if (metadata.width && metadata.width > MAX_DIMENSION) {
      return {
        isValid: false,
        error: 'Image width exceeds maximum allowed dimensions',
      };
    }
    if (metadata.height && metadata.height > MAX_DIMENSION) {
      return {
        isValid: false,
        error: 'Image height exceeds maximum allowed dimensions',
      };
    }
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error:
        'Image validation failed - file may be corrupted or not a valid image',
    };
  }
}
