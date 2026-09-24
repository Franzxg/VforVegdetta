import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, Linking, StyleSheet, View } from 'react-native';
import { Text, TextInput } from '../components/Text';
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

function ManualEntryButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <AppButton
      variant="secondary"
      title={t('scan.manualLink')}
      onPress={onPress}
      style={styles.manualButton}
    />
  );
}

/** Messaggio al posto della fotocamera, con l'alternativa manuale. */
function CameraFallback({
  message,
  onManualEntry,
}: {
  message: string;
  onManualEntry: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.cameraFallback, { backgroundColor: colors.surface }]}>
      <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>
        {message}
      </Text>
      <ManualEntryButton onPress={onManualEntry} />
    </View>
  );
}

function BarcodeCamera({
  isActive,
  onScanned,
  onError,
  onManualEntry,
}: {
  isActive: boolean;
  onScanned: (code: string) => void;
  onError: () => void;
  onManualEntry: () => void;
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
      <CameraFallback
        message={t('scan.noDevice')}
        onManualEntry={onManualEntry}
      />
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
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View
          style={[styles.mask, { backgroundColor: colors.overlay }]}
          pointerEvents="none"
        />
        <View style={styles.frameRow} pointerEvents="none">
          <View style={[styles.mask, { backgroundColor: colors.overlay }]} />
          <View style={[styles.frame, { borderColor: colors.highlight }]} />
          <View style={[styles.mask, { backgroundColor: colors.overlay }]} />
        </View>
        {/* Il bottone sta subito sotto il mirino: lontano dalla barra di
            navigazione di sistema, che con l'edge-to-edge copre il fondo. */}
        <View
          style={[styles.mask, { backgroundColor: colors.overlay }]}
          pointerEvents="box-none"
        >
          <Text style={[styles.hint, { color: colors.highlight }]}>
            {t('scan.hint')}
          </Text>
          <ManualEntryButton onPress={onManualEntry} />
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

  const openManual = useCallback(() => setManualOpen(true), []);

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
        <AppButton
          variant="ghost"
          title={t('scan.manualLink')}
          onPress={openManual}
        />
      </StateView>
    );
  } else if (cameraFailed) {
    cameraArea = (
      <CameraFallback
        message={t('scan.cameraError')}
        onManualEntry={openManual}
      />
    );
  } else {
    cameraArea = (
      <BarcodeCamera
        isActive={cameraActive}
        onScanned={openProduct}
        onError={() => setCameraFailed(true)}
        onManualEntry={openManual}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* In alto, così né la tastiera né la barra di sistema lo coprono */}
      {manualOpen && (
        <View
          style={[
            styles.manualPanel,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
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
        </View>
      )}

      <View style={styles.cameraArea}>{cameraArea}</View>
    </View>
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
    gap: 16,
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
  manualButton: {
    marginTop: 16,
  },
  manualPanel: {
    padding: 20,
    borderBottomWidth: 1,
    gap: 10,
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
