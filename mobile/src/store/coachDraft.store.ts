import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * What a coach has typed into the onboarding wizard so far, kept on the phone
 * so quitting halfway costs them a tap rather than the whole form.
 *
 * The photo and ID are not here — a File cannot be stored as JSON — so those
 * are picked again on the last step, which is where they are asked for anyway.
 */
export interface CoachDraft {
  step: number;
  sportId: string | null;
  experience: string;
  about: string;
  venue: string;
  price: string;
  openDays: number[];
}

export const EMPTY_DRAFT: CoachDraft = {
  step: 0,
  sportId: null,
  experience: '5',
  about: '',
  venue: '',
  price: '',
  openDays: [1, 3, 5],
};

interface CoachDraftState {
  /** Whose draft this is, so a second account on the same phone starts clean. */
  uid: string | null;
  draft: CoachDraft;
  save: (uid: string, patch: Partial<CoachDraft>) => void;
  clear: () => void;
}

export const useCoachDraftStore = create<CoachDraftState>()(
  persist(
    (set) => ({
      uid: null,
      draft: EMPTY_DRAFT,
      save: (uid, patch) =>
        set((s) => ({
          uid,
          draft: { ...(s.uid === uid ? s.draft : EMPTY_DRAFT), ...patch },
        })),
      clear: () => set({ uid: null, draft: EMPTY_DRAFT }),
    }),
    { name: 'coachlink-coach-draft', storage: createJSONStorage(() => localStorage) },
  ),
);
