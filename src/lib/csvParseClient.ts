/**
 * Client-safe CSV parser (Windows-1250, semicolon-delimited).
 * Use for admin CSV upload in the browser.
 */

import iconv from "iconv-lite";

function parseLine(line: string): string[] {
  return line.split(";").map((part) => {
    const trimmed = part.trim();
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  });
}

export function csvToRows(buffer: ArrayBuffer): Record<string, string>[] {
  const raw = iconv.decode(new Uint8Array(buffer), "win1250");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) throw new Error("CSV is empty");
  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((key, j) => {
      obj[key] = values[j] ?? "";
    });
    rows.push(obj);
  }
  return rows;
}
