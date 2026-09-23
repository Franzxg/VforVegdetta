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
    login: 'Log in',
    becomeVolunteer: 'Become a volunteer',
    volunteerPanel: 'Volunteer Panel',
    proposalReview: 'Review proposal',
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
    intro:
      "Can't find a product? Enter the code and take three photos: a volunteer will check them and add the product. No account needed.",
    barcodeLabel: 'Barcode',
    photosTitle: 'Required photos',
    photo: {
      product: 'Product photo',
      barcode: 'Barcode photo',
      ingredients: 'Ingredients photo',
    },
    photoHint: {
      product: 'The front of the package, with the name clearly visible.',
      barcode: 'The whole barcode, in focus.',
      ingredients: 'The full, readable ingredient list.',
    },
    takePhoto: 'Take photo',
    retake: 'Retake',
    fromGallery: 'Gallery',
    photosMissing: 'All three photos are required to send the proposal.',
    cameraDenied:
      'Camera access denied: enable it from settings or pick the photo from the gallery.',
    photoError: "Couldn't get the photo. Try again.",
    saveError: 'Saving failed. Try again.',
    nameLabel: 'Your name (optional)',
    nameHint: "It's only used to thank you: no account is created.",
    notesLabel: 'Notes (optional)',
    notesPlaceholder: 'E.g. where you found it, doubts about an ingredient…',
    submit: 'Send proposal',
    successTitle: 'Thanks for your proposal!',
    successText:
      'Product {{barcode}} is in the queue: a volunteer will check the photos and complete the data.',
    backHome: 'Back to Home',
    proposeAnother: 'Suggest another product',
  },
  auth: {
    login: 'Log in',
    account: 'Your account',
    intro:
      'Access reserved for volunteers and administrators. No account is needed to scan or suggest products.',
    email: 'Email',
    password: 'Password',
    submit: 'Log in',
    logout: 'Log out',
    loggedInAs: 'Logged in as {{name}}',
    role: {
      admin: 'Volunteer',
      superadmin: 'Super admin',
    },
    error: {
      invalid: 'Wrong email or password.',
      pending: 'Your volunteer application is still waiting for approval.',
      rejected: 'Your volunteer application was not approved.',
    },
    notVolunteer: 'Not a volunteer yet?',
  },
  form: {
    required: 'Required field.',
    invalidEmail: 'Enter a valid email address.',
    passwordTooShort: 'At least {{count}} characters.',
    passwordMismatch: "Passwords don't match.",
  },
  volunteer: {
    intro:
      'Volunteers check the photos of suggested products and complete their data. Fill in the application: once approved you can log in with your email and password.',
    name: 'Full name',
    contactHint: "You'll use it to log in after approval.",
    availability: 'Availability',
    availabilityPlaceholder: 'E.g. weekends, weekday evenings',
    motivation: 'Why do you want to volunteer?',
    motivationPlaceholder: 'A few lines about you',
    confirmPassword: 'Confirm password',
    submit: 'Send application',
    successTitle: 'Application sent!',
    successText:
      'An administrator will review it soon. Once approved you can log in with {{contact}}.',
    error: {
      already_volunteer:
        'A volunteer with this email already exists: log in from the login screen.',
      already_pending:
        'You already have a pending application with this email.',
    },
  },
  guard: {
    title: 'Restricted area',
    loginRequired:
      'This section is for volunteers only. Log in with your credentials.',
    wrongRole: "Your account doesn't have permission for this section.",
  },
  panel: {
    pendingProposals: 'Waiting for review ({{count}})',
    noProposalsTitle: 'No pending proposals',
    noProposalsText: 'Great job! New proposals from users will show up here.',
    recentlyReviewed: 'Recently reviewed',
    proposedBy: 'Suggested by {{name}}',
    anonymous: 'Anonymous',
    review: 'Review →',
    status: {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  },
  review: {
    photos: 'Submitted photos',
    tapToEnlarge: 'Tap a photo to enlarge it.',
    closePhoto: 'Close',
    dataTitle: 'Product data',
    name: 'Product name',
    ingredients: 'Ingredients',
    ingredientsPlaceholder: 'Transcribe the ingredient list from the photo',
    verdict: 'Verdict',
    verdictRequired: 'Choose a verdict.',
    approve: 'Approve and publish',
    reject: 'Reject proposal',
    rejectReason: 'Reason (optional)',
    rejectReasonPlaceholder: 'E.g. unreadable photos, duplicate product…',
    confirmReject: 'Confirm rejection',
    alreadyApproved: 'Proposal already approved as “{{name}}”.',
    alreadyRejected: 'Proposal already rejected.',
    notFoundTitle: 'Proposal not found',
    notFoundText: 'This proposal no longer exists.',
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
