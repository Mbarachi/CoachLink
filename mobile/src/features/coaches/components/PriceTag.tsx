import React from 'react';

interface PriceTagProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
}

const formatNGN = (n: number) =>
  '₦' + n.toLocaleString('en-NG') + ' / session';

const PriceTag: React.FC<PriceTagProps> = ({ amount, size = 'sm' }) => {
  const fontSize = size === 'lg' ? 20 : size === 'md' ? 16 : 13;
  const weight = size === 'lg' ? 700 : 600;

  return (
    <span
      style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize,
        fontWeight: weight,
        color: 'var(--cl-primary)',
      }}
    >
      {formatNGN(amount)}
    </span>
  );
};

export default PriceTag;
