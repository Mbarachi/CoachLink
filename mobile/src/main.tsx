import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyNativeChrome } from './lib/nativeChrome';
import { initPush } from './lib/push';
import { initTheme } from './store/theme.store';

// Paints the stored theme, follows the OS while the choice is "system", and
// keeps the native status bar in step with whichever canvas is up.
initTheme((resolved) => {
  void applyNativeChrome(resolved);
});

// Registers the device and keeps OneSignal's idea of who is signed in in step
// with ours. Does not prompt — see initPush.
initPush();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
