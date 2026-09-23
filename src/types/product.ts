export type VeganStatus = 'vegan' | 'non_vegan' | 'maybe' | 'unknown';

/** Stato di un singolo ingrediente rispetto al verdetto. */
export type IngredientFlag = 'non_vegan' | 'maybe' | 'none';

export interface ProductIngredient {
  id: string;
  text: string;
  flag: IngredientFlag;
}

/**
 * Prodotto normalizzato usato dalla UI e salvato nella cache locale.
 * Contiene solo dati testuali: l'immagine non viene mai messa in cache (§4.5).
 */
export interface Product {
  barcode: string;
  name: string | null;
  brand: string | null;
  ingredientsText: string | null;
  ingredients: ProductIngredient[];
  veganStatus: VeganStatus;
  analysisTags: string[];
}

export type LookupResult =
  | {
      kind: 'found';
      product: Product;
      imageUrl: string | null;
      offline: false;
    }
  | {
      kind: 'found';
      product: Product;
      imageUrl: null;
      offline: true;
      cachedAt: string;
    }
  | { kind: 'not_found' }
  | { kind: 'invalid_barcode' }
  | { kind: 'network_error' }
  | { kind: 'service_error' };
