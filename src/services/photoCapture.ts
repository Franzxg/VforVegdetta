import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export type PhotoSource = 'camera' | 'gallery';

export class PhotoPermissionError extends Error {}

// Le foto finiscono in AsyncStorage come base64: le ridimensioniamo per
// restare sulle ~100 KB ciascuna, sufficienti per leggere un'etichetta.
const OPTIONS = {
  mediaType: 'photo' as const,
  includeBase64: true,
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.6 as const,
};

function toDataUri(asset: Asset | undefined): string | null {
  if (!asset?.base64) {
    return null;
  }
  return `data:${asset.type ?? 'image/jpeg'};base64,${asset.base64}`;
}

/**
 * Acquisisce una foto dalla fotocamera o dalla galleria.
 * Restituisce un data URI (persistente, a differenza dei file temporanei
 * creati dalla libreria) oppure `null` se l'utente annulla.
 */
export async function capturePhoto(
  source: PhotoSource,
): Promise<string | null> {
  const response: ImagePickerResponse =
    source === 'camera'
      ? await launchCamera({ ...OPTIONS, saveToPhotos: false })
      : await launchImageLibrary({ ...OPTIONS, selectionLimit: 1 });

  if (response.didCancel) {
    return null;
  }
  if (response.errorCode === 'permission') {
    throw new PhotoPermissionError(response.errorMessage);
  }
  if (response.errorCode) {
    throw new Error(response.errorMessage ?? response.errorCode);
  }
  const uri = toDataUri(response.assets?.[0]);
  if (!uri) {
    throw new Error('No image data');
  }
  return uri;
}
