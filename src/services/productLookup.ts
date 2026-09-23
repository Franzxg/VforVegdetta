import type { LookupResult } from '../types/product';
import { isValidBarcode, normalizeBarcode } from '../utils/barcode';
import { NetworkError, fetchOffProduct } from './openFoodFacts';
import { getCached, saveToCache } from './scanCache';

/**
 * Flusso completo di ricerca di un prodotto (§13):
 * validazione → Open Food Facts → salvataggio in cache;
 * se la rete fallisce → cache locale con badge offline → altrimenti errore.
 */
export async function lookupProduct(rawBarcode: string): Promise<LookupResult> {
  const barcode = normalizeBarcode(rawBarcode);
  if (!isValidBarcode(barcode)) {
    return { kind: 'invalid_barcode' };
  }

  try {
    const result = await fetchOffProduct(barcode);
    if (result.kind === 'not_found') {
      return { kind: 'not_found' };
    }
    saveToCache(result.product).catch(() => {});
    return {
      kind: 'found',
      product: result.product,
      imageUrl: result.imageUrl,
      offline: false,
    };
  } catch (error) {
    const cached = await getCached(barcode);
    if (cached) {
      return {
        kind: 'found',
        product: cached.data,
        imageUrl: null,
        offline: true,
        cachedAt: cached.cachedAt,
      };
    }
    return {
      kind: error instanceof NetworkError ? 'network_error' : 'service_error',
    };
  }
}
