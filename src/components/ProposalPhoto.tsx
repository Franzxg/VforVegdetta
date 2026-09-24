import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { SEED_PHOTO } from '../types/community';
import { useTheme } from '../theme/ThemeContext';
import { useLogo } from '../theme/logo';

/** Mostra una foto di proposta; le foto dei dati seed usano il logo. */
export function ProposalPhoto({
  uri,
  label,
  style,
  fit = 'cover',
}: {
  uri: string;
  label: string;
  style?: StyleProp<ImageStyle>;
  fit?: 'cover' | 'contain';
}) {
  const { colors } = useTheme();
  const logo = useLogo();
  const isSeed = uri === SEED_PHOTO;
  return (
    <Image
      accessibilityLabel={label}
      source={isSeed ? logo : { uri }}
      resizeMode={isSeed ? 'contain' : fit}
      style={[
        styles.image,
        !isSeed && { backgroundColor: colors.surface },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
  },
});
