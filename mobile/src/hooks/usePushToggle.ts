import { Capacitor } from '@capacitor/core';
import { useCallback, useEffect, useState } from 'react';

import { isPushOptedIn, setPushOptedIn } from '@/lib/push';

/**
 * The state of the Push notifications switch, read from OneSignal.
 *
 * `supported` is false in a browser, where the native plugin does not exist —
 * the switch is hidden there rather than shown doing nothing, which is what it
 * did on a device too until this hook existed.
 */
export function usePushToggle() {
  const supported = Capacitor.isNativePlatform();
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supported) return;
    let alive = true;
    void isPushOptedIn().then((v) => { if (alive) setOn(v); });
    return () => { alive = false; };
  }, [supported]);

  const toggle = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Set to whatever it actually became: asking to turn it on cannot
      // override an OS permission the user already refused.
      setOn(await setPushOptedIn(!on));
    } finally {
      setBusy(false);
    }
  }, [busy, on]);

  return { supported, on, busy, toggle };
}
