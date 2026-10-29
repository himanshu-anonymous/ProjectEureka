'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { SampleDataBadge } from '@/components/shared/SampleDataBadge';
import { useDashboardStore } from '@/stores/dashboardStore';

export interface TranscriptLine {
  id?: string;
  start_time: number;
  end_time?: number;
  text: string;
  language: 'mr' | 'en' | string;
  provider?: string;
  model?: string;
  machine_generated?: boolean;
}

export const LiveAudioTranscriptionPanel: React.FC = () => {
  const { language } = useDashboardStore();
  const [segments, setSegments] = useState<TranscriptLine[]>([
    {
      start_time: 0,
      end_time: 12,
      text: 'सह्याद्री अतिथीगृह येथे मुख्यमंत्री महोदयांच्या अध्यक्षतेखाली राज्य आपत्ती निवारण बैठक संपन्न.',
      language: 'mr',
    },
    {
      start_time: 12,
      end_time: 24,
      text: 'मराठवाडा आणि विदर्भातील ग्रामीण पाणीपुरवठा व जलसंधारण कामांसाठी नवीन निधी तातडीने मंजूर.',
      language: 'mr',
    },
  ]);

  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (!isAutoScrollPaused && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [segments, isAutoScrollPaused]);

  // Connect to SSE stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let isMounted = true;

    try {
      eventSource = new EventSource('/api/v1/transcription/stream?channel=tv_marathi_live');

      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          if (data && data.segment) {
            setSegments((prev) => {
              // Avoid duplicates by start_time
              const exists = prev.some((s) => Math.abs(s.start_time - data.segment.start_time) < 0.5);
              if (exists) return prev;
              return [...prev.slice(-30), data.segment];
            });
          }
        } catch {}
      };

      eventSource.onerror = () => {
        // Fallback simulated ticks if backend SSE disconnects
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }

        if (!pollInterval && isMounted) {
          pollInterval = setInterval(() => {
            setSegments((prev) => {
              const lastTime = prev.length > 0 ? prev[prev.length - 1].start_time : 0;
              const nextTime = lastTime + 12;
              const samples = [
                { text: 'Chief Minister directs District Collectors to maintain strict 90-minute SLA.', language: 'en' },
                { text: 'पुणे-नाशिक औद्योगिक कॉरिडॉर आणि रस्ते सुधारणा कामांचा उपमुख्यमंत्र्यांनी घेतला आढावा.', language: 'mr' },
                { text: 'कोकण किनारपट्टी भागात पर्यटनाला चालना देण्यासाठी नवीन इको-टुरिझम धोरण जाहीर.', language: 'mr' },
                { text: 'DGIPR AI Command Center continuously monitors broadcast news streams.', language: 'en' },
              ];
              const sample = samples[Math.floor(nextTime / 12) % samples.length];
              return [...prev.slice(-30), { start_time: nextTime, end_time: nextTime + 12, ...sample }];
            });
          }, 4500);
        }
      };
    } catch {
      // EventSource not supported or failed
    }

    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  const formatOffset = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
      {/* Header Bar */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-200">
            {language === 'mr' ? 'थेट ध्वनी-ते-मजकूर प्रसारण प्रवाह' : 'Live Audio-to-Text Broadcast Transcript'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Gemini 2.0 / Multilingual Indic
          </span>
        </div>

        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={() => setIsAutoScrollPaused((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition border ${
            isAutoScrollPaused
              ? 'bg-amber-950/80 text-amber-300 border-amber-700/80'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title={isAutoScrollPaused ? 'Resume auto-scrolling' : 'Pause auto-scrolling'}
          aria-label={isAutoScrollPaused ? 'Resume auto-scrolling' : 'Pause auto-scrolling'}
        >
          <MaterialIcon name={isAutoScrollPaused ? 'play_arrow' : 'pause'} className="text-xs" />
          <span>{isAutoScrollPaused ? 'Resume Scroll' : 'Pause Scroll'}</span>
        </button>
      </div>

      {/* Streaming Log Area */}
      <div
        ref={scrollContainerRef}
        className="h-44 sm:h-52 overflow-y-auto p-3 space-y-2 text-xs font-sans focus:outline-none"
        tabIndex={0}
        aria-label="Live audio transcript log"
      >
        {segments.map((seg, idx) => (
          <div
            key={seg.id || `seg-${seg.start_time}-${idx}`}
            className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/60 transition group"
          >
            {/* Timestamp Offset */}
            <span className="font-mono text-[10px] text-amber-400/90 font-semibold shrink-0 pt-0.5">
              [{formatOffset(seg.start_time)}]
            </span>

            {/* Language Tag */}
            <span
              className={`text-[9px] font-black uppercase px-1 py-0.2 rounded shrink-0 border mt-0.5 ${
                seg.language === 'mr'
                  ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                  : 'bg-blue-950/60 text-blue-400 border-blue-800/60'
              }`}
            >
              {seg.language.toUpperCase()}
            </span>

            {/* Transcript Text */}
            <p className="text-slate-200 leading-relaxed font-medium flex-1">
              {seg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Disclaimer Bar */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 px-3">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="warning" className="text-amber-500 text-xs shrink-0" />
          <span className="italic">Machine transcript, may contain errors.</span>
        </div>
        <SampleDataBadge />
      </div>
    </div>
  );
};
