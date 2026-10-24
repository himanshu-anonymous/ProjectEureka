'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface SchemeSentiment {
  id: string;
  name: string;
  nameMr: string;
  department: string;
  departmentMr: string;
  positivePct: number;
  neutralPct: number;
  criticalPct: number;
  totalArticles: number;
  leadNarrative: string;
  leadNarrativeMr: string;
  trend: 'up' | 'stable' | 'down';
}

export interface DistrictNarrative {
  district: string;
  districtMr: string;
  division: 'Konkan' | 'Pune' | 'Nashik' | 'Chhatrapati Sambhajinagar' | 'Amravati' | 'Nagpur';
  divisionMr: string;
  topHeadline: string;
  topHeadlineMr: string;
  mediaOutlet: string;
  tone: 'Positive' | 'Neutral' | 'Grievance Alert';
  toneMr: 'सकारात्मक' | 'तटस्थ' | 'तक्रार / लक्षवेधी';
  actionTaken: string;
  actionTakenMr: string;
}

export interface MediaOutletAnalysis {
  outlet: string;
  type: 'Print BroadSheet' | 'TV News 24x7' | 'Digital Portal';
  circulation: string;
  todayLead: string;
  todayLeadMr: string;
  tone: 'Pro-Public Policy' | 'Balanced Analytical' | 'Critical Review' | 'Investigative';
  toneMr: 'धोरणात्मक सकारात्मक' | 'तटस्थ विश्लेषणात्मक' | 'आव्हानात्मक टीका' | 'शोध पत्रकारिता';
  alignmentScore: number;
  dgprIntervention: string;
  dgprInterventionMr: string;
}

const SCHEMES_SENTIMENT: SchemeSentiment[] = [
  {
    id: 'SCH-01',
    name: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    nameMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    department: 'Women & Child Development',
    departmentMr: 'महिला व बालविकास विभाग',
    positivePct: 89,
    neutralPct: 8,
    criticalPct: 3,
    totalArticles: 1420,
    leadNarrative: 'Massive positive sentiment on direct DBT bank credit and doorstep e-KYC camp facilitation.',
    leadNarrativeMr: 'थेट बँक खात्यात सन्मान निधी जमा झाल्याने आणि गावोगावी ई-केवायसी शिबिरांमुळे अभूतपूर्व सकारात्मक प्रतिसाद.',
    trend: 'up',
  },
  {
    id: 'SCH-02',
    name: 'Atal Setu & Mumbai Metro Line 3 (Aqua Line)',
    nameMr: 'अटल सेतू व मुंबई मेट्रो ३ (अक्वा लाईन)',
    department: 'Urban Development & MMRDA',
    departmentMr: 'नगरविकास व एमएमआरडीए',
    positivePct: 92,
    neutralPct: 6,
    criticalPct: 2,
    totalArticles: 1180,
    leadNarrative: 'Commuters praise massive 45-minute travel time reduction between South Mumbai and Airport.',
    leadNarrativeMr: 'दक्षिण मुंबई ते विमानतळ प्रवासाचा वेळ ४५ मिनिटांनी कमी झाल्याबद्दल प्रवाशांकडून समाधान.',
    trend: 'up',
  },
  {
    id: 'SCH-03',
    name: 'Jalyukt Shivar Abhiyan 2.0',
    nameMr: 'जलयुक्त शिवार अभियान २.०',
    department: 'Water Resources & Soil Conservation',
    departmentMr: 'जलसंधारण व मृद संवर्धन विभाग',
    positivePct: 86,
    neutralPct: 10,
    criticalPct: 4,
    totalArticles: 640,
    leadNarrative: 'Marathwada & Vidarbha farm ponds report 92% storage capacity post late-monsoon showers.',
    leadNarrativeMr: 'मराठवाडा व विदर्भातील शेततळी व बंधाऱ्यांमध्ये ९२% जलसाठा निर्माण झाल्याचे वृत्तपत्रांतून कौतुक.',
    trend: 'up',
  },
  {
    id: 'SCH-04',
    name: 'Namo Shetkari Mahasanman Nidhi & Crop Insurance',
    nameMr: 'नमो शेतकरी महासन्मान निधी व १ रुपयात पीक विमा',
    department: 'Agriculture Department',
    departmentMr: 'कृषी विभाग',
    positivePct: 81,
    neutralPct: 13,
    criticalPct: 6,
    totalArticles: 890,
    leadNarrative: 'Kharif damage compensation disbursed; procurement center queues being monitored.',
    leadNarrativeMr: 'खरीप २५% अग्रिम भरपाई वाटप वेगाने सुरू; हमीभाव केंद्रांवरील गर्दीवर प्रशासनाचे नियंत्रण.',
    trend: 'stable',
  },
  {
    id: 'SCH-05',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (₹5 Lakh Cover)',
    nameMr: 'महात्मा जोतीराव फुले जन आरोग्य योजना (५ लाख मोफत उपचार)',
    department: 'Public Health Department',
    departmentMr: 'सार्वजनिक आरोग्य विभाग',
    positivePct: 84,
    neutralPct: 12,
    criticalPct: 4,
    totalArticles: 510,
    leadNarrative: 'Empanelled private hospitals strictly adhering to zero out-of-pocket billing mandate.',
    leadNarrativeMr: 'नोंदणीकृत रुग्णालयांमध्ये मोफत उपचारांची पारदर्शक अंमलबजावणी व आरोग्यमित्रांचे सहाय्य.',
    trend: 'up',
  },
  {
    id: 'SCH-06',
    name: 'Dharavi Slum Redevelopment & Survey Project',
    nameMr: 'धारावी पुनर्विकास व सर्वेक्षण प्रकल्प',
    department: 'Housing Department',
    departmentMr: 'गृहनिर्माण विभाग',
    positivePct: 56,
    neutralPct: 28,
    criticalPct: 16,
    totalArticles: 740,
    leadNarrative: 'Survey progressing with digital mapping; non-eligible tenement allotment criteria discussed.',
    leadNarrativeMr: 'घरोघरी डिजिटल सर्वेक्षण सुरू; अपात्र भाडेकरूंच्या पुनर्वसन निकषांबाबत स्थानिक चर्चा.',
    trend: 'stable',
  },
];

const DISTRICT_NARRATIVES: DistrictNarrative[] = [
  {
    district: 'Mumbai City & Suburban',
    districtMr: 'मुंबई शहर व उपनगर',
    division: 'Konkan',
    divisionMr: 'कोकण',
    topHeadline: 'Metro Line 3 ridership crosses 2 lakh daily mark; traffic congestion in BKC eases',
    topHeadlineMr: 'मेट्रो ३ प्रवाशांची संख्या दररोज २ लाखांवर; बीकेसी व नरिमन पॉईंट वाहतूक कोंडीत घट',
    mediaOutlet: 'Loksatta / Times of India',
    tone: 'Positive',
    toneMr: 'सकारात्मक',
    actionTaken: 'MMRDA passenger feedback broadcasted via digital kiosks.',
    actionTakenMr: 'प्रवाशांच्या सकारात्मक प्रतिक्रियांचे डिजिटल किऑस्कवर प्रक्षेपण.',
  },
  {
    district: 'Thane',
    districtMr: 'ठाणे',
    division: 'Konkan',
    divisionMr: 'कोकण',
    topHeadline: 'New flyover on Ghodbunder Road approved to eliminate bottleneck towards Borivali',
    topHeadlineMr: 'घोडबंदर मार्गावरील वाहतूक कोंडी फोडण्यासाठी नवीन उड्डाणपुलाला तांत्रिक मंजुरी',
    mediaOutlet: 'Lokmat Thane Edition',
    tone: 'Positive',
    toneMr: 'सकारात्मक',
    actionTaken: 'MSRDC execution schedule released to regional media.',
    actionTakenMr: 'एमएसआरडीसीतर्फे कामाची कालमर्यादा स्थानिक पत्रकारांना अवगत.',
  },
  {
    district: 'Pune',
    districtMr: 'पुणे',
    division: 'Pune',
    divisionMr: 'पुणे',
    topHeadline: 'Hinjawadi IT Park road widening reaches final phase; water supply pipeline laid',
    topHeadlineMr: 'हिंजवडी आयटी पार्क रस्ता रुंदीकरण अंतिम टप्प्यात; २४ तास पाणीपुरवठा पाईपलाईन पूर्ण',
    mediaOutlet: 'Sakal Pune',
    tone: 'Positive',
    toneMr: 'सकारात्मक',
    actionTaken: 'PMRDA developmental infographic published in newspapers.',
    actionTakenMr: 'पीएमआरडीएच्या विकासकामांची माहिती वृत्तपत्रांतून प्रसिद्ध.',
  },
  {
    district: 'Nashik',
    districtMr: 'नाशिक',
    division: 'Nashik',
    divisionMr: 'नाशिक',
    topHeadline: 'Onion export duty rationalization welcomed by Lasalgaon APMC farmers',
    topHeadlineMr: 'कांदा निर्यात शुल्क शिथिलतेमुळे लासलगाव बाजार समितीत कांद्याला समाधानकारक भाव',
    mediaOutlet: 'Pudhari Nashik',
    tone: 'Positive',
    toneMr: 'सकारात्मक',
    actionTaken: 'Marketing Federation export statistics shared with farmer unions.',
    actionTakenMr: 'पणन महामंडळाची आकडेवारी शेतकरी संघटनांसोबत सामायिक.',
  },
  {
    district: 'Chhatrapati Sambhajinagar',
    districtMr: 'छत्रपती संभाजीनगर',
    division: 'Chhatrapati Sambhajinagar',
    divisionMr: 'छत्रपती संभाजीनगर',
    topHeadline: 'Cotton procurement centers open across 9 talukas; moisture meter testing transparent',
    topHeadlineMr: '९ तालुक्यांत कापूस हमीभाव खरेदी केंद्र सुरू; ओलावा तपासणीत शेतकऱ्यांना पारदर्शकता',
    mediaOutlet: 'Divya Marathi',
    tone: 'Positive',
    toneMr: 'सकारात्मक',
    actionTaken: 'District Information Office published daily APMC arrival rates.',
    actionTakenMr: 'जिल्हा माहिती कार्यालयातर्फे दररोज आवक व दरांची प्रसिद्धीपत्रके जारी.',
  },
  {
    district: 'Yavatmal',
    districtMr: 'यवतमाळ',
    division: 'Amravati',
    divisionMr: 'अमरावती',
    topHeadline: 'Farmers request additional weighing scales at soybean procurement center in Wani',
    topHeadlineMr: 'वणी येथील सोयाबीन खरेदी केंद्रावर अतिरिक्त वजनकाटे सुरू करण्याची शेतकऱ्यांची मागणी',
    mediaOutlet: 'Tarun Bharat',
    tone: 'Grievance Alert',
    toneMr: 'तक्रार / लक्षवेधी',
    actionTaken: 'District Collector dispatched 3 additional electronic scales within 4 hours.',
    actionTakenMr: 'जिल्हाधिकाऱ्यांनी तातडीने ३ अतिरिक्त वजनकाटे उपलब्ध करून दिले.',
  },
  {
    district: 'Nagpur',
    districtMr: 'नागपूर',
    division: 'Nagpur',
    divisionMr: 'नागपूर',
    topHeadline: 'Nag River Rejuvenation pollution mitigation project tenders finalized by NMC',
    topHeadlineMr: 'नाग नदी प्रदूषण नियंत्रण व पुनरुज्जीवन प्रकल्पाच्या निविदा अंतिम टप्प्यात',
    mediaOutlet: 'The Hitavada / Lokmat Nagpur',
    tone: 'Positive',
    toneMr: 'सकारात्मक',
    actionTaken: 'DGPR Nagpur regional desk held technical media briefing.',
    actionTakenMr: 'डीजीपीआर नागपूर शाखेतर्फे पत्रकारांसाठी विशेष तांत्रिक वार्तालाप आयोजित.',
  },
];

const MEDIA_OUTLETS_DATA: MediaOutletAnalysis[] = [
  {
    outlet: 'Lokmat (लोकमत)',
    type: 'Print BroadSheet',
    circulation: '1.45M Daily',
    todayLead: 'Ladki Bahin Diwali bonus advance credited to rural women beneficiaries across 36 districts',
    todayLeadMr: 'राज्यभरातील लाडक्या बहिणींच्या खात्यात दिवाळी सन्मान निधी जमा; ग्रामीण भागात उत्साहाचे वातावरण',
    tone: 'Pro-Public Policy',
    toneMr: 'धोरणात्मक सकारात्मक',
    alignmentScore: 94,
    dgprIntervention: 'Routine data briefing by DGPR News Desk',
    dgprInterventionMr: 'डीजीपीआर वृत्त विभागाकडून अधिकृत आकडेवारी पुरवली',
  },
  {
    outlet: 'Sakal (सकाळ)',
    type: 'Print BroadSheet',
    circulation: '1.28M Daily',
    todayLead: 'Infrastructure boom: Atal Setu and Samruddhi Mahamarg transform intra-state transit logistics',
    todayLeadMr: 'अटल सेतू व समृद्धी महामार्गामुळे राज्याच्या दळणवळणात क्रांती; शेतमालाची मुंबईत जलद पोहोच',
    tone: 'Pro-Public Policy',
    toneMr: 'धोरणात्मक सकारात्मक',
    alignmentScore: 91,
    dgprIntervention: 'MSRDC transit duration analytics shared',
    dgprInterventionMr: 'एमएसआरडीसी वाहतूक वेळेचा अभ्यास अहवाल सादर',
  },
  {
    outlet: 'Loksatta (लोकसत्ता)',
    type: 'Print BroadSheet',
    circulation: '420K Daily',
    todayLead: 'Fiscal discipline analysis: Balancing capital infrastructure CAPEX with flagship social schemes',
    todayLeadMr: 'पायाभूत सुविधा भांडवली खर्च आणि लोककल्याणकारी योजनांचा अर्थसंकल्पीय समतोल: सखोल विश्लेषण',
    tone: 'Balanced Analytical',
    toneMr: 'तटस्थ विश्लेषणात्मक',
    alignmentScore: 88,
    dgprIntervention: 'Finance Dept whitepaper points clarified',
    dgprInterventionMr: 'वित्त विभागाच्या तरतुदींचा सविस्तर खुलासा पुरवला',
  },
  {
    outlet: 'ABP Majha (एबीपी माझा)',
    type: 'TV News 24x7',
    circulation: 'Statewide Marathi TRP #1',
    todayLead: 'Special Prime-Time Report: Ground reality of water storage in Marathwada farm ponds',
    todayLeadMr: 'थेट ग्राउंड रिपोर्ट: मराठवाड्यातील शेततळ्यांमधील जलसाठा आणि रब्बी हंगामाची पूर्वतयारी',
    tone: 'Pro-Public Policy',
    toneMr: 'धोरणात्मक सकारात्मक',
    alignmentScore: 92,
    dgprIntervention: 'Live telemetry stream access granted to news crew',
    dgprInterventionMr: 'वृत्तवाहिनीच्या प्रतिनिधींना जलसंपदा थेट आकडेवारी उपलब्ध',
  },
  {
    outlet: 'TV9 Marathi (टीव्ही ९ मराठी)',
    type: 'TV News 24x7',
    circulation: 'Statewide Marathi TRP #2',
    todayLead: 'Crop insurance claim settlement: 98% claims processed within 7 working days',
    todayLeadMr: 'पीक विमा भरपाई वाटप: एका आठवड्यात ९८% दाव्यांचा निपटारा; तक्रार निवारण कक्ष सक्रिय',
    tone: 'Pro-Public Policy',
    toneMr: 'धोरणात्मक सकारात्मक',
    alignmentScore: 89,
    dgprIntervention: 'Agriculture Commissioner soundbite coordinated',
    dgprInterventionMr: 'कृषी आयुक्तांची थेट मुलाखत आयोजित केली',
  },
  {
    outlet: 'Zee 24 Taas (झी २४ तास)',
    type: 'TV News 24x7',
    circulation: 'Statewide Marathi News',
    todayLead: 'Skill Development Mega Job Fair in Chhatrapati Sambhajinagar offers 18,000 appointment letters',
    todayLeadMr: 'छत्रपती संभाजीनगर येथे महारोजगार मेळाव्यात १८,००० तरुणांना थेट नियुक्तीपत्रे वाटप',
    tone: 'Pro-Public Policy',
    toneMr: 'धोरणात्मक सकारात्मक',
    alignmentScore: 93,
    dgprIntervention: 'Live OB van coordination provided',
    dgprInterventionMr: 'थेट प्रक्षेपणासाठी डीजीपीआर माध्यम सहाय्य',
  },
];

export const MediaIntelligenceScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBriefModal, setShowBriefModal] = useState<boolean>(false);

  const filteredDistricts = useMemo(() => {
    return DISTRICT_NARRATIVES.filter((d) => {
      const matchesDiv = selectedDivision === 'all' || d.division === selectedDivision;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        d.district.toLowerCase().includes(q) ||
        d.districtMr.toLowerCase().includes(q) ||
        d.topHeadline.toLowerCase().includes(q) ||
        d.topHeadlineMr.toLowerCase().includes(q);
      return matchesDiv && matchesSearch;
    });
  }, [selectedDivision, searchQuery]);

  return (
    <div className="p-4 sm:p-6 max-w-[1740px] w-full mx-auto space-y-6">
      {/* 1. EXECUTIVE 08:00 AM BRIEFING BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {language === 'mr'
                ? 'माहिती व जनसंपर्क महासंचालनालय (DGPR) • दैनिक माध्यम संवेदनशीलता अहवाल कक्ष'
                : 'DGPR Daily Media Sentiment & Narrative Radar (08:00 AM Brief)'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <MaterialIcon name="analytics" size="md" className="text-amber-600" />
            <span>
              {language === 'mr'
                ? 'माध्यम कल, संवेदनशीलता व वृत्तांत रडार दालन'
                : 'DGPR Media Sentiment & Statewide Narrative Intelligence Radar'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? '५१६ वृत्तपत्रे, १२ टीव्ही वृत्तवाहिन्या आणि सोशल मीडियावरील जनतेच्या भावनांचे रिअल-टाइम संवेदनशीलता विश्लेषण.'
              : 'Real-time narrative sentiment analytics across 516 daily print newspapers, 12 television channels, and social media conversations.'}
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              setToast({
                message:
                  language === 'mr'
                    ? 'दैनिक माध्यम अहवाल (२४ ऑक्टोबर २०२६ - ०८:०० AM) डाउनलोड झाला.'
                    : 'Morning Intelligence Brief (24 Oct 2026 - 08:00 AM) exported.',
                type: 'info',
              })
            }
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MaterialIcon name="download" size="xs" />
            <span>{language === 'mr' ? 'दैनिक अहवाल PDF' : 'Export Brief PDF'}</span>
          </button>

          <button
            onClick={() => setShowBriefModal(true)}
            className="px-4 py-2 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <MaterialIcon name="description" size="xs" />
            <span>{language === 'mr' ? 'गुप्तवार्ता संक्षेप पहा' : 'View Executive Brief'}</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE SUMMARY MORNING STRIP */}
      <div className="bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-slate-800 shadow-2xs">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <MaterialIcon name="campaign" size="xs" className="text-amber-700" />
            <span>
              {language === 'mr'
                ? 'माननीय मुख्यमंत्री व मंत्रिमंडळासाठी दैनिक माध्यम संक्षेप (२४ ऑक्टोबर २०२६ • ०८:०० AM)'
                : 'Executive Media Takeaway for Hon’ble Chief Minister & Cabinet (24 Oct 2026 • 08:00 AM)'}
            </span>
          </span>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
            {language === 'mr' ? 'राज्यव्यापी सकारात्मक कल: ६४%' : 'Statewide Positive Ratio: 64%'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {language === 'mr'
            ? 'आज राज्यभरातील वृत्तपत्रांच्या पहिल्या पानावर ‘माझी लाडकी बहीण योजनेचा’ हप्ता वेळेत जमा झाल्याचे कौतुक करणारे वृत्त प्रमुख स्थानी आहे. मुंबई मेट्रो ३ च्या वेळेची बचत नागरिकांच्या पसंतीस उतरली आहे. अमरावती व यवतमाळ जिल्ह्यातील सोयाबीन हमीभाव केंद्रांवरील गर्दी निवारणासाठी जिल्हाधिकाऱ्यांनी अतिरिक्त वजनकाटे सुरू केल्याने तक्रारींचे वेळीच निवारण झाले आहे.'
            : 'Today’s front-page headlines across Maharashtra broadly applaud the seamless direct benefit transfer under the Majhi Ladki Bahin Scheme. Commuters extensively praised the 45-minute transit time saving on Mumbai Metro Line 3. Prompt intervention by the Yavatmal Collectorate with additional procurement scales averted potential agrarian grievances.'}
        </p>
      </div>

      {/* 3. FOUR PILLARS SENTIMENT GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {language === 'mr' ? 'वृत्तपत्र माध्यम कल (५१६ आवृत्त्या)' : 'Print Dailies (516 Editions)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              64% Pos
            </span>
          </div>
          <div className="my-2">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>{language === 'mr' ? 'सकारात्मक' : 'Positive'}</span>
              <span>64%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[64%]" />
              <div className="h-full bg-slate-300 w-[24%]" />
              <div className="h-full bg-rose-500 w-[12%]" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">64% Pos • 24% Neu • 12% Crit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {language === 'mr' ? 'टीव्ही वृत्तवाहिन्या (१२ चॅनेल्स)' : 'TV News (12 Channels)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              58% Pos
            </span>
          </div>
          <div className="my-2">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>{language === 'mr' ? 'प्राइम-टाइम चर्चा' : 'Prime-Time Tone'}</span>
              <span>58%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[58%]" />
              <div className="h-full bg-slate-300 w-[26%]" />
              <div className="h-full bg-rose-500 w-[16%]" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">58% Pos • 26% Neu • 16% Crit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {language === 'mr' ? 'डिजिटल वेब पोर्टल्स (१४० पोर्टल्स)' : 'Digital News Portals (140)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              68% Pos
            </span>
          </div>
          <div className="my-2">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>{language === 'mr' ? 'वेब वाचक कल' : 'Web Sentiment'}</span>
              <span>68%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[68%]" />
              <div className="h-full bg-slate-300 w-[20%]" />
              <div className="h-full bg-rose-500 w-[12%]" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">68% Pos • 20% Neu • 12% Crit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {language === 'mr' ? 'समाजमाध्यमे (१.२M पोस्ट्स)' : 'Social Media Pulse (1.2M)'}
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              61% Pos
            </span>
          </div>
          <div className="my-2">
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>{language === 'mr' ? 'नागरिक संवाद' : 'Public Engagement'}</span>
              <span>61%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div className="h-full bg-emerald-500 w-[61%]" />
              <div className="h-full bg-slate-300 w-[27%]" />
              <div className="h-full bg-rose-500 w-[12%]" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">61% Pos • 27% Neu • 12% Crit</span>
        </div>
      </div>

      {/* 4. KEY GOVERNMENT SCHEMES SENTIMENT MATRIX */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MaterialIcon name="bar_chart" size="sm" className="text-gov-primary" />
              <span>
                {language === 'mr'
                  ? 'प्रमुख शासकीय योजना: माध्यम संवेदनशीलता व पोहोच विश्लेषण'
                  : 'Key State Schemes: Media Sentiment & Narrative Share'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr'
                ? '५१६ वृत्तपत्रे व चॅनेल्समधील सकारात्मक, तटस्थ आणि आक्षेपात्मक कव्हरेजचे वस्तुनिष्ठ वर्गीकरण.'
                : 'Objective tone decomposition of coverage across all authenticated regional press outlets.'}
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Updated: 24 Oct 2026, 08:00 AM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCHEMES_SENTIMENT.map((scheme) => (
            <div
              key={scheme.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider truncate">
                    {language === 'mr' ? scheme.departmentMr : scheme.department}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {scheme.totalArticles} {language === 'mr' ? 'बातम्या' : 'Articles'}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  {language === 'mr' ? scheme.nameMr : scheme.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                  {language === 'mr' ? scheme.leadNarrativeMr : scheme.leadNarrative}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{scheme.positivePct}% {language === 'mr' ? 'सकारात्मक' : 'Positive'}</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {scheme.criticalPct}% {language === 'mr' ? 'तक्रारी' : 'Crit'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${scheme.positivePct}%` }} />
                  <div className="h-full bg-slate-300" style={{ width: `${scheme.neutralPct}%` }} />
                  <div className="h-full bg-rose-500" style={{ width: `${scheme.criticalPct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. DIVISIONAL NARRATIVE RADAR & LOCALIZED GRIEVANCE MITIGATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MaterialIcon name="place" size="sm" className="text-gov-primary" />
              <span>
                {language === 'mr'
                  ? 'विभागीय व जिल्हास्तरीय माध्यम निरीक्षण व तत्काळ प्रतिसाद (ATR)'
                  : 'Divisional & District Narrative Monitoring & Action Taken'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr'
                ? 'स्थानिक तक्रारींचे मोठ्या जनक्षोभात रूपांतर होण्यापूर्वी डीजीपीआरतर्फे तातडीने माहिती समन्वय.'
                : 'Proactive DGPR coordination mitigating localized press grievances before escalation.'}
            </p>
          </div>

          {/* Division Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: language === 'mr' ? 'सर्व विभाग' : 'All Divisions' },
              { id: 'Konkan', label: language === 'mr' ? 'कोकण' : 'Konkan' },
              { id: 'Pune', label: language === 'mr' ? 'पुणे' : 'Pune' },
              { id: 'Nashik', label: language === 'mr' ? 'नाशिक' : 'Nashik' },
              { id: 'Chhatrapati Sambhajinagar', label: language === 'mr' ? 'छ. संभाजीनगर' : 'Chh. Sambhajinagar' },
              { id: 'Amravati', label: language === 'mr' ? 'अमरावती' : 'Amravati' },
              { id: 'Nagpur', label: language === 'mr' ? 'नागपूर' : 'Nagpur' },
            ].map((div) => {
              const isActive = selectedDivision === div.id;
              return (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivision(div.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-gov-primary text-white border-gov-primary shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {div.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Narrative Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">{language === 'mr' ? 'जिल्हा व विभाग' : 'District & Division'}</th>
                <th className="p-3">{language === 'mr' ? 'प्रमुख बातमी / मथळा' : 'Leading Press Headline'}</th>
                <th className="p-3">{language === 'mr' ? 'माध्यम स्रोत' : 'Media Outlet'}</th>
                <th className="p-3">{language === 'mr' ? 'संवेदनशीलता कल' : 'Sentiment Tone'}</th>
                <th className="p-3">{language === 'mr' ? 'डीजीपीआर तत्काळ प्रतिसाद (ATR)' : 'DGPR Proactive Action Taken'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredDistricts.map((item, idx) => {
                const isGrievance = item.tone === 'Grievance Alert';
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold whitespace-nowrap text-slate-900">
                      <div>{language === 'mr' ? item.districtMr : item.district}</div>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {language === 'mr' ? item.divisionMr : item.division}
                      </span>
                    </td>
                    <td className="p-3 font-semibold max-w-sm">
                      {language === 'mr' ? item.topHeadlineMr : item.topHeadline}
                    </td>
                    <td className="p-3 text-slate-600 whitespace-nowrap">{item.mediaOutlet}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isGrievance
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {language === 'mr' ? item.toneMr : item.tone}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-700 max-w-sm">
                      <div className="flex items-center gap-1.5">
                        <MaterialIcon name="check" size="xs" className="text-emerald-600 shrink-0" />
                        <span>{language === 'mr' ? item.actionTakenMr : item.actionTaken}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. MEDIA HOUSES EDITORIAL STANCE & COVERAGE ACCURACY */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MaterialIcon name="newspaper" size="sm" className="text-gov-primary" />
              <span>
                {language === 'mr'
                  ? 'प्रमुख वृत्तसमूह व वृत्तवाहिन्या: संपादकीय भूमिका व तथ्य समन्वय'
                  : 'Major News Outlets: Editorial Stance & Fact Alignment Index'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr'
                ? 'राज्यातील आघाडीच्या वृत्तपत्रांचे आजचे संपादकीय मथळे आणि वस्तुस्थिती दर्शक गुण.'
                : 'Tracking coverage objectivity, lead stories, and proactive background briefings.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDIA_OUTLETS_DATA.map((outlet, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{outlet.outlet}</h3>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {outlet.circulation}
                  </span>
                </div>

                <div className="text-[10px] uppercase font-bold text-gov-primary mb-1">
                  {language === 'mr' ? outlet.toneMr : outlet.tone}
                </div>

                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                  "{language === 'mr' ? outlet.todayLeadMr : outlet.todayLead}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{language === 'mr' ? 'तथ्य सुसंगतता:' : 'Fact Alignment:'}</span>
                  <span className="font-bold text-emerald-700 font-mono">{outlet.alignmentScore}%</span>
                </div>
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center gap-1.5">
                  <MaterialIcon name="description" size="xs" className="text-slate-400 shrink-0" />
                  <span className="truncate">{language === 'mr' ? outlet.dgprInterventionMr : outlet.dgprIntervention}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. EXECUTIVE BRIEFING DOSSIER MODAL */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src="/MAHAGOV_ICON.svg" alt="MahaGov" className="w-9 h-9 object-contain" />
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                    CONFIDENTIAL • CABINET BRIEFING
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {language === 'mr'
                      ? 'दैनिक माध्यम संवेदनशीलता गुप्तवार्ता संक्षेप (०८:०० AM)'
                      : 'DGPR Daily Executive Intelligence Digest'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowBriefModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-slate-800">
              <div className="border-b border-slate-200 pb-3">
                <div className="text-xs text-slate-500">
                  {language === 'mr'
                    ? 'दिनांक: २४ ऑक्टोबर २०२६ • वेळ: ०८:०० AM IST • संकलन: महासंचालक, माहिती व जनसंपर्क महासंचालनालय (DGPR)'
                    : 'Date: 24 Oct 2026 • Time: 08:00 AM IST • Compiled by: Director General, DGPR Maharashtra'}
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <h4 className="font-bold text-slate-900 text-sm">
                  {language === 'mr' ? '१. प्रमुख धोरणात्मक निष्कर्ष:' : '1. Strategic Summary:'}
                </h4>
                <p>
                  {language === 'mr'
                    ? '• राज्यभरातील सर्व ३६ जिल्ह्यांतील ५१६ वृत्तपत्रांचे कव्हरेज एकूण ६४% सकारात्मक असून लाडकी बहीण योजनेच्या हप्त्यांची थेट जमा ही मुख्य बातमी आहे.'
                    : '• Coverage across all 36 districts is 64% net positive, anchored prominently by timely DBT disbursements to women beneficiaries.'}
                </p>
                <p>
                  {language === 'mr'
                    ? '• मुंबई मेट्रो ३ आणि अटल सेतू संदर्भातील प्रवास वेळेची बचत नागरिकांमध्ये अत्यंत लोकप्रिय ठरली असून सोशल मीडिया एंगेजमेंटमध्ये सकारात्मकता दिसून येत आहे.'
                    : '• Metro Line 3 commute time savings generated strong spontaneous praise across suburban commuter communities.'}
                </p>

                <h4 className="font-bold text-slate-900 text-sm pt-2">
                  {language === 'mr' ? '२. तत्काळ प्रशासकीय लक्ष देण्याची क्षेत्रे:' : '2. Key Action Areas:'}
                </h4>
                <p>
                  {language === 'mr'
                    ? '• यवतमाळ व अमरावती येथील सोयाबीन हमीभाव केंद्रांवरील गर्दीवर स्थानिक प्रशासनाने घेतलेल्या अतिरिक्त वजनकाट्यांच्या निर्णयामुळे शेतकरी समाधान व्यक्त करत आहेत.'
                    : '• Procurement scale additions by Yavatmal Collectorate successfully pacified early queue congestion at agrarian centers.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowBriefModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {language === 'mr' ? 'बंद करा' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    setShowBriefModal(false);
                    setToast({
                      message: language === 'mr' ? 'दैनिक संक्षेप सुरक्षितपणे डाऊनलोड झाला.' : 'Executive digest exported.',
                      type: 'success',
                    });
                  }}
                  className="px-4 py-2 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {language === 'mr' ? 'अहवाल सेव्ह करा (PDF)' : 'Download Brief (PDF)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaIntelligenceScreen;
