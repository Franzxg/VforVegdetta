import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AddRequestResult,
  NewProposal,
  NewVolunteerRequest,
  ProposalReview,
  addProposal,
  addVolunteerRequest,
  approveProposal,
  approveVolunteerRequest,
  createId,
  loadCommunityData,
  rejectProposal,
  rejectVolunteerRequest,
  saveCommunityData,
  saveProposalPhotos,
} from '../services/community';
import type { CommunityData, ProposalPhotos } from '../types/community';

interface CommunityContextValue {
  data: CommunityData | null;
  pendingProposals: number;
  pendingRequests: number;
  submitProposal: (input: NewProposal, photos: ProposalPhotos) => Promise<void>;
  approveProposal: (
    id: string,
    review: ProposalReview,
    reviewerId: string,
  ) => Promise<void>;
  rejectProposal: (
    id: string,
    reason: string,
    reviewerId: string,
  ) => Promise<void>;
  submitVolunteerRequest: (
    input: NewVolunteerRequest,
  ) => Promise<AddRequestResult['kind']>;
  approveVolunteerRequest: (id: string) => Promise<void>;
  rejectVolunteerRequest: (id: string) => Promise<void>;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CommunityData | null>(null);
  // Copia sempre aggiornata, per applicare modifiche consecutive senza
  // perdere aggiornamenti tra un render e l'altro.
  const dataRef = useRef<CommunityData | null>(null);

  useEffect(() => {
    loadCommunityData().then(loaded => {
      dataRef.current = loaded;
      setData(loaded);
    });
  }, []);

  const commit = useCallback(async (next: CommunityData) => {
    dataRef.current = next;
    setData(next);
    await saveCommunityData(next);
  }, []);

  const current = useCallback((): CommunityData => {
    if (!dataRef.current) {
      throw new Error('Community data not loaded yet');
    }
    return dataRef.current;
  }, []);

  const value = useMemo<CommunityContextValue>(
    () => ({
      data,
      pendingProposals:
        data?.productProposals.filter(p => p.status === 'pending').length ?? 0,
      pendingRequests:
        data?.volunteerRequests.filter(r => r.status === 'pending').length ?? 0,
      submitProposal: async (input, photos) => {
        const id = createId('p');
        // Prima le foto: una proposta non deve mai esistere senza foto.
        await saveProposalPhotos(id, photos);
        await commit(addProposal(current(), input, id, new Date()));
      },
      approveProposal: async (id, review, reviewerId) => {
        await commit(
          approveProposal(current(), id, review, reviewerId, new Date()),
        );
      },
      rejectProposal: async (id, reason, reviewerId) => {
        await commit(
          rejectProposal(current(), id, reason, reviewerId, new Date()),
        );
      },
      submitVolunteerRequest: async input => {
        const result = addVolunteerRequest(
          current(),
          input,
          createId('r'),
          new Date(),
        );
        if (result.kind === 'ok') {
          await commit(result.data);
        }
        return result.kind;
      },
      approveVolunteerRequest: async id => {
        await commit(approveVolunteerRequest(current(), id, createId('v')));
      },
      rejectVolunteerRequest: async id => {
        await commit(rejectVolunteerRequest(current(), id));
      },
    }),
    [data, commit, current],
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) {
    throw new Error('useCommunity must be used inside CommunityProvider');
  }
  return ctx;
}
