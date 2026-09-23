import { CommunityData, ProposalPhotos, SEED_PHOTO } from '../types/community';

/**
 * Dati precaricati al primo avvio (§11), così in demo le code non sono vuote.
 * Credenziali dimostrative: nessuna autenticazione reale (§15).
 */
export const SEED_DATA: CommunityData = {
  superAdmin: {
    id: 'super1',
    name: 'Admin Principale',
    contact: 'admin@vforvegdetta.it',
    password: 'superadmin',
  },
  volunteers: [
    {
      id: 'v1',
      name: 'Mario Rossi',
      contact: 'mario@example.com',
      password: 'volontario',
    },
  ],
  volunteerRequests: [
    {
      id: 'r1',
      name: 'Giulia Bianchi',
      contact: 'giulia@example.com',
      availability: 'Weekend e sere infrasettimanali',
      motivation:
        'Sono vegana da 5 anni e controllo sempre le etichette: vorrei aiutare a rendere il database più completo.',
      password: 'giulia123',
      status: 'pending',
      createdAt: '2026-09-20T18:30:00.000Z',
    },
  ],
  productProposals: [
    {
      id: 'p1',
      barcode: '8009990000016',
      proposedByName: 'Luca',
      notes: 'Tofu affumicato trovato al mercato bio.',
      status: 'pending',
      createdAt: '2026-09-21T09:15:00.000Z',
      reviewedName: null,
      reviewedIngredientsText: null,
      reviewedVeganStatus: null,
      rejectionReason: null,
      reviewedBy: null,
      reviewedAt: null,
    },
    {
      id: 'p2',
      barcode: '8009990000023',
      proposedByName: null,
      notes: '',
      status: 'pending',
      createdAt: '2026-09-22T12:40:00.000Z',
      reviewedName: null,
      reviewedIngredientsText: null,
      reviewedVeganStatus: null,
      rejectionReason: null,
      reviewedBy: null,
      reviewedAt: null,
    },
    {
      id: 'p3',
      barcode: '8009990000030',
      proposedByName: 'Sara',
      notes:
        "Biscotti al cacao, sull'etichetta c'è scritto «può contenere latte».",
      status: 'pending',
      createdAt: '2026-09-23T08:05:00.000Z',
      reviewedName: null,
      reviewedIngredientsText: null,
      reviewedVeganStatus: null,
      rejectionReason: null,
      reviewedBy: null,
      reviewedAt: null,
    },
  ],
  customApprovedProducts: [
    {
      barcode: '8009990000047',
      name: 'Seitan alla griglia',
      ingredientsText:
        "Glutine di frumento, acqua, salsa di soia (acqua, soia, frumento, sale), olio extravergine d'oliva, rosmarino.",
      veganStatus: 'vegan',
      addedBy: 'v1',
      approvedAt: '2026-09-19T16:00:00.000Z',
      proposalId: null,
    },
  ],
};

export const SEED_PROPOSAL_PHOTOS: ProposalPhotos = {
  product: SEED_PHOTO,
  barcode: SEED_PHOTO,
  ingredients: SEED_PHOTO,
};
