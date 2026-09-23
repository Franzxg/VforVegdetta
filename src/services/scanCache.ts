import type { Product } from '../types/product';
import { StorageKeys, readJson, writeJson } from './storage';

/** Numero massimo di prodotti conservati; oltre, si elimina il meno recente. */
export const SCAN_CACHE_LIMIT = 100;

export interface CacheEntry {
  data: Product;
  cachedAt: string;
}

export type ScanCache = Record<string, CacheEntry>;

async function loadCache(): Promise<ScanCache> {
  return (await readJson<ScanCache>(StorageKeys.scanCache)) ?? {};
}

/** Aggiunge/aggiorna una voce e applica l'eviction LRU (funzione pura). */
export function withEntry(
  cache: ScanCache,
  product: Product,
  now: Date,
  limit: number = SCAN_CACHE_LIMIT,
): ScanCache {
  const next: ScanCache = {
    ...cache,
    [product.barcode]: { data: product, cachedAt: now.toISOString() },
  };
  const barcodes = Object.keys(next);
  if (barcodes.length <= limit) {
    return next;
  }
  barcodes
    .sort((a, b) => next[a].cachedAt.localeCompare(next[b].cachedAt))
    .slice(0, barcodes.length - limit)
    .forEach(barcode => {
      delete next[barcode];
    });
  return next;
}

export async function saveToCache(product: Product): Promise<void> {
  const cache = await loadCache();
  await writeJson(StorageKeys.scanCache, withEntry(cache, product, new Date()));
}

export async function getCached(barcode: string): Promise<CacheEntry | null> {
  const cache = await loadCache();
  return cache[barcode] ?? null;
}

export async function getMostRecent(): Promise<CacheEntry | null> {
  const entries = Object.values(await loadCache());
  if (entries.length === 0) {
    return null;
  }
  return entries.reduce((latest, entry) =>
    entry.cachedAt > latest.cachedAt ? entry : latest,
  );
}
