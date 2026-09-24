import type { ImageSourcePropType } from 'react-native';
import { useTheme } from './ThemeContext';

const LOGOS = {
  light: require('../assets/logo/logo-light.png') as ImageSourcePropType,
  dark: require('../assets/logo/logo-dark.png') as ImageSourcePropType,
};

/**
 * Logo dell'app nella variante del tema attivo: usato come immagine
 * segnaposto quando manca la foto di un prodotto (§8.1).
 */
export function useLogo(): ImageSourcePropType {
  const { isDark } = useTheme();
  return isDark ? LOGOS.dark : LOGOS.light;
}
