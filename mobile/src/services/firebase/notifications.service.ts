import {
  collection, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where, writeBatch,
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

  /**
   * The same query, kept open.
   *
   * A notification is the one thing in this app that arrives while you are
   * looking at a different screen, so asking once and caching leaves the bell
   * silently wrong until something happens to re-read. Firestore pushes the
   * change instead, which costs one held connection and no polling.
   *
   * Returns the unsubscribe function.
   */
  subscribe(userId: string, onChange: (items: Notification[]) => void): () => void {
    return onSnapshot(
      query(
        notifications(),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50),
      ),
      (snap) => onChange(snap.docs.map((d) => toNotification(d.id, d.data()))),
      // A dropped listener must not take the screen with it; the one-shot
      // read still backs the page.
      (err) => console.error('Notification listener stopped', err),
    );
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(notifications(), id), { isRead: true });
  },

  /**
   * Clears every unread row, not just the ones on screen.
   *
   * The list is capped at 50 for read cost, so passing the page's ids in would
   * leave a 51st unread for good — and the badge counts what the server holds,
   * not what was rendered, so it would never reach zero. This asks the server
   * what is unread instead. Batched in 500s because that is Firestore's limit.
   */
  async markAllRead(): Promise<void> {
    const uid = requireUid();
    const snap = await getDocs(query(
      notifications(),
      where('userId', '==', uid),
      where('isRead', '==', false),
    ));
    if (snap.empty) return;

    for (let i = 0; i < snap.docs.length; i += 500) {
      const batch = writeBatch(firebaseDb());
      for (const d of snap.docs.slice(i, i + 500)) batch.update(d.ref, { isRead: true });
      await batch.commit();
    }
  },
};
