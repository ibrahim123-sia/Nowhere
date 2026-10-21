import React from "react";

const Star = ({ fill, size }) => (
  <svg viewBox="0 0 20 20" className={size} aria-hidden="true">
    <defs>
      <linearGradient id={`star-${fill}`}>
        <stop offset={`${fill}%`} stopColor="currentColor" />
        <stop offset={`${fill}%`} stopColor="#d6d3d1" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#star-${fill})`}
      d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.76 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.78.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"
    />
  </svg>
);

// Star rating with partial stars, e.g. 4.5 -> four and a half stars.
const Rating = ({ value = 0, count, size = "h-4 w-4", showValue = false, className = "" }) => {
  const stars = [0, 1, 2, 3, 4].map((i) => Math.round(Math.min(Math.max(value - i, 0), 1) * 100));
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex text-amber-500" aria-label={`Rated ${value} out of 5`}>
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} size={size} />
        ))}
      </div>
      {showValue && <span className="text-sm font-semibold text-ink">{Number(value).toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-ink-muted">({count})</span>}
    </div>
  );
};

export default Rating;
