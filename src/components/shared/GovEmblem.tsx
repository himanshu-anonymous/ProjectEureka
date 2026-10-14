'use client';

import React from 'react';

interface GovEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const GovEmblem: React.FC<GovEmblemProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const dimensionMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Government of Maharashtra Seal Motif (Shivmudra & Ashoka Emblem Silhouette) */}
      <div
        className={`${dimensionMap[size]} shrink-0 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-[1.5px] shadow-sm flex items-center justify-center`}
        title="Government of Maharashtra — महाराष्ट्र शासन"
      >
        <div className="w-full h-full rounded-full bg-[#1B2A4A] flex items-center justify-center border border-amber-400/40 relative overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-[85%] h-[85%] text-amber-400 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer dotted ornamental ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" />
            
            {/* Inner octagon representing the Royal Seal / Rajmudra */}
            <polygon
              points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            
            {/* Devanagari "म" and "शा" or Stylized Royal Seal Centerpiece */}
            <path
              d="M34 38 L34 62 M34 48 L46 48 L46 62 M46 38 L54 38 L54 62"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M58 42 Q66 38 68 46 Q70 54 60 56 L68 62"
              stroke="#F59E0B"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Star insignia at base */}
            <polygon points="50,67 52,72 57,72 53,75 55,80 50,77 45,80 47,75 43,72 48,72" fill="#F59E0B" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>महाराष्ट्र शासन</span>
            <span className="text-[10px] font-normal text-amber-400/90">• Govt. of Maharashtra</span>
          </div>
          <div className="text-[10px] text-slate-300 font-medium">
            माहिती व जनसंपर्क महासंचालनालय (DGIPR)
          </div>
        </div>
      )}
    </div>
  );
};
