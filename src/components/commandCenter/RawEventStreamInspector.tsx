'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';

export interface RawEventRecord {
  id: string;
  timestamp: string;
  source: string;
  district: string;
  byteSize: string;
  headlineEn: string;
  headlineMr: string;
  payloadJson: Record<string, unknown>;
}

export const RAW_EVENTS_SEED: RawEventRecord[] = [
  {
    id: 'RAW-9011',
    timestamp: '17:04:18.902',
    source: 'ABP Majha',
    district: 'Thane',
    byteSize: '4.8 KB',
    headlineEn: 'Thane creek coastal road construction accelerated; PWD inspection completed',
    headlineMr: 'ठाणे खाडी किनारा महामार्ग कामाचा वेग वाढला; सार्वजनिक बांधकाम विभागाचा पाहणी दौरा',
    payloadJson: {
      raw_event_id: 'RAW-9011',
      ingest_gateway: 'THN-01',
      protocol: 'RTSP-OCR',
      channel: 'ABP Majha',
      timestamp_utc: '2026-10-15T11:34:18.902Z',
      ocr_confidence: 0.96,
      detected_language: 'mr',
      district_id: 'thane',
      headline_raw: 'Thane creek coastal road construction accelerated; PWD inspection completed',
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
    headlineEn: 'Appeal to citizens in Dahanu-Talasari coastal belt not to believe fake earthquake rumors',
    headlineMr: 'डहाणू-तलासरी किनारपट्टी भागात भूकंपाच्या खोट्या अफवांवर विश्वास न ठेवण्याचे आवाहन',
    payloadJson: {
      raw_event_id: 'RAW-9012',
      ingest_gateway: 'PLG-03',
      protocol: 'Broadcast-HLS',
      channel: 'TV9 Marathi',
      timestamp_utc: '2026-10-15T11:34:14.320Z',
      ocr_confidence: 0.94,
      detected_language: 'mr',
      district_id: 'palghar',
      headline_raw: 'Appeal to citizens in Dahanu-Talasari coastal belt not to believe fake earthquake rumors',
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
    headlineEn: 'Alibaug-Vadkhal national highway widening in final stage; Collector review completed',
    headlineMr: 'अलिबाग-वडखळ राष्ट्रीय महामार्गाचे रुंदीकरण अंतिम टप्प्यात; जिल्हाधिकाऱ्यांकडून आढावा',
    payloadJson: {
      raw_event_id: 'RAW-9013',
      ingest_gateway: 'RGD-02',
      protocol: 'PDF-OCR',
      channel: 'Lokmat Konkan',
      timestamp_utc: '2026-10-15T11:34:09.112Z',
      ocr_confidence: 0.97,
      detected_language: 'mr',
      district_id: 'raigad',
      headline_raw: 'Alibaug-Vadkhal national highway widening in final stage; Collector review completed',
      checksum_sha256: '3f810aa78d6541bc889021eec4821a39',
    },
  },
  {
    id: 'RAW-9014',
    timestamp: '17:04:01.884',
    source: 'News18 Lokmat',
    district: 'Sindhudurg',
    byteSize: '5.2 KB',
    headlineEn: 'Direct flights from Chipi International Airport to Bengaluru and Hyderabad increased in frequency',
    headlineMr: 'चिपी आंतरराष्ट्रीय विमानतळावरून बंगळुरू व हैदराबाद थेट विमानसेवेची वारंवारता वाढवली',
    payloadJson: {
      raw_event_id: 'RAW-9014',
      ingest_gateway: 'SND-05',
      protocol: 'RTSP-OCR',
      channel: 'News18 Lokmat',
      timestamp_utc: '2026-10-15T11:34:01.884Z',
      ocr_confidence: 0.93,
      detected_language: 'mr',
      district_id: 'sindhudurg',
      headline_raw: 'Direct flights from Chipi International Airport to Bengaluru and Hyderabad increased in frequency',
      checksum_sha256: '710ae89098bcda441098231eefc78821',
    },
  },
];

export interface RawEventStreamInspectorProps {
  embedded?: boolean;
}

export const RawEventStreamInspector: React.FC<RawEventStreamInspectorProps> = ({ embedded = false }) => {
  const { language } = useDashboardStore();
  const [streamPaused, setStreamPaused] = useState<boolean>(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('RAW-9011');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = RAW_EVENTS_SEED.filter((ev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const hl = language === 'mr' ? ev.headlineMr : ev.headlineEn;
    return (
      ev.id.toLowerCase().includes(q) ||
      ev.source.toLowerCase().includes(q) ||
      ev.district.toLowerCase().includes(q) ||
      hl.toLowerCase().includes(q)
    );
  });

  const activeRecord = RAW_EVENTS_SEED.find((r) => r.id === selectedRecordId) || RAW_EVENTS_SEED[0];

  return (
    <div className={`bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4 ${embedded ? '' : 'w-full'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
        <div>
          <h3 className="text-sm font-bold text-gov-primary flex items-center gap-2">
            <MaterialIcon name="podcasts" size="xs" className="text-gov-primary" />
            <span>{language === 'mr' ? 'थेट कच्चा डेटा प्रवाह व विश्लेषक' : 'Raw Event Stream & JSON Inspector'}</span>
          </h3>
          <p className="text-[11px] text-content-secondary mt-0.5">
            {language === 'mr'
              ? 'डिकोड केलेले जेएसओएन पेलोड, क्रिप्टोग्राफिक हॅश आणि ओसीआर मेटाडेटा तपासा'
              : 'Inspect decoded JSON payloads, cryptographic hashes, and OCR confidence metadata'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStreamPaused(!streamPaused)}
            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-colors ${
              streamPaused
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {streamPaused
              ? language === 'mr'
                ? 'सुरू करा'
                : 'Resume'
              : language === 'mr'
              ? 'थांबवा'
              : 'Pause'}
          </button>
          <input
            type="text"
            placeholder={language === 'mr' ? 'नोंदी शोधा...' : 'Search records...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-2.5 py-1 bg-surface border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 w-[180px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Left: Stream selector list */}
        <div className="sm:col-span-5 space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filteredEvents.map((ev) => {
            const displayHeadline = language === 'mr' ? ev.headlineMr : ev.headlineEn;
            const displayDistrict = getDistrictName(ev.district, language);

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedRecordId(ev.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedRecordId === ev.id
                    ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400/50'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-gov-primary">{ev.id}</span>
                  <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                    {displayDistrict}
                  </span>
                </div>
                <p className="font-medium text-slate-900 line-clamp-1 text-[11px]">{displayHeadline}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                  <span>{ev.source}</span>
                  <span className="font-mono">{ev.byteSize}</span>
                </div>
              </div>
            );
          })}
          {filteredEvents.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              {language === 'mr' ? 'कोणत्याही नोंदी आढळल्या नाहीत.' : 'No matching records found.'}
            </div>
          )}
        </div>

        {/* Right: Single Dedicated JSON Payload Preview */}
        <div className="sm:col-span-7 bg-slate-950 text-slate-200 rounded-lg p-3 font-mono text-xs border border-slate-800 space-y-2 max-h-[360px] flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
            <span className="text-amber-400 font-bold">
              PAYLOAD: <span className="text-white">{activeRecord.id}</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              <span className="text-emerald-400">{activeRecord.source}</span> ({getDistrictName(activeRecord.district, language)})
            </span>
          </div>
          <pre className="text-emerald-300 text-[10px] leading-relaxed overflow-auto flex-1 font-mono">
            {JSON.stringify(activeRecord.payloadJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RawEventStreamInspector;
