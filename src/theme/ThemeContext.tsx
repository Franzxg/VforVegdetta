import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { StorageKeys, readString, writeString } from '../services/storage';
import { ThemeColors, darkColors, lightColors } from './colors';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** `true` quando la preferenza salvata è stata letta da AsyncStorage. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readString(StorageKeys.themePreference).then(stored => {
      if (isThemePreference(stored)) {
        setPreferenceState(stored);
      }
      setReady(true);
    });
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    writeString(StorageKeys.themePreference, next).catch(() => {});
  }, []);

  const isDark =
    preference === 'system' ? systemScheme === 'dark' : preference === 'dark';

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      preference,
      setPreference,
      ready,
    }),
    [isDark, preference, setPreference, ready],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
