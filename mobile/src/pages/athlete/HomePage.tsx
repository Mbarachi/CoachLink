import { IonContent, IonPage } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

// Mirrors MyBookingsPage's mock bookings — top 2 non-completed sessions
const UPCOMING_SESSIONS = [
  { initials: 'CO', name: 'Chidinma Okafor', sport: 'Tennis',   date: 'Fri, 17 May', time: '5:00 PM', status: 'Confirmed' as const },
  { initials: 'TA', name: 'Tobi Adebayo',    sport: 'Swimming', date: 'Wed, 15 May', time: '8:00 AM', status: 'Accepted' as const },
];

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
}

const HomePage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore(s => s.user);
  const [hero, setHero] = useState<0 | 1>(0);
  const heroSlideCount = 2;
  const heroIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHeroAutoSlide = () => {
    if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    heroIntervalRef.current = setInterval(() => {
      setHero(prev => ((prev + 1) % heroSlideCount) as 0 | 1);
    }, 3000);
  };

  useEffect(() => {
    startHeroAutoSlide();
    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current);
    };
  }, []);

  const handleHeroDotClick = (index: 0 | 1) => {
    setHero(index);
    startHeroAutoSlide();
  };

  const firstName = user?.firstName ?? 'Ada';
  const lastName = user?.lastName ?? 'Obi';
  const initials = `${firstName[0]}${lastName[0]}`;
  const roleLabel = user?.role === 'PARENT' ? 'Parent' : 'Athlete';

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          {/* ── fixed header ─────────────────────────────────── */}
          <div style={{ padding: '0 22px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{timeOfDayGreeting()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 1 }}>
                    <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', color: 'var(--cl-ink)' }}>{firstName} {lastName}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.02em', color: '#fff', background: 'var(--cl-accent)', padding: '3px 9px', borderRadius: 'var(--cl-radius-chip)' }}>{roleLabel}</span>
                  </div>
                </div>
              </div>
              <div
                onClick={() => history.push('/athlete/notifications')}
                style={{ width: 40, height: 40, borderRadius: 13, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
              >
                <div style={{ width: 14, height: 14, border: '1.8px solid var(--cl-ink)', borderRadius: '4px 4px 7px 7px' }} />
                <div style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: '50%', background: 'var(--cl-accent)', border: '1.5px solid var(--cl-surface)' }} />
              </div>
            </div>
          </div>

          {/* ── scrollable body ───────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 0 12px' }}>

            {/* stat tiles */}
            <div style={{ padding: '0 22px' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div onClick={() => history.push('/athlete/bookings')} style={{ flex: 1, background: 'var(--cl-ink)', borderRadius: 18, padding: 15, cursor: 'pointer' }}>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, color: 'var(--cl-accent)' }}>2</div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-bfae97)', marginTop: 3 }}>Upcoming</div>
                </div>
                <div onClick={() => history.push('/athlete/bookings')} style={{ flex: 1, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 18, padding: 15, cursor: 'pointer' }}>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, color: 'var(--cl-ink)' }}>1</div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 3 }}>Pending</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <div style={{ flex: 1, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 18, padding: 15 }}>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, color: 'var(--cl-ink)' }}>8</div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 3 }}>Completed</div>
                </div>
                <div style={{ flex: 1, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 18, padding: 15 }}>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, color: 'var(--cl-ink)' }}>3</div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 3 }}>Coaches</div>
                </div>
              </div>
            </div>

            {/* hero carousel */}
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ overflow: 'hidden', borderRadius: 20 }}>
                <div style={{ display: 'flex', transition: 'transform .55s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${hero * 100}%)` }}>
                  {/* Slide 1: Swimming */}
                  <div onClick={() => history.push('/athlete/search')} style={{ flexShrink: 0, width: '100%', boxSizing: 'border-box', background: 'var(--cl-ink)', borderRadius: 20, padding: 18, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', overflow: 'hidden' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 23, letterSpacing: '-0.02em', color: 'var(--cl-surface)', margin: '7px 0 4px', lineHeight: 1.04 }}>Learn to<br />swim</div>
                      <div style={{ fontSize: 12, color: 'var(--cl-bfae97)' }}>Freestyle to open water</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: 'var(--cl-canvas)', color: 'var(--cl-ink)', fontWeight: 700, fontSize: 12.5, padding: '8px 14px', borderRadius: 'var(--cl-radius-chip)' }}>Explore <span style={{ fontSize: 14 }}>→</span></div>
                    </div>
                    <svg viewBox="0 0 150 140" width="138" height="129" style={{ flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
                      <circle cx="92" cy="48" r="30" fill="#E1623C" opacity="0.16" />
                      <g strokeLinecap="round" fill="none">
                        <path d="M4 118 q14 -11 28 0 t28 0 t28 0 t28 0 t28 0" stroke="#F3E9DC" strokeWidth="4" opacity="0.22" />
                        <path d="M4 104 q14 -11 28 0 t28 0 t28 0 t28 0 t28 0" stroke="#E1623C" strokeWidth="5" />
                      </g>
                      <g transform="rotate(-9 78 84)">
                        <rect x="44" y="76" width="52" height="16" rx="8" fill="#F3E9DC" />
                      </g>
                      <circle cx="103" cy="74" r="10.5" fill="#F3E9DC" />
                      <path d="M93.5 72 a10.5 10.5 0 0 1 19 -1.5 l-19 1.5 Z" fill="#E1623C" />
                      <circle cx="99" cy="75" r="2.4" fill="#241C13" />
                      <path d="M108 78 q16 -16 26 -8" stroke="#F3E9DC" strokeWidth="7" strokeLinecap="round" fill="none" />
                      <path d="M48 86 q-14 4 -20 14 M56 92 q-12 8 -14 18" stroke="#F3E9DC" strokeWidth="6.5" strokeLinecap="round" fill="none" opacity="0.9" />
                      <circle cx="132" cy="66" r="3.2" fill="#E1623C" />
                      <circle cx="26" cy="112" r="3" fill="#F3E9DC" opacity="0.6" />
                      <circle cx="40" cy="120" r="2.2" fill="#E1623C" opacity="0.8" />
                    </svg>
                  </div>

                  {/* Slide 2: Tennis */}
                  <div onClick={() => history.push('/athlete/search')} style={{ flexShrink: 0, width: '100%', boxSizing: 'border-box', background: 'var(--cl-accent)', borderRadius: 20, padding: 18, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', overflow: 'hidden' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 23, letterSpacing: '-0.02em', color: 'var(--cl-surface)', margin: '7px 0 4px', lineHeight: 1.04 }}>Master<br />your serve</div>
                      <div style={{ fontSize: 12, color: '#f7dccf' }}>Baseline to match play</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: 'var(--cl-ink)', color: 'var(--cl-surface)', fontWeight: 700, fontSize: 12.5, padding: '8px 14px', borderRadius: 'var(--cl-radius-chip)' }}>Explore <span style={{ fontSize: 14 }}>→</span></div>
                    </div>
                    <svg viewBox="0 0 150 140" width="138" height="129" style={{ flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
                      <circle cx="58" cy="44" r="30" fill="#241C13" opacity="0.12" />
                      <ellipse cx="72" cy="122" rx="34" ry="5" fill="#241C13" opacity="0.15" />
                      <circle cx="70" cy="44" r="10.5" fill="#241C13" />
                      <rect x="63" y="54" width="15" height="33" rx="7.5" fill="#241C13" />
                      <path d="M70 88 l-9 26 M74 88 l9 26" stroke="#241C13" strokeWidth="7.5" strokeLinecap="round" />
                      <path d="M76 62 q16 -8 24 -26" stroke="#241C13" strokeWidth="7.5" strokeLinecap="round" fill="none" />
                      <path d="M64 64 q-10 6 -13 17" stroke="#241C13" strokeWidth="7" strokeLinecap="round" fill="none" />
                      <g transform="rotate(30 106 30)">
                        <ellipse cx="106" cy="30" rx="12" ry="15.5" fill="#F3E9DC" stroke="#241C13" strokeWidth="4.5" />
                        <path d="M100 30 h12 M106 17 v26" stroke="#241C13" strokeWidth="1.4" opacity="0.5" />
                      </g>
                      <circle cx="126" cy="58" r="8.5" fill="#F3E9DC" />
                      <path d="M120 53 q7 5 0 10" stroke="#E1623C" strokeWidth="1.8" fill="none" />
                      <path d="M118 44 q3 -3 6 -1 M114 50 q3 -3 6 -1" stroke="#241C13" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginTop: 13 }}>
                <div onClick={() => handleHeroDotClick(0)} style={{ width: hero === 0 ? 20 : 7, height: 7, borderRadius: 'var(--cl-radius-chip)', background: hero === 0 ? 'var(--cl-ink)' : 'var(--cl-muted-line)', transition: 'all .3s', cursor: 'pointer' }} />
                <div onClick={() => handleHeroDotClick(1)} style={{ width: hero === 1 ? 20 : 7, height: 7, borderRadius: 'var(--cl-radius-chip)', background: hero === 1 ? 'var(--cl-ink)' : 'var(--cl-muted-line)', transition: 'all .3s', cursor: 'pointer' }} />
              </div>
            </div>

            {/* upcoming sessions */}
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>Upcoming sessions</span>
                <span onClick={() => history.push('/athlete/bookings')} style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', fontWeight: 600, cursor: 'pointer' }}>All bookings</span>
              </div>
              {UPCOMING_SESSIONS.map((s, i) => (
                <div
                  key={s.initials}
                  onClick={() => history.push('/athlete/bookings')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: 13, marginBottom: i === UPCOMING_SESSIONS.length - 1 ? 0 : 10, cursor: 'pointer' }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {s.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--cl-ink)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.sport} · {s.date} · {s.time}</div>
                  </div>
                  {s.status === 'Confirmed' ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cl-success-text)', background: 'var(--cl-success-bg)', padding: '5px 10px', borderRadius: 'var(--cl-radius-chip)', flexShrink: 0 }}>Confirmed</span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--cl-accent)', padding: '5px 10px', borderRadius: 'var(--cl-radius-chip)', flexShrink: 0 }}>Pay now</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
