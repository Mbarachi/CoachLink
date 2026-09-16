import React from 'react';

import { getErrorMessage, isBackendUnreachable } from '@/lib/apiError';

import AppButton from './AppButton';
import EmptyIllustration from './EmptyIllustration';
import Spinner from './Spinner';

const Centered: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '52px 24px' }}>
    {children}
  </div>
);

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <Centered>
    <Spinner size={26} />
    <p style={{ fontSize: 13.5, color: 'var(--cl-muted-1)', margin: '14px 0 0' }}>{label}</p>
  </Centered>
);

export const ErrorState: React.FC<{ error: unknown; onRetry?: () => void }> = ({ error, onRetry }) => (
  <Centered>
    <EmptyIllustration name="unbuilt" size={100} />
    <h3 style={{ fontFamily: 'var(--cl-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--cl-ink)', margin: '14px 0 0' }}>
      {isBackendUnreachable(error) ? "Can't reach the server" : 'Something went wrong'}
    </h3>
    <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--cl-muted-1)', margin: '7px 0 0', maxWidth: 280 }}>
      {isBackendUnreachable(error)
        ? 'Check your connection and try again.'
        : getErrorMessage(error, 'We could not load this right now.')}
    </p>
    {onRetry && (
      <AppButton variant="ink" onClick={onRetry} style={{ marginTop: 20, width: 'auto', padding: '0 26px' }}>
        Try again
      </AppButton>
    )}
  </Centered>
);

interface QueryStateProps {
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
  loadingLabel?: string;
  children: React.ReactNode;
}

/** Renders loading and error for a query, or the children once it has settled. */
const QueryState: React.FC<QueryStateProps> = ({ isLoading, error, onRetry, loadingLabel, children }) => {
  if (isLoading) return <LoadingState label={loadingLabel} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  return <>{children}</>;
};

export default QueryState;
