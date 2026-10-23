'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import {
  CURRENT_LIVE_EVENT,
  UPCOMING_EVENTS_SCHEDULE,
  RECORDED_BROADCAST_ARCHIVES,
} from '@/data/liveEventsData';

export const LiveEventsScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'archives'>('live');

  const handleShare = () => {
    setToast({
      message:
        language === 'mr'
          ? 'थेट प्रक्षेपण लिंक कॉपी केली गेली आहे.'
          : 'Live webcast link copied to clipboard.',
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] w-full mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>{language === 'mr' ? 'थेट प्रक्षेपण चालू' : 'DGIPR WEBCAST LIVE'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gov-primary flex items-center gap-2">
            <MaterialIcon name="live_tv" size="md" className="text-rose-600" />
            <span>
              {language === 'mr'
                ? 'माहिती व जनसंपर्क थेट प्रक्षेपण दालन'
                : 'DGIPR Live Events & Webcast Streaming'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'मंत्रालय माध्यम केंद्र, मा. मुख्यमंत्री पत्रकार परिषदा, मंत्रिमंडळ निर्णय व शासकीय महत्त्वाच्या कार्यक्रमांचे थेट प्रक्षेपण.'
              : 'Official live broadcasting channel from Mantralaya Media Centre, Chief Minister briefings, and Cabinet decisions.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/live-news"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <MaterialIcon name="tv" size="xs" />
            <span>{language === 'mr' ? 'थेट वृत्त व ट्रान्सक्रिप्ट दालन ↗' : 'Live TV & Transcript Desk ↗'}</span>
          </a>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <MaterialIcon name="share" size="xs" />
            <span>{language === 'mr' ? 'प्रक्षेपण लिंक शेअर करा' : 'Share Webcast'}</span>
          </button>
        </div>
      </div>

      {/* Main Live Player & Real-time Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: High-Definition Live Player Container */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative aspect-video flex flex-col justify-between p-4 group">
            {/* Player Top Overlay */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-rose-600 text-white text-[11px] font-black tracking-wider flex items-center gap-1.5 uppercase shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>LIVE</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20">
                  {CURRENT_LIVE_EVENT.viewerCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-mono border border-white/20">
                  {CURRENT_LIVE_EVENT.resolution}
                </span>
              </div>
            </div>

            {/* Video Canvas Simulation */}
            <div className="my-auto text-center py-8 space-y-3 relative z-10">
              <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center mx-auto shadow-xl cursor-pointer hover:scale-110 transition-transform">
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="lg" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-base sm:text-lg px-4 max-w-xl mx-auto drop-shadow-md">
                  {language === 'mr' ? CURRENT_LIVE_EVENT.titleMr : CURRENT_LIVE_EVENT.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'mr' ? CURRENT_LIVE_EVENT.locationMr : CURRENT_LIVE_EVENT.location}
                </p>
              </div>
            </div>

            {/* Player Bottom Control Bar */}
            <div className="z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 pb-1 px-2 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="sm" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <MaterialIcon name={isMuted ? 'volume_off' : 'volume_up'} size="sm" />
                </button>
                <span className="text-[11px] text-slate-300 font-mono">
                  {CURRENT_LIVE_EVENT.startTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  Mantralaya Media Pool Feed #1
                </span>
                <button className="p-1.5 hover:text-amber-400 cursor-pointer" title="Fullscreen">
                  <MaterialIcon name="fullscreen" size="sm" />
                </button>
              </div>
            </div>

            {/* Background Graphic Ambient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 opacity-90 pointer-events-none" />
          </div>

          {/* Under-player Broadcast Metadata */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                {language === 'mr' ? 'प्रक्षेपण तपशील:' : 'Broadcast Metadata:'}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official Mantralaya Signal Verified
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {language === 'mr'
                ? 'मा. मुख्यमंत्री, दोन्ही उपमुख्यमंत्री व कॅबिनेट मंत्र्यांच्या उपस्थितीत पार पडलेल्या राज्य मंत्रिमंडळ बैठकीतील धोरणात्मक व आर्थिक निर्णयांची अधिकृत प्रसिद्धी.'
                : 'Official presentation of cabinet resolutions, financial grants, infrastructure approvals, and welfare dispatches directly from the Mantralaya briefing rostrum.'}
            </p>
          </div>
        </div>

        {/* Right Column: Synchronized Live Takeaways & Bullet Decisions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                  {language === 'mr' ? 'थेट महत्त्वाचे मंत्रिमंडळ निर्णय' : 'Synchronized Live Decisions'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Auto-transcribed</span>
            </div>

            {/* Synchronized Bullet Feed */}
            <div className="space-y-3.5 my-4">
              {CURRENT_LIVE_EVENT.liveKeyTakeaways.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-amber-50/40 hover:border-amber-200 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                      {item.time}
                    </span>
                    <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                    {language === 'mr' ? item.textMr : item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Verification Note */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{language === 'mr' ? 'माहिती व जनसंपर्क अधिकृत फीड' : 'DGIPR Certified Feed'}</span>
              <span className="font-mono text-emerald-700 font-semibold">100% Reliable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Schedules & Past Archives Sub-Section */}
      <div className="space-y-4">
        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MaterialIcon name="event" size="xs" />
            <span>{language === 'mr' ? 'आगामी थेट कार्यक्रम वेळापत्रक' : 'Upcoming Live Schedule (3)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('archives')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'archives'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MaterialIcon name="video_library" size="xs" />
            <span>{language === 'mr' ? 'मागील प्रक्षेपण संग्रह' : 'Recorded Broadcast Archives'}</span>
          </button>
        </div>

        {/* Upcoming Events Grid */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPCOMING_EVENTS_SCHEDULE.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {evt.date} • {evt.time}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {evt.webcastStatus}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {language === 'mr' ? evt.titleMr : evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">{language === 'mr' ? 'स्थान: ' : 'Venue: '}</strong>
                    {language === 'mr' ? evt.locationMr : evt.location}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">{language === 'mr' ? 'उपस्थिती: ' : 'Dignitaries: '}</strong>
                    {language === 'mr' ? evt.dignitariesMr : evt.dignitaries}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setToast({
                      message: language === 'mr' ? 'कॅलेंडर रिमाइंडर सेट केले गेले.' : 'Webcast reminder added to calendar.',
                      type: 'success',
                    })
                  }
                  className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-gov-primary border border-slate-200 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MaterialIcon name="notification_add" size="xs" />
                  <span>{language === 'mr' ? 'स्मरणपत्र सेट करा' : 'Set Reminder'}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recorded Archives Grid */}
        {activeTab === 'archives' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECORDED_BROADCAST_ARCHIVES.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden">
                    <MaterialIcon name="play_circle" size="lg" className="text-white group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[10px]">
                      {rec.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {language === 'mr' ? rec.titleMr : rec.title}
                  </h4>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>{rec.date}</span>
                    <span className="font-semibold text-slate-700">{rec.views}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setToast({
                      message: language === 'mr' ? 'व्हिडिओ प्लेबॅक सुरू होत आहे.' : 'Starting video playback...',
                      type: 'info',
                    })
                  }
                  className="w-full py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MaterialIcon name="play_arrow" size="xs" />
                  <span>{language === 'mr' ? 'पुन्हा पहा' : 'Watch Recording'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
