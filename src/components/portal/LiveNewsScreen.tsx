'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface LiveChannel {
  id: string;
  name: string;
  nameMr: string;
  tagline: string;
  taglineMr: string;
  category: 'Official Pool' | 'Broadcast News' | 'Regional News';
  viewersCount: string;
  resolution: string;
  currentProgram: string;
  currentProgramMr: string;
  anchor: string;
  color: string;
  liveBadgeColor: string;
}

export interface TranscriptSegment {
  id: string;
  timestamp: string;
  speaker: string;
  speakerRole: string;
  speakerRoleMr: string;
  marathiText: string;
  englishText: string;
  sentiment: 'Positive' | 'Neutral' | 'Alert';
  confidence: number;
}

const LIVE_CHANNELS: LiveChannel[] = [
  {
    id: 'dd-sahyadri',
    name: 'DD Sahyadri',
    nameMr: 'दूरदर्शन सह्याद्री',
    tagline: 'Official State Government Broadcast Pool',
    taglineMr: 'महाराष्ट्र शासन अधिकृत थेट प्रक्षेपण',
    category: 'Official Pool',
    viewersCount: '48,250',
    resolution: '1080p60 HD',
    currentProgram: 'Special Cabinet Briefing: Coastal Infrastructure',
    currentProgramMr: 'मंत्रिमंडळ विशेष वार्तापत्र: कोकण पायाभूत सुविधा',
    anchor: 'Senior Correspondent (Mantralaya)',
    color: '#047857', // Emerald
    liveBadgeColor: '#EF4444',
  },
  {
    id: 'abp-majha',
    name: 'ABP Majha',
    nameMr: 'एबीपी माझा',
    tagline: '24x7 Maharashtra Breaking Live',
    taglineMr: 'थेट घडामोडी आणि २४ तास महाराष्ट्र',
    category: 'Broadcast News',
    viewersCount: '86,400',
    resolution: '1080p60 HD',
    currentProgram: 'Maha-Command Ground Report: Thane & Palghar',
    currentProgramMr: 'महा-कमांड ग्राउंड रिपोर्ट: ठाणे व पालघर विकास',
    anchor: 'Prashant Kadam',
    color: '#DC2626', // Red
    liveBadgeColor: '#EF4444',
  },
  {
    id: 'tv9-marathi',
    name: 'TV9 Marathi',
    nameMr: 'टीव्ही ९ मराठी',
    tagline: 'Statewide Real-time Telemetry Dispatch',
    taglineMr: '३६ जिल्ह्यांचे थेट अपडेट्स',
    category: 'Broadcast News',
    viewersCount: '72,100',
    resolution: '1080p60 HD',
    currentProgram: 'Speed News 50: Vidarbha & Marathwada Agro Cluster',
    currentProgramMr: 'फास्ट ५०: विदर्भ व मराठवाडा कृषी क्लस्टर',
    anchor: 'Rajesh Patil',
    color: '#B45309', // Amber
    liveBadgeColor: '#EF4444',
  },
  {
    id: 'news18-lokmat',
    name: 'News18 Lokmat',
    nameMr: 'न्यूज १८ लोकमत',
    tagline: 'Investigative Public Welfare Audit',
    taglineMr: 'शासकीय योजना व जनतेचा आवाज',
    category: 'Broadcast News',
    viewersCount: '63,800',
    resolution: '1080p60 HD',
    currentProgram: 'Big Debate: 90-Minute Crisis SLA Impact',
    currentProgramMr: 'विशेष चर्चा: ९०-मिनिटांचे क्रायसिस एसएलए',
    anchor: 'Milind Bhagwat',
    color: '#1D4ED8', // Blue
    liveBadgeColor: '#EF4444',
  },
  {
    id: 'cmo-media-briefing',
    name: 'CMO Briefing Hall',
    nameMr: 'मंत्रालय मुख्य पत्रकार कक्ष',
    tagline: 'High-Level Mantralaya Direct Stream',
    taglineMr: 'मंत्रालय ६ वा मजला थेट प्रक्षेपण कक्ष',
    category: 'Official Pool',
    viewersCount: '34,900',
    resolution: '1080p60 HD',
    currentProgram: 'DGIPR Press Conference: Q3 CPI Index Release',
    currentProgramMr: 'माहिती व जनसंपर्क पत्रकार परिषद: ३६ जिल्हे निर्देशांक',
    anchor: 'Dr. Arvind M. Gokhale (DG)',
    color: '#4338CA', // Indigo
    liveBadgeColor: '#EF4444',
  },
];

const INITIAL_TRANSCRIPTS: Record<string, TranscriptSegment[]> = {
  'dd-sahyadri': [
    {
      id: 'tr-1',
      timestamp: '19:48:12',
      speaker: 'Dr. Arvind M. Gokhale',
      speakerRole: 'Director General, DGIPR',
      speakerRoleMr: 'महासंचालक, माहिती व जनसंपर्क',
      marathiText: 'मंत्रालयातील महा-कमांड सेंटरच्या माध्यमातून राज्यातील सर्व ३६ जिल्ह्यांतील माहिती कक्षांशी रिअल-टाईम संपर्क प्रस्थापित झाला आहे.',
      englishText: 'Through the Maha-Command Center at Mantralaya, real-time connectivity has been established with media cells across all 36 districts.',
      sentiment: 'Positive',
      confidence: 99.1,
    },
    {
      id: 'tr-2',
      timestamp: '19:49:05',
      speaker: 'Nilesh R. Kelkar, IAS',
      speakerRole: 'District Collector, Thane',
      speakerRoleMr: 'जिल्हाधिकारी, ठाणे',
      marathiText: 'ठाणे जिल्ह्यातील नागरिकांच्या तक्रारींचा निपटारा ९० मिनिटांच्या विहित वेळेत करण्यासाठी विशेष आपत्कालीन नियंत्रण कक्ष अविरत कार्यरत आहे.',
      englishText: 'Thane District Emergency Control Cell operates 24x7 to resolve public grievances within the mandated 90-minute crisis SLA.',
      sentiment: 'Positive',
      confidence: 98.4,
    },
    {
      id: 'tr-3',
      timestamp: '19:50:40',
      speaker: 'News Anchor (DD Sahyadri)',
      speakerRole: 'Broadcast Moderator',
      speakerRoleMr: 'वृत्त निवेदक',
      marathiText: 'कोकण विभागातील पाचही जिल्ह्यांसाठी ५,४०० कोटींच्या पायाभूत सुविधा विकास पॅकेजला वित्त विभागाने तातडीने हिरवा कंदील दाखवला आहे.',
      englishText: 'The Finance Department has fast-tracked approvals for the ₹5,400 Crore coastal infrastructure development package covering Konkan.',
      sentiment: 'Positive',
      confidence: 97.8,
    },
    {
      id: 'tr-4',
      timestamp: '19:51:22',
      speaker: 'Vikram S. Mahajan, IAS',
      speakerRole: 'District Collector, Palghar',
      speakerRoleMr: 'जिल्हाधिकारी, पालघर',
      marathiText: 'पालघर किनारपट्टीवर वाढवण बंदर विकासासह स्थानिक मच्छीमारांसाठी नवीन आधुनिक शीतगृहांचे बांधकाम वेगाने सुरू आहे.',
      englishText: 'In Palghar, modern cold storage terminals are being constructed rapidly alongside the Vadhavan port development for local fishermen.',
      sentiment: 'Neutral',
      confidence: 98.2,
    },
    {
      id: 'tr-5',
      timestamp: '19:52:15',
      speaker: 'Dr. Arvind M. Gokhale',
      speakerRole: 'Director General, DGIPR',
      speakerRoleMr: 'महासंचालक, माहिती व जनसंपर्क',
      marathiText: 'सर्व प्रसारमाध्यमे, दूरचित्रवाणी आणि सोशल मीडिया विश्लेषणाचा एकत्रित समन्वय साधून अचूक माहिती जनतेपर्यंत पोहोचवली जात आहे.',
      englishText: 'Synthesizing print, television broadcasts, and social listening streams ensures accurate, verified government information reaches citizens.',
      sentiment: 'Positive',
      confidence: 99.3,
    },
  ],
  'abp-majha': [
    {
      id: 'tr-abp-1',
      timestamp: '19:47:30',
      speaker: 'Prashant Kadam',
      speakerRole: 'Senior Anchor, ABP Majha',
      speakerRoleMr: 'मुख्य वृत्तनिवेदक',
      marathiText: 'मोठी बातमी: समृद्धी महामार्ग कॉरिडॉरवर वाहतूक नियंत्रण अधिक कडक; डिजिटल स्पीड कॅमेऱ्यांमुळे अपघातांत ६०% घट झाली आहे.',
      englishText: 'Breaking News: Strict automated traffic enforcement on Samruddhi Expressway has reduced highway collisions by 60%.',
      sentiment: 'Positive',
      confidence: 98.9,
    },
    {
      id: 'tr-abp-2',
      timestamp: '19:49:15',
      speaker: 'Ground Reporter (Nagpur)',
      speakerRole: 'Vidarbha Bureau',
      speakerRoleMr: 'विदर्भ विशेष प्रतिनिधी',
      marathiText: 'गडचिरोलीत सूरजागड प्रकल्पामुळे स्थानिक तरुणांना तंत्रशिक्षणाच्या संधी मिळाल्याने रोजगाराचा मोठा प्रश्न सुटला आहे.',
      englishText: 'Technical education and industrial apprenticeships at Surjagarh project in Gadchiroli have created substantial rural employment.',
      sentiment: 'Positive',
      confidence: 97.6,
    },
  ],
};

export const LiveNewsScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedChannelId, setSelectedChannelId] = useState<string>('dd-sahyadri');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'transcript' | 'channels' | 'stats'>('transcript');
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  const currentChannel = useMemo(() => {
    return LIVE_CHANNELS.find((c) => c.id === selectedChannelId) || LIVE_CHANNELS[0];
  }, [selectedChannelId]);

  const transcripts = useMemo(() => {
    return INITIAL_TRANSCRIPTS[selectedChannelId] || INITIAL_TRANSCRIPTS['dd-sahyadri'];
  }, [selectedChannelId]);

  const filteredTranscripts = useMemo(() => {
    if (!searchQuery) return transcripts;
    const q = searchQuery.toLowerCase();
    return transcripts.filter(
      (t) =>
        t.speaker.toLowerCase().includes(q) ||
        t.marathiText.toLowerCase().includes(q) ||
        t.englishText.toLowerCase().includes(q)
    );
  }, [transcripts, searchQuery]);

  // Auto-scroll transcript window on update
  useEffect(() => {
    if (autoScroll && transcriptBottomRef.current) {
      transcriptBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts, autoScroll]);

  const handleCopyTranscript = () => {
    const text = filteredTranscripts
      .map((t) => `[${t.timestamp}] ${t.speaker} (${t.speakerRole}):\nMR: ${t.marathiText}\nEN: ${t.englishText}\n`)
      .join('\n');
    navigator.clipboard?.writeText(text);
    setToast({
      message: language === 'mr' ? 'थेट ट्रान्सक्रिप्ट कॉपी झाली.' : 'Live transcript copied to clipboard.',
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1780px] w-full mx-auto space-y-6">
      {/* 1. TOP HEADER & CHANNEL SELECTOR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Live TV Broadcast & Automated Transcription
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MaterialIcon name="tv" size="md" className="text-rose-600" />
            <span>
              {language === 'mr'
                ? 'थेट वृत्त वाहिनी व स्वयंचलित ट्रान्सक्रिप्ट दालन'
                : 'Live News Broadcast & Real-Time Speech-to-Text Transcription'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'दूरदर्शन सह्याद्री, एबीपी माझा व इतर वृत्तवाहिन्यांचे थेट प्रक्षेपण आणि खालील टॅबमध्ये रिअल-टाईम मराठी व इंग्रजी ट्रान्सक्रिप्ट.'
              : 'Multi-channel state news feeds with continuous timestamped Devanagari audio transcript and English translation.'}
          </p>
        </div>

        {/* Live Channel Quick Switcher Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {LIVE_CHANNELS.map((ch) => {
            const isSelected = ch.id === selectedChannelId;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannelId(ch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#EF4444' : ch.color }}
                />
                <span>{language === 'mr' ? ch.nameMr : ch.name}</span>
                {isSelected && (
                  <span className="text-[9px] font-mono bg-rose-600 text-white px-1 py-0.2 rounded font-bold">
                    ON AIR
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 16:9 BROADCAST VIDEO PLAYER SCREEN */}
      <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col">
        {/* Video Screen Aspect 16:9 */}
        <div className="relative w-full aspect-video min-h-[300px] sm:min-h-[420px] max-h-[620px] bg-slate-950 flex flex-col justify-between overflow-hidden">
          {/* Top Video Overlay Bar */}
          <div className="z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 text-white font-mono font-bold text-xs uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                LIVE BROADCAST
              </span>
              <span className="font-bold text-sm text-slate-100 hidden sm:inline">
                {language === 'mr' ? currentChannel.nameMr : currentChannel.name}
              </span>
              <span className="text-slate-400 text-xs hidden md:inline">
                • {language === 'mr' ? currentChannel.currentProgramMr : currentChannel.currentProgram}
              </span>
            </div>

            <div className="flex items-center gap-2.5 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-emerald-400">
                {currentChannel.viewersCount} Watching
              </span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-amber-300">
                {currentChannel.resolution}
              </span>
            </div>
          </div>

          {/* Central Television Screen Visual Graphics Simulation */}
          <div className="my-auto text-center space-y-3 z-10 p-6 select-none">
            <div
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center mx-auto shadow-2xl cursor-pointer hover:scale-105 transition-transform"
            >
              <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="lg" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
                {language === 'mr' ? currentChannel.taglineMr : currentChannel.tagline}
              </span>
              <h3 className="text-white font-bold text-lg sm:text-2xl max-w-2xl mx-auto drop-shadow-md">
                {language === 'mr' ? currentChannel.currentProgramMr : currentChannel.currentProgram}
              </h3>
              <p className="text-xs text-slate-300">
                Anchor / Desk: <strong className="text-white">{currentChannel.anchor}</strong>
              </p>
            </div>
          </div>

          {/* Animated On-Screen Government News Ticker */}
          <div className="z-20 bg-red-600 text-white py-1.5 px-4 font-sans text-xs font-bold overflow-hidden whitespace-nowrap flex items-center gap-3 border-y border-red-500 shadow-md">
            <span className="bg-black text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider shrink-0 uppercase">
              LIVE FLASH
            </span>
            <div className="inline-block animate-marquee">
              <span>
                {language === 'mr'
                  ? '••• कोकण विकास महामंडळासाठी विशेष तरतूद मंजूर ••• ठाणे आणि पालघर पायाभूत प्रकल्पांची प्रगती ९४% ••• सर्व ३६ जिल्ह्यांमध्ये डीजीआयपीआर माहिती कक्ष अविरत सक्रिय •••'
                  : '••• Special Allocation Approved for Konkan Infrastructure Corridor ••• Thane & Palghar Progress at 94% ••• DGIPR Telemetry Rooms Active 24x7 across all 36 Districts •••'}
              </span>
            </div>
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="z-20 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="sm" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <MaterialIcon name={isMuted ? 'volume_off' : 'volume_up'} size="sm" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 sm:w-24 h-1.5 bg-slate-700 accent-amber-500 rounded-lg cursor-pointer"
                />
              </div>

              <span className="text-[11px] font-mono text-slate-300">
                Mantralaya Media Stream #01
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="hidden sm:inline text-emerald-400">Audio Sync: 0ms Latency</span>
              <button
                onClick={() => setToast({ message: 'Fullscreen toggled', type: 'info' })}
                className="p-1 hover:text-amber-400 cursor-pointer"
                title="Fullscreen"
              >
                <MaterialIcon name="fullscreen" size="sm" />
              </button>
            </div>
          </div>

          {/* Background Ambient Gradient */}
          <div className="absolute inset-0 bg-radial from-slate-900/60 to-slate-950 pointer-events-none" />
        </div>
      </div>

      {/* 3. "DOWN TAB": LIVE SPEECH-TO-TEXT TRANSCRIPT TAB UNDERNEATH VIDEO */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* Down Tab Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MaterialIcon name="description" size="sm" className="text-slate-700" />
              <span>
                {language === 'mr'
                  ? 'थेट भाषण-ते-मजकूर ट्रान्सक्रिप्ट दालन (Live Speech-to-Text)'
                  : 'Live Speech-to-Text Audio Transcript (Bilingual Stream)'}
              </span>
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
              {filteredTranscripts.length} Segments
            </span>
          </div>

          {/* Transcript Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <input
              type="text"
              placeholder={language === 'mr' ? 'ट्रान्सक्रिप्ट शोधा...' : 'Search transcript...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none w-44 sm:w-56"
            />

            {/* Auto Scroll Toggle */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`h-8.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                autoScroll
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {autoScroll ? 'Auto-Scroll ON' : 'Auto-Scroll OFF'}
            </button>

            {/* Copy Transcript Button */}
            <button
              onClick={handleCopyTranscript}
              className="h-8.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MaterialIcon name="share" size="xs" />
              <span>{language === 'mr' ? 'कॉपी करा' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Live Streaming Transcript Feed Box */}
        <div className="p-4 sm:p-6 max-h-[460px] overflow-y-auto space-y-4 bg-slate-50/50">
          {filteredTranscripts.map((seg) => (
            <div
              key={seg.id}
              className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2"
            >
              {/* Speaker Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {seg.speaker.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <strong className="text-slate-900 text-xs block">{seg.speaker}</strong>
                    <span className="text-[10px] text-slate-500">
                      {language === 'mr' ? seg.speakerRoleMr : seg.speakerRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {seg.timestamp}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold border ${
                      seg.sentiment === 'Positive'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : seg.sentiment === 'Alert'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {seg.sentiment} ({seg.confidence}%)
                  </span>
                </div>
              </div>

              {/* Bilingual Speech Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed pt-1">
                {/* Devanagari Marathi Speech */}
                <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/15 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-amber-900 uppercase block mb-1">
                      मराठी थेट भाषण (Spoken Marathi):
                    </span>
                    <p className="text-slate-900 font-serif font-medium leading-relaxed">{seg.marathiText}</p>
                  </div>
                </div>

                {/* English Real-Time Translation */}
                <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/15 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-blue-900 uppercase block mb-1">
                      English Real-Time Translation:
                    </span>
                    <p className="text-slate-800 font-sans leading-relaxed">{seg.englishText}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={transcriptBottomRef} />
        </div>
      </div>
    </div>
  );
};
