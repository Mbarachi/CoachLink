import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

const BookingSuccessPage: React.FC = () => {
  const history = useHistory();
  const { bookingId } = useParams<{ bookingId: string }>();
  const paid = bookingId === 'paid';
  const coachName = 'Tobi Adebayo';

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 34px', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, color: 'var(--cl-on-accent)' }}>✓</div>

          {paid ? (
            <>
              <h2 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 27, letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '26px 0 10px' }}>Booking confirmed</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: 0 }}>
                Payment received. Your session with {coachName} is confirmed. See you on the court.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 27, letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '26px 0 10px' }}>Request sent</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: 0 }}>
                Your request has been sent to {coachName}. We'll notify you the moment they respond — then you can pay to confirm.
              </p>
            </>
          )}

          <button onClick={() => history.push('/athlete/bookings')} style={{ marginTop: 30, width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-ink)', color: 'var(--cl-surface)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>
            View my bookings
          </button>
          <button onClick={() => history.push('/athlete/home')} style={{ marginTop: 11, border: 'none', background: 'none', color: 'var(--cl-ink)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--cl-font-body)' }}>
            Back to home
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingSuccessPage;
