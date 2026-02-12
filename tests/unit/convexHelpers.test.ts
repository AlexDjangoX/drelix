/**
 * Unit tests for convex/lib/helpers pure functions.
 * No mocks - testing application logic directly.
 */
import { describe, it, expect } from 'vitest';
import {
  sortCategories,
  sortItemsByNazwa,
  toProductInsert,
  filterAllowedUpdates,
} from '../../convex/lib/helpers';
import type { Id } from '../../convex/_generated/dataModel';

describe('sortCategories', () => {
  it('sorts admin-created (with createdAt) first by newest', () => {
    const cats = [
      { slug: 'a', createdAt: 100 },
      { slug: 'b', createdAt: 200 },
      { slug: 'c' },
    ];
    expect(sortCategories(cats)).toEqual([
      { slug: 'b', createdAt: 200 },
      { slug: 'a', createdAt: 100 },
      { slug: 'c' },
    ]);
  });

  it('sorts by slug when createdAt equal', () => {
    const cats = [
      { slug: 'zebra', createdAt: 100 },
      { slug: 'alpha', createdAt: 100 },
    ];
    expect(sortCategories(cats)).toEqual([
      { slug: 'alpha', createdAt: 100 },
      { slug: 'zebra', createdAt: 100 },
    ]);
  });
});

describe('sortItemsByNazwa', () => {
  it('sorts items alphabetically by Nazwa', () => {
    const items = [
      { Nazwa: 'Zebra', Kod: '1' },
      { Nazwa: 'Alpha', Kod: '2' },
      { Nazwa: 'Beta', Kod: '3' },
    ];
    expect(sortItemsByNazwa(items)).toEqual([
      { Nazwa: 'Alpha', Kod: '2' },
      { Nazwa: 'Beta', Kod: '3' },
      { Nazwa: 'Zebra', Kod: '1' },
    ]);
  });

  it('handles missing Nazwa (empty string sorts first)', () => {
    const items = [{ Nazwa: 'B' }, {}, { Nazwa: 'A' }];
    const sorted = sortItemsByNazwa(items);
    expect(sorted[0]).toEqual({});
    expect(sorted[1]).toEqual({ Nazwa: 'A' });
    expect(sorted[2]).toEqual({ Nazwa: 'B' });
  });
});

describe('toProductInsert', () => {
  const baseRow: Record<string, string> = {
    Rodzaj: 'T',
    JednostkaMiary: 'szt',
    StawkaVAT: '23',
    Kod: 'TEST-001',
    Nazwa: 'Test Product',
    Opis: '',
        ProductDescription: '',
    CenaNetto: '10.00',
    KodKlasyfikacji: 'X',
    Uwagi: '',
    OstatniaCenaZakupu: '9',
    OstatniaDataZakupu: '2024-01-01',
  };

  it('maps row to product insert shape', () => {
    const result = toProductInsert(baseRow, 'gloves');
    expect(result).toMatchObject({
      ...baseRow,
      categorySlug: 'gloves',
    });
  });

  it('uses CSV alt keys when canonical missing', () => {
    const row = { ...baseRow };
    delete row.JednostkaMiary;
    row['Jednostka miary'] = 'kg';
    const result = toProductInsert(row, 'gloves');
    expect(result.JednostkaMiary).toBe('kg');
  });

  it('preserves existing images when provided', () => {
    const result = toProductInsert(baseRow, 'gloves', {
      imageStorageId: 'img-123',
      thumbnailStorageId: 'thumb-456',
    });
    expect(result.imageStorageId).toBe('img-123');
    expect(result.thumbnailStorageId).toBe('thumb-456');
  });
});

describe('filterAllowedUpdates', () => {
  it('filters to allowed keys only', () => {
    const updates = {
      Nazwa: 'New Name',
      Kod: 'NEW-001',
      invalidKey: 'ignored',
    };
    expect(filterAllowedUpdates(updates)).toEqual({
      Nazwa: 'New Name',
      Kod: 'NEW-001',
    });
  });

  it('ignores non-string values', () => {
    const updates = { Nazwa: 123 as unknown as string };
    expect(filterAllowedUpdates(updates)).toEqual({});
  });

  it('allows categorySlug and image fields', () => {
    const updates = {
      categorySlug: 'new-cat',
      imageStorageId: 'img-1',
      thumbnailStorageId: 'thumb-1',
    };
    expect(filterAllowedUpdates(updates)).toEqual(updates);
  });

  it('filters out empty objects', () => {
    expect(filterAllowedUpdates({})).toEqual({});
  });

  it('handles null and undefined values by filtering them out', () => {
    const updates = {
      Nazwa: null as unknown as string,
      Kod: undefined as unknown as string,
    };
    expect(filterAllowedUpdates(updates)).toEqual({});
  });
});

describe('productToUpdateResult', () => {
  it('strips system fields from product document', async () => {
    const { productToUpdateResult } = await import('../../convex/lib/helpers');
    const doc = {
      _id: 'id123' as Id<'products'>,
      _creationTime: 1234567890,
      Kod: 'TEST-001',
      Nazwa: 'Test Product',
      Opis: 'Description',
        ProductDescription: '',
      CenaNetto: '10.00',
      categorySlug: 'gloves',
      Rodzaj: 'T',
      JednostkaMiary: 'szt',
      StawkaVAT: '23',
      KodKlasyfikacji: 'X',
      Uwagi: '',
      OstatniaCenaZakupu: '9',
      OstatniaDataZakupu: '2024-01-01',
    };

    const result = productToUpdateResult(doc);
    expect(result).not.toHaveProperty('_id');
    expect(result).not.toHaveProperty('_creationTime');
    expect(result.Kod).toBe('TEST-001');
    expect(result.Nazwa).toBe('Test Product');
  });

  it('preserves optional fields', async () => {
    const { productToUpdateResult } = await import('../../convex/lib/helpers');
    const doc = {
      _id: 'id123' as Id<'products'>,
      _creationTime: 1234567890,
      Kod: 'TEST-001',
      Nazwa: 'Test',
      Opis: 'Optional description',
        ProductDescription: '',
      imageStorageId: 'img-123',
      thumbnailStorageId: 'thumb-456',
      CenaNetto: '10.00',
      categorySlug: 'gloves',
      Rodzaj: 'T',
      JednostkaMiary: 'szt',
      StawkaVAT: '23',
      KodKlasyfikacji: 'X',
      Uwagi: '',
      OstatniaCenaZakupu: '9',
      OstatniaDataZakupu: '2024-01-01',
    };

    const result = productToUpdateResult(doc);
    expect(result.imageStorageId).toBe('img-123');
    expect(result.thumbnailStorageId).toBe('thumb-456');
    expect(result.Opis).toBe('Optional description');
  });
});
