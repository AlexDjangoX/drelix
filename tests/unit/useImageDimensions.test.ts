/**
 * Tests for useImageDimensions: loading, deduping, snapshot, empty urls.
 * Hook uses Image() + onload (not fetch) so cross-origin URLs work.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useImageDimensions } from "@/hooks/useImageDimensions";

const urlToDimensions: Record<string, { width: number; height: number }> = {};
const errorUrls = new Set<string>();

let MockImage: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(urlToDimensions).forEach((k) => delete urlToDimensions[k]);
  errorUrls.clear();

  MockImage = vi.fn().mockImplementation(function (this: {
    onload: () => void;
    onerror: () => void;
    _src: string;
    naturalWidth: number;
    naturalHeight: number;
  }) {
    this.onload = () => {};
    this.onerror = () => {};
    this._src = "";
    this.naturalWidth = 100;
    this.naturalHeight = 200;
    Object.defineProperty(this, "src", {
      set(value: string) {
        this._src = value;
        const dims = urlToDimensions[value] ?? { width: 100, height: 200 };
        const fail = errorUrls.has(value);
        queueMicrotask(() => {
          if (fail) this.onerror();
          else {
            this.naturalWidth = dims.width;
            this.naturalHeight = dims.height;
            this.onload();
          }
        });
      },
      get() {
        return this._src;
      },
      configurable: true,
    });
    return this;
  });

  global.Image = MockImage as unknown as typeof Image;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useImageDimensions", () => {
  it("returns empty object when urls is empty array", () => {
    const { result } = renderHook(() => useImageDimensions([]));
    // useMemo returns {} when unique.length is 0; effect may queue setCache({}) (act warning ok)
    expect(result.current).toEqual({});
  });

  it("returns empty object when urls is empty and clears cache after microtask", async () => {
    const url = "https://example.com/a.png";
    const { result, rerender } = renderHook(
      ({ urls }: { urls: readonly string[] }) => useImageDimensions(urls),
      { initialProps: { urls: [url] } },
    );
    await waitFor(() => {
      expect(Object.keys(result.current).length).toBeGreaterThan(0);
    });
    await act(async () => {
      rerender({ urls: [] });
      await Promise.resolve();
    });
    expect(result.current).toEqual({});
  });

  it("returns dimensions for a single URL after load", async () => {
    const url = "https://example.com/one.png";
    const { result } = renderHook(() => useImageDimensions([url]));
    expect(result.current).toEqual({});
    await waitFor(() => {
      expect(result.current[url]).toEqual({ width: 100, height: 200 });
    });
  });

  it("deduplicates URLs", async () => {
    const url = "https://example.com/dup.png";
    const urls = [url, url, url] as const;
    const { result } = renderHook(
      ({ u }: { u: readonly string[] }) => useImageDimensions(u),
      { initialProps: { u: urls } },
    );
    await waitFor(() => {
      expect(result.current[url]).toBeDefined();
    });
    expect(MockImage).toHaveBeenCalledTimes(1);
    expect(result.current[url]).toEqual({ width: 100, height: 200 });
  });

  it("filters out falsy URLs", async () => {
    const url = "https://example.com/only.png";
    const { result } = renderHook(() =>
      useImageDimensions([url, "", null, undefined] as readonly string[]),
    );
    await waitFor(() => {
      expect(result.current[url]).toEqual({ width: 100, height: 200 });
    });
    expect(Object.keys(result.current)).toHaveLength(1);
  });

  it("returns dimensions for multiple URLs", async () => {
    const urlA = "https://example.com/a.png";
    const urlB = "https://example.com/b.png";
    urlToDimensions[urlA] = { width: 10, height: 20 };
    urlToDimensions[urlB] = { width: 30, height: 40 };
    const urls = [urlA, urlB] as const;
    const { result } = renderHook(() => useImageDimensions(urls));
    await waitFor(() => {
      expect(result.current[urls[0]]).toEqual({ width: 10, height: 20 });
      expect(result.current[urls[1]]).toEqual({ width: 30, height: 40 });
    });
  });

  it("omits URL when load fails", async () => {
    const good = "https://example.com/good.png";
    const bad = "https://example.com/bad.png";
    errorUrls.add(bad);
    const { result } = renderHook(() =>
      useImageDimensions([good, bad]),
    );
    await waitFor(() => {
      expect(result.current[good]).toBeDefined();
    });
    expect(result.current[good]).toEqual({ width: 100, height: 200 });
    expect(result.current[bad]).toBeUndefined();
  });

  it("omits URL when createImageBitmap fails", async () => {
    const url = "https://example.com/fail-decode.png";
    errorUrls.add(url);
    const { result } = renderHook(() => useImageDimensions([url]));
    await waitFor(
      () => {
        expect(Object.keys(result.current)).toHaveLength(0);
      },
      { timeout: 500 },
    );
  });

  it("snapshot only includes URLs from current unique list", async () => {
    const urlA = "https://example.com/a.png";
    const urlB = "https://example.com/b.png";
    const { result, rerender } = renderHook(
      ({ urls }: { urls: readonly string[] }) => useImageDimensions(urls),
      { initialProps: { urls: [urlA, urlB] } },
    );
    await waitFor(() => {
      expect(result.current[urlA]).toBeDefined();
      expect(result.current[urlB]).toBeDefined();
    });
    await act(async () => {
      rerender({ urls: [urlA] });
    });
    expect(result.current[urlA]).toBeDefined();
    expect(result.current[urlB]).toBeUndefined();
  });

  it("starts loading new URL when urls change", async () => {
    const url1 = "https://example.com/1.png";
    const url2 = "https://example.com/2.png";
    urlToDimensions[url2] = { width: 50, height: 60 };
    const { result, rerender } = renderHook(
      ({ urls }: { urls: readonly string[] }) => useImageDimensions(urls),
      { initialProps: { urls: [url1] } },
    );
    rerender({ urls: [url2] });
    await waitFor(() => {
      expect(result.current[url2]).toEqual({ width: 50, height: 60 });
    });
  });

  it("creates Image and sets src for each URL", async () => {
    const url = "https://example.com/signal.png";
    renderHook(() => useImageDimensions([url]));
    await waitFor(() => {
      expect(MockImage).toHaveBeenCalled();
    });
    const instance = (MockImage as ReturnType<typeof vi.fn>).mock.results[0]
      ?.value;
    expect(instance).toBeDefined();
    expect(instance.src).toBe(url);
  });
});
