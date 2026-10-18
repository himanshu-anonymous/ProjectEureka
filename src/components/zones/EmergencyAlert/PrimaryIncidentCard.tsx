'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IncidentData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  ArrowUpRightIcon,
  ArrowRightIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ServerStackIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';
import {
  getDistrictName,
  getLocalizedChannel,
  getLocalizedStatus,
  getLocalizedIncidentSummary,
} from '@/lib/dataLocalization';

interface PrimaryIncidentCardProps {
  incident: IncidentData;
  canAuthorize: boolean;
  onAuthorize: (id: string) => void;
}

export const PrimaryIncidentCard: React.FC<PrimaryIncidentCardProps> = ({
  incident,
  canAuthorize,
  onAuthorize,
}) => {
  const pathname = usePathname();
  const isCrisisRoute = pathname === '/crisis';
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  const [showEvidence, setShowEvidence] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safeguard #3: Reset drawer toggle states when active incident changes
  useEffect(() => {
    setShowEvidence(false);
    setShowTimeline(false);
  }, [incident.id]);

  const handleAuthorizeClick = async () => {
    setIsSubmitting(true);
    await onAuthorize(incident.id);
    setIsSubmitting(false);
  };

  const localizedSeverity = getLocalizedStatus(incident.severity, language);
  const localizedDistrict = getDistrictName(incident.district, language);
  const localizedSummary = getLocalizedIncidentSummary(incident, language);
  const localizedSource = getLocalizedChannel(incident.source, language);
  const localizedStatus = incident.verificationStatus;

  const defaultUrl = incident.url || 'https://x.com/MahaDGIPR';

  // Shared Inline Citation Trail (No pill boxes, middot-separated)
  const renderCoverageSources = (iconSize = 'w-3 h-3') => {
    if (!incident.sources || incident.sources.length === 0) return null;
    return (
      <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5 flex-wrap">
        <span className="text-slate-500 font-semibold text-[11px]">
          {language === 'mr' ? 'प्रसिद्धी कव्हरेज:' : 'Coverage:'}
        </span>
        {incident.sources.map((src, idx) => (
          <React.Fragment key={src.name}>
            {idx > 0 && <span className="text-slate-300 select-none">·</span>}
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-slate-700 hover:text-rose-600 inline-flex items-center gap-0.5 transition-colors whitespace-nowrap"
              title={`${src.name} coverage`}
            >
              <span>{language === 'mr' ? (src.nameMr || src.name) : src.name}</span>
              <ArrowUpRightIcon className={`${iconSize} shrink-0`} />
            </a>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Shared Evidence Drawer
  const renderEvidenceDrawer = () => {
    if (!showEvidence) return null;
    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 mt-2">
        <div className="flex items-center justify-between text-slate-700 font-bold">
          <span className="flex items-center gap-1.5">
            <ServerStackIcon className="w-4 h-4 text-gov-primary shrink-0" />
            <span>{language === 'mr' ? 'थेट प्रणाली दूरमिती पुरावा' : 'Automated Telemetry & Source Evidence'}</span>
          </span>
          <span className="text-xs font-mono text-emerald-700 font-semibold whitespace-nowrap">
            {language === 'mr' ? 'विश्वसनीयता: ९६%' : 'Credibility: 96%'}
          </span>
        </div>
        {language === 'mr' ? (
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {incident.district} मधील पाणी दूषित असल्याचा मेसेज स्वयंचलित पाइपलाइनने चिन्हांकित केला. सार्वजनिक आरोग्य प्रयोगशाळा दूरमिती अहवाल #PH-2026-904 नुसार पाण्याचे नमुने १००% सुरक्षित असल्याचे निष्पन्न झाले.
          </p>
        ) : (
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Automated ingestion pipeline flagged unverified message regarding {incident.district} public utilities.
            Direct telemetry cross-reference with District Laboratory report #PH-2026-904 confirmed safety standards are compliant.
          </p>
        )}
        <div className="text-[10px] font-semibold text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
          <span>
            {language === 'mr'
              ? 'अंतर्ग्रहण विलंब: २.१ मिनिटे • पाइपलाइन स्थिती: सक्रिय'
              : 'Ingestion Latency: 2.1m • Pipeline Status: Synced'}
          </span>
          <Link
            href="/system-monitoring"
            className="text-gov-blue hover:underline font-bold inline-flex items-center gap-1"
          >
            <span>{language === 'mr' ? 'थेट प्रणाली निरीक्षण' : 'Live System Monitor'}</span>
            <ArrowRightIcon className="w-3 h-3 shrink-0" />
          </Link>
        </div>
      </div>
    );
  };

  // Shared Timeline Drawer
  const renderTimelineDrawer = () => {
    if (!showTimeline) return null;
    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 mt-2">
        <div className="text-slate-700 font-bold flex items-center gap-1.5">
          <ClockIcon className="w-4 h-4 text-gov-primary shrink-0" />
          <span>{language === 'mr' ? 'स्वयंचलित प्रणाली ऑपरेशन्स कालक्रम' : 'System Operations Timeline & Verification Flow'}</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">10:14 IST</span>
            <span className="text-slate-700">
              {language === 'mr' ? 'कच्चा डेटा अंतर्ग्रहण प्रणालीकडून अफवा चिन्हांकित' : 'Raw Ingestion Pipeline scraped & flagged alert'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">10:45 IST</span>
            <span className="text-slate-700">
              {language === 'mr' ? 'दूरमिती तपासणी पूर्ण; प्रयोगशाळा अहवाल नकारात्मक' : 'System Telemetry matched with negative lab report'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">11:05 IST</span>
            <span className="font-semibold text-rose-700">
              {incident.authorized
                ? (language === 'mr' ? 'अधिकृत खंडन जारी व प्रकाशित' : 'Official Rebuttal Authorized & Published')
                : (language === 'mr' ? 'प्रशासक / जिल्हाधिकारी स्वाक्षरीची प्रतीक्षा' : 'Awaiting Collector / DG Admin authorization')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {isCrisisRoute ? (
        /* WIDE MODE: 12-Column Horizontal Split on /crisis */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-4 bg-rose-50/20 border-b border-slate-200/80">
          {/* Left 8 Columns: Telemetry, Claim, Citations */}
          <div className="lg:col-span-8 space-y-2 min-w-0">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-mono font-bold text-slate-800 text-xs">
                {incident.id}
              </span>
              <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-pulse shrink-0" />
                <span>
                  {localizedSeverity} {t.zone5.threatLabel}
                </span>
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {t.zone5.districtPrefix} {localizedDistrict}
              </span>
            </div>

            {/* Clickable Claim Headline */}
            <div>
              <a
                href={defaultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-slate-900 leading-snug hover:text-gov-blue hover:underline inline-flex items-center gap-1 group"
                title={language === 'mr' ? 'मूळ स्त्रोत उघडा' : 'Open original publisher source'}
              >
                <span>{localizedSummary}</span>
                <ArrowUpRightIcon className="w-4 h-4 text-slate-400 group-hover:text-gov-blue shrink-0" />
              </a>
            </div>

            {/* Inline Coverage Citations */}
            {renderCoverageSources('w-3.5 h-3.5')}

            {/* Primary Source & Verified Status */}
            <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap pt-0.5">
              <span>
                {language === 'mr' ? 'प्राथमिक स्त्रोत:' : 'Primary:'}{' '}
                <strong className="text-slate-800">{localizedSource}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                <span className="text-slate-700 font-medium">{localizedStatus}</span>
              </span>
            </div>
          </div>

          {/* Right 4 Columns: Structured Action Cluster */}
          <div className="lg:col-span-4 flex flex-col gap-2 items-stretch justify-center">
            {canAuthorize ? (
              <button
                type="button"
                onClick={handleAuthorizeClick}
                disabled={incident.authorized || isSubmitting}
                className={`w-full flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer ${
                  incident.authorized
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                    : 'bg-rose-700 hover:bg-rose-800 text-white'
                }`}
              >
                {incident.authorized ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{language === 'mr' ? 'खंडन जारी केले' : 'Rebuttal Dispatched'}</span>
                  </>
                ) : isSubmitting ? (
                  <span>{language === 'mr' ? 'मंजूर करत आहे...' : 'Authorizing...'}</span>
                ) : (
                  <>
                    <ShieldExclamationIcon className="w-4 h-4 shrink-0" />
                    <span>{language === 'mr' ? 'अधिकृत खंडन मंजूर करा' : 'Authorize Official Rebuttal'}</span>
                  </>
                )}
              </button>
            ) : (
              <div
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-300 rounded-lg cursor-not-allowed text-center"
                title={language === 'mr' ? 'केवळ जिल्हाधिकारी किंवा महासंचालक प्रशासकाकडे स्वाक्षरी मंजुरी आहे' : 'Only District Collector or DG State Admin has signing clearance'}
              >
                <LockClosedIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{language === 'mr' ? 'जिल्हाधिकारी मंजुरी आवश्यक' : 'Collector Approval Required'}</span>
              </div>
            )}

            {/* 3 Secondary Inspection Buttons */}
            <div className="grid grid-cols-3 gap-1.5 w-full">
              <Link
                href="/system-monitoring"
                className="flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
                title={language === 'mr' ? 'थेट प्रणाली निरीक्षण उघडा' : 'Open System Monitoring module'}
              >
                <ServerStackIcon className="w-3.5 h-3.5 text-gov-primary shrink-0" />
                <span className="truncate">{language === 'mr' ? 'प्रणाली' : 'Telemetry'}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowEvidence(!showEvidence);
                  setShowTimeline(false);
                }}
                aria-expanded={showEvidence}
                className={`flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium border rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs ${
                  showEvidence
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <DocumentTextIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.zone5.evidenceBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowTimeline(!showTimeline);
                  setShowEvidence(false);
                }}
                aria-expanded={showTimeline}
                className={`flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium border rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs ${
                  showTimeline
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.zone5.timelineBtn}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* COMPACT MODE: Balanced Vertical Stack on Dashboard / Right Rail */
        <div className="p-3.5 space-y-2 border-b border-slate-200/80 bg-rose-50/10">
          {/* 1. Header Metadata: INC-2026-PALGHAR-01 • ● High Threat • District: Palghar */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="font-mono font-bold text-slate-800 text-xs">
              {incident.id}
            </span>
            <span className="text-slate-300 select-none">•</span>
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-pulse shrink-0" />
              <span>
                {localizedSeverity} {t.zone5.threatLabel}
              </span>
            </span>
            <span className="text-slate-300 select-none">•</span>
            <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">
              {t.zone5.districtPrefix} {localizedDistrict}
            </span>
          </div>

          {/* 2. Clickable Claim Headline */}
          <div>
            <a
              href={defaultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-900 leading-snug hover:text-gov-blue hover:underline inline-flex items-center gap-1 group"
              title={language === 'mr' ? 'मूळ स्त्रोत उघडा' : 'Open original publisher source'}
            >
              <span>{localizedSummary}</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-gov-blue shrink-0" />
            </a>
          </div>

          {/* 3. Inline Coverage Citations (Coverage: X / Twitter ↗ · Lokmat ↗ · Sakal ↗) */}
          {renderCoverageSources('w-3 h-3')}

          {/* 4. Primary Source + Status */}
          <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
            <span>
              {language === 'mr' ? 'प्राथमिक:' : 'Primary:'}{' '}
              <strong className="text-slate-800">{localizedSource}</strong>
            </span>
            <span className="text-slate-300 select-none">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span className="text-slate-700 font-medium">{localizedStatus}</span>
            </span>
          </div>

          {/* 5. Single Compact Action Bar Row (Uniform h-7 px-2.5 dimensions across all 4 buttons) */}
          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/system-monitoring"
                className="h-7 px-2.5 text-[11px] font-semibold inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded transition-colors whitespace-nowrap shrink-0"
                title={language === 'mr' ? 'थेट प्रणाली निरीक्षण उघडा' : 'Open System Monitoring module'}
              >
                <ServerStackIcon className="w-3.5 h-3.5 text-gov-primary shrink-0" />
                <span>{language === 'mr' ? 'दूरमिती' : 'Telemetry'}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setShowEvidence(!showEvidence);
                  setShowTimeline(false);
                }}
                aria-expanded={showEvidence}
                className={`h-7 px-2.5 text-[11px] font-semibold inline-flex items-center gap-1 border rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  showEvidence
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <DocumentTextIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{t.zone5.evidenceBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowTimeline(!showTimeline);
                  setShowEvidence(false);
                }}
                aria-expanded={showTimeline}
                className={`h-7 px-2.5 text-[11px] font-semibold inline-flex items-center gap-1 border rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  showTimeline
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{t.zone5.timelineBtn}</span>
              </button>
            </div>

            {canAuthorize ? (
              <button
                type="button"
                onClick={handleAuthorizeClick}
                disabled={incident.authorized || isSubmitting}
                className={`h-7 px-2.5 text-[11px] font-semibold inline-flex items-center gap-1 rounded transition-colors shadow-2xs cursor-pointer shrink-0 whitespace-nowrap ${
                  incident.authorized
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                    : 'bg-rose-700 hover:bg-rose-800 text-white'
                }`}
              >
                {incident.authorized ? (
                  <>
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{language === 'mr' ? 'खंडन जारी' : 'Rebuttal Sent'}</span>
                  </>
                ) : isSubmitting ? (
                  <span>{language === 'mr' ? 'मंजूर करत आहे...' : 'Authorizing...'}</span>
                ) : (
                  <>
                    <ShieldExclamationIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{language === 'mr' ? 'खंडन मंजूर करा' : 'Authorize Rebuttal'}</span>
                  </>
                )}
              </button>
            ) : (
              <div
                className="h-7 px-2.5 text-[11px] font-semibold inline-flex items-center gap-1 text-slate-500 bg-slate-100 border border-slate-300 rounded cursor-not-allowed whitespace-nowrap shrink-0"
                title={language === 'mr' ? 'केवळ जिल्हाधिकारी किंवा महासंचालक प्रशासकाकडे स्वाक्षरी मंजुरी आहे' : 'Only District Collector or DG State Admin has signing clearance'}
              >
                <LockClosedIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{language === 'mr' ? 'जिल्हाधिकारी मंजुरी' : 'Collector Req.'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Drawers */}
      <div className="px-3.5 pb-2">
        {renderEvidenceDrawer()}
        {renderTimelineDrawer()}
      </div>
    </div>
  );
};
