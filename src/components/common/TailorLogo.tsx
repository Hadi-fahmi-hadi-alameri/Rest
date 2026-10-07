import React from 'react';

interface TailorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const TailorLogo: React.FC<TailorLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200/80 shadow-xs p-1 select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`${sizeClasses} text-blue-600`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Dashed Measuring Tape Ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          className="opacity-70"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="#93c5fd"
          strokeWidth="1.2"
        />

        {/* Tailor Scissors */}
        <g stroke="#1d4ed8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Scissors handles */}
          <circle cx="36" cy="66" r="8" fill="#eff6ff" />
          <circle cx="64" cy="66" r="8" fill="#eff6ff" />
          {/* Blades intersecting */}
          <line x1="42" y1="60" x2="62" y2="28" />
          <line x1="58" y1="60" x2="38" y2="28" />
          {/* Pivot rivet */}
          <circle cx="50" cy="46" r="2.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        </g>

        {/* Sewing Needle through scissors */}
        <path
          d="M50 16 L50 40"
          stroke="#b45309"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Needle Eye */}
        <ellipse cx="50" cy="20" rx="1.2" ry="2.5" fill="white" stroke="#b45309" strokeWidth="0.8" />
        
        {/* Golden Thread wave */}
        <path
          d="M50 20 Q56 24 53 32 Q49 38 52 44"
          stroke="#f59e0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Text banner curve */}
        <path
          id="textPath"
          d="M 24 54 A 30 30 0 0 0 76 54"
          fill="none"
        />
        <text
          fontSize="7"
          fontWeight="700"
          fill="#1e3a8a"
          letterSpacing="1.5"
          textAnchor="middle"
        >
          <textPath href="#textPath" startOffset="50%">
            TAILOR SHOP
          </textPath>
        </text>
      </svg>
    </div>
  );
};
