import React from 'react';
import { GarmentType } from '../../types';

interface GarmentThumbnailProps {
  type: GarmentType;
  className?: string;
}

export const GarmentThumbnail: React.FC<GarmentThumbnailProps> = ({
  type,
  className = 'w-12 h-12 rounded-lg',
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center ${className}`}
    >
      {type === 'traditional_thobe' && (
        <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
          {/* Traditional Thobe silhouette */}
          <path
            d="M24 10 L30 14 L36 10 L44 18 L39 24 L38 52 L22 52 L21 24 L16 18 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
          {/* Standing collar (Galab / Qatari / Saudi collar) */}
          <path
            d="M26 10 C26 7 34 7 34 10 L34 14 L26 14 Z"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          {/* Front placket with buttons */}
          <line x1="30" y1="14" x2="30" y2="34" stroke="#cbd5e1" strokeWidth="1.2" />
          <circle cx="30" cy="18" r="1" fill="#64748b" />
          <circle cx="30" cy="24" r="1" fill="#64748b" />
          <circle cx="30" cy="30" r="1" fill="#64748b" />
          {/* Subtle chest pocket line */}
          <line x1="23" y1="22" x2="27" y2="22" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      )}

      {type === 'formal_shirt' && (
        <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
          {/* Dress shirt */}
          <path
            d="M22 12 L30 16 L38 12 L46 20 L40 26 L38 48 L22 48 L20 26 L14 20 Z"
            fill="#3b82f6"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          {/* Shirt collar */}
          <path
            d="M24 12 L30 20 L36 12 L30 15 Z"
            fill="#eff6ff"
            stroke="#1d4ed8"
            strokeWidth="1.2"
          />
          {/* Placket */}
          <line x1="30" y1="18" x2="30" y2="48" stroke="#1d4ed8" strokeWidth="1.2" />
          <circle cx="30" cy="24" r="1" fill="#ffffff" />
          <circle cx="30" cy="32" r="1" fill="#ffffff" />
          <circle cx="30" cy="40" r="1" fill="#ffffff" />
        </svg>
      )}

      {type === 'luxury_blazer' && (
        <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
          {/* Blazer jacket */}
          <path
            d="M20 12 L30 16 L40 12 L48 22 L42 50 L18 50 L12 22 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          {/* Lapels */}
          <path
            d="M20 12 L26 28 L30 38 L34 28 L40 12"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1.2"
          />
          {/* Tie or shirt hint */}
          <polygon points="30,18 28,30 30,34 32,30" fill="#f8fafc" />
          {/* Brass button */}
          <circle cx="30" cy="40" r="1.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
          {/* Breast pocket */}
          <line x1="22" y1="26" x2="25" y2="26" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
};
