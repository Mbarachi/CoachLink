import { Capacitor } from '@capacitor/core';
import { Style, StatusBar } from '@capacitor/status-bar';

/**
 * The app draws under the status bar (viewport-fit=cover), so the OS clock and
 * icons sit on top of the Clay canvas. That canvas is light, which means the
 * status bar has to render dark content or it is invisible.
 *
 * Style.Light means "dark text for a light background" — the naming describes
 * the background, not the text.
 */
export async function applyNativeChrome(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // Not fatal — the app is perfectly usable with the default styling.
  }

  if (Capacitor.getPlatform() === 'android') {
    try {
      // Android draws its own status bar background rather than letting the
      // webview show through, so match it to the canvas.
      await StatusBar.setBackgroundColor({ color: '#F3E9DC' });
    } catch {
      /* older Android versions reject this; harmless */
    }
  }
}
