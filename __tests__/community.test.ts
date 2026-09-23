import { SEED_DATA } from '../src/data/seed';
import {
  addProposal,
  addVolunteerRequest,
  approveProposal,
  approveVolunteerRequest,
  authenticate,
  rejectProposal,
  rejectVolunteerRequest,
} from '../src/services/community';

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

const NOW = new Date('2026-09-24T10:00:00.000Z');

describe('authenticate', () => {
  it('riconosce super admin e volontari (email case-insensitive)', () => {
    expect(
      authenticate(SEED_DATA, 'ADMIN@vforvegdetta.it ', 'superadmin'),
    ).toEqual({
      kind: 'ok',
      session: {
        role: 'superadmin',
        userId: 'super1',
        name: 'Admin Principale',
      },
    });
    const volunteer = authenticate(
      SEED_DATA,
      'mario@example.com',
      'volontario',
    );
    expect(volunteer.kind === 'ok' && volunteer.session.role).toBe('admin');
  });

  it('rifiuta password errate e account inesistenti', () => {
    expect(authenticate(SEED_DATA, 'mario@example.com', 'x').kind).toBe(
      'invalid',
    );
    expect(authenticate(SEED_DATA, 'nessuno@example.com', 'x').kind).toBe(
      'invalid',
    );
  });

  it('segnala le candidature in attesa o rifiutate', () => {
    expect(
      authenticate(SEED_DATA, 'giulia@example.com', 'giulia123').kind,
    ).toBe('pending');
    const rejected = rejectVolunteerRequest(SEED_DATA, 'r1');
    expect(authenticate(rejected, 'giulia@example.com', 'giulia123').kind).toBe(
      'rejected',
    );
  });
});

describe('candidature volontario', () => {
  const input = {
    name: 'Anna Verdi',
    contact: 'anna@example.com',
    availability: 'Sabato',
    motivation: 'Mi piace',
    password: 'segreta1',
  };

  it('crea una candidatura pending e, se approvata, un volontario che può accedere', () => {
    const added = addVolunteerRequest(SEED_DATA, input, 'r2', NOW);
    expect(added.kind).toBe('ok');
    if (added.kind !== 'ok') {
      return;
    }
    expect(authenticate(added.data, 'anna@example.com', 'segreta1').kind).toBe(
      'pending',
    );
    const approved = approveVolunteerRequest(added.data, 'r2', 'v2');
    expect(approved.volunteerRequests.find(r => r.id === 'r2')?.status).toBe(
      'approved',
    );
    const login = authenticate(approved, 'anna@example.com', 'segreta1');
    expect(login).toEqual({
      kind: 'ok',
      session: { role: 'admin', userId: 'v2', name: 'Anna Verdi' },
    });
  });

  it('impedisce duplicati', () => {
    expect(
      addVolunteerRequest(
        SEED_DATA,
        { ...input, contact: 'Mario@Example.com' },
        'x',
        NOW,
      ).kind,
    ).toBe('already_volunteer');
    expect(
      addVolunteerRequest(
        SEED_DATA,
        { ...input, contact: 'giulia@example.com' },
        'x',
        NOW,
      ).kind,
    ).toBe('already_pending');
  });

  it('non approva due volte la stessa candidatura', () => {
    const once = approveVolunteerRequest(SEED_DATA, 'r1', 'v2');
    const twice = approveVolunteerRequest(once, 'r1', 'v3');
    expect(twice.volunteers).toHaveLength(2);
  });
});

describe('proposte prodotto', () => {
  it('approvando una proposta il prodotto entra in customApprovedProducts', () => {
    const withProposal = addProposal(
      SEED_DATA,
      { barcode: '8009990000054', proposedByName: null, notes: '' },
      'p9',
      NOW,
    );
    const approved = approveProposal(
      withProposal,
      'p9',
      {
        name: ' Hummus ',
        ingredientsText: 'Ceci, tahina',
        veganStatus: 'vegan',
      },
      'v1',
      NOW,
    );
    expect(approved.productProposals.find(p => p.id === 'p9')).toMatchObject({
      status: 'approved',
      reviewedName: 'Hummus',
      reviewedBy: 'v1',
    });
    expect(
      approved.customApprovedProducts.find(p => p.barcode === '8009990000054'),
    ).toMatchObject({ name: 'Hummus', veganStatus: 'vegan', proposalId: 'p9' });
  });

  it('una nuova approvazione sostituisce il prodotto con lo stesso barcode', () => {
    const withProposal = addProposal(
      SEED_DATA,
      { barcode: '8009990000047', proposedByName: 'Io', notes: 'correzione' },
      'p9',
      NOW,
    );
    const approved = approveProposal(
      withProposal,
      'p9',
      { name: 'Seitan', ingredientsText: 'Glutine', veganStatus: 'maybe' },
      'v1',
      NOW,
    );
    const matches = approved.customApprovedProducts.filter(
      p => p.barcode === '8009990000047',
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].veganStatus).toBe('maybe');
  });

  it('il rifiuto salva la motivazione facoltativa', () => {
    const rejected = rejectProposal(SEED_DATA, 'p1', '  ', 'v1', NOW);
    expect(rejected.productProposals.find(p => p.id === 'p1')).toMatchObject({
      status: 'rejected',
      rejectionReason: null,
    });
    expect(rejected.customApprovedProducts).toEqual(
      SEED_DATA.customApprovedProducts,
    );
  });
});
