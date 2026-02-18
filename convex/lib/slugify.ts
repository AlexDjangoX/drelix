/**
 * Slugify display names for subcategories (and similar) so they are URL-safe
 * and unique when combined with a short random suffix on collision.
 */

/** Polish/European diacritics → ASCII for slug. */
const DIACRITICS: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  ä: "a",
  ö: "o",
  ü: "u",
  ß: "ss",
  æ: "ae",
  ø: "o",
};

/**
 * Converts a display name to a slug-safe base (lowercase, hyphens, a-z0-9).
 * Does not guarantee uniqueness; use with a unique suffix when needed.
 */
export function slugifyDisplayName(text: string): string {
  let s = text.trim().toLowerCase();
  for (const [char, replacement] of Object.entries(DIACRITICS)) {
    s = s.replace(new RegExp(char, "g"), replacement);
  }
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9_-]/g, "");
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return s || "sub";
}

/** Generate a short random alphanumeric string (5 chars). */
export function shortRandomId(): string {
  return Math.random().toString(36).slice(2, 7);
}
