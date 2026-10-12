/**
 * A coach's half-finished onboarding, as the wizard holds it and the backend
 * stores it in coachDrafts/{uid}. That document existing is what marks an
 * account as partway through becoming a coach — the server's role stays
 * ATHLETE until the profile is submitted, so it cannot say so itself.
 *
 * The photo and ID are not part of it: they are picked on the last step, and
 * are uploaded only when the profile is submitted.
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
  experience: '',
  about: '',
  venue: '',
  price: '',
  openDays: [1, 3, 5],
};
