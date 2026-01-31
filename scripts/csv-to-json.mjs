/**
 * Converts src/data/Kartoteki.csv (semicolon-delimited, quoted fields)
 * into a JSON array and writes src/data/Kartoteki.json.
 *
 * Run: node scripts/csv-to-json.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import iconv from "iconv-lite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const csvPath = join(projectRoot, "src", "data", "Kartoteki.csv");
const jsonPath = join(projectRoot, "src", "data", "Kartoteki.json");

/** CSV encoding (Windows-1250 = Polish / Central European). */
const CSV_ENCODING = "win1250";

/**
 * Parse a single CSV line: semicolon-delimited; fields may be quoted or not.
 * Returns array of field values (quotes stripped when present).
 */
function parseLine(line) {
  return line.split(";").map((part) => {
    const trimmed = part.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  });
}

function main() {
  const buffer = readFileSync(csvPath);
  const raw = iconv.decode(buffer, CSV_ENCODING);
  const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    console.error("CSV is empty.");
    process.exit(1);
  }

  const headerLine = lines[0];
  const headers = parseLine(headerLine);

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj = {};
    headers.forEach((key, j) => {
      obj[key] = values[j] ?? "";
    });
    rows.push(obj);
  }

  const json = JSON.stringify(rows, null, 2);
  writeFileSync(jsonPath, json, "utf-8");
  console.log(`Wrote ${rows.length} rows to ${jsonPath}`);
}

main();
