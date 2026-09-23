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

/** Da dove arrivano i dati: Open Food Facts o revisione dei volontari. */
export type ProductSource = 'off' | 'community';

export type LookupResult =
  | {
      kind: 'found';
      product: Product;
      imageUrl: string | null;
      source: ProductSource;
      /** Valorizzato solo se i dati arrivano dalla cache offline. */
      cachedAt: string | null;
    }
  | { kind: 'not_found' }
  | { kind: 'invalid_barcode' }
  | { kind: 'network_error' }
  | { kind: 'service_error' };
