'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { Plus } from 'lucide-react';
import { OCRRecord } from '@/types/dashboard';
import { OCRFilterPills } from './OCRFilterPills';
import { OCRFeedItem } from './OCRFeedItem';

export const OCRFeed: React.FC = () => {
  const { ocrFeed, sentimentFilter, setSentimentFilter, insertSampleOCR, language } = useDashboardStore();
  const t = useTranslation(language);

  const filteredFeed = ocrFeed.filter((item) => {
    if (sentimentFilter === 'All') return true;
    return item.sentiment === sentimentFilter;
  });

  const handleInsertSample = () => {
    const newRecord: OCRRecord = {
      id: `ocr-${Date.now()}`,
      source: 'Saamana',
      timestamp: 'Just now',
      headline: 'मुंबई मेट्रो ३ च्या कामाचा आढावा - मुख्यमंत्र्यांची उच्चस्तरीय बैठक',
      district: 'Mumbai',
      sentiment: 'Positive',
      confidence: 0.96,
      latency: '45s',
    };
    insertSampleOCR(newRecord);
  };

  return (
    <div className="bg-surface border border-slate-200 border-t-4 border-t-gov-blue rounded-lg flex flex-col shadow-xs overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-gov-blue">
              {t.zone4.zoneLabel}
            </span>
            <h3 className="text-sm font-bold text-gov-primary tracking-tight">
              {t.zone4.title}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {t.zone4.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono">{t.zone4.liveScanBadge}</span>
          </div>
          <button
            onClick={handleInsertSample}
            className="flex items-center gap-1 px-2.5 py-1 border border-gov-blue/40 rounded text-gov-blue hover:bg-blue-50 text-[11px] font-semibold transition-colors shadow-2xs"
            title="Simulate incoming OCR newspaper article"
          >
            <Plus className="w-3 h-3" />
            <span>{t.zone4.simulateBtn}</span>
          </button>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3 flex-1">
        {/* Sentiment Filter Pills */}
        <OCRFilterPills
          activeFilter={sentimentFilter}
          onFilterChange={setSentimentFilter}
        />

        {/* Feed List with smooth scrolling and high contrast */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-y-auto max-h-[460px] bg-slate-50/30">
          {filteredFeed.map((item) => (
            <OCRFeedItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
        <span>{t.zone4.footerStatus}</span>
        <span className="font-mono text-emerald-700 font-semibold">AI Confidence: 94.2%</span>
      </div>
    </div>
  );
};
