import { ScanCache, withEntry } from '../src/services/scanCache';
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
