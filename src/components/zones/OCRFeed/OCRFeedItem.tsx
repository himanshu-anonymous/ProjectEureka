'use client';

import React from 'react';
import { OCRRecord } from '@/types/dashboard';

interface OCRFeedItemProps {
  item: OCRRecord;
}

export const OCRFeedItem: React.FC<OCRFeedItemProps> = ({ item }) => {
  return (
    <div className="p-3 hover:bg-surface-secondary transition-colors text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-content-primary">{item.source}</span>
        <span className="font-mono text-content-muted text-[11px]">{item.timestamp}</span>
      </div>
      <p className="text-content-primary font-medium text-xs mb-1.5 leading-snug">
        {item.headline}
      </p>
      <div className="flex items-center justify-between text-[11px] text-content-secondary">
        <div className="flex items-center gap-2">
          <span className="font-medium text-content-primary">{item.district}</span>
          <span className="text-content-muted">•</span>
          <span className="font-mono">{item.sentiment}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-content-muted">
          <span>{item.confidence.toFixed(2)}</span>
          <span>{item.latency}</span>
        </div>
      </div>
    </div>
  );
};
