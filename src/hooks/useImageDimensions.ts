'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

export type ImageDimensions = {
  width: number;
  height: number;
};

type DimensionsMap = Record<string, ImageDimensions>;

export function useImageDimensions(urls: readonly string[]): DimensionsMap {
  const [cache, setCache] = useState<DimensionsMap>({});
  const abortRef = useRef<AbortController | null>(null);

  const unique = useMemo(() => [...new Set(urls)].filter(Boolean), [urls]);

  useEffect(() => {
    if (!unique.length) {
      queueMicrotask(() => setCache({}));
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    Promise.all(
      unique.map(async (url) => {
        try {
          const res = await fetch(url, {
            signal: controller.signal,
            cache: 'force-cache',
          });

          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob);

          return [url, { width: bitmap.width, height: bitmap.height }] as const;
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (controller.signal.aborted) return;

      const next = Object.fromEntries(
        results.filter(Boolean) as [string, ImageDimensions][],
      );

      setCache(next); // async result only
    });

    return () => controller.abort();
  }, [unique]);

  // 🟢 derive snapshot during render (NOT effect)
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
