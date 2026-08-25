import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { UpdateUserDto, User } from '@/types';

import { toUser } from './mappers';

function requireUid(): string {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('You must be signed in.');
  return uid;
}

export const usersService = {
  async getMe(): Promise<User> {
    const uid = requireUid();
    const snap = await getDoc(doc(firebaseDb(), 'users', uid));
    if (!snap.exists()) throw new Error('User not found.');
    return toUser(uid, snap.data());
  },

  // Goes through a callable so `role` can never be client-set.
  async updateMe(dto: UpdateUserDto): Promise<User> {
    const result = await httpsCallable(firebaseFunctions(), 'updateMe')(dto);
    const data = result.data as Record<string, unknown> & { id: string };
    return toUser(data.id ?? requireUid(), data);
  },
};
