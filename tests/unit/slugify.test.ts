/**
 * Unit tests for convex/lib/slugify (display name → slug base).
 * No mocks - testing application logic directly.
 */
import { describe, it, expect } from "vitest";
import {
  slugifyDisplayName,
  shortRandomId,
} from "../../convex/lib/slugify";

describe("slugifyDisplayName", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugifyDisplayName("Gumowe Rękawice")).toBe("gumowe-rekawice");
  });

  it("strips Polish diacritics", () => {
    expect(slugifyDisplayName("Bawełniane")).toBe("bawelniane");
    expect(slugifyDisplayName("Skórzane")).toBe("skorzane");
    expect(slugifyDisplayName("Ocieplane")).toBe("ocieplane");
  });

  it("removes non-alphanumeric except hyphen and underscore", () => {
    expect(slugifyDisplayName("Test & Co.")).toBe("test-co");
  });

  it("collapses multiple hyphens and trims", () => {
    expect(slugifyDisplayName("  a   b   c  ")).toBe("a-b-c");
  });

  it("returns 'sub' when result would be empty", () => {
    expect(slugifyDisplayName("!!!")).toBe("sub");
    expect(slugifyDisplayName("   ")).toBe("sub");
  });
});

describe("shortRandomId", () => {
  it("returns 5 character string", () => {
    const id = shortRandomId();
    expect(id).toHaveLength(5);
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it("returns different values on multiple calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      ids.add(shortRandomId());
    }
    expect(ids.size).toBeGreaterThan(1);
  });
});
