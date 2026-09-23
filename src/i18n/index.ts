import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { StorageKeys, readString, writeString } from '../services/storage';
import en from './locales/en';
import it from './locales/it';

export const SUPPORTED_LANGUAGES = ['it', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

function isSupported(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

function deviceLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return isSupported(code) ? code : 'it';
}

/** Inizializza i18next con la lingua salvata o, in mancanza, quella del dispositivo. */
export async function initI18n(): Promise<void> {
  const stored = await readString(StorageKeys.language);
  await i18n.use(initReactI18next).init({
    resources: {
      it: { translation: it },
      en: { translation: en },
    },
    lng: isSupported(stored) ? stored : deviceLanguage(),
    fallbackLng: 'it',
    interpolation: { escapeValue: false },
  });
}

export async function setLanguage(language: Language): Promise<void> {
  await i18n.changeLanguage(language);
  await writeString(StorageKeys.language, language);
}

export default i18n;
