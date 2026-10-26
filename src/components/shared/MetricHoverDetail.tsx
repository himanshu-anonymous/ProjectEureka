'use client';

import React, { useState, useRef, useEffect } from 'react';
import { InformationCircleIcon, CheckBadgeIcon, ScaleIcon } from '@heroicons/react/20/solid';
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
  position = 'top',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className={`relative inline-block cursor-help ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="tooltip"
      aria-label={`${methodology.title} details`}
    >
      {children}

      {isOpen && (
        <div
          className={`absolute z-50 w-80 sm:w-96 p-4 bg-slate-900/98 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 text-left transition-all duration-200 pointer-events-none animate-fadeIn ${
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
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/70 pb-2.5 mb-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <InformationCircleIcon className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{language === 'mr' ? 'मापन पद्धती व पारदर्शक सूत्र' : 'Calculation Methodology & Logic'}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 leading-tight">
                {language === 'mr' ? methodology.titleMr : methodology.title}
              </h4>
            </div>

            {currentValue !== undefined && (
              <div className="shrink-0 text-right bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
                <div className="text-sm font-mono font-black text-amber-300 leading-none">
                  {currentValue}
                  {unit && <span className="text-xs font-sans text-slate-300 ml-0.5">{unit}</span>}
                </div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                  {targetText || 'Active Value'}
                </div>
              </div>
            )}
          </div>

          {/* Term Definition */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-0.5">
              {language === 'mr' ? 'संज्ञा व्याख्या (Term Definition):' : 'Term Definition & Purpose:'}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {language === 'mr' ? methodology.termDefinitionMr : methodology.termDefinition}
            </p>
          </div>

          {/* Mathematical Formula */}
          <div className="mb-2.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-200">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans uppercase font-bold mb-1">
              <ScaleIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{language === 'mr' ? 'गणना सूत्र (Mathematical Formula):' : 'Calculation Formula:'}</span>
            </div>
            <div className="leading-snug text-amber-300 font-semibold break-words">
              {methodology.formula}
            </div>
            {methodology.weights && (
              <div className="text-[10px] text-slate-400 font-sans mt-1.5 pt-1.5 border-t border-slate-800/80">
                <strong className="text-slate-300">{language === 'mr' ? 'घटक भार: ' : 'Weights: '}</strong>
                {methodology.weights}
              </div>
            )}
          </div>

          {/* Calculation Explanation */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-0.5">
              {language === 'mr' ? 'कार्यपद्धती व व्युत्पत्ती (Derivation Logic):' : 'Derivation Logic & Step-by-Step Derivation:'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'mr' ? methodology.calculationExplanationMr : methodology.calculationExplanation}
            </p>
          </div>

          {/* Target Benchmark */}
          <div className="mb-2.5 flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/60 font-medium">
            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{methodology.targetBenchmark}</span>
          </div>

          {/* Verified Data Sources */}
          {methodology.dataSources && methodology.dataSources.length > 0 && (
            <div className="pt-2 border-t border-slate-700/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                {language === 'mr' ? 'प्रमाणित माहिती स्रोत (Audited Data Sources):' : 'Audited & Verified Data Sources:'}
              </span>
              <ul className="text-[10px] text-slate-300 space-y-0.5 list-disc list-inside">
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
