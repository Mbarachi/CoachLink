import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { User } from '@/types';

import { toUser } from './mappers';

export interface SignUpDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address?: string;
  state?: string;
  lga?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  /** Firebase refreshes this itself; kept so the store shape is unchanged. */
  accessToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

/**
 * The user document is written by the onUserCreate trigger, which runs a beat
 * after the account exists. Poll briefly rather than failing the sign-up.
 */
async function awaitProfile(uid: string, attempts = 12): Promise<User> {
  for (let i = 0; i < attempts; i++) {
    const snap = await getDoc(doc(firebaseDb(), 'users', uid));
    if (snap.exists()) return toUser(uid, snap.data());
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error('Your profile is still being set up. Try signing in again in a moment.');
}

const PHONE_TAKEN = 'That phone number is already registered to another account.';

/** Everything sign-up does once the login exists; undone as a whole if it fails. */
async function completeSignUp(account: FirebaseUser, dto: SignUpDto): Promise<AuthResponse> {
  await updateProfile(account, { displayName: `${dto.firstName} ${dto.lastName}`.trim() });

  // Wait for the trigger to create the document, then write the profile
  // fields authoritatively. The trigger cannot be trusted with them: it
  // fires the moment the account exists, which is before updateProfile has
  // landed, and it never sees the address or phone number at all — those
  // reach the client only, as part of the sign-up form.
  await awaitProfile(account.uid);
  const updated = await httpsCallable(firebaseFunctions(), 'updateMe')({
    firstName: dto.firstName,
    lastName: dto.lastName,
    phoneNumber: dto.phoneNumber,
    ...(dto.address ? { address: dto.address } : {}),
    ...(dto.state ? { state: dto.state } : {}),
    ...(dto.lga ? { lga: dto.lga } : {}),
  });

  const data = updated.data as Record<string, unknown> & { id?: string };
  const user = toUser(data.id ?? account.uid, data);

  // Last, so an account rolled back above never sends a link to confirm it.
  // Firebase verifies by link; there is no 6-digit code to enter.
  await sendEmailVerification(account);
  return { user, accessToken: await account.getIdToken() };
}

export const authService = {
  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    // Asked first, so a taken number stops here rather than after an account
    // exists. The backend enforces it again when the number is saved below.
    const check = await httpsCallable(firebaseFunctions(), 'phoneAvailable')({ phoneNumber: dto.phoneNumber });
    if (!(check.data as { available: boolean }).available) {
      throw Object.assign(new Error(PHONE_TAKEN), { code: 'already-exists' });
    }

    const credential = await createUserWithEmailAndPassword(firebaseAuth(), dto.email, dto.password);
    try {
      return await completeSignUp(credential.user, dto);
    } catch (err) {
      // Without this a failed profile step leaves a login with no profile: the
      // email is then taken, so they cannot sign up again, and signing in finds
      // an account with no phone. Deleting it lets them simply try again. The
      // backend's onUserDelete clears whatever the account had written.
      await deleteUser(credential.user).catch(() => undefined);
      throw err;
    }
  },

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const credential = await signInWithEmailAndPassword(firebaseAuth(), dto.email, dto.password);
    const user = await awaitProfile(credential.user.uid);
    return { user, accessToken: await credential.user.getIdToken() };
  },

  async forgotPassword(dto: ForgotPasswordDto) {
    await sendPasswordResetEmail(firebaseAuth(), dto.email);
    return { sent: true };
  },

  /** Re-sends the verification link Firebase mailed at sign-up. */
  async sendVerificationEmail(): Promise<void> {
    const current = firebaseAuth().currentUser;
    if (!current) throw new Error('Sign in again to resend the verification email.');
    await sendEmailVerification(current);
  },

  /**
   * Verification happens out of band — the user opens a link in their mail
   * client, and this session never hears about it. Reloading is the only way
   * to find out, so the UI asks rather than waits.
   */
  async refreshVerification(): Promise<boolean> {
    const current = firebaseAuth().currentUser;
    if (!current) return false;
    await current.reload();
    return current.emailVerified;
  },

  signOut: () => signOut(firebaseAuth()),
};
