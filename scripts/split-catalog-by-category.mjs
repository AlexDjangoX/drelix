/**
 * Reads src/data/Kartoteki.json and scripts/catalogCategoryRules.json,
 * assigns each product to a category (first matching rule), and writes:
 *   - src/data/catalog/categories.json  (list of { slug, titleKey } in display order)
 *   - src/data/catalog/{slug}.json       (array of products for that category)
 *
 * Run after csv-to-json:  npm run csv-to-json && npm run split-catalog
 * Run: node scripts/split-catalog-by-category.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const kartotekiPath = join(projectRoot, "src", "data", "Kartoteki.json");
const rulesPath = join(__dirname, "catalogCategoryRules.json");
const catalogDir = join(projectRoot, "src", "data", "catalog");

const NAZWA = "Nazwa";
const KOD = "Kod";

function matchesCategory(row, config) {
  const nazwaUpper = (row[NAZWA] ?? "").toUpperCase();
  const kod = (row[KOD] ?? "").toUpperCase();

  if (config.keywords?.length > 0) {
    for (const kw of config.keywords) {
      if (nazwaUpper.includes(kw.toUpperCase())) return true;
    }
  }
  if (config.kodPrefixes?.length > 0) {
    for (const prefix of config.kodPrefixes) {
      if (kod.startsWith(prefix.toUpperCase())) return true;
    }
  }
  return config.slug === "other";
}

function getCategoryForRow(row, rules) {
  for (const config of rules) {
    if (matchesCategory(row, config)) return config.slug;
  }
  return "other";
}

function main() {
  const kartoteki = JSON.parse(readFileSync(kartotekiPath, "utf-8"));
  const rules = JSON.parse(readFileSync(rulesPath, "utf-8"));

  if (!Array.isArray(kartoteki)) {
    console.error("Kartoteki.json must be an array of product rows.");
    process.exit(1);
  }
  if (!Array.isArray(rules) || rules.length === 0) {
    console.error("catalogCategoryRules.json must be a non-empty array.");
    process.exit(1);
  }

  const bySlug = new Map();
  for (const config of rules) {
    bySlug.set(config.slug, []);
  }

  for (const row of kartoteki) {
    const slug = getCategoryForRow(row, rules);
    bySlug.get(slug).push(row);
  }

  if (!existsSync(catalogDir)) {
    mkdirSync(catalogDir, { recursive: true });
  }

  const categoriesMeta = rules.map((r) => ({ slug: r.slug, titleKey: r.titleKey }));
  writeFileSync(
    join(catalogDir, "categories.json"),
    JSON.stringify(categoriesMeta, null, 2),
    "utf-8"
  );

  let totalWritten = 0;
  for (const config of rules) {
    const slug = config.slug;
    const items = bySlug.get(slug) ?? [];
    writeFileSync(
      join(catalogDir, `${slug}.json`),
      JSON.stringify(items, null, 2),
      "utf-8"
    );
    totalWritten += items.length;
    console.log(`  ${slug}.json: ${items.length} products`);
  }

  console.log(`Wrote ${categoriesMeta.length} category files to ${catalogDir}`);
  console.log(`Total products: ${totalWritten}`);
}

main();
