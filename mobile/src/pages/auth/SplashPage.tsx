import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { AppPage } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

const SplashPage: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        history.replace(user.role === 'COACH' ? '/coach/dashboard' : '/athlete/home');
      } else {
        history.replace('/welcome');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, history]);

  return (
    <AppPage background="var(--cl-ink-fill)" center>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(225,98,60,.22), transparent 68%)',
        }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 19, height: 19, borderRadius: '50%', background: 'var(--cl-ink-fill)' }} />
        </div>
        <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 32, color: 'var(--cl-on-ink)', letterSpacing: '-0.03em' }}>
          CoachLink
        </span>
      </div>

      <span style={{ position: 'absolute', bottom: 54, fontSize: 13, color: 'var(--cl-muted-2)' }}>Tap to continue</span>
    </AppPage>
  );
};

export default SplashPage;
