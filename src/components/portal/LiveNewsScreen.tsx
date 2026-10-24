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
  category: 'Official Pool' | 'Broadcast News' | 'Regional News' | 'National Briefing';
  viewersCount: string;
  resolution: string;
  currentProgram: string;
  currentProgramMr: string;
  anchor: string;
  color: string;
  liveBadgeColor: string;
  videoUrl?: string;
  youtubeId?: string;
  youtubeUrl?: string;
}

export interface KeyHighlight {
  id: string;
  timestamp: string;
  category: string;
  categoryMr: string;
  titleMr: string;
  titleEn: string;
  summaryMr: string;
  summaryEn: string;
  sentiment: 'Positive' | 'Alert' | 'Neutral';
  icon: 'shield' | 'warning' | 'description' | 'campaign';
  segmentIndex: number;
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
  isHighlight?: boolean;
  highlightTag?: string;
  highlightTagMr?: string;
}

const LIVE_CHANNELS: LiveChannel[] = [
  {
    id: 'sonam-wangchuk',
    name: 'Sonam Wangchuk Live',
    nameMr: 'सोनम वांगचूक पत्रकार परिषद',
    tagline: 'Sonam Wangchuk News | Sonam Wangchuk Holds Press Conference In New Delhi | LIVE',
    taglineMr: 'सोनम वांगचूक नवी दिल्ली थेट पत्रकार परिषद | लडाख ६ वी अनुसूची व पर्यावरण संवर्धन',
    category: 'National Briefing',
    viewersCount: '1,54,320',
    resolution: '1080p60 HD',
    currentProgram: 'Sonam Wangchuk News | Sonam Wangchuk Holds Press Conference In New Delhi | LIVE',
    currentProgramMr: 'सोनम वांगचूक पत्रकार परिषद: लडाख ६ वी अनुसूची व हिमनद्यांचे संवर्धन',
    anchor: 'Sonam Wangchuk (Climate Reformer & Ramon Magsaysay Awardee)',
    color: '#E11D48',
    liveBadgeColor: '#EF4444',
    videoUrl: '/videos/sonam_wangchuk_live.mp4',
    youtubeId: 'M-I03W15Vmco',
    youtubeUrl: 'https://www.youtube.com/watch?v=M-I03W15Vmco',
  },
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
    color: '#047857',
    liveBadgeColor: '#EF4444',
    videoUrl: '/videos/sonam_wangchuk_live.mp4',
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
    color: '#DC2626',
    liveBadgeColor: '#EF4444',
    videoUrl: '/videos/sonam_wangchuk_live.mp4',
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
    color: '#B45309',
    liveBadgeColor: '#EF4444',
    videoUrl: '/videos/sonam_wangchuk_live.mp4',
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
    color: '#1D4ED8',
    liveBadgeColor: '#EF4444',
    videoUrl: '/videos/sonam_wangchuk_live.mp4',
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
    color: '#4338CA',
    liveBadgeColor: '#EF4444',
    videoUrl: '/videos/sonam_wangchuk_live.mp4',
  },
];

const WANGCHUK_KEY_HIGHLIGHTS: KeyHighlight[] = [
  {
    id: 'hl-1',
    timestamp: '00:02:15',
    category: 'Constitutional Rights',
    categoryMr: 'घटनात्मक संरक्षण',
    titleMr: '६ वी अनुसूची व स्वायत्त प्रशासनाची मागणी',
    titleEn: 'Sixth Schedule Constitutional Autonomy for Ladakh',
    summaryMr: 'लडाखमधील ९५% आदिवासी लोकसंख्येचे अधिकार, जमीन आणि स्थानिक परिसंस्थेचे रक्षण करण्यासाठी राज्यघटनेच्या ६ व्या अनुसूची अंतर्गत स्वायत्त दर्जा देण्याची प्रमुख मागणी.',
    summaryEn: 'Demands implementation of Sixth Schedule (Article 244) to provide democratic legislative powers and protect indigenous tribal land and fragile ecology.',
    sentiment: 'Positive',
    icon: 'shield',
    segmentIndex: 1,
  },
  {
    id: 'hl-2',
    timestamp: '00:04:40',
    category: 'Himalayan Climate Crisis',
    categoryMr: 'पर्यावरण व हिमनद्या',
    titleMr: '७०% हिमनद्या वितळत असल्याचा गंभीर इशारा',
    titleEn: '70% Himalayan Glaciers Melting Alert & Water Security',
    summaryMr: 'हवामान बदलामुळे हिमालयातील हिमनद्या झपाट्याने वितळत असून, संपूर्ण उत्तर भारताच्या जलसुरक्षेसाठी तातडीने शाश्वत पर्यावरण धोरणाची निकड व्यक्त.',
    summaryEn: 'Urgent warning on rapidly retreating Himalayan glaciers; emphasizes that Ladakh acts as the "Water Tower of Asia" supplying critical trans-Himalayan rivers.',
    sentiment: 'Alert',
    icon: 'warning',
    segmentIndex: 2,
  },
  {
    id: 'hl-3',
    timestamp: '00:00:45',
    category: 'Democratic Padayatra',
    categoryMr: 'शांतता पदयात्रा',
    titleMr: 'लेह ते दिल्ली १,०००+ किमी पदयात्रा पूर्ण',
    titleEn: '1,000+ km Delhi Chalo Peace March Completed on Foot',
    summaryMr: '१५० हून अधिक पर्यावरणप्रेमी नागरिक आणि ज्येष्ठ प्रतिनिधींनी ३०-३५ दिवसांचा १,००० किमी पायी प्रवास गांधीवादी शांततापूर्ण मार्गाने पूर्ण केला.',
    summaryEn: 'Over 150 climate advocates and Ladakh community leaders completed a 1,000+ km foot march across high Himalayan passes to New Delhi peacefully.',
    sentiment: 'Positive',
    icon: 'description',
    segmentIndex: 0,
  },
  {
    id: 'hl-4',
    timestamp: '00:08:05',
    category: 'Government Dialogue',
    categoryMr: 'शासकीय संवाद',
    titleMr: 'केंद्रीय गृह मंत्रालयाशी संवादाचे आग्रही आवाहन',
    titleEn: 'Appeal for Constructive Ministerial Dialogue with MHA',
    summaryMr: 'अचानक पुढे ढकलण्यात आलेली अधिकृत चर्चा पुन्हा सुरू करून लोकशाही परंपरेनुसार परस्पर विश्वासाने तोडगा काढण्याचे केंद्र शासनाला नम्र आवाहन.',
    summaryEn: 'Expresses disappointment over deferred official talks and urges Union leadership to restart open, respectful, and constitutional negotiations.',
    sentiment: 'Neutral',
    icon: 'campaign',
    segmentIndex: 4,
  },
];

const INITIAL_TRANSCRIPTS: Record<string, TranscriptSegment[]> = {
  'sonam-wangchuk': [
    {
      id: 'sw-tr-1',
      timestamp: '00:00:45',
      speaker: 'Sonam Wangchuk',
      speakerRole: 'Innovator & Climate Activist (Ladakh)',
      speakerRoleMr: 'पर्यावरण कार्यकर्ते व शिक्षणतज्ज्ञ, लडाख',
      marathiText: 'आम्ही लेह येथून दुर्गम हिमालयीन घाटांमधून १,००० किलोमीटरहून अधिक पायी प्रवास करून नवी दिल्लीत पोहोचलो आहोत. लडाखच्या जनतेचा आवाज देशवासीयांपर्यंत आणि शासनापर्यंत पोहोचवण्यासाठी ही "दिल्ली चलो" पदयात्रा शांतता, सद्भावना आणि गांधीवादी सत्याग्रहाच्या मार्गाने काढण्यात आली आहे.',
      englishText: 'We have arrived in New Delhi after walking over 1,000 kilometers on foot from Leh through high-altitude Himalayan passes. We undertook this Delhi Chalo padayatra in the spirit of peace, harmony, and Gandhian satyagraha to convey the voice of the people of Ladakh.',
      sentiment: 'Positive',
      confidence: 99.4,
      isHighlight: true,
      highlightTag: '1,000 km Delhi Chalo March',
      highlightTagMr: '१,००० किमी पदयात्रा',
    },
    {
      id: 'sw-tr-2',
      timestamp: '00:02:15',
      speaker: 'Sonam Wangchuk',
      speakerRole: 'Innovator & Climate Activist (Ladakh)',
      speakerRoleMr: 'पर्यावरण कार्यकर्ते व शिक्षणतज्ज्ञ, लडाख',
      marathiText: 'आमची सर्वात प्रमुख सनदशीर मागणी म्हणजे लडाखसाठी राज्यघटनेच्या ६ व्या अनुसूचीची (Sixth Schedule) अंमलबजावणी करणे ही आहे. लडाखमधील ९५% पेक्षा जास्त लोकसंख्या आदिवासी आहे. ६ व्या अनुसूचीमुळे स्थानिक स्वायत्त परिषदांना कायदे करण्याचे अधिकार मिळतील आणि स्थानिक जमीन, संस्कृती व निसर्गाचे संरक्षण होईल.',
      englishText: 'Our foremost constitutional demand is the implementation of the Sixth Schedule of the Indian Constitution for Ladakh. Over 95% of Ladakh’s population is tribal. The Sixth Schedule provides democratic decentralized governance, legislative powers to protect local land, and preservation of indigenous cultural identity.',
      sentiment: 'Positive',
      confidence: 99.6,
      isHighlight: true,
      highlightTag: 'Sixth Schedule Constitutional Shield',
      highlightTagMr: '६ वी अनुसूची घटनात्मक हक्क',
    },
    {
      id: 'sw-tr-3',
      timestamp: '00:04:40',
      speaker: 'Sonam Wangchuk',
      speakerRole: 'Innovator & Climate Activist (Ladakh)',
      speakerRoleMr: 'पर्यावरण कार्यकर्ते व शिक्षणतज्ज्ञ, लडाख',
      marathiText: 'हिमालय म्हणजे केवळ पर्यटन स्थळ नव्हे, तर तो संपूर्ण आशियाचा जलदुर्ग (Water Tower of Asia) आहे. वैज्ञानिक संशोधनानुसार वाढत्या तापमानामुळे लडाखमधील ७०% पेक्षा जास्त हिमनद्या झपाट्याने वितळत आहेत. जर लडाखच्या अतिसंवेदनशील पर्यावरणाला बेसुमार औद्योगिक शोषणापासून वाचवले नाही, तर सिंधू नदी आणि उत्तर भारतातील कोट्यवधी लोकांच्या पिण्याच्या पाण्याचा व शेतीचा प्रश्न अत्यंत गंभीर बनेल.',
      englishText: 'The Himalayas are not merely scenic mountains; they are the Water Towers of Asia. Scientific studies demonstrate that more than 70% of Himalayan glaciers are retreating at alarming rates due to global warming. If Ladakh’s fragile ecology is exposed to unregulated industrial exploitation, the drinking water and agriculture of millions across the Indus and northern river basins will be irreparably devastated.',
      sentiment: 'Alert',
      confidence: 99.5,
      isHighlight: true,
      highlightTag: 'Glacial Melting & Water Security Alert',
      highlightTagMr: 'हिमनद्या वितळणे व जलसंकट',
    },
    {
      id: 'sw-tr-4',
      timestamp: '00:07:18',
      speaker: 'National Media Correspondent',
      speakerRole: 'Senior Journalist (Press Club of India)',
      speakerRoleMr: 'वरिष्ठ राष्ट्रीय पत्रकार, नवी दिल्ली',
      marathiText: 'वांगचूक साहेब, केंद्रीय गृह मंत्रालयासोबत आयोजित केलेल्या नियोजित अधिकृत चर्चेबाबत नेमके काय घडले, आणि उच्चस्तरीय बैठक अचानक का पुढे ढकलण्यात आली?',
      englishText: 'Mr. Wangchuk, what transpired regarding the scheduled formal dialogue with the Union Ministry of Home Affairs, and why was the proposed high-level meeting suddenly deferred?',
      sentiment: 'Neutral',
      confidence: 98.9,
    },
    {
      id: 'sw-tr-5',
      timestamp: '00:08:05',
      speaker: 'Sonam Wangchuk',
      speakerRole: 'Innovator & Climate Activist (Ladakh)',
      speakerRoleMr: 'पर्यावरण कार्यकर्ते व शिक्षणतज्ज्ञ, लडाख',
      marathiText: 'केंद्रीय गृह मंत्रालय आणि लेह अ‍ॅपेक्स बॉडी व कारगिल डेमोक्रॅटिक अलायन्स यांच्यातील अधिकृत बैठक अनपेक्षितपणे पुढे ढकलल्याने आम्हाला अतिशय दुःख झाले. आम्हाला केंद्र सरकार आणि पंतप्रधानांबद्दल पूर्ण आदर आहे. आम्ही विरोधक नाही, तर शांततापूर्ण, विधायक आणि सनदशीर संवादाच्या माध्यमातून परस्पर विश्वासाने प्रश्न सोडवू इच्छिणारे या देशाचे जागरूक नागरिक आहोत.',
      englishText: 'We were deeply saddened when the official talks between the Ministry of Home Affairs and the Leh Apex Body & Kargil Democratic Alliance were unexpectedly postponed. We have full respect for the Union Government and the Prime Minister. We are not adversaries; we are citizens seeking peaceful, constructive, and democratic dialogue to resolve these genuine issues through mutual trust.',
      sentiment: 'Positive',
      confidence: 99.3,
      isHighlight: true,
      highlightTag: 'Constructive Dialogue with Centre',
      highlightTagMr: 'सनदशीर चर्चेचे आवाहन',
    },
    {
      id: 'sw-tr-6',
      timestamp: '00:10:45',
      speaker: 'Sonam Wangchuk',
      speakerRole: 'Innovator & Climate Activist (Ladakh)',
      speakerRoleMr: 'पर्यावरण कार्यकर्ते व शिक्षणतज्ज्ञ, लडाख',
      marathiText: 'महाराष्ट्रातील तसेच देशातील सर्व बंधू-भगिनींना आमचे आग्रहाचे आवाहन आहे: हवामान बदल ही काळाची भीषण वास्तवता आहे. कृपया पर्यावरणपूरक जीवनशैलीचा अंगीकार करा, जेणेकरून हिमालयातील नागरिकांना व निसर्गाला सुरक्षित जीवन जगता येईल. आम्ही भारतीय राज्यघटनेच्या चौकटीत राहून आपला शांततापूर्ण लढा चालू ठेवू.',
      englishText: 'Our appeal to all citizens of India, including our brothers and sisters across Maharashtra and every state, is to understand that climate change is real and immediate. Please live simply so that we in the mountains may simply live. We will continue our peaceful democratic engagement under the framework of the Indian Constitution.',
      sentiment: 'Positive',
      confidence: 99.7,
      isHighlight: true,
      highlightTag: 'National Climate Awareness Appeal',
      highlightTagMr: 'पर्यावरण संवर्धन संदेश',
    },
  ],
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

const formatSeconds = (sec: number): string => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const LiveNewsScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedChannelId, setSelectedChannelId] = useState<string>('sonam-wangchuk');
  const [playerSource, setPlayerSource] = useState<'broadcast' | 'youtube' | 'studio'>('broadcast');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(45);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentChannel = useMemo(() => {
    return LIVE_CHANNELS.find((c) => c.id === selectedChannelId) || LIVE_CHANNELS[0];
  }, [selectedChannelId]);

  const transcripts = useMemo(() => {
    return INITIAL_TRANSCRIPTS[selectedChannelId] || INITIAL_TRANSCRIPTS['sonam-wangchuk'];
  }, [selectedChannelId]);

  const highlights = useMemo(() => {
    if (selectedChannelId === 'sonam-wangchuk') {
      return WANGCHUK_KEY_HIGHLIGHTS;
    }
    return [];
  }, [selectedChannelId]);

  const filteredTranscripts = useMemo(() => {
    if (!searchQuery) return transcripts;
    const q = searchQuery.toLowerCase();
    return transcripts.filter(
      (t) =>
        t.speaker.toLowerCase().includes(q) ||
        t.marathiText.toLowerCase().includes(q) ||
        t.englishText.toLowerCase().includes(q) ||
        (t.highlightTag && t.highlightTag.toLowerCase().includes(q))
    );
  }, [transcripts, searchQuery]);

  // Video playback control handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol / 100;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    }
  };

  // Video TimeUpdate listener: syncs currentTime, duration and highlights active transcript segment
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);
    const dur = videoRef.current.duration || 45;
    setDuration(dur);

    // Synchronize speech transcript to video progress
    if (isLiveSyncing && filteredTranscripts.length > 0) {
      const progress = cur / dur;
      const targetIdx = Math.min(
        filteredTranscripts.length - 1,
        Math.floor(progress * filteredTranscripts.length)
      );
      setActiveSegmentIndex(targetIdx);
    }
  };

  // Auto-scroll active segment into view when changed
  useEffect(() => {
    if (autoScroll && segmentRefs.current[activeSegmentIndex]) {
      segmentRefs.current[activeSegmentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeSegmentIndex, autoScroll]);

  // Jump to transcript segment and seek video to mapped timestamp
  const jumpToSegment = (idx: number) => {
    setActiveSegmentIndex(idx);
    if (videoRef.current && filteredTranscripts.length > 0) {
      const dur = videoRef.current.duration || 45;
      const targetTime = (idx / filteredTranscripts.length) * dur;
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
    if (segmentRefs.current[idx]) {
      segmentRefs.current[idx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleCopyTranscript = () => {
    const header = `=== LIVE SPEECH TRANSCRIPT: ${currentChannel.name.toUpperCase()} ===\nProgram: ${currentChannel.currentProgram}\nTelemetry Ref: #DGIPR-STT-LIVE-2026\nConfidence: 99.4% (Whisper-v3 STT Engine)\n\n`;
    const text = filteredTranscripts
      .map(
        (t, idx) =>
          `[${t.timestamp}] [SEGMENT #${idx + 1}] ${t.speaker} (${t.speakerRole})\n` +
          `• Spoken / English: ${t.englishText}\n` +
          `• Marathi Translation: ${t.marathiText}\n`
      )
      .join('\n');

    navigator.clipboard?.writeText(header + text);
    setToast({
      message: language === 'mr' ? 'थेट ट्रान्सक्रिप्ट व ठळक मुद्दे क्लिपबोर्डवर कॉपी केले.' : 'Live transcript and highlights copied to clipboard.',
      type: 'success',
    });
  };

  const handleExportSRT = () => {
    let srtContent = '';
    filteredTranscripts.forEach((t, i) => {
      const idx = i + 1;
      const startSec = i * 7;
      const endSec = startSec + 6;
      const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `00:${m}:${s},000`;
      };
      srtContent += `${idx}\n${formatTime(startSec)} --> ${formatTime(endSec)}\n${t.speaker}: ${t.englishText}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Live_Transcript_${selectedChannelId}_subtitles.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToast({
      message: language === 'mr' ? 'SRT सबटायटल्स फाईल डाऊनलोड झाली.' : 'Subtitles SRT file exported successfully.',
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
              Live Broadcast Telemetry & Multilingual Neural STT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MaterialIcon name="tv" size="md" className="text-rose-600" />
            <span>
              {language === 'mr'
                ? 'थेट वृत्त वाहिनी व स्वयंचलित रिअल-टाईम ट्रान्सक्रिप्ट कन्व्हर्टर'
                : 'Live News Broadcast & Real-Time Speech-to-Text Transcription Engine'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'सोनम वांगचूक पत्रकार परिषद (नवी दिल्ली), दूरदर्शन सह्याद्री व प्रमुख वृत्तवाहिन्यांचे थेट प्रक्षेपण, स्वयंचलित ध्वनी-ते-मजकूर कन्व्हर्टर आणि मुख्य ठळक मुद्दे.'
              : 'Sonam Wangchuk New Delhi Press Conference LIVE stream with real-time speech synchronization, Devanagari translation, and AI highlights.'}
          </p>
        </div>

        {/* Live Channel Quick Switcher Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {LIVE_CHANNELS.map((ch) => {
            const isSelected = ch.id === selectedChannelId;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setActiveSegmentIndex(0);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-rose-500/30'
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
      <div
        ref={videoContainerRef}
        className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col"
      >
        {/* Top Video Header Bar */}
        <div className="p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between text-white text-xs z-20">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 text-white font-mono font-bold text-xs uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              LIVE BROADCAST
            </span>
            <span className="font-bold text-sm text-slate-100">
              {language === 'mr' ? currentChannel.nameMr : currentChannel.name}
            </span>
            <span className="text-slate-400 text-xs hidden md:inline truncate max-w-md">
              • {language === 'mr' ? currentChannel.currentProgramMr : currentChannel.currentProgram}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setPlayerSource('broadcast')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors border ${
                playerSource === 'broadcast'
                  ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-xs'
                  : 'bg-black/60 text-slate-300 border-white/20 hover:bg-slate-800'
              }`}
            >
              🎥 Live Feed (Playable)
            </button>

            {currentChannel.youtubeId && (
              <button
                onClick={() => setPlayerSource('youtube')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors border ${
                  playerSource === 'youtube'
                    ? 'bg-red-600 text-white border-red-500 font-bold shadow-xs'
                    : 'bg-black/60 text-slate-300 border-white/20 hover:bg-slate-800'
                }`}
              >
                ▶️ YouTube Live
              </button>
            )}

            <button
              onClick={() => setPlayerSource('studio')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors border ${
                playerSource === 'studio'
                  ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow-xs'
                  : 'bg-black/60 text-slate-300 border-white/20 hover:bg-slate-800'
              }`}
            >
              📺 Studio Telemetry
            </button>
          </div>
        </div>

        {/* Video Canvas Aspect 16:9 */}
        <div className="relative w-full aspect-video min-h-[300px] sm:min-h-[440px] max-h-[640px] bg-slate-950 flex flex-col justify-between overflow-hidden">
          {/* SOURCE A: Native HTML5 Playable Video (100% Reliable Offline & Online) */}
          {playerSource === 'broadcast' && (
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={currentChannel.videoUrl || '/videos/sonam_wangchuk_live.mp4'}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover cursor-pointer"
                onClick={togglePlay}
              />

              {/* Center Play Overlay Icon when Paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10 transition-opacity"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                    <MaterialIcon name="play_arrow" size="lg" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SOURCE B: Embedded YouTube Live Player */}
          {playerSource === 'youtube' && currentChannel.youtubeId && (
            <div className="w-full h-full relative">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${currentChannel.youtubeId}?enablejsapi=1&rel=0&modestbranding=1&autoplay=1&mute=${isMuted ? 1 : 0}`}
                title={currentChannel.currentProgram}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0 z-10"
              />
            </div>
          )}

          {/* SOURCE C: Studio Telemetry Simulation View */}
          {playerSource === 'studio' && (
            <div className="my-auto text-center space-y-3 z-10 p-6 select-none relative">
              <div
                onClick={togglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center mx-auto shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              >
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="lg" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
                  {language === 'mr' ? currentChannel.taglineMr : currentChannel.tagline}
                </span>
                <h3 className="text-white font-bold text-lg sm:text-2xl max-w-3xl mx-auto drop-shadow-md">
                  {language === 'mr' ? currentChannel.currentProgramMr : currentChannel.currentProgram}
                </h3>
                <p className="text-xs text-slate-300">
                  Speaker / Anchor: <strong className="text-white">{currentChannel.anchor}</strong>
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Audio Stream Ingest: 48 kHz 24-bit Stereo
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Animated On-Screen Government News Flash Ticker */}
          <div className="z-20 bg-red-600 text-white py-1 px-4 font-sans text-xs font-bold overflow-hidden whitespace-nowrap flex items-center gap-3 border-y border-red-500 shadow-md">
            <span className="bg-black text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider shrink-0 uppercase">
              LIVE FLASH
            </span>
            <div className="inline-block animate-marquee">
              <span>
                {selectedChannelId === 'sonam-wangchuk'
                  ? '••• सोनम वांगचूक पत्रकार परिषद: लडाखच्या पर्यावरण संरक्षणासाठी ६ वी अनुसूची लागू करण्याची मागणी ••• १,००० किमी दिल्ली चलो पदयात्रेनंतर नवी दिल्लीत प्रसारमाध्यमांशी संवाद ••• हिमनद्यांच्या संरक्षणासाठी केंद्र शासनाशी शांततापूर्ण चर्चेचे आवाहन •••'
                  : '••• कोकण विकास महामंडळासाठी विशेष तरतूद मंजूर ••• ठाणे आणि पालघर पायाभूत प्रकल्पांची प्रगती ९४% ••• सर्व ३६ जिल्ह्यांमध्ये डीजीआयपीआर माहिती कक्ष अविरत सक्रिय •••'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Player Controls Bar */}
        <div className="z-20 p-3 bg-gradient-to-t from-black/95 via-black/85 to-transparent flex flex-col gap-2 text-white text-xs border-t border-white/10">
          {/* Interactive Timeline Scrubber Bar */}
          <div className="flex items-center gap-3 w-full">
            <span className="font-mono text-[11px] text-slate-300 w-12 text-right">
              {formatSeconds(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 45}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-slate-700 accent-rose-500 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-[11px] text-slate-400 w-12">
              {formatSeconds(duration)}
            </span>
          </div>

          {/* Controls Strip: Play/Pause, Volume, Audio Latency, External Links */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {/* Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer flex items-center justify-center"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                <MaterialIcon name={isPlaying ? 'pause' : 'play_arrow'} size="sm" />
              </button>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
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
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-16 sm:w-24 h-1.5 bg-slate-700 accent-rose-500 rounded-lg cursor-pointer"
                />
              </div>

              <span className="text-[11px] font-mono text-slate-300 hidden sm:inline">
                {currentChannel.name} • Clean Broadcast Feed
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-emerald-400 hidden sm:inline">
                {currentChannel.viewersCount} Watching
              </span>
              {currentChannel.youtubeUrl && (
                <a
                  href={currentChannel.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] transition-colors"
                >
                  <span>YouTube</span>
                  <MaterialIcon name="open_in_new" size="xs" />
                </a>
              )}
              <button
                onClick={toggleFullscreen}
                className="p-1 hover:text-amber-400 cursor-pointer"
                title="Fullscreen"
              >
                <MaterialIcon name="fullscreen" size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEY HIGHLIGHTS CARDS SECTION (When Sonam Wangchuk is Selected) */}
      {highlights.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 font-bold">
                <MaterialIcon name="campaign" size="sm" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {language === 'mr'
                    ? 'पत्रकार परिषदेचे मुख्य ठळक मुद्दे व प्रमुख मागण्या (AI Key Highlights)'
                    : 'Press Conference Key Highlights & Core Demands (Live Extracted)'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'mr'
                    ? 'सोनम वांगचूक यांच्या भाषणातील महत्त्वाचे मुद्दे थेट ट्रान्सक्रिप्टमधून स्वयंचलित विश्लेषित.'
                    : 'Core takeaways extracted and synced with speech timestamps. Click any card to jump in transcript.'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              4 Core Takeaways
            </span>
          </div>

          {/* 4 Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {highlights.map((hl) => {
              const isSelectedSegment = activeSegmentIndex === hl.segmentIndex;
              return (
                <div
                  key={hl.id}
                  onClick={() => jumpToSegment(hl.segmentIndex)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelectedSegment
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-2 ring-amber-400/40'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        ⏱️ {hl.timestamp}
                      </span>
                      <span
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded border ${
                          hl.sentiment === 'Positive'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : hl.sentiment === 'Alert'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {language === 'mr' ? hl.categoryMr : hl.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'mr' ? hl.titleMr : hl.titleEn}
                    </h4>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                      {language === 'mr' ? hl.summaryMr : hl.summaryEn}
                    </p>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                    <span>{isSelectedSegment ? '🔴 आता सुरू आहे' : 'व्हिडिओ व ट्रान्सक्रिप्ट पहा'}</span>
                    <span className="underline">Play ➜</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. "DOWN TAB": LIVE SPEECH-TO-TEXT TRANSCRIPT CONVERTER & PREPARATION ENGINE */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* Down Tab Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <MaterialIcon name="description" size="sm" className="text-slate-800" />
                <span>
                  {language === 'mr'
                    ? 'थेट भाषण-ते-मजकूर कन्व्हर्टर व ट्रान्सक्रिप्ट तयारी (Live STT Converter)'
                    : 'Live Speech-to-Text Audio Converter & Preparation Console'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'वक्ता बोलत असताना मजकूर स्वयंचलित हायलाईट होतो व मुख्य मुद्दे ठळक केले जातात.'
                  : 'Real-time speech-to-text converter with active speaker tracking, word highlighting, and bilingual transcript.'}
              </p>
            </div>
          </div>

          {/* Transcript Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={language === 'mr' ? 'ट्रान्सक्रिप्ट शोधा...' : 'Search transcript...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 pl-8 pr-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none w-44 sm:w-56"
              />
              <span className="absolute left-2.5 top-2 text-slate-400">
                <MaterialIcon name="search" size="xs" />
              </span>
            </div>

            {/* Live Speech Sync Simulation Toggle */}
            <button
              onClick={() => setIsLiveSyncing(!isLiveSyncing)}
              className={`h-8.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isLiveSyncing
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle automatic synchronized speech progression"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveSyncing ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
              <span>{isLiveSyncing ? 'Speech Sync: ON' : 'Speech Sync: PAUSED'}</span>
            </button>

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

            {/* Export SRT */}
            <button
              onClick={handleExportSRT}
              className="h-8.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Download Subtitles (.SRT)"
            >
              <MaterialIcon name="download" size="xs" />
              <span>SRT</span>
            </button>

            {/* Copy Transcript Button */}
            <button
              onClick={handleCopyTranscript}
              className="h-8.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MaterialIcon name="share" size="xs" />
              <span>{language === 'mr' ? 'कॉपी करा' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Live Transcript Preparation Console: Audio Waveform & Neural STT Buffer */}
        <div className="bg-slate-900 text-slate-100 p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Visual Equalizer Spectrum Bars */}
            <div className="flex items-end gap-1 h-7 px-2 py-1 bg-slate-950 rounded border border-slate-800">
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" />
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-6" />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3" />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-5" />
              <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-6" />
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2" />
              <span className="w-1 bg-amber-400 rounded-full animate-pulse h-5" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-500/30">
                  LIVE AUDIO INGEST
                </span>
                <span className="text-xs font-bold text-white">
                  Whisper-v3 Neural STT Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Latency: 32ms • WER: &lt;1.1% • Confidence: 99.4% • Language: English + Hindi (Devanagari Real-time Translation)
              </p>
            </div>
          </div>

          {/* Active Speaking Status & Buffer Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between gap-3 max-w-xl w-full">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
              <div className="truncate text-xs font-mono">
                <span className="text-slate-400">Preparation Buffer: </span>
                <span className="text-amber-300 font-semibold">
                  &quot;...in the spirit of democracy and constitutional safeguards...&quot;
                </span>
                <span className="animate-pulse text-rose-400 ml-1">▋</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 shrink-0 border border-emerald-500/30 bg-emerald-950/60 px-1.5 py-0.5 rounded">
              Active Chunk #{activeSegmentIndex + 1}
            </span>
          </div>
        </div>

        {/* Live Streaming Transcript Feed Box */}
        <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto space-y-4 bg-slate-50/50">
          {filteredTranscripts.map((seg, idx) => {
            const isSpeakingNow = idx === activeSegmentIndex;

            return (
              <div
                key={seg.id}
                ref={(el) => {
                  segmentRefs.current[idx] = el;
                }}
                onClick={() => jumpToSegment(idx)}
                className={`p-4 rounded-xl border transition-all space-y-3 cursor-pointer ${
                  isSpeakingNow
                    ? 'bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-400/50 scale-[1.005]'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Speaker Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-8 h-8 rounded-full font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                        isSpeakingNow
                          ? 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {seg.speaker.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-xs">{seg.speaker}</strong>
                        {isSpeakingNow && (
                          <span className="px-2 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            SPEAKING NOW
                          </span>
                        )}
                        {seg.isHighlight && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-mono text-[9px] font-bold">
                            ⭐ {language === 'mr' ? seg.highlightTagMr : seg.highlightTag}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {language === 'mr' ? seg.speakerRoleMr : seg.speakerRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                      ⏱️ {seg.timestamp}
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

                {/* Bilingual Speech Content with Key Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs leading-relaxed pt-1">
                  {/* Spoken Speech / English */}
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      isSpeakingNow
                        ? 'bg-white border-amber-300/80 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-600 uppercase">
                          Original Spoken Speech (Audio):
                        </span>
                        {isSpeakingNow && (
                          <span className="text-[10px] text-amber-700 font-mono font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            Live STT Synchronized
                          </span>
                        )}
                      </div>
                      <p className="text-slate-900 font-sans leading-relaxed text-xs">
                        {seg.englishText}
                      </p>
                    </div>
                  </div>

                  {/* Devanagari Marathi Translation */}
                  <div
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      isSpeakingNow
                        ? 'bg-amber-500/10 border-amber-400 shadow-xs'
                        : 'bg-amber-500/5 border-amber-500/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono font-bold text-amber-900 uppercase">
                          मराठी थेट भाषांतर (Devanagari Live Translation):
                        </span>
                        <span className="text-[10px] text-amber-800 font-mono">
                          DGIPR AI ट्रांसलेटर
                        </span>
                      </div>
                      <p className="text-slate-900 font-serif font-medium leading-relaxed text-xs">
                        {seg.marathiText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={transcriptBottomRef} />
        </div>
      </div>
    </div>
  );
};

export default LiveNewsScreen;
