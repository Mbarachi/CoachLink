import React, { useMemo, useState } from 'react';

import {
  AppButton, AppCard, AppInput, AppPage, AppSelect, EmptyState, LoadingOverlay,
  PageBody, PageTitle, QueryState, SectionHeading, StatusPill,
} from '@/components/ui';
import type { PillTone } from '@/components/ui';
import { useBanks, useMyCoachProfile, usePayouts, useSavePayoutAccount } from '@/hooks';
import { getErrorMessage } from '@/lib/apiError';
import { formatNaira, formatShortDate } from '@/lib/format';
import { useUiStore } from '@/store/ui.store';
import type { PayoutStatus } from '@/types';

const TONES: Record<PayoutStatus, PillTone> = {
  SENT: 'success',
  PENDING: 'pending',
  FAILED: 'destructive',
};

const LABELS: Record<PayoutStatus, string> = {
  SENT: 'Sent',
  PENDING: 'Sending',
  FAILED: 'Failed',
};

/** AppSelect deals in plain strings, so the unchosen state needs a label. */
const PICK_A_BANK = 'Select your bank';

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <AppCard style={{ flex: 1, minWidth: 0, borderRadius: 16, padding: 14, marginBottom: 0 }}>
    <div style={{
      fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 18,
      color: 'var(--cl-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {value}
    </div>
    <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>{label}</div>
  </AppCard>
);

/**
 * Money already sent, not money to claim. Payouts leave automatically once a
 * session is marked complete, so there is nothing here to press — the screen
 * answers "was I paid", and the only action is saying where to pay.
 */
const EarningsSummaryPage: React.FC = () => {
  const showToast = useUiStore((s) => s.showToast);
  const profileQuery = useMyCoachProfile();
  const payoutsQuery = usePayouts();
  const save = useSavePayoutAccount();

  const account = profileQuery.data?.profile.payoutAccount ?? null;
  const payouts = payoutsQuery.data ?? [];

  const [editing, setEditing] = useState(false);
  const banksQuery = useBanks(editing);
  const [bankName, setBankName] = useState(PICK_A_BANK);
  const [accountNumber, setAccountNumber] = useState('');

  const bankOptions = useMemo(
    () => [PICK_A_BANK, ...(banksQuery.data ?? []).map((b) => b.name)],
    [banksQuery.data],
  );

  const totals = useMemo(() => {
    const sent = payouts.filter((p) => p.status === 'SENT');
    const paid = sent.reduce((n, p) => n + p.amount, 0);
    const onTheWay = payouts
      .filter((p) => p.status === 'PENDING')
      .reduce((n, p) => n + p.amount, 0);
    return {
      paid,
      onTheWay,
      sessions: sent.length,
      average: sent.length ? Math.round(paid / sent.length) : 0,
    };
  }, [payouts]);

  const bank = (banksQuery.data ?? []).find((b) => b.name === bankName);
  const ready = Boolean(bank) && accountNumber.length === 10;

  const submit = async () => {
    if (!bank) return;
    try {
      const saved = await save.mutateAsync({
        accountNumber, bankCode: bank.code, bankName: bank.name,
      });
      showToast(`Payouts will go to ${saved.accountName}.`, 'success');
      setEditing(false);
      setAccountNumber('');
      setBankName(PICK_A_BANK);
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not save that account.'), 'danger');
    }
  };

  return (
    <AppPage padding="screen">
      <LoadingOverlay show={save.isPending} label="Confirming with your bank…" />

      <div style={{ flexShrink: 0 }}>
        <PageTitle>Earnings</PageTitle>
      </div>

      <PageBody refreshable pb={96}>
        <QueryState
          isLoading={payoutsQuery.isPending}
          error={payoutsQuery.error}
          onRetry={() => void payoutsQuery.refetch()}
        >
          <div style={{ background: 'var(--cl-ink-fill)', borderRadius: 20, padding: 20 }}>
            <div style={{ fontSize: 12.5, color: 'var(--cl-bfae97)' }}>Paid out to you</div>
            <div style={{
              fontFamily: 'var(--cl-font-display)', fontWeight: 800, fontSize: 34,
              color: 'var(--cl-on-ink)', margin: '4px 0 2px',
            }}>
              {formatNaira(totals.paid)}
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--cl-bfae97)' }}>
              {totals.onTheWay > 0
                ? `${formatNaira(totals.onTheWay)} still on its way`
                : 'Sent automatically after each completed session'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Stat value={String(totals.sessions)} label="Sessions paid" />
            <Stat value={formatNaira(totals.average)} label="Average" />
            <Stat value="8%" label="CoachLink fee" />
          </div>

          <SectionHeading>Where you get paid</SectionHeading>
          {!editing ? (
            <AppCard style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {account ? (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>
                      {account.accountName}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>
                      {account.bankName} · ••••{account.accountNumber.slice(-4)}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>
                      No account yet
                    </div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--cl-muted-1)', marginTop: 2 }}>
                      Your earnings are still recorded — they just cannot be sent
                      until you add an account.
                    </div>
                  </>
                )}
              </div>
              <AppButton
                variant="outline"
                fullWidth={false}
                onClick={() => setEditing(true)}
                style={{ height: 40, padding: '0 16px', fontSize: 13.5, flexShrink: 0 }}
              >
                {account ? 'Change' : 'Add'}
              </AppButton>
            </AppCard>
          ) : (
            <AppCard>
              <AppSelect
                label="Bank"
                value={bankName}
                onChange={setBankName}
                options={bankOptions}
              />
              <AppInput
                label="Account number"
                type="tel"
                value={accountNumber}
                // Digits only, ten of them: a NUBAN is fixed-width, and letting
                // spaces or dashes through only fails later at the bank.
                onChange={(v) => setAccountNumber(v.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 digits"
              />
              {/* Checked with the bank before saving: a transfer to a valid but
                  wrong account cannot be pulled back. */}
              <p style={{ fontSize: 11.5, lineHeight: 1.45, color: 'var(--cl-muted-2)', margin: '0 0 12px' }}>
                We confirm the name on the account with your bank before saving it.
              </p>
              <div style={{ display: 'flex', gap: 9 }}>
                <AppButton variant="outline" onClick={() => setEditing(false)} style={{ flex: 1 }}>
                  Cancel
                </AppButton>
                <AppButton
                  onClick={() => void submit()}
                  disabled={!ready}
                  loading={save.isPending}
                  style={{ flex: 2 }}
                >
                  Confirm account
                </AppButton>
              </div>
            </AppCard>
          )}

          <SectionHeading>Payouts</SectionHeading>
          {payouts.length === 0 ? (
            <EmptyState
              compact
              illustration="wallet"
              title="No payouts yet"
              message="Once a paid session is marked complete, your share is sent automatically."
            />
          ) : (
            payouts.map((p) => (
              <AppCard key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cl-ink)' }}>
                    {formatNaira(p.amount)}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--cl-muted-1)', marginTop: 2 }}>
                    {formatShortDate(p.createdAt)} · {formatNaira(p.sessionRate)} session
                  </div>
                  {p.status === 'FAILED' && p.failureReason && (
                    <div style={{ fontSize: 11.5, lineHeight: 1.4, color: 'var(--cl-destructive)', marginTop: 3 }}>
                      {p.failureReason}
                    </div>
                  )}
                </div>
                <StatusPill tone={TONES[p.status]}>{LABELS[p.status]}</StatusPill>
              </AppCard>
            ))
          )}
        </QueryState>
      </PageBody>
    </AppPage>
  );
};

export default EarningsSummaryPage;
