/**
 * Contract test: keys the Edit Product form sends to updateProduct must be
 * allowed by the backend (ALLOWED_UPDATE_KEYS). Keeps form and Convex in sync.
 */
import { describe, it, expect } from "vitest";
import { DISPLAY_KEYS } from "@/lib/types";
import { ALLOWED_UPDATE_KEYS } from "../../convex/lib/constants";

/** Same keys as EditProductModal FORM_KEYS (excluding Kod). Form sends these to updateProduct. */
const FORM_UPDATE_KEYS = [
  ...DISPLAY_KEYS.map(({ key }) => key).filter((k) => k !== "Kod"),
  "JednostkaMiary",
  "ProductDescription",
  "categorySlug",
  "Heading",
  "Subheading",
  "Description",
] as const;

describe("Edit Product form ↔ backend contract", () => {
  it("every key the form sends in updates is in ALLOWED_UPDATE_KEYS", () => {
    for (const key of FORM_UPDATE_KEYS) {
      expect(ALLOWED_UPDATE_KEYS.has(key), `Form key "${key}" must be in Convex ALLOWED_UPDATE_KEYS`).toBe(
        true,
      );
    }
  });

  it("form does not send Kod (read-only)", () => {
    expect(FORM_UPDATE_KEYS).not.toContain("Kod");
  });
});
