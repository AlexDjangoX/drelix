/**
 * Unit tests for src/lib/process-csv/catalogCategorize.
 * Pure function - no mocks.
 */
import { describe, it, expect } from "vitest";
import { categorizeCatalog } from "@/lib/process-csv/catalogCategorize";
import type { CatalogRow, CategoryRule } from "@/lib/types";

const sampleRules: CategoryRule[] = [
  {
    slug: "gloves",
    titleKey: "products.gloves",
    keywords: ["rękawice", "gloves"],
    kodPrefixes: ["R-"],
    exactKods: [],
  },
  {
    slug: "other",
    titleKey: "products.other",
    keywords: [],
    kodPrefixes: [],
    exactKods: [],
  },
];

describe("categorizeCatalog", () => {
  it("groups rows by category", () => {
    const rows: CatalogRow[] = [
      { Kod: "R-001", Nazwa: "Rękawice robocze", CenaNetto: "10" },
      { Kod: "X-001", Nazwa: "Unknown item", CenaNetto: "5" },
    ];
    const sections = categorizeCatalog(rows, sampleRules);
    expect(sections).toHaveLength(2);
    const glovesSection = sections.find((s) => s.slug === "gloves");
    const otherSection = sections.find((s) => s.slug === "other");
    expect(glovesSection?.items).toHaveLength(1);
    expect(glovesSection?.items[0].Kod).toBe("R-001");
    expect(otherSection?.items).toHaveLength(1);
    expect(otherSection?.items[0].Kod).toBe("X-001");
  });

  it("attaches categorySlug to each row", () => {
    const rows: CatalogRow[] = [
      { Kod: "R-001", Nazwa: "Rękawice", CenaNetto: "10" },
    ];
    const sections = categorizeCatalog(rows, sampleRules);
    expect(sections[0].items[0].categorySlug).toBe("gloves");
  });

  it("excludes rows by Kod when excludeKods provided", () => {
    const rows: CatalogRow[] = [
      { Kod: "R-001", Nazwa: "Rękawice", CenaNetto: "10" },
      { Kod: "R-002", Nazwa: "Rękawice 2", CenaNetto: "20" },
    ];
    const sections = categorizeCatalog(rows, sampleRules, ["r-001"]);
    const glovesSection = sections.find((s) => s.slug === "gloves");
    expect(glovesSection?.items).toHaveLength(1);
    expect(glovesSection?.items[0].Kod).toBe("R-002");
  });

  it("filters out empty sections", () => {
    const rulesWithExtra: CategoryRule[] = [
      ...sampleRules,
      {
        slug: "empty-cat",
        titleKey: "products.empty",
        keywords: ["nonexistent"],
        kodPrefixes: [],
        exactKods: [],
      },
    ];
    const rows: CatalogRow[] = [
      { Kod: "R-001", Nazwa: "Rękawice", CenaNetto: "10" },
    ];
    const sections = categorizeCatalog(rows, rulesWithExtra);
    expect(sections.find((s) => s.slug === "empty-cat")).toBeUndefined();
  });

  it("throws when rules invalid", () => {
    expect(() => categorizeCatalog([], [])).toThrow("Invalid category rules");
    expect(() =>
      categorizeCatalog([], null as unknown as CategoryRule[]),
    ).toThrow();
  });

  it("exactKods overrides keyword/prefix match", () => {
    const rules: CategoryRule[] = [
      {
        slug: "exact",
        titleKey: "products.exact",
        keywords: [],
        kodPrefixes: [],
        exactKods: ["SPECIAL-001"],
      },
      {
        slug: "prefix",
        titleKey: "products.prefix",
        keywords: [],
        kodPrefixes: ["SPEC"],
        exactKods: [],
      },
    ];
    const rows: CatalogRow[] = [
      { Kod: "SPECIAL-001", Nazwa: "Special item", CenaNetto: "10" },
    ];
    const sections = categorizeCatalog(rows, rules);
    const exactSection = sections.find((s) => s.slug === "exact");
    expect(exactSection?.items).toHaveLength(1);
    expect(exactSection?.items[0].Kod).toBe("SPECIAL-001");
  });
});
