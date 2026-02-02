/**
 * Shared catalog categorization (browser + server).
 * Takes CSV rows and category rules, returns sections grouped by category.
 */
import type { CatalogRow, CatalogSection, CategoryRule } from '@/lib/types';

export type { CatalogRow, CatalogSection, CategoryRule } from '@/lib/types';

const NAZWA = 'Nazwa';
const KOD = 'Kod';

/**
 * Calculates a score for how well a row matches a category rule.
 * Higher score means a better match.
 */
function calculateMatchScore(row: CatalogRow, config: CategoryRule): number {
  if (config.slug === 'other') return 0.1; // Baseline for 'other'

  const nazwaUpper = (row[NAZWA] ?? '').toUpperCase();
  const kodUpper = (row[KOD] ?? '').toUpperCase();
  let score = 0;

  // 1. KOD Prefix Match (High priority)
  if (config.kodPrefixes?.length) {
    for (const prefix of config.kodPrefixes) {
      const pUpper = prefix.toUpperCase();
      if (kodUpper.startsWith(pUpper)) {
        // Score based on prefix length to favor more specific codes (e.g. TRZSPAW > TRZ)
        score += 10 + pUpper.length;
      }
    }
  }

  // 2. NAZWA Keyword Match
  if (config.keywords?.length) {
    for (const kw of config.keywords) {
      const kwUpper = kw.toUpperCase();
      if (nazwaUpper.includes(kwUpper)) {
        // Base score is length of the keyword to favor "BUTY GUMOWE" over "BUTY"
        let kwScore = kwUpper.length * 5; // Increased multiplier

        // Huge bonus for exact word/phrase match
        const escapedKw = kwUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordRegex = new RegExp(
          `(?:^|[^A-ZĄĆĘŁŃÓŚŹŻ])(${escapedKw})(?:$|[^A-ZĄĆĘŁŃÓŚŹŻ])`,
          'i'
        );
        if (wordRegex.test(nazwaUpper)) {
          kwScore += 50; // Massively increased bonus
        }

        score += kwScore;
      }
    }
  }

  return score;
}

function getCategoryForRow(row: CatalogRow, rules: CategoryRule[]): string {
  let bestSlug = 'other';
  let highestScore = 0;

  for (const config of rules) {
    const score = calculateMatchScore(row, config);
    if (score > highestScore) {
      highestScore = score;
      bestSlug = config.slug;
    }
  }

  return bestSlug;
}

/** Group rows into sections by category using the given rules. */
export function categorizeCatalog(
  rows: CatalogRow[],
  rules: CategoryRule[]
): CatalogSection[] {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error('Invalid category rules');
  }

  const bySlug = new Map<string, CatalogRow[]>();
  for (const config of rules) {
    bySlug.set(config.slug, []);
  }
  if (!bySlug.has('other')) bySlug.set('other', []);

  for (const row of rows) {
    const slug = getCategoryForRow(row, rules);
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    // Attach the categorySlug to the row so it's visible in previews
    bySlug.get(slug)!.push({ ...row, categorySlug: slug });
  }

  return rules
    .map((config) => ({
      slug: config.slug,
      titleKey: config.titleKey,
      items: bySlug.get(config.slug) ?? [],
    }))
    .filter((s) => s.items.length > 0);
}
