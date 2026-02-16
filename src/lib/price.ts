/**
 * Compute gross (Brutto) price from net (Netto) price and VAT rate.
 * VAT rate is a percentage (e.g. "23" for 23%).
 * Returns formatted string with 2 decimal places, or "" if netto is invalid.
 */
export function computeBruttoPrice(
  netto: string,
  vatRatePercent: string,
): string {
  const net = parseFloat(String(netto).replace(",", ".").trim());
  if (Number.isNaN(net) || net < 0) return "";
  const vat = parseFloat(String(vatRatePercent).replace(",", ".").trim());
  const rate = Number.isNaN(vat) || vat < 0 ? 0 : vat;
  const brutto = net * (1 + rate / 100);
  return brutto.toFixed(2);
}
