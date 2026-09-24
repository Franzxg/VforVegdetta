import {
  SCAN_CACHE_LIMIT,
  ScanCache,
  recentEntries,
  withEntry,
} from '../src/services/scanCache';
import type { Product } from '../src/types/product';

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem: jest.fn(), setItem: jest.fn() },
}));

const product = (barcode: string): Product => ({
  barcode,
  name: barcode,
  brand: null,
  ingredientsText: null,
  ingredients: [],
  veganStatus: 'unknown',
  analysisTags: [],
});

describe('withEntry (LRU)', () => {
  it('elimina la voce meno recente oltre il limite', () => {
    let cache: ScanCache = {};
    cache = withEntry(cache, product('a'), new Date('2026-09-01T10:00:00Z'), 2);
    cache = withEntry(cache, product('b'), new Date('2026-09-02T10:00:00Z'), 2);
    cache = withEntry(cache, product('c'), new Date('2026-09-03T10:00:00Z'), 2);
    expect(Object.keys(cache).sort()).toEqual(['b', 'c']);
  });

  it('una nuova scansione rinnova la voce esistente', () => {
    let cache: ScanCache = {};
    cache = withEntry(cache, product('a'), new Date('2026-09-01T10:00:00Z'), 2);
    cache = withEntry(cache, product('b'), new Date('2026-09-02T10:00:00Z'), 2);
    cache = withEntry(cache, product('a'), new Date('2026-09-03T10:00:00Z'), 2);
    cache = withEntry(cache, product('c'), new Date('2026-09-04T10:00:00Z'), 2);
    expect(Object.keys(cache).sort()).toEqual(['a', 'c']);
  });
});

describe('recentEntries', () => {
  it('restituisce le scansioni dalla più recente, entro il limite', () => {
    let cache: ScanCache = {};
    cache = withEntry(cache, product('a'), new Date('2026-09-01T10:00:00Z'));
    cache = withEntry(cache, product('b'), new Date('2026-09-03T10:00:00Z'));
    cache = withEntry(cache, product('c'), new Date('2026-09-02T10:00:00Z'));
    expect(recentEntries(cache).map(e => e.data.barcode)).toEqual([
      'b',
      'c',
      'a',
    ]);
    expect(recentEntries(cache, 2).map(e => e.data.barcode)).toEqual([
      'b',
      'c',
    ]);
  });

  it('la cache conserva al massimo SCAN_CACHE_LIMIT prodotti', () => {
    let cache: ScanCache = {};
    for (let i = 0; i < SCAN_CACHE_LIMIT + 5; i++) {
      cache = withEntry(
        cache,
        product(`p${i}`),
        new Date(Date.UTC(2026, 8, 1, 0, i)),
      );
    }
    const recent = recentEntries(cache);
    expect(recent).toHaveLength(SCAN_CACHE_LIMIT);
    expect(recent[0].data.barcode).toBe(`p${SCAN_CACHE_LIMIT + 4}`);
    expect(cache.p0).toBeUndefined();
  });
});
