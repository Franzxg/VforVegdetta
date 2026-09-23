/**
 * Palette centralizzata dell'app (§8 delle specifiche).
 * Nessun componente deve usare valori esadecimali diretti: tutti i colori
 * passano da questi due oggetti tramite `useTheme()`.
 */
export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  highlight: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  /** Testo/icone sopra `primary` o `accent`. */
  onPrimary: string;
  /** Bordi e divisori sottili. */
  border: string;
  /** Velo semitrasparente sopra la vista fotocamera. */
  overlay: string;
}

export const lightColors: ThemeColors = {
  background: '#F7FBF8',
  surface: '#B2DBBF',
  primary: '#247BA0',
  secondary: '#70C1B3',
  highlight: '#F3FFBD',
  accent: '#FF1654',
  textPrimary: '#16261F',
  textSecondary: '#4A5C52',
  onPrimary: '#FFFFFF',
  border: '#8FC3A0',
  overlay: 'rgba(16, 32, 26, 0.55)',
};

export const darkColors: ThemeColors = {
  background: '#10201A',
  surface: '#1C3129',
  primary: '#5FB3DE',
  secondary: '#8FD9C9',
  highlight: '#3A4A2E',
  accent: '#FF4C7A',
  textPrimary: '#EAF3EC',
  textSecondary: '#A9BDB2',
  onPrimary: '#10201A',
  border: '#2E4A3E',
  overlay: 'rgba(16, 32, 26, 0.65)',
};
