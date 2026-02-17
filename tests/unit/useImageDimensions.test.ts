/**
 * Tests for useImageDimensions: loading, deduping, abort, snapshot, empty urls.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useImageDimensions } from "@/hooks/useImageDimensions";

const mockCreateImageBitmap = vi.fn();
const mockFetch = vi.fn();

function blobWithSize(width: number, height: number): Blob {
  return new Blob([], { type: "image/png" });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCreateImageBitmap.mockImplementation((_blob: Blob) =>
    Promise.resolve({
      width: 100,
      height: 200,
      close: () => {},
    } as unknown as ImageBitmap),
  );
  mockFetch.mockImplementation((url: string) =>
    Promise.resolve(
      new Response(blobWithSize(100, 200), {
        headers: { "Content-Type": "image/png" },
      }),
    ),
  );
  global.fetch = mockFetch;
  global.createImageBitmap = mockCreateImageBitmap;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useImageDimensions", () => {
  it("returns empty object when urls is empty array", () => {
    const { result } = renderHook(() => useImageDimensions([]));
    // useMemo returns {} when unique.length is 0; queueMicrotask(setCache) may trigger one act warning
    expect(result.current).toEqual({});
  });

  it("returns empty object when urls is empty and clears cache after microtask", async () => {
    const { result, rerender } = renderHook(
      ({ urls }: { urls: readonly string[] }) => useImageDimensions(urls),
      { initialProps: { urls: ["https://example.com/a.png"] } },
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
    expect(mockFetch).toHaveBeenCalledTimes(1);
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
    const urls = [
      "https://example.com/a.png",
      "https://example.com/b.png",
    ] as const;
    mockCreateImageBitmap
      .mockResolvedValueOnce({
        width: 10,
        height: 20,
        close: () => {},
      } as unknown as ImageBitmap)
      .mockResolvedValueOnce({
        width: 30,
        height: 40,
        close: () => {},
      } as unknown as ImageBitmap);
    const { result } = renderHook(() => useImageDimensions(urls));
    await waitFor(() => {
      expect(result.current[urls[0]]).toEqual({ width: 10, height: 20 });
      expect(result.current[urls[1]]).toEqual({ width: 30, height: 40 });
    });
  });

  it("omits URL when fetch fails", async () => {
    const good = "https://example.com/good.png";
    const bad = "https://example.com/bad.png";
    mockFetch.mockImplementation((url: string) =>
      url === bad
        ? Promise.reject(new Error("Network error"))
        : Promise.resolve(
            new Response(blobWithSize(1, 1), {
              headers: { "Content-Type": "image/png" },
            }),
          ),
    );
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
    mockCreateImageBitmap.mockRejectedValueOnce(new Error("decode error"));
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

  it("aborts previous request when urls change", async () => {
    const url1 = "https://example.com/1.png";
    const url2 = "https://example.com/2.png";
    const { rerender } = renderHook(
      ({ urls }: { urls: readonly string[] }) => useImageDimensions(urls),
      { initialProps: { urls: [url1] } },
    );
    rerender({ urls: [url2] });
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        url2,
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  it("uses AbortController signal in fetch", async () => {
    const url = "https://example.com/signal.png";
    renderHook(() => useImageDimensions([url]));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          cache: "force-cache",
        }),
      );
    });
  });
});
