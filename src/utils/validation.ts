/** Controllo formale dell'email: nessuna verifica reale (§15). */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export const MIN_PASSWORD_LENGTH = 6;
