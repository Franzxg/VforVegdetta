import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { SEED_PHOTO } from '../types/community';
import { useTheme } from '../theme/ThemeContext';

const placeholder = require('../assets/placeholder-vegdetta.png');

/** Mostra una foto di proposta; le foto dei dati seed usano il placeholder. */
export function ProposalPhoto({
  uri,
  label,
  style,
}: {
  uri: string;
  label: string;
  style?: StyleProp<ImageStyle>;
}) {
  const { colors } = useTheme();
  const isSeed = uri === SEED_PHOTO;
  return (
    <Image
      accessibilityLabel={label}
      source={isSeed ? placeholder : { uri }}
      resizeMode={isSeed ? 'contain' : 'cover'}
      style={[styles.image, { backgroundColor: colors.surface }, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 12,
  },
});
