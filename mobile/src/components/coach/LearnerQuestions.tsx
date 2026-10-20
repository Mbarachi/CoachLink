import React from 'react';

import { ChoiceChip, FormLabel } from '@/components/ui';
import type { AgeGroup, Level } from '@/types';

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'CHILD', label: 'Children' },
  { value: 'ADULT', label: 'Adults' },
];

const LEVELS: { value: Level; label: string; hint: string }[] = [
  { value: 'BEGINNER', label: 'Beginners', hint: 'Just starting out' },
  { value: 'IMPROVING', label: 'Improvers', hint: 'Know the basics' },
];

const toggle = <T,>(list: T[], value: T) =>
  (list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

/** Both questions answered, which onboarding and the profile editor insist on. */
export const learnersAnswered = (ageGroups: AgeGroup[], levels: Level[]) =>
  ageGroups.length > 0 && levels.length > 0;

interface LearnerQuestionsProps {
  ageGroups: AgeGroup[];
  levels: Level[];
  onAgeGroups: (next: AgeGroup[]) => void;
  onLevels: (next: Level[]) => void;
  labelStyle?: React.CSSProperties;
}

/**
 * Who a coach teaches and from what level. Athletes and parents filter on
 * these, so they are asked when a coach signs up and can be changed later
 * from their profile. Both allow more than one answer.
 */
const LearnerQuestions: React.FC<LearnerQuestionsProps> = ({
  ageGroups, levels, onAgeGroups, onLevels, labelStyle,
}) => (
  <>
    <FormLabel style={labelStyle}>Who do you teach? <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>Pick all that apply</span></FormLabel>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {AGE_GROUPS.map(o => (
        <ChoiceChip
          key={o.value}
          active={ageGroups.includes(o.value)}
          onClick={() => onAgeGroups(toggle(ageGroups, o.value))}
          style={{ padding: '10px 18px' }}
        >{o.label}</ChoiceChip>
      ))}
    </div>

    <FormLabel style={labelStyle}>What level do you teach? <span style={{ color: 'var(--cl-muted-2)', fontWeight: 400 }}>Pick all that apply</span></FormLabel>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {LEVELS.map(o => (
        <ChoiceChip
          key={o.value}
          active={levels.includes(o.value)}
          onClick={() => onLevels(toggle(levels, o.value))}
          style={{ padding: '10px 18px' }}
        >
          {o.label} <span style={{ fontWeight: 400, opacity: 0.75 }}>· {o.hint}</span>
        </ChoiceChip>
      ))}
    </div>
  </>
);

export default LearnerQuestions;
