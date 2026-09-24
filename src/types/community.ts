import type { VeganStatus } from './product';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type PhotoKind = 'product' | 'barcode' | 'ingredients';

export const PHOTO_KINDS: PhotoKind[] = ['product', 'barcode', 'ingredients'];

/**
 * Foto di una proposta: data URI base64 oppure `SEED_PHOTO` per i dati
 * dimostrativi (mostrati con il logo dell'app).
 */
export type ProposalPhotos = Record<PhotoKind, string>;

export const SEED_PHOTO = 'seed:placeholder';

/** Verdetto che un volontario può assegnare in revisione. */
export type ReviewedVeganStatus = Exclude<VeganStatus, 'unknown'>;

export interface ProductProposal {
  id: string;
  barcode: string;
  proposedByName: string | null;
  notes: string;
  status: ReviewStatus;
  createdAt: string;
  // Compilati dal volontario in fase di revisione
  reviewedName: string | null;
  reviewedIngredientsText: string | null;
  reviewedVeganStatus: ReviewedVeganStatus | null;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export interface VolunteerRequest {
  id: string;
  name: string;
  contact: string;
  availability: string;
  motivation: string;
  password: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  contact: string;
  password: string;
}

export interface SuperAdmin {
  id: string;
  name: string;
  contact: string;
  password: string;
}

export interface CustomApprovedProduct {
  barcode: string;
  name: string;
  ingredientsText: string;
  veganStatus: ReviewedVeganStatus;
  addedBy: string;
  approvedAt: string;
  /** Proposta da cui deriva, per recuperarne la foto del prodotto. */
  proposalId: string | null;
}

export type Role = 'admin' | 'superadmin';

export interface Session {
  role: Role;
  userId: string;
  name: string;
}

export interface CommunityData {
  superAdmin: SuperAdmin;
  volunteers: Volunteer[];
  volunteerRequests: VolunteerRequest[];
  productProposals: ProductProposal[];
  customApprovedProducts: CustomApprovedProduct[];
}
