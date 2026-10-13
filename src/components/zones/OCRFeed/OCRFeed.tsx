'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { RefreshCw, Plus } from 'lucide-react';
import { OCRRecord } from '@/types/dashboard';

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
        <div className="flex gap-1.5 text-xs">
          {['All', 'Positive', 'Negative', 'Neutral'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSentimentFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sentimentFilter === filter
                  ? 'bg-action-primary text-content-inverse'
                  : 'bg-surface-secondary text-content-secondary hover:bg-surface-selected hover:text-content-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Feed List */}
        <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded max-h-72 overflow-y-auto">
          {filteredFeed.map((item) => (
            <div key={item.id} className="p-3 hover:bg-surface-secondary transition-colors text-xs">
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
          ))}
        </div>
      </div>
    </div>
  );
};
