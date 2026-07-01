import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const COACHES = [
  { id: '0', name: 'Tobi Adebayo',    sport: 'Swimming', price: '₦12,000', initials: 'TA' },
  { id: '1', name: 'Chidinma Okafor', sport: 'Tennis',   price: '₦15,000', initials: 'CO' },
  { id: '2', name: 'Emeka Johnson',   sport: 'Swimming', price: '₦9,000',  initials: 'EJ' },
  { id: '3', name: 'Sarah Danjuma',   sport: 'Tennis',   price: '₦18,000', initials: 'SD' },
  { id: '4', name: 'Yusuf Bello',     sport: 'Swimming', price: '₦7,500',  initials: 'YB' },
];

const DATES = [
  { day: 'Mon', date: '13' }, { day: 'Wed', date: '15' },
  { day: 'Fri', date: '17' }, { day: 'Sat', date: '18' },
];
const TIMES = ['6:00 AM', '8:00 AM', '10:00 AM', '4:00 PM'];

const BookingRequestPage: React.FC = () => {
  const history = useHistory();
  const { coachId } = useParams<{ coachId: string }>();
  const user = useAuthStore((s) => s.user);
  const isParent = user?.role === 'PARENT';
  const coach = COACHES[Number(coachId)] ?? COACHES[0];

  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(1);
  const [note, setNote] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');

  const inputStyle: React.CSSProperties = {
    height: 50, borderRadius: 13, border: '1px solid var(--cl-border)',
    background: 'var(--cl-surface)', padding: '0 14px',
    fontFamily: 'var(--cl-font-body)', fontSize: 14, color: 'var(--cl-ink)', outline: 'none',
    boxSizing: 'border-box',
  };

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
              <button onClick={() => history.goBack()} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', fontSize: 18, cursor: 'pointer' }}>‹</button>
              <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>Request a session</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 12px' }}>
            {/* coach summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, background: 'var(--cl-surface)', border: '1px solid var(--cl-border)', borderRadius: 16, padding: 13 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{coach.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--cl-ink)' }}>{coach.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)' }}>{coach.sport} · {coach.price}/session</div>
              </div>
            </div>

            {/* child fields (parent only) */}
            {isParent && (
              <>
                <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '20px 0 11px' }}>Child details</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Child's name" style={{ ...inputStyle, flex: 2 }} />
                  <input value={childAge} onChange={e => setChildAge(e.target.value)} placeholder="Age" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </>
            )}

            {/* date picker */}
            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '20px 0 11px' }}>Select date · May 2024</h4>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'space-between' }}>
              {DATES.map((d, i) => (
                <div key={i} onClick={() => setSelectedDate(i)} style={{
                  flex: 1, textAlign: 'center', padding: '11px 0', borderRadius: 13,
                  background: selectedDate === i ? 'var(--cl-accent)' : 'var(--cl-surface)',
                  border: `1px solid ${selectedDate === i ? 'var(--cl-accent)' : 'var(--cl-border)'}`,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 10, color: selectedDate === i ? 'var(--cl-surface)' : 'var(--cl-muted-2)' }}>{d.day}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: selectedDate === i ? 'var(--cl-surface)' : 'var(--cl-ink)', marginTop: 3 }}>{d.date}</div>
                </div>
              ))}
            </div>

            {/* time picker */}
            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '20px 0 11px' }}>Select time</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TIMES.map((t, i) => (
                <span key={t} onClick={() => setSelectedTime(i)} style={{
                  fontSize: 13, fontWeight: 600, padding: '9px 15px', borderRadius: 11, cursor: 'pointer',
                  background: selectedTime === i ? 'var(--cl-ink)' : 'var(--cl-surface)',
                  color: selectedTime === i ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
                  border: selectedTime === i ? 'none' : '1px solid var(--cl-border)',
                }}>{t}</span>
              ))}
            </div>

            {/* note */}
            <h4 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)', margin: '20px 0 11px' }}>
              Note for the coach <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>(optional)</span>
            </h4>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Any goals or requirements?"
              style={{ width: '100%', height: 74, borderRadius: 14, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 14, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            />

            {/* info note */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cl-subtle)', borderRadius: 13, padding: 13, marginTop: 14 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cl-ink)', color: 'var(--cl-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>i</div>
              <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-3)' }}>You'll only pay after {coach.name} accepts. Payment is handled securely via Paystack.</span>
            </div>

            <div style={{ height: 90 }} />
          </div>

          {/* sticky footer */}
          <div style={{ flexShrink: 0, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <button onClick={() => history.push('/athlete/booking-success/new')} style={{ width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>Send request</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingRequestPage;
