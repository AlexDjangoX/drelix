/** Footwear variant codes — keep in sync with `convex/lib/validators.ts`. */
export const OBUWIE_WARIANT_OPTIONS = [
  { value: "z" as const, label: "Z blachą", short: "z" },
  { value: "bz" as const, label: "Bez blachy", short: "bz" },
  { value: "z-bz" as const, label: "Z blachą i bez", short: "z-bz" },
  { value: "pd" as const, label: "Z podnoskiem kompozytem", short: "pd" },
] as const;

const VALID = new Set<string>(
  OBUWIE_WARIANT_OPTIONS.map((o) => o.value),
);

/** Footwear categories where obuwie variant shows on grid cards. */
export const OBUWIE_PILL_CATEGORY_SLUGS = new Set<string>([
  "polbuty",
  "trzewiki",
  "sandaly",
  "klapki",
  "kalosze",
]);

export function shouldShowObuwiePillOnPhoto(
  categorySlug: string | undefined,
): boolean {
  if (!categorySlug?.trim()) return false;
  return OBUWIE_PILL_CATEGORY_SLUGS.has(categorySlug.trim());
}

/** Full Polish label + short code for badges (storefront). */
export function obuwieWariantPillContent(
  raw: string | undefined,
): { pillLabel: string; fullLabel: string } | null {
  const t = String(raw ?? "").trim();
  if (!t || !VALID.has(t)) return null;
  const o = OBUWIE_WARIANT_OPTIONS.find((x) => x.value === t);
  if (!o) return null;
  const pillLabel = o.short.replace(/-/g, "·").toUpperCase();
  return { pillLabel, fullLabel: o.label };
}

/** Map stored/API value to a valid `<select>` value (`""` = brak). */
export function normalizeObuwieWariantForForm(
  raw: unknown,
): "" | "z" | "bz" | "z-bz" | "pd" {
  const t = String(raw ?? "").trim();
  if (t === "") return "";
  return VALID.has(t) ? (t as "z" | "bz" | "z-bz" | "pd") : "";
}
