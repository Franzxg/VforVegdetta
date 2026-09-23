import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { ProductImage } from '../components/ProductImage';
import { VerdictBadge } from '../components/VerdictBadge';
import type { RootScreenProps } from '../navigation/types';
import { CacheEntry, getMostRecent } from '../services/scanCache';
import { useTheme } from '../theme/ThemeContext';

export function HomeScreen({ navigation }: RootScreenProps<'Home'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [lastScan, setLastScan] = useState<CacheEntry | null>(null);

  useFocusEffect(
    useCallback(() => {
      getMostRecent().then(setLastScan);
    }, []),
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      <ProductImage uri={null} size={160} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t('home.title')}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {t('home.subtitle')}
      </Text>

      <AppButton
        large
        title={t('home.scanButton')}
        onPress={() => navigation.navigate('Scan')}
        style={styles.scanButton}
      />

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('home.lastScan')}
      </Text>
      {lastScan ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('Product', { barcode: lastScan.data.barcode })
          }
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={styles.cardText}>
            <Text
              numberOfLines={2}
              style={[styles.cardTitle, { color: colors.textPrimary }]}
            >
              {lastScan.data.name ?? lastScan.data.barcode}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {t('product.barcode', { barcode: lastScan.data.barcode })}
            </Text>
          </View>
          <VerdictBadge compact status={lastScan.data.veganStatus} />
        </Pressable>
      ) : (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.textSecondary }}>
            {t('home.noLastScan')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    flexGrow: 1,
  },
  title: {
    marginTop: 16,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  scanButton: {
    marginTop: 28,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
});
