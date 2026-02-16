/**
 * Unit tests for Edit Product form schema (editProductSchema).
 * Ensures validation rules match backend/UX requirements and reject invalid data.
 */
import { describe, it, expect } from "vitest";
import { editProductSchema } from "@/components/admin/EditProductModal/editProductSchema";

const validPayload = {
  Kod: "APT-001",
  Nazwa: "Test product",
  ProductDescription: "",
  CenaNetto: "33.33",
  JednostkaMiary: "szt",
  StawkaVAT: "23",
  categorySlug: "first-aid",
  Heading: "",
  Subheading: "",
  Description: "",
};

describe("editProductSchema", () => {
  describe("valid payload", () => {
    it("accepts minimal valid payload", () => {
      const result = editProductSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("accepts optional fields when set", () => {
      const full = {
        ...validPayload,
        ProductDescription: "Short desc",
        Heading: "Custom heading",
        Subheading: "Custom sub",
        Description: "<p>Rich <strong>HTML</strong> here</p>",
      };
      expect(editProductSchema.safeParse(full).success).toBe(true);
    });

    it("accepts Kod at max length 100", () => {
      const payload = { ...validPayload, Kod: "A".repeat(100) };
      expect(editProductSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts Nazwa at max length 500", () => {
      const payload = { ...validPayload, Nazwa: "N".repeat(500) };
      expect(editProductSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts categorySlug at max length 100", () => {
      const payload = { ...validPayload, categorySlug: "c".repeat(100) };
      expect(editProductSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts Description at max length 100_000", () => {
      const payload = { ...validPayload, Description: "D".repeat(100_000) };
      expect(editProductSchema.safeParse(payload).success).toBe(true);
    });
  });

  describe("required fields", () => {
    it("rejects empty Kod", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        Kod: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msg = result.error.flatten().fieldErrors.Kod?.[0];
        expect(msg).toContain("Kod");
      }
    });

    it("accepts non-empty Kod (schema does not trim; trim in UI if needed)", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        Kod: "   ABC   ",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty Nazwa", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        Nazwa: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msg = result.error.flatten().fieldErrors.Nazwa?.[0];
        expect(msg).toContain("Nazwa");
      }
    });

    it("rejects empty categorySlug", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        categorySlug: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msg = result.error.flatten().fieldErrors.categorySlug?.[0];
        expect(msg).toContain("Kategoria");
      }
    });
  });

  describe("max length", () => {
    it("rejects Kod over 100 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        Kod: "A".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("rejects Nazwa over 500 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        Nazwa: "N".repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it("rejects ProductDescription over 500 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        ProductDescription: "P".repeat(501),
      });
      expect(result.success).toBe(false);
    });

    it("rejects CenaNetto over 50 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        CenaNetto: "1".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("rejects JednostkaMiary over 50 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        JednostkaMiary: "j".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("rejects StawkaVAT over 50 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        StawkaVAT: "s".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("rejects categorySlug over 100 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        categorySlug: "c".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("rejects Description over 100_000 characters", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        Description: "D".repeat(100_001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("optional fields can be empty", () => {
    it("accepts empty ProductDescription, CenaNetto, JednostkaMiary, StawkaVAT", () => {
      const payload = {
        ...validPayload,
        ProductDescription: "",
        CenaNetto: "",
        JednostkaMiary: "",
        StawkaVAT: "",
      };
      expect(editProductSchema.safeParse(payload).success).toBe(true);
    });

    it("accepts empty Heading, Subheading, Description", () => {
      const payload = {
        ...validPayload,
        Heading: "",
        Subheading: "",
        Description: "",
      };
      expect(editProductSchema.safeParse(payload).success).toBe(true);
    });
  });

  describe("type safety", () => {
    it("rejects missing required keys", () => {
      const { Kod, ...withoutKod } = validPayload;
      expect(editProductSchema.safeParse(withoutKod).success).toBe(false);
    });

    it("rejects number where string expected", () => {
      const result = editProductSchema.safeParse({
        ...validPayload,
        CenaNetto: 33.33 as unknown as string,
      });
      expect(result.success).toBe(false);
    });
  });
});
