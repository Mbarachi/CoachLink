import React from 'react';

interface FormLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const FormLabel: React.FC<FormLabelProps> = ({ children, style }) => (
  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cl-ink)', marginBottom: 7, display: 'block', ...style }}>
    {children}
  </label>
);

export default FormLabel;
