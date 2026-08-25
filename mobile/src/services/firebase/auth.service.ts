import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { firebaseAuth, firebaseDb, firebaseFunctions } from '@/lib/firebase';
import type { User } from '@/types';

import { toUser } from './mappers';
import type {
  AuthResponse, ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto, VerifyOtpDto,
} from '../auth.service';

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

export const authService = {
  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const credential = await createUserWithEmailAndPassword(firebaseAuth(), dto.email, dto.password);
    await updateProfile(credential.user, { displayName: `${dto.firstName} ${dto.lastName}`.trim() });
    // Firebase sends a verification link; there is no 6-digit code to enter.
    await sendEmailVerification(credential.user);

    // Wait for the trigger to create the document, then write the profile
    // fields authoritatively. The trigger cannot be trusted with them: it
    // fires the moment the account exists, which is before updateProfile has
    // landed, and it never sees the address or phone number at all — those
    // reach the client only, as part of the sign-up form.
    await awaitProfile(credential.user.uid);
    const updated = await httpsCallable(firebaseFunctions(), 'updateMe')({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      ...(dto.address ? { address: dto.address } : {}),
      ...(dto.state ? { state: dto.state } : {}),
      ...(dto.lga ? { lga: dto.lga } : {}),
    });

    const data = updated.data as Record<string, unknown> & { id?: string };
    const user = toUser(data.id ?? credential.user.uid, data);
    return { user, accessToken: await credential.user.getIdToken() };
  },

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const credential = await signInWithEmailAndPassword(firebaseAuth(), dto.email, dto.password);
    const user = await awaitProfile(credential.user.uid);
    return { user, accessToken: await credential.user.getIdToken() };
  },

  /**
   * Firebase verifies by emailed link, not by a code the app collects, so
   * there is nothing to submit. Resolving as verified keeps the existing OTP
   * screen from blocking sign-up; the screen itself should be replaced with a
   * "check your inbox" step when this backend becomes the default.
   */
  async verifyOtp(_dto: VerifyOtpDto): Promise<{ verified: boolean }> {
    const current = firebaseAuth().currentUser;
    await current?.reload();
    return { verified: current?.emailVerified ?? true };
  },

  async forgotPassword(dto: ForgotPasswordDto) {
    await sendPasswordResetEmail(firebaseAuth(), dto.email);
    return { sent: true };
  },

  /** Firebase completes the reset on its own hosted page, via the emailed link. */
  async resetPassword(_dto: ResetPasswordDto) {
    throw new Error('Password resets are completed through the link Firebase emails you.');
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
