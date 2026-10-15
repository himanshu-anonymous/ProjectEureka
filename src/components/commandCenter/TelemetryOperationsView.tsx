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
import { AnimatedTelemetryMesh } from '@/components/commandCenter/AnimatedTelemetryMesh';
import { AnimatedPipelineDiagram } from '@/components/commandCenter/AnimatedPipelineDiagram';

type TelemetryModule =
  | 'telemetry'
  | 'filtration'
  | 'pipelining'
  | 'monitoring'
  | 'database'
  | 'logs'
  | 'audit';

interface ModuleDef {
  id: TelemetryModule;
  number: number;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  icon: MaterialIconName;
  badge: string;
}

export const TelemetryOperationsView: React.FC = () => {
  const { language } = useDashboardStore();
  const [activeModule, setActiveModule] = useState<TelemetryModule>('telemetry');
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');

  // 100 Initial Data Items with Live Feeding States
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

  const modules: ModuleDef[] = [
    {
      id: 'telemetry',
      number: 1,
      titleEn: 'Telemetry',
      titleMr: 'दूरमिती (Telemetry)',
      descEn: 'Telemetry overview and incoming data status',
      descMr: 'दूरमिती आढावा आणि थेट येणारा डेटा प्रवाह स्थिती',
      icon: 'podcasts',
      badge: '5 Nodes Active',
    },
    {
      id: 'filtration',
      number: 2,
      titleEn: 'Filtration',
      titleMr: 'गाळणी (Filtration)',
      descEn: 'Filter rules, data validation and filtering status',
      descMr: 'गाळणी नियम, डेटा प्रमाणीकरण आणि फिल्टर स्थिती',
      icon: 'alt_route',
      badge: '14 Active Rules',
    },
    {
      id: 'pipelining',
      number: 3,
      titleEn: 'Pipelining',
      titleMr: 'पाइपलाइन (Pipelining)',
      descEn: 'Pipeline configuration, execution and processing status',
      descMr: 'पाइपलाइन रचना, अंमलबजावणी व प्रक्रिया स्थिती',
      icon: 'layers',
      badge: '1,480 ev/min',
    },
    {
      id: 'monitoring',
      number: 4,
      titleEn: 'Monitoring',
      titleMr: 'देखरेख (Monitoring)',
      descEn: 'Live metrics, health checks and alerts',
      descMr: 'थेट मेट्रिक्स, प्रणाली आरोग्य तपासणी व सूचना',
      icon: 'bar_chart',
      badge: '99.98% Health',
    },
    {
      id: 'database',
      number: 5,
      titleEn: 'Database',
      titleMr: 'डेटाबेस (Database)',
      descEn: 'Database connectivity, storage and records',
      descMr: 'डेटाबेस कनेक्टिव्हिटी, साठवणूक आणि नोंदी',
      icon: 'dns',
      badge: 'TimescaleDB Active',
    },
    {
      id: 'logs',
      number: 6,
      titleEn: 'Logs',
      titleMr: 'नोंदी (Logs)',
      descEn: 'Application logs, errors and processing history',
      descMr: 'ॲप्लिकेशन लॉग्स, त्रुटी आणि प्रक्रिया इतिहास',
      icon: 'description',
      badge: 'Real-Time Stream',
    },
    {
      id: 'audit',
      number: 7,
      titleEn: 'Audit',
      titleMr: 'ऑडिट (Audit)',
      descEn: 'User actions, configuration changes and audit history',
      descMr: 'वापरकर्ता कृती, बदल आणि सुरक्षा ऑडिट इतिहास',
      icon: 'verified_user',
      badge: 'Tamper-Proof Log',
    },
  ];

  // Dummy District Telemetry Nodes
  const districtNodes = [
    { id: 'THN-01', name: 'Thane Division Central', district: 'Thane', latency: '12ms', status: 'Online', rate: '420 ev/min', packets: '1.2M' },
    { id: 'RGD-02', name: 'Raigad Coastal Gateway', district: 'Raigad', latency: '18ms', status: 'Online', rate: '280 ev/min', packets: '840K' },
    { id: 'PLG-03', name: 'Palghar Tribal Corridor Node', district: 'Palghar', latency: '22ms', status: 'Online', rate: '195 ev/min', packets: '610K' },
    { id: 'RTG-04', name: 'Ratnagiri Maritime Port Gateway', district: 'Ratnagiri', latency: '25ms', status: 'Online', rate: '210 ev/min', packets: '690K' },
    { id: 'SND-05', name: 'Sindhudurg South Coastal Node', district: 'Sindhudurg', latency: '28ms', status: 'Online', rate: '160 ev/min', packets: '480K' },
  ];

  // Dummy Filter Rules
  const filterRules = [
    { id: 'RULE-101', name: 'Critical Disaster / Flood Misinfo Suppressor', category: 'Emergency', matchRate: '99.8%', actions: 'Flag & Isolate', status: 'Active' },
    { id: 'RULE-102', name: 'Konkan Geographic Boundary Validator (GIS)', category: 'Validation', matchRate: '100%', actions: 'Tag District ID', status: 'Active' },
    { id: 'RULE-103', name: '15-Minute Broadcast Duplicate De-duplicator', category: 'Sanitization', matchRate: '94.2%', actions: 'Drop Redundant', status: 'Active' },
    { id: 'RULE-104', name: 'Source Credibility < 60% Auto-Triage', category: 'Security', matchRate: '98.5%', actions: 'Send to Fact-Check', status: 'Active' },
    { id: 'RULE-105', name: 'Devanagari Unicode Normalization Engine', category: 'Format', matchRate: '100%', actions: 'Normalize Text', status: 'Active' },
  ];

  // Filtered Logs from dynamic 100+ live logs state
  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logFilter === 'ALL' || log.level === logFilter;
    const matchesSearch =
      !logSearch ||
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(logSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* 
        MODULE NAVIGATION BAR:
        Clickable modules allowing instant switching within the same page
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {modules.map((m) => {
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
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
                  {m.number}
                </span>
                <MaterialIcon name={m.icon} size="xs" />
                <span>{language === 'mr' ? m.titleMr : m.titleEn}</span>
                <span
                  className={`text-[10px] font-normal px-1.5 py-0.2 rounded hidden sm:inline ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        MODULE CONTENT CONTAINER:
        Renders the active module directly within this main page
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs">
        {/* Module 1: Telemetry */}
        {activeModule === 'telemetry' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Live Animated Telemetry Mesh & Topology Flow (Light Government Theme) */}
            <AnimatedTelemetryMesh embedded={true} />

            {/* District Ingestion Nodes Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Active Konkan District Telemetry Gateways
              </h3>
              <div className="overflow-x-auto border border-borderLine-standard rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">Node ID</th>
                      <th className="py-2.5 px-3">Gateway Name</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Latency</th>
                      <th className="py-2.5 px-3">Rate</th>
                      <th className="py-2.5 px-3">Total Ingested</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {districtNodes.map((node) => (
                      <tr key={node.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{node.id}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{node.name}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                            {node.district}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {node.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{node.latency}</td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{node.rate}</td>
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
                  Rule execution status, payload sanitization, GIS geofencing validation, and anomaly rejection
                </p>
              </div>
              <button className="px-3 py-1.5 rounded bg-gov-primary text-white hover:bg-gov-primary-dark text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
                <MaterialIcon name="add" size="xs" />
                <span>+ Define Filter Rule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-emerald-800 font-medium">Validation Pass Rate</span>
                <div className="text-xl font-bold font-mono text-emerald-900 mt-1">99.4%</div>
                <p className="text-[10px] text-emerald-700 mt-0.5">Payloads conforming to DGIPR schema</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-[11px] text-amber-800 font-medium">Blocked Anomalies Today</span>
                <div className="text-xl font-bold font-mono text-amber-900 mt-1">42</div>
                <p className="text-[10px] text-amber-700 mt-0.5">Quarantined for verification desk</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-700 font-medium">De-duplication Ratio</span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">1:4.8</div>
                <p className="text-[10px] text-slate-600 mt-0.5">Redundant broadcasts compressed</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-borderLine-standard rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3">Rule ID</th>
                    <th className="py-2.5 px-3">Filter Rule Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Pass / Match</th>
                    <th className="py-2.5 px-3">Action Enforced</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filterRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{rule.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{rule.name}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-300">
                          {rule.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{rule.matchRate}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{rule.actions}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                          {rule.status}
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
                  Worker Pool Configuration
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Concurrency Workers:</span>
                    <span className="font-mono font-bold text-slate-900">8 Threads</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Max Batch Buffer Size:</span>
                    <span className="font-mono font-bold text-slate-900">500 payloads</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Pipeline Auto-Restart:</span>
                    <span className="font-bold text-emerald-700">Enabled (Self-Healing)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <h4 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                  Performance & SLA Constraints
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Max Allowable End-to-End Latency:</span>
                    <span className="font-mono font-bold text-slate-900">&lt; 150 ms</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Current Measured Latency:</span>
                    <span className="font-mono font-bold text-emerald-700">49.0 ms</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span>Memory Allocation per Worker:</span>
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
                  Infrastructure telemetry, daemon heartbeat monitor, SLA compliance, and threshold alarms
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
                System Status: NOMINAL
              </span>
            </div>

            {/* System Resource Gauges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Cluster CPU Utilization</span>
                <div className="text-lg font-bold font-mono text-gov-primary mt-1">28.4%</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[28%]"></div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">RAM Allocation</span>
                <div className="text-lg font-bold font-mono text-gov-primary mt-1">4.2 / 16 GB</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[26%]"></div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Network Inbound / Outbound</span>
                <div className="text-lg font-bold font-mono text-gov-primary mt-1">14.8 MB/s</div>
                <span className="text-[10px] text-slate-500">Outbound: 2.1 MB/s</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">SLA Availability (30d)</span>
                <div className="text-lg font-bold font-mono text-emerald-700 mt-1">99.98%</div>
                <span className="text-[10px] text-emerald-600 font-semibold">0 Unplanned Outages</span>
              </div>
            </div>

            {/* Health Log Entries */}
            <div className="border border-borderLine-standard rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 font-bold text-xs text-slate-700 uppercase tracking-wider">
                Automated Infrastructure Alarms & Health Check Events
              </div>
              <div className="divide-y divide-slate-200 text-xs">
                <div className="p-3 flex items-start gap-3 hover:bg-slate-50">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 mt-0.5">
                    HEALTH_OK
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      All 5 Konkan district ingestion daemons reported nominal heartbeats at 17:02:00.
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">Today at 17:02:00 IST</span>
                  </div>
                </div>
                <div className="p-3 flex items-start gap-3 hover:bg-slate-50">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 mt-0.5">
                    WARN_HEALED
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      Ratnagiri gateway reconnect after minor 2s network jitter. Failover buffer flushed cleanly.
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">Today at 16:48:12 IST</span>
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
                  Primary state datastore, read/write IOPS, active connections, and archival data retention
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
                Cluster: CONNECTED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Active Connection Pool</span>
                <div className="text-xl font-bold font-mono text-gov-primary mt-1">42 / 60</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Connection pool headroom: 30%</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Total Stored Records</span>
                <div className="text-xl font-bold font-mono text-gov-primary mt-1">3,428,910</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Telemetry & press records</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Storage Allocated</span>
                <div className="text-xl font-bold font-mono text-gov-primary mt-1">48.6 / 100 GB</div>
                <p className="text-[10px] text-slate-500 mt-0.5">48.6% hot storage capacity</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg text-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-amber-400 font-bold">DATABASE TOPOLOGY & CREDENTIAL CONTEXT</span>
                <span className="text-emerald-400">sslmode=verify-full</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>Primary Host: <span className="text-white">timescale-primary.dgipr-mumbai.gov.in:5432</span></div>
                <div>Read Replica: <span className="text-white">timescale-read-01.dgipr-konkan.gov.in:5432</span></div>
                <div>Query Latency (p95): <span className="text-emerald-400 font-bold">1.8 ms</span></div>
                <div>Write IOPS: <span className="text-emerald-400 font-bold">480 IOPS</span></div>
                <div>Retention Period: <span className="text-white">90 Days Hot • 365 Days S3 Glacier</span></div>
                <div>Encryption: <span className="text-white">AES-256 at Rest & TLS 1.3 in Flight</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Module 6: Logs */}
        {activeModule === 'logs' && (
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
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        liveLogsActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
                      }`}
                    ></span>
                    <span>Live Feed: {liveLogsActive ? 'ACTIVE (2.4s)' : 'PAUSED'}</span>
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
            <div className="bg-slate-950 text-slate-200 rounded-lg p-3.5 font-mono text-xs overflow-x-auto max-h-[440px] overflow-y-auto space-y-1.5 border border-slate-800 scroll-smooth">
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
                    className={`flex items-start gap-2.5 py-1 px-1.5 rounded transition-colors duration-300 border-b border-slate-900/80 ${
                      isNew
                        ? 'bg-emerald-950/70 border border-emerald-500 animate-in fade-in slide-in-from-top-2 duration-300'
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
        )}

        {/* Module 7: Audit */}
        {activeModule === 'audit' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gov-primary">
                    {language === 'mr' ? '७. वापरकर्ता कृती, बदल आणि सुरक्षा ऑडिट इतिहास' : '7. User Actions, Configuration Changes & Audit History'}
                  </h2>
                  <button
                    onClick={() => setLiveAuditsActive(!liveAuditsActive)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      liveAuditsActive
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        liveAuditsActive ? 'bg-amber-500 animate-ping' : 'bg-slate-400'
                      }`}
                    ></span>
                    <span>Live Audit: {liveAuditsActive ? 'FEEDING (3.8s)' : 'PAUSED'}</span>
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

            <div className="overflow-x-auto border border-borderLine-standard rounded-lg max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 font-bold border-b border-slate-300 shadow-2xs">
                  <tr>
                    <th className="py-2.5 px-3 bg-slate-100">Audit ID</th>
                    <th className="py-2.5 px-3 bg-slate-100">Timestamp</th>
                    <th className="py-2.5 px-3 bg-slate-100">Officer / Actor</th>
                    <th className="py-2.5 px-3 bg-slate-100">Role & Clearance</th>
                    <th className="py-2.5 px-3 bg-slate-100">Action Description</th>
                    <th className="py-2.5 px-3 bg-slate-100">Target Module</th>
                    <th className="py-2.5 px-3 bg-slate-100">IP Address</th>
                    <th className="py-2.5 px-3 bg-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {audits.map((aud) => {
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
    </div>
  );
};

export default TelemetryOperationsView;
