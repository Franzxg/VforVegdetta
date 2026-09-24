import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '../components/Text';
import {
  SegmentOption,
  SegmentedControl,
} from '../components/SegmentedControl';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import {
  ADDITIVES,
  Additive,
  AdditiveVeganStatus,
  filterAdditives,
  localized,
} from '../utils/additives';

type StatusFilter = AdditiveVeganStatus | 'all';

function statusColors(status: AdditiveVeganStatus, colors: ThemeColors) {
  switch (status) {
    case 'yes':
      return { bg: colors.secondary, fg: colors.onSecondary };
    case 'no':
      return { bg: colors.accent, fg: colors.onPrimary };
    default:
      return { bg: colors.highlight, fg: colors.textPrimary };
  }
}

/** Additivi alimentari (§6.11): elenco consultabile con ricerca e filtro. */
export function AdditivesScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  const results = useMemo(
    () => filterAdditives(ADDITIVES, query, status, i18n.language),
    [query, status, i18n.language],
  );

  const filterOptions: SegmentOption<StatusFilter>[] = [
    { value: 'all', label: t('additives.filter.all') },
    { value: 'yes', label: t('additives.filter.yes') },
    { value: 'no', label: t('additives.filter.no') },
    { value: 'maybe', label: t('additives.filter.maybe') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.controls}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('additives.searchPlaceholder')}
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel={t('additives.searchPlaceholder')}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          style={[
            styles.search,
            {
              color: colors.textPrimary,
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        />
        <SegmentedControl
          options={filterOptions}
          selected={status}
          onChange={setStatus}
        />
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {t('additives.count', { count: results.length })}
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.code}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <AdditiveRow additive={item} />}
        ListEmptyComponent={
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {t('additives.emptyTitle')}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {t('additives.emptyText')}
            </Text>
          </View>
        }
        ListFooterComponent={
          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            {t('additives.footer')}
          </Text>
        }
      />
    </View>
  );
}

function AdditiveRow({ additive }: { additive: Additive }) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const palette = statusColors(additive.vegan, colors);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <View style={styles.rowHeader}>
        <Text style={[styles.code, { color: colors.primary }]}>
          {additive.code}
        </Text>
        <Text
          style={[styles.name, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {localized(additive.name, i18n.language)}
        </Text>
        <View style={[styles.pill, { backgroundColor: palette.bg }]}>
          <Text style={[styles.pillText, { color: palette.fg }]}>
            {t(`additives.status.${additive.vegan}`)}
          </Text>
        </View>
      </View>
      <Text style={[styles.note, { color: colors.textSecondary }]}>
        {localized(additive.note, i18n.language)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  count: {
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 20,
    // Spazio extra: la barra di navigazione di sistema copre il fondo.
    paddingBottom: 64,
    gap: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  code: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 56,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  pill: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});
