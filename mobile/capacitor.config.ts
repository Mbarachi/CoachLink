import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coachlink.app',
  appName: 'CoachLink',
  webDir: 'dist',
  ios: {
    // Required by the OneSignal Capacitor plugin: it installs its own
    // notification handling, and Capacitor's would otherwise compete with it.
    handleApplicationNotifications: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
