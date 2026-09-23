import { isValidBarcode, normalizeBarcode } from '../src/utils/barcode';

describe('isValidBarcode', () => {
  it('accetta GTIN con cifra di controllo corretta', () => {
    expect(isValidBarcode('3017620422003')).toBe(true); // EAN-13
    expect(isValidBarcode('8001234567897')).toBe(true); // EAN-13
    expect(isValidBarcode('96385074')).toBe(true); // EAN-8
    expect(isValidBarcode('036000291452')).toBe(true); // UPC-A
  });

  it('rifiuta lunghezze, caratteri o cifre di controllo errati', () => {
    expect(isValidBarcode('3017620422004')).toBe(false);
    expect(isValidBarcode('12345')).toBe(false);
    expect(isValidBarcode('30176204220a3')).toBe(false);
    expect(isValidBarcode('')).toBe(false);
  });
});

describe('normalizeBarcode', () => {
  it('rimuove spazi e trattini', () => {
    expect(normalizeBarcode(' 3017-6204 22003 ')).toBe('3017620422003');
  });
});
