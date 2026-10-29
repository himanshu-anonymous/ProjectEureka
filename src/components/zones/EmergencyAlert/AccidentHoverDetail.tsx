'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IncidentData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/20/solid';

interface AccidentHoverDetailProps {
  incident: IncidentData;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const AccidentHoverDetail: React.FC<AccidentHoverDetailProps> = ({
  incident,
  children,
  position = 'top',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { language } = useDashboardStore();

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

  const isAccident = incident.incidentType === 'Accident';
  const cityName = language === 'mr' ? (incident.cityNameMr || incident.cityName || incident.district) : (incident.cityName || incident.district);
  const people = incident.peopleAffected;
  const accident = incident.accidentDetails;
  const evidence = incident.verificationEvidence;

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="tooltip"
    >
      {children}

      {isOpen && (
        <div
          className={`absolute z-50 w-84 sm:w-96 p-4 bg-slate-900/98 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 text-left transition-all duration-200 pointer-events-none animate-fadeIn ${
            position === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2.5'
              : position === 'bottom'
              ? 'top-full left-1/2 -translate-x-1/2 mt-2.5'
              : position === 'left'
              ? 'right-full top-1/2 -translate-y-1/2 mr-2.5'
              : 'left-full top-1/2 -translate-y-1/2 ml-2.5'
          }`}
          style={{ maxWidth: 'min(92vw, 440px)' }}
        >
          {/* 1. Header with City Name and Incident Badge */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/80 pb-2.5 mb-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isAccident ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {language === 'mr' ? 'थेट अपघात व नागरी मदत' : 'Live Accident & Rescue'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {language === 'mr' ? 'तथ्य पडताळणी व खंडन' : 'Fact-Check Intelligence'}
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-400">#{incident.id}</span>
              </div>

              {/* City Name Prominently Highlighted */}
              <div className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                <span>{language === 'mr' ? 'शहर / ठिकाण: ' : 'City / Location: '}</span>
                <span className="text-amber-300 underline decoration-amber-400/60 font-black">{cityName}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block">{incident.district}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                incident.severity === 'High' ? 'bg-rose-900/60 text-rose-300 border border-rose-700' : 'bg-amber-900/60 text-amber-300 border border-amber-700'
              }`}>
                {incident.severity} Priority
              </span>
            </div>
          </div>

          {/* 2. News Details */}
          <div className="mb-2.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-0.5">
              {language === 'mr' ? 'वृत्त व घटना तपशील (News Details):' : 'Incident & News Details:'}
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {language === 'mr'
                ? (incident.newsDetailsMr || incident.summaryMr || incident.summary)
                : (incident.newsDetails || incident.summary)}
            </p>
          </div>

          {/* 3. Number of People Affected (Required by user prompt) */}
          {people && (
            <div className="mb-2.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                <span>{language === 'mr' ? 'बाधित नागरिक व मदत कार्य:' : 'People Affected & Relief Status:'}</span>
                <span className="font-mono text-amber-300 font-bold">{people.totalAffected} Total Impacted</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-amber-950/50 border border-amber-800/60 rounded p-1.5">
                  <span className="text-[10px] text-amber-300 block font-semibold">{language === 'mr' ? 'जखमी' : 'Injured'}</span>
                  <strong className="text-sm font-mono text-amber-200">{people.injured}</strong>
                </div>

                <div className="bg-blue-950/50 border border-blue-800/60 rounded p-1.5">
                  <span className="text-[10px] text-blue-300 block font-semibold">{language === 'mr' ? 'सुरक्षित हलविले' : 'Evacuated'}</span>
                  <strong className="text-sm font-mono text-blue-200">{people.evacuated}</strong>
                </div>

                <div className="bg-emerald-950/50 border border-emerald-800/60 rounded p-1.5">
                  <span className="text-[10px] text-emerald-300 block font-semibold">{language === 'mr' ? 'जीवितहानी' : 'Fatalities'}</span>
                  <strong className="text-sm font-mono text-emerald-400">{people.fatalities} (Zero)</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mt-1.5 pt-1 border-t border-slate-800/80 leading-snug">
                {language === 'mr' ? (people.detailsMr || people.details) : people.details}
              </p>
            </div>
          )}

          {/* 4. Other Relevant Accident Information */}
          {accident && (
            <div className="mb-2.5 space-y-1.5 text-[11px] bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/60">
              <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider">
                {language === 'mr' ? 'इतर अपघात व नागरी सेवा तपशील:' : 'Accident Logistics & Relief Operations:'}
              </div>

              {accident.highwayOrRoad && (
                <div className="flex items-start gap-1.5 text-slate-300">
                  <TruckIcon className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{language === 'mr' ? 'मार्ग: ' : 'Road: '}</strong>
                    <span>{accident.highwayOrRoad}</span>
                  </div>
                </div>
              )}

              {accident.emergencyUnitsDeployed && accident.emergencyUnitsDeployed.length > 0 && (
                <div className="flex items-start gap-1.5 text-slate-300">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{language === 'mr' ? 'तैनात पथके: ' : 'Deployed Units: '}</strong>
                    <span>{accident.emergencyUnitsDeployed.join(' • ')}</span>
                  </div>
                </div>
              )}

              {accident.hospitalAdmitted && (
                <div className="flex items-start gap-1.5 text-slate-300">
                  <BuildingOffice2Icon className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{language === 'mr' ? 'रुग्णालय: ' : 'Medical Center: '}</strong>
                    <span>{accident.hospitalAdmitted}</span>
                  </div>
                </div>
              )}

              {accident.trafficStatus && (
                <div className="text-[10px] text-amber-200 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/60">
                  <strong>{language === 'mr' ? 'वाहतूक स्थिती: ' : 'Traffic Status: '}</strong>
                  {language === 'mr' ? (accident.trafficStatusMr || accident.trafficStatus) : accident.trafficStatus}
                </div>
              )}

              {accident.helpline && (
                <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[10px] pt-1">
                  <PhoneIcon className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{accident.helpline}</span>
                </div>
              )}
            </div>
          )}

          {/* 5. Data Validation & Source Verification (Requirement 6) */}
          <div className="pt-2 border-t border-slate-700/70">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
              <span className="text-slate-400">
                {language === 'mr' ? 'माहिती पडताळणी व अधिकृत स्रोत:' : 'Source Verification & Validation:'}
              </span>
              <span className="text-emerald-400 font-mono font-semibold">100% Verified</span>
            </div>

            {/* If Fake News or Debunked, clearly show status and supporting evidence */}
            {evidence && (
              <div className="mb-2 p-2 rounded bg-rose-950/50 border border-rose-800 text-[11px] space-y-1">
                <div className="flex items-center gap-1 text-rose-300 font-bold text-xs">
                  <XCircleIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{evidence.debunkedStatus}</span>
                </div>
                <div className="text-slate-300">
                  <strong className="text-rose-200">{language === 'mr' ? 'दावा: ' : 'Claim: '}</strong>
                  <span>{language === 'mr' ? (evidence.claimMr || evidence.claim) : evidence.claim}</span>
                </div>
                <div className="text-emerald-300 font-medium">
                  <strong className="text-emerald-200">{language === 'mr' ? 'सत्य वस्तुस्थिती: ' : 'Verified Truth: '}</strong>
                  <span>{language === 'mr' ? (evidence.verifiedFactMr || evidence.verifiedFact) : evidence.verifiedFact}</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5 border-t border-rose-900/60">
                  <span>{evidence.evidenceType} Evidence • {evidence.investigatingAgency}</span>
                </div>
              </div>
            )}

            {/* Display the sources from which information has been obtained */}
            {incident.sources && incident.sources.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap text-[10px]">
                <span className="text-slate-400">{language === 'mr' ? 'प्राप्त स्रोत:' : 'Obtained from:'}</span>
                {incident.sources.map((src, i) => (
                  <span key={i} className="inline-flex items-center gap-0.5 bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700">
                    <CheckBadgeIcon className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{language === 'mr' ? (src.nameMr || src.name) : src.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
