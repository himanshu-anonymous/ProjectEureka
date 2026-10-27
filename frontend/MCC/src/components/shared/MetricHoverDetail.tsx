'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InformationCircleIcon, CheckBadgeIcon, ScaleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { DASHBOARD_METRIC_METHODOLOGIES, MetricMethodology } from '@/lib/sentimentEngine';
import { useDashboardStore } from '@/stores/dashboardStore';

interface MetricHoverDetailProps {
  methodologyKey?: keyof typeof DASHBOARD_METRIC_METHODOLOGIES;
  customMethodology?: Partial<MetricMethodology>;
  currentValue?: string | number;
  unit?: string;
  targetText?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const MetricHoverDetail: React.FC<MetricHoverDetailProps> = ({
  methodologyKey,
  customMethodology,
  currentValue,
  unit,
  targetText,
  children,
  position = 'bottom',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useDashboardStore();

  const methodology: MetricMethodology =
    (methodologyKey ? DASHBOARD_METRIC_METHODOLOGIES[methodologyKey] : undefined) ||
    ({
      id: 'custom',
      title: customMethodology?.title || 'Metric Calculation & Logic',
      titleMr: customMethodology?.titleMr || 'मापन पद्धती व सूत्र',
      termDefinition: customMethodology?.termDefinition || 'Standard governance metric audited by Directorate of Information.',
      termDefinitionMr: customMethodology?.termDefinitionMr || 'माहिती महासंचालनालयाकडून प्रमाणित प्रशासकीय मापन निर्देशांक.',
      formula: customMethodology?.formula || 'Direct Telemetry Aggregate = Sum(Inputs) / Count',
      weights: customMethodology?.weights,
      calculationExplanation: customMethodology?.calculationExplanation || 'Derived from continuous live event feeds across verified government channels.',
      calculationExplanationMr: customMethodology?.calculationExplanationMr || 'अधिकृत शासन स्रोतांतून थेट मिळालेल्या माहितीच्या आधारे संकलित.',
      targetBenchmark: customMethodology?.targetBenchmark || 'Government Statutory Target: 100% Attainment',
      dataSources: customMethodology?.dataSources || ['Government of Maharashtra DGIPR Telemetry'],
    } as MetricMethodology);

  // Click outside listener to dismiss popup
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
    // Only toggle if the click wasn't inside the popup itself
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block cursor-pointer select-none ${className}`}
      onClick={toggleOpen}
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      aria-label={`${methodology.title} details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }}
    >
      {children}

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 w-80 sm:w-96 p-4 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 text-left transition-all duration-150 animate-in fade-in zoom-in-95 ring-1 ring-slate-900/10 cursor-default ${
            position === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2.5'
              : position === 'bottom'
              ? 'top-full left-1/2 -translate-x-1/2 mt-2.5'
              : position === 'left'
              ? 'right-full top-1/2 -translate-y-1/2 mr-2.5'
              : 'left-full top-1/2 -translate-y-1/2 ml-2.5'
          }`}
          style={{ maxWidth: 'min(92vw, 420px)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5 mb-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <InformationCircleIcon className="w-4 h-4 shrink-0 text-blue-600" />
                <span>{language === 'mr' ? 'मापन पद्धती व पारदर्शक सूत्र' : 'Calculation Methodology & Logic'}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-tight">
                {language === 'mr' ? methodology.titleMr : methodology.title}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {currentValue !== undefined && (
                <div className="text-right bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <div className="text-sm font-mono font-black text-slate-900 leading-none">
                    {currentValue}
                    {unit && <span className="text-xs font-sans text-slate-600 ml-0.5">{unit}</span>}
                  </div>
                  <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                    {targetText || 'Active Value'}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Close"
                aria-label="Close details"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Term Definition */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider block mb-0.5">
              {language === 'mr' ? 'संज्ञा व्याख्या (Term Definition):' : 'Term Definition & Purpose:'}
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-normal">
              {language === 'mr' ? methodology.termDefinitionMr : methodology.termDefinition}
            </p>
          </div>

          {/* Mathematical Formula */}
          <div className="mb-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-900">
            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-sans uppercase font-bold mb-1">
              <ScaleIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{language === 'mr' ? 'गणना सूत्र (Mathematical Formula):' : 'Calculation Formula:'}</span>
            </div>
            <div className="leading-snug text-slate-900 font-semibold break-words">
              {methodology.formula}
            </div>
            {methodology.weights && (
              <div className="text-[10px] text-slate-600 font-sans mt-1.5 pt-1.5 border-t border-slate-200">
                <strong className="text-slate-800">{language === 'mr' ? 'घटक भार: ' : 'Weights: '}</strong>
                {methodology.weights}
              </div>
            )}
          </div>

          {/* Calculation Explanation */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider block mb-0.5">
              {language === 'mr' ? 'कार्यपद्धती व व्युत्पत्ती (Derivation Logic):' : 'Derivation Logic & Step-by-Step Derivation:'}
            </span>
            <p className="text-xs text-slate-800 leading-relaxed">
              {language === 'mr' ? methodology.calculationExplanationMr : methodology.calculationExplanation}
            </p>
          </div>

          {/* Target Benchmark */}
          <div className="mb-2.5 flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium">
            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{methodology.targetBenchmark}</span>
          </div>

          {/* Verified Data Sources */}
          {methodology.dataSources && methodology.dataSources.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider block mb-1">
                {language === 'mr' ? 'प्रमाणित माहिती स्रोत (Audited Data Sources):' : 'Audited & Verified Data Sources:'}
              </span>
              <ul className="text-[10px] text-slate-800 space-y-0.5 list-disc list-inside">
                {methodology.dataSources.slice(0, 3).map((src, i) => (
                  <li key={i} className="truncate">
                    {src}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
