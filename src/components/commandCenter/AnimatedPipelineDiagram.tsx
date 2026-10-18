'use client';

import React, { useState, useEffect } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface AnimatedPipelineDiagramProps {
  initialSpeed?: '1x' | '2x' | '0.5x';
  showStageDetails?: boolean;
  embedded?: boolean;
}

export const AnimatedPipelineDiagram: React.FC<AnimatedPipelineDiagramProps> = ({
  initialSpeed = '1x',
  showStageDetails = true,
  embedded = false,
}) => {
  const { language } = useDashboardStore();
  const [animationActive, setAnimationActive] = useState<boolean>(true);
  const [flowSpeed, setFlowSpeed] = useState<'1x' | '2x' | '0.5x'>(initialSpeed);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [selectedStageDetail, setSelectedStageDetail] = useState<number>(3); // Default to Stage 4 (NLP)
  const [processedPacketCount, setProcessedPacketCount] = useState<number>(1428910);
  const [livePackets, setLivePackets] = useState<
    { id: string; district: string; stage: string; latency: string; status: string }[]
  >([
    { id: 'PKT-9482', district: 'Thane', stage: 'Stage 4: Indic-BERT NLP', latency: '12.4ms', status: 'Inference OK' },
    { id: 'PKT-9481', district: 'Palghar', stage: 'Stage 2: Kafka Buffer', latency: '2.1ms', status: 'Partitioned' },
    { id: 'PKT-9480', district: 'Raigad', stage: 'Stage 5: Gov Fact-Check', latency: '8.1ms', status: 'Verified' },
    { id: 'PKT-9479', district: 'Ratnagiri', stage: 'Stage 6: TimescaleDB Write', latency: '4.8ms', status: 'Committed' },
  ]);

  // Stage Advancement Loop
  useEffect(() => {
    if (!animationActive) return;
    const intervalTime = flowSpeed === '2x' ? 1000 : flowSpeed === '0.5x' ? 3200 : 1800;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % 6);
      setProcessedPacketCount((prev) => prev + Math.floor(Math.random() * 12) + 8);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [animationActive, flowSpeed]);

  // Simulated Live Packet Feed Stream
  useEffect(() => {
    if (!animationActive) return;
    const districts = ['Thane', 'Raigad', 'Palghar', 'Ratnagiri', 'Sindhudurg'];
    const stages = [
      'Stage 1: Gateway Ingest',
      'Stage 2: Kafka Buffer',
      'Stage 3: Devanagari OCR',
      'Stage 4: Indic-BERT NLP',
      'Stage 5: Gov Fact-Check',
      'Stage 6: TimescaleDB Write',
    ];

    const packetInterval = setInterval(() => {
      const nextId = `PKT-${Math.floor(Math.random() * 9000) + 1000}`;
      const randomDist = districts[Math.floor(Math.random() * districts.length)];
      const randomStage = stages[Math.floor(Math.random() * stages.length)];
      const randomLatency = `${(Math.random() * 15 + 2).toFixed(1)}ms`;

      setLivePackets((prev) => [
        { id: nextId, district: randomDist, stage: randomStage, latency: randomLatency, status: 'Active Flow' },
        ...prev.slice(0, 4),
      ]);
    }, 1600);

    return () => clearInterval(packetInterval);
  }, [animationActive]);

  const conduitSpeedClass =
    flowSpeed === '2x'
      ? 'pipeline-conduit-fast'
      : flowSpeed === '0.5x'
      ? 'pipeline-conduit-slow'
      : 'pipeline-conduit-active';

  const pipelineStages = [
    {
      id: 1,
      nameEn: '1. Ingestion Gateways',
      nameMr: '१. अंतर्ग्रहण गेटवे',
      tech: 'RTSP / REST / S3 OCR',
      latency: '3.8 ms',
      throughput: '1,480 ev/min',
      status: 'Active',
      description: 'Collects raw TV broadcasts, news wire webhooks, print clippings from active district offices.',
      workers: '6 Network Listeners',
      input: 'Raw Bytes / RTSP Stream / Scanned PDF',
      output: 'Binary Event Frames with Timestamp & District ID',
    },
    {
      id: 2,
      nameEn: '2. High-Velocity Buffer',
      nameMr: '२. हाय-स्पीड बफर',
      tech: 'Kafka / Redis Stream',
      latency: '2.1 ms',
      throughput: '1,480 ev/min',
      status: 'Active',
      description: 'Buffers volatile bursts, partitions events by district hash, ensures zero-drop guarantee under surge.',
      workers: '4 Partitions (18% buffer fill)',
      input: 'Binary Frames from Gateways',
      output: 'Ordered Partition Stream with Checksums',
    },
    {
      id: 3,
      nameEn: '3. Devanagari OCR & Tokenizer',
      nameMr: '३. ओसीआर व युनिकोड क्लीनर',
      tech: 'Tesseract OCR v5.2 / ICU',
      latency: '12.4 ms',
      throughput: '1,460 ev/min',
      status: 'Active',
      description: 'Extracts Marathi Devanagari & English text, normalizes Unicode diacritics, strips noise.',
      workers: '8 Parallel Worker Threads',
      input: 'Clipping Bitmaps / Raw OCR Scans',
      output: 'Normalized NFC Marathi Text & Metadata Tokens',
    },
    {
      id: 4,
      nameEn: '4. Indic-BERT NLP Classifier',
      nameMr: '४. इंडिक-बर्ट भावनिक वर्गीकरण',
      tech: 'TorchScript / GPU Cluster',
      latency: '18.2 ms',
      throughput: '1,450 ev/min',
      status: 'Active',
      description: 'Calculates sentiment score (-1.0 to +1.0), topic taxonomy, crisis urgency index, credibility weighting.',
      workers: '2x NVIDIA Tensor Core Workers',
      input: 'Clean Unicode Text Tokens',
      output: 'Sentiment Vector + Urgency Score (0-100)',
    },
    {
      id: 5,
      nameEn: '5. Cross-Verification Desk',
      nameMr: '५. पडताळणी व खंडन डेस्क',
      tech: 'NIC Gov Fact-Check Registry',
      latency: '8.1 ms',
      throughput: '1,440 ev/min',
      status: 'Active',
      description: 'Correlates against official department releases, flags viral hoaxes, matches past rebuttal records.',
      workers: 'Automated Rule Matcher + Desk Queue',
      input: 'Classified Event Record with GIS Tag',
      output: 'Verified Bulletin Object with Clearance State',
    },
    {
      id: 6,
      nameEn: '6. TimescaleDB & WebSockets',
      nameMr: '६. डेटाबेस साठा व थेट प्रसारण',
      tech: 'TimescaleDB / Redis PubSub',
      latency: '4.8 ms',
      throughput: '1,440 ev/min',
      status: 'Active',
      description: 'Persists compressed telemetry timeseries, pushes real-time WebSocket payloads to all active command screens.',
      workers: 'Timescale Connection Pool + Socket.io Fanout',
      input: 'Verified Bulletin Object',
      output: 'Live Broadcast to 18 Connected Dashboard Clients',
    },
  ];

  const currentStage = pipelineStages[selectedStageDetail];

  return (
    <div
      className={
        embedded
          ? 'space-y-4'
          : 'bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4'
      }
    >
      {/* Top Header Controls (Light Government Theme) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            {animationActive ? (
              <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
            )}
            <h3 className="text-base font-bold text-gov-primary tracking-tight">
              {language === 'mr'
                ? '३. सविस्तर अंतर्ग्रहण व प्रक्रिया पाइपलाइन प्रवाह'
                : '3. Multi-Stage Telemetry Execution Pipeline'}
            </h3>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            {language === 'mr'
              ? 'थेट डेटा प्रवाह: सक्रिय जिल्हा गेटवेवरून टाइमस्केलडीबी आणि वेबसॉकेट्सकडे पॅकेट वहन'
              : 'Real-time visual dataflow: Live packet movement from active district gateways to TimescaleDB & WebSockets'}
          </p>
        </div>

        {/* Speed & Flow Controls */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
            <span className="text-slate-500 font-normal">
              {language === 'mr' ? 'एकूण प्रक्रिया:' : 'Total Processed:'}
            </span>{' '}
            <span className="text-gov-primary font-bold">{processedPacketCount.toLocaleString()}</span>
          </div>

          {/* Animation Toggle */}
          <button
            onClick={() => setAnimationActive(!animationActive)}
            className={`px-2.5 py-1 rounded font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
              animationActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                animationActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            ></span>
            <span>
              {animationActive
                ? language === 'mr'
                  ? 'प्रवाह: सुरू'
                  : 'FLOW: ACTIVE'
                : language === 'mr'
                ? 'प्रवाह: थांबवला'
                : 'FLOW: PAUSED'}
            </span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 px-2 py-1 rounded">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'गती:' : 'Speed:'}
            </span>
            <select
              value={flowSpeed}
              onChange={(e) => setFlowSpeed(e.target.value as '1x' | '2x' | '0.5x')}
              className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
            >
              <option value="1x">{language === 'mr' ? 'सामान्य (१x)' : 'Normal (1x)'}</option>
              <option value="2x">{language === 'mr' ? 'उच्च गती (२x)' : 'High Velocity (2x)'}</option>
              <option value="0.5x">{language === 'mr' ? 'टप्प्याटप्प्याने (०.५x)' : 'Step-by-Step (0.5x)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 
        VISUAL STAGES GRID WITH LIGHT GOVERNMENT THEMED CARDS
      */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {pipelineStages.map((st, idx) => {
            const isSelected = selectedStageDetail === idx;
            const isCurrentlyProcessing = activeStageIndex === idx && animationActive;

            return (
              <div
                key={st.id}
                onClick={() => setSelectedStageDetail(idx)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between relative select-none ${
                  isSelected
                    ? 'bg-white border-amber-500 ring-2 ring-amber-500/25 shadow-xs'
                    : isCurrentlyProcessing
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Active Ingestion Packet Pulse Glow Badge */}
                {isCurrentlyProcessing && (
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white font-mono animate-bounce shadow-xs">
                    IN TRANSIT
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-gov-primary">
                      STAGE {st.id}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Micro Wave Bars */}
                      <div className="flex items-end gap-0.5 h-3 px-1 bg-slate-100 rounded border border-slate-200">
                        <span
                          className={`w-0.5 bg-gov-primary rounded-full ${
                            animationActive ? 'wave-bar-pulse' : 'h-1.5'
                          }`}
                          style={{ height: '70%', animationDelay: '0s' }}
                        ></span>
                        <span
                          className={`w-0.5 bg-gov-primary rounded-full ${
                            animationActive ? 'wave-bar-pulse' : 'h-2'
                          }`}
                          style={{ height: '100%', animationDelay: '0.2s' }}
                        ></span>
                        <span
                          className={`w-0.5 bg-gov-primary rounded-full ${
                            animationActive ? 'wave-bar-pulse' : 'h-1'
                          }`}
                          style={{ height: '50%', animationDelay: '0.4s' }}
                        ></span>
                      </div>
                      {isCurrentlyProcessing ? (
                        <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      )}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mt-1.5 leading-snug">
                    {language === 'mr' ? st.nameMr : st.nameEn}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{st.tech}</p>
                </div>

                {/* Metrics inside card */}
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Latency:</span>
                    <span className="font-mono text-gov-primary font-bold">{st.latency}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Rate:</span>
                    <span className="font-mono text-slate-700">{st.throughput}</span>
                  </div>

                  {/* Flow Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCurrentlyProcessing
                          ? 'bg-blue-600 w-full animate-pulse'
                          : isSelected
                          ? 'bg-amber-500 w-3/4'
                          : 'bg-slate-300 w-1/2'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 
          ANIMATED CONDUIT FLOW LINE (Light Theme)
          Connecting all 6 stages with smooth moving pulse
        */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 text-gov-primary font-semibold">
              <MaterialIcon name="layers" size="xs" />
              <span>OPTICAL DATA CONDUIT (STAGE 1 ➔ STAGE 6)</span>
            </span>
            <span className="text-slate-600">Zero-Copy Ring Buffer Bus (40 Gbps)</span>
          </div>

          <svg className="w-full h-6" viewBox="0 0 1000 24" fill="none">
            {/* Base Wire Track */}
            <line x1="20" y1="12" x2="980" y2="12" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

            {/* Smooth Animated Data Pulse Flow Line */}
            <line
              x1="20"
              y1="12"
              x2="980"
              y2="12"
              stroke={animationActive ? '#0284C7' : '#94A3B8'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className={animationActive ? conduitSpeedClass : ''}
            />

            {/* Visual stage junction ports */}
            {[50, 230, 410, 590, 770, 950].map((cx, i) => {
              const isStageActive = activeStageIndex === i && animationActive;
              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy="12"
                    r={isStageActive ? 6 : 4}
                    fill={isStageActive ? '#0284C7' : '#FFFFFF'}
                    stroke={isStageActive ? '#0284C7' : '#94A3B8'}
                    strokeWidth="1.5"
                  />
                  {isStageActive && (
                    <circle cx={cx} cy="12" r={2.5} fill="#FFFFFF" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 
        LIVE PACKET TRANSIT STREAM TICKER (Light Theme)
      */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-gov-primary">
            <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Real-Time Telemetry Packet Transit Feed</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Auto-balanced router stream</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
          {livePackets.map((pkt, idx) => (
            <div
              key={pkt.id + idx}
              className="bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-gov-primary font-bold text-[11px]">{pkt.id}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                  {pkt.district}
                </span>
              </div>
              <div className="text-slate-800 text-[11px] font-semibold mt-1 truncate">{pkt.stage}</div>
              <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500 pt-1 border-t border-slate-200">
                <span className="text-emerald-700 font-bold">{pkt.latency}</span>
                <span className="text-slate-600">{pkt.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        DETAILED STAGE INSPECTOR DRAWER (Light Theme)
      */}
      {showStageDetails && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gov-primary text-white font-mono">
                STAGE {currentStage.id} ARCHITECTURE
              </span>
              <h4 className="text-sm font-bold text-gov-primary">
                {language === 'mr' ? currentStage.nameMr : currentStage.nameEn}
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-600">
              Worker Concurrency: <span className="text-gov-primary font-bold">{currentStage.workers}</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentStage.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="p-3 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-gov-primary font-bold block mb-1">INPUT CONTRACT:</span>
              <p className="text-slate-700 text-[11px]">{currentStage.input}</p>
            </div>
            <div className="p-3 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-emerald-800 font-bold block mb-1">OUTPUT EMISSION:</span>
              <p className="text-slate-700 text-[11px]">{currentStage.output}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
