import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AppCard: React.FC<AppCardProps> = ({
  children,
  onClick,
  selected = false,
  className = '',
  style = {},
}) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      background: 'var(--cl-surface)',
      borderRadius: 16,
      padding: 16,
      border: `2px solid ${selected ? 'var(--cl-primary)' : 'var(--cl-border)'}`,
      boxShadow: selected
        ? '0 0 0 3px rgba(111,207,151,0.2)'
        : '0 1px 4px rgba(0,0,0,0.06)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      ...style,
    }}
  >
    {children}
  </div>
);

export default AppCard;
