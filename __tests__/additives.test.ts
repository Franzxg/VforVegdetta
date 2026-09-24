import { ADDITIVES, filterAdditives } from '../src/utils/additives';

const codes = (query: string, status: 'all' | 'yes' | 'no' | 'maybe' = 'all') =>
  filterAdditives(ADDITIVES, query, status, 'it').map(a => a.code);

describe('dati additivi', () => {
  it('contengono almeno 20 additivi con testi in entrambe le lingue', () => {
    expect(ADDITIVES.length).toBeGreaterThanOrEqual(20);
    for (const additive of ADDITIVES) {
      expect(additive.code).toMatch(/^E\d{3,4}[a-z]?$/);
      expect(['yes', 'no', 'maybe']).toContain(additive.vegan);
      expect(additive.name.it && additive.name.en).toBeTruthy();
      expect(additive.note.it && additive.note.en).toBeTruthy();
    }
  });

  it('non hanno codici duplicati', () => {
    const all = ADDITIVES.map(a => a.code);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('filterAdditives', () => {
  it('cerca per codice in vari formati', () => {
    expect(codes('E120')).toEqual(['E120']);
    expect(codes('e 120')).toEqual(['E120']);
    expect(codes('120')).toEqual(['E120']);
    expect(codes('E16')).toEqual(['E160a']);
  });

  it('cerca per nome ignorando maiuscole e accenti', () => {
    expect(codes('CERA')).toEqual(['E901']);
    expect(codes('lattato')).toEqual(['E325']);
    expect(
      filterAdditives(ADDITIVES, 'beeswax', 'all', 'en').map(a => a.code),
    ).toEqual(['E901']);
  });

  it('filtra per stato vegano', () => {
    const nonVegan = codes('', 'no');
    expect(nonVegan).toContain('E120');
    expect(nonVegan).not.toContain('E330');
    expect(codes('lecitin', 'yes')).toEqual([]);
  });

  it('ordina per numero E (E1105 dopo E966)', () => {
    const all = codes('');
    expect(all.indexOf('E966')).toBeLessThan(all.indexOf('E1105'));
    expect(all[0]).toBe('E100');
  });
});
