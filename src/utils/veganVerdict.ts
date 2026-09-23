import type {
  IngredientFlag,
  ProductIngredient,
  VeganStatus,
} from '../types/product';

/** Sottoinsieme dei campi di Open Food Facts usati per il verdetto. */
export interface OffIngredient {
  id?: string;
  text?: string;
  vegan?: string;
  ingredients?: OffIngredient[];
}

export type OffIngredientsAnalysis = Record<string, string[] | undefined>;

/**
 * Mapping `ingredients_analysis_tags` → verdetto (§10).
 * In caso di tag contraddittori prevale sempre il verdetto più prudente.
 */
export function getVeganStatus(
  tags: readonly string[] | undefined,
): VeganStatus {
  if (!tags) {
    return 'unknown';
  }
  if (tags.includes('en:non-vegan')) {
    return 'non_vegan';
  }
  if (tags.includes('en:maybe-vegan')) {
    return 'maybe';
  }
  if (tags.includes('en:vegan')) {
    return 'vegan';
  }
  return 'unknown';
}

function collectIdsByVeganField(
  ingredients: OffIngredient[] | undefined,
  value: 'no' | 'maybe',
  out: Set<string>,
): Set<string> {
  for (const ingredient of ingredients ?? []) {
    if (ingredient.vegan === value && ingredient.id) {
      out.add(ingredient.id);
    }
    collectIdsByVeganField(ingredient.ingredients, value, out);
  }
  return out;
}

function containsAny(ingredient: OffIngredient, ids: Set<string>): boolean {
  if (ingredient.id && ids.has(ingredient.id)) {
    return true;
  }
  return (ingredient.ingredients ?? []).some(child => containsAny(child, ids));
}

/**
 * Restituisce gli ingredienti di primo livello marcati in base a ciò che ha
 * causato il verdetto. Usa `ingredients_analysis` quando disponibile; se manca
 * del tutto, ricade sul campo `vegan` dei singoli ingredienti.
 */
export function flagIngredients(
  ingredients: OffIngredient[] | undefined,
  analysis: OffIngredientsAnalysis | undefined,
): ProductIngredient[] {
  const nonVeganIds = analysis
    ? new Set(analysis['en:non-vegan'] ?? [])
    : collectIdsByVeganField(ingredients, 'no', new Set());
  const maybeIds = analysis
    ? new Set(analysis['en:maybe-vegan'] ?? [])
    : collectIdsByVeganField(ingredients, 'maybe', new Set());

  return (ingredients ?? [])
    .filter(ingredient => ingredient.text)
    .map((ingredient, index) => {
      let flag: IngredientFlag = 'none';
      if (containsAny(ingredient, nonVeganIds)) {
        flag = 'non_vegan';
      } else if (containsAny(ingredient, maybeIds)) {
        flag = 'maybe';
      }
      return {
        id: ingredient.id ?? `ingredient-${index}`,
        text: (ingredient.text as string).trim(),
        flag,
      };
    });
}
