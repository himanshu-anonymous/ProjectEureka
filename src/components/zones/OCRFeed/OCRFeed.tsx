'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { getDistrictName } from '@/lib/dataLocalization';
import { OCRFilterPills } from './OCRFilterPills';
import { OCRFeedItem } from './OCRFeedItem';

export const OCRFeed: React.FC = () => {
  const {
    ocrFeed,
    sentimentFilter,
    setSentimentFilter,
    insertSampleOcrApi,
    language,
    selectedDistrictId,
    setSelectedDistrictId,
    districts,
  } = useDashboardStore();
  const t = useTranslation(language);

  // Active district resolution
  const activeDistrictObj =
    districts.find((d) => d.id === selectedDistrictId) ||
    districts[0] || { id: 'palghar', name: 'Palghar' };
  const activeDistrictName = activeDistrictObj.name;
  const localizedDistrictName = getDistrictName(activeDistrictName, language);

  const [filterBySelectedDistrict, setFilterBySelectedDistrict] = useState<boolean>(false);
  const [autoStream, setAutoStream] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Auto-stream simulation effect
  useEffect(() => {
    if (!autoStream) return;

    const timer = setInterval(async () => {
      setIsSimulating(true);
      await insertSampleOcrApi(activeDistrictName);
      setTimeout(() => setIsSimulating(false), 800);
    }, 4500);

    return () => clearInterval(timer);
  }, [autoStream, activeDistrictName, insertSampleOcrApi]);

  const handleManualSimulate = async () => {
    setIsSimulating(true);
    await insertSampleOcrApi(activeDistrictName);
    setTimeout(() => setIsSimulating(false), 800);
  };

  const filteredFeed = ocrFeed.filter((item) => {
    const matchesSentiment =
      sentimentFilter === 'All' ? true : item.sentiment === sentimentFilter;
    const matchesDistrict = filterBySelectedDistrict
      ? item.district.toLowerCase() === activeDistrictName.toLowerCase()
      : true;
    return matchesSentiment && matchesDistrict;
  });

  const districtItemCount = ocrFeed.filter(
    (item) => item.district.toLowerCase() === activeDistrictName.toLowerCase()
  ).length;

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gov-primary tracking-tight">
              {t.zone4.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>
                {filterBySelectedDistrict
                  ? `${localizedDistrictName} ${language === 'mr' ? 'थेट प्रवाह' : 'Wire'}`
                  : language === 'mr'
                  ? 'राज्यव्यापी थेट प्रवाह (५ जिल्हे)'
                  : 'Statewide Wire (5 Districts)'}
              </span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {filterBySelectedDistrict
              ? (language === 'mr'
                  ? `${localizedDistrictName} थेट ओसीआर व डिजिटल वृत्त प्रवाह`
                  : `Live OCR & Digital Ingestion for ${activeDistrictName}`)
              : (language === 'mr'
                  ? 'सर्व ५ जिल्ह्यांचा थेट ओसीआर व राज्य नेटवर्क प्रवाह'
                  : `Live OCR & Digital Ingestion for All 5 Districts & State Network`)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setAutoStream(!autoStream)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition-colors shadow-2xs cursor-pointer ${
              autoStream
                ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title={autoStream ? (language === 'mr' ? 'प्रवाह थांबवा' : 'Pause live wire simulation') : (language === 'mr' ? 'स्वयंचलित प्रवाह सुरू करा' : 'Start automated wire simulation')}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${autoStream ? 'bg-white' : 'bg-slate-400'}`} />
            <span>
              {autoStream
                ? (language === 'mr' ? 'स्वयंचलित प्रवाह: सुरू' : 'Auto Stream: ON')
                : (language === 'mr' ? 'स्वयंचलित प्रवाह: बंद' : 'Auto Stream: OFF')}
            </span>
          </button>

          <button
            type="button"
            onClick={handleManualSimulate}
            disabled={isSimulating}
            className={`flex items-center gap-1 px-2.5 py-1 border rounded text-[11px] font-semibold transition-all shadow-2xs cursor-pointer ${
              isSimulating
                ? 'bg-amber-100 border-amber-400 text-amber-900 scale-95'
                : 'border-gov-blue/40 text-gov-blue hover:bg-blue-50'
            }`}
            title={filterBySelectedDistrict
              ? (language === 'mr' ? `${localizedDistrictName} साठी बातमी इनपुट करा` : `Simulate incoming wire article for ${activeDistrictName}`)
              : (language === 'mr' ? 'राज्यव्यापी बातमी इनपुट करा' : 'Simulate incoming statewide wire article')}
          >
            <MaterialIcon name="add" size="xs" />
            <span>
              {isSimulating
                ? (language === 'mr' ? 'समाविष्ट होत आहे…' : 'Ingesting…')
                : filterBySelectedDistrict
                ? (language === 'mr' ? `+ थेट प्रवाह: ${localizedDistrictName}` : `+ Wire: ${activeDistrictName}`)
                : (language === 'mr' ? '+ थेट प्रवाह: सर्व जिल्हे' : '+ Wire: All Districts')}
            </span>
          </button>
        </div>
      </div>

      {/* District Simulation Flow Control Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* District Filter Scope Toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-500 font-medium">{language === 'mr' ? 'व्याप्ती:' : 'Scope:'}</span>
          <button
            type="button"
            onClick={() => setFilterBySelectedDistrict(false)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
              !filterBySelectedDistrict
                ? 'bg-gov-primary text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'mr' ? `सर्व जिल्हे (${ocrFeed.length})` : `All Districts (${ocrFeed.length})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterBySelectedDistrict(true)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
              filterBySelectedDistrict
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'mr' ? `फक्त ${localizedDistrictName} (${districtItemCount})` : `${activeDistrictName} Only (${districtItemCount})`}
          </button>
        </div>

        {/* Quick District Selector Chips */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
          {districts.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDistrictId(d.id)}
              className={`px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                d.id === selectedDistrictId
                  ? 'bg-slate-800 text-amber-300 font-bold border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3 flex-1">
        {/* Sentiment Filter Pills */}
        <OCRFilterPills
          activeFilter={sentimentFilter}
          onFilterChange={setSentimentFilter}
        />

        {/* Feed List with smooth scrolling and high contrast */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-y-auto max-h-[440px] bg-slate-50/30">
          {filteredFeed.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 space-y-2">
              <MaterialIcon name="newspaper" size="md" className="mx-auto text-slate-400" />
              {language === 'mr' ? (
                <p><strong>{localizedDistrictName}</strong> साठी कोणतीही बातमी उपलब्ध नाही.</p>
              ) : (
                <p>No clippings matching filter for <strong>{activeDistrictName}</strong>.</p>
              )}
              <button
                type="button"
                onClick={handleManualSimulate}
                className="px-3 py-1 bg-gov-primary text-white rounded text-xs font-semibold cursor-pointer"
              >
                {language === 'mr' ? `+ ${localizedDistrictName} साठी नमुना बातमी जोडा` : `+ Ingest Sample News for ${activeDistrictName}`}
              </button>
            </div>
          ) : (
            filteredFeed.map((item) => (
              <OCRFeedItem key={item.id} item={item} />
            ))
          )}
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${autoStream ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          <span>{autoStream ? (language === 'mr' ? `${localizedDistrictName} थेट बातमी प्रवाह सुरू आहे` : `Simulating ${activeDistrictName} incoming wire`) : t.zone4.footerStatus}</span>
        </span>
        <span className="font-mono text-emerald-700 font-semibold">{language === 'mr' ? 'एआय अचूकता: ९४.२%' : 'AI Confidence: 94.2%'}</span>
      </div>
    </div>
  );
};
