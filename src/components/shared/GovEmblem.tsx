'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';

interface GovEmblemProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  alt?: string;
  variant?: 'default' | 'badge' | 'header';
}

export const GovEmblem: React.FC<GovEmblemProps> = ({
  size = 'md',
  showText = false,
  className = '',
  alt,
  variant = 'default',
}) => {
  const { language } = useDashboardStore();

  const dimensionMap = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const pixelMap = {
    xs: 24,
    sm: 28,
    md: 36,
    lg: 56,
    xl: 80,
  };

  const isBadge = variant === 'badge';
  const defaultAlt = language === 'mr' ? 'महाराष्ट्र शासन राजमुद्रा' : 'Government of Maharashtra Seal';
  const titleText = language === 'mr' ? 'महाराष्ट्र शासन' : 'Government of Maharashtra';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Government of Maharashtra Seal Motif (MAHAGOV_ICON.svg) */}
      <div
        className={
          isBadge
            ? 'bg-amber-50/90 border border-amber-200/80 p-2 rounded-full shadow-xs flex items-center justify-center shrink-0'
            : `${dimensionMap[size]} shrink-0 rounded-full flex items-center justify-center bg-white/5 p-1 border border-amber-500/20 shadow-xs`
        }
        title={titleText}
      >
        <img
          src="/MAHAGOV_ICON.svg"
          alt={alt || defaultAlt}
          width={pixelMap[size]}
          height={pixelMap[size]}
          className={`${dimensionMap[size]} object-contain filter drop-shadow-xs`}
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
            <span>{language === 'mr' ? 'महाराष्ट्र शासन' : 'GOVERNMENT OF MAHARASHTRA'}</span>
            <span className="text-[10px] font-normal text-amber-400/90">
              {language === 'mr' ? '• माहिती व जनसंपर्क' : '• DGIPR'}
            </span>
          </div>
          <div className="text-[10px] text-slate-300 font-medium">
            {language === 'mr'
              ? 'माहिती व जनसंपर्क महासंचालनालय'
              : 'Directorate General of Information & Public Relations'}
          </div>
        </div>
      )}
    </div>
  );
};

export default GovEmblem;
