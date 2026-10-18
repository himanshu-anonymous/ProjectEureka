'use client';

import React from 'react';
import { OCRRecord } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  getLocalizedChannel,
  getDistrictName,
  getLocalizedOcrHeadline,
  getLocalizedStatus,
} from '@/lib/dataLocalization';

interface OCRFeedItemProps {
  item: OCRRecord;
}

export const OCRFeedItem: React.FC<OCRFeedItemProps> = ({ item }) => {
  const { language } = useDashboardStore();

  const isPositive = item.sentiment === 'Positive';
  const isNegative = item.sentiment === 'Negative';

  let textColor = 'text-slate-600';
  let dotColor = 'bg-slate-400';

  if (isPositive) {
    textColor = 'text-emerald-700';
    dotColor = 'bg-emerald-600';
  } else if (isNegative) {
    textColor = 'text-rose-700';
    dotColor = 'bg-rose-600';
  }

  const localizedSource = getLocalizedChannel(item.source, language);
  const localizedDistrict = getDistrictName(item.district, language);
  const localizedHeadline = getLocalizedOcrHeadline(item, language);
  const localizedSentiment = getLocalizedStatus(item.sentiment, language);

  return (
    <div className="p-3 hover:bg-white transition-colors text-xs bg-white/70">
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-slate-800 text-xs whitespace-nowrap">
            {localizedSource}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-600 flex items-center gap-1">
            <MaterialIcon name="location_on" size="xs" className="text-slate-400" />
            {localizedDistrict}
          </span>
        </div>
        <span className="font-mono text-slate-500 text-[11px]">{item.timestamp}</span>
      </div>

      <p className="text-slate-900 font-bold text-xs mb-2 leading-relaxed line-clamp-2">
        {localizedHeadline}
      </p>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></span>
          <span>{localizedSentiment}</span>
        </span>

        <div className="flex items-center gap-2 font-mono text-slate-500 text-[10px]">
          <span>{(item.confidence * 100).toFixed(0)}% {language === 'mr' ? 'अचूकता' : 'match'}</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">{item.latency}</span>
        </div>
      </div>
    </div>
  );
};
