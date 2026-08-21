import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import {
  AppButton, AppCard, AppPage, EmptyState, InitialsAvatar,
  QueryState, SectionHeading, StatusPill, StickyFooter,
} from '@/components/ui';
import { useCoach } from '@/hooks';
import { coachInitials, coachName, coachSportNames } from '@/lib/coach';
import { formatNaira } from '@/lib/format';

const sectionStyle: React.CSSProperties = { fontSize: 15, margin: '20px 0 7px' };

const CoachDetailsPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const query = useCoach(id);
  const coach = query.data;

  return (
    <AppPage>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{
          height: 236,
          backgroundImage: 'repeating-linear-gradient(125deg, var(--cl-photo-dark) 0 13px, var(--cl-photo-dark-2) 13px 26px)',
          position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 16,
        }}>
          <button onClick={() => history.goBack()} style={{ position: 'absolute', top: 50, left: 18, width: 38, height: 38, borderRadius: '50%', border: 'none', background: 'rgba(255,253,248,.92)', fontSize: 18, cursor: 'pointer' }}>‹</button>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#d8c6ab', background: 'rgba(0,0,0,.35)', padding: '4px 9px', borderRadius: 7 }}>coach · action photo</span>
        </div>

        <div style={{ padding: '0 var(--cl-px)', marginTop: -36, position: 'relative' }}>
          <QueryState isLoading={query.isPending} error={query.error} onRetry={() => void query.refetch()}>
            {!coach ? null : (
              <>
                <InitialsAvatar initials={coachInitials(coach)} size={72} radius={20} fontSize={24} style={{ border: '3px solid var(--cl-canvas)' }} />

                <h2 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 25, letterSpacing: '-0.02em', color: 'var(--cl-ink)', margin: '14px 0 3px' }}>
                  {coachName(coach)}{' '}
                  {coach.profile.verificationStatus === 'APPROVED' && <span style={{ color: 'var(--cl-accent)' }}>✓</span>}
                </h2>
                <div style={{ fontSize: 14, color: 'var(--cl-muted-1)' }}>
                  {coachSportNames(coach).join(' & ')} Coach · {coach.profile.venue}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--cl-ink)', marginTop: 7, fontWeight: 600 }}>
                  {coach.profile.totalReviews > 0 ? (
                    <>★ {coach.profile.rating.toFixed(1)}{' '}
                      <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>
                        ({coach.profile.totalReviews} {coach.profile.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>No reviews yet</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 9, marginTop: 18 }}>
                  {[
                    { val: `${coach.profile.yearsOfExperience} yrs`, label: 'Experience' },
                    { val: String(coach.profile.totalReviews), label: 'Reviews' },
                    { val: coach.profile.totalReviews > 0 ? coach.profile.rating.toFixed(1) : '—', label: 'Rating' },
                  ].map(s => (
                    <AppCard key={s.label} padding="13px 12px" style={{ flex: 1, borderRadius: 15 }}>
                      <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 19, color: 'var(--cl-ink)' }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: 'var(--cl-muted-1)', marginTop: 2 }}>{s.label}</div>
                    </AppCard>
                  ))}
                </div>

                <SectionHeading style={{ ...sectionStyle, margin: '22px 0 7px' }}>About</SectionHeading>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-3)', margin: 0 }}>{coach.profile.bio}</p>

                <SectionHeading style={sectionStyle}>Training venue</SectionHeading>
                <AppCard padding="13px 14px" style={{ display: 'flex', alignItems: 'center', gap: 11, borderRadius: 15 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--cl-subtle)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--cl-ink)' }}>{coach.profile.venue}</div>
                    <div style={{ fontSize: 12, color: 'var(--cl-muted-1)' }}>{coach.profile.area}</div>
                  </div>
                </AppCard>

                <SectionHeading style={sectionStyle}>Pricing</SectionHeading>
                <div style={{ background: 'var(--cl-ink)', borderRadius: 17, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 22, color: 'var(--cl-surface)' }}>
                      {formatNaira(coach.profile.sessionRate)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cl-bfae97)', marginTop: 2 }}>per session</div>
                  </div>
                  <StatusPill tone="accent" style={{ fontWeight: 600, padding: '6px 11px', color: 'var(--cl-surface)' }}>Within range</StatusPill>
                </div>

                <SectionHeading style={sectionStyle}>Reviews</SectionHeading>
                {/* Reviews have no backend module yet, so this stays honest rather
                    than showing an invented testimonial. */}
                <AppCard padding={4} style={{ borderRadius: 15 }}>
                  <EmptyState
                    compact
                    illustration="reviews"
                    title="No reviews yet"
                    message="Reviews appear here once athletes have completed sessions with this coach."
                  />
                </AppCard>

                <div style={{ height: 96 }} />
              </>
            )}
          </QueryState>
        </div>
      </div>

      {coach && (
        <StickyFooter style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--cl-ink)' }}>{formatNaira(coach.profile.sessionRate)}</div>
            <div style={{ fontSize: 11, color: 'var(--cl-muted-1)' }}>per session</div>
          </div>
          <AppButton
            size="md"
            fullWidth={false}
            onClick={() => history.push(`/athlete/booking-request/${coach.profile.id}`)}
            style={{ flex: 1 }}
          >
            Request session
          </AppButton>
        </StickyFooter>
      )}
    </AppPage>
  );
};

export default CoachDetailsPage;
