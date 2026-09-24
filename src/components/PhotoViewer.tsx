import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { ProposalPhoto } from './ProposalPhoto';

/** Foto a tutto schermo, per leggere bene etichette e ingredienti. */
export function PhotoViewer({
  photo,
  onClose,
}: {
  photo: { uri: string; label: string } | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={photo != null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <View style={styles.header}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.textPrimary }]}
          >
            {photo?.label}
          </Text>
          <Pressable accessibilityRole="button" hitSlop={12} onPress={onClose}>
            <Text style={[styles.close, { color: colors.primary }]}>
              {t('review.closePhoto')}
            </Text>
          </Pressable>
        </View>
        {photo && (
          <ProposalPhoto
            uri={photo.uri}
            label={photo.label}
            style={styles.photo}
            fit="contain"
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },
  close: {
    fontSize: 16,
    fontWeight: '600',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
});
