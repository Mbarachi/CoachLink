import React from 'react';

/**
 * The gold star that sits beside a numeric rating.
 *
 * A component rather than a bare ★ in each string, because the character
 * inherits whatever colour its container has — which made it dark brown on a
 * coach card, cream on the dashboard's ink tile and gold only inside
 * StarRating. One star, one colour, everywhere.
 */
const RatingStar: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <span aria-hidden style={{ color: 'var(--cl-star)', ...style }}>★</span>
);

export default RatingStar;
