import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

import ToastContainer from '@/components/ui/ToastContainer';
import { queryClient } from '@/lib/queryClient';
import BootGate from '@/components/BootGate';
import AppRoutes from '@/routes/AppRoutes';

/* Core Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional Ionic utilities */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode palette – comment out if not needed */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import '@/theme/variables.css';

// Ionic's own hardware back handling is off: useAndroidBackButton is the only
// handler. With both on, every press did two things at once, Ionic stepping
// back through raw history while ours redirected, and repeated presses walked
// a signed-in user all the way back to the Welcome screen.
setupIonicReact({ hardwareBackButton: false });

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <BootGate>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </BootGate>
      <ToastContainer />
    </IonApp>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
