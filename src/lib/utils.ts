import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Path to placeholder image when a product has no photo (public URL). */
export const PLACEHOLDER_PRODUCT_IMAGE = "/placeholder-product.svg"
