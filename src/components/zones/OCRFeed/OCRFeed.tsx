'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { RefreshCw, Plus } from 'lucide-react';
import { OCRRecord } from '@/types/dashboard';
import { OCRFilterPills } from './OCRFilterPills';
import { OCRFeedItem } from './OCRFeedItem';

export const OCRFeed: React.FC = () => {
  const { ocrFeed, sentimentFilter, setSentimentFilter, insertSampleOCR } = useDashboardStore();

  const filteredFeed = ocrFeed.filter((item) => {
    if (sentimentFilter === 'All') return true;
    return item.sentiment === sentimentFilter;
  });

  const handleInsertSample = () => {
    const newRecord: OCRRecord = {
      id: `ocr-${Date.now()}`,
      source: 'Saamana',
      timestamp: 'Apr 27, 2025 14:05',
      headline: 'मुंबई मेट्रो ३ च्या कामाचा आढावा',
      district: 'Mumbai',
      sentiment: 'Positive',
      confidence: 0.94,
      latency: '1m',
    };
    insertSampleOCR(newRecord);
  };

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-primary">OCR Media Ingestion Feed</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-content-muted">
            <RefreshCw className="w-3 h-3" />
            <span>Last updated: 14:32</span>
          </div>
          <button
            onClick={handleInsertSample}
            className="flex items-center gap-1 px-2 py-0.5 border border-borderLine-standard rounded text-content-primary hover:bg-surface-secondary text-[11px]"
          >
            <Plus className="w-3 h-3" />
            <span>Insert Sample</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Sentiment Filter Pills */}
        <OCRFilterPills
          activeFilter={sentimentFilter}
          onFilterChange={setSentimentFilter}
        />

        {/* Feed List */}
        <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded max-h-72 overflow-y-auto">
          {filteredFeed.map((item) => (
            <OCRFeedItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
