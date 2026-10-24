'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface FactCheckItem {
  id: string;
  caseNumber: string;
  category: 'forged_gr' | 'viral_rumor' | 'deepfake' | 'recruitment_fraud' | 'out_of_context' | 'verified_true';
  categoryMr: string;
  title: string;
  titleMr: string;
  claim: string;
  claimMr: string;
  fact: string;
  factMr: string;
  verdict: 'FORGED GR' | 'FAKE' | 'MISLEADING' | 'DEEPFAKE' | 'VERIFIED TRUE';
  verdictMr: 'बनावट शासन निर्णय' | 'असत्य / खोटे' | 'दिशाभूल करणारे' | 'बनावट AI ऑडिओ' | 'प्रमाणित सत्य';
  date: string;
  channels: string[];
  department: string;
  departmentMr: string;
  actionTaken: string;
  actionTakenMr: string;
  fakeDocPreview?: {
    bogusRef: string;
    flaws: string[];
    flawsMr: string[];
  };
  authenticDoc?: {
    officialGrNo: string;
    gazetteDate: string;
    digitalSignBy: string;
  };
}

export const FACT_CHECK_RECORDS: FactCheckItem[] = [
  {
    id: 'FC-2026-01',
    caseNumber: 'DGPR-FC-2026-1042',
    category: 'forged_gr',
    categoryMr: 'बनावट शासन निर्णय',
    title: 'Claim of age criteria modification in Majhi Ladki Bahin Yojana',
    titleMr: 'मुख्यमंत्री माझी लाडकी बहीण योजनेच्या वयोमर्यादेत बदल झाल्याचा फिरणारा बनावट शासन निर्णय',
    claim: 'A viral PDF claimed that eligibility age has been restricted from 21-65 years down to 21-45 years, disqualifying senior women beneficiaries.',
    claimMr: 'सोशल मीडियावर फिरणाऱ्या कथित शासन निर्णयात दावा केला आहे की योजनेची वयोमर्यादा २१ ते ४५ वर्षे करण्यात आली असून ज्येष्ठ महिलांना वगळले आहे.',
    fact: 'The document is completely forged and fraudulent. The Women and Child Development Department has not issued any such circular. The eligibility remains 21 to 65 years intact.',
    factMr: 'सदर परिपत्रक १००% बनावट व खोडसाळ आहे. महिला व बालविकास विभागाने असा कोणताही बदल केलेला नाही. योजनेची वयोमर्यादा २१ ते ६५ वर्षे पूर्ववत लागू आहे.',
    verdict: 'FORGED GR',
    verdictMr: 'बनावट शासन निर्णय',
    date: '24 Oct 2026',
    channels: ['WhatsApp Groups', 'Telegram Channels', 'X / Twitter'],
    department: 'Women & Child Development Department',
    departmentMr: 'महिला व बालविकास विभाग',
    actionTaken: 'Cyber Police FIR registered (Crime No. 142/2026). Miscreant WhatsApp admins identified.',
    actionTakenMr: 'सायबर पोलिसांत गुन्हा दाखल (गु.र.क्र. १४२/२०२६). बनावट प्रत पसरवणाऱ्यांवर कायदेशीर कारवाई सुरू.',
    fakeDocPreview: {
      bogusRef: 'GR-2026/WCD/1908/CR-44 (Non-existent)',
      flaws: [
        'Counterfeit State Emblem without standard font proportion',
        'Bogus Reference Number does not exist in mantralaya.maharashtra.gov.in registry',
        'Forged digital signature of Section Officer with incorrect designation',
        'Misaligned header margins not matching standard Government Printing Press standards',
      ],
      flawsMr: [
        'राजमुद्रेचा अनधिकृत व विकृत वापर',
        'मंत्रालयाच्या अधिकृत शासन निर्णय नोंदवहीत सदर जावक क्रमांक अस्तित्वात नाही',
        'कार्यासन अधिकाऱ्यांची बनावट स्वाक्षरी व चुकीचे पदनाम',
        'शासकीय मुद्रणालय नियमावलीनुसार नसलेले फॉन्ट व मांडणी',
      ],
    },
    authenticDoc: {
      officialGrNo: 'शासन निर्णय क्र. मालब-२०२४/प्र.क्र.१३५/का-०२',
      gazetteDate: '२८ जून २०२४ (सुधारीत नियमावली कायम)',
      digitalSignBy: 'अवर सचिव, महिला व बालविकास विभाग, महाराष्ट्र शासन',
    },
  },
  {
    id: 'FC-2026-02',
    caseNumber: 'DGPR-FC-2026-1043',
    category: 'viral_rumor',
    categoryMr: 'व्हायरल अफवा व वृत्त',
    title: 'Claim of 100% Toll Hike on Mumbai-Pune Expressway from Nov 1',
    titleMr: 'मुंबई-पुणे द्रुतगती मार्गावर १ नोव्हेंबरपासून दुप्पट टोलवाढ होणार असल्याचा दावा',
    claim: 'Viral social media posts and YouTube clips claimed toll charges between Kalamboli and Khalapur will surge by 100% starting next month.',
    claimMr: 'व्हॉट्सअॅप व यूट्यूबवर असा दावा करण्यात आला की १ नोव्हेंबरपासून मुंबई-पुणे एक्सप्रेसवेवरील टोल दरात दुप्पट वाढ होणार आहे.',
    fact: 'MSRDC clarified that no toll hike has been approved or notified. Standard toll rates are fixed as per the 2020 gazette schedule with revisions only scheduled in 2026.',
    factMr: 'महाराष्ट्र राज्य रस्ते विकास महामंडळाने (MSRDC) स्पष्ट केले आहे की टोलदरात कोणतीही अतिरिक्त वाढ करण्यात आलेली नाही. २०२० च्या अधिसूचनेनुसारच दर सुरू आहेत.',
    verdict: 'FAKE',
    verdictMr: 'असत्य / खोटे',
    date: '23 Oct 2026',
    channels: ['YouTube Clips', 'Facebook Pages', 'Regional Portals'],
    department: 'Public Works (MSRDC)',
    departmentMr: 'सार्वजनिक बांधकाम (एमएसआरडीसी)',
    actionTaken: 'Official DGPR Clarification Bulletin issued to all accredited regional transport correspondents.',
    actionTakenMr: 'डीजीपीआरतर्फे सर्व अधिकृत वृत्तवाहिन्या व पत्रकारांना तत्काळ वस्तुस्थिती पत्रक जारी.',
  },
  {
    id: 'FC-2026-03',
    caseNumber: 'DGPR-FC-2026-1044',
    category: 'deepfake',
    categoryMr: 'बनावट AI ऑडिओ व व्हिडिओ',
    title: 'AI Cloned Voice Note regarding Farmer Loan Waiver Misinformation',
    titleMr: 'शेतकरी कर्जमाफी संदर्भातील नेत्यांचा कथित वादग्रस्त AI क्लोन केलेला ऑडिओ',
    claim: 'An audio recording of senior Cabinet ministers allegedly arguing against crop loan disbursement was widely shared across agricultural messaging forums.',
    claimMr: 'कथित बैठकीत शेतकरी कर्जमाफी नाकारल्याचे दर्शवणारी मंत्र्यांच्या आवाजातील ऑडिओ क्लिप शेतकरी व्हॉट्सअॅप ग्रुपवर व्हायरल करण्यात आली.',
    fact: 'Forensic Audio Acoustic Analysis by the State Cyber Lab verified that the voice was synthesized using an open-source deepfake text-to-speech clone model.',
    factMr: 'राज्य सायबर प्रयोगशाळेच्या फॉरेन्सिक तपासणीत सिद्ध झाले आहे की ही ऑडिओ क्लिप आधुनिक AI व्हॉईस क्लोनिंग सॉफ्टवेअर वापरून तयार केलेली बनावट फसवणूक आहे.',
    verdict: 'DEEPFAKE',
    verdictMr: 'बनावट AI ऑडिओ',
    date: '22 Oct 2026',
    channels: ['WhatsApp Groups', 'Telegram', 'X Audio Snippet'],
    department: 'Home & Cyber Security Dept',
    departmentMr: 'गृह व सायबर सुरक्षा विभाग',
    actionTaken: 'Originating Telegram channel seized; warning alerts disseminated via Krishi Seva Kendra screens.',
    actionTakenMr: 'संबंधित टेलिग्राम चॅनेलवर गुन्हा नोंदवून कृषी सेवा केंद्रांच्या स्क्रीनवर सत्य माहिती प्रसारित.',
  },
  {
    id: 'FC-2026-04',
    caseNumber: 'DGPR-FC-2026-1045',
    category: 'recruitment_fraud',
    categoryMr: 'बनावट भरती जाहिरात व फसवणूक',
    title: 'Bogus Talathi Recruitment Notice charging ₹500 private fee',
    titleMr: '५,००० तलाठी जागांसाठी खाजगी लिंकवर अर्ज मागवणारी बनावट भरती जाहिरात',
    claim: 'A spurious notification circulating on employment job groups invited applicants for direct Talathi posts via a private third-party payment gateway.',
    claimMr: 'रोजगार मार्गदर्शन ग्रुपवर खाजगी पोर्टल लिंक देऊन महसूल विभागात ५,००० तलाठी पदांसाठी थेट अर्ज मागवणारी पीडीएफ व्हायरल झाली.',
    fact: 'Government recruitments are strictly announced via mahabhumi.gov.in and TCS/IBPS designated portals. The state never collects fees through private UPI links.',
    factMr: 'शासकीय महसूल भरती केवळ mahabhumi.gov.in या अधिकृत संकेतस्थळावरूनच होते. खाजगी लिंक किंवा खाजगी बँक खात्यात फी भरण्याचे आवाहन पूर्णतः सायबर फसवणूक आहे.',
    verdict: 'FORGED GR',
    verdictMr: 'बनावट शासन निर्णय',
    date: '21 Oct 2026',
    channels: ['Telegram Job Portals', 'WhatsApp Job Alerts'],
    department: 'Revenue & Forest Department',
    departmentMr: 'महसूल व वन विभाग',
    actionTaken: 'Phishing domain suspended by CERT-In; legal notice issued to fraudulent recruitment agents.',
    actionTakenMr: 'संबंधित बनावट संकेतस्थळ CERT-In मार्फत ब्लॉक केले असून आरोपींवर फसवणुकीचा गुन्हा दाखल.',
  },
  {
    id: 'FC-2026-05',
    caseNumber: 'DGPR-FC-2026-1046',
    category: 'out_of_context',
    categoryMr: 'दिशाभूल करणारा जुना संदर्भ',
    title: '2019 Flood Inundation Video shared as Current Marathwada Dam Overflow',
    titleMr: 'मराठवाड्यातील धरणातून अचानक विसर्ग केल्याचा २०१९ मधील जुना व्हिडिओ सध्याचा म्हणून व्हायरल',
    claim: 'A dramatic video showing gates of a major dam opening and submerging a village bridge was shared claiming it was recorded yesterday in Jayakwadi.',
    claimMr: 'जायकवाडी धरणाचे दरवाजे उघडून अचानक विसर्ग केल्याने पूल पाण्याखाली गेल्याचा व्हिडिओ कालचा म्हणून सोशल मीडियावर व्हायरल झाला.',
    fact: 'The video is from August 2019 during heavy floods in Western Maharashtra. Current Jayakwadi dam water level is 86.4% and discharges are strictly regulated with zero danger.',
    factMr: 'सदर व्हिडिओ ऑगस्ट २०१९ मधील पश्चिम महाराष्ट्रातील पुराचा आहे. सद्यस्थितीत जायकवाडी धरण ८६.४% भरले असून विसर्ग अत्यंत नियंत्रित पद्धतीने सुरू आहे.',
    verdict: 'MISLEADING',
    verdictMr: 'दिशाभूल करणारे',
    date: '20 Oct 2026',
    channels: ['Instagram Reels', 'Facebook Watch', 'WhatsApp Status'],
    department: 'Water Resources Department',
    departmentMr: 'जलसंपदा विभाग',
    actionTaken: 'Disaster Management Authority geo-verified live water gauge levels broadcast on local cable networks.',
    actionTakenMr: 'जिल्हा आपत्ती व्यवस्थापन प्राधिकरणातर्फे धरणाच्या पाण्याच्या पातळीचा थेट व्हिडिओ प्रसारित.',
  },
  {
    id: 'FC-2026-06',
    caseNumber: 'DGPR-FC-2026-1047',
    category: 'verified_true',
    categoryMr: 'प्रमाणित अधिकृत सत्य',
    title: 'GR approving 25% Advance Crop Damage Compensation to Kharif Farmers',
    titleMr: 'अतिवृष्टीग्रस्त खरीप शेतकऱ्यांना २५% अग्रिम पीक भरपाई देण्याचा शासन निर्णय',
    claim: 'Social media query asking whether the government resolution approving 25% advance compensation to flood-affected farmers is authentic.',
    claimMr: 'अतिवृष्टीग्रस्त शेतकऱ्यांना २५% अग्रिम भरपाई देण्याचा निर्णय खरोखरच शासनाने घेतला आहे का, अशी शंका सोशल मीडियावर विचारण्यात आली.',
    fact: 'The news and circular are 100% genuine and verified. Agriculture Department GR No. 2026/AGRI-841 has sanctioned the immediate direct benefit transfer.',
    factMr: 'हा शासन निर्णय १००% खरा व अधिकृत आहे. कृषी विभागाच्या शासन निर्णय क्र. २०२६/कृषी-८४१ अन्वये निधी मंजूर झाला असून थेट बँक खात्यात वर्ग होत आहे.',
    verdict: 'VERIFIED TRUE',
    verdictMr: 'प्रमाणित सत्य',
    date: '19 Oct 2026',
    channels: ['Print News', 'Official Web Portal', 'Agrarian Portals'],
    department: 'Agriculture Department',
    departmentMr: 'कृषी विभाग',
    actionTaken: 'Officially published on maharashtra.gov.in; District Collectors instructed for prompt DBT payout.',
    actionTakenMr: 'अधिकृत संकेतस्थळावर प्रकाशित; जिल्हाधिकाऱ्यांना लाभार्थ्यांच्या खात्यावर रक्कम तात्काळ जमा करण्याचे निर्देश.',
    authenticDoc: {
      officialGrNo: 'शासन निर्णय क्र. कृषी-२०२६/प्र.क्र.८४१/१०-अ',
      gazetteDate: '१९ ऑक्टोबर २०२६',
      digitalSignBy: 'अपर मुख्य सचिव (कृषी), महाराष्ट्र शासन',
    },
  },
];

export const FactCheckScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingItem, setInspectingItem] = useState<FactCheckItem | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [userClaimInput, setUserClaimInput] = useState<string>('');
  const [userUrlInput, setUserUrlInput] = useState<string>('');
  const [userContact, setUserContact] = useState<string>('');

  const filteredItems = useMemo(() => {
    return FACT_CHECK_RECORDS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(q) ||
        item.titleMr.toLowerCase().includes(q) ||
        item.claim.toLowerCase().includes(q) ||
        item.claimMr.toLowerCase().includes(q) ||
        item.caseNumber.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.departmentMr.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShareOnWhatsApp = (item: FactCheckItem) => {
    const text =
      language === 'mr'
        ? `*डीजीपीआर तथ्य तपासणी (DGPR Fact Check)*\n\n📌 *दावा:* ${item.titleMr}\n❌ *सत्य:* ${item.factMr}\n\n🔍 *अधिकृत निकाल:* ${item.verdictMr} (${item.caseNumber})\n\nमहाराष्ट्र शासन माहिती व जनसंपर्क महासंचालनालय (DGPR) द्वारे प्रमाणित.`
        : `*DGPR Fact-Check Alert (Govt of Maharashtra)*\n\n📌 *Claim:* ${item.title}\n✅ *Fact:* ${item.fact}\n\n🔍 *Official Verdict:* ${item.verdict} (${item.caseNumber})\n\nVerified by Directorate General of Public Relations (DGPR).`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToast({
        message:
          language === 'mr'
            ? 'तथ्य तपासणी संदेश कॉपी झाला! आपण व्हॉट्सअॅप ग्रुपमध्ये थेट शेअर करू शकता.'
            : 'Fact-Check debunk text copied! You can paste and share directly on WhatsApp.',
        type: 'success',
      });
    }
  };

  const handleDownloadClarification = (item: FactCheckItem) => {
    setToast({
      message:
        language === 'mr'
          ? `डीजीपीआर अधिकृत खुलासा पत्रक (${item.caseNumber}.pdf) डाउनलोड झाले.`
          : `Official DGPR Clarification Bulletin (${item.caseNumber}.pdf) downloaded.`,
      type: 'info',
    });
  };

  const handleSubmitUserClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userClaimInput.trim()) {
      setToast({
        message:
          language === 'mr'
            ? 'कृपया दाव्याचा मजकूर किंवा बातमी लिहा.'
            : 'Please enter the viral claim or headline text.',
        type: 'error',
      });
      return;
    }
    const trackingNo = `DGPR-FC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setShowSubmitModal(false);
    setUserClaimInput('');
    setUserUrlInput('');
    setUserContact('');
    setToast({
      message:
        language === 'mr'
          ? `आपला दावा यशस्वीरित्या नोंदवला गेला आहे! ट्रॅकिंग क्र: ${trackingNo}. डीजीपीआर सायबर कक्ष २४ तासांत पडताळणी करेल.`
          : `Claim registered successfully! Case Reference: ${trackingNo}. DGPR Cyber Desk will verify within 24 hours.`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1740px] w-full mx-auto space-y-6">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>
              {language === 'mr'
                ? 'माहिती व जनसंपर्क महासंचालनालय (DGPR) • २४x७ तथ्य पडताळणी व सायबर खंडन कक्ष'
                : 'DGPR 24x7 Fact-Check & Misinformation Debunking Unit'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <MaterialIcon name="verified" size="md" className="text-rose-600" />
            <span>
              {language === 'mr'
                ? 'तथ्य पडताळणी, बनावट शासन निर्णय (GR) व अफवा खंडन दालन'
                : 'DGPR Fact-Check, Forged GR & Misinformation Radar'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'सोशल मीडियावरील दिशाभूल करणारे दावे, बनावट शासन निर्णय (Fake GRs) व कृत्रिम बुद्धिमत्ता (AI) डीपफेक ऑडिओ-व्हिडिओची वैज्ञानिक फॉरेन्सिक पडताळणी.'
              : 'Forensic verification of viral claims, forged circulars (GRs), fabricated recruitment notices, and generative AI deepfakes across Maharashtra.'}
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              setToast({
                message:
                  language === 'mr'
                    ? 'दैनिक तथ्य पडताळणी बुलेटिन (२४ ऑक्टोबर २०२६) डाऊनलोड झाले.'
                    : 'Daily Fact-Check Compendium (24 Oct 2026) downloaded.',
                type: 'info',
              })
            }
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MaterialIcon name="download" size="xs" />
            <span>{language === 'mr' ? 'दैनिक खंडन बुलेटिन' : 'Daily Compendium'}</span>
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <MaterialIcon name="add" size="xs" />
            <span>{language === 'mr' ? 'नागरिक पडताळणी अर्ज' : 'Submit Claim for Check'}</span>
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME MISINFORMATION SCROLLING TICKER */}
      <div className="bg-rose-50 border-l-4 border-rose-600 rounded-xl p-3 flex items-center gap-3 text-xs text-rose-950 shadow-2xs">
        <span className="font-bold uppercase tracking-wider text-rose-700 shrink-0 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          {language === 'mr' ? 'तातडीचा इशारा:' : 'Live Debunk Alert:'}
        </span>
        <div className="truncate font-medium">
          {language === 'mr'
            ? '⚠️ बनावट शासन निर्णय सावधान: ‘लाडकी बहीण योजनेची वयोमर्यादा बदलल्याचा’ सोशल मीडियावर फिरणारा GR-2026/WCD पूर्णतः बनावट आहे. सायबर पोलिसांत गुन्हा दाखल.'
            : '⚠️ Forged GR Alert: Viral circular claiming age eligibility change in Ladki Bahin Scheme is completely fake. Criminal FIR lodged with Cyber Police.'}
        </div>
      </div>

      {/* 3. FORENSIC METRICS RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'एकूण तपासलेले दावे' : 'Monitored Claims'}
          </span>
          <div className="text-2xl font-black text-slate-900 my-1">2,840</div>
          <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
            <span>24x7 Multi-Channel Crawler</span>
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'उघडकीस आणलेल्या खोट्या अफवा' : 'Debunked Fake Claims'}
          </span>
          <div className="text-2xl font-black text-rose-600 my-1">384 Claims</div>
          <span className="text-[11px] text-rose-700 font-semibold">100% Clarifications Issued</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'बनावट शासन निर्णय (GRs) निष्प्रभ' : 'Forged GRs Neutralized'}
          </span>
          <div className="text-2xl font-black text-amber-700 my-1">32 Forged GRs</div>
          <span className="text-[11px] text-amber-700 font-semibold">FIRs Filed in Cyber Cell</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'सत्य पोहोच (नागरिक जागृती)' : 'Verified Citizen Reach'}
          </span>
          <div className="text-2xl font-black text-emerald-700 my-1">1.84 Crore</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Social & Print Fanout</span>
        </div>
      </div>

      {/* 4. CATEGORY FILTER TABS & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'all', label: language === 'mr' ? 'सर्व तपासण्या' : 'All Fact-Checks', count: '6' },
            { id: 'forged_gr', label: language === 'mr' ? 'बनावट शासन निर्णय' : 'Forged Circulars (GRs)', count: '2' },
            { id: 'viral_rumor', label: language === 'mr' ? 'व्हायरल अफवा' : 'Viral Rumors', count: '1' },
            { id: 'deepfake', label: language === 'mr' ? 'AI डीपफेक ऑडिओ' : 'AI Deepfakes', count: '1' },
            { id: 'recruitment_fraud', label: language === 'mr' ? 'भरती फसवणूक' : 'Recruitment Fraud', count: '1' },
            { id: 'verified_true', label: language === 'mr' ? 'प्रमाणित सत्य' : 'Verified True', count: '1' },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px] max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'दावा, बातमी किंवा विभाग शोधा...'
                : 'Search claim, headline, department...'
            }
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          <MaterialIcon
            name="search"
            size="xs"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* 5. FACT-CHECK DOSSIERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isForged = item.verdict === 'FORGED GR';
          const isFake = item.verdict === 'FAKE';
          const isDeepfake = item.verdict === 'DEEPFAKE';
          const isVerified = item.verdict === 'VERIFIED TRUE';

          const badgeBg = isForged
            ? 'bg-red-100 text-red-900 border-red-300'
            : isFake
            ? 'bg-rose-100 text-rose-900 border-rose-300'
            : isDeepfake
            ? 'bg-purple-100 text-purple-900 border-purple-300'
            : isVerified
            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : 'bg-amber-100 text-amber-900 border-amber-300';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                {/* Header Metadata */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.caseNumber}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}>
                    {language === 'mr' ? item.verdictMr : item.verdict}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {language === 'mr' ? item.titleMr : item.title}
                </h3>

                {/* Claim Box */}
                <div className="bg-red-50/70 border-l-3 border-red-500 rounded-r-lg p-2.5 text-xs text-red-950 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-800 flex items-center gap-1">
                    <MaterialIcon name="warning" size="xs" />
                    <span>{language === 'mr' ? 'व्हायरल खोटा दावा:' : 'Viral False Claim:'}</span>
                  </div>
                  <p className="line-clamp-2">{language === 'mr' ? item.claimMr : item.claim}</p>
                </div>

                {/* Fact Box */}
                <div className="bg-emerald-50/80 border-l-3 border-emerald-600 rounded-r-lg p-2.5 text-xs text-emerald-950 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <MaterialIcon name="verified" size="xs" />
                    <span>{language === 'mr' ? 'डीजीपीआर पडताळणी व वस्तुस्थिती:' : 'Official Fact:'}</span>
                  </div>
                  <p className="line-clamp-3">{language === 'mr' ? item.factMr : item.fact}</p>
                </div>

                {/* Department and Channels */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate font-medium">{language === 'mr' ? item.departmentMr : item.department}</span>
                  <span className="shrink-0">{item.date}</span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectingItem(item)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MaterialIcon name="description" size="xs" />
                  <span>{language === 'mr' ? 'पुरावा पहा' : 'Forensic Proof'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownloadClarification(item)}
                    title={language === 'mr' ? 'अधिकृत पत्रक डाउनलोड' : 'Download Official Bulletin'}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <MaterialIcon name="download" size="xs" />
                  </button>

                  <button
                    onClick={() => handleShareOnWhatsApp(item)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <MaterialIcon name="share" size="xs" />
                    <span>{language === 'mr' ? 'WhatsApp' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. SIDE-BY-SIDE FORENSIC INSPECTION MODAL */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
                  <MaterialIcon name="verified" size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {inspectingItem.caseNumber}
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.2 rounded-full font-bold">
                      {language === 'mr' ? inspectingItem.verdictMr : inspectingItem.verdict}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white mt-0.5 line-clamp-1">
                    {language === 'mr' ? inspectingItem.titleMr : inspectingItem.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Claim vs Fact Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: False Document Analysis */}
                <div className="border border-red-200 bg-red-50/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-red-200 pb-2">
                    <span className="text-xs font-bold text-red-900 uppercase flex items-center gap-1.5">
                      <MaterialIcon name="close" size="xs" className="text-red-600" />
                      <span>{language === 'mr' ? 'व्हायरल बनावट प्रत (खोट्या त्रुटी)' : 'Viral Forged Document'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      बनावट / FRAUD
                    </span>
                  </div>

                  <p className="text-xs text-red-950 font-medium">
                    {language === 'mr' ? inspectingItem.claimMr : inspectingItem.claim}
                  </p>

                  {inspectingItem.fakeDocPreview && (
                    <div className="space-y-2 pt-2 border-t border-red-200/80">
                      <span className="text-[10px] font-bold uppercase text-red-800">
                        {language === 'mr' ? 'फॉरेन्सिक तपासणीतील बनावट खुणा:' : 'Forensic Flaws Detected:'}
                      </span>
                      <ul className="space-y-1.5 text-xs text-red-900 list-disc list-inside">
                        {(language === 'mr'
                          ? inspectingItem.fakeDocPreview.flawsMr
                          : inspectingItem.fakeDocPreview.flaws
                        ).map((flaw, idx) => (
                          <li key={idx} className="leading-snug">{flaw}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: Authentic Verification */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                      <MaterialIcon name="verified" size="xs" className="text-emerald-600" />
                      <span>{language === 'mr' ? 'अधिकृत शासकीय सत्य (DGPR)' : 'Official DGPR Verification'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      प्रमाणित / VERIFIED
                    </span>
                  </div>

                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {language === 'mr' ? inspectingItem.factMr : inspectingItem.fact}
                  </p>

                  <div className="space-y-1 text-xs text-emerald-900 pt-2 border-t border-emerald-200/80">
                    <div>
                      <span className="font-bold">{language === 'mr' ? 'संबंधित विभाग: ' : 'Department: '}</span>
                      <span>{language === 'mr' ? inspectingItem.departmentMr : inspectingItem.department}</span>
                    </div>
                    <div>
                      <span className="font-bold">{language === 'mr' ? 'कारवाई: ' : 'Action Taken: '}</span>
                      <span>{language === 'mr' ? inspectingItem.actionTakenMr : inspectingItem.actionTaken}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Seal and Clarification Dispatch */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src="/MAHAGOV_ICON.svg" alt="Gov of Maharashtra" className="w-10 h-10 object-contain" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {language === 'mr'
                        ? 'माहिती व जनसंपर्क महासंचालनालय, मंत्रालय, मुंबई - ४०००३२'
                        : 'Directorate General of Public Relations (DGPR), Mantralaya, Mumbai'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {language === 'mr'
                        ? 'डिजिटल स्वाक्षरीने प्रमाणित सत्य पडताळणी अहवाल'
                        : 'Cryptographically Verified Official Truth Clarification Record'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareOnWhatsApp(inspectingItem)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MaterialIcon name="share" size="xs" />
                    <span>{language === 'mr' ? 'WhatsApp वर शेअर करा' : 'Share on WhatsApp'}</span>
                  </button>
                  <button
                    onClick={() => handleDownloadClarification(inspectingItem)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MaterialIcon name="download" size="xs" />
                    <span>{language === 'mr' ? 'प्रत डाउनलोड' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. CITIZEN TIP-LINE SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden my-8">
            <div className="bg-gov-primary text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MaterialIcon name="speaker_notes" size="sm" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'mr' ? 'नागरिक व माध्यम तथ्य पडताळणी नोंदणी कक्ष' : 'Submit Claim for DGPR Fact-Check'}
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <form onSubmit={handleSubmitUserClaim} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'व्हायरल दावा किंवा बातमीचा मजकूर *' : 'Viral Claim or Headline Text *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={userClaimInput}
                  onChange={(e) => setUserClaimInput(e.target.value)}
                  placeholder={
                    language === 'mr'
                      ? 'व्हॉट्सअॅपवर फिरणारा दावा, परिपत्रक किंवा बातमी येथे लिहा...'
                      : 'Paste the viral claim, forwarded text or circular details...'
                  }
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'सोशल मीडिया लिंक (पर्यायी)' : 'Social Media Link (Optional)'}
                </label>
                <input
                  type="text"
                  value={userUrlInput}
                  onChange={(e) => setUserUrlInput(e.target.value)}
                  placeholder="https://x.com/... किंवा YouTube लिंक"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'mr' ? 'आपला मोबाईल / ईमेल (अपडेट्ससाठी)' : 'Mobile or Email for Updates'}
                </label>
                <input
                  type="text"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="उदा. 98200XXXXX किंवा email@domain.com"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {language === 'mr' ? 'पडताळणीसाठी पाठवा' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactCheckScreen;
