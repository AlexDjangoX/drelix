"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/utils";

/** Min/max aspect ratio so cards stay readable (avoid extreme tall or wide). */
const ASPECT_MIN = 0.7;
const ASPECT_MAX = 1.35;

const DEFAULT_SIZES =
  "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw";

export type ProductCardImageProps = {
  src: string;
  alt: string;
  /** Override image sizes for different layouts. */
  sizes?: string;
  /** Extra class names for the wrapper or image. */
  className?: string;
  /** Image className (hover/transition). Applied to the Next Image. */
  imageClassName?: string;
  /** Called when the image fails to load (e.g. to show a placeholder). */
  onError?: () => void;
};

/**
 * Reusable product card image: adapts container aspect ratio to the image’s
 * natural dimensions (clamped) so different image sizes look good. Use on
 * category grids, search results, or anywhere a product thumbnail is shown.
 */
export function ProductCardImage({
  src,
  alt,
  sizes = DEFAULT_SIZES,
  className,
  imageClassName = "object-contain object-center group-hover:scale-[1.02] group-active:scale-100 transition-transform duration-300",
  onError,
}: ProductCardImageProps) {
  const [aspect, setAspect] = useState<number>(1);
  const safeSrc = src?.trim() || PLACEHOLDER_PRODUCT_IMAGE;

  const onLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setAspect(Math.min(ASPECT_MAX, Math.max(ASPECT_MIN, ratio)));
    }
  }, []);

  return (
    <div
      className={
        className ??
        "relative w-full bg-muted flex items-center justify-center overflow-hidden rounded-t-xl"
      }
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={imageClassName}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}
