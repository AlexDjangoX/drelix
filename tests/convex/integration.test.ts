/**
 * Integration tests for complete catalog workflows.
 * Tests realistic admin scenarios with multiple operations.
 */
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";

const modules = import.meta.glob("../../convex/**/*.ts");

describe("complete catalog workflow", () => {
  it("full admin workflow: create category, add product, update, delete", async () => {
    const t = convexTest(schema, modules);

    // 1. Create category
    await t.mutation(api.catalog.createCategory, {
      slug: "workflow-test",
      displayName: "Workflow Test Category",
    });

    // 2. Verify category exists
    const cats1 = await t.query(api.catalog.listCategories);
    expect(cats1).toHaveLength(1);
    expect(cats1[0].slug).toBe("workflow-test");

    // 3. Add product
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "workflow-test",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "WF-001",
        Nazwa: "Workflow Product",
        Opis: "Test workflow description",
        ProductDescription: "",
        CenaNetto: "99.99",
        KodKlasyfikacji: "TEST",
        Uwagi: "Test notes",
        OstatniaCenaZakupu: "80",
        OstatniaDataZakupu: "2024-01-01",
      },
    });

    // 4. Verify product in catalog
    const section = await t.query(api.catalog.getCatalogSection, {
      slug: "workflow-test",
    });
    expect(section).not.toBeNull();
    expect(section!.items).toHaveLength(1);
    expect(section!.items[0].Kod).toBe("WF-001");

    // 5. Update product
    const updated = await t.mutation(api.catalog.updateProduct, {
      kod: "WF-001",
      updates: { Nazwa: "Updated Name", CenaNetto: "89.99" },
    });
    expect(updated.Nazwa).toBe("Updated Name");
    expect(updated.CenaNetto).toBe("89.99");

    // 6. Cannot delete category with products
    await expect(
      t.mutation(api.catalog.deleteCategory, { slug: "workflow-test" }),
    ).rejects.toThrow("contains");

    // 7. Delete product
    await t.mutation(api.catalog.deleteProduct, { kod: "WF-001" });

    // 8. Now can delete category
    await t.mutation(api.catalog.deleteCategory, { slug: "workflow-test" });

    // 9. Verify everything deleted
    const cats2 = await t.query(api.catalog.listCategories);
    expect(cats2).toHaveLength(0);
  });

  it("replaceCatalogFromSections replaces entire catalog", async () => {
    const t = convexTest(schema, modules);

    // Create initial category and product
    await t.mutation(api.catalog.createCategory, {
      slug: "old-category",
      displayName: "Old Category",
    });
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "old-category",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "OLD-001",
        Nazwa: "Old Product",
        Opis: "Old description",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });

    // Replace with new catalog
    await t.mutation(api.catalog.replaceCatalogFromSections, {
      sections: [
        {
          slug: "new-category",
          titleKey: "products.new",
          items: [
            {
              Rodzaj: "T",
              JednostkaMiary: "szt",
              StawkaVAT: "23",
              Kod: "NEW-001",
              Nazwa: "New Product",
              Opis: "New description",
              ProductDescription: "",
              CenaNetto: "20.00",
              KodKlasyfikacji: "Y",
              Uwagi: "",
              OstatniaCenaZakupu: "18",
              OstatniaDataZakupu: "2025-01-01",
            },
          ],
        },
      ],
    });

    // Verify old product deleted, new product exists
    const sections = await t.query(api.catalog.listCatalogSections);
    expect(sections).toHaveLength(2); // new-category + old-category (custom, preserved)
    const newSection = sections.find((s) => s.slug === "new-category");
    expect(newSection).toBeDefined();
    expect(newSection!.items).toHaveLength(1);
    expect(newSection!.items[0].Kod).toBe("NEW-001");

    // Old custom category should be preserved (has displayName)
    const oldCat = sections.find((s) => s.slug === "old-category");
    expect(oldCat).toBeDefined();
    expect(oldCat!.items).toHaveLength(0); // Products deleted
  });

  it("multiple products in same category sorted alphabetically", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(api.catalog.createCategory, {
      slug: "sorted",
      displayName: "Sorted Category",
    });

    // Add products in non-alphabetical order
    await t.mutation(api.catalog.createProduct, {
      categorySlug: "sorted",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "S-001",
        Nazwa: "Zebra Product",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });

    await t.mutation(api.catalog.createProduct, {
      categorySlug: "sorted",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "S-002",
        Nazwa: "Alpha Product",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });

    await t.mutation(api.catalog.createProduct, {
      categorySlug: "sorted",
      row: {
        Rodzaj: "T",
        JednostkaMiary: "szt",
        StawkaVAT: "23",
        Kod: "S-003",
        Nazwa: "Beta Product",
        Opis: "",
        ProductDescription: "",
        CenaNetto: "10.00",
        KodKlasyfikacji: "X",
        Uwagi: "",
        OstatniaCenaZakupu: "9",
        OstatniaDataZakupu: "2024-01-01",
      },
    });

    const section = await t.query(api.catalog.getCatalogSection, {
      slug: "sorted",
    });

    expect(section!.items).toHaveLength(3);
    expect(section!.items[0].Nazwa).toBe("Alpha Product");
    expect(section!.items[1].Nazwa).toBe("Beta Product");
    expect(section!.items[2].Nazwa).toBe("Zebra Product");
  });

  it("category slugs returned in correct sort order", async () => {
    const t = convexTest(schema, modules);

    // Create categories: admin-created (newest first), then alphabetical
    await t.mutation(api.catalog.createCategory, {
      slug: "zebra",
      displayName: "Zebra (created first)",
    });

    await t.mutation(api.catalog.createCategory, {
      slug: "alpha",
      displayName: "Alpha (created second)",
    });

    // Seed categories (no displayName, sorted by slug)
    await t.mutation(api.catalog.setCategories, {
      categories: [
        { slug: "seed-z", titleKey: "z" },
        { slug: "seed-a", titleKey: "a" },
      ],
      confirmDestruction: true,
    });

    const slugs = await t.query(api.catalog.listCategorySlugs);
    // Should be: seed-a, seed-z (alphabetical, no createdAt)
    expect(slugs[0]).toBe("seed-a");
    expect(slugs[1]).toBe("seed-z");
  });
});
