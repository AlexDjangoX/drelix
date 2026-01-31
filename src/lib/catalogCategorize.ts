/**
 * Shared catalog categorization (browser + server).
 * Takes CSV rows and category rules, returns sections grouped by category.
 */

export type CategoryRule = {
  slug: string;
  titleKey: string;
  keywords?: string[];
  kodPrefixes?: string[];
};

export type CatalogRow = Record<string, string>;

export type CatalogSection = {
  slug: string;
  titleKey: string;
  items: CatalogRow[];
};

const NAZWA = "Nazwa";
const KOD = "Kod";

function matchesCategory(row: CatalogRow, config: CategoryRule): boolean {
  const nazwaUpper = (row[NAZWA] ?? "").toUpperCase();
  const kod = (row[KOD] ?? "").toUpperCase();
  if (config.keywords?.length) {
    for (const kw of config.keywords) {
      if (nazwaUpper.includes(kw.toUpperCase())) return true;
    }
  }
  if (config.kodPrefixes?.length) {
    for (const prefix of config.kodPrefixes) {
      if (kod.startsWith(prefix.toUpperCase())) return true;
    }
  }
  return config.slug === "other";
}

function getCategoryForRow(row: CatalogRow, rules: CategoryRule[]): string {
  for (const config of rules) {
    if (matchesCategory(row, config)) return config.slug;
  }
  return "other";
}

/** Group rows into sections by category using the given rules. */
export function categorizeCatalog(
  rows: CatalogRow[],
  rules: CategoryRule[]
): CatalogSection[] {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error("Invalid category rules");
  }
  const bySlug = new Map<string, CatalogRow[]>();
  for (const config of rules) {
    bySlug.set(config.slug, []);
  }
  for (const row of rows) {
    const slug = getCategoryForRow(row, rules);
    bySlug.get(slug)!.push(row);
  }
  return rules
    .map((config) => ({
      slug: config.slug,
      titleKey: config.titleKey,
      items: bySlug.get(config.slug) ?? [],
    }))
    .filter((s) => s.items.length > 0);
}
