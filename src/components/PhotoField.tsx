import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import type { PhotoSource } from '../services/photoCapture';
import { useTheme } from '../theme/ThemeContext';
import { AppButton } from './AppButton';
import { ProposalPhoto } from './ProposalPhoto';

/** Slot per una delle tre foto richieste dalla proposta prodotto. */
export function PhotoField({
  label,
  hint,
  uri,
  error,
  onPick,
}: {
  label: string;
  hint: string;
  uri: string | null;
  error?: boolean;
  onPick: (source: PhotoSource) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: error ? colors.accent : colors.border,
        },
      ]}
    >
      {uri ? (
        <ProposalPhoto uri={uri} label={label} style={styles.preview} />
      ) : (
        <View
          style={[
            styles.preview,
            styles.empty,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.plus, { color: colors.textSecondary }]}>+</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
        </Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          {hint}
        </Text>
        <View style={styles.actions}>
          <AppButton
            title={uri ? t('propose.retake') : t('propose.takePhoto')}
            onPress={() => onPick('camera')}
            style={styles.button}
          />
          <AppButton
            variant="ghost"
            title={t('propose.fromGallery')}
            onPress={() => onPick('gallery')}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  preview: {
    width: 96,
    height: 96,
  },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 36,
    fontWeight: '300',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});
