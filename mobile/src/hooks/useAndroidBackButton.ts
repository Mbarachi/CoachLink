import { App } from '@capacitor/app';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { resolveBack } from '@/lib/backNavigation';
import { useAuthStore } from '@/store/auth.store';

/**
 * Android's hardware back button otherwise falls through to raw WebView
 * history, which happily walks back into sign-up from a signed-in session, or
 * into the app after a logout. Registering a handler lets the app decide.
 *
 * No-op on web, where the plugin never fires.
 */
export function useAndroidBackButton(): void {
  const history = useHistory();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    const handle = App.addListener('backButton', ({ canGoBack }) => {
      const action = resolveBack(location.pathname, { isAuthenticated, role });

      if (action.type === 'exit') {
        void App.exitApp();
        return;
      }
      if (action.type === 'go') {
        // replace, not push: the entry being left must not become a new
        // destination for the next press.
        history.replace(action.to);
        return;
      }
      // Nothing behind us in the webview either — leaving is the only sane move.
      if (!canGoBack) {
        void App.exitApp();
        return;
      }
      history.goBack();
    });

    return () => { void handle.then((l) => l.remove()); };
  }, [history, location.pathname, isAuthenticated, role]);
}
