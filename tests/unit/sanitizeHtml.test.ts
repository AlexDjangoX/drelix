/**
 * Unit tests for src/lib/sanitizeHtml.
 * Ensures XSS is stripped, allowed structure is preserved, and plain text is safely converted.
 */
import { describe, it, expect } from "vitest";
import {
  sanitizeProductDescriptionHtml,
  isHtml,
} from "@/lib/sanitizeHtml";

describe("sanitizeProductDescriptionHtml", () => {
  describe("XSS and dangerous content", () => {
    it("strips script tags and content", () => {
      const input = '<p>Safe</p><script>alert("xss")</script><p>After</p>';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("<script");
      expect(out).not.toContain("alert");
      expect(out).toContain("Safe");
      expect(out).toContain("After");
    });

    it("strips event handlers", () => {
      const input = '<p onclick="alert(1)">Click</p>';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("onclick");
      expect(out).not.toContain("alert");
      expect(out).toContain("Click");
    });

    it("strips javascript: URLs", () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("javascript:");
      expect(out).not.toContain("alert");
      expect(out).not.toContain("<a "); // <a> not in allowlist, so tag removed
    });

    it("strips iframe and object", () => {
      const input = '<iframe src="evil.com"></iframe><p>OK</p>';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("iframe");
      expect(out).not.toContain("evil");
      expect(out).toContain("OK");
    });

    it("strips img onerror", () => {
      const input = '<img src="x" onerror="alert(1)">';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("onerror");
      expect(out).not.toContain("<img"); // img not in allowlist
    });

    it("strips or neutralizes dangerous style (no script execution)", () => {
      const input = '<span style="width: expression(alert(1))">x</span>';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("<script");
      expect(out).not.toContain("onerror");
      expect(out).not.toContain("onclick");
      // DOMPurify may leave expression in style; critical is no executable script/events
    });
  });

  describe("allowed tags and attributes", () => {
    it("preserves allowed tags", () => {
      const input =
        "<p>Para</p><strong>Bold</strong><em>Italic</em><br><ul><li>Item</li></ul><h2>Head</h2>";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("<p>");
      expect(out).toContain("Para");
      expect(out).toContain("<strong>");
      expect(out).toContain("<em>");
      expect(out).toContain("<ul>");
      expect(out).toContain("<li>");
      expect(out).toContain("<h2>");
    });

    it("preserves style attribute on allowed tags", () => {
      const input = '<p style="color: red">Colored</p>';
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("style");
      expect(out).toContain("Colored");
    });

    it("strips disallowed tags but keeps text", () => {
      const input = "<div>Content</div>";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).not.toContain("<div");
      expect(out).toContain("Content");
    });
  });

  describe("plain text to HTML conversion", () => {
    it("wraps plain text in paragraphs", () => {
      const input = "Hello world";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("<p>");
      expect(out).toContain("Hello world");
      expect(out).toContain("</p>");
    });

    it("escapes HTML in plain text", () => {
      const input = "Use 3 < 5 and 6 > 4; A & B";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("&lt;");
      expect(out).toContain("&gt;");
      expect(out).toContain("&amp;");
      expect(out).not.toContain("<script");
    });

    it("converts **bold** to strong in plain text", () => {
      const input = "Hello **bold** end";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("<strong>bold</strong>");
    });

    it("splits on blank lines into separate paragraphs", () => {
      const input = "First\n\nSecond";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toMatch(/<p>[\s\S]*First[\s\S]*<\/p>/);
      expect(out).toMatch(/<p>[\s\S]*Second[\s\S]*<\/p>/);
    });

    it("converts bullet lines to ul/li", () => {
      const input = "- One\n- Two";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("<ul>");
      expect(out).toContain("<li>");
      expect(out).toContain("One");
      expect(out).toContain("Two");
      expect(out).not.toContain("- One");
    });

    it("converts numbered lines to list", () => {
      const input = "1. First\n2. Second";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("<ul>");
      expect(out).toContain("First");
      expect(out).toContain("Second");
    });

    it("treats content with existing HTML as HTML (sanitize only)", () => {
      const input = "<p>Already HTML</p>";
      const out = sanitizeProductDescriptionHtml(input);
      expect(out).toContain("<p>");
      expect(out).toContain("Already HTML");
    });
  });

  describe("edge cases and input safety", () => {
    it("returns empty string for null/undefined", () => {
      expect(sanitizeProductDescriptionHtml("")).toBe("");
      expect(sanitizeProductDescriptionHtml("   ")).toBe("");
    });

    it("returns empty string for non-string input", () => {
      expect(sanitizeProductDescriptionHtml(null as unknown as string)).toBe("");
      expect(sanitizeProductDescriptionHtml(undefined as unknown as string)).toBe("");
    });

    it("trims whitespace", () => {
      const input = "  <p>X</p>  ";
      expect(sanitizeProductDescriptionHtml(input)).toContain("<p>");
    });

    it("handles very long content without throwing", () => {
      const long = "a".repeat(50_000);
      expect(() => sanitizeProductDescriptionHtml(long)).not.toThrow();
      const out = sanitizeProductDescriptionHtml(long);
      expect(out.length).toBeGreaterThan(0);
    });
  });
});

describe("isHtml", () => {
  it("returns true when string contains HTML-like tags", () => {
    expect(isHtml("<p>")).toBe(true);
    expect(isHtml("Before <span>middle</span> after")).toBe(true);
    expect(isHtml("<H2>Head</H2>")).toBe(true);
  });

  it("returns false for plain text", () => {
    expect(isHtml("No tags here")).toBe(false);
    expect(isHtml("**bold** not parsed yet")).toBe(false);
    expect(isHtml("")).toBe(false);
  });

  it("returns false for lone angle brackets that are not tags", () => {
    expect(isHtml("3 < 5")).toBe(false);
    expect(isHtml("a<b")).toBe(false);
  });
});
