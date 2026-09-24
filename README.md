# V for Vegdetta

App Android in React Native che scansiona il codice a barre di un prodotto
alimentare e dice se è **vegano**, **non vegano** o **incerto**, usando i dati
pubblici di [Open Food Facts](https://world.openfoodfacts.org).
Attorno allo scanner c'è una piccola community: chiunque può proporre i
prodotti mancanti, i volontari li verificano e da quel momento l'app li
riconosce.

Progetto conclusivo del corso di React Native. L'app è **frontend-only**:
l'unica chiamata di rete è verso l'API pubblica di Open Food Facts, mentre
ruoli, proposte e candidature sono simulati sul dispositivo con dati di
esempio precaricati.

## Funzionalità

**Scansione e verdetto**

- Scansione del codice a barre con la fotocamera (EAN-13, EAN-8, UPC-A) o
  inserimento manuale, con controllo della cifra di controllo.
- Verdetto calcolato dal campo `ingredients_analysis_tags` di Open Food Facts.
- Dettaglio prodotto con foto, ingredienti ed evidenziazione di quelli che
  determinano il verdetto (non vegani o da verificare).
- Gestione di tutti gli stati: prodotto non trovato, codice non valido,
  nessuna connessione, servizio non disponibile.

**Modalità offline**

- Ogni prodotto scansionato viene salvato sul telefono: fino a **100
  prodotti**, eliminando il meno recente oltre il limite.
- Senza connessione l'app mostra l'ultimo dato salvato con il badge
  "Dati offline / non aggiornati".
- In cache vanno solo i dati testuali: al posto della foto compare il logo
  dell'app.
- La home mostra le **ultime 10 scansioni**.

**Community (nessun account richiesto per usare l'app)**

- **Proponi un prodotto**: barcode, foto del prodotto, del codice a barre e
  degli ingredienti (da fotocamera o galleria), nome e note facoltativi. Dalla
  schermata "prodotto non trovato" il barcode è già compilato.
- **Diventa volontario**: candidatura con nome, email, disponibilità,
  motivazione e password.
- **Pannello Volontario**: coda delle proposte, revisione delle tre foto,
  compilazione di nome, ingredienti e verdetto, approvazione o rifiuto. I
  prodotti approvati vengono riconosciuti nelle scansioni, anche offline, e
  hanno la precedenza sui dati di Open Food Facts.
- **Pannello Super Admin**: approvazione o rifiuto delle candidature.

**Pagine di supporto**

- **Descrizione app**: come funziona e da dove arrivano i dati.
- **Additivi alimentari**: 34 additivi comuni con ricerca per codice o nome e
  filtro per stato vegano (sì / no / forse).

**Trasversali**

- Italiano e inglese, selezionabili dalle impostazioni.
- Tema chiaro, scuro o automatico (segue il sistema).
- Splash screen nativa, anche in versione scura.
- Font [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/),
  pensato per la massima leggibilità.

## Tecnologie

| Area | Scelta |
|---|---|
| Framework | React Native 0.87 (CLI, niente Expo), TypeScript |
| Navigazione | React Navigation 7 (native stack) |
| Stato globale | Context API |
| Persistenza | `@react-native-async-storage/async-storage` |
| Scanner barcode | `react-native-vision-camera` 5 + `react-native-vision-camera-barcode-scanner` (ML Kit) |
| Foto delle proposte | `react-native-image-picker` |
| Traduzioni | `i18next`, `react-i18next`, `react-native-localize` |
| Splash screen | `react-native-bootsplash` |
| Rete | `fetch` nativo, solo verso Open Food Facts |
| Test | Jest |

## Installazione

La procedura è pensata per Android, l'unica piattaforma su cui l'app è
sviluppata e provata. I comandi funzionano su Windows (Git Bash o
PowerShell), macOS e Linux.

### 1. Prepara l'ambiente di sviluppo

Segui la guida ufficiale di React Native
[Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment),
scegliendo **Development OS** = il tuo sistema e **Target OS** = Android.
Al termine devi avere:

| Strumento | Versione | Come verificarla |
|---|---|---|
| Node.js | 22.11 o successiva | `node -v` |
| npm | incluso in Node.js | `npm -v` |
| Git | qualsiasi recente | `git --version` |
| JDK | 17 | `java -version` |
| Android Studio | recente | — |
| Android SDK Platform | 37 (API 37) | Android Studio → SDK Manager |
| Android SDK Build-Tools | 37.0.0 | Android Studio → SDK Manager → SDK Tools |
| NDK (Side by side) | 27.1.12297006 | Android Studio → SDK Manager → SDK Tools |
| CMake | quello proposto dall'SDK Manager | Android Studio → SDK Manager → SDK Tools |

Controlla anche le variabili d'ambiente:

- `ANDROID_HOME` deve puntare alla cartella dell'SDK (su Windows di solito
  `%LOCALAPPDATA%\Android\Sdk`, su macOS `~/Library/Android/sdk`);
- `JAVA_HOME` deve puntare al JDK 17;
- la cartella `platform-tools` dell'SDK deve essere nel `PATH`, così il
  comando `adb` funziona da terminale (`adb version`).

Non serve installare globalmente la CLI di React Native: si usa quella del
progetto tramite gli script npm.

> Se manca qualcosa (Build-Tools, NDK, CMake), di solito Gradle lo scarica da
> solo alla prima build, purché le licenze dell'SDK siano state accettate.

### 2. Prepara il telefono

La scansione del codice a barre usa la fotocamera, quindi conviene un
telefono Android reale (Android 7.0 o successivo).

1. Attiva le **Opzioni sviluppatore**: Impostazioni → Informazioni sul
   telefono → tocca 7 volte "Numero build" (su Xiaomi: "Versione MIUI").
2. Nelle Opzioni sviluppatore attiva **Debug USB**.
3. Solo su Xiaomi (MIUI/HyperOS): attiva anche **Installa tramite USB** e
   **Debug USB (impostazioni di sicurezza)**. Può essere richiesto l'accesso
   con l'account Mi.
4. Collega il telefono al computer e, sul telefono, autorizza il computer
   quando compare la richiesta "Consentire il debug USB?".
5. Verifica il collegamento:

   ```sh
   adb devices
   ```

   Il telefono deve comparire con lo stato `device`. Se compare
   `unauthorized`, sblocca il telefono e accetta la richiesta.

**In alternativa, un emulatore** creato da Android Studio (Device Manager)
funziona per tutto il resto dell'app. Per la scansione si può usare
l'inserimento manuale del codice.

### 3. Scarica il progetto e installa le dipendenze

```sh
git clone https://github.com/Franzxg/VforVegdetta.git
cd VforVegdetta
npm install
```

`npm install` scarica tutte le librerie JavaScript e native elencate in
`package.json`. Non servono altri passaggi di configurazione:

- **nessuna chiave API**: Open Food Facts è un'API pubblica;
- **nessun file `.env`** o backend da avviare;
- **nessun database**: i dati di prova vengono caricati dall'app al primo
  avvio (vedi [Dati per la demo](#dati-per-la-demo)).

### 4. Avvia Metro

Metro è il server che fornisce il codice JavaScript all'app durante lo
sviluppo. In un primo terminale, dalla cartella del progetto:

```sh
npm start
```

Lascia questo terminale aperto per tutta la sessione di lavoro.

### 5. Compila e installa l'app

In un secondo terminale, con il telefono collegato:

```sh
npm run android -- --active-arch-only
```

Il comando compila l'app, la installa sul telefono, la avvia e la collega a
Metro.

- La **prima compilazione** richiede diversi minuti: Gradle scarica le sue
  dipendenze e compila le parti native (fotocamera, scanner ML Kit).
- `--active-arch-only` compila solo l'architettura del telefono collegato:
  è più veloce ed evita un errore di CMake che su Windows può comparire
  compilando tutte le architetture insieme.
- **Su Xiaomi** compare sul telefono la richiesta di conferma
  dell'installazione, con un conto alla rovescia: tocca **Installa**.

Se preferisci compilare senza installare:

```sh
cd android
./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a
cd ..
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Su PowerShell usa `.\gradlew` al posto di `./gradlew`.

### 6. Primo avvio

1. Compare la splash screen, poi la home.
2. Tocca **Scansiona**: l'app chiede il permesso per la fotocamera,
   concedilo.
3. Inquadra un codice a barre oppure tocca **Inserisci il codice
   manualmente**.

Serve una connessione internet per interrogare Open Food Facts. Senza rete
l'app funziona con i prodotti già scansionati e con quelli approvati dai
volontari.

### Lavorare sul codice

- Le modifiche al **codice JavaScript/TypeScript** si vedono subito
  ricaricando l'app: premi `r` nel terminale di Metro.
- Dopo modifiche **native** bisogna ricompilare e reinstallare l'app con il
  comando del passo 5. Sono native: nuove librerie con codice nativo,
  file in `android/`, icone, splash screen, font.
- Prima di un commit esegui i controlli:

  ```sh
  npm run lint
  npx tsc --noEmit
  npm test
  ```

## Script

| Comando | Cosa fa |
|---|---|
| `npm start` | Avvia Metro |
| `npm run android` | Compila e installa l'app su Android |
| `npm test` | Esegue i test unitari |
| `npm run lint` | Controlla il codice con ESLint |
| `npx tsc --noEmit` | Controlla i tipi TypeScript |

I test coprono la logica pura: mapping del verdetto ed evidenziazione degli
ingredienti, validazione dei codici a barre, cache LRU, ruoli e flussi di
approvazione, ricerca negli additivi.

## Struttura del progetto

```
src/
├── assets/        logo (chiaro e scuro), font, asset della splash
├── components/    componenti riutilizzabili (bottoni, badge, campi, menu…)
├── context/       CommunityContext (dati locali) e AuthContext (useAuth)
├── data/          dati di esempio e database degli additivi
├── i18n/          configurazione e traduzioni italiano/inglese
├── navigation/    stack di navigazione e tipi delle rotte
├── screens/       una schermata per file
├── services/      Open Food Facts, cache offline, storage, community, foto
├── theme/         palette chiaro/scuro, tema, logo e font
├── types/         tipi di prodotto e community
└── utils/         funzioni pure: verdetto, barcode, additivi, validazione
```

Scelte principali:

- **Colori centralizzati**: tutti i colori arrivano da `src/theme/colors.ts`
  tramite `useTheme()`, nessun colore è scritto direttamente nei componenti.
- **Nessun testo fisso**: tutte le stringhe visibili passano da i18n.
- **Font**: i testi usano `Text` e `TextInput` di `src/components/Text`, che
  applicano il font dell'app.
- **Logica isolata**: il verdetto vegano (`src/utils/veganVerdict.ts`) e le
  regole di ruoli e approvazioni (`src/services/community.ts`) sono funzioni
  pure, testate a parte.

## Come viene calcolato il verdetto

L'app legge `ingredients_analysis_tags` dalla risposta di Open Food Facts:

| Tag | Verdetto |
|---|---|
| `en:non-vegan` | Non vegano |
| `en:maybe-vegan` | Incerto |
| `en:vegan` | Vegano |
| `en:vegan-status-unknown` o assente | Dato non disponibile |

Se i tag sono in contraddizione vince il verdetto più prudente. Gli
ingredienti da evidenziare arrivano da `ingredients_analysis`.

Ordine di ricerca di un prodotto:

1. prodotti approvati dai volontari (funzionano anche offline);
2. Open Food Facts, con salvataggio nella cache;
3. se la rete non risponde, la cache locale.

## Dati per la demo

Al primo avvio l'app carica dei dati di esempio, così le code dei pannelli non
sono vuote. L'autenticazione è solo simulata: le credenziali sono salvate in
chiaro sul dispositivo.

**Credenziali**

| Ruolo | Email | Password |
|---|---|---|
| Super admin | `admin@vforvegdetta.it` | `superadmin` |
| Volontario | `mario@example.com` | `volontario` |
| Candidatura in attesa | `giulia@example.com` | `giulia123` |

**Codici di prova** (validi e assenti su Open Food Facts)

| Codice | Cosa succede |
|---|---|
| `8009990000047` | Seitan alla griglia, già approvato dai volontari: vegano |
| `8009990000016`, `8009990000023`, `8009990000030` | Proposte in attesa nel Pannello Volontario |
| `8009990000054` | Libero: "prodotto non trovato" → proposta → approvazione |

**Prodotti reali** (verdetto su Open Food Facts al 24/09/2026, può cambiare)

| Codice | Prodotto | Verdetto |
|---|---|---|
| `5411188080213` | Alpro, yogurt di soia bianco | Vegano |
| `8076800195057` | Barilla, Spaghetti n.5 | Incerto |
| `3017620422003` | Nutella | Non vegano |

I codici si possono inquadrare dalla confezione oppure scrivere con
**Inserisci il codice manualmente** nella schermata di scansione.

**Ripristinare i dati di prova**

I dati di prova vengono scritti solo al primo avvio. Per tornare alla
situazione iniziale (cancella anche cache, sessione e impostazioni):

```sh
adb shell pm clear com.vforvegdetta
```

Stesso effetto da Impostazioni del telefono → App → V for Vegdetta →
Spazio di archiviazione → Cancella dati.

## Provare l'app passo per passo

Un giro completo di tutte le funzionalità, con i dati di prova.

**Scansione e verdetti** (serve internet)

1. Home → **Scansiona** → **Inserisci il codice manualmente** →
   `3017620422003` → **Cerca**. Verdetto **Non vegano**, con il latte e il
   siero evidenziati tra gli ingredienti.
2. Ripeti con `5411188080213` (**Vegano**) e `8076800195057` (**Incerto**).
3. Torna alla home: in **Ultime scansioni** ci sono i tre prodotti.

**Modalità offline**

4. Attiva la modalità aereo e apri uno dei tre prodotti da **Ultime
   scansioni**. Compare il badge "Dati offline / non aggiornati" e, al posto
   della foto, il logo dell'app.
5. Con la modalità aereo ancora attiva, cerca `3175680011480`, un prodotto mai
   scansionato: compare "Nessuna connessione". Disattiva la modalità aereo.

**Proposta di un prodotto** (nessun account)

6. Cerca `8009990000054`: compare "Prodotto non trovato".
7. Tocca **Proponi questo prodotto**: il codice è già compilato. Aggiungi le
   tre foto (fotocamera o galleria), eventualmente nome e note, e tocca
   **Invia proposta**.

**Revisione da volontario**

8. Tocca **Accedi** in alto e accedi come `mario@example.com` / `volontario`:
   si apre il **Pannello Volontario** con le proposte in attesa, compresa
   quella appena inviata.
9. Apri la proposta di `8009990000054`, tocca le foto per ingrandirle,
   compila nome, ingredienti e verdetto e tocca **Approva e pubblica**.
10. Cerca di nuovo `8009990000054`: ora l'app mostra il prodotto approvato,
    con la foto della proposta e la fonte "verificato dai volontari".

**Candidatura e super admin**

11. Menu (☰) → **Esci**. Menu → **Diventa volontario**: compila il modulo
    con una nuova email e una password di almeno 6 caratteri.
12. Prova ad accedere con quelle credenziali: l'app avvisa che la
    candidatura è in attesa.
13. Accedi come `admin@vforvegdetta.it` / `superadmin`: nel **Pannello Super
    Admin** approva la candidatura.
14. Esci e accedi con le credenziali della candidatura: ora si apre il
    Pannello Volontario.

**Altre schermate**

15. Menu → **Additivi alimentari**: cerca `E120` o "lecitine" e prova i
    filtri.
16. Menu → **Impostazioni**: cambia tema (chiaro, scuro, automatico) e
    lingua (italiano, inglese).


## Limiti noti

- Niente backend: dati, ruoli e sessioni restano sul singolo dispositivo e si
  perdono disinstallando l'app.
- L'autenticazione è dimostrativa, senza cifratura delle password.
- Open Food Facts è usato in sola lettura.
- L'app è sviluppata e provata su Android.
- La splash segue il tema di sistema del telefono, non quello scelto
  nell'app, perché compare prima che l'app sia caricata.

## Implementazioni future

**Database e backend**

Oggi proposte, candidature, volontari e prodotti approvati esistono solo sul
telefono che li ha creati. Un backend con database permetterebbe di:

- condividere tra tutti gli utenti i prodotti approvati dai volontari, così
  una proposta verificata una volta serve a chiunque;
- far arrivare le proposte ai volontari da qualsiasi dispositivo, con le foto
  caricate su un archivio online invece che salvate sul telefono;
- introdurre un'autenticazione reale per volontari e super admin, con
  password cifrate e sessioni sicure;
- avvisare i volontari quando arriva una nuova proposta da revisionare.

L'app è già predisposta: la logica dei dati è separata dalle schermate
(`src/services/community.ts` e i context), quindi basterebbe sostituire il
salvataggio su AsyncStorage con le chiamate al backend.

**Segnalazione degli allergeni**

Nelle impostazioni l'utente potrebbe indicare i propri allergeni (per
esempio glutine, frutta a guscio, soia). Scansionando un prodotto l'app
mostrerebbe un avviso ben visibile se li contiene, distinguendo gli
ingredienti veri e propri dalle tracce ("può contenere"). Open Food Facts
fornisce già questi dati nei campi `allergens_tags` e `traces_tags`, quindi
non servirebbero nuove fonti.

**Verifica degli ingredienti incerti con il produttore**

Molti prodotti risultano "incerti" perché un ingrediente può avere origine sia
vegetale sia animale (per esempio lecitine, mono- e digliceridi, aromi). Nel
Pannello Volontario si aggiungerebbe una coda dedicata a questi prodotti:

1. il volontario contatta il produttore e chiede l'origine degli ingredienti
   dubbi;
2. registra la risposta, con la data e il canale del contatto;
3. assegna il verdetto definitivo, vegano o non vegano.

Nel dettaglio prodotto il verdetto comparirebbe come "verificato con il
produttore", insieme alla data della verifica. Lo stesso lavoro potrebbe
aggiornare anche gli additivi segnati come "Forse".

**Prodotti non alimentari**

L'app potrebbe controllare anche prodotti non alimentari come cosmetici,
prodotti per l'igiene personale e detersivi, che spesso contengono sostanze
di origine animale (per esempio lanolina, cera d'api, carminio).
Oltre agli ingredienti, andrebbe indicato se il prodotto è testato su
animali, un aspetto che conta per chi sceglie prodotti vegani.

## Crediti

- Dati dei prodotti: [Open Food Facts](https://world.openfoodfacts.org),
  distribuiti con licenza [ODbL](https://opendatacommons.org/licenses/odbl/1-0/).
- Font: Atkinson Hyperlegible Next del Braille Institute, con licenza
  [SIL Open Font License](https://openfontlicense.org).
