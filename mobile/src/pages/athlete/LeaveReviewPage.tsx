import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const REVIEWEE: Record<string, { initials: string; name: string; sport: string; date: string }> = {
  completed: { initials: 'EJ', name: 'Emeka Johnson', sport: 'Swimming', date: 'Sat, 18 May' },
};

const LeaveReviewPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const reviewee = REVIEWEE[bookingId] ?? REVIEWEE.completed;
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ flexShrink: 0, padding: '0 var(--cl-px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '4px 0 14px' }}>
              <button onClick={() => history.push('/athlete/bookings')} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>Leave a review</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 8 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 22 }}>{reviewee.initials}</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)', marginTop: 12 }}>{reviewee.name}</div>
              <div style={{ fontSize: 13, color: 'var(--cl-muted-1)', marginTop: 2 }}>{reviewee.sport} · {reviewee.date}</div>
            </div>

            <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--cl-muted-1)', margin: '22px 0 12px' }}>How was your session?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} onClick={() => setRating(n)} style={{ fontSize: 38, lineHeight: 1, cursor: 'pointer', color: n <= rating ? 'var(--cl-accent)' : 'var(--cl-muted-line)' }}>★</span>
              ))}
            </div>

            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '28px 0 10px' }}>Your review</h4>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Share how the session went — coaching style, punctuality, results…"
              style={{ width: '100%', height: 120, borderRadius: 14, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 14, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ height: 90 }} />
          </div>

          <div style={{ flexShrink: 0, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <button
              onClick={() => history.push('/athlete/review-sent')}
              disabled={rating === 0}
              style={{
                width: '100%', height: 54, border: 'none', borderRadius: 15,
                fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5,
                cursor: rating === 0 ? 'default' : 'pointer',
                background: rating === 0 ? 'var(--cl-subtle)' : 'var(--cl-accent)',
                color: rating === 0 ? 'var(--cl-muted-2)' : 'var(--cl-on-accent)',
              }}
            >Submit review</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LeaveReviewPage;
