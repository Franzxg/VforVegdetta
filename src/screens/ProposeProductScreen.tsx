import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { useCameraPermission } from 'react-native-vision-camera';
import { AppButton } from '../components/AppButton';
import { PhotoField } from '../components/PhotoField';
import { StateView } from '../components/StateView';
import { TextField } from '../components/TextField';
import { useCommunity } from '../context/CommunityContext';
import type { RootScreenProps } from '../navigation/types';
import {
  PhotoPermissionError,
  PhotoSource,
  capturePhoto,
} from '../services/photoCapture';
import { useTheme } from '../theme/ThemeContext';
import { PHOTO_KINDS, PhotoKind, ProposalPhotos } from '../types/community';
import { isValidBarcode, normalizeBarcode } from '../utils/barcode';

const NOTES_MAX_LENGTH = 500;

type Photos = Record<PhotoKind, string | null>;
const EMPTY_PHOTOS: Photos = {
  product: null,
  barcode: null,
  ingredients: null,
};

/**
 * Proposta di un prodotto mancante (§5.6): aperta a chiunque, senza login.
 * Il barcode arriva precompilato dalla schermata "prodotto non trovato".
 */
export function ProposeProductScreen({
  navigation,
  route,
}: RootScreenProps<'ProposeProduct'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { submitProposal } = useCommunity();
  const camera = useCameraPermission();

  const [barcode, setBarcode] = useState(route.params?.barcode ?? '');
  const [photos, setPhotos] = useState<Photos>(EMPTY_PHOTOS);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [photoError, setPhotoError] = useState<
    'cameraDenied' | 'photoError' | 'saveError' | null
  >(null);
  const [saving, setSaving] = useState(false);
  const [sentBarcode, setSentBarcode] = useState<string | null>(null);

  const normalizedBarcode = normalizeBarcode(barcode);
  const barcodeError =
    showErrors && !isValidBarcode(normalizedBarcode)
      ? t('scan.invalidBarcode')
      : null;
  const missingPhotos = PHOTO_KINDS.filter(kind => !photos[kind]);

  const ensureCameraPermission = async (): Promise<boolean> => {
    if (camera.hasPermission) {
      return true;
    }
    if (camera.canRequestPermission) {
      return camera.requestPermission();
    }
    return false;
  };

  const pick = async (kind: PhotoKind, source: PhotoSource) => {
    setPhotoError(null);
    try {
      if (source === 'camera' && !(await ensureCameraPermission())) {
        throw new PhotoPermissionError();
      }
      const uri = await capturePhoto(source);
      if (uri) {
        setPhotos(prev => ({ ...prev, [kind]: uri }));
      }
    } catch (error) {
      setPhotoError(
        error instanceof PhotoPermissionError ? 'cameraDenied' : 'photoError',
      );
    }
  };

  const submit = async () => {
    setShowErrors(true);
    if (!isValidBarcode(normalizedBarcode) || missingPhotos.length > 0) {
      return;
    }
    setSaving(true);
    try {
      await submitProposal(
        {
          barcode: normalizedBarcode,
          proposedByName: name.trim() || null,
          notes: notes.trim(),
        },
        photos as ProposalPhotos,
      );
      setSentBarcode(normalizedBarcode);
      setSubmitted(true);
    } catch {
      setPhotoError('saveError');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setBarcode('');
    setPhotos(EMPTY_PHOTOS);
    setName('');
    setNotes('');
    setShowErrors(false);
    setPhotoError(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <StateView
        title={t('propose.successTitle')}
        message={t('propose.successText', { barcode: sentBarcode })}
      >
        <AppButton
          title={t('propose.backHome')}
          onPress={() => navigation.popToTop()}
        />
        <AppButton
          variant="ghost"
          title={t('propose.proposeAnother')}
          onPress={reset}
        />
      </StateView>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.surface }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.intro, { color: colors.textSecondary }]}>
        {t('propose.intro')}
      </Text>

      <TextField
        label={t('propose.barcodeLabel')}
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="number-pad"
        maxLength={18}
        placeholder={t('scan.manualPlaceholder')}
        error={barcodeError}
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t('propose.photosTitle')}
      </Text>
      {PHOTO_KINDS.map(kind => (
        <PhotoField
          key={kind}
          label={t(`propose.photo.${kind}`)}
          hint={t(`propose.photoHint.${kind}`)}
          uri={photos[kind]}
          error={showErrors && !photos[kind]}
          onPick={source => pick(kind, source)}
        />
      ))}
      {showErrors && missingPhotos.length > 0 && (
        <Text style={[styles.error, { color: colors.accent }]}>
          {t('propose.photosMissing')}
        </Text>
      )}
      {photoError && (
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.highlight, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.textPrimary }}>
            {t(`propose.${photoError}`)}
          </Text>
          {photoError === 'cameraDenied' && !camera.canRequestPermission && (
            <AppButton
              variant="ghost"
              title={t('scan.openSettings')}
              onPress={() => Linking.openSettings()}
            />
          )}
        </View>
      )}

      <TextField
        label={t('propose.nameLabel')}
        hint={t('propose.nameHint')}
        value={name}
        onChangeText={setName}
        maxLength={60}
        autoCapitalize="words"
      />
      <TextField
        label={t('propose.notesLabel')}
        value={notes}
        onChangeText={setNotes}
        placeholder={t('propose.notesPlaceholder')}
        multiline
        maxLength={NOTES_MAX_LENGTH}
      />

      <AppButton
        title={saving ? t('common.loading') : t('propose.submit')}
        onPress={submit}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  intro: {
    fontSize: 15,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  error: {
    fontSize: 14,
  },
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
});
