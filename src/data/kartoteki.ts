/**
 * Shop catalog data from Kartoteki (CSV → JSON).
 * Regenerate with: npm run csv-to-json
 */

import catalogJson from './Kartoteki.json';

export type KartotekaRow = {
  'Rodzaj': string;
  'Jednostka miary': string;
  'Stawka VAT': string;
  'Kod': string;
  'Nazwa': string;
  'Cena netto': string;
  'Kod klasyfikacji': string;
  'Uwagi': string;
  'Ostatnia cena zakupu': string;
  'Ostatnia data zakupu': string;
};

const catalog = catalogJson as KartotekaRow[];

export function getCatalog(): readonly KartotekaRow[] {
  return catalog;
}

export { catalog };
