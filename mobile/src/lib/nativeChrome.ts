import { Capacitor } from '@capacitor/core';
import { Style, StatusBar } from '@capacitor/status-bar';

import type { ResolvedTheme } from '@/store/theme.store';

/**
 * Mirrors --cl-canvas per theme. Android paints its own status bar background
 * rather than letting the webview show through, so it needs the literal value
 * — these two must be kept in step with variables.css by hand.
 */
const CANVAS: Record<ResolvedTheme, string> = {
  light: '#F3E9DC',
  dark: '#17120D',
};

/**
 * The app draws under the status bar (viewport-fit=cover), so the OS clock and
 * icons sit on top of the Clay canvas, whichever one is up.
 *
 * Style.Light means "dark text for a light background" — the naming describes
 * the background, not the text — so the light canvas takes Style.Light and the
 * dark canvas takes Style.Dark.
 */
export async function applyNativeChrome(theme: ResolvedTheme = 'light'): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light });
  } catch {
    // Not fatal — the app is perfectly usable with the default styling.
  }

  if (Capacitor.getPlatform() === 'android') {
    try {
      await StatusBar.setBackgroundColor({ color: CANVAS[theme] });
    } catch {
      /* older Android versions reject this; harmless */
    }
  }
}
