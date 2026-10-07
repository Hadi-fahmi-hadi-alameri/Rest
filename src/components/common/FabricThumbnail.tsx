import React from 'react';

interface FabricThumbnailProps {
  flag?: string;
  type?: 'white' | 'silk_navy' | 'wool_navy' | 'swiss_white' | 'cream' | string;
  className?: string;
}

export const FabricThumbnail: React.FC<FabricThumbnailProps> = ({
  flag,
  type = 'white',
  className = 'w-14 h-12 rounded-lg',
}) => {
  const getGradient = () => {
    switch (type) {
      case 'silk_navy':
      case 'KR':
        return 'from-slate-900 via-blue-950 to-indigo-950';
      case 'wool_navy':
      case 'UK':
        return 'from-slate-800 via-slate-900 to-indigo-950';
      case 'cream':
      case 'SA':
        return 'from-amber-100 via-stone-100 to-orange-50';
      case 'swiss_white':
      case 'CH':
        return 'from-slate-100 via-white to-blue-50';
      case 'white':
      case 'JP':
      default:
        return 'from-white via-slate-100 to-slate-200';
    }
  };

  const isDark = type === 'silk_navy' || type === 'wool_navy' || flag === 'UK' || flag === 'KR';

  return (
    <div
      className={`relative overflow-hidden border border-slate-200/90 shadow-2xs flex items-center justify-center bg-gradient-to-br ${getGradient()} ${className}`}
    >
      {/* Fabric bolt roll vector illustration */}
      <svg
        viewBox="0 0 60 44"
        className="w-full h-full p-1 opacity-90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bolt cylinder */}
        <ellipse
          cx="16"
          cy="22"
          rx="9"
          ry="15"
          fill={isDark ? '#1e293b' : '#f8fafc'}
          stroke={isDark ? '#475569' : '#cbd5e1'}
          strokeWidth="1.2"
        />
        <ellipse
          cx="16"
          cy="22"
          rx="5"
          ry="9"
          fill={isDark ? '#0f172a' : '#e2e8f0'}
        />
        <circle cx="16" cy="22" r="2.5" fill={isDark ? '#334155' : '#94a3b8'} />

        {/* Unrolled fabric body */}
        <path
          d="M16 7 L48 9 C54 9.5 56 14 56 22 C56 30 54 34.5 48 35 L16 37 Z"
          fill={isDark ? '#1e293b' : '#ffffff'}
          stroke={isDark ? '#475569' : '#cbd5e1'}
          strokeWidth="1.2"
        />

        {/* Fabric Weave Lines */}
        <path
          d="M24 10 L24 34 M32 10 L32 34 M40 10 L40 34 M48 10 L48 34"
          stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        {/* Fabric Sheen highlight */}
        <path
          d="M18 12 Q34 14 50 14"
          stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Origin country badge */}
      {flag && (
        <span
          className={`absolute bottom-1 right-1 text-[9px] font-bold px-1 py-0.2 rounded-xs shadow-2xs ${
            isDark ? 'bg-slate-800/90 text-slate-200' : 'bg-white/90 text-slate-700'
          }`}
        >
          {flag}
        </span>
      )}
    </div>
  );
};
