'use client';

import React, { useState, useEffect } from 'react';
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
import { AnimatedPipelineDiagram } from '@/components/commandCenter/AnimatedPipelineDiagram';
import { AnimatedTelemetryMesh } from '@/components/commandCenter/AnimatedTelemetryMesh';

type SectionType = 'telemetry' | 'pipelining' | 'monitoring' | 'database' | 'logs' | 'audit';

interface SectionMeta {
  id: SectionType;
  number: number;
  titleEn: string;
  titleMr: string;
  icon: MaterialIconName;
  badge: string;
}

export const PipelineFlowView: React.FC = () => {
  const { language } = useDashboardStore();
  const [activeSection, setActiveSection] = useState<SectionType>('pipelining');

  // Dropdown States for Sections
  const [telemetryDistrict, setTelemetryDistrict] = useState<string>('All');
  const [monitoringWindow, setMonitoringWindow] = useState<string>('Live 15m');
  const [dbTarget, setDbTarget] = useState<string>('Primary TimescaleDB');
  const [logLevel, setLogLevel] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');
  const [auditActor, setAuditActor] = useState<string>('All Officers');

  // 100 Logs and 100 Audits Dynamic State with Live Feeding
  const [logs, setLogs] = useState<LogItem[]>(generate100Logs);
  const [audits, setAudits] = useState<AuditItem[]>(generate100Audits);
  const [liveLogsActive, setLiveLogsActive] = useState<boolean>(true);
  const [liveAuditsActive, setLiveAuditsActive] = useState<boolean>(true);
  const [lastNewLogId, setLastNewLogId] = useState<string | null>(null);
  const [lastNewAuditId, setLastNewAuditId] = useState<string | null>(null);

  // Live Feeding Loop for Logs (2.4s interval)
  useEffect(() => {
    if (!liveLogsActive) return;
    let counter = 101;
    const interval = setInterval(() => {
      const newLog = generateNextLiveLog(counter++);
      setLastNewLogId(newLog.id);
      setLogs((prev) => [newLog, ...prev]);
    }, 2400);
    return () => clearInterval(interval);
  }, [liveLogsActive]);

  // Live Feeding Loop for Audit (3.8s interval)
  useEffect(() => {
    if (!liveAuditsActive) return;
    let counter = 101;
    const interval = setInterval(() => {
      const newAudit = generateNextLiveAudit(counter++);
      setLastNewAuditId(newAudit.id);
      setAudits((prev) => [newAudit, ...prev]);
    }, 3800);
    return () => clearInterval(interval);
  }, [liveAuditsActive]);

  const sections: SectionMeta[] = [
    { id: 'telemetry', number: 1, titleEn: 'Telemetry (Animated Flow)', titleMr: 'दूरमिती प्रवाह (ॲनिमेटेड)', icon: 'podcasts', badge: '5 Gateways Live' },
    { id: 'pipelining', number: 2, titleEn: 'Pipelining (Animated Flow)', titleMr: 'पाइपलाइन प्रवाह (ॲनिमेटेड)', icon: 'layers', badge: '6 Stages Live' },
    { id: 'monitoring', number: 3, titleEn: 'Monitoring', titleMr: 'देखरेख व मॉनिटरिंग', icon: 'bar_chart', badge: '99.98% SLA' },
    { id: 'database', number: 4, titleEn: 'Database', titleMr: 'डेटाबेस व्यवस्थापन', icon: 'dns', badge: 'TimescaleDB' },
    { id: 'logs', number: 5, titleEn: 'Logs', titleMr: 'प्रणाली नोंदी', icon: 'description', badge: 'Live Stream' },
    { id: 'audit', number: 6, titleEn: 'Audit', titleMr: 'सुरक्षा व पडताळणी ऑडिट', icon: 'verified_user', badge: 'Tamper-Proof' },
  ];

  return (
    <div className="space-y-5">

      {/* 
        HORIZONTAL 6-SECTION DROPDOWN / SWITCHER BAR:
        Allows switching between Telemetry, Pipelining, Monitoring, Database, Logs, Audit
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-3 shadow-2xs">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {sections.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gov-primary text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono font-bold ${
                      isActive ? 'bg-amber-400 text-slate-900' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {sec.number}
                  </span>
                  <MaterialIcon name={sec.icon} size="xs" />
                  <span>{language === 'mr' ? sec.titleMr : sec.titleEn}</span>
                  <span
                    className={`text-[10px] font-normal px-1.5 py-0.2 rounded hidden sm:inline ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sec.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contextual Dropdown for the currently active section */}
          <div className="flex items-center gap-2 shrink-0">
            {activeSection === 'telemetry' && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-300 px-2 py-1 rounded">
                <span className="text-slate-500 font-medium">
                  {language === 'mr' ? 'जिल्हा गेटवे:' : 'District Gateway:'}
                </span>
                <select
                  value={telemetryDistrict}
                  onChange={(e) => setTelemetryDistrict(e.target.value)}
                  className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
                >
                  <option value="All">
                    {language === 'mr' ? 'सर्व जिल्हे' : 'All Districts'}
                  </option>
                  <option value="Thane">
                    {language === 'mr' ? 'ठाणे (THN-01)' : 'Thane (THN-01)'}
                  </option>
                  <option value="Raigad">
                    {language === 'mr' ? 'रायगड (RGD-02)' : 'Raigad (RGD-02)'}
                  </option>
                  <option value="Palghar">
                    {language === 'mr' ? 'पालघर (PLG-03)' : 'Palghar (PLG-03)'}
                  </option>
                  <option value="Ratnagiri">
                    {language === 'mr' ? 'रत्नागिरी (RTG-04)' : 'Ratnagiri (RTG-04)'}
                  </option>
                  <option value="Sindhudurg">
                    {language === 'mr' ? 'सिंधुदुर्ग (SND-05)' : 'Sindhudurg (SND-05)'}
                  </option>
                </select>
              </div>
            )}

            {activeSection === 'pipelining' && (
              <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>DAG: 6 STAGES STREAMING (1,480 ev/min)</span>
              </div>
            )}

            {activeSection === 'monitoring' && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-300 px-2 py-1 rounded">
                <span className="text-slate-500 font-medium">Metrics Window:</span>
                <select
                  value={monitoringWindow}
                  onChange={(e) => setMonitoringWindow(e.target.value)}
                  className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
                >
                  <option value="Live 15m">Live (Last 15 Mins)</option>
                  <option value="Last 1 Hour">Last 1 Hour</option>
                  <option value="Last 24 Hours">Last 24 Hours</option>
                </select>
              </div>
            )}

            {activeSection === 'database' && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-300 px-2 py-1 rounded">
                <span className="text-slate-500 font-medium">Cluster Target:</span>
                <select
                  value={dbTarget}
                  onChange={(e) => setDbTarget(e.target.value)}
                  className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
                >
                  <option value="Primary TimescaleDB">Primary TimescaleDB</option>
                  <option value="Read-Replica 01">Read-Replica 01</option>
                  <option value="Redis Cache Buffer">Redis Cache Buffer</option>
                  <option value="S3 Government Glacier">S3 Glacier Archive</option>
                </select>
              </div>
            )}

            {activeSection === 'logs' && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-300 px-2 py-1 rounded">
                <span className="text-slate-500 font-medium">Log Level:</span>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
                >
                  <option value="ALL">ALL Levels</option>
                  <option value="INFO">INFO Only</option>
                  <option value="WARN">WARN Warnings</option>
                  <option value="ERROR">ERROR Faults</option>
                </select>
              </div>
            )}

            {activeSection === 'audit' && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-300 px-2 py-1 rounded">
                <span className="text-slate-500 font-medium">Clearance Actor:</span>
                <select
                  value={auditActor}
                  onChange={(e) => setAuditActor(e.target.value)}
                  className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
                >
                  <option value="All Officers">All Authenticated Officers</option>
                  <option value="State DG">State DG (Dr. Arvind M. Gokhale)</option>
                  <option value="Divisional Director">Divisional Director (Rudresh Kumar Sawant)</option>
                  <option value="Palghar DM">Palghar DM (Vikram S. Mahajan)</option>
                  <option value="System Auto-Daemon">System Auto-Daemon</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        SECTION 2: PIPELINING — HYPER-DETAILED ANIMATED FLOW
      */}
      {activeSection === 'pipelining' && (
        <div className="animate-in fade-in duration-200">
          <AnimatedPipelineDiagram />
        </div>
      )}

      {/* 
        SECTION 1: TELEMETRY — ANIMATED TOPOLOGY & MESH FLOW
      */}
      {activeSection === 'telemetry' && (
        <div className="animate-in fade-in duration-200">
          <AnimatedTelemetryMesh
            selectedDistrictFilter={telemetryDistrict}
            onDistrictSelect={setTelemetryDistrict}
          />
        </div>
      )}

      {/* 
        SECTION 3: MONITORING (If selected)
      */}
      {activeSection === 'monitoring' && (
        <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-gov-primary">
                {language === 'mr' ? 'थेट पायाभूत सुविधा देखरेख व मेट्रिक्स' : 'Live Infrastructure Monitoring'}
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Window: <span className="font-bold text-gov-primary">{monitoringWindow}</span>
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
              SLA 99.98%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">CPU Cores Load</span>
              <div className="text-lg font-bold font-mono text-gov-primary mt-1">28.4%</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">Memory Allocation</span>
              <div className="text-lg font-bold font-mono text-gov-primary mt-1">4.2 / 16 GB</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">Throughput IOPS</span>
              <div className="text-lg font-bold font-mono text-gov-primary mt-1">480 IOPS</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] text-slate-500 font-medium">Active Workers</span>
              <div className="text-lg font-bold font-mono text-emerald-700 mt-1">8 / 8 Online</div>
            </div>
          </div>
        </div>
      )}

      {/* 
        SECTION 4: DATABASE (If selected)
      */}
      {activeSection === 'database' && (
        <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-gov-primary">
                {language === 'mr' ? 'डेटाबेस कनेक्टिव्हिटी व साठा स्थिती' : 'Database Storage & Pool Status'}
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Cluster: <span className="font-bold text-gov-primary">{dbTarget}</span>
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
              Connections: 42/60 Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 font-medium">Telemetry Events Table</span>
              <div className="text-xl font-bold font-mono text-gov-primary mt-1">3,428,910 rows</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 font-medium">Disk Footprint (Hot)</span>
              <div className="text-xl font-bold font-mono text-gov-primary mt-1">48.6 / 100 GB</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-500 font-medium">Write Latency (p95)</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">1.8 ms</div>
            </div>
          </div>
        </div>
      )}

      {/* 
        SECTION 5: LOGS (If selected)
      */}
      {activeSection === 'logs' && (
        <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gov-primary">
                  {language === 'mr' ? 'ॲप्लिकेशन प्रणाली लॉग प्रवाह' : 'Application Logs Stream'}
                </h3>
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
                  <span>Live Feed: {liveLogsActive ? 'FEEDING (2.4s)' : 'PAUSED'}</span>
                </button>
              </div>
              <p className="text-xs text-content-secondary mt-0.5">
                Real-time server log stream ({logs.length} records in memory, live auto-feeding)
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search 100+ logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="px-2.5 py-1 bg-surface border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-blue/20"
              />
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                {logs.filter((l) => logLevel === 'ALL' || l.level === logLevel).length} shown
              </span>
            </div>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-lg p-4 font-mono text-xs max-h-[440px] overflow-y-auto space-y-1.5 border border-slate-800 scroll-smooth">
            {logs
              .filter((l) => {
                const matchesLevel = logLevel === 'ALL' || l.level === logLevel;
                const matchesSearch =
                  !logSearch ||
                  l.message.toLowerCase().includes(logSearch.toLowerCase()) ||
                  l.module.toLowerCase().includes(logSearch.toLowerCase());
                return matchesLevel && matchesSearch;
              })
              .map((lg) => {
                const isNew = lg.id === lastNewLogId;
                const levelColor =
                  lg.level === 'ERROR'
                    ? 'text-rose-400 bg-rose-950/40 border-rose-800'
                    : lg.level === 'WARN'
                    ? 'text-amber-400 bg-amber-950/40 border-amber-800'
                    : 'text-emerald-400 bg-emerald-950/40 border-emerald-800';

                return (
                  <div
                    key={lg.id}
                    className={`flex items-start gap-2.5 py-1 px-1.5 rounded transition-colors duration-300 border-b border-slate-900/80 ${
                      isNew
                        ? 'bg-emerald-950/70 border border-emerald-500 animate-in fade-in slide-in-from-top-2 duration-300'
                        : 'hover:bg-slate-900/70'
                    }`}
                  >
                    <span className="text-slate-500 shrink-0 text-[11px]">{lg.timestamp}</span>
                    <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${levelColor}`}>
                      {lg.level}
                    </span>
                    <span className="text-amber-300 font-bold shrink-0">[{lg.module}]</span>
                    <span className="text-slate-500 text-[10px] shrink-0">({lg.thread})</span>
                    <span className="text-slate-300 flex-1 break-words">{lg.message}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 
        SECTION 6: AUDIT (If selected)
      */}
      {activeSection === 'audit' && (
        <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gov-primary">
                  {language === 'mr' ? 'सुरक्षा व प्रशासकीय कृती ऑडिट इतिहास' : 'Security & Action Audit Trail'}
                </h3>
                <button
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
                  <span>Live Audit: {liveAuditsActive ? 'FEEDING (3.8s)' : 'PAUSED'}</span>
                </button>
              </div>
              <p className="text-xs text-content-secondary mt-0.5">
                Actor Filter: <span className="font-bold text-gov-primary">{auditActor}</span> ({audits.length} records in memory)
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-300">
              Integrity: Cryptographically Signed
            </span>
          </div>

          <div className="overflow-x-auto border border-borderLine-standard rounded-lg max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 shadow-2xs">
                <tr>
                  <th className="py-2.5 px-3 bg-slate-100">Audit ID</th>
                  <th className="py-2.5 px-3 bg-slate-100">Timestamp</th>
                  <th className="py-2.5 px-3 bg-slate-100">Officer / Actor</th>
                  <th className="py-2.5 px-3 bg-slate-100">Role & Clearance</th>
                  <th className="py-2.5 px-3 bg-slate-100">Action Description</th>
                  <th className="py-2.5 px-3 bg-slate-100">Module</th>
                  <th className="py-2.5 px-3 bg-slate-100">IP Address</th>
                  <th className="py-2.5 px-3 bg-slate-100">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {audits
                  .filter((aud) => {
                    if (auditActor === 'All Officers') return true;
                    if (auditActor === 'State DG') return aud.actor.includes('Gokhale');
                    if (auditActor === 'Divisional Director') return aud.actor.includes('Sawant') || aud.actor.includes('Rudresh');
                    if (auditActor === 'Palghar DM') return aud.actor.includes('Mahajan');
                    if (auditActor === 'System Auto-Daemon') return aud.actor.includes('System');
                    return true;
                  })
                  .map((aud) => {
                    const isNew = aud.id === lastNewAuditId;

                    return (
                      <tr
                        key={aud.id}
                        className={`transition-colors duration-300 ${
                          isNew
                            ? 'bg-amber-100/80 animate-in fade-in slide-in-from-top-2 duration-300'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{aud.id}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{aud.timestamp}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{aud.actor}</td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{aud.clearance}</td>
                        <td className="py-2.5 px-3 text-slate-800">{aud.action}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-300">
                            {aud.module}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{aud.ip}</td>
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
      )}
    </div>
  );
};

export default PipelineFlowView;
