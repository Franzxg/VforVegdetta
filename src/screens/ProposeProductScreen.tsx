import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProductImage } from '../components/ProductImage';
import type { RootScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

/**
 * Punto d'ingresso della proposta prodotto. Il form completo (3 foto, note,
 * nome facoltativo) fa parte della fase community (§5).
 */
export function ProposeProductScreen({
  route,
}: RootScreenProps<'ProposeProduct'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const barcode = route.params?.barcode;

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      <ProductImage uri={null} size={140} />
      {barcode && (
        <View
          style={[
            styles.field,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('propose.barcodeLabel')}
          </Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {barcode}
          </Text>
        </View>
      )}
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {t('propose.comingSoon')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 20,
  },
  field: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
