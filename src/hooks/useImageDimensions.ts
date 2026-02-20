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
 * Returns { dimensions, isReady }: dimensions keyed by URL (only
 * successfully-loaded URLs appear); isReady is true once all URLs have
 * settled (loaded or errored).
 */
export function useImageDimensions(urls: readonly string[]): UseImageDimensionsResult {
  const [cache, setCache] = useState<DimensionsMap>({});
  // readyKey tracks which urlKey batch has fully settled; never set synchronously
  // inside an effect body (only in onload/onerror callbacks) to avoid cascading renders.
  const [readyKey, setReadyKey] = useState('');
  const settledRef = useRef(0);
  const cancelledRef = useRef(false);

  // Stable string key so the effect doesn't re-run when the parent passes a new
  // array reference with the same URL content.
  const urlKey =
    urls.length === 0 ? '' : [...new Set(urls)].filter(Boolean).join('\0');

  // Derive unique list from urlKey (a primitive) so React Compiler can verify
  // the dependency is correct — the memo body references only urlKey, not urls.
  const unique = useMemo(
    () => (urlKey ? urlKey.split('\0') : []),
    [urlKey],
  );

  useEffect(() => {
    if (!unique.length) return;

    cancelledRef.current = false;
    settledRef.current = 0;

    unique.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        if (cancelledRef.current) return;
        setCache((prev) => ({
          ...prev,
          [url]: { width: img.naturalWidth, height: img.naturalHeight },
        }));
        settledRef.current += 1;
        if (settledRef.current >= unique.length) setReadyKey(urlKey);
      };
      img.onerror = () => {
        if (cancelledRef.current) return;
        settledRef.current += 1;
        if (settledRef.current >= unique.length) setReadyKey(urlKey);
      };
      img.src = url;
    });

    return () => {
      cancelledRef.current = true;
    };
  }, [unique, urlKey]);

  // Snapshot: only return entries for the current unique URL list so stale
  // cache entries from previous renders don't leak through.
  const dimensions = useMemo(() => {
    if (!unique.length) return {};
    const snapshot: DimensionsMap = {};
    for (const url of unique) {
      const d = cache[url];
      if (d) snapshot[url] = d;
    }
    return snapshot;
  }, [cache, unique]);

  const isReady = unique.length === 0 || readyKey === urlKey;

  return { dimensions, isReady };
}
