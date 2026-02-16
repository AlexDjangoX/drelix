/**
 * Unit tests for src/lib/price (Brutto price computation).
 */
import { describe, it, expect } from "vitest";
import { computeBruttoPrice } from "@/lib/price";

describe("computeBruttoPrice", () => {
  it("computes brutto from netto and VAT percentage", () => {
    expect(computeBruttoPrice("100", "23")).toBe("123.00");
    expect(computeBruttoPrice("10", "8")).toBe("10.80");
    expect(computeBruttoPrice("33.33", "8")).toBe("36.00");
  });

  it("returns netto when VAT is 0", () => {
    expect(computeBruttoPrice("50", "0")).toBe("50.00");
    expect(computeBruttoPrice("50", "")).toBe("50.00");
  });

  it("accepts comma as decimal separator", () => {
    expect(computeBruttoPrice("33,33", "8")).toBe("36.00");
    expect(computeBruttoPrice("10,5", "23")).toBe("12.91");
  });

  it("returns empty string for invalid netto", () => {
    expect(computeBruttoPrice("", "23")).toBe("");
    expect(computeBruttoPrice("abc", "23")).toBe("");
    expect(computeBruttoPrice("-10", "23")).toBe("");
  });

  it("treats invalid or negative VAT as 0", () => {
    expect(computeBruttoPrice("100", "invalid")).toBe("100.00");
    expect(computeBruttoPrice("100", "-5")).toBe("100.00");
  });

  it("formats result to 2 decimal places", () => {
    expect(computeBruttoPrice("10", "23")).toBe("12.30");
    expect(computeBruttoPrice("1", "33.33")).toBe("1.33");
  });
});
