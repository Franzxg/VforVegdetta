const VALID_LENGTHS = [8, 12, 13, 14];

/** Rimuove spazi e trattini che l'utente può digitare a mano. */
export function normalizeBarcode(input: string): string {
  return input.replace(/[\s-]/g, '');
}

/**
 * Verifica che il codice sia un GTIN valido (EAN-8, UPC-A, EAN-13, GTIN-14)
 * controllando lunghezza e cifra di controllo.
 */
export function isValidBarcode(code: string): boolean {
  if (!/^\d+$/.test(code) || !VALID_LENGTHS.includes(code.length)) {
    return false;
  }
  const digits = code.split('').map(Number);
  const checkDigit = digits.pop() as number;
  // Da destra verso sinistra i pesi si alternano 3, 1, 3, 1…
  const sum = digits
    .reverse()
    .reduce((acc, digit, index) => acc + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === checkDigit;
}
