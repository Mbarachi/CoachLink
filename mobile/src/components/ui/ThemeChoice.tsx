import React from 'react';

import { useThemeStore, type ThemeMode } from '@/store/theme.store';

const OPTIONS: ReadonlyArray<{ mode: ThemeMode; label: string }> = [
  { mode: 'system', label: 'System' },
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
];

interface ThemeChoiceProps {
  /** Matches ListRow: drops the divider on the last row of a group. */
  last?: boolean;
}

/**
 * Appearance picker for the grouped Settings lists.
 *
 * A segmented control rather than a Toggle row because "follow my phone" is a
 * real third state, and it is the default — a binary switch would silently
 * commit everyone to a choice they never made, and then ignore the OS when it
 * flips at sunset.
 */
const ThemeChoice: React.FC<ThemeChoiceProps> = ({ last }) => {
  const mode = useThemeStore((s) => s.mode);
  const resolved = useThemeStore((s) => s.resolved);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <div style={{
      padding: '14px 15px',
      borderBottom: last ? 'none' : '1px solid var(--cl-subtle)',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--cl-ink)' }}>Appearance</span>

      <div style={{
        display: 'flex', gap: 5, marginTop: 11,
        background: 'var(--cl-subtle)', borderRadius: 12, padding: 4,
      }}>
        {OPTIONS.map((option) => {
          const active = mode === option.mode;
          return (
            <button
              key={option.mode}
              type="button"
              onClick={() => setMode(option.mode)}
              style={{
                flex: 1, border: 'none', cursor: 'pointer',
                padding: '9px 0', borderRadius: 9,
                fontFamily: 'var(--cl-font-body)', fontWeight: 700, fontSize: 13,
                background: active ? 'var(--cl-ink-fill)' : 'transparent',
                color: active ? 'var(--cl-accent)' : 'var(--cl-muted-3)',
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {mode === 'system' && (
        <div style={{ fontSize: 11.5, color: 'var(--cl-muted-2)', marginTop: 8 }}>
          Following your device — {resolved} right now.
        </div>
      )}
    </div>
  );
};

export default ThemeChoice;
