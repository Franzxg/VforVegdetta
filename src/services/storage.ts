import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  themePreference: 'settings.theme',
  language: 'settings.language',
  scanCache: 'scanCache',
  communityData: 'community.data',
  session: 'auth.session',
  /** Prefisso: le foto di ogni proposta hanno una chiave dedicata. */
  proposalPhotos: 'community.photos.',
} as const;

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

export async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function readString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function writeString(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
