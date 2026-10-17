'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

export const LiveStreamingLinkSection: React.FC = () => {
  const { language } = useDashboardStore();
  const isMr = language === 'mr';

  const [selectedSource, setSelectedSource] = useState<'cmo' | 'cabinet' | 'emergency'>('cmo');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamQuality, setStreamQuality] = useState<'1080p' | '720p'>('1080p');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(6138);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const formatElapsed = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const sources = [
    {
      id: 'cmo' as const,
      label: isMr ? 'मुख्यमंत्री कक्ष' : 'CMO Briefing',
      viewers: isMr ? '१४.२ हजार थेट' : '14.2K Live',
      title: isMr ? 'मा. मुख्यमंत्री पत्रकार परिषद (थेट प्रक्षेपण)' : 'Hon. Chief Minister Press Briefing (Live Telecast)'
    },
    {
      id: 'cabinet' as const,
      label: isMr ? 'मंत्रिमंडळ सभागृह' : 'Cabinet Hall',
      viewers: isMr ? 'स्टँडबाय फीड' : 'Standby Feed',
      title: isMr ? 'राज्य मंत्रिमंडळ बैठक व मंत्रीस्तरीय माहिती' : 'State Cabinet Proceedings & Ministerial Briefing'
    },
    {
      id: 'emergency' as const,
      label: isMr ? 'आपत्ती कक्ष' : 'Crisis Desk',
      viewers: isMr ? 'सक्रिय फीड' : 'Active Feed',
      title: isMr ? 'राज्य आपत्ती निवारण केंद्र • मंत्रालय' : 'State Disaster Operations Line • Mantralaya'
    },
  ];

  const currentSource = sources.find((s) => s.id === selectedSource) || sources[0];

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col p-4 space-y-3 shadow-2xs">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <MaterialIcon name="videocam" size="md" className="text-gov-primary" />
          <div>
            <h4 className="text-xs font-bold text-gov-primary">
              {isMr ? 'थेट प्रक्षेपण लिंक आणि ब्रॉडकास्ट' : 'Live Streaming Link & Broadcast'}
            </h4>
            <p className="text-[10px] text-slate-500">
              {isMr ? 'माहिती व जनसंपर्क महासंचालनालय (DGIPR) हाय-डेफिनिशन रिले' : 'DGIPR High-Definition Telecast Relay'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-red-100 text-red-800 rounded border border-red-200 flex items-center gap-1.5 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          <span>{isMr ? 'थेट सुरू' : 'ON AIR'}</span>
        </span>
      </div>

      {/* Source Selectors */}
      <div className="flex gap-1.5 text-xs">
        {sources.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSource(s.id)}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold transition-colors text-center cursor-pointer ${
              selectedSource === s.id
                ? 'bg-gov-primary text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Interactive Video Broadcast Player */}
      <div
        ref={playerRef}
        className="w-full bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between p-3 relative group overflow-hidden aspect-video shadow-md select-none"
      >
        {/* Top Status Overlay */}
        <div className="flex items-center justify-between text-[10px] font-mono text-white/90 z-10 bg-gradient-to-b from-black/80 to-transparent p-1.5 -m-1.5 rounded-t">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.2 rounded bg-red-600 text-white font-bold text-[9px]">
              {isPlaying ? (isMr ? 'थेट रिले' : 'LIVE RELAY') : (isMr ? 'थांबवले' : 'PAUSED')}
            </span>
            <span className="truncate max-w-[170px] text-slate-200 font-sans font-medium text-[11px]">
              {currentSource.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStreamQuality(streamQuality === '1080p' ? '720p' : '1080p')}
              className="px-1.5 py-0.2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[10px] transition-colors cursor-pointer"
            >
              {streamQuality} HD
            </button>
            <span className="flex items-center gap-1 text-slate-300">
              <MaterialIcon name="group" size="xs" className="text-amber-400" />
              <span>{currentSource.viewers}</span>
            </span>
          </div>
        </div>

        {/* Center Playback Button & Ambient Visualization */}
        <div className="flex flex-col items-center justify-center my-auto z-10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white transition-all transform hover:scale-105 shadow-lg cursor-pointer"
            aria-label={
              isMr
                ? (isPlaying ? 'प्रवाह थांबवा' : 'प्रवाह सुरू करा')
                : (isPlaying ? 'Pause broadcast stream' : 'Play broadcast stream')
            }
          >
            {isPlaying ? (
              <MaterialIcon name="pause" size="md" />
            ) : (
              <MaterialIcon name="play_arrow" size="md" className="ml-0.5" />
            )}
          </button>
          <div className="text-center mt-2">
            <span className="text-[11px] font-bold text-white block">
              {currentSource.title}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {isMr ? 'सह्याद्री अतिथीगृह • चॅनेल १ थेट ऑप्टिकल फीड' : 'Sahyadri Guest House • Channel 1 Direct Optical Feed'}
            </span>
          </div>
        </div>

        {/* Bottom Playback Bar with VU Meter & Controls */}
        <div className="flex items-center justify-between text-white text-xs z-10 bg-gradient-to-t from-black/90 to-transparent p-1.5 -m-1.5 rounded-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label={
                isMr
                  ? (isMuted ? 'आवाज सुरू करा' : 'मूक करा')
                  : (isMuted ? 'Unmute stream' : 'Mute stream')
              }
            >
              {isMuted ? (
                <MaterialIcon name="volume_off" size="xs" className="text-rose-400" />
              ) : (
                <MaterialIcon name="volume_up" size="xs" className="text-slate-300" />
              )}
            </button>

            {/* Simulated Audio VU Meter */}
            <div className="flex items-end gap-0.5 h-3 w-8" title={isMr ? 'प्रक्षेपण ऑडिओ पातळी' : 'Broadcast Audio Level'}>
              <span className={`w-1 rounded-xs bg-emerald-500 transition-all ${isPlaying && !isMuted ? 'h-3' : 'h-1'}`}></span>
              <span className={`w-1 rounded-xs bg-emerald-400 transition-all ${isPlaying && !isMuted ? 'h-2' : 'h-1'}`}></span>
              <span className={`w-1 rounded-xs bg-amber-400 transition-all ${isPlaying && !isMuted ? 'h-2.5' : 'h-1'}`}></span>
              <span className={`w-1 rounded-xs bg-red-500 transition-all ${isPlaying && !isMuted ? 'h-1.5' : 'h-0.5'}`}></span>
            </div>

            <span className="font-mono text-[10px] text-slate-300">
              {formatElapsed(elapsedSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>{isMr ? 'बिटरेट: ६.४ Mbps' : 'Bitrate: 6.4 Mbps'}</span>
            <button
              onClick={handleToggleFullscreen}
              className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
              title={
                isMr
                  ? (isFullscreen ? 'पूर्ण स्क्रीनमधून बाहेर पडा' : 'पूर्ण स्क्रीन मोड')
                  : (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode')
              }
              aria-label={
                isMr
                  ? (isFullscreen ? 'पूर्ण स्क्रीनमधून बाहेर पडा' : 'पूर्ण स्क्रीन मोड')
                  : (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode')
              }
            >
              <MaterialIcon name="fullscreen" size="xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Stream Direct Link Button */}
      <div className="pt-1">
        <a
          href="https://dgipr.maharashtra.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gov-primary text-white rounded text-xs font-semibold hover:bg-gov-primary-dark transition-colors shadow-2xs cursor-pointer"
        >
          <span>{isMr ? 'अधिकृत थेट प्रक्षेपण पोर्टल उघडा' : 'Open External Verified Telecast Portal'}</span>
          <MaterialIcon name="open_in_new" size="xs" className="text-amber-400" />
        </a>
      </div>
    </div>
  );
};
