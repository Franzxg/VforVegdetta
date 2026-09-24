import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import type { VeganStatus } from '../types/product';

export function verdictColors(
  status: VeganStatus,
  colors: ThemeColors,
): { background: string; text: string } {
  switch (status) {
    case 'vegan':
      return { background: colors.secondary, text: colors.onSecondary };
    case 'non_vegan':
      return { background: colors.accent, text: colors.onPrimary };
    case 'maybe':
      return { background: colors.highlight, text: colors.textPrimary };
    default:
      return { background: colors.background, text: colors.textSecondary };
  }
}

export function VerdictBadge({
  status,
  showDescription = false,
  compact = false,
  descriptionKey,
}: {
  status: VeganStatus;
  showDescription?: boolean;
  compact?: boolean;
  /** Sostituisce la descrizione standard (basata su Open Food Facts). */
  descriptionKey?: string;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const palette = verdictColors(status, colors);

  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.badge,
        compact && styles.compact,
        { backgroundColor: palette.background },
      ]}
    >
      <Text
        style={[
          styles.label,
          compact && styles.compactLabel,
          { color: palette.text },
        ]}
      >
        {t(`verdict.${status}`)}
      </Text>
      {showDescription && (
        <Text style={[styles.description, { color: palette.text }]}>
          {t(descriptionKey ?? `verdict.${status}Desc`)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  compact: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  compactLabel: {
    fontSize: 13,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 22,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },
});
