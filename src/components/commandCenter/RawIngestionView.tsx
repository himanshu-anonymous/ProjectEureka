'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface IngestionSourceConfig {
  id: string;
  name: string;
  channelType: 'Broadcast TV' | 'Print OCR' | 'API Webhook' | 'RSS Wire';
  district: string;
  endpoint: string;
  interval: string;
  status: 'Active' | 'Paused';
}

interface RawEventRecord {
  id: string;
  timestamp: string;
  source: string;
  district: string;
  byteSize: string;
  headline: string;
  payloadJson: Record<string, unknown>;
}

export const RawIngestionView: React.FC = () => {
  const { language } = useDashboardStore();
  const [streamPaused, setStreamPaused] = useState<boolean>(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('RAW-9011');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [retriedIds, setRetriedIds] = useState<string[]>([]);

  // 1. Source Configurations
  const [sources, setSources] = useState<IngestionSourceConfig[]>([
    { id: 'SRC-01', name: 'ABP Majha Live Telemetry', channelType: 'Broadcast TV', district: 'Konkan All', endpoint: 'rtsp://ingest.abp.maharashtra.gov.in/live', interval: 'Live Realtime', status: 'Active' },
    { id: 'SRC-02', name: 'Lokmat Konkan Edition OCR Scan', channelType: 'Print OCR', district: 'Thane & Raigad', endpoint: 's3://ocr-scans.dgi.gov.in/lokmat/', interval: 'Every 15 mins', status: 'Active' },
    { id: 'SRC-03', name: 'TV9 Marathi Broadcast Feed', channelType: 'Broadcast TV', district: 'Konkan All', endpoint: 'rtsp://ingest.tv9.maharashtra.gov.in/feed', interval: 'Live Realtime', status: 'Active' },
    { id: 'SRC-04', name: 'PTI Bhasha Realtime Wire', channelType: 'RSS Wire', district: 'All Maharashtra', endpoint: 'https://wire.ptinews.com/v2/stream', interval: 'Webhook push', status: 'Active' },
    { id: 'SRC-05', name: 'Palghar Collectorate Media Desk', channelType: 'API Webhook', district: 'Palghar', endpoint: 'https://palghar.gov.in/api/v1/releases', interval: 'Every 5 mins', status: 'Active' },
    { id: 'SRC-06', name: 'Sindhudurg Regional News Feed', channelType: 'Print OCR', district: 'Sindhudurg', endpoint: 's3://ocr-scans.dgi.gov.in/sindhudurg/', interval: 'Every 30 mins', status: 'Active' },
  ]);

  // Toggle source status
  const toggleSourceStatus = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s))
    );
  };

  // 3. Raw Events Stream Records
  const rawEvents: RawEventRecord[] = [
    {
      id: 'RAW-9011',
      timestamp: '17:04:18.902',
      source: 'ABP Majha',
      district: 'Thane',
      byteSize: '4.8 KB',
      headline: 'ठाणे खाडी किनारा महामार्ग कामाचा वेग वाढला; सार्वजनिक बांधकाम विभागाचा पाहणी दौरा',
      payloadJson: {
        raw_event_id: 'RAW-9011',
        ingest_gateway: 'THN-01',
        protocol: 'RTSP-OCR',
        channel: 'ABP Majha',
        timestamp_utc: '2026-10-15T11:34:18.902Z',
        ocr_confidence: 0.96,
        detected_language: 'mr',
        district_id: 'thane',
        headline_raw: 'ठाणे खाडी किनारा महामार्ग कामाचा वेग वाढला; सार्वजनिक बांधकाम विभागाचा पाहणी दौरा',
        entities: ['Thane', 'PWD Minister', 'Coastal Road'],
        checksum_sha256: 'e89c1b988f01a09d3b44b82d73ac90a2',
      },
    },
    {
      id: 'RAW-9012',
      timestamp: '17:04:14.320',
      source: 'TV9 Marathi',
      district: 'Palghar',
      byteSize: '6.1 KB',
      headline: 'डहाणू-तलासरी किनारपट्टी भागात भूकंपाच्या खोट्या अफवांवर विश्वास न ठेवण्याचे आवाहन',
      payloadJson: {
        raw_event_id: 'RAW-9012',
        ingest_gateway: 'PLG-03',
        protocol: 'Broadcast-HLS',
        channel: 'TV9 Marathi',
        timestamp_utc: '2026-10-15T11:34:14.320Z',
        ocr_confidence: 0.94,
        detected_language: 'mr',
        district_id: 'palghar',
        headline_raw: 'डहाणू-तलासरी किनारपट्टी भागात भूकंपाच्या खोट्या अफवांवर विश्वास न ठेवण्याचे आवाहन',
        entities: ['Palghar', 'Dahanu', 'Talasari', 'Disaster Cell'],
        alert_flag: 'MISINFO_RUMOR',
        checksum_sha256: '9a7c33fe884100c2834571ea0099bc18',
      },
    },
    {
      id: 'RAW-9013',
      timestamp: '17:04:09.112',
      source: 'Lokmat',
      district: 'Raigad',
      byteSize: '3.9 KB',
      headline: 'अलिबाग-वडखळ राष्ट्रीय महामार्गाचे रुंदीकरण अंतिम टप्प्यात; जिल्हाधिकाऱ्यांकडून आढावा',
      payloadJson: {
        raw_event_id: 'RAW-9013',
        ingest_gateway: 'RGD-02',
        protocol: 'PDF-OCR',
        channel: 'Lokmat Konkan',
        timestamp_utc: '2026-10-15T11:34:09.112Z',
        ocr_confidence: 0.97,
        detected_language: 'mr',
        district_id: 'raigad',
        headline_raw: 'अलिबाग-वडखळ राष्ट्रीय महामार्गाचे रुंदीकरण अंतिम टप्प्यात; जिल्हाधिकाऱ्यांकडून आढावा',
        checksum_sha256: '3f810aa78d6541bc889021eec4821a39',
      },
    },
    {
      id: 'RAW-9014',
      timestamp: '17:04:01.884',
      source: 'News18 Lokmat',
      district: 'Sindhudurg',
      byteSize: '5.2 KB',
      headline: 'चिपी आंतरराष्ट्रीय विमानतळावरून बंगळुरू व हैदराबाद थेट विमानसेवेची वारंवारता वाढवली',
      payloadJson: {
        raw_event_id: 'RAW-9014',
        ingest_gateway: 'SND-05',
        protocol: 'RTSP-OCR',
        channel: 'News18 Lokmat',
        timestamp_utc: '2026-10-15T11:34:01.884Z',
        ocr_confidence: 0.93,
        detected_language: 'mr',
        district_id: 'sindhudurg',
        headline_raw: 'चिपी आंतरराष्ट्रीय विमानतळावरून बंगळुरू व हैदराबाद थेट विमानसेवेची वारंवारता वाढवली',
        checksum_sha256: '710ae89098bcda441098231eefc78821',
      },
    },
  ];

  // 4. Processing Failures & Retry Management
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

  // Filtered raw events for search
  const filteredEvents = rawEvents.filter((ev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ev.id.toLowerCase().includes(q) ||
      ev.source.toLowerCase().includes(q) ||
      ev.district.toLowerCase().includes(q) ||
      ev.headline.toLowerCase().includes(q)
    );
  });

  const activeRecord = rawEvents.find((r) => r.id === selectedRecordId) || rawEvents[0];

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
              {language === 'mr' ? 'थेट दृश्य (Live View)' : 'Live View'}
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
              {language === 'mr' ? 'अंतर्ग्रहण स्थिती (Sources)' : 'Ingestion Status'}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              100% Online
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">Operational</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">0 Blocked • 0 Degraded</p>
        </div>

        {/* 3. Real-time Raw Data */}
        <div className="bg-surface border border-borderLine-standard p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'कच्चा डेटा नोंदी (Raw Data)' : 'Real-time Raw Data'}
            </span>
            <MaterialIcon name="refresh" size="xs" spin className="text-gov-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-gov-primary mt-1">1,842,910</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">+1,480 events/min velocity</p>
        </div>

        {/* 4. Ingestion Errors */}
        <div className="bg-surface border border-borderLine-standard p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'त्रुटी व अलर्ट (Ingestion Errors)' : 'Ingestion Errors'}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Alerts
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">3 Retried</div>
          <p className="text-xs text-slate-600 mt-1 font-medium">0 Dropped (Self-Healed 100%)</p>
        </div>
      </div>

      {/* 
        SECTION 1: Source Configuration
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="dns" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? '१. स्त्रोत कॉन्फिगरेशन (Source Configuration)' : '1. Ingestion Source Configuration'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Active media broadcast feeds, OCR camera endpoints, and government API listeners
            </p>
          </div>
          <button className="px-3 py-1.5 rounded bg-gov-primary text-white hover:bg-gov-primary-dark text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
            <MaterialIcon name="add" size="xs" />
            <span>+ Connect New Ingestion Source</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-borderLine-standard rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-3">Source ID</th>
                <th className="py-2.5 px-3">Channel / Feeder Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">District Target</th>
                <th className="py-2.5 px-3">Endpoint URI</th>
                <th className="py-2.5 px-3">Polling Rate</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sources.map((src) => (
                <tr key={src.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-gov-primary">{src.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{src.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-300">
                      {src.channelType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                      {src.district}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px] truncate max-w-[220px]">
                    {src.endpoint}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{src.interval}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => toggleSourceStatus(src.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        src.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300'
                      }`}
                    >
                      {src.status === 'Active' ? 'Active' : 'Paused'}
                    </button>
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
              <span>{language === 'mr' ? '२. अंतर्ग्रहण पाइपलाइन स्थिती (Pipeline Status)' : '2. Ingestion Pipeline Status'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Live multi-stage execution pipeline throughput, worker health, and buffer depth
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Buffer Pressure: 18% (Optimal)
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
        SECTION 3 & 4: Raw Event Stream (Left) + Processing Failures & Retries (Right)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section 3: Raw Event or Telemetry Stream (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-borderLine-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
                <MaterialIcon name="podcasts" size="xs" className="text-gov-primary" />
                <span>{language === 'mr' ? '३. थेट कच्चा डेटा प्रवाह (Raw Event Stream)' : '3. Raw Event or Telemetry Stream'}</span>
              </h3>
              <p className="text-[11px] text-content-secondary">
                Live stream of incoming raw broadcast & OCR telemetry packets
              </p>
            </div>
            <button
              onClick={() => setStreamPaused(!streamPaused)}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-colors ${
                streamPaused
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {streamPaused ? 'Resume Stream' : 'Pause Stream'}
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {rawEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setSelectedRecordId(ev.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedRecordId === ev.id
                    ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400/50'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-gov-primary">{ev.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {ev.district}
                    </span>
                    <span className="font-mono text-slate-500">{ev.timestamp}</span>
                  </div>
                </div>
                <p className="font-medium text-slate-900 line-clamp-1">{ev.headline}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                  <span>Source: {ev.source}</span>
                  <span className="font-mono">Payload: {ev.byteSize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Processing Failures and Retry Management (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-borderLine-subtle pb-3">
            <div>
              <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
                <MaterialIcon name="warning" size="xs" className="text-amber-600" />
                <span>{language === 'mr' ? '४. प्रक्रिया त्रुटी व पुनर्प्रयत्न (Retries)' : '4. Processing Failures & Retry'}</span>
              </h3>
              <p className="text-[11px] text-content-secondary">
                Transient ingestion faults, dead-letter queue and retries
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {failureRecords.length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {failureRecords.map((fail) => {
              const isRetried = retriedIds.includes(fail.id);

              return (
                <div key={fail.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-700">{fail.id}</span>
                    <span className="font-mono text-[10px] text-slate-500">{fail.timestamp}</span>
                  </div>
                  <div className="font-semibold text-slate-800">{fail.source} ({fail.district})</div>
                  <p className="text-[11px] text-slate-600">{fail.reason}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="font-mono text-slate-500">Retry Count: {fail.attempts}</span>
                    <button
                      onClick={() => handleManualRetry(fail.id)}
                      disabled={isRetried}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        isRetried
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gov-primary hover:bg-gov-primary-dark text-white shadow-2xs'
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
      </div>

      {/* 
        SECTION 5: Ingestion Logs and Timestamps
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="schedule" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? '५. अंतर्ग्रहण नोंदी व वेळ (Ingestion Logs & Timestamps)' : '5. Ingestion Logs and Timestamps'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Chronological log stream of incoming network events, byte allocations and socket response codes
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-300">
            Log Frequency: Realtime
          </span>
        </div>

        <div className="overflow-x-auto border border-borderLine-standard rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-3">Millisecond Timestamp</th>
                <th className="py-2.5 px-3">Source Channel</th>
                <th className="py-2.5 px-3">Ingestion Event Type</th>
                <th className="py-2.5 px-3">Payload Size</th>
                <th className="py-2.5 px-3">Processing Latency</th>
                <th className="py-2.5 px-3">Status Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
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

      {/* 
        SECTION 6: Raw Data Preview and Search
      */}
      <div className="bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
          <div>
            <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
              <MaterialIcon name="search" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? '६. कच्चा डेटा पूर्वावलोकन व शोध (Raw Data Preview & Search)' : '6. Raw Data Preview and Search'}</span>
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Inspect decoded JSON payload records, cryptographic hashes, and OCR confidence metadata
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search records by keyword, district, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 w-[260px]"
            />
          </div>
        </div>

        {/* Selected Record JSON Inspector */}
        <div className="p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
            <span className="text-amber-400 font-bold">
              RECORD INSPECTOR: <span className="text-white">{activeRecord.id}</span>
            </span>
            <span className="text-slate-400 font-normal">
              Source: <span className="text-emerald-400">{activeRecord.source}</span> ({activeRecord.district})
            </span>
          </div>

          <pre className="text-emerald-300 text-[11px] leading-relaxed overflow-x-auto">
            {JSON.stringify(activeRecord.payloadJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RawIngestionView;
