import { SEED_PHOTO } from '../types/community';
import type { CustomApprovedProduct } from '../types/community';
import type { LookupResult, Product } from '../types/product';
import { isValidBarcode, normalizeBarcode } from '../utils/barcode';
import { getCustomProduct, loadProposalPhotos } from './community';
import { NetworkError, fetchOffProduct } from './openFoodFacts';
import { getCached, saveToCache } from './scanCache';

function toProduct(custom: CustomApprovedProduct): Product {
  return {
    barcode: custom.barcode,
    name: custom.name,
    brand: null,
    ingredientsText: custom.ingredientsText || null,
    ingredients: [],
    veganStatus: custom.veganStatus,
    analysisTags: [],
  };
}

async function communityImage(
  custom: CustomApprovedProduct,
): Promise<string | null> {
  if (!custom.proposalId) {
    return null;
  }
  const photo = (await loadProposalPhotos(custom.proposalId)).product;
  return photo === SEED_PHOTO ? null : photo;
}

/**
 * Flusso completo di ricerca di un prodotto (§13):
 * validazione → prodotti approvati dai volontari → Open Food Facts →
 * salvataggio in cache; se la rete fallisce → cache locale con badge offline
 * → altrimenti errore.
 *
 * I prodotti approvati hanno la precedenza perché verificati a mano (è così
 * che una "correzione" proposta dall'utente diventa effettiva) e funzionano
 * anche senza connessione.
 */
export async function lookupProduct(rawBarcode: string): Promise<LookupResult> {
  const barcode = normalizeBarcode(rawBarcode);
  if (!isValidBarcode(barcode)) {
    return { kind: 'invalid_barcode' };
  }

  const custom = await getCustomProduct(barcode);
  if (custom) {
    const product = toProduct(custom);
    saveToCache(product).catch(() => {});
    return {
      kind: 'found',
      product,
      imageUrl: await communityImage(custom),
      source: 'community',
      cachedAt: null,
    };
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
      source: 'off',
      cachedAt: null,
    };
  } catch (error) {
    const cached = await getCached(barcode);
    if (cached) {
      return {
        kind: 'found',
        product: cached.data,
        imageUrl: null,
        source: 'off',
        cachedAt: cached.cachedAt,
      };
    }
    return {
      kind: error instanceof NetworkError ? 'network_error' : 'service_error',
    };
  }
}
