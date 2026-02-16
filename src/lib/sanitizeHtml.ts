/**
 * Product description HTML: sanitize and optionally convert plain text to structure.
 * - If pasted content already has HTML tags → sanitize only (structure preserved).
 * - If plain text → apply structure-only rules (no product-specific logic):
 *   - Blank lines separate paragraphs (<p>).
 *   - Lines starting with a bullet (-, *, •, ·) or "1." style numbering → <ul>/<ol><li>.
 *   - **text** → <strong>text</strong>.
 * Uses isomorphic-dompurify for identical output on server and client.
 */

import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i",
  "ul", "ol", "li", "sub", "sup", "span",
  "h2", "h3",
];

const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR: ["style"] as string[],
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace **bold** with <strong>bold</strong> in already-escaped text (so we don't escape the tags). */
function boldToHtml(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** True if line looks like a list item: leading bullet (- * • ·) or numbering (1. 2. etc.). */
function isListLine(trimmed: string): boolean {
  return /^[-*•·]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
}

/** Strip leading bullet or number from list line; return inner text. */
function stripListPrefix(trimmed: string): string {
  const bullet = trimmed.match(/^[-*•·]\s+(.*)/);
  if (bullet) return bullet[1].trim();
  const num = trimmed.match(/^\d+\.\s+(.*)/);
  if (num) return num[1].trim();
  return trimmed;
}

/**
 * Convert plain text to HTML using only structure (paragraphs, list lines, **bold**).
 * No product- or language-specific keywords.
 */
function plainTextToStructuredHtml(text: string): string {
  const lines = text.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  let paragraphLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) return;
    const block = paragraphLines.join("\n").trim();
    paragraphLines = [];
    if (!block) return;
    const escaped = escapeHtml(block);
    const withBold = boldToHtml(escaped);
    out.push("<p>", withBold.replace(/\n/g, "<br>"), "</p>");
  }

  function endList() {
    if (!inList) return;
    inList = false;
    out.push("</ul>");
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      if (inList) endList();
      else flushParagraph();
      continue;
    }

    if (isListLine(trimmed)) {
      flushParagraph();
      if (!inList) {
        inList = true;
        out.push("<ul>");
      }
      const inner = stripListPrefix(trimmed);
      out.push("<li>", boldToHtml(escapeHtml(inner)), "</li>");
      continue;
    }

    if (inList) {
      endList();
    }
    paragraphLines.push(line);
  }

  flushParagraph();
  endList();
  return out.join("");
}

export function sanitizeProductDescriptionHtml(html: string): string {
  if (!html || typeof html !== "string") return "";
  const trimmed = html.trim();
  const hasTags = /<[a-z][\s\S]*>/i.test(trimmed);
  const toSanitize = hasTags ? trimmed : plainTextToStructuredHtml(trimmed);
  try {
    return DOMPurify.sanitize(toSanitize, SANITIZE_CONFIG);
  } catch {
    return stripTags(toSanitize);
  }
}

/** Detect if a string contains HTML tags (e.g. for conditional handling). */
export function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}
