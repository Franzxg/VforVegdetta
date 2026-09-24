import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppButton } from '../components/AppButton';
import { ProductImage } from '../components/ProductImage';
import { StateView } from '../components/StateView';
import { VerdictBadge } from '../components/VerdictBadge';
import type { RootScreenProps } from '../navigation/types';
import { lookupProduct } from '../services/productLookup';
import { useTheme } from '../theme/ThemeContext';
import type { LookupResult, ProductIngredient } from '../types/product';

type FoundResult = Extract<LookupResult, { kind: 'found' }>;

export function ProductScreen({
  navigation,
  route,
}: RootScreenProps<'Product'>) {
  const { barcode } = route.params;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [result, setResult] = useState<LookupResult | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setResult(null);
    lookupProduct(barcode).then(r => {
      if (!cancelled) {
        setResult(r);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [barcode]);

  useEffect(load, [load]);

  const scanAgain = () => navigation.replace('Scan');
  const propose = () => navigation.navigate('ProposeProduct', { barcode });

  if (result == null) {
    return (
      <View style={[styles.center, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  switch (result.kind) {
    case 'not_found':
      return (
        <StateView
          title={t('states.notFoundTitle')}
          message={t('states.notFoundText', { barcode })}
        >
          <AppButton title={t('states.proposeThis')} onPress={propose} />
          <AppButton
            variant="ghost"
            title={t('product.scanAnother')}
            onPress={scanAgain}
          />
        </StateView>
      );
    case 'invalid_barcode':
      return (
        <StateView
          title={t('states.invalidTitle')}
          message={t('states.invalidText', { barcode })}
        >
          <AppButton title={t('product.scanAnother')} onPress={scanAgain} />
        </StateView>
      );
    case 'network_error':
    case 'service_error': {
      const key = result.kind === 'network_error' ? 'network' : 'service';
      return (
        <StateView
          title={t(`states.${key}Title`)}
          message={t(`states.${key}Text`)}
        >
          <AppButton title={t('common.retry')} onPress={load} />
          <AppButton
            variant="ghost"
            title={t('product.scanAnother')}
            onPress={scanAgain}
          />
        </StateView>
      );
    }
    case 'found':
      return (
        <ProductDetails
          result={result}
          onScanAgain={scanAgain}
          onPropose={propose}
        />
      );
  }
}

function ProductDetails({
  result,
  onScanAgain,
  onPropose,
}: {
  result: FoundResult;
  onScanAgain: () => void;
  onPropose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { product } = result;
  const flagged = product.ingredients.filter(i => i.flag !== 'none');

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
    >
      {result.cachedAt != null && (
        <View
          style={[
            styles.offlineBanner,
            { backgroundColor: colors.highlight, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.offlineTitle, { color: colors.textPrimary }]}>
            {t('product.offlineBadge')}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {t('product.offlineSince', {
              date: new Date(result.cachedAt).toLocaleString(i18n.language),
            })}
          </Text>
        </View>
      )}

      <ProductImage uri={result.imageUrl} size={220} />

      <Text style={[styles.name, { color: colors.textPrimary }]}>
        {product.name ?? t('product.barcode', { barcode: product.barcode })}
      </Text>
      {product.brand && (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {t('product.brand', { brand: product.brand })}
        </Text>
      )}
      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        {t('product.barcode', { barcode: product.barcode })}
      </Text>

      <View style={styles.section}>
        <VerdictBadge
          status={product.veganStatus}
          showDescription
          descriptionKey={
            result.source === 'community' ? 'verdict.communityDesc' : undefined
          }
        />
      </View>

      {flagged.length > 0 && (
        <Card title={t('product.flaggedTitle')}>
          {flagged.map(ingredient => (
            <FlaggedRow key={ingredient.id} ingredient={ingredient} />
          ))}
        </Card>
      )}

      <Card title={t('product.ingredients')}>
        {product.ingredients.length > 0 ? (
          <View style={styles.chips}>
            {product.ingredients.map(ingredient => (
              <IngredientChip key={ingredient.id} ingredient={ingredient} />
            ))}
          </View>
        ) : null}
        <Text style={[styles.ingredientsText, { color: colors.textSecondary }]}>
          {product.ingredientsText ?? t('product.noIngredients')}
        </Text>
      </Card>

      <Text style={[styles.source, { color: colors.textSecondary }]}>
        {result.source === 'community'
          ? t('product.sourceCommunity')
          : t('product.source')}
      </Text>

      <View style={styles.actions}>
        <AppButton title={t('product.scanAnother')} onPress={onScanAgain} />
        <AppButton
          variant="ghost"
          title={t('product.proposeCorrection')}
          onPress={onPropose}
        />
      </View>
    </ScrollView>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function FlaggedRow({ ingredient }: { ingredient: ProductIngredient }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const isNonVegan = ingredient.flag === 'non_vegan';
  return (
    <View style={styles.flaggedRow}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: isNonVegan ? colors.accent : colors.highlight,
            borderColor: colors.border,
          },
        ]}
      />
      <Text style={[styles.flaggedText, { color: colors.textPrimary }]}>
        {ingredient.text}
      </Text>
      <Text style={{ color: colors.textSecondary }}>
        {isNonVegan ? t('product.flaggedNonVegan') : t('product.flaggedMaybe')}
      </Text>
    </View>
  );
}

function IngredientChip({ ingredient }: { ingredient: ProductIngredient }) {
  const { colors } = useTheme();
  const palette = {
    non_vegan: { bg: colors.accent, fg: colors.onPrimary },
    maybe: { bg: colors.highlight, fg: colors.textPrimary },
    none: { bg: colors.surface, fg: colors.textPrimary },
  }[ingredient.flag];
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: palette.bg },
        ingredient.flag === 'maybe' && [
          styles.outlined,
          { borderColor: colors.border },
        ],
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: palette.fg },
          ingredient.flag !== 'none' && styles.chipTextBold,
        ]}
      >
        {ingredient.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  offlineBanner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  offlineTitle: {
    fontWeight: '700',
    marginBottom: 2,
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  meta: {
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  flaggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  flaggedText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  outlined: {
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  chipTextBold: {
    fontWeight: '700',
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  source: {
    marginTop: 16,
    fontSize: 12,
    textAlign: 'center',
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
});
