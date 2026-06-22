import { IonContent, IonPage, IonToast } from '@ionic/react';
import { arrowBackOutline, locationOutline, timeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AppButton } from '@/components/ui';
import { CoachBadge, PriceTag, RatingDisplay } from '@/features/coaches/components';
import { mockCoaches } from '@/features/coaches/data/mockCoaches';

interface Params {
  id: string;
}

const CoachDetailsPage: React.FC = () => {
  const { id } = useParams<Params>();
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);

  const coach = mockCoaches.find((c) => c.id === id);

  if (!coach) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--cl-text-light)', marginTop: 80, textAlign: 'center' }}>
            Coach not found.
          </p>
        </IonContent>
      </IonPage>
    );
  }

  const fullName = `${coach.firstName} ${coach.lastName}`;

  return (
    <IonPage>
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        {/* Back button */}
        <button
          onClick={() => history.goBack()}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid var(--cl-border)',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IonIcon icon={arrowBackOutline} style={{ fontSize: 20, color: 'var(--cl-text-main)' }} />
        </button>

        <div style={{ paddingBottom: 100 }}>
          {/* Hero avatar */}
          <div
            style={{
              background: 'linear-gradient(160deg, #e6f7f5 0%, #f8fafc 100%)',
              padding: '60px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={coach.profileImage}
              alt={fullName}
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                marginBottom: 14,
              }}
            />

            {/* Name + verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h1
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 20,
                  color: 'var(--cl-text-main)',
                  margin: 0,
                }}
              >
                {fullName}
              </h1>
              {coach.isVerified && <CoachBadge label="Verified" variant="verified" />}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
              <CoachBadge label={coach.sport} variant="sport" />
              <CoachBadge label={`${coach.yearsOfExperience} yrs exp`} variant="experience" />
            </div>

            {/* Rating */}
            <RatingDisplay rating={coach.rating} reviewCount={coach.reviewCount} size="md" />
          </div>

          {/* Details body */}
          <div style={{ padding: '20px 24px 0' }}>

            {/* Venue row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                border: '1px solid var(--cl-border)',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 16,
              }}
            >
              <IonIcon icon={locationOutline} style={{ fontSize: 18, color: 'var(--cl-primary)', flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: 'var(--cl-text-light)', margin: 0 }}>
                  Coaching Venue
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--cl-text-main)', margin: 0 }}>
                  {coach.venue} · {coach.area}
                </p>
              </div>
            </div>

            {/* About */}
            <section style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'var(--cl-text-main)',
                  margin: '0 0 8px',
                }}
              >
                About Coach
              </h3>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 14,
                  color: 'var(--cl-text-light)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {coach.bio}
              </p>
            </section>

            {/* Pricing */}
            <section
              style={{
                background: '#fff',
                border: '1px solid var(--cl-border)',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'var(--cl-text-main)',
                  margin: '0 0 6px',
                }}
              >
                Pricing
              </h3>
              <PriceTag amount={coach.sessionRate} size="md" />
            </section>

            {/* Reviews Summary */}
            <section
              style={{
                background: '#fff',
                border: '1px solid var(--cl-border)',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 28,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'var(--cl-text-main)',
                  margin: '0 0 8px',
                }}
              >
                Reviews
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 28, fontWeight: 700, color: 'var(--cl-text-main)', margin: 0 }}>
                    {coach.rating.toFixed(1)}
                  </p>
                  <RatingDisplay rating={coach.rating} size="sm" />
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--cl-border)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IonIcon icon={timeOutline} style={{ fontSize: 16, color: 'var(--cl-text-light)' }} />
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, color: 'var(--cl-text-light)', margin: 0 }}>
                    {coach.reviewCount} reviews total
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <AppButton onClick={() => setShowToast(true)}>
              Request Session
            </AppButton>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Booking requests will be available in Sprint 3"
          duration={3000}
          position="bottom"
          color="medium"
        />
      </IonContent>
    </IonPage>
  );
};

export default CoachDetailsPage;
