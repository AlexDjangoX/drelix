"use client";

import { useState, useEffect, useRef } from "react";

export type ImageDimensions = { width: number; height: number };

/**
 * Loads natural dimensions for a list of image URLs. Returns a map of url -> { width, height }.
 * Images without dimensions (placeholder, failed load) are omitted; use 0 for sort order.
 */
export function useImageDimensions(urls: string[]): Record<string, ImageDimensions> {
  const [dimensions, setDimensions] = useState<Record<string, ImageDimensions>>({});
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const unique = [...new Set(urls)].filter(Boolean);

    const next: Record<string, ImageDimensions> = {};
    let pending = unique.length;

    function maybeDone() {
      pending--;
      if (pending === 0 && mounted.current) {
        setDimensions((prev) => ({ ...prev, ...next }));
      }
    }

    unique.forEach((url) => {
      const img = new window.Image();
      img.onload = () => {
        if (mounted.current && img.naturalWidth && img.naturalHeight) {
          next[url] = { width: img.naturalWidth, height: img.naturalHeight };
        }
        maybeDone();
      };
      img.onerror = () => maybeDone();
      img.src = url;
    });

    if (unique.length === 0) pending = 0;
    if (pending === 0) setDimensions((prev) => ({ ...prev, ...next }));

    return () => {
      mounted.current = false;
    };
  }, [urls.join(",")]);

  return dimensions;
}
