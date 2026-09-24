import additivesData from '../data/additives.json';

export type AdditiveVeganStatus = 'yes' | 'no' | 'maybe';

export interface Additive {
  code: string;
  vegan: AdditiveVeganStatus;
  name: Record<string, string>;
  note: Record<string, string>;
}

export const ADDITIVES = additivesData as Additive[];

// Segni diacritici combinanti (accenti separati dalla lettera con NFD).
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

/** Testo in minuscolo e senza accenti, per una ricerca tollerante. */
function simplify(value: string): string {
  const decomposed =
    typeof value.normalize === 'function' ? value.normalize('NFD') : value;
  return decomposed.replace(DIACRITICS, '').toLowerCase().trim();
}

/** "e 322", "E-322" e "322" diventano tutti "e322". */
function simplifyCode(value: string): string {
  const compact = simplify(value).replace(/[\s-]/g, '');
  return /^\d/.test(compact) ? `e${compact}` : compact;
}

export function localized(
  field: Record<string, string>,
  language: string,
): string {
  return field[language] ?? field.it;
}

/**
 * Filtra gli additivi per stato vegano e per testo (codice E o nome nella
 * lingua corrente), mantenendo l'ordine per numero E.
 */
export function filterAdditives(
  additives: readonly Additive[],
  query: string,
  status: AdditiveVeganStatus | 'all',
  language: string,
): Additive[] {
  const text = simplify(query);
  const code = simplifyCode(query);
  return additives
    .filter(additive => status === 'all' || additive.vegan === status)
    .filter(
      additive =>
        !text ||
        simplify(additive.code).startsWith(code) ||
        simplify(localized(additive.name, language)).includes(text),
    )
    .sort(
      (a, b) =>
        parseInt(a.code.slice(1), 10) - parseInt(b.code.slice(1), 10) ||
        a.code.localeCompare(b.code),
    );
}
