import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeContext';
import type { ReviewStatus } from '../types/community';

/** Etichetta di stato per proposte e candidature. */
export function StatusPill({ status }: { status: ReviewStatus }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const palette = {
    pending: { bg: colors.highlight, fg: colors.textPrimary },
    approved: { bg: colors.secondary, fg: colors.onPrimary },
    rejected: { bg: colors.surface, fg: colors.textSecondary },
  }[status];
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.fg }]}>
        {t(`panel.status.${status}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
