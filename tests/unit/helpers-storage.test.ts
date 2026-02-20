/**
 * Unit tests for storage deletion error handling in helpers.ts.
 * Tests the Promise.allSettled error recovery logic.
 */
import { describe, it, expect } from "vitest";
import { deleteProductImages } from "../../convex/lib/helpers";
import type { ProductDoc } from "../../convex/lib/types";
import type { MutationCtx } from "../../convex/_generated/server";

/** Minimal ctx mock for deleteProductImages (only uses storage.delete) */
function createMockCtx(storage: {
  delete: (id: string) => Promise<void>;
}): MutationCtx {
  return { storage } as unknown as MutationCtx;
}

describe("deleteProductImages error handling", () => {
  it("handles successful deletion of both images", async () => {
    const mockProduct = {
      Kod: "TEST-001",
      imageStorageId: "img-123",
      thumbnailStorageId: "thumb-456",
    } as ProductDoc;

    const ctx = createMockCtx({
      delete: async () => Promise.resolve(),
    });

    const result = await deleteProductImages(ctx, mockProduct);
    expect(result.deleted).toBe(2);
    expect(result.failed).toBe(0);
  });

  it("returns zero when no images to delete", async () => {
    const mockProduct = {
      Kod: "TEST-002",
    } as ProductDoc;

    const ctx = createMockCtx({
      delete: async () => Promise.resolve(),
    });

    const result = await deleteProductImages(ctx, mockProduct);
    expect(result.deleted).toBe(0);
    expect(result.failed).toBe(0);
  });

  it("continues on storage deletion failures and logs warning", async () => {
    const mockProduct = {
      Kod: "TEST-003",
      imageStorageId: "img-fail",
      thumbnailStorageId: "thumb-success",
    } as ProductDoc;

    const ctx = createMockCtx({
      delete: async (id: string) => {
        if (id === "img-fail") {
          throw new Error("Storage deletion failed");
        }
        return Promise.resolve();
      },
    });

    const result = await deleteProductImages(ctx, mockProduct);

    // Should have 1 successful deletion, 1 failed (no console.warn in production)
    expect(result.deleted).toBe(1);
    expect(result.failed).toBe(1);
  });

  it("handles all deletions failing", async () => {
    const mockProduct = {
      Kod: "TEST-004",
      imageStorageId: "img-fail",
      thumbnailStorageId: "thumb-fail",
    } as ProductDoc;

    const ctx = createMockCtx({
      delete: async () => {
        throw new Error("Storage service unavailable");
      },
    });

    const result = await deleteProductImages(ctx, mockProduct);

    expect(result.deleted).toBe(0);
    expect(result.failed).toBe(2);
  });

  it("handles partial deletion (only large image exists)", async () => {
    const mockProduct = {
      Kod: "TEST-005",
      imageStorageId: "img-only",
    } as ProductDoc;

    const ctx = createMockCtx({
      delete: async () => Promise.resolve(),
    });

    const result = await deleteProductImages(ctx, mockProduct);
    expect(result.deleted).toBe(1);
    expect(result.failed).toBe(0);
  });
});
