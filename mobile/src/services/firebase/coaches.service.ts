import {
  collection, doc, getDoc, getDocs, limit as fsLimit, orderBy, query, where,
} from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { Coach, CoachQueryParams, CreateCoachProfileDto, UpdateCoachProfileDto } from '@/types';

import { coachFromSnap, toCoach } from './mappers';

const coaches = () => collection(firebaseDb(), 'coachProfiles');

export const coachesService = {
  async list(params?: CoachQueryParams): Promise<Coach[]> {
    // The rules require these two, and stating them is what makes an
    // unapproved profile unreachable rather than merely filtered out.
    const constraints: QueryConstraint[] = [
      where('verificationStatus', '==', 'APPROVED'),
      where('isActive', '==', true),
    ];

    if (params?.sport) constraints.push(where('sportNames', 'array-contains', params.sport));
    if (params?.venue) constraints.push(where('venue', '==', params.venue));

    // Firestore allows only one array-contains per query, so a text search
    // replaces the sport filter rather than combining with it. Prefix tokens
    // are all this backend can offer — see the Firebase repo's README.
    const search = params?.search?.trim().toLowerCase();
    if (search) {
      const tokenIndex = constraints.findIndex((c) => JSON.stringify(c).includes('sportNames'));
      if (tokenIndex !== -1) constraints.splice(tokenIndex, 1);
      constraints.push(where('searchTokens', 'array-contains', search.slice(0, 12)));
    }

    // Same ordering the Nest API used, so the two backends agree on the
    // shape of a result page. Each filter combination needs its own composite
    // index ending in this pair — see firestore.indexes.json.
    constraints.push(orderBy('rating', 'desc'), orderBy('totalReviews', 'desc'), fsLimit(params?.limit ?? 50));

    const snap = await getDocs(query(coaches(), ...constraints));
    let results = snap.docs.map(coachFromSnap);

    // Re-apply the sport filter client-side when search displaced it, so the
    // two backends still agree on what a combined filter means.
    if (search && params?.sport) {
      results = results.filter((c) => c.sports.some((s) => s.name === params.sport));
    }
    return results;
  },

  async getById(id: string): Promise<Coach> {
    const snap = await getDoc(doc(coaches(), id));
    if (!snap.exists()) throw new Error('Coach not found.');
    return toCoach(snap.id, snap.data());
  },

  async getMine(): Promise<Coach> {
    const uid = firebaseAuth().currentUser?.uid;
    if (!uid) throw new Error('You must be signed in.');
    const snap = await getDocs(query(coaches(), where('userId', '==', uid), fsLimit(1)));
    if (snap.empty) throw new Error('You do not have a coach profile yet.');
    return coachFromSnap(snap.docs[0]);
  },

  async create(dto: CreateCoachProfileDto): Promise<Coach> {
    const res = await httpsCallable(firebaseFunctions(), 'createCoachProfile')(dto);
    const data = res.data as Record<string, unknown> & { id: string };
    return toCoach(data.id, data);
  },

  async update(id: string, dto: UpdateCoachProfileDto): Promise<Coach> {
    const res = await httpsCallable(firebaseFunctions(), 'updateCoachProfile')({ coachId: id, ...dto });
    const data = res.data as Record<string, unknown> & { id: string };
    return toCoach(data.id, data);
  },
};
