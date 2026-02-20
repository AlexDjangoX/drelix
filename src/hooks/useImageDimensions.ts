'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

export type ImageDimensions = {
  width: number;
  height: number;
};

type DimensionsMap = Record<string, ImageDimensions>;

export type UseImageDimensionsResult = {
  dimensions: DimensionsMap;
  isReady: boolean;
};

/**
 * Load image dimensions using Image() + onload so cross-origin URLs work
 * (fetch + createImageBitmap often fails with CORS for storage/CDN images).
 * Returns { dimensions, isReady }. isReady is true when all URLs have been
 * attempted (onload or onerror), so the caller can wait before rendering.
 */
export function useImageDimensions(urls: readonly string[]): UseImageDimensionsResult {
  const [cache, setCache] = useState<DimensionsMap>({});
  const [isReady, setIsReady] = useState(false);
  const cancelledRef = useRef(false);
  const resolvedCountRef = useRef(0);

  const unique = useMemo(() => [...new Set(urls)].filter(Boolean), [urls]);

  useEffect(() => {
    if (!unique.length) {
      setCache({});
      setIsReady(true);
      return;
    }

    cancelledRef.current = false;
    resolvedCountRef.current = 0;
    setIsReady(false);

    const checkAllResolved = () => {
      if (cancelledRef.current) return;
      resolvedCountRef.current += 1;
      if (resolvedCountRef.current === unique.length) {
        setIsReady(true);
      }
    };

    unique.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        if (cancelledRef.current) return;
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        setCache((prev) => ({ ...prev, [url]: { width, height } }));
        checkAllResolved();
      };
      img.onerror = () => {
        checkAllResolved();
      };
      img.src = url;
    });

    return () => {
      cancelledRef.current = true;
    };
  }, [unique]);

  const dimensions = useMemo(() => {
    if (!unique.length) return {};
    const snapshot: DimensionsMap = {};
    for (const url of unique) {
      const d = cache[url];
      if (d) snapshot[url] = d;
    }
    return snapshot;
  }, [cache, unique]);

  return { dimensions, isReady };
}
