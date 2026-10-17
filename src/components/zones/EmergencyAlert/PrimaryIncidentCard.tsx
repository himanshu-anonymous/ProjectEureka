'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IncidentData } from '@/types/dashboard';
import { SLACountdown } from './SLACountdown';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
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
  const { language } = useDashboardStore();
  const t = useTranslation(language);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="bg-white p-3.5 border border-red-200 rounded-lg flex flex-col gap-2.5 shadow-2xs">
      {/* 1. Header: Condensed ID, Severity, Location */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            {incident.id}
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold border border-red-200 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
            <span>
              {localizedSeverity} {t.zone5.threatLabel}
            </span>
          </span>
          <span className="text-[11px] font-semibold text-slate-700">
            {t.zone5.districtPrefix} {localizedDistrict}
          </span>
        </div>
      </div>

      {/* 2. Primary Claim / Incident Summary with Direct Clickable URL */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <a
            href={defaultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-900 leading-snug hover:text-gov-blue hover:underline inline-flex items-center gap-1 group"
            title={language === 'mr' ? 'मूळ स्त्रोत उघडा' : 'Open original publisher source'}
          >
            <span>{localizedSummary}</span>
            <MaterialIcon
              name="north_east"
              size="xs"
              className="text-slate-400 group-hover:text-gov-blue shrink-0"
            />
          </a>
        </div>

        {/* Multi-Source Badges Grouping */}
        {incident.sources && incident.sources.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            <span className="text-[10px] font-semibold text-slate-500">
              {language === 'mr' ? 'प्रसिद्धी कव्हरेज:' : 'Coverage:'}
            </span>
            {incident.sources.map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                title={`${src.name} coverage`}
              >
                <span>{language === 'mr' ? (src.nameMr || src.name) : src.name}</span>
                <MaterialIcon name="north_east" size="xs" className="text-slate-400 w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        )}

        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2 flex-wrap">
          <span>
            {language === 'mr' ? 'प्राथमिक स्त्रोत:' : 'Primary:'}{' '}
            <strong className="text-slate-800">{localizedSource}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-700 font-medium">{localizedStatus}</span>
          </span>
        </p>
      </div>

      {/* 3. Live SLA Countdown Widget */}
      <SLACountdown
        initialMinutes={incident.slaMinutes || 38}
        label={t.zone5.slaRemainingLabel}
      />

      {/* Evidence & Automated Telemetry Drawer */}
      {showEvidence && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span className="flex items-center gap-1">
              <MaterialIcon name="dns" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? 'थेट प्रणाली दूरमिती पुरावा' : 'Automated Telemetry & Source Evidence'}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {language === 'mr' ? 'विश्वसनीयता: ९६%' : 'Credibility: 96%'}
            </span>
          </div>
          {language === 'mr' ? (
            <p className="text-slate-600 text-[11px] leading-relaxed">
              पालघर आश्रमशाळेतील पाणी दूषित असल्याचा सोशल मेसेज स्वयंचलित पाइपलाइनने चिन्हांकित केला. सार्वजनिक आरोग्य प्रयोगशाळा दूरमिती अहवाल #PH-2026-904 नुसार पाण्याचे नमुने १००% सुरक्षित असल्याचे निष्पन्न झाले.
            </p>
          ) : (
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Automated ingestion pipeline flagged unverified WhatsApp forward regarding Palghar water supply.
              Direct telemetry cross-reference with District Public Health Laboratory report #PH-2026-904 confirmed drinking water standards are compliant.
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
              <MaterialIcon name="arrow_forward" size="xs" />
            </Link>
          </div>
        </div>
      )}

      {/* Escalation Timeline Drawer */}
      {showTimeline && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
          <div className="text-slate-700 font-bold flex items-center gap-1">
            <MaterialIcon name="history" size="xs" />
            <span>{language === 'mr' ? 'स्वयंचलित प्रणाली ऑपरेशन्स कालक्रम' : 'System Operations Timeline & SLA Flow'}</span>
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
              <span className="font-semibold text-red-700">
                {incident.authorized
                  ? (language === 'mr' ? 'अधिकृत खंडन जारी व प्रकाशित' : 'Official Rebuttal Authorized & Published')
                  : (language === 'mr' ? 'प्रशासक / जिल्हाधिकारी स्वाक्षरीची प्रतीक्षा' : 'Awaiting Collector / DG Admin authorization')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar (System Monitoring Direct Integration & Authorized Rebuttal) */}
      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {/* Direct System Monitoring Module Link */}
          <Link
            href="/system-monitoring"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded transition-colors"
            title={language === 'mr' ? 'थेट प्रणाली निरीक्षण उघडा' : 'Open System Monitoring module'}
          >
            <MaterialIcon name="dns" size="xs" className="text-gov-primary" />
            <span>{language === 'mr' ? 'प्रणाली निरीक्षण' : 'System Monitoring'}</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setShowEvidence(!showEvidence);
              setShowTimeline(false);
            }}
            aria-expanded={showEvidence}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium border rounded transition-colors cursor-pointer ${
              showEvidence
                ? 'bg-gov-primary text-white border-gov-primary'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MaterialIcon name="description" size="xs" />
            <span>{t.zone5.evidenceBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowTimeline(!showTimeline);
              setShowEvidence(false);
            }}
            aria-expanded={showTimeline}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium border rounded transition-colors cursor-pointer ${
              showTimeline
                ? 'bg-gov-primary text-white border-gov-primary'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MaterialIcon name="history" size="xs" />
            <span>{t.zone5.timelineBtn}</span>
          </button>
        </div>

        {canAuthorize ? (
          <button
            type="button"
            onClick={handleAuthorizeClick}
            disabled={incident.authorized || isSubmitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors shadow-2xs cursor-pointer ${
              incident.authorized
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                : 'bg-red-700 hover:bg-red-800 text-white'
            }`}
          >
            {incident.authorized ? (
              <>
                <MaterialIcon name="check_circle" size="xs" className="text-emerald-700" />
                <span>{language === 'mr' ? 'खंडन जारी केले' : 'Rebuttal Dispatched'}</span>
              </>
            ) : isSubmitting ? (
              <span>{language === 'mr' ? 'मंजूर करत आहे...' : 'Authorizing...'}</span>
            ) : (
              <>
                <MaterialIcon name="gpp_bad" size="xs" />
                <span>{language === 'mr' ? 'अधिकृत खंडन मंजूर करा' : 'Authorize Official Rebuttal'}</span>
              </>
            )}
          </button>
        ) : (
          <div
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-300 rounded cursor-not-allowed"
            title={language === 'mr' ? 'केवळ जिल्हाधिकारी किंवा महासंचालक प्रशासकाकडे स्वाक्षरी मंजुरी आहे' : 'Only District Collector or DG State Admin has signing clearance'}
          >
            <MaterialIcon name="lock" size="xs" className="text-slate-400" />
            <span>{language === 'mr' ? 'जिल्हाधिकारी मंजुरी आवश्यक' : 'Collector Approval Required'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
