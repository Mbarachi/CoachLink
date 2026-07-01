import { IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

const SPORTS = ['Swimming', 'Tennis'];

const ProfileManagementPage: React.FC = () => {
  const history = useHistory();
  const user = useAuthStore((s) => s.user);
  const initials = ((user?.firstName?.[0] ?? 'T') + (user?.lastName?.[0] ?? 'A')).toUpperCase();

  const [name, setName]   = useState(`${user?.firstName ?? 'Tobi'} ${user?.lastName ?? 'Adebayo'}`);
  const [sport, setSport] = useState('Swimming');
  const [venue, setVenue] = useState('Festival Hotel Pool');
  const [price, setPrice] = useState('₦12,000');
  const [about, setAbout] = useState('Professional swimming coach with 5 years working with kids and adults at all levels.');

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 50, borderRadius: 13,
    border: '1px solid var(--cl-border)', background: 'var(--cl-surface)',
    padding: '0 14px', fontFamily: 'var(--cl-font-body)', fontSize: 14,
    color: 'var(--cl-ink)', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', margin: '15px 0 7px', display: 'block' };

  return (
    <IonPage>
      <IonContent scrollY={false} style={{ '--background': 'var(--cl-canvas)' } as React.CSSProperties}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'var(--cl-font-body)' }}>

          <div style={{ flexShrink: 0, padding: '0 var(--cl-px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 46 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>9:41</span>
              <span style={{ width: 18, height: 11, border: '1.6px solid var(--cl-ink)', borderRadius: 3, display: 'block' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--cl-ink)', margin: '8px 0 14px' }}>My profile</h1>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--cl-px) 12px' }}>
            {/* photo + change button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{
                width: 66, height: 66, borderRadius: 20, flexShrink: 0,
                backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 9px, var(--cl-photo-dark-2) 9px 18px)',
                display: 'flex', alignItems: 'flex-end',
              }}>
                <span style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--cl-accent)', padding: '6px 8px' }}>{initials}</span>
              </div>
              <button style={{ border: '1.6px solid var(--cl-ink)', background: 'var(--cl-surface)', borderRadius: 12, padding: '10px 16px', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 13, color: 'var(--cl-ink)', cursor: 'pointer' }}>Change photo</button>
            </div>

            <label style={{ ...labelStyle, marginTop: 18 }}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Sport</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {SPORTS.map(s => (
                <span key={s} onClick={() => setSport(s)} style={{ fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 11, cursor: 'pointer', background: sport === s ? 'var(--cl-ink)' : 'var(--cl-surface)', color: sport === s ? 'var(--cl-accent)' : 'var(--cl-muted-3)', border: sport === s ? 'none' : '1px solid var(--cl-border)' }}>{s}</span>
              ))}
            </div>

            <label style={labelStyle}>Training venue</label>
            <input value={venue} onChange={e => setVenue(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Price per session</label>
            <input value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
            <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 7 }}>Recommended for {sport.toLowerCase()}: ₦5,000 – ₦15,000</div>

            <label style={labelStyle}>About</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} style={{ width: '100%', height: 84, borderRadius: 13, border: '1px solid var(--cl-border)', background: 'var(--cl-surface)', padding: 13, fontFamily: 'var(--cl-font-body)', fontSize: 14, color: 'var(--cl-ink)', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />

            <div style={{ height: 90 }} />
          </div>

          {/* sticky footer */}
          <div style={{ flexShrink: 0, padding: '14px var(--cl-px) 22px', background: 'var(--cl-canvas)', borderTop: '1px solid var(--cl-border)' }}>
            <button onClick={() => history.push('/coach/dashboard')} style={{ width: '100%', height: 54, border: 'none', borderRadius: 15, background: 'var(--cl-accent)', color: 'var(--cl-on-accent)', fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 15.5, cursor: 'pointer' }}>Save profile</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileManagementPage;
