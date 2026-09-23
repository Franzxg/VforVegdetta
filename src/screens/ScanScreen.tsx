import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppState,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {
  type Barcode,
  type TargetBarcodeFormat,
  useBarcodeScannerOutput,
} from 'react-native-vision-camera-barcode-scanner';
import { AppButton } from '../components/AppButton';
import { StateView } from '../components/StateView';
import type { RootScreenProps } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { isValidBarcode, normalizeBarcode } from '../utils/barcode';

// Riferimento stabile: il hook ricrea l'output se l'array cambia.
const FOOD_BARCODE_FORMATS: TargetBarcodeFormat[] = [
  'ean-13',
  'ean-8',
  'upc-a',
];

function useAppIsActive(): boolean {
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const sub = AppState.addEventListener('change', state =>
      setActive(state === 'active'),
    );
    return () => sub.remove();
  }, []);
  return active;
}

function BarcodeCamera({
  isActive,
  onScanned,
  onError,
}: {
  isActive: boolean;
  onScanned: (code: string) => void;
  onError: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const device = useCameraDevice('back');

  const output = useBarcodeScannerOutput({
    barcodeFormats: FOOD_BARCODE_FORMATS,
    onBarcodeScanned: (barcodes: Barcode[]) => {
      const code = barcodes.find(b => b.rawValue)?.rawValue;
      if (code) {
        onScanned(code);
      }
    },
    // Errori sul singolo frame: si ignora e si riprova col frame successivo.
    onError: () => {},
  });

  if (device == null) {
    return (
      <View
        style={[styles.cameraFallback, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>
          {t('scan.noDevice')}
        </Text>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        outputs={[output]}
        onError={onError}
      />
      {/* Mirino: velo scuro con una finestra al centro */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.mask, { backgroundColor: colors.overlay }]} />
        <View style={styles.frameRow}>
          <View style={[styles.mask, { backgroundColor: colors.overlay }]} />
          <View style={[styles.frame, { borderColor: colors.highlight }]} />
          <View style={[styles.mask, { backgroundColor: colors.overlay }]} />
        </View>
        <View style={[styles.mask, { backgroundColor: colors.overlay }]}>
          <Text style={[styles.hint, { color: colors.highlight }]}>
            {t('scan.hint')}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ScanScreen({ navigation }: RootScreenProps<'Scan'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const appActive = useAppIsActive();
  const { hasPermission, canRequestPermission, requestPermission } =
    useCameraPermission();

  const [manualOpen, setManualOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [cameraFailed, setCameraFailed] = useState(false);
  const handled = useRef(false);

  useEffect(() => {
    if (!hasPermission && canRequestPermission) {
      requestPermission();
    }
  }, [hasPermission, canRequestPermission, requestPermission]);

  const openProduct = useCallback(
    (barcode: string) => {
      if (handled.current) {
        return;
      }
      handled.current = true;
      navigation.replace('Product', { barcode });
    },
    [navigation],
  );

  const submitManual = () => {
    const code = normalizeBarcode(manualCode);
    if (!isValidBarcode(code)) {
      setManualError(t('scan.invalidBarcode'));
      return;
    }
    openProduct(code);
  };

  const cameraActive = isFocused && appActive && !manualOpen;

  let cameraArea: React.ReactNode;
  if (!hasPermission) {
    cameraArea = (
      <StateView
        title={t('scan.permissionTitle')}
        message={
          canRequestPermission
            ? t('scan.permissionText')
            : t('scan.permissionDeniedText')
        }
      >
        {canRequestPermission ? (
          <AppButton
            title={t('scan.permissionRequest')}
            onPress={requestPermission}
          />
        ) : (
          <AppButton
            title={t('scan.openSettings')}
            onPress={() => Linking.openSettings()}
          />
        )}
      </StateView>
    );
  } else if (cameraFailed) {
    cameraArea = (
      <View
        style={[styles.cameraFallback, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>
          {t('scan.cameraError')}
        </Text>
      </View>
    );
  } else {
    cameraArea = (
      <BarcodeCamera
        isActive={cameraActive}
        onScanned={openProduct}
        onError={() => setCameraFailed(true)}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.surface }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.cameraArea}>{cameraArea}</View>

      <View
        style={[
          styles.bottomPanel,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        {manualOpen ? (
          <>
            <Text style={[styles.manualTitle, { color: colors.textPrimary }]}>
              {t('scan.manualTitle')}
            </Text>
            <TextInput
              autoFocus
              value={manualCode}
              onChangeText={text => {
                setManualCode(text);
                setManualError(null);
              }}
              onSubmitEditing={submitManual}
              keyboardType="number-pad"
              returnKeyType="search"
              maxLength={18}
              placeholder={t('scan.manualPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surface,
                  borderColor: manualError ? colors.accent : colors.border,
                },
              ]}
            />
            {manualError && (
              <Text style={[styles.error, { color: colors.accent }]}>
                {manualError}
              </Text>
            )}
            <View style={styles.manualActions}>
              <AppButton
                variant="ghost"
                title={t('scan.manualCancel')}
                onPress={() => {
                  setManualOpen(false);
                  setManualError(null);
                }}
                style={styles.flex}
              />
              <AppButton
                title={t('scan.manualSubmit')}
                onPress={submitManual}
                style={styles.flex}
              />
            </View>
          </>
        ) : (
          <Pressable
            accessibilityRole="link"
            onPress={() => setManualOpen(true)}
            hitSlop={8}
          >
            <Text style={[styles.manualLink, { color: colors.primary }]}>
              {t('scan.manualLink')}
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  cameraArea: {
    flex: 1,
  },
  cameraFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
  },
  mask: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
  frameRow: {
    flexDirection: 'row',
    height: 170,
  },
  frame: {
    width: '78%',
    borderWidth: 3,
    borderRadius: 16,
  },
  hint: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPanel: {
    padding: 20,
    borderTopWidth: 1,
    gap: 10,
  },
  manualLink: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  manualTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    letterSpacing: 1,
  },
  error: {
    fontSize: 14,
  },
  manualActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
