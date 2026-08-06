import React from 'react';

import FormLabel from './FormLabel';
import { fieldStyle } from './inputStyles';

interface AppSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  labelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const AppSelect: React.FC<AppSelectProps> = ({ label, value, onChange, options, labelStyle, style }) => (
  <>
    {label && <FormLabel style={labelStyle}>{label}</FormLabel>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ ...fieldStyle, padding: '0 12px', ...style }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </>
);

export default AppSelect;
