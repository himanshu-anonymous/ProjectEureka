'use client';

import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  generate100Logs,
  generateNextLiveLog,
  generate100Audits,
  generateNextLiveAudit,
  LogItem,
  AuditItem,
} from '@/data/telemetryLogsAndAuditData';
import { AnimatedTelemetryMesh } from '@/components/commandCenter/AnimatedTelemetryMesh';
import { AnimatedPipelineDiagram } from '@/components/commandCenter/AnimatedPipelineDiagram';

export type TelemetryModule =
  | 'telemetry'
  | 'filtration'
  | 'pipelining'
  | 'monitoring'
  | 'database'
  | 'logs'
  | 'audit';

export interface ModuleDef {
  id: TelemetryModule;
  number: number;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  icon: MaterialIconName;
  badge: string;
}

// Static Module Definitions - Allocated Once
export const MODULES_DEF: ModuleDef[] = [
  {
    id: 'telemetry',
    number: 1,
    titleEn: 'Telemetry',
    titleMr: 'दूरमिती',
    descEn: 'Telemetry overview and incoming data status',
    descMr: 'दूरमिती आढावा आणि थेट येणारा डेटा प्रवाह स्थिती',
    icon: 'podcasts',
    badge: '5 Nodes Active',
  },
  {
    id: 'filtration',
    number: 2,
    titleEn: 'Filtration',
    titleMr: 'माहिती गाळणी',
    descEn: 'Filter rules, data validation and filtering status',
    descMr: 'गाळणी नियम, डेटा प्रमाणीकरण आणि फिल्टर स्थिती',
    icon: 'alt_route',
    badge: '14 Active Rules',
  },
  {
    id: 'pipelining',
    number: 3,
    titleEn: 'Pipelining',
    titleMr: 'डेटा पाइपलाइन',
    descEn: 'Pipeline configuration, execution and processing status',
    descMr: 'पाइपलाइन रचना, अंमलबजावणी व प्रक्रिया स्थिती',
    icon: 'layers',
    badge: '1,480 ev/min',
  },
  {
    id: 'monitoring',
    number: 4,
    titleEn: 'Monitoring',
    titleMr: 'प्रणाली देखरेख',
    descEn: 'Live metrics, health checks and alerts',
    descMr: 'थेट मेट्रिक्स, प्रणाली आरोग्य तपासणी व सूचना',
    icon: 'bar_chart',
    badge: '99.98% Health',
  },
  {
    id: 'database',
    number: 5,
    titleEn: 'Database',
    titleMr: 'डेटाबेस व्यवस्थापन',
    descEn: 'Database connectivity, storage and records',
    descMr: 'डेटाबेस कनेक्टिव्हिटी, साठवणूक आणि नोंदी',
    icon: 'dns',
    badge: 'TimescaleDB Active',
  },
  {
    id: 'logs',
    number: 6,
    titleEn: 'Logs',
    titleMr: 'प्रणाली नोंदी',
    descEn: 'Application logs, errors and processing history',
    descMr: 'ॲप्लिकेशन लॉग्स, त्रुटी आणि प्रक्रिया इतिहास',
    icon: 'description',
    badge: 'Real-Time Stream',
  },
  {
    id: 'audit',
    number: 7,
    titleEn: 'Audit',
    titleMr: 'सुरक्षा ऑडिट',
    descEn: 'Configuration changes and audit history',
    descMr: 'रचना बदल आणि सुरक्षा ऑडिट इतिहास',
    icon: 'verified_user',
    badge: 'Tamper-Proof Log',
  },
];

// Reusable SVG External Link Icon
export const ExternalLinkIcon: React.FC<{ className?: string }> = ({
  className = 'w-3 h-3 text-sky-500',
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

// Clickable Interactive Endpoint Pill Badge
export const ClickableEndpoint: React.FC<{ url: string; label?: string }> = ({ url, label }) => {
  const endpointLabel = label || url;
  const endpointUrl =
    url.startsWith('http://') || url.startsWith('https://')
      ? url
      : url.startsWith('s3://') || url.startsWith('rtsp://')
      ? `https://${url.replace(/^[a-z0-9]+:\/\//, '')}`
      : `https://${url}`;

  return (
    <a
      href={endpointUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-sky-700 bg-sky-50/90 hover:bg-sky-100/90 hover:text-sky-900 border border-sky-200/80 px-2.5 py-1 rounded-md transition-all group cursor-pointer max-w-full"
      title={endpointLabel}
    >
      <span className="truncate max-w-[340px]">{endpointLabel}</span>
      <ExternalLinkIcon className="w-3 h-3 text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
    </a>
  );
};

// Static District Telemetry Nodes Table Data (No Polling Rate column)
const STATIC_DISTRICT_NODES = [
  {
    id: 'THN-01',
    name: 'Thane Division Central',
    nameMr: 'ठाणे विभाग मध्यवर्ती नोड',
    district: 'Thane',
    districtMr: 'ठाणे',
    latency: '12ms',
    status: 'Online',
    statusMr: 'सक्रिय',
    endpoint: 'https://thn-01.telemetry.maharashtra.gov.in/stream',
    packets: '1.2M',
  },
  {
    id: 'RGD-02',
    name: 'Raigad Coastal Gateway',
    nameMr: 'रायगड किनारी गेटवे',
    district: 'Raigad',
    districtMr: 'रायगड',
    latency: '18ms',
    status: 'Online',
    statusMr: 'सक्रिय',
    endpoint: 'https://rgd-02.telemetry.maharashtra.gov.in/stream',
    packets: '840K',
  },
  {
    id: 'PLG-03',
    name: 'Palghar Tribal Corridor Node',
    nameMr: 'पालघर आदिवासी कॉरिडोअर नोड',
    district: 'Palghar',
    districtMr: 'पालघर',
    latency: '22ms',
    status: 'Online',
    statusMr: 'सक्रिय',
    endpoint: 'https://plg-03.telemetry.maharashtra.gov.in/stream',
    packets: '610K',
  },
  {
    id: 'RTG-04',
    name: 'Ratnagiri Maritime Port Gateway',
    nameMr: 'रत्नागिरी सागरी बंदर गेटवे',
    district: 'Ratnagiri',
    districtMr: 'रत्नागिरी',
    latency: '25ms',
    status: 'Online',
    statusMr: 'सक्रिय',
    endpoint: 'https://rtg-04.telemetry.maharashtra.gov.in/stream',
    packets: '690K',
  },
  {
    id: 'SND-05',
    name: 'Sindhudurg South Coastal Node',
    nameMr: 'सिंधुदुर्ग दक्षिण किनारी नोड',
    district: 'Sindhudurg',
    districtMr: 'सिंधुदुर्ग',
    latency: '28ms',
    status: 'Online',
    statusMr: 'सक्रिय',
    endpoint: 'https://snd-05.telemetry.maharashtra.gov.in/stream',
    packets: '480K',
  },
];

// Static Filter Rules Table Data
const STATIC_FILTER_RULES = [
  { id: 'RULE-101', name: 'Critical Disaster / Flood Misinfo Suppressor', nameMr: 'गंभीर आपत्ती / पूर अफवा प्रतिबंधक', category: 'Emergency', categoryMr: 'आपत्कालीन', matchRate: '99.8%', policy: 'Flag & Isolate', policyMr: 'चिन्हांकित व वेगळे करा', status: 'Active', statusMr: 'सक्रिय' },
  { id: 'RULE-102', name: 'District Geographic Boundary Validator (GIS)', nameMr: 'जिल्हा भौगोलिक सीमा प्रमाणीकरण (जीआयएस)', category: 'Validation', categoryMr: 'प्रमाणीकरण', matchRate: '100%', policy: 'Tag District ID', policyMr: 'जिल्हा आयडी जोडा', status: 'Active', statusMr: 'सक्रिय' },
  { id: 'RULE-103', name: '15-Minute Broadcast Duplicate De-duplicator', nameMr: '१५-मिनिट प्रक्षेपण पुनरावृत्ती वगळणी', category: 'Sanitization', categoryMr: 'शुद्धीकरण', matchRate: '94.2%', policy: 'Drop Redundant', policyMr: 'पुनरावृत्ती वगळा', status: 'Active', statusMr: 'सक्रिय' },
  { id: 'RULE-104', name: 'Source Credibility < 60% Auto-Triage', nameMr: 'स्रोत विश्वासार्हता < ६०% स्वयंचलित छाननी', category: 'Security', categoryMr: 'सुरक्षा', matchRate: '98.5%', policy: 'Send to Fact-Check', policyMr: 'तथ्य-तपासणीसाठी पाठवा', status: 'Active', statusMr: 'सक्रिय' },
  { id: 'RULE-105', name: 'Devanagari Unicode Normalization Engine', nameMr: 'देवनागरी युनिकोड प्रमाणीकरण इंजिन', category: 'Format', categoryMr: 'स्वरूप', matchRate: '100%', policy: 'Normalize Text', policyMr: 'मजकूर प्रमाणित करा', status: 'Active', statusMr: 'सक्रिय' },
];

// --- STEP 1: STYLED MODULE DROPDOWN SELECTOR ---
interface StyledModuleDropdownProps {
  modules: ModuleDef[];
  activeModule: TelemetryModule;
  onSelectModule: (id: TelemetryModule) => void;
  language: string;
}

const StyledModuleDropdown = memo<StyledModuleDropdownProps>(
  ({ modules, activeModule, onSelectModule, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeDef = useMemo(
      () => modules.find((m) => m.id === activeModule) || modules[0],
      [modules, activeModule]
    );

    // Dismiss popover on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-10 min-w-[260px] px-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-xl shadow-xs flex items-center justify-between gap-3 text-xs font-semibold transition-all cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {/* Left Content */}
          <div className="flex items-center gap-2.5">
            <span className="bg-amber-500 text-slate-950 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0">
              {activeDef.number}
            </span>
            <span className="font-semibold text-white whitespace-nowrap">
              {activeDef.number}. {language === 'mr' ? activeDef.titleMr : activeDef.titleEn}
            </span>
            <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded shrink-0 hidden sm:inline">
              {activeDef.badge}
            </span>
          </div>

          {/* Right Icon */}
          <MaterialIcon
            name="expand_more"
            size="xs"
            className={`w-4 h-4 text-slate-400 transition-transform duration-150 shrink-0 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu Popover */}
        {isOpen && (
          <div className="absolute right-0 top-full w-80 mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-1 space-y-0.5">
              {modules.map((m) => {
                const isSelected = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectModule(m.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-50/70 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {m.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}>
                            {m.number}. {language === 'mr' ? m.titleMr : m.titleEn}
                          </span>
                          <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 py-0.2 rounded">
                            {m.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal truncate max-w-[200px] mt-0.5">
                          {language === 'mr' ? m.descMr : m.descEn}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <MaterialIcon
                        name="check"
                        size="xs"
                        className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);
StyledModuleDropdown.displayName = 'StyledModuleDropdown';

// --- STEP 2: ISOLATED LOGS MODULE ---
const LogsTabModule = memo<{ language: string }>(({ language }) => {
  const [logs, setLogs] = useState<LogItem[]>(generate100Logs);
  const [liveLogsActive, setLiveLogsActive] = useState<boolean>(true);
  const [lastNewLogId, setLastNewLogId] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');

  useEffect(() => {
    if (!liveLogsActive) return;
    let counter = 101;
    const interval = setInterval(() => {
      const newLog = generateNextLiveLog(counter++);
      setLastNewLogId(newLog.id);
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [liveLogsActive]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = logFilter === 'ALL' || log.level === logFilter;
      const matchesSearch =
        !logSearch ||
        log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.module.toLowerCase().includes(logSearch.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [logs, logFilter, logSearch]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gov-primary">
              {language === 'mr' ? '६. ॲप्लिकेशन नोंदी, त्रुटी आणि प्रक्रिया इतिहास' : '6. Application Logs, Errors & Processing History'}
            </h2>
            <button
              onClick={() => setLiveLogsActive(!liveLogsActive)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                liveLogsActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              {liveLogsActive ? (
                <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              )}
              <span>Live Feed: {liveLogsActive ? 'ACTIVE' : 'PAUSED'}</span>
            </button>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            Real-time server log stream ({logs.length} records in memory, live auto-feeding)
          </p>
        </div>

        {/* Log Filters & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-300 text-xs font-semibold">
            {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLogFilter(lvl)}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  logFilter === lvl ? 'bg-gov-primary text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search 100+ logs..."
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="px-2.5 py-1 bg-surface border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-blue/20"
          />
        </div>
      </div>

      {/* Terminal-Style Log Viewer */}
      <div className="bg-slate-950 text-slate-200 rounded-lg p-3.5 font-mono text-xs overflow-x-auto max-h-[440px] overflow-y-auto space-y-1.5 border border-slate-800">
        {filteredLogs.map((log) => {
          const isNew = log.id === lastNewLogId;
          const levelColor =
            log.level === 'ERROR'
              ? 'text-rose-400 bg-rose-950/40 border-rose-800'
              : log.level === 'WARN'
              ? 'text-amber-400 bg-amber-950/40 border-amber-800'
              : 'text-emerald-400 bg-emerald-950/40 border-emerald-800';

          return (
            <div
              key={log.id}
              className={`flex items-start gap-2.5 py-1 px-1.5 rounded transition-colors duration-200 border-b border-slate-900/80 ${
                isNew
                  ? 'bg-emerald-950/70 border border-emerald-500'
                  : 'hover:bg-slate-900/70'
              }`}
            >
              <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
              <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${levelColor}`}>
                {log.level}
              </span>
              <span className="text-amber-400/90 font-bold text-[11px] shrink-0">[{log.module}]</span>
              <span className="text-slate-500 text-[10px] shrink-0 font-normal">({log.thread})</span>
              <span className="text-slate-300 break-words flex-1 text-[11px]">{log.message}</span>
            </div>
          );
        })}
        {filteredLogs.length === 0 && (
          <div className="text-center py-6 text-slate-500">
            No log records found matching query criteria.
          </div>
        )}
      </div>
    </div>
  );
});
LogsTabModule.displayName = 'LogsTabModule';

// --- STEP 3: ISOLATED AUDIT MODULE (With Clean Header, Contained Height, Clickable Endpoints, Single Status) ---
const AuditTabModule = memo<{ language: string }>(({ language }) => {
  const [audits, setAudits] = useState<AuditItem[]>(generate100Audits);
  const [liveAuditsActive, setLiveAuditsActive] = useState<boolean>(true);
  const [lastNewAuditId, setLastNewAuditId] = useState<string | null>(null);

  useEffect(() => {
    if (!liveAuditsActive) return;
    let counter = 101;
    const interval = setInterval(() => {
      const newAudit = generateNextLiveAudit(counter++);
      setLastNewAuditId(newAudit.id);
      setAudits((prev) => [newAudit, ...prev.slice(0, 99)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [liveAuditsActive]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gov-primary">
              {language === 'mr'
                ? '७. रचना बदल आणि सुरक्षा ऑडिट इतिहास'
                : '7. Configuration Changes & Audit History'}
            </h2>
            {/* Live Audit Badge without polling interval suffix */}
            <button
              type="button"
              onClick={() => setLiveAuditsActive(!liveAuditsActive)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                liveAuditsActive
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              {liveAuditsActive ? (
                <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              )}
              <span>Live Audit: {liveAuditsActive ? 'FEEDING' : 'PAUSED'}</span>
            </button>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            Cryptographically verified administrative trail ({audits.length} records in memory, live auto-feeding)
          </p>
        </div>
        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 text-xs font-mono">
          Log Integrity: VERIFIED
        </span>
      </div>

      {/* Contained Table Height: max-h-[480px] overflow-y-auto with sticky table header */}
      <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-slate-200/90 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-bold border-b border-slate-200 shadow-xs">
            <tr>
              <th className="py-2.5 px-3 bg-slate-50">Audit ID</th>
              <th className="py-2.5 px-3 bg-slate-50">Timestamp</th>
              <th className="py-2.5 px-3 bg-slate-50">Officer / Actor</th>
              <th className="py-2.5 px-3 bg-slate-50">Role & Clearance</th>
              <th className="py-2.5 px-3 bg-slate-50">Configuration Change Details</th>
              <th className="py-2.5 px-3 bg-slate-50">Gateway URI</th>
              <th className="py-2.5 px-3 bg-slate-50">IP Address</th>
              <th className="py-2.5 px-3 bg-slate-50">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {audits.map((aud) => {
              const isNew = aud.id === lastNewAuditId;
              const moduleSlug = aud.module.toLowerCase().replace(/[^a-z0-9]/g, '');
              const gatewayEndpoint = `https://${moduleSlug}.gateway.maharashtra.gov.in/v1/audit`;

              return (
                <tr
                  key={aud.id}
                  className={`transition-colors duration-200 ${
                    isNew ? 'bg-amber-100/80' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{aud.id}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{aud.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{aud.actor}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">{aud.clearance}</td>
                  <td className="py-2.5 px-3 text-slate-800">{aud.action}</td>
                  <td className="py-2.5 px-3">
                    <ClickableEndpoint
                      url={gatewayEndpoint}
                      label={`${moduleSlug}.gov.in/audit`}
                    />
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{aud.ip}</td>
                  {/* Single Authoritative Status Display */}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
                      <span>{aud.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
AuditTabModule.displayName = 'AuditTabModule';

// --- MAIN TELEMETRY OPERATIONS VIEW COMPONENT ---
export const TelemetryOperationsView: React.FC = () => {
  const { language } = useDashboardStore();
  const [activeModule, setActiveModule] = useState<TelemetryModule>('telemetry');

  return (
    <div className="space-y-4">
      {/* 
        MAIN WORKSPACE CARD:
        Header with Styled Dropdown Selector + active module workspace
      */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* Step 1: Sleek Header Row with Dropdown Module Selector */}
        <div className="bg-slate-50/90 border-b border-slate-200/90 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'mr' ? 'थेट प्रणाली ऑपरेशन्स डेक' : 'Live Telemetry Operations Deck'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {language === 'mr'
                  ? '७ मुख्य मॉड्यूल व रिअल-टाइम पाइपलाइन'
                  : '7 Core Infrastructure Modules & Real-time Stream Analytics'}
              </p>
            </div>
          </div>

          {/* Authoritative Styled Dropdown Selector */}
          <StyledModuleDropdown
            modules={MODULES_DEF}
            activeModule={activeModule}
            onSelectModule={setActiveModule}
            language={language}
          />
        </div>

        {/* Module Content Workspace */}
        <div className="p-5">
          {/* Module 1: Telemetry */}
          {activeModule === 'telemetry' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Live Animated Telemetry Mesh & Topology Flow (Light Government Theme) */}
              <AnimatedTelemetryMesh embedded={true} />

              {/* District Ingestion Nodes Table (With Clickable Endpoints & No Polling Rate) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  {language === 'mr' ? 'सक्रिय जिल्हा टेलिमेट्री गेटवे' : 'Active District Telemetry Gateways'}
                </h3>
                <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-slate-200/90 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-bold border-b border-slate-200 shadow-xs">
                      <tr>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'नोड आयडी' : 'Node ID'}</th>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'गेटवे नाव' : 'Gateway Name'}</th>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'जिल्हा' : 'District'}</th>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'गेटवे एंडपॉईंट URI' : 'Gateway Endpoint URI'}</th>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'विलंबता' : 'Latency'}</th>
                        <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'एकूण अंतर्ग्रहण' : 'Total Ingested'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {STATIC_DISTRICT_NODES.map((node) => (
                        <tr key={node.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{node.id}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            {language === 'mr' ? node.nameMr : node.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                              {language === 'mr' ? node.districtMr : node.district}
                            </span>
                          </td>
                          {/* Single Status Display */}
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {language === 'mr' ? node.statusMr : node.status}
                            </span>
                          </td>
                          {/* Clickable Endpoint */}
                          <td className="py-2.5 px-3">
                            <ClickableEndpoint
                              url={node.endpoint}
                              label={`${node.id.toLowerCase()}.telemetry.gov.in`}
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{node.latency}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{node.packets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Module 2: Filtration */}
          {activeModule === 'filtration' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
                <div>
                  <h2 className="text-base font-bold text-gov-primary">
                    {language === 'mr' ? '२. गाळणी नियम व डेटा प्रमाणीकरण' : '2. Filter Rules, Data Validation & Filtering Status'}
                  </h2>
                  <p className="text-xs text-content-secondary">
                    {language === 'mr'
                      ? 'नियम अंमलबजावणी स्थिती, पेलोड शुद्धीकरण, जीआयएस जिओफेन्सिंग प्रमाणीकरण व त्रुटी नकार'
                      : 'Rule execution status, payload sanitization, GIS geofencing validation, and anomaly rejection'}
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded bg-gov-primary text-white hover:bg-gov-primary-dark text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <MaterialIcon name="add" size="xs" />
                  <span>{language === 'mr' ? '+ नवीन नियम जोडा' : '+ Define Filter Rule'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-[11px] text-emerald-800 font-medium">
                    {language === 'mr' ? 'प्रमाणीकरण उत्तीर्ण दर' : 'Validation Pass Rate'}
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-1">99.4%</div>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    {language === 'mr' ? 'डीजीआयपीआर रचनेनुसार अनुरूप पेलोड' : 'Payloads conforming to DGIPR schema'}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-[11px] text-amber-800 font-medium">
                    {language === 'mr' ? 'आज रोखलेल्या त्रुटी' : 'Blocked Anomalies Today'}
                  </span>
                  <div className="text-xl font-bold font-mono text-amber-900 mt-1">42</div>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    {language === 'mr' ? 'तपासणी कक्षासाठी अलग ठेवलेले' : 'Quarantined for verification desk'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-700 font-medium">
                    {language === 'mr' ? 'पुनरावृत्ती वगळणी प्रमाण' : 'De-duplication Ratio'}
                  </span>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">1:4.8</div>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {language === 'mr' ? 'पुनरावृत्ती प्रक्षेपण संकुचित केले' : 'Redundant broadcasts compressed'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-slate-200/90 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-bold border-b border-slate-200 shadow-xs">
                    <tr>
                      <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'नियम आयडी' : 'Rule ID'}</th>
                      <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'गाळणी नियम वर्णन' : 'Filter Rule Description'}</th>
                      <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'वर्ग' : 'Category'}</th>
                      <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'उत्तीर्ण / जुळणी' : 'Pass / Match'}</th>
                      <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'लागू धोरण' : 'Policy Applied'}</th>
                      <th className="py-2.5 px-3 bg-slate-50">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {STATIC_FILTER_RULES.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{rule.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {language === 'mr' ? rule.nameMr : rule.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-300">
                            {language === 'mr' ? rule.categoryMr : rule.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{rule.matchRate}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {language === 'mr' ? rule.policyMr : rule.policy}
                        </td>
                        {/* Single Status Display */}
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            {language === 'mr' ? rule.statusMr : rule.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module 3: Pipelining */}
          {activeModule === 'pipelining' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Live Animated Pipeline Diagram (Light Government Theme) */}
              <AnimatedPipelineDiagram embedded={true} />

              {/* Pipeline Configuration Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                    {language === 'mr' ? 'कार्यकर्ता पूल संरचना' : 'Worker Pool Configuration'}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{language === 'mr' ? 'समवर्ती कार्यकर्ते:' : 'Concurrency Workers:'}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {language === 'mr' ? '८ थ्रेड्स' : '8 Threads'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{language === 'mr' ? 'कमाल बॅच बफर आकार:' : 'Max Batch Buffer Size:'}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {language === 'mr' ? '५०० पेलोड्स' : '500 payloads'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{language === 'mr' ? 'पाइपलाइन स्वयंचलित रीस्टार्ट:' : 'Pipeline Auto-Restart:'}</span>
                      <span className="font-bold text-emerald-700">
                        {language === 'mr' ? 'सक्रिय (स्वयं-दुरुस्ती)' : 'Enabled (Self-Healing)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <h4 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                    {language === 'mr' ? 'कामगिरी व एसएलए मर्यादा' : 'Performance & SLA Constraints'}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{language === 'mr' ? 'कमाल अनुमत एकूण विलंबता:' : 'Max Allowable End-to-End Latency:'}</span>
                      <span className="font-mono font-bold text-slate-900">&lt; 150 ms</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{language === 'mr' ? 'सध्याची मोजलेली विलंबता:' : 'Current Measured Latency:'}</span>
                      <span className="font-mono font-bold text-emerald-700">49.0 ms</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span>{language === 'mr' ? 'प्रति कार्यकर्ता मेमरी वाटप:' : 'Memory Allocation per Worker:'}</span>
                      <span className="font-mono font-bold text-slate-900">512 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Module 4: Monitoring */}
          {activeModule === 'monitoring' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
                <div>
                  <h2 className="text-base font-bold text-gov-primary">
                    {language === 'mr' ? '४. थेट देखरेख, प्रणाली आरोग्य व सूचना' : '4. Live Metrics, Health Checks & Alerts'}
                  </h2>
                  <p className="text-xs text-content-secondary">
                    {language === 'mr'
                      ? 'पायाभूत सुविधा टेलिमेट्री, डिमन हार्टबीट संनियंत्रण, एसएलए अनुपालन व मर्यादा अलार्म'
                      : 'Infrastructure telemetry, daemon heartbeat monitor, SLA compliance, and threshold alarms'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
                  {language === 'mr' ? 'प्रणाली स्थिती: सामान्य' : 'System Status: NOMINAL'}
                </span>
              </div>

              {/* System Resource Gauges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'क्लस्टर सीपीयू वापर' : 'Cluster CPU Utilization'}
                  </span>
                  <div className="text-lg font-bold font-mono text-gov-primary mt-1">28.4%</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[28%]"></div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'रॅम वाटप' : 'RAM Allocation'}
                  </span>
                  <div className="text-lg font-bold font-mono text-gov-primary mt-1">4.2 / 16 GB</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[26%]"></div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'नेटवर्क इनबाउंड / आउटबाउंड' : 'Network Inbound / Outbound'}
                  </span>
                  <div className="text-lg font-bold font-mono text-gov-primary mt-1">14.8 MB/s</div>
                  <span className="text-[10px] text-slate-500">
                    {language === 'mr' ? 'आउटबाउंड: २.१ MB/s' : 'Outbound: 2.1 MB/s'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'एसएलए उपलब्धता (३० दिवस)' : 'SLA Availability (30d)'}
                  </span>
                  <div className="text-lg font-bold font-mono text-emerald-700 mt-1">99.98%</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {language === 'mr' ? '० अनियोजित खंड' : '0 Unplanned Outages'}
                  </span>
                </div>
              </div>

              {/* Health Log Entries */}
              <div className="border border-borderLine-standard rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 font-bold text-xs text-slate-700 uppercase tracking-wider">
                  {language === 'mr'
                    ? 'स्वयंचलित पायाभूत सुविधा अलार्म व आरोग्य तपासणी नोंदी'
                    : 'Automated Infrastructure Alarms & Health Check Events'}
                </div>
                <div className="divide-y divide-slate-200 text-xs">
                  <div className="p-3 flex items-start gap-3 hover:bg-slate-50">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 mt-0.5">
                      HEALTH_OK
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {language === 'mr'
                          ? 'सर्व ५ सक्रिय जिल्हा अंतर्ग्रहण डिमन्सनी १७:०२:०० वाजता सामान्य हार्टबीट नोंदवले.'
                          : 'All 5 active district ingestion daemons reported nominal heartbeats at 17:02:00.'}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400">
                        {language === 'mr' ? 'आज १७:०२:०० IST वाजता' : 'Today at 17:02:00 IST'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex items-start gap-3 hover:bg-slate-50">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 mt-0.5">
                      WARN_HEALED
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {language === 'mr'
                          ? 'रत्नागिरी गेटवे २ सेकंदांच्या किरकोळ नेटवर्क व्यत्ययानंतर पुन्हा जोडला गेला. फेलओव्हर बफर यशस्वीरीत्या रिक्त केला.'
                          : 'Ratnagiri gateway reconnect after minor 2s network jitter. Failover buffer flushed cleanly.'}
                      </p>
                      <span className="font-mono text-[10px] text-slate-400">
                        {language === 'mr' ? 'आज १६:४८:१२ IST वाजता' : 'Today at 16:48:12 IST'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Module 5: Database */}
          {activeModule === 'database' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
                <div>
                  <h2 className="text-base font-bold text-gov-primary">
                    {language === 'mr' ? '५. डेटाबेस कनेक्टिव्हिटी, साठवणूक आणि नोंदी' : '5. Database Connectivity, Storage & Records'}
                  </h2>
                  <p className="text-xs text-content-secondary">
                    {language === 'mr'
                      ? 'प्राथमिक राज्य डेटाबेस, रीड/राईट IOPS, सक्रिय जोडण्या व संग्रहण'
                      : 'Primary state datastore, read/write IOPS, active connections, and archival data retention'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
                  {language === 'mr' ? 'क्लस्टर: जोडलेले' : 'Cluster: CONNECTED'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'सक्रिय कनेक्शन पूल' : 'Active Connection Pool'}
                  </span>
                  <div className="text-xl font-bold font-mono text-gov-primary mt-1">42 / 60</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'mr' ? 'कनेक्शन पूल क्षमता: ३०%' : 'Connection pool headroom: 30%'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'एकूण साठवलेल्या नोंदी' : 'Total Stored Records'}
                  </span>
                  <div className="text-xl font-bold font-mono text-gov-primary mt-1">3,428,910</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'mr' ? 'टेलिमेट्री व वृत्त नोंदी' : 'Telemetry & press records'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'mr' ? 'वाटप केलेली साठवणूक' : 'Storage Allocated'}
                  </span>
                  <div className="text-xl font-bold font-mono text-gov-primary mt-1">48.6 / 100 GB</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'mr' ? '४८.६% थेट साठवणूक क्षमता' : '48.6% hot storage capacity'}
                  </p>
                </div>
              </div>

              {/* Database Context with Clickable Host Endpoints */}
              <div className="p-4 bg-slate-900 rounded-lg text-white space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold">
                    {language === 'mr' ? 'डेटाबेस टोपोलॉजी व क्रेडेन्शियल संदर्भ' : 'DATABASE TOPOLOGY & CREDENTIAL CONTEXT'}
                  </span>
                  <span className="text-emerald-400">sslmode=verify-full</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-slate-400">
                      {language === 'mr' ? 'प्राथमिक होस्ट:' : 'Primary Host:'}
                    </span>
                    <ClickableEndpoint
                      url="https://timescale-primary.dgipr-mumbai.gov.in:5432"
                      label="timescale-primary.dgipr-mumbai.gov.in"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-slate-400">
                      {language === 'mr' ? 'रीड रेप्लिका:' : 'Read Replica:'}
                    </span>
                    <ClickableEndpoint
                      url="https://timescale-read-01.dgipr-state.gov.in:5432"
                      label="timescale-read-01.dgipr-state.gov.in"
                    />
                  </div>
                  <div>
                    {language === 'mr' ? 'क्वेरी विलंबता (p95):' : 'Query Latency (p95):'}{' '}
                    <span className="text-emerald-400 font-bold">1.8 ms</span>
                  </div>
                  <div>
                    {language === 'mr' ? 'राईट IOPS:' : 'Write IOPS:'}{' '}
                    <span className="text-emerald-400 font-bold">480 IOPS</span>
                  </div>
                  <div>
                    {language === 'mr' ? 'जतन कालावधी:' : 'Retention Period:'}{' '}
                    <span className="text-white">
                      {language === 'mr' ? '९० दिवस थेट • ३६५ दिवस ग्लेशियर' : '90 Days Hot • 365 Days S3 Glacier'}
                    </span>
                  </div>
                  <div>
                    {language === 'mr' ? 'एनक्रिप्शन:' : 'Encryption:'}{' '}
                    <span className="text-white">
                      {language === 'mr' ? 'विश्राम स्थितीत AES-256 व वहनात TLS 1.3' : 'AES-256 at Rest & TLS 1.3 in Flight'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Module 6: Logs (Self-Contained Memoized Tab) */}
          {activeModule === 'logs' && <LogsTabModule language={language} />}

          {/* Module 7: Audit (Self-Contained Memoized Tab with Contained Table & Clean Header) */}
          {activeModule === 'audit' && <AuditTabModule language={language} />}
        </div>
      </div>
    </div>
  );
};

export default TelemetryOperationsView;

