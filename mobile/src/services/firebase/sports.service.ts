import { collection, getDocs, query, where } from 'firebase/firestore';

import { firebaseDb } from '@/lib/firebase';
import type { Sport } from '@/types';

export const sportsService = {
  async list(): Promise<Sport[]> {
    // Deliberately no orderBy: combining a filter on isActive with an ordering
    // on name would demand a composite index, and a missing index is a runtime
    // failure rather than a slow query. This collection holds two rows, so
    // sorting here costs nothing and removes a whole class of breakage.
    const snap = await getDocs(query(
      collection(firebaseDb(), 'sports'),
      where('isActive', '==', true),
    ));

    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<Sport, 'id'>) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
};
