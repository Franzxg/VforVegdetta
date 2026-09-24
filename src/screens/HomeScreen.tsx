import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { ProductImage } from '../components/ProductImage';
import { VerdictBadge } from '../components/VerdictBadge';
import type { RootScreenProps } from '../navigation/types';
import {
  CacheEntry,
  HOME_RECENT_SCANS,
  SCAN_CACHE_LIMIT,
  getRecentScans,
} from '../services/scanCache';
import { useTheme } from '../theme/ThemeContext';

export function HomeScreen({ navigation }: RootScreenProps<'Home'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [recentScans, setRecentScans] = useState<CacheEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRecentScans(HOME_RECENT_SCANS).then(setRecentScans);
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
        {t('home.recentScans')}
      </Text>
      {recentScans.length > 0 && (
        <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
          {t('home.recentScansHint', {
            shown: HOME_RECENT_SCANS,
            limit: SCAN_CACHE_LIMIT,
          })}
        </Text>
      )}

      {recentScans.length === 0 ? (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.textSecondary }}>
            {t('home.noRecentScans')}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recentScans.map(entry => (
            <Pressable
              key={entry.data.barcode}
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('Product', { barcode: entry.data.barcode })
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
                  {entry.data.name ?? entry.data.barcode}
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  {t('product.barcode', { barcode: entry.data.barcode })}
                </Text>
              </View>
              <VerdictBadge compact status={entry.data.veganStatus} />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    // Spazio extra: la barra di navigazione di sistema copre il fondo.
    paddingBottom: 64,
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
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    marginBottom: 10,
  },
  list: {
    gap: 10,
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
