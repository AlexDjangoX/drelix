/**
 * Unit tests for src/lib/utils (filenames, base64, placeholder).
 */
import { describe, it, expect } from "vitest";
import {
  sanitizeFilename,
  slugifyForFilename,
  base64ToBlob,
  PLACEHOLDER_PRODUCT_IMAGE,
} from "@/lib/utils";

describe("sanitizeFilename", () => {
  it("strips path and invalid filename characters", () => {
    expect(sanitizeFilename("file:name")).toBe("filename");
    expect(sanitizeFilename("path/to/file.txt")).toBe("pathtofile.txt");
    expect(sanitizeFilename("a*b?c")).toBe("abc");
  });

  it("strips leading/trailing dots", () => {
    expect(sanitizeFilename(".hidden")).toBe("hidden");
    expect(sanitizeFilename("file.")).toBe("file");
  });

  it("returns fallback for empty or too long", () => {
    expect(sanitizeFilename("")).toMatch(/^upload-\d+$/);
    expect(sanitizeFilename("   ")).toMatch(/^upload-\d+$/);
    expect(sanitizeFilename("a".repeat(256))).toMatch(/^upload-\d+$/);
  });

  it("allows safe filenames up to 255 chars", () => {
    const safe = "valid-name_123.txt";
    expect(sanitizeFilename(safe)).toBe(safe);
    expect(sanitizeFilename("a".repeat(255)).length).toBe(255);
  });
});

describe("slugifyForFilename", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyForFilename("Product Name")).toBe("product-name");
  });

  it("folds Polish diacritics", () => {
    expect(slugifyForFilename("Rękawice")).toBe("rekawice");
    expect(slugifyForFilename("Łódź")).toBe("lodz");
  });

  it("returns empty for empty or non-string", () => {
    expect(slugifyForFilename("")).toBe("");
    expect(slugifyForFilename("   ")).toBe("");
  });

  it("strips leading/trailing hyphens", () => {
    expect(slugifyForFilename("  x  ")).toBe("x");
  });

  it("limits length to 80", () => {
    expect(slugifyForFilename("a".repeat(100)).length).toBe(80);
  });
});

describe("base64ToBlob", () => {
  it("decodes base64 to Blob with given mime", () => {
    const b64 = "dGVzdA=="; // "test"
    const blob = base64ToBlob(b64, "text/plain");
    expect(blob instanceof Blob).toBe(true);
    expect(blob.type).toBe("text/plain");
    expect(blob.size).toBe(4);
  });
});

describe("PLACEHOLDER_PRODUCT_IMAGE", () => {
  it("is a string path", () => {
    expect(PLACEHOLDER_PRODUCT_IMAGE).toBe("/placeholder-product.svg");
  });
});
