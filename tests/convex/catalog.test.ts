/**
 * Convex catalog function tests.
 * Uses convex-test (mock backend) - required for Convex ctx/db.
 */
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";

const modules = import.meta.glob("../../convex/**/*.ts");

describe("catalog queries", () => {
  it("listCatalogSections returns empty array when no data", async () => {
    const t = convexTest(schema, modules);
    const sections = await t.query(api.catalog.listCatalogSections);
    expect(sections).toEqual([]);
  });

  it("listCategories returns empty array when no categories", async () => {
    const t = convexTest(schema, modules);
    const cats = await t.query(api.catalog.listCategories);
    expect(cats).toEqual([]);
  });

  it("listCategorySlugs returns empty array when no categories", async () => {
    const t = convexTest(schema, modules);
    const slugs = await t.query(api.catalog.listCategorySlugs);
    expect(slugs).toEqual([]);
  });

  it("getCatalogSection returns null for non-existent slug", async () => {
    const t = convexTest(schema, modules);
    const section = await t.query(api.catalog.getCatalogSection, {
      slug: "nonexistent",
    });
    expect(section).toBeNull();
  });
});

describe("catalog mutations with seeded data", () => {
  it("createCategory then listCategories returns the category", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "test-category",
      displayName: "Test Category",
    });
    const cats = await t.query(api.catalog.listCategories);
    expect(cats).toHaveLength(1);
    expect(cats[0].slug).toBe("test-category");
    expect(cats[0].displayName).toBe("Test Category");
  });

  it("createProduct then listCatalogSections includes the product", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "gloves",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "TEST-001",
        Nazwa: "Test Gloves",
        Opis: "Test description",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    const sections = await t.query(api.catalog.listCatalogSections);
    expect(sections).toHaveLength(1);
    expect(sections[0].slug).toBe("gloves");
    expect(sections[0].items).toHaveLength(1);
    expect(sections[0].items[0].Kod).toBe("TEST-001");
    expect(sections[0].items[0].Nazwa).toBe("Test Gloves");
  });

  it("updateProduct modifies product", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "gloves",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "UPD-001",
        Nazwa: "Original Name",
        Opis: "Original description",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    const updated = await t.mutation(api.catalog.updateProduct, {
      kod: "UPD-001",
      updates: { Nazwa: "Updated Name", Opis: "Updated description" },
    });
    expect(updated.Nazwa).toBe("Updated Name");
    expect(updated.Opis).toBe("Updated description");
  });

  it("deleteProduct removes product", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "gloves",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "DEL-001",
        Nazwa: "To Delete",
        Opis: "Will be deleted",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    await t.mutation(api.catalog.deleteProduct, { kod: "DEL-001" });
    const sections = await t.query(api.catalog.listCatalogSections);
    expect(sections[0].items).toHaveLength(0);
  });

  it("createProduct throws error when category does not exist", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.catalog.createProduct, {
        categorySlug: "nonexistent",
        row: {
          Rodzaj: "T",
          JednostkaMiary: "szt",
          StawkaVAT: "23",
          Kod: "ERR-001",
          Nazwa: "Error Product",
          Opis: "",
          ProductDescription: "",
          CenaNetto: "10.00",
          KodKlasyfikacji: "X",
          Uwagi: "",
          OstatniaCenaZakupu: "9",
          OstatniaDataZakupu: "2024-01-01",
        },
      }),
    ).rejects.toThrow("Category not found");
  });

  it("createProduct throws error when product code already exists", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    const productData = {
      categorySlug: "gloves",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "DUP-001",
        Nazwa: "Duplicate Product",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    };
    await t.mutation(api.catalog.createProduct, productData);
    await expect(
      t.mutation(api.catalog.createProduct, productData),
    ).rejects.toThrow("already exists");
  });

  it("createCategory throws error when slug already exists", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "test-slug",
      displayName: "Test",
    });
    await expect(
      t.mutation(api.catalog.createCategory, {
        slug: "test-slug",
        displayName: "Another Test",
      }),
    ).rejects.toThrow("already exists");
  });

  it("deleteCategory throws error when category has products", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "protected",
      displayName: "Protected Category",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "protected",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "PROT-001",
        Nazwa: "Protected Product",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    await expect(
      t.mutation(api.catalog.deleteCategory, { slug: "protected" }),
    ).rejects.toThrow("contains");
  });

  it("deleteCategory succeeds when category is empty", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "empty",
      displayName: "Empty Category",
    });
    await t.mutation(api.catalog.deleteCategory, { slug: "empty" });
    const cats = await t.query(api.catalog.listCategories);
    expect(cats).toHaveLength(0);
  });

  it("updateProduct throws error when product not found", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.catalog.updateProduct, {
        kod: "NONEXISTENT-001",
        updates: { Nazwa: "New Name" },
      }),
    ).rejects.toThrow("Product not found");
  });

  it("deleteProduct throws error when product not found", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.catalog.deleteProduct, {
        kod: "NONEXISTENT-002",
      }),
    ).rejects.toThrow("Product not found");
  });

  it("createCategory normalizes slug with spaces", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "Test Category With Spaces",
      displayName: "Test",
    });
    const cats = await t.query(api.catalog.listCategories);
    expect(cats[0].slug).toBe("test-category-with-spaces");
  });

  it("createCategory throws error for invalid slug characters", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.catalog.createCategory, {
        slug: "invalid@slug!",
        displayName: "Test",
      }),
    ).rejects.toThrow("Slug can only contain");
  });

  it("createProduct throws error when Kod is empty", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "test",
      displayName: "Test",
    });
    await expect(
      t.mutation(api.catalog.createProduct, {
        categorySlug: "test",
        row: {
          Rodzaj: "T",
          JednostkaMiary: "szt",
          StawkaVAT: "23",
          Kod: "   ", // Empty after trim
          Nazwa: "Test",
          Opis: "",
          ProductDescription: "",
          CenaNetto: "10.00",
          KodKlasyfikacji: "X",
          Uwagi: "",
          OstatniaCenaZakupu: "9",
          OstatniaDataZakupu: "2024-01-01",
        },
      }),
    ).rejects.toThrow("cannot be empty");
  });

  it("updateProduct accepts payload shaped like Edit Product form", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "cat-a",
      displayName: "Category A",
    });
    await t.mutation(api.catalog.createCategory, {
      slug: "cat-b",
      displayName: "Category B",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "cat-a",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "FORM-001",
        Nazwa: "Original",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    const updates: Record<string, string> = {
      Nazwa: "Updated name",
      ProductDescription: "Short product desc",
      CenaNetto: "33.33",
      JednostkaMiary: "kg",
      StawkaVAT: "8",
      categorySlug: "cat-b",
      Heading: "Custom heading",
      Subheading: "Custom sub",
      Description: "<p>Rich <strong>HTML</strong> description</p>",
    };
    const result = await t.mutation(api.catalog.updateProduct, {
      kod: "FORM-001",
      updates,
    });
    expect(result.Nazwa).toBe(updates.Nazwa);
    expect(result.ProductDescription).toBe(updates.ProductDescription);
    expect(result.CenaNetto).toBe(updates.CenaNetto);
    expect(result.JednostkaMiary).toBe(updates.JednostkaMiary);
    expect(result.StawkaVAT).toBe(updates.StawkaVAT);
    expect(result.categorySlug).toBe(updates.categorySlug);
    expect(result.Heading).toBe(updates.Heading);
    expect(result.Subheading).toBe(updates.Subheading);
    expect(result.Description).toBe(updates.Description);
  });

  it("updateProduct ignores keys not in ALLOWED_UPDATE_KEYS", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "test",
      displayName: "Test",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "test",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "IGNORE-001",
        Nazwa: "Original",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    const result = await t.mutation(api.catalog.updateProduct, {
      kod: "IGNORE-001",
      updates: {
        Nazwa: "Updated",
        NotAnAllowedKey: "ignored",
        AlsoNotAllowed: "ignored",
      },
    });
    expect(result.Nazwa).toBe("Updated");
    expect((result as Record<string, unknown>)["NotAnAllowedKey"]).toBeUndefined();
    expect((result as Record<string, unknown>)["AlsoNotAllowed"]).toBeUndefined();
  });

  it("updateProduct with empty updates returns unchanged product", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "test",
      displayName: "Test",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "test",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "NOUPDATE-001",
        Nazwa: "Original",
        Opis: "Original description",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });
    const result = await t.mutation(api.catalog.updateProduct, {
      kod: "NOUPDATE-001",
      updates: {},
    });
    expect(result.Nazwa).toBe("Original");
  });

  it("setCategories requires confirmDestruction flag", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.catalog.setCategories, {
        categories: [{ slug: "test", titleKey: "test.key" }],
      }),
    ).rejects.toThrow("confirmation");
  });

  it("setCategories with confirmDestruction replaces all categories", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "old-category",
      displayName: "Old",
    });
    await t.mutation(api.catalog.setCategories, {
      categories: [{ slug: "new-category", titleKey: "new.key" }],
      confirmDestruction: true,
    });
    const cats = await t.query(api.catalog.listCategories);
    expect(cats).toHaveLength(1);
    expect(cats[0].slug).toBe("new-category");
  });

  it("setCategories throws on empty array", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.catalog.setCategories, {
        categories: [],
        confirmDestruction: true,
      }),
    ).rejects.toThrow("cannot be empty");
  });
});

describe("subcategories", () => {
  it("listSubcategories returns empty when category has none", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    const subs = await t.query(api.catalog.listSubcategories, {
      categorySlug: "gloves",
    });
    expect(subs).toEqual([]);
  });

  it("createSubcategory then listSubcategories returns the subcategory", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      slug: "gumowe",
      displayName: "Gumowe",
      order: 1,
    });
    const subs = await t.query(api.catalog.listSubcategories, {
      categorySlug: "gloves",
    });
    expect(subs).toHaveLength(1);
    expect(subs[0].slug).toBe("gumowe");
    expect(subs[0].displayName).toBe("Gumowe");
  });

  it("createSubcategory without slug auto-generates unique slug from displayName", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    const result = await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      displayName: "Gumowe",
    });
    expect((result as { slug: string }).slug).toBe("gumowe");
    const subs = await t.query(api.catalog.listSubcategories, {
      categorySlug: "gloves",
    });
    expect(subs).toHaveLength(1);
    expect(subs[0].slug).toBe("gumowe");
    expect(subs[0].displayName).toBe("Gumowe");
  });

  it("createSubcategory without slug adds random suffix when displayName would collide", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      displayName: "Gumowe",
    });
    const result = await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      displayName: "Gumowe",
    });
    const slug = (result as { slug: string }).slug;
    expect(slug).toMatch(/^gumowe-[a-z0-9]{5}$/);
    expect(slug).not.toBe("gumowe");
    const subs = await t.query(api.catalog.listSubcategories, {
      categorySlug: "gloves",
    });
    expect(subs).toHaveLength(2);
    const slugs = subs.map((s) => s.slug);
    expect(slugs).toContain("gumowe");
    expect(slugs).toContain(slug);
  });

  it("createSubcategory throws when slug already exists in category", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      slug: "gumowe",
      displayName: "Gumowe",
    });
    await expect(
      t.mutation(api.catalog.createSubcategory, {
        categorySlug: "gloves",
        slug: "gumowe",
        displayName: "Other",
      }),
    ).rejects.toThrow("already exists");
  });

  it("createProduct with subcategorySlug stores and getCatalogSection returns subcategories", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      slug: "gumowe",
      displayName: "Gumowe",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "gloves",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "G-001",
        Nazwa: "Nitrile Gloves",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
      subcategorySlug: "gumowe",
    });
    const section = await t.query(api.catalog.getCatalogSection, {
      slug: "gloves",
    });
    expect(section).not.toBeNull();
    expect(section!.subcategories).toHaveLength(1);
    expect(section!.items).toHaveLength(1);
    expect(section!.items[0].subcategorySlug).toBe("gumowe");
  });

  it("createProduct throws when subcategorySlug not in category", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await expect(
      t.mutation(api.catalog.createProduct, {
        categorySlug: "gloves",
        row: {
          Rodzaj: "T",
          JednostkaMiary: "szt",
          StawkaVAT: "23",
          Kod: "G-002",
          Nazwa: "Product",
          Opis: "",
          ProductDescription: "",
          CenaNetto: "10",
          KodKlasyfikacji: "X",
          Uwagi: "",
          OstatniaCenaZakupu: "9",
          OstatniaDataZakupu: "2024-01-01",
        },
        subcategorySlug: "nonexistent",
      }),
    ).rejects.toThrow("Subcategory");
  });

  it("deleteSubcategory succeeds when no products use it", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      slug: "gumowe",
      displayName: "Gumowe",
    });
    await t.mutation(api.catalog.deleteSubcategory, {
      categorySlug: "gloves",
      slug: "gumowe",
    });
    const subs = await t.query(api.catalog.listSubcategories, {
      categorySlug: "gloves",
    });
    expect(subs).toEqual([]);
  });

  it("deleteSubcategory throws when products use it", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    await t.mutation(api.catalog.createSubcategory, {
      categorySlug: "gloves",
      slug: "gumowe",
      displayName: "Gumowe",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "gloves",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "G-003",
        Nazwa: "Product",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
      subcategorySlug: "gumowe",
    });
    await expect(
      t.mutation(api.catalog.deleteSubcategory, {
        categorySlug: "gloves",
        slug: "gumowe",
      }),
    ).rejects.toThrow("used by");
  });

  it("seedGlovesSubcategories creates default subcategories", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.catalog.createCategory, {
      slug: "gloves",
      displayName: "Gloves",
    });
    const result = await t.mutation(api.catalog.seedGlovesSubcategories, {});
    expect((result as { created: number }).created).toBe(5);
    const subs = await t.query(api.catalog.listSubcategories, {
      categorySlug: "gloves",
    });
    expect(subs).toHaveLength(5);
    const slugs = subs.map((s) => s.slug);
    expect(slugs).toContain("podgumowane");
    expect(slugs).toContain("gumowe");
    expect(slugs).toContain("bawelniane");
    expect(slugs).toContain("ocieplane");
  });
});
