/**
 * Unit tests for src/lib/process-csv/csvParseClient (client CSV parsing).
 */
import { describe, it, expect } from "vitest";
import { csvToRows } from "@/lib/process-csv/csvParseClient";

function toBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

describe("csvToRows", () => {
  it("parses semicolon-delimited lines", () => {
    const csv = "Kod;Nazwa;Cena netto\nA1;Product A;10.00\nB2;Product B;20.00";
    const buffer = toBuffer(csv);
    const rows = csvToRows(buffer);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ Kod: "A1", Nazwa: "Product A", "Cena netto": "10.00" });
    expect(rows[1]).toEqual({ Kod: "B2", Nazwa: "Product B", "Cena netto": "20.00" });
  });

  it("strips surrounding quotes from cells", () => {
    const csv = 'A;B;C\n"1";2;"3"';
    const buffer = toBuffer(csv);
    const rows = csvToRows(buffer);
    expect(rows[0].A).toBe("1");
    expect(rows[0].B).toBe("2");
    expect(rows[0].C).toBe("3");
  });

  it("trims whitespace around cells", () => {
    const csv = " X ; Y \n a ; b ";
    const buffer = toBuffer(csv);
    const rows = csvToRows(buffer);
    expect(rows[0]).toEqual({ X: "a", Y: "b" });
  });

  it("throws when CSV is empty", () => {
    const buffer = toBuffer("");
    expect(() => csvToRows(buffer)).toThrow("CSV is empty");
  });

  it("throws when only blank lines", () => {
    const buffer = toBuffer("\n\n  \n");
    expect(() => csvToRows(buffer)).toThrow("CSV is empty");
  });

  it("handles single header row as zero data rows", () => {
    const csv = "Kod;Nazwa";
    const buffer = toBuffer(csv);
    const rows = csvToRows(buffer);
    expect(rows).toHaveLength(0);
  });

  it("handles missing columns as empty string", () => {
    const csv = "A;B;C\n1;2";
    const buffer = toBuffer(csv);
    const rows = csvToRows(buffer);
    expect(rows[0].C).toBe("");
  });
});
