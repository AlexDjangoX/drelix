'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

export type ImageDimensions = {
  width: number;
  height: number;
};

type DimensionsMap = Record<string, ImageDimensions>;

/**
 * Load image dimensions using Image() + onload so cross-origin URLs work
 * (fetch + createImageBitmap often fails with CORS for storage/CDN images).
 */
export function useImageDimensions(urls: readonly string[]): DimensionsMap {
  const [cache, setCache] = useState<DimensionsMap>({});
  const cancelledRef = useRef(false);

  const unique = useMemo(() => [...new Set(urls)].filter(Boolean), [urls]);

  useEffect(() => {
    if (!unique.length) {
      queueMicrotask(() => setCache({}));
      return;
    }

    cancelledRef.current = false;

    unique.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        if (cancelledRef.current) return;
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        setCache((prev) => ({ ...prev, [url]: { width, height } }));
      };
      img.onerror = () => {};
      img.src = url;
    });

    return () => {
      cancelledRef.current = true;
    };
  }, [unique]);

  return useMemo(() => {
    if (!unique.length) return {};
    const snapshot: DimensionsMap = {};
    for (const url of unique) {
      const d = cache[url];
      if (d) snapshot[url] = d;
    }
    return snapshot;
  }, [cache, unique]);
}
