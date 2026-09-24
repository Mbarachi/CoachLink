import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { setPushNavigator } from '@/lib/push';

/**
 * Lets a tapped notification navigate. Must be called inside the router —
 * AppRoutes does it, alongside the Android back-button hook.
 */
export function usePushNavigator(): void {
  const history = useHistory();

  useEffect(() => {
    setPushNavigator((path) => history.push(path));
    return () => setPushNavigator(null);
  }, [history]);
}
