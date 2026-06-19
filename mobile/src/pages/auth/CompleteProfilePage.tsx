import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { z } from 'zod';

import { AppButton, AppInput, AppAvatar, AppPageHeader } from '@/components/ui';
import { useAuthStore } from '@/store/auth.store';

// Schemas per role
const athleteSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  area: z.string().min(1, 'Area is required'),
  preferredSport: z.string().min(1, 'Please select a sport'),
});

const coachSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  sport: z.string().min(1, 'Please select a sport'),
  yearsOfExperience: z.string().min(1, 'Please select experience'),
  area: z.string().min(1, 'Area is required'),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

type AthleteForm = z.infer<typeof athleteSchema>;
type CoachForm = z.infer<typeof coachSchema>;

const SPORTS = ['Tennis', 'Swimming'];
const AREAS = ['Lekki', 'Ikoyi', 'Yaba', 'Victoria Island', 'Ikeja', 'Surulere'];
const EXPERIENCE_OPTIONS = ['< 1 year', '1-2 years', '3-5 years', '6-10 years', '10+ years'];

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--cl-text-main)',
  marginBottom: 6,
  fontFamily: 'Poppins, sans-serif',
};

const selectWrapStyle: React.CSSProperties = {
  background: '#fff',
  border: '1.5px solid var(--cl-border)',
  borderRadius: 12,
  marginBottom: 16,
  minHeight: 52,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 14,
};

const CompleteProfilePage: React.FC = () => {
  const history = useHistory();
  const { user, updateUser } = useAuthStore();
  const role = user?.role ?? 'ATHLETE';
  const isCoach = role === 'COACH';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null);

  const schema = isCoach ? coachSchema : athleteSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: isCoach
      ? { fullName: '', sport: '', yearsOfExperience: '', area: '', hourlyRate: '', bio: '' }
      : { fullName: '', area: '', preferredSport: '' },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: AthleteForm | CoachForm) => {
    const [firstName, ...rest] = (data as AthleteForm).fullName.trim().split(' ');
    updateUser({
      firstName,
      lastName: rest.join(' ') || '',
      profileImage: avatarSrc,
    });
    if (isCoach) {
      history.replace('/coach/dashboard');
    } else {
      history.replace('/athlete/home');
    }
  };

  return (
    <IonPage>
      <AppPageHeader title="Complete Profile" showBack={false} />
      <IonContent
        fullscreen
        style={{ '--background': 'var(--cl-background)' } as React.CSSProperties}
      >
        <div style={{ padding: '8px 24px 60px' }}>
          {/* Avatar upload */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <AppAvatar
              src={avatarSrc}
              size={90}
              showEditBadge
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 13,
                color: 'var(--cl-accent)',
                marginTop: 8,
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Add Profile Photo
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <AppInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={field.value}
                  onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                  onIonBlur={field.onBlur}
                  error={(errors as any).fullName?.message}
                />
              )}
            />

            {/* Coach-specific: Sport */}
            {isCoach && (
              <>
                <div>
                  <label style={labelStyle}>Sport</label>
                  <Controller
                    name="sport"
                    control={control}
                    render={({ field }) => (
                      <div style={selectWrapStyle}>
                        <IonSelect
                          placeholder="Select your sport"
                          value={field.value}
                          onIonChange={(e) => field.onChange(e.detail.value)}
                          style={{ width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: 15 }}
                        >
                          {SPORTS.map((s) => (
                            <IonSelectOption key={s} value={s}>
                              {s}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </div>
                    )}
                  />
                  {(errors as any).sport && (
                    <p style={{ margin: '-12px 0 8px 4px', fontSize: 12, color: 'var(--cl-error)', fontFamily: 'Poppins, sans-serif' }}>
                      {(errors as any).sport.message}
                    </p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Years of Experience</label>
                  <Controller
                    name="yearsOfExperience"
                    control={control}
                    render={({ field }) => (
                      <div style={selectWrapStyle}>
                        <IonSelect
                          placeholder="Select experience"
                          value={field.value}
                          onIonChange={(e) => field.onChange(e.detail.value)}
                          style={{ width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: 15 }}
                        >
                          {EXPERIENCE_OPTIONS.map((opt) => (
                            <IonSelectOption key={opt} value={opt}>
                              {opt}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </div>
                    )}
                  />
                  {(errors as any).yearsOfExperience && (
                    <p style={{ margin: '-12px 0 8px 4px', fontSize: 12, color: 'var(--cl-error)', fontFamily: 'Poppins, sans-serif' }}>
                      {(errors as any).yearsOfExperience.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Area */}
            <div>
              <label style={labelStyle}>Area / Location</label>
              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <div style={selectWrapStyle}>
                    <IonSelect
                      placeholder="Select your area"
                      value={field.value}
                      onIonChange={(e) => field.onChange(e.detail.value)}
                      style={{ width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: 15 }}
                    >
                      {AREAS.map((a) => (
                        <IonSelectOption key={a} value={a}>
                          {a}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </div>
                )}
              />
              {(errors as any).area && (
                <p style={{ margin: '-12px 0 8px 4px', fontSize: 12, color: 'var(--cl-error)', fontFamily: 'Poppins, sans-serif' }}>
                  {(errors as any).area.message}
                </p>
              )}
            </div>

            {/* Athlete-specific: Preferred Sport */}
            {!isCoach && (
              <div>
                <label style={labelStyle}>Preferred Sport</label>
                <Controller
                  name="preferredSport"
                  control={control}
                  render={({ field }) => (
                    <div style={selectWrapStyle}>
                      <IonSelect
                        placeholder="Select your preferred sport"
                        value={field.value}
                        onIonChange={(e) => field.onChange(e.detail.value)}
                        style={{ width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: 15 }}
                      >
                        {SPORTS.map((s) => (
                          <IonSelectOption key={s} value={s}>
                            {s}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </div>
                  )}
                />
                {(errors as any).preferredSport && (
                  <p style={{ margin: '-12px 0 8px 4px', fontSize: 12, color: 'var(--cl-error)', fontFamily: 'Poppins, sans-serif' }}>
                    {(errors as any).preferredSport.message}
                  </p>
                )}
              </div>
            )}

            {/* Coach-specific: Hourly Rate + Bio */}
            {isCoach && (
              <>
                <Controller
                  name="hourlyRate"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      label="Hourly Rate (NGN)"
                      placeholder="Enter your hourly rate"
                      type="number"
                      value={field.value}
                      onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      onIonBlur={field.onBlur}
                      error={(errors as any).hourlyRate?.message}
                    />
                  )}
                />
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <AppInput
                      label="Bio"
                      placeholder="Write a short bio about yourself"
                      value={field.value}
                      onIonInput={(e) => field.onChange((e.target as HTMLInputElement).value)}
                      onIonBlur={field.onBlur}
                      error={(errors as any).bio?.message}
                    />
                  )}
                />
              </>
            )}

            <div style={{ marginTop: 8 }}>
              <AppButton type="submit" loading={isSubmitting}>
                Continue
              </AppButton>
            </div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 12,
                color: 'var(--cl-text-light)',
                textAlign: 'center',
                marginTop: 12,
              }}
            >
              You can change this later
            </p>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CompleteProfilePage;
