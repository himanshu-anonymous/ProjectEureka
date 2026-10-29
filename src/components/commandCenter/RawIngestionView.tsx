'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ClickableEndpoint } from '@/components/commandCenter/TelemetryOperationsView';

interface IngestionSourceConfig {
  id: string;
  name: string;
  channelType: 'Broadcast TV' | 'Print OCR' | 'API Webhook' | 'RSS Wire';
  district: string;
  endpoint: string;
  interval: string;
  status: 'Active' | 'Paused';
}

export const RawIngestionView: React.FC = () => {
  const { language } = useDashboardStore();
  const [retriedIds, setRetriedIds] = useState<string[]>([]);

  // 1. Source Configurations
  const [sources] = useState<IngestionSourceConfig[]>([
    { id: 'SRC-01', name: 'ABP Majha Live Telemetry', channelType: 'Broadcast TV', district: 'Statewide', endpoint: 'rtsp://ingest.abp.maharashtra.gov.in/live', interval: 'Live Realtime', status: 'Active' },
    { id: 'SRC-02', name: 'Lokmat Regional Edition OCR Scan', channelType: 'Print OCR', district: 'Thane & Raigad', endpoint: 's3://ocr-scans.dgi.gov.in/lokmat/', interval: 'Every 15 mins', status: 'Active' },
    { id: 'SRC-03', name: 'TV9 Marathi Broadcast Feed', channelType: 'Broadcast TV', district: 'Statewide', endpoint: 'rtsp://ingest.tv9.maharashtra.gov.in/feed', interval: 'Live Realtime', status: 'Active' },
    { id: 'SRC-04', name: 'PTI Bhasha Realtime Wire', channelType: 'RSS Wire', district: 'All Maharashtra', endpoint: 'https://wire.ptinews.com/v2/stream', interval: 'Webhook push', status: 'Active' },
    { id: 'SRC-05', name: 'Palghar Collectorate Media Desk', channelType: 'API Webhook', district: 'Palghar', endpoint: 'https://palghar.gov.in/api/v1/releases', interval: 'Every 5 mins', status: 'Active' },
    { id: 'SRC-06', name: 'Sindhudurg Regional News Feed', channelType: 'Print OCR', district: 'Sindhudurg', endpoint: 's3://ocr-scans.dgi.gov.in/sindhudurg/', interval: 'Every 30 mins', status: 'Active' },
  ]);

  // Processing Failures & Retry Management
  const failureRecords = [
    {
      id: 'ERR-4029',
      source: 'Ratnagiri Local Cable Feed',
      district: 'Ratnagiri',
      reason: 'Low OCR character confidence score (38% < 50% threshold)',
      attempts: '2 / 3',
      timestamp: '16:58:12',
    },
    {
      id: 'ERR-4030',
      source: 'Palghar Tribal Community Radio',
      district: 'Palghar',
      reason: 'Temporary HTTP Gateway Timeout (504 Gateway)',
      attempts: '1 / 3',
      timestamp: '16:55:04',
    },
  ];

  const handleManualRetry = (id: string) => {
    if (!retriedIds.includes(id)) {
      setRetriedIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 
        HEADER KPI RIBBON:
        Live View | Sources | Real-time Raw Data | Ingestion Errors
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Live View */}
        <div className="bg-surface border border-borderLine-standard p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'थेट दृश्य' : 'Live View'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-bold font-mono text-gov-primary mt-1">18 Sources</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">6 TV, 5 OCR, 4 API, 3 Wire</p>
        </div>

        {/* 2. Sources */}
        <div className="bg-surface border border-borderLine-standard p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'अंतर्ग्रहण स्थिती' : 'Ingestion Status'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>98.2% Operational</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">Operational</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">2 Degraded • 0 Blocked</p>
        </div>

        {/* 3. Real-time Raw Data */}
        <div className="bg-surface border border-borderLine-standard p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'कच्चा डेटा नोंदी' : 'Real-time Raw Data'}
            </span>
            <MaterialIcon name="refresh" size="xs" spin className="text-gov-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-gov-primary mt-1">1,428,910</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">+1,480 events/min velocity</p>
        </div>

        {/* 4. Ingestion Errors */}
        <div className="bg-surface border border-borderLine-standard p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'त्रुटी व अलर्ट' : 'Ingestion Errors'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Alerts</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">3 Retried</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">0 Dropped (Self-Healed 100%)</p>
        </div>
      </div>

      {/* 
        SECTION 1: Source Configuration (Without Redundant Status Column, Clean Widths, Clean Button)
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="dns" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? '१. अंतर्ग्रहण स्त्रोत रचना' : '1. Ingestion Source Configuration'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Active media broadcast feeds, OCR camera endpoints, and government API listeners
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded bg-gov-primary text-white hover:bg-gov-primary-dark text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <MaterialIcon name="add" size="xs" />
            <span>Connect New Ingestion Source</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-bold border-b border-slate-200 shadow-xs">
              <tr>
                <th className="py-2.5 px-3 bg-slate-50 w-[14%]">Source ID</th>
                <th className="py-2.5 px-3 bg-slate-50 w-[26%]">Channel / Feeder Name</th>
                <th className="py-2.5 px-3 bg-slate-50 w-[14%]">Type</th>
                <th className="py-2.5 px-3 bg-slate-50 w-[16%]">District Target</th>
                <th className="py-2.5 px-3 bg-slate-50 w-[30%]">Endpoint URI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{src.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{src.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                      {src.channelType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                      {src.district}
                    </span>
                  </td>
                  {/* Clickable Endpoint with styled pill & open-URL icon */}
                  <td className="py-2.5 px-3">
                    <ClickableEndpoint url={src.endpoint} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 
        SECTION 2: Ingestion Pipeline Status
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="sync" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? '२. अंतर्ग्रहण पाइपलाइन स्थिती' : '2. Ingestion Pipeline Status'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Live multi-stage execution pipeline throughput, worker health, and buffer depth
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Buffer Pressure: 18% (Optimal)</span>
          </span>
        </div>

        {/* Pipeline Stage Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { step: '1. Ingestion', status: 'Healthy', metric: '1,480 ev/min', latency: '3.8 ms', color: 'emerald' },
            { step: '2. Tokenize & Clean', status: 'Healthy', metric: 'Devanagari UTF-8', latency: '12.4 ms', color: 'emerald' },
            { step: '3. NLP Scoring', status: 'Healthy', metric: 'Sentiment & Impact', latency: '18.1 ms', color: 'emerald' },
            { step: '4. Validation Check', status: 'Healthy', metric: 'GIS Boundary Filter', latency: '8.2 ms', color: 'emerald' },
            { step: '5. DB Persistence', status: 'Healthy', metric: 'Timescale / Redis', latency: '4.9 ms', color: 'emerald' },
          ].map((st, i) => (
            <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gov-primary">{st.step}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-2">{st.metric}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <span>Latency:</span>
                <span className="font-mono font-bold text-slate-700">{st.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        SECTION 3: Processing Failures and Retry Management (Expanded Full-Width, 2-Column Grid)
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="warning" size="xs" className="text-amber-600" />
              <span>{language === 'mr' ? '३. प्रक्रिया त्रुटी व पुनर्प्रयत्न' : '3. Processing Failures & Retry'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Transient ingestion faults, dead-letter queue and automatic/manual retry triage
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>{failureRecords.length} Active Faults</span>
          </span>
        </div>

        {/* Error cards side-by-side in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {failureRecords.map((fail) => {
            const isRetried = retriedIds.includes(fail.id);

            return (
              <div
                key={fail.id}
                className="p-4 bg-amber-50/50 border border-amber-200/90 rounded-xl text-xs space-y-2 hover:border-amber-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-700 text-xs whitespace-nowrap">
                      {fail.id}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {fail.source}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {fail.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                    {fail.district}
                  </span>
                  <span className="text-slate-600 font-medium">{fail.reason}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-[11px]">
                  <span className="font-mono text-slate-500 font-medium">
                    Retry Attempts: <strong className="text-slate-700">{fail.attempts}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleManualRetry(fail.id)}
                    disabled={isRetried}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs ${
                      isRetried
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : 'bg-gov-primary hover:bg-gov-primary-dark text-white'
                    }`}
                  >
                    {isRetried ? '✓ Retried & Queued' : 'Retry Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 
        SECTION 4: Ingestion Logs and Timestamps (Full-Width at Bottom)
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="schedule" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? '४. अंतर्ग्रहण नोंदी व वेळांकन' : '4. Ingestion Logs and Timestamps'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Chronological log stream of incoming network events, byte allocations and socket response codes
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-300">
            Log Frequency: Realtime
          </span>
        </div>

        <div className="overflow-x-auto max-h-[480px] overflow-y-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-bold border-b border-slate-200 shadow-xs">
              <tr>
                <th className="py-2.5 px-3 bg-slate-50">Millisecond Timestamp</th>
                <th className="py-2.5 px-3 bg-slate-50">Source Channel</th>
                <th className="py-2.5 px-3 bg-slate-50">Ingestion Event Type</th>
                <th className="py-2.5 px-3 bg-slate-50">Payload Size</th>
                <th className="py-2.5 px-3 bg-slate-50">Processing Latency</th>
                <th className="py-2.5 px-3 bg-slate-50">Status Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white font-mono text-[11px]">
              {[
                { time: '17:04:18.902', src: 'ABP Majha (THN-01)', type: 'INGEST_SUCCESS_PERSISTED', size: '4.8 KB', lat: '18ms', code: '200 OK' },
                { time: '17:04:14.320', src: 'TV9 Marathi (PLG-03)', type: 'OCR_ENRICH_FLAG_MISINFO', size: '6.1 KB', lat: '24ms', code: '200 OK' },
                { time: '17:04:09.112', src: 'Lokmat (RGD-02)', type: 'PAYLOAD_VALIDATED_GIS_MATCH', size: '3.9 KB', lat: '15ms', code: '200 OK' },
                { time: '17:04:01.884', src: 'News18 Lokmat (SND-05)', type: 'BROADCAST_PARSE_STORED', size: '5.2 KB', lat: '21ms', code: '200 OK' },
              ].map((lg, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-600">{lg.time}</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{lg.src}</td>
                  <td className="py-2 px-3 text-gov-primary font-bold">{lg.type}</td>
                  <td className="py-2 px-3 text-slate-700">{lg.size}</td>
                  <td className="py-2 px-3 text-emerald-700 font-bold">{lg.lat}</td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {lg.code}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RawIngestionView;
