'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const LiveStreaming: React.FC = () => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);
  const [activeChannel, setActiveChannel] = useState<'youtube' | 'facebook' | 'instagram' | 'tv'>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);

  const channels = [
    {
      id: 'youtube',
      label: 'YouTube',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      badgeColor: 'border-red-500 text-red-600',
      status: language === 'mr' ? 'थेट १०८०पी स्वच्छ प्रवाह' : 'Live 1080p Clean Feed',
      title: language === 'mr' ? 'मुख्यमंत्री पत्रकार परिषद: राज्य मंत्रिमंडळ निर्णय' : 'CM Press Conference: State Cabinet Decisions',
      iconRender: () => (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      id: 'facebook',
      label: 'FB',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      badgeColor: 'border-blue-500 text-blue-600',
      status: language === 'mr' ? 'थेट सोशल मीडिया प्रवाह' : 'Live Social Stream',
      title: language === 'mr' ? 'उपमुख्यमंत्री संबोधन: कोस्टल रोड व कृषी अनुदान' : 'Dy. CM Address: Coastal Road & Agri Subsidies',
      iconRender: () => (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      id: 'instagram',
      label: 'Insta',
      color: 'bg-pink-600 hover:bg-pink-700 text-white',
      badgeColor: 'border-pink-500 text-pink-600',
      status: language === 'mr' ? 'थेट संक्षिप्त व्हिडिओ' : 'Vertical Live Byte',
      title: language === 'mr' ? 'मंत्रालय माध्यम परिषद ठळक घडामोडी' : 'Mantralaya Media Briefing Highlights',
      iconRender: () => (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      id: 'tv',
      label: language === 'mr' ? 'दूरदर्शन वृत्त' : 'TV News',
      color: 'bg-slate-800 hover:bg-slate-900 text-white',
      badgeColor: 'border-slate-700 text-slate-800',
      status: language === 'mr' ? 'दूरदर्शन सह्याद्री / प्रादेशिक प्रवाह' : 'DD Sahyadri / Regional Feed',
      title: language === 'mr' ? 'राज्य माहिती थेट प्रसारण (अधिकृत)' : 'State Information Broadcast Feed (Accredited)',
      iconRender: () => <MaterialIcon name="tv" size="xs" />,
    },
  ];

  const currentChannel = channels.find((c) => c.id === activeChannel) || channels[0];

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col h-full shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.leadership.liveTitle}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {t.leadership.liveSub}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-300">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
          <span>{t.leadership.liveOnAirBadge}</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Left: Video Player Box */}
          <div className="w-full md:w-3/5 bg-slate-900 rounded-lg border border-slate-800 aspect-video relative overflow-hidden flex flex-col justify-between shadow-md">
            {/* Top Video Status Overlay */}
            <div className="p-2.5 flex items-center justify-between text-white text-[11px] bg-gradient-to-b from-black/80 to-transparent z-10">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-red-600 text-[10px] font-bold">
                  {language === 'mr' ? 'थेट' : 'LIVE'}
                </span>
                <span className="font-semibold truncate max-w-[180px]">{currentChannel.title}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-300">1080p HD</span>
            </div>

            {/* Center Play Button Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-gov-blue/90 hover:bg-gov-blue text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title={isPlaying ? (language === 'mr' ? 'प्रवाह थांबवा' : 'Pause Feed') : (language === 'mr' ? 'प्रवाह सुरू करा' : 'Start Playback')}
                aria-label={isPlaying ? (language === 'mr' ? 'प्रवाह थांबवा' : 'Pause Feed') : (language === 'mr' ? 'प्रवाह सुरू करा' : 'Start Playback')}
              >
                <MaterialIcon name="play_arrow" size="lg" className="ml-0.5" />
              </button>
            </div>

            {/* Bottom Scrubber Bar */}
            <div className="p-2 bg-gradient-to-t from-black/90 to-transparent z-10 flex items-center gap-2 text-white">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gov-blue h-full w-3/4 rounded-full"></div>
              </div>
              <MaterialIcon name="volume_up" size="xs" className="text-slate-300" />
              <MaterialIcon name="fullscreen" size="xs" className="text-slate-300" />
            </div>
          </div>

          {/* Central Connecting Node & Right Platform Buttons */}
          <div className="w-full md:w-2/5 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'mr' ? 'थेट प्रसारण स्त्रोत निवडा' : 'Select Unified Relay Stream'}
            </span>

            <div className="space-y-2">
              {channels.map((chan) => {
                const isSelected = activeChannel === chan.id;

                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannel(chan.id as 'youtube' | 'facebook' | 'instagram' | 'tv')}
                    className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'border-gov-blue bg-blue-50/80 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded text-white ${chan.color.split(' ')[0]}`}>
                        {chan.iconRender()}
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-slate-900 leading-tight">
                          {chan.label}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {chan.status}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] text-gov-blue font-bold px-1.5 py-0.5 rounded bg-blue-100">
                        {language === 'mr' ? 'सक्रिय' : 'Active'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span>
            {language === 'mr'
              ? 'दृकश्राव्य कक्ष • माहिती व जनसंपर्क महासंचालनालय थेट प्रसारण'
              : 'Audio-Visual Wing • DGIPR Broadcast Distribution Network'}
          </span>
          <span className="font-mono text-gov-primary font-semibold">
            {language === 'mr'
              ? 'राज्य एनआयसी सीडीएनद्वारे थेट प्रसारण सुरू'
              : 'Broadcasting via State NIC CDN'}
          </span>
        </div>
      </div>
    </div>
  );
};
