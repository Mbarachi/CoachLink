import { Capacitor } from '@capacitor/core';
import OneSignal, { LogLevel } from '@onesignal/capacitor-plugin';
import type { NotificationClickEvent } from '@onesignal/capacitor-plugin';

import { useAuthStore } from '@/store/auth.store';

const APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID as string | undefined;

/**
 * A notification tapped while the app was closed arrives before the router
 * exists, so the destination is held here until something can navigate. Cold
 * start is the common case for a push — the whole point is that they were not
 * in the app — so dropping it would lose the tap that mattered most.
 */
let navigate: ((path: string) => void) | null = null;
let pendingLink: string | null = null;

/** Called from inside the router; see usePushNavigator. */
export function setPushNavigator(fn: ((path: string) => void) | null): void {
  navigate = fn;
  if (fn && pendingLink) {
    const link = pendingLink;
    pendingLink = null;
    fn(link);
  }
}

function openLink(link: string): void {
  if (navigate) navigate(link);
  else pendingLink = link;
}

/**
 * Push exists only on a real device — the plugin is native, so calling it in a
 * browser throws. The web build is the one used for day-to-day development,
 * so this has to be a quiet no-op rather than a crash.
 *
 * Deliberately does not ask for permission here. iOS gives you one prompt
 * ever: refuse it and the only way back is the Settings app. Asking on launch,
 * before anyone has seen why it would help, is how that one chance gets spent.
 * requestPushPermission is called at the moment the value is obvious instead.
 */
export function initPush(): void {
  if (!Capacitor.isNativePlatform()) return;
  if (!APP_ID) {
    console.warn('VITE_ONESIGNAL_APP_ID is not set — push is disabled.');
    return;
  }

  if (import.meta.env.DEV) OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(APP_ID);

  OneSignal.Notifications.addEventListener('click', (event: NotificationClickEvent) => {
    // The backend puts the in-app path in additionalData.link, the same value
    // the in-app list uses, so a tap lands where the row would have.
    const data = event?.notification?.additionalData as { link?: unknown } | undefined;
    if (typeof data?.link === 'string' && data.link) openLink(data.link);
  });

  // OneSignal addresses a person by our own user id, so it has to follow ours.
  // Subscribed rather than called from the sign-in screens: the store is
  // restored from storage on launch too, and that path has no screen at all.
  const apply = (userId: string | undefined) => {
    if (userId) void OneSignal.login(userId);
    else void OneSignal.logout();
  };

  apply(useAuthStore.getState().user?.id);
  useAuthStore.subscribe((state, prev) => {
    if (state.user?.id !== prev.user?.id) apply(state.user?.id);
  });
}

/**
 * Asks for notification permission. Safe to call more than once — the OS shows
 * its prompt only the first time — so callers do not need to track whether it
 * has been asked.
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || !APP_ID) return false;
  try {
    // `false`: do not bounce someone who already refused into the Settings
    // app. That belongs behind a button they chose to press.
    return await OneSignal.Notifications.requestPermission(false);
  } catch {
    return false;
  }
}
