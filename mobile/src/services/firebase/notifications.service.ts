import {
  collection, doc, getDocs, limit, orderBy, query, updateDoc, where, writeBatch,
} from 'firebase/firestore';

import { firebaseAuth, firebaseDb } from '@/lib/firebase';
import type { Notification } from '@/types';

import { toNotification } from './mappers';

const notifications = () => collection(firebaseDb(), 'notifications');

function requireUid(): string {
  const uid = firebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('You must be signed in.');
  return uid;
}

/**
 * Rows are written only by the callable functions that cause them. The one
 * write allowed from here is flipping `isRead`, which the security rules
 * check field-by-field — so it needs no function of its own.
 */
export const notificationsService = {
  /**
   * Scoped on `userId` because that is the field the rule authorises on. The
   * cap is a read-cost guard, not paging: nobody needs their 51st alert, and
   * an unbounded listener on a chatty collection is how a Firebase bill runs
   * away.
   */
  async list(): Promise<Notification[]> {
    const uid = requireUid();
    const snap = await getDocs(query(
      notifications(),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(50),
    ));
    return snap.docs.map((d) => toNotification(d.id, d.data()));
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(notifications(), id), { isRead: true });
  },

  /** One batch rather than N writes, so "mark all read" is a single round trip. */
  async markAllRead(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const batch = writeBatch(firebaseDb());
    for (const id of ids) batch.update(doc(notifications(), id), { isRead: true });
    await batch.commit();
  },
};
