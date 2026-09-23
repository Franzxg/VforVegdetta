import { SEED_DATA, SEED_PROPOSAL_PHOTOS } from '../data/seed';
import type {
  CommunityData,
  CustomApprovedProduct,
  ProductProposal,
  ProposalPhotos,
  ReviewedVeganStatus,
  Session,
  VolunteerRequest,
} from '../types/community';
import { StorageKeys, readJson, writeJson } from './storage';

// ---------------------------------------------------------------------------
// Persistenza
// ---------------------------------------------------------------------------

/** Carica i dati community; al primo avvio scrive i dati seed. */
export async function loadCommunityData(): Promise<CommunityData> {
  const stored = await readJson<CommunityData>(StorageKeys.communityData);
  if (stored) {
    return stored;
  }
  await writeJson(StorageKeys.communityData, SEED_DATA);
  return SEED_DATA;
}

export async function saveCommunityData(data: CommunityData): Promise<void> {
  await writeJson(StorageKeys.communityData, data);
}

export async function saveProposalPhotos(
  proposalId: string,
  photos: ProposalPhotos,
): Promise<void> {
  await writeJson(StorageKeys.proposalPhotos + proposalId, photos);
}

export async function loadProposalPhotos(
  proposalId: string,
): Promise<ProposalPhotos> {
  const photos = await readJson<ProposalPhotos>(
    StorageKeys.proposalPhotos + proposalId,
  );
  return photos ?? SEED_PROPOSAL_PHOTOS;
}

export async function getCustomProduct(
  barcode: string,
): Promise<CustomApprovedProduct | null> {
  const data = await loadCommunityData();
  return data.customApprovedProducts.find(p => p.barcode === barcode) ?? null;
}

export function createId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

// ---------------------------------------------------------------------------
// Logica pura (testabile): ogni funzione restituisce una nuova copia dei dati
// ---------------------------------------------------------------------------

function sameContact(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export type LoginResult =
  | { kind: 'ok'; session: Session }
  | { kind: 'pending' }
  | { kind: 'rejected' }
  | { kind: 'invalid' };

export function authenticate(
  data: CommunityData,
  contact: string,
  password: string,
): LoginResult {
  const { superAdmin } = data;
  if (sameContact(superAdmin.contact, contact)) {
    return superAdmin.password === password
      ? {
          kind: 'ok',
          session: {
            role: 'superadmin',
            userId: superAdmin.id,
            name: superAdmin.name,
          },
        }
      : { kind: 'invalid' };
  }

  const volunteer = data.volunteers.find(v => sameContact(v.contact, contact));
  if (volunteer) {
    return volunteer.password === password
      ? {
          kind: 'ok',
          session: {
            role: 'admin',
            userId: volunteer.id,
            name: volunteer.name,
          },
        }
      : { kind: 'invalid' };
  }

  // Candidatura non ancora approvata: messaggio dedicato, solo se la
  // password corrisponde (per non rivelare l'esistenza dell'account).
  const request = [...data.volunteerRequests]
    .reverse()
    .find(r => sameContact(r.contact, contact) && r.password === password);
  if (request?.status === 'pending') {
    return { kind: 'pending' };
  }
  if (request?.status === 'rejected') {
    return { kind: 'rejected' };
  }
  return { kind: 'invalid' };
}

export interface NewProposal {
  barcode: string;
  proposedByName: string | null;
  notes: string;
}

export function addProposal(
  data: CommunityData,
  input: NewProposal,
  id: string,
  now: Date,
): CommunityData {
  const proposal: ProductProposal = {
    id,
    barcode: input.barcode,
    proposedByName: input.proposedByName,
    notes: input.notes,
    status: 'pending',
    createdAt: now.toISOString(),
    reviewedName: null,
    reviewedIngredientsText: null,
    reviewedVeganStatus: null,
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
  };
  return { ...data, productProposals: [...data.productProposals, proposal] };
}

export interface ProposalReview {
  name: string;
  ingredientsText: string;
  veganStatus: ReviewedVeganStatus;
}

/**
 * Approva una proposta: il prodotto entra (o sostituisce il precedente con lo
 * stesso barcode) in `customApprovedProducts`.
 */
export function approveProposal(
  data: CommunityData,
  proposalId: string,
  review: ProposalReview,
  reviewerId: string,
  now: Date,
): CommunityData {
  const proposal = data.productProposals.find(p => p.id === proposalId);
  if (!proposal || proposal.status !== 'pending') {
    return data;
  }
  const approvedAt = now.toISOString();
  const product: CustomApprovedProduct = {
    barcode: proposal.barcode,
    name: review.name.trim(),
    ingredientsText: review.ingredientsText.trim(),
    veganStatus: review.veganStatus,
    addedBy: reviewerId,
    approvedAt,
    proposalId,
  };
  return {
    ...data,
    productProposals: data.productProposals.map(p =>
      p.id === proposalId
        ? {
            ...p,
            status: 'approved',
            reviewedName: product.name,
            reviewedIngredientsText: product.ingredientsText,
            reviewedVeganStatus: product.veganStatus,
            reviewedBy: reviewerId,
            reviewedAt: approvedAt,
          }
        : p,
    ),
    customApprovedProducts: [
      ...data.customApprovedProducts.filter(
        p => p.barcode !== proposal.barcode,
      ),
      product,
    ],
  };
}

export function rejectProposal(
  data: CommunityData,
  proposalId: string,
  reason: string,
  reviewerId: string,
  now: Date,
): CommunityData {
  return {
    ...data,
    productProposals: data.productProposals.map(p =>
      p.id === proposalId && p.status === 'pending'
        ? {
            ...p,
            status: 'rejected',
            rejectionReason: reason.trim() || null,
            reviewedBy: reviewerId,
            reviewedAt: now.toISOString(),
          }
        : p,
    ),
  };
}

export interface NewVolunteerRequest {
  name: string;
  contact: string;
  availability: string;
  motivation: string;
  password: string;
}

export type AddRequestResult =
  | { kind: 'ok'; data: CommunityData }
  | { kind: 'already_volunteer' }
  | { kind: 'already_pending' };

export function addVolunteerRequest(
  data: CommunityData,
  input: NewVolunteerRequest,
  id: string,
  now: Date,
): AddRequestResult {
  const contact = input.contact.trim();
  if (
    sameContact(data.superAdmin.contact, contact) ||
    data.volunteers.some(v => sameContact(v.contact, contact))
  ) {
    return { kind: 'already_volunteer' };
  }
  if (
    data.volunteerRequests.some(
      r => r.status === 'pending' && sameContact(r.contact, contact),
    )
  ) {
    return { kind: 'already_pending' };
  }
  const request: VolunteerRequest = {
    id,
    name: input.name.trim(),
    contact,
    availability: input.availability.trim(),
    motivation: input.motivation.trim(),
    password: input.password,
    status: 'pending',
    createdAt: now.toISOString(),
  };
  return {
    kind: 'ok',
    data: { ...data, volunteerRequests: [...data.volunteerRequests, request] },
  };
}

/** Approva la candidatura: nasce un volontario (ruolo `admin`). */
export function approveVolunteerRequest(
  data: CommunityData,
  requestId: string,
  volunteerId: string,
): CommunityData {
  const request = data.volunteerRequests.find(r => r.id === requestId);
  if (!request || request.status !== 'pending') {
    return data;
  }
  return {
    ...data,
    volunteerRequests: data.volunteerRequests.map(r =>
      r.id === requestId ? { ...r, status: 'approved' } : r,
    ),
    volunteers: [
      ...data.volunteers,
      {
        id: volunteerId,
        name: request.name,
        contact: request.contact,
        password: request.password,
      },
    ],
  };
}

export function rejectVolunteerRequest(
  data: CommunityData,
  requestId: string,
): CommunityData {
  return {
    ...data,
    volunteerRequests: data.volunteerRequests.map(r =>
      r.id === requestId && r.status === 'pending'
        ? { ...r, status: 'rejected' }
        : r,
    ),
  };
}
