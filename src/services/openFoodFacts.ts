import type { Product } from '../types/product';
import {
  OffIngredient,
  OffIngredientsAnalysis,
  flagIngredients,
  getVeganStatus,
} from '../utils/veganVerdict';

const BASE_URL = 'https://world.openfoodfacts.org/api/v2/product';
const USER_AGENT = 'VForVegdetta/0.1 (Android; progetto didattico)';
const TIMEOUT_MS = 10000;

const FIELDS = [
  'code',
  'product_name',
  'product_name_it',
  'product_name_en',
  'brands',
  'image_front_url',
  'image_url',
  'ingredients_text',
  'ingredients_text_it',
  'ingredients_text_en',
  'ingredients_analysis_tags',
  'ingredients_analysis',
  'ingredients',
].join(',');

interface OffProduct {
  product_name?: string;
  product_name_it?: string;
  product_name_en?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  ingredients_text?: string;
  ingredients_text_it?: string;
  ingredients_text_en?: string;
  ingredients_analysis_tags?: string[];
  ingredients_analysis?: OffIngredientsAnalysis;
  ingredients?: OffIngredient[];
}

interface OffResponse {
  status?: number;
  product?: OffProduct;
}

/** La richiesta non è arrivata al server (offline, timeout, DNS…). */
export class NetworkError extends Error {}
/** Il server ha risposto, ma in modo inatteso (5xx, JSON non valido…). */
export class ServiceError extends Error {}

export type OffFetchResult =
  | { kind: 'found'; product: Product; imageUrl: string | null }
  | { kind: 'not_found' };

function firstNonEmpty(...values: (string | undefined)[]): string | null {
  for (const value of values) {
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

export function normalizeOffProduct(barcode: string, raw: OffProduct): Product {
  return {
    barcode,
    name: firstNonEmpty(
      raw.product_name,
      raw.product_name_it,
      raw.product_name_en,
    ),
    brand: firstNonEmpty(raw.brands?.split(',')[0]),
    ingredientsText: firstNonEmpty(
      raw.ingredients_text,
      raw.ingredients_text_it,
      raw.ingredients_text_en,
    ),
    ingredients: flagIngredients(raw.ingredients, raw.ingredients_analysis),
    veganStatus: getVeganStatus(raw.ingredients_analysis_tags),
    analysisTags: raw.ingredients_analysis_tags ?? [],
  };
}

export async function fetchOffProduct(
  barcode: string,
): Promise<OffFetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(
      `${BASE_URL}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`,
      {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: controller.signal,
      },
    );
  } catch (error) {
    throw new NetworkError(String(error));
  } finally {
    clearTimeout(timeout);
  }

  // OFF risponde 404 con `status: 0` quando il prodotto non esiste.
  if (response.status >= 500) {
    throw new ServiceError(`HTTP ${response.status}`);
  }

  let body: OffResponse;
  try {
    body = (await response.json()) as OffResponse;
  } catch {
    throw new ServiceError('Invalid JSON');
  }

  if (body.status !== 1 || !body.product) {
    return { kind: 'not_found' };
  }

  return {
    kind: 'found',
    product: normalizeOffProduct(barcode, body.product),
    imageUrl: firstNonEmpty(
      body.product.image_front_url,
      body.product.image_url,
    ),
  };
}
