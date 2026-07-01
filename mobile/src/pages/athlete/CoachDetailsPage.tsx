import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', venue: 'Festival Hotel Pool', price: '₦12,000', rating: '4.8', reviews: 32, dist: '1.2km', exp: '5 yrs', sessions: '286', initials: 'TA' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   venue: 'MU Court',            price: '₦15,000', rating: '4.9', reviews: 27, dist: '2.1km', exp: '7 yrs', sessions: '340', initials: 'CO' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', venue: 'Golden Tulip Pool',   price: '₦9,000',  rating: '4.7', reviews: 18, dist: '3.0km', exp: '4 yrs', sessions: '150', initials: 'EJ' },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   venue: 'MU Court',            price: '₦18,000', rating: '4.6', reviews: 14, dist: '2.4km', exp: '6 yrs', sessions: '210', initials: 'SD' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', venue: 'School Facilities',   price: '₦7,500',  rating: '4.5', reviews: 21, dist: '4.1km', exp: '3 yrs', sessions: '98',  initials: 'YB' },
];

const CoachDetailsPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const coach = COACHES[Number(id)] ?? COACHES[0];

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          {/* scroll area */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* photo header */}
            <div style={{
              height: 236,
              backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 13px, var(--cl-photo-dark-2) 13px 26px)',
              position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16,
            }}>
              <button onClick={() => history.goBack()} style={{ position: 'absolute', top: 50, left: 18, width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'rgba(255,253,248,.92)', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <div style={{ position: 'absolute', top: 50, right: 18, width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'rgba(255,253,248,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, cursor: 'pointer' }}>♡</div>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#d8c6ab', background: 'rgba(0,0,0,.35)', padding: '4px 9px', borderRadius: 7 }}>coach · action photo</span>
            </div>

            <div style={{ padding: '0 var(--cl-px)', marginTop: -36, position: 'relative' }}>
              {/* avatar */}
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 24, border: '3px solid var(--cl-canvas)' }}>{coach.initials}</div>

              <h2 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 25, letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '14px 0 3px' }}>
                {coach.name} <span style={{ color: 'var(--cl-accent)' }}>✓</span>
              </h2>
              <div style={{ fontSize: 14, color: 'var(--cl-muted-1)' }}>{coach.sport} Coach · {coach.venue}</div>
              <div style={{ fontSize: 13.5, color: 'var(--cl-ink)', marginTop: 7, fontWeight: 600 }}>
                ★ {coach.rating} <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>({coach.reviews} reviews)</span>
              </div>

              {/* stat tiles */}
              <div style={{ display: 'flex', gap: 9, marginTop: 18 }}>
                {[{ val: coach.exp, label: 'Experience' }, { val: coach.sessions, label: 'Sessions' }, { val: coach.rating, label: 'Rating' }].map(s => (
                  <div key={s.label} style={{ flex: 1, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 15, padding: '13px 12px' }}>
                    <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* About */}
              <h3 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)', margin: '22px 0 7px' }}>About</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-3)', margin: 0 }}>
                Professional coach with {coach.exp} working with kids and adults across all levels. Focused on technique, endurance and steady, measurable progress.
              </p>

              {/* Training venue */}
              <h3 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)', margin: '20px 0 7px' }}>Training venue</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 15, padding: '13px 14px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--cl-subtle)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--cl-ink)' }}>{coach.venue}</div>
                  <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>Amuwo Odofin, Lagos · {coach.dist}</div>
                </div>
              </div>

              {/* Pricing */}
              <h3 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)', margin: '20px 0 7px' }}>Pricing</h3>
              <div style={{ background: 'var(--cl-ink)', borderRadius: 17, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 22, color: 'var(--cl-surface)' }}>{coach.price}</div>
                  <div style={{ fontSize: 12, color: '#bfae97', marginTop: 2 }}>per session</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--cl-surface)', background: 'var(--cl-accent)', padding: '6px 11px', borderRadius: 'var(--cl-radius-chip)' }}>Within range</span>
              </div>

              {/* Reviews */}
              <h3 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)', margin: '20px 0 7px' }}>Reviews</h3>
              <div style={{ background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 15, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--cl-subtle)', color: 'var(--cl-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>NK</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--cl-ink)' }}>Ngozi K.</div>
                    <div style={{ fontSize: 11, color: 'var(--cl-muted-1)' }}>★ 5.0 · 2 weeks ago</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--cl-muted-3)', margin: '10px 0 0' }}>
                  Patient and encouraging. My son went from scared of water to swimming a full lap in a month.
                </p>
              </div>

              <div style={{ height: 96 }} />
            </div>
          </div>

          {/* sticky footer */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--cl-ink)' }}>{coach.price}</div>
              <div style={{ fontSize: 11, color: 'var(--cl-muted-1)' }}>per session</div>
            </div>
            <button onClick={() => history.push(`/athlete/booking-request/${coach.id}`)} style={{ flex: 1, height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>
              Request session
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CoachDetailsPage;
