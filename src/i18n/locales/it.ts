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
    login: 'Accesso',
    becomeVolunteer: 'Diventa volontario',
    volunteerPanel: 'Pannello Volontario',
    proposalReview: 'Revisione proposta',
    superAdminPanel: 'Pannello Super Admin',
    about: 'Descrizione app',
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
    intro:
      'Non trovi un prodotto? Inserisci il codice e scatta tre foto: un volontario le controllerà e aggiungerà il prodotto. Non serve alcun account.',
    barcodeLabel: 'Codice a barre',
    photosTitle: 'Foto richieste',
    photo: {
      product: 'Foto del prodotto',
      barcode: 'Foto del codice a barre',
      ingredients: 'Foto degli ingredienti',
    },
    photoHint: {
      product: 'Il fronte della confezione, con il nome ben visibile.',
      barcode: 'Il codice a barre intero e a fuoco.',
      ingredients: "L'elenco ingredienti completo e leggibile.",
    },
    takePhoto: 'Scatta',
    retake: 'Rifai',
    fromGallery: 'Galleria',
    photosMissing: 'Servono tutte e tre le foto per inviare la proposta.',
    cameraDenied:
      'Accesso alla fotocamera negato: abilitalo dalle impostazioni oppure scegli la foto dalla galleria.',
    photoError: 'Non sono riuscito ad acquisire la foto. Riprova.',
    saveError: 'Salvataggio non riuscito. Riprova.',
    nameLabel: 'Il tuo nome (facoltativo)',
    nameHint: 'Serve solo per ringraziarti: non crea alcun account.',
    notesLabel: 'Note (facoltative)',
    notesPlaceholder: 'Es. dove lo hai trovato, dubbi su un ingrediente…',
    submit: 'Invia proposta',
    successTitle: 'Grazie per la proposta!',
    successText:
      'Il prodotto {{barcode}} è in coda: un volontario controllerà le foto e completerà i dati.',
    backHome: 'Torna alla Home',
    proposeAnother: 'Proponi un altro prodotto',
  },
  auth: {
    login: 'Accedi',
    account: 'Il tuo account',
    intro:
      'Accesso riservato a volontari e amministratori. Per scansionare o proporre prodotti non serve alcun account.',
    email: 'Email',
    password: 'Password',
    submit: 'Accedi',
    logout: 'Esci',
    loggedInAs: 'Accesso effettuato come {{name}}',
    role: {
      admin: 'Volontario',
      superadmin: 'Super admin',
    },
    error: {
      invalid: 'Email o password non corrette.',
      pending:
        'La tua candidatura come volontario è ancora in attesa di approvazione.',
      rejected: 'La tua candidatura come volontario non è stata approvata.',
    },
    notVolunteer: 'Non sei ancora volontario?',
  },
  form: {
    required: 'Campo obbligatorio.',
    invalidEmail: 'Inserisci un indirizzo email valido.',
    passwordTooShort: 'Almeno {{count}} caratteri.',
    passwordMismatch: 'Le password non coincidono.',
  },
  volunteer: {
    intro:
      'I volontari controllano le foto dei prodotti proposti e completano i dati. Compila la candidatura: quando verrà approvata potrai accedere con email e password.',
    name: 'Nome e cognome',
    contactHint: 'La userai per accedere dopo l’approvazione.',
    availability: 'Disponibilità',
    availabilityPlaceholder: 'Es. weekend, sere infrasettimanali',
    motivation: 'Perché vuoi diventare volontario?',
    motivationPlaceholder: 'Qualche riga su di te',
    confirmPassword: 'Conferma password',
    submit: 'Invia candidatura',
    successTitle: 'Candidatura inviata!',
    successText:
      'Un amministratore la valuterà a breve. Quando sarà approvata potrai accedere con {{contact}}.',
    error: {
      already_volunteer:
        'Esiste già un volontario con questa email: accedi dalla schermata di login.',
      already_pending: 'Hai già una candidatura in attesa con questa email.',
    },
  },
  guard: {
    title: 'Accesso riservato',
    loginRequired:
      'Questa sezione è riservata ai volontari. Accedi con le tue credenziali.',
    wrongRole: 'Il tuo account non ha i permessi per questa sezione.',
  },
  panel: {
    pendingProposals: 'In attesa di revisione ({{count}})',
    noProposalsTitle: 'Nessuna proposta in attesa',
    noProposalsText:
      'Ottimo lavoro! Le nuove proposte degli utenti compariranno qui.',
    recentlyReviewed: 'Revisionate di recente',
    proposedBy: 'Proposto da {{name}}',
    anonymous: 'Anonimo',
    review: 'Revisiona →',
    status: {
      pending: 'In attesa',
      approved: 'Approvata',
      rejected: 'Rifiutata',
    },
  },
  review: {
    photos: 'Foto inviate',
    tapToEnlarge: 'Tocca una foto per ingrandirla.',
    closePhoto: 'Chiudi',
    dataTitle: 'Dati del prodotto',
    name: 'Nome del prodotto',
    ingredients: 'Ingredienti',
    ingredientsPlaceholder: 'Trascrivi la lista ingredienti dalla foto',
    verdict: 'Verdetto',
    verdictRequired: 'Scegli un verdetto.',
    approve: 'Approva e pubblica',
    reject: 'Rifiuta proposta',
    rejectReason: 'Motivazione (facoltativa)',
    rejectReasonPlaceholder: 'Es. foto illeggibili, prodotto duplicato…',
    confirmReject: 'Conferma rifiuto',
    alreadyApproved: 'Proposta già approvata come «{{name}}».',
    alreadyRejected: 'Proposta già rifiutata.',
    notFoundTitle: 'Proposta non trovata',
    notFoundText: 'Questa proposta non esiste più.',
  },
  superAdmin: {
    pendingRequests: 'Candidature in attesa ({{count}})',
    noRequestsTitle: 'Nessuna candidatura in attesa',
    noRequestsText:
      'Le nuove candidature "Diventa volontario" compariranno qui.',
    volunteers: 'Volontari attivi ({{count}})',
    noVolunteers: 'Ancora nessun volontario.',
    motivation: 'Motivazione',
    approve: 'Approva',
    reject: 'Rifiuta',
    confirmReject: 'Rifiutare la candidatura di {{name}}?',
  },
  about: {
    lead: 'Scansiona un prodotto alimentare e scopri in un attimo se è vegano.',
    howTitle: 'Come funziona',
    steps: {
      scan: 'Inquadra il codice a barre con la fotocamera, oppure inseriscilo a mano.',
      verdict:
        "L'app legge gli ingredienti e ti mostra il verdetto: vegano, non vegano o incerto, evidenziando gli ingredienti responsabili.",
      propose:
        'Prodotto non trovato? Proponilo con tre foto: non serve alcun account.',
      review:
        'I volontari controllano le foto e pubblicano il prodotto, che da quel momento viene riconosciuto da tutti.',
    },
    sourceTitle: 'Da dove arrivano i dati',
    sourceText:
      "Le informazioni sui prodotti arrivano da Open Food Facts, il database libero e collaborativo dei prodotti alimentari di tutto il mondo. Il verdetto si basa sull'analisi degli ingredienti fatta da Open Food Facts.",
    openOff: 'Visita openfoodfacts.org',
    communityTitle: 'La community',
    communityText:
      'Quando un prodotto manca, chiunque può proporlo. I volontari verificano ogni proposta a mano prima di pubblicarla: i prodotti approvati hanno la precedenza sui dati di Open Food Facts.',
    offlineTitle: 'Anche senza connessione',
    offlineText:
      "L'app ricorda gli ultimi 100 prodotti scansionati: se sei offline ti mostra l'ultimo dato salvato, segnalando che potrebbe non essere aggiornato.",
    disclaimer:
      "I dati possono contenere errori o essere incompleti: in caso di dubbio controlla sempre l'etichetta del prodotto.",
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
