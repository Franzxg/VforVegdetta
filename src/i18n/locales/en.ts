import type { TranslationShape } from './it';

const en: TranslationShape = {
  common: {
    appName: 'V for Vegdetta',
    retry: 'Try again',
    back: 'Back',
    loading: 'Loading…',
  },
  nav: {
    home: 'Home',
    scan: 'Scan',
    product: 'Product',
    proposeProduct: 'Suggest a product',
    settings: 'Settings',
    menu: 'Menu',
    closeMenu: 'Close menu',
  },
  home: {
    title: 'Is this product vegan?',
    subtitle:
      'Scan the barcode and find out instantly with data from Open Food Facts.',
    scanButton: 'Scan',
    lastScan: 'Last scan',
    noLastScan: 'No recent scans',
  },
  scan: {
    hint: 'Frame the barcode',
    manualLink: 'Enter the code manually',
    manualTitle: 'Manual entry',
    manualPlaceholder: 'E.g. 8001234567890',
    manualSubmit: 'Search',
    manualCancel: 'Cancel',
    invalidBarcode:
      'Invalid code: it must have 8, 12, 13 or 14 digits with a correct check digit.',
    permissionTitle: 'Camera needed',
    permissionText:
      'To scan barcodes the app needs camera access. You can still type the code by hand.',
    permissionDeniedText:
      'Camera access was denied. You can enable it from system settings or type the code by hand.',
    permissionRequest: 'Allow access',
    openSettings: 'Open settings',
    noDevice: 'No camera available on this device.',
    cameraError: 'Camera error. Try entering the code by hand.',
  },
  product: {
    barcode: 'Code: {{barcode}}',
    brand: 'Brand: {{brand}}',
    ingredients: 'Ingredients',
    noIngredients: 'Ingredient list not available.',
    flaggedTitle: 'Ingredients behind the verdict',
    flaggedNonVegan: 'Not vegan',
    flaggedMaybe: 'To be checked',
    offlineBadge: 'Offline data / may be outdated',
    offlineSince: 'Saved on {{date}}',
    proposeCorrection: 'Suggest a correction',
    source: 'Source: Open Food Facts',
    sourceCommunity: 'Source: checked by V for Vegdetta volunteers',
    imageAlt: 'Product photo',
    placeholderAlt: 'Image not available',
    scanAnother: 'Scan another product',
  },
  verdict: {
    vegan: 'Vegan',
    non_vegan: 'Not vegan',
    maybe: 'Uncertain',
    unknown: 'Data not available',
    veganDesc:
      'According to Open Food Facts no ingredient is of animal origin.',
    non_veganDesc: 'Contains at least one ingredient of animal origin.',
    communityDesc:
      'Verdict assigned by a volunteer after checking the label photos.',
    maybeDesc: 'Some ingredients might be of animal origin: check the label.',
    unknownDesc: 'Open Food Facts does not have enough information to tell.',
  },
  states: {
    notFoundTitle: 'Product not found',
    notFoundText:
      'The code {{barcode}} is not on Open Food Facts. Help us add it!',
    proposeThis: 'Suggest this product',
    invalidTitle: 'Invalid barcode',
    invalidText: 'The code “{{barcode}}” does not look like a valid barcode.',
    networkTitle: 'No connection',
    networkText:
      "Can't reach Open Food Facts and this product isn't saved on the phone. Check your connection and try again.",
    serviceTitle: 'Service unavailable',
    serviceText:
      'Open Food Facts is not responding correctly right now. Try again shortly.',
  },
  propose: {
    comingSoon:
      'The product proposal form (photos, notes, optional name) will be available soon.',
    barcodeLabel: 'Barcode',
  },
  settings: {
    theme: 'Theme',
    themeSystem: 'Automatic',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
  },
  languages: {
    it: 'Italiano',
    en: 'English',
  },
};

export default en;
