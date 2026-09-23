const it = {
  common: {
    appName: 'V for Vegdetta',
    retry: 'Riprova',
    back: 'Indietro',
    loading: 'Caricamento…',
  },
  nav: {
    home: 'Home',
    scan: 'Scansiona',
    product: 'Prodotto',
    proposeProduct: 'Proponi un prodotto',
    settings: 'Impostazioni',
    menu: 'Menu',
    closeMenu: 'Chiudi menu',
  },
  home: {
    title: 'Questo prodotto è vegano?',
    subtitle:
      'Scansiona il codice a barre e scoprilo subito grazie ai dati di Open Food Facts.',
    scanButton: 'Scansiona',
    lastScan: 'Ultima scansione',
    noLastScan: 'Nessuna scansione recente',
  },
  scan: {
    hint: 'Inquadra il codice a barre',
    manualLink: 'Inserisci il codice manualmente',
    manualTitle: 'Inserimento manuale',
    manualPlaceholder: 'Es. 8001234567890',
    manualSubmit: 'Cerca',
    manualCancel: 'Annulla',
    invalidBarcode:
      'Codice non valido: servono 8, 12, 13 o 14 cifre con cifra di controllo corretta.',
    permissionTitle: 'Serve la fotocamera',
    permissionText:
      "Per scansionare i codici a barre l'app ha bisogno dell'accesso alla fotocamera. Puoi comunque inserire il codice a mano.",
    permissionDeniedText:
      "L'accesso alla fotocamera è stato negato. Puoi abilitarlo dalle impostazioni di sistema oppure inserire il codice a mano.",
    permissionRequest: 'Consenti accesso',
    openSettings: 'Apri impostazioni',
    noDevice: 'Nessuna fotocamera disponibile su questo dispositivo.',
    cameraError: 'Errore della fotocamera. Prova a inserire il codice a mano.',
  },
  product: {
    barcode: 'Codice: {{barcode}}',
    brand: 'Marca: {{brand}}',
    ingredients: 'Ingredienti',
    noIngredients: 'Lista ingredienti non disponibile.',
    flaggedTitle: 'Ingredienti che determinano il verdetto',
    flaggedNonVegan: 'Non vegano',
    flaggedMaybe: 'Da verificare',
    offlineBadge: 'Dati offline / non aggiornati',
    offlineSince: 'Salvati il {{date}}',
    proposeCorrection: 'Proponi correzione',
    source: 'Fonte: Open Food Facts',
    sourceCommunity: 'Fonte: verificato dai volontari di V for Vegdetta',
    imageAlt: 'Foto del prodotto',
    placeholderAlt: 'Immagine non disponibile',
    scanAnother: 'Scansiona un altro prodotto',
  },
  verdict: {
    vegan: 'Vegano',
    non_vegan: 'Non vegano',
    maybe: 'Incerto',
    unknown: 'Dato non disponibile',
    veganDesc:
      'Secondo Open Food Facts nessun ingrediente è di origine animale.',
    non_veganDesc: 'Contiene almeno un ingrediente di origine animale.',
    communityDesc:
      "Verdetto assegnato da un volontario dopo aver controllato le foto dell'etichetta.",
    maybeDesc:
      "Alcuni ingredienti potrebbero essere di origine animale: controlla l'etichetta.",
    unknownDesc:
      'Open Food Facts non ha abbastanza informazioni per stabilirlo.',
  },
  states: {
    notFoundTitle: 'Prodotto non trovato',
    notFoundText:
      'Il codice {{barcode}} non è presente su Open Food Facts. Aiutaci ad aggiungerlo!',
    proposeThis: 'Proponi questo prodotto',
    invalidTitle: 'Codice a barre non valido',
    invalidText: 'Il codice «{{barcode}}» non sembra un codice a barre valido.',
    networkTitle: 'Nessuna connessione',
    networkText:
      'Non riesco a raggiungere Open Food Facts e questo prodotto non è tra quelli salvati sul telefono. Controlla la connessione e riprova.',
    serviceTitle: 'Servizio non disponibile',
    serviceText:
      'Open Food Facts non risponde correttamente in questo momento. Riprova tra poco.',
  },
  propose: {
    comingSoon:
      'Il modulo di proposta prodotto (foto, note, nome facoltativo) sarà disponibile a breve.',
    barcodeLabel: 'Codice a barre',
  },
  settings: {
    theme: 'Tema',
    themeSystem: 'Automatico',
    themeLight: 'Chiaro',
    themeDark: 'Scuro',
    language: 'Lingua',
  },
  languages: {
    it: 'Italiano',
    en: 'English',
  },
};

export default it;
export type TranslationShape = typeof it;
