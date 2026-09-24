import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLogo } from '../theme/logo';

/**
 * Mostra la foto del prodotto oppure, se assente o non caricabile,
 * il logo dell'app nella variante chiara o scura (§8.1).
 */
export function ProductImage({
  uri,
  size = 200,
}: {
  uri: string | null;
  size?: number;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const logo = useLogo();
  const [failed, setFailed] = useState(false);
  const showPhoto = uri != null && !failed;

  return (
    <Image
      accessibilityLabel={
        showPhoto ? t('product.imageAlt') : t('product.placeholderAlt')
      }
      source={showPhoto ? { uri } : logo}
      onError={() => setFailed(true)}
      resizeMode="contain"
      style={[
        styles.image,
        { width: size, height: size },
        // Il logo ha già il suo sfondo arrotondato; le foto no.
        showPhoto && { backgroundColor: colors.background },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 16,
    alignSelf: 'center',
  },
});
