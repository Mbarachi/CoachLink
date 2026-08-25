import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

import { firebaseDb } from '@/lib/firebase';
import type { Sport } from '@/types';

export const sportsService = {
  async list(): Promise<Sport[]> {
    const snap = await getDocs(query(
      collection(firebaseDb(), 'sports'),
      where('isActive', '==', true),
      orderBy('name', 'asc'),
    ));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Sport, 'id'>) }));
  },
};
