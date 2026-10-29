'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/stores/dashboardStore';
import { INITIAL_DISTRICTS, INITIAL_INCIDENTS } from '@/data/dashboardData';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';
import { getDistrictName } from '@/lib/dataLocalization';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { EnhancedMaharashtraGISMap } from '@/components/dashboard/EnhancedMaharashtraGISMap';

export const NoScrollExecutiveCockpit: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId, setSearchDistrict } = useDashboardStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'youtube' | 'facebook' | 'tv'>('youtube');
  const [streamSource, setStreamSource] = useState<'video' | 'youtube'>('video');
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayback = () => {
    if (streamSource === 'video' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const topDistricts = [...INITIAL_DISTRICTS]
    .sort((a, b) => b.cpi - a.cpi)
    .slice(0, 3);

  const lowerDistricts = [...INITIAL_DISTRICTS]
    .sort((a, b) => a.cpi - b.cpi)
    .slice(0, 3);

  const selectedDistrict = INITIAL_DISTRICTS.find(
    (d) => d.id.toLowerCase() === (selectedDistrictId || 'thane').toLowerCase()
  ) || INITIAL_DISTRICTS[0];

  const primaryIncident = INITIAL_INCIDENTS[0];

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-2 min-h-0 overflow-hidden bg-[#f1f5f9] text-slate-800 select-none">
      {/* 1. TOP BAR: RED BREAKING NEWS TICKER (Compact 38px Banner) */}
      <div className="w-full h-9 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white px-3 py-1 rounded-lg flex items-center justify-between gap-3 shadow-xs border border-red-800 shrink-0 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 bg-white text-red-700 font-black text-[10px] px-2 py-0.5 rounded shadow-2xs tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span>{language === 'mr' ? 'थेट घडामोडी' : 'BREAKING WIRE'}</span>
          </span>
          <span className="text-[10px] text-red-100 font-mono hidden md:inline">
            74.2% Positive Index
          </span>
        </div>

        {/* Marquee Headline */}
        <div className="flex-1 overflow-hidden relative text-xs font-semibold">
          <div className="animate-marquee-scroll whitespace-nowrap flex items-center gap-6">
            {INITIAL_QUEUE_ITEMS.slice(0, 8).map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span className="text-amber-300 font-bold font-mono text-[10px]">
                  [{getDistrictName(item.district, language)}]
                </span>
                <span className="text-white text-[11px] font-medium">
                  {language === 'mr' ? item.newsMr : item.newsEn}
                </span>
                <span className="text-red-300/80">●</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[10px]">
          <span className="bg-red-900/80 text-amber-300 px-2 py-0.5 rounded font-mono border border-red-500/50">
            {language === 'mr' ? 'एकल-पडदा कॉकपिट' : 'NO-SCROLL COCKPIT'}
          </span>
          <Link
            href="/dashboard"
            className="text-white hover:text-amber-200 underline font-medium text-[10px]"
          >
            {language === 'mr' ? 'मानक दृश्य' : 'Standard 3-Col'}
          </Link>
        </div>
      </div>

      {/* 2. COMPACT KPI STRIP (Single Row, 48px Height) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full shrink-0">
        <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
              {language === 'mr' ? 'प्रशासन निर्देशांक' : 'Governance CPI'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono">89.2</span>
              <span className="text-[9px] font-bold text-emerald-600">▲ +1.8%</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <MaterialIcon name="analytics" size="xs" />
          </div>
        </div>

        <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
              {language === 'mr' ? '९०-मि. सेवा पूर्तता' : '90m SLA Compliance'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono">94.8%</span>
              <span className="text-[9px] font-bold text-emerald-600">34/36 On Target</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <MaterialIcon name="schedule" size="xs" />
          </div>
        </div>

        <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
              {language === 'mr' ? 'सक्रिय आपत्कालीन' : 'Crisis Desk Active'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-rose-600 font-mono">3 Urgent</span>
              <span className="text-[9px] font-bold text-amber-600">2 Mitigated</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <MaterialIcon name="warning" size="xs" />
          </div>
        </div>

        <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
              {language === 'mr' ? 'तथ्य पडताळणी' : 'Fact-Check Bureau'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono">142</span>
              <span className="text-[9px] font-bold text-emerald-600">100% Provenance</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <MaterialIcon name="verified" size="xs" />
          </div>
        </div>

        <div className="bg-white rounded-lg px-3 py-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-tight">
              {language === 'mr' ? 'जनभावना कल' : 'Public Sentiment'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono">74.2%</span>
              <span className="text-[9px] font-bold text-emerald-600">▲ +2.4% MoM</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <MaterialIcon name="trending_up" size="xs" />
          </div>
        </div>
      </div>

      {/* 3. CORE 3-COLUMN ZERO-SCROLL COCKPIT GRID */}
      <div className="flex-1 min-h-0 w-full grid grid-cols-12 gap-2.5 items-stretch overflow-hidden">
        {/* COLUMN 1: ANALYTICS & DISTRICT LEADERBOARD (3/12 cols) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
          {/* Top/Bottom District Matrix Card */}
          <div className="bg-white rounded-lg p-2.5 border border-slate-200/90 shadow-2xs flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MaterialIcon name="bar_chart" size="xs" className="text-amber-600" />
                <span>{language === 'mr' ? 'जिल्हा क्रमवारी व नोडल अधिकारी' : 'District CPI Rankings'}</span>
              </h3>
              <span className="text-[9px] font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                36 Total
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-0.5 text-xs">
              {/* Top 3 */}
              <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider pt-0.5">
                {language === 'mr' ? 'उत्कृष्ट ३ जिल्हे' : 'Top 3 Districts'}
              </div>
              {topDistricts.map((d, i) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDistrictId(d.id);
                    setSearchDistrict(d.name);
                  }}
                  className={`p-1.5 rounded flex items-center justify-between border cursor-pointer transition-all ${
                    selectedDistrictId === d.id
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 text-xs block leading-tight truncate">
                        {getDistrictName(d.name, language)}
                      </span>
                      <span className="text-[9px] text-amber-700 font-medium block truncate">
                        DIO: {d.dioOfficer || 'KRA Officer'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-xs shrink-0">
                    {d.cpi}
                  </span>
                </div>
              ))}

              {/* Lower 3 */}
              <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider pt-1">
                {language === 'mr' ? 'सुधारणा आवश्यक जिल्हे' : 'Focus Districts'}
              </div>
              {lowerDistricts.map((d, i) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDistrictId(d.id);
                    setSearchDistrict(d.name);
                  }}
                  className={`p-1.5 rounded flex items-center justify-between border cursor-pointer transition-all ${
                    selectedDistrictId === d.id
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 text-[9px] font-black flex items-center justify-center shrink-0">
                      {34 + i}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 text-xs block leading-tight truncate">
                        {getDistrictName(d.name, language)}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium block truncate">
                        Collector: {d.collectorName || 'IAS Collector'}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-rose-600 text-xs shrink-0">
                    {d.cpi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Resolution Quick Progress */}
          <div className="bg-white rounded-lg p-2.5 border border-slate-200/90 shadow-2xs shrink-0">
            <h4 className="text-[11px] font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span>{language === 'mr' ? 'विभागवार निवारण दर' : 'Departmental Resolution'}</span>
              <span className="text-[9px] font-mono font-bold text-emerald-600">Avg 94.6%</span>
            </h4>
            <div className="space-y-1.5 text-[10px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>महसूल (Revenue)</span>
                  <span className="font-mono font-bold text-slate-900">96.8%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.8%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>आरोग्य (Health)</span>
                  <span className="font-mono font-bold text-slate-900">94.2%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>गृह व पोलीस (Police)</span>
                  <span className="font-mono font-bold text-slate-900">92.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '92.5%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: INTERACTIVE MAHARASHTRA GIS MAP (5/12 cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
          <div className="bg-white rounded-lg p-2.5 border border-slate-200/90 shadow-2xs flex-1 min-h-0 flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                  {language === 'mr' ? 'महाराष्ट्र डिजिटल भौगोलिक नकाशा' : 'Statewide GIS Intelligence'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                Selected: {getDistrictName(selectedDistrict.name, language)}
              </span>
            </div>

            {/* Auto-Fitting GIS Map */}
            <div className="flex-1 min-h-0 w-full overflow-hidden relative rounded-md border border-slate-100 bg-[#f8fafc]">
              <EnhancedMaharashtraGISMap
                className="w-full h-full"
                onDistrictSelect={(d) => {
                  setSelectedDistrictId(d.id);
                  setSearchDistrict(d.name);
                }}
              />
            </div>

            {/* Selected District Telemetry Bar */}
            <div className="mt-1.5 pt-1.5 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-[10px] shrink-0">
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-500 block">CPI Score</span>
                <span className="font-bold text-slate-900 font-mono text-xs">{selectedDistrict.cpi}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-500 block">90m SLA</span>
                <span className="font-bold text-emerald-600 font-mono text-xs">{selectedDistrict.crisisSLA}%</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-500 block">KRA Officer</span>
                <span className="font-bold text-amber-800 truncate block text-[10px]">{selectedDistrict.dioOfficer?.split(' ')[0] || 'DIO'}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded">
                <span className="text-slate-500 block">Rank</span>
                <span className="font-bold text-slate-900 font-mono text-xs">#{selectedDistrict.rank} of 36</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: LIVE VIDEO STREAM & CRISIS RESPONSE (4/12 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
          {/* DIRECT LIVE VIDEO STREAMING CARD (Always Visible & Prominent) */}
          <div className="bg-white rounded-lg p-2.5 border border-slate-200/90 shadow-2xs flex flex-col shrink-0 overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                  {language === 'mr' ? 'थेट दूरदर्शन व वेबकास्ट प्रवाह' : 'Live Media Broadcast'}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => setStreamSource(streamSource === 'video' ? 'youtube' : 'video')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer border border-slate-300"
                >
                  {streamSource === 'video' ? '🎥 Clean Feed' : '▶️ YouTube'}
                </button>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[9px]">
                  ON AIR
                </span>
              </div>
            </div>

            {/* 16:9 Video Player Canvas */}
            <div className="w-full aspect-video min-h-[170px] max-h-[190px] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative shadow-inner flex flex-col justify-between">
              {/* Top Stream Status Overlay */}
              <div className="p-1.5 flex items-center justify-between text-white text-[10px] bg-gradient-to-b from-black/80 to-transparent z-10">
                <span className="font-bold truncate max-w-[210px] text-amber-300">
                  Sonam Wangchuk Press Briefing (New Delhi)
                </span>
                <span className="font-mono text-slate-300 text-[9px]">1080p HD</span>
              </div>

              {/* Video Element */}
              {streamSource === 'video' ? (
                <div className="relative w-full h-full flex-1 flex items-center justify-center bg-slate-900 overflow-hidden">
                  <video
                    ref={videoRef}
                    src="/videos/sonam_wangchuk_live.mp4"
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted={isMuted}
                  />
                  {!isPlaying && (
                    <button
                      type="button"
                      onClick={togglePlayback}
                      className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                      title="Play Clean Feed"
                    >
                      <MaterialIcon name="play_arrow" size="sm" />
                    </button>
                  )}
                </div>
              ) : (
                <iframe
                  src="https://www.youtube-nocookie.com/embed/M-I03W15Vmco?enablejsapi=1&autoplay=1&mute=0"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Live YouTube Broadcast"
                />
              )}

              {/* Bottom Video Controls Overlay */}
              <div className="p-1.5 flex items-center justify-between text-white text-[10px] bg-gradient-to-t from-black/85 to-transparent z-10">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="p-1 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  >
                    <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="xs" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (videoRef.current) videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }}
                    className="p-1 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  >
                    <MaterialIcon name={isMuted ? 'volume_off' : 'volume_up'} size="xs" />
                  </button>
                  <span className="text-[9px] text-slate-300">DD Sahyadri / Press Pool</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveChannel('youtube')}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      activeChannel === 'youtube' ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveChannel('tv')}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      activeChannel === 'tv' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    TV News
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EMERGENCY ALERT & RESPONSE DISPATCH (Takes remaining height) */}
          <div className="bg-white rounded-lg p-2.5 border border-slate-200/90 shadow-2xs flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                  {language === 'mr' ? 'तातडीचा आपत्कालीन कक्ष' : 'Crisis SLA Dispatch'}
                </h3>
              </div>
              <span className="text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.2 rounded uppercase">
                90m SLA
              </span>
            </div>

            {/* Incident Summary Box */}
            <div className="bg-rose-50/70 border border-rose-200 rounded p-2 mb-2 shrink-0">
              <div className="flex items-start justify-between gap-1 mb-1">
                <span className="font-bold text-slate-900 text-[11px] leading-tight">
                  {primaryIncident?.summary || 'Fertilizer subsidy rumor debunked by Agriculture Commissionerate'}
                </span>
                <span className="text-[9px] font-mono text-rose-700 bg-white px-1 rounded border border-rose-200 font-bold shrink-0">
                  12m left
                </span>
              </div>
              <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                {primaryIncident?.newsDetails ||
                  'Official press release verified on FactCheck portal. District Collectors and DIO desks notified across all 36 districts.'}
              </p>
            </div>

            {/* Real-time Dispatch Actions */}
            <div className="flex items-center gap-1.5 shrink-0 text-[10px] mb-2">
              <button
                type="button"
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-1 px-2 rounded shadow-2xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <MaterialIcon name="campaign" size="xs" />
                <span>{language === 'mr' ? 'थेट प्रसिद्धीपत्रक जारी करा' : 'Broadcast Clarification'}</span>
              </button>
              <button
                type="button"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1 px-2 rounded border border-slate-300 transition-colors cursor-pointer"
              >
                {language === 'mr' ? 'तपशील' : 'Escalate'}
              </button>
            </div>

            {/* Micro News Queue */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-0.5 text-[10px]">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'mr' ? 'ताजी माहिती फीड' : 'Latest Feed Stream'}
              </span>
              {INITIAL_QUEUE_ITEMS.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-1 rounded bg-slate-50 border border-slate-100 flex items-center justify-between gap-1">
                  <span className="text-slate-800 font-medium truncate">
                    {language === 'mr' ? item.newsMr : item.newsEn}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">{item.timestamp || '2m'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM STATUS STRIP (Zero Scroll Guarantee, 24px Height) */}
      <div className="w-full h-6 bg-slate-900 text-slate-300 px-3 py-0.5 rounded-md flex items-center justify-between text-[10px] font-mono shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Project EUREKA Engine: Online</span>
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">FastAPI Backend :8000</span>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:inline text-slate-400">36 Districts Active</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold">KRA DIO Network Synchronized</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="text-slate-300 font-bold">Zero-Scroll Cockpit v6.0</span>
        </div>
      </div>
    </div>
  );
};

