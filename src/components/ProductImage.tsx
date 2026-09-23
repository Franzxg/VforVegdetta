import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const placeholder = require('../assets/placeholder-vegdetta.png');

/**
 * Mostra la foto del prodotto oppure, se assente o non caricabile,
 * l'illustrazione placeholder (§8.1).
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
  const [failed, setFailed] = useState(false);
  const showPhoto = uri != null && !failed;

  return (
    <Image
      accessibilityLabel={
        showPhoto ? t('product.imageAlt') : t('product.placeholderAlt')
      }
      source={showPhoto ? { uri } : placeholder}
      onError={() => setFailed(true)}
      resizeMode="contain"
      style={[
        styles.image,
        { width: size, height: size, backgroundColor: colors.background },
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
