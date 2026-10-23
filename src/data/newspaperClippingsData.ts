export interface NewspaperClipping {
  id: string;
  clippingNumber: number; // 1 to 516
  publication: string;
  publicationMr: string;
  edition: string;
  editionMr: string;
  district: string;
  districtMr: string;
  date: string;
  pageNumber: number;
  category: 'Welfare Schemes' | 'Infrastructure' | 'Agriculture' | 'Public Health' | 'Education' | 'Industry & Jobs' | 'Law & Governance';
  categoryMr: string;
  headline: string;
  headlineMr: string;
  summary: string;
  summaryMr: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number; // 0-100
  reach: string;
  verifiedByDio: boolean;
  clippingColor: string; // for realistic clipping card styling
}

const PUBLICATIONS = [
  { name: 'Lokmat', nameMr: 'लोकमत' },
  { name: 'Sakal', nameMr: 'सकाळ' },
  { name: 'Maharashtra Times', nameMr: 'महाराष्ट्र टाइम्स' },
  { name: 'Pudhari', nameMr: 'पुढारी' },
  { name: 'Loksatta', nameMr: 'लोकसत्ता' },
  { name: 'Saamana', nameMr: 'सामना' },
  { name: 'Tarun Bharat', nameMr: 'तरुण भारत' },
  { name: 'Deshonnati', nameMr: 'देशोन्नती' },
  { name: 'Punyanagari', nameMr: 'पुण्यनगरी' },
  { name: 'Navakal', nameMr: 'नवाकाळ' },
  { name: 'Divya Marathi', nameMr: 'दिव्य मराठी' },
  { name: 'Navbharat', nameMr: 'नवभारत' },
];

const DISTRICT_NAMES = [
  { en: 'Thane', mr: 'ठाणे' },
  { en: 'Raigad', mr: 'रायगड' },
  { en: 'Palghar', mr: 'पालघर' },
  { en: 'Ratnagiri', mr: 'रत्नागिरी' },
  { en: 'Sindhudurg', mr: 'सिंधुदुर्ग' },
  { en: 'Mumbai City', mr: 'मुंबई शहर' },
  { en: 'Mumbai Suburban', mr: 'मुंबई उपनगर' },
  { en: 'Pune', mr: 'पुणे' },
  { en: 'Satara', mr: 'सातारा' },
  { en: 'Sangli', mr: 'सांगली' },
  { en: 'Kolhapur', mr: 'कोल्हापूर' },
  { en: 'Solapur', mr: 'सोलापूर' },
  { en: 'Nashik', mr: 'नाशिक' },
  { en: 'Ahilyanagar', mr: 'अहिल्यानगर' },
  { en: 'Dhule', mr: 'धुळे' },
  { en: 'Jalgaon', mr: 'जळगाव' },
  { en: 'Nandurbar', mr: 'नंदुरबार' },
  { en: 'Chhatrapati Sambhajinagar', mr: 'छत्रपती संभाजीनगर' },
  { en: 'Jalna', mr: 'जालना' },
  { en: 'Beed', mr: 'बीड' },
  { en: 'Latur', mr: 'लातूर' },
  { en: 'Dharashiv', mr: 'धाराशिव' },
  { en: 'Nanded', mr: 'नांदेड' },
  { en: 'Parbhani', mr: 'परभणी' },
  { en: 'Hingoli', mr: 'हिंगोली' },
  { en: 'Amravati', mr: 'अमरावती' },
  { en: 'Akola', mr: 'अकोला' },
  { en: 'Buldhana', mr: 'बुलढाणा' },
  { en: 'Yavatmal', mr: 'यवतमाळ' },
  { en: 'Washim', mr: 'वाशिम' },
  { en: 'Nagpur', mr: 'नागपूर' },
  { en: 'Wardha', mr: 'वर्धा' },
  { en: 'Bhandara', mr: 'भंडारा' },
  { en: 'Gondia', mr: 'गोंदिया' },
  { en: 'Chandrapur', mr: 'चंद्रपूर' },
  { en: 'Gadchiroli', mr: 'गडचिरोली' },
];

const THEMES = [
  {
    cat: 'Welfare Schemes' as const,
    catMr: 'कल्याणकारी योजना',
    headEn: 'Mukhyamantri Majhi Ladki Bahin Yojana reaches landmark milestone with rapid DBT cash disbursement',
    headMr: 'मुख्यमंत्री माझी लाडकी बहीण योजनेचा ऐतिहासिक टप्पा; थेट खात्यात सन्मान निधी जमा',
    sumEn: 'Over 1.5 crore eligible women across the state receive timely DBT installment with streamlined biometric verification at taluka centres.',
    sumMr: 'राज्यातील दीड कोटींहून अधिक पात्र महिलांच्या खात्यात सन्मान निधी थेट जमा; तालुकास्तरावर विशेष सुविधा कक्ष.',
    sentiment: 'Positive' as const,
    score: 92,
  },
  {
    cat: 'Agriculture' as const,
    catMr: 'कृषी व शेतकरी विकास',
    headEn: 'Namo Shetkari Mahasanman Nidhi direct subsidy disbursed to 90 lakh farmers ahead of harvest',
    headMr: 'नमो शेतकरी महासन्मान निधी: खरीप हंगामाच्या पार्श्वभूमीवर ९० लाख शेतकऱ्यांच्या खात्यात अनुदान',
    sumEn: 'State government credits annual agricultural relief installment, boosting farm liquidity and soil input procurement.',
    sumMr: 'राज्य शासनाकडून थेट बँक खात्यात आर्थिक सहाय्य वितरित; खते व बियाणे खरेदीसाठी बळीराजाला मोठा दिलासा.',
    sentiment: 'Positive' as const,
    score: 88,
  },
  {
    cat: 'Infrastructure' as const,
    catMr: 'पायाभूत सुविधा',
    headEn: 'Ring Road and Metro expansion corridor civil works enter final phase of quality inspection',
    headMr: 'रिंग रोड व मेट्रो विस्तार प्रकल्पाच्या कामाची गुणवत्ता तपासणी अंतिम टप्प्यात',
    sumEn: 'Public Works Department conducts comprehensive structural tests on elevated bridges and viaducts.',
    sumMr: 'सार्वजनिक बांधकाम विभागाकडून उन्नत मार्ग व उड्डाणपुलांची भारक्षमता चाचणी यशस्वीरित्या पूर्ण.',
    sentiment: 'Positive' as const,
    score: 85,
  },
  {
    cat: 'Public Health' as const,
    catMr: 'सार्वजनिक आरोग्य',
    headEn: 'Mahatma Jyotirao Phule Jan Arogya Yojana covers 100% treatment expenses for critical care',
    headMr: 'महात्मा ज्योतिराव फुले जन आरोग्य योजनेतून गंभीर आजारांवर मोफत उपचार सुविधा',
    sumEn: 'Empanelled hospitals across rural tehsils report record patient admissions without out-of-pocket costs.',
    sumMr: 'जिल्हा व ग्रामीण रुग्णालयांमध्ये कॅशलेस उपचारांची प्रभावी अंमलबजावणी; गरजू रुग्णांना मोठा आधार.',
    sentiment: 'Positive' as const,
    score: 90,
  },
  {
    cat: 'Education' as const,
    catMr: 'शिक्षण व कौशल्य विकास',
    headEn: 'Chief Minister Skill Development Fellowship launched for rural polytechnic graduates',
    headMr: 'ग्रामीण भागातील पदविकाधारक तरुणांसाठी मुख्यमंत्री कौशल्य विकास फेलोशिप सुरू',
    sumEn: 'Monthly stipend and guaranteed corporate internship provided to empower localized industry readiness.',
    sumMr: 'स्थानिक उद्योगांच्या गरजेनुसार थेट ऑन-जॉब प्रशिक्षण व मासिक विद्यावेतन देण्याचा निर्णय.',
    sentiment: 'Positive' as const,
    score: 86,
  },
  {
    cat: 'Agriculture' as const,
    catMr: 'कृषी व सिंचन',
    headEn: 'Farmers urge swift deployment of solar water pumps under Mukhyamantri Saur Krushi Vahini',
    headMr: 'मुख्यमंत्री सौर कृषी वाहिनी अंतर्गत सौर कृषी पंपांचा वेग वाढवण्याची शेतकरी संघटनांची मागणी',
    sumEn: 'District coordination committee resolves minor supply bottlenecks and assures delivery within 14 days.',
    sumMr: 'जिल्हास्तरीय आढावा बैठकीत तांत्रिक अडचणींचे निवारण; पुढील १४ दिवसांत सर्व प्रलंबित पंपांचे वितरण करण्याचे निर्देश.',
    sentiment: 'Neutral' as const,
    score: 64,
  },
  {
    cat: 'Infrastructure' as const,
    catMr: 'पायाभूत सुविधा',
    headEn: 'Heavy monsoon runoff causes localized pothole complaints; municipal corporations deploy cold-mix patches',
    headMr: 'अतिवृष्टीमुळे रस्त्यांवर खड्डे; महापालिका व सार्वजनिक बांधकाम विभागातर्फे जलद डागडुजी मोहीम',
    sumEn: 'Citizens call for long-term mastic asphalt surfacing as maintenance squads initiate 24x7 emergency repairs.',
    sumMr: '२४ तास कार्यरत पथकांद्वारे तातडीने खड्डे बुजविण्याचे काम सुरू; दर्जेदार डांबरीकरणाचे प्रशासनाचे आश्वासन.',
    sentiment: 'Neutral' as const,
    score: 55,
  },
  {
    cat: 'Industry & Jobs' as const,
    catMr: 'उद्योग व रोजगार',
    headEn: 'Global manufacturing consortium signs green energy MoU worth ₹12,000 Crore in MIDC industrial belt',
    headMr: 'एमआयडीसी परिसरात १२ हजार कोटींच्या हरित ऊर्जा प्रकल्पासाठी सामंजस्य करार संपन्न',
    sumEn: 'State Industries Ministry guarantees single-window regulatory clearance to create over 8,500 engineering jobs.',
    sumMr: 'उद्योग विभागाच्या मैत्री कक्षाद्वारे जलद परवानग्या; स्थानिक कुशल तरुणांना रोजगाराची सुवर्णसंधी.',
    sentiment: 'Positive' as const,
    score: 94,
  },
  {
    cat: 'Law & Governance' as const,
    catMr: 'प्रशासन व नागरिकी सेवा',
    headEn: 'Shasan Aplya Dari door-to-door public grievance camps resolve 98% pending citizen service certificates',
    headMr: 'शासन आपल्या दारी मोहिमेत ९८% दाखले व नागरिकी सेवा जागेवरच वितरित',
    sumEn: 'Revenue and district administration complete one-day camps across remote talukas, delivering caste, income, and land title deeds.',
    sumMr: 'उत्पन्न, जात व सातबारा दाखले एकाच छताखाली वितरित; मध्यस्थांची गरज संपुष्टात आणल्याने नागरिकांचा समाधान व्यक्त.',
    sentiment: 'Positive' as const,
    score: 91,
  },
  {
    cat: 'Public Health' as const,
    catMr: 'आरोग्य सुविधा',
    headEn: 'Opposition demands expedited appointment of specialist doctors at rural sub-district hospitals',
    headMr: 'ग्रामीण उपजिल्हा रुग्णालयांमध्ये तज्ज्ञ डॉक्टरांची पदे तातडीने भरण्याची लोकप्रतिनिधींची मागणी',
    sumEn: 'Health commissioner announces special walk-in recruitment drive with remote hardship allowances.',
    sumMr: 'आरोग्य विभागाकडून थेट मुलाखतींद्वारे विशेषज्ञ वैद्यकीय अधिकाऱ्यांची तातडीने पदभरती प्रक्रिया सुरू.',
    sentiment: 'Negative' as const,
    score: 42,
  },
];

// Generate exactly 516 newspaper clippings deterministically
export const NEWSPAPER_CLIPPINGS: NewspaperClipping[] = Array.from({ length: 516 }, (_, idx) => {
  const num = idx + 1;
  const pub = PUBLICATIONS[idx % PUBLICATIONS.length];
  const dist = DISTRICT_NAMES[idx % DISTRICT_NAMES.length];
  const theme = THEMES[idx % THEMES.length];
  const day = 10 + (idx % 14); // Dates between Oct 10 and Oct 23, 2026
  const page = (idx % 12) + 1;
  const reachVal = (45 + ((idx * 7) % 180)).toFixed(0);

  // Slight variance in colors for realism
  const colors = ['#FFFDF9', '#FAF7EE', '#F8F9FA', '#FFFBF0'];
  const clippingColor = colors[idx % colors.length];

  return {
    id: `CLP-2026-${String(num).padStart(4, '0')}`,
    clippingNumber: num,
    publication: pub.name,
    publicationMr: pub.nameMr,
    edition: `${dist.en} City & Rural`,
    editionMr: `${dist.mr} शहर व ग्रामीण आवृत्ती`,
    district: dist.en,
    districtMr: dist.mr,
    date: `${day} Oct 2026`,
    pageNumber: page,
    category: theme.cat,
    categoryMr: theme.catMr,
    headline: `[${dist.en}] ${theme.headEn}`,
    headlineMr: `[${dist.mr}] ${theme.headMr}`,
    summary: theme.sumEn,
    summaryMr: theme.sumMr,
    sentiment: theme.sentiment,
    sentimentScore: Math.min(100, Math.max(30, theme.score + ((idx % 7) - 3))),
    reach: `${reachVal},000 Readers`,
    verifiedByDio: idx % 6 !== 0,
    clippingColor,
  };
});

// TV Channels monitoring data
export interface TVChannelLiveStatus {
  id: string;
  name: string;
  nameMr: string;
  logo: string;
  liveStatus: 'Broadcasting Live' | 'Studio Bulletin' | 'Prime Debate';
  currentShow: string;
  currentShowMr: string;
  govtCoverageShare: string; // e.g. 38%
  sentiment: 'Positive' | 'Neutral' | 'Critical';
  headlineTicker: string;
  headlineTickerMr: string;
  viewerRating: string;
}

export const TV_CHANNELS_DATA: TVChannelLiveStatus[] = [
  {
    id: 'TV-ABP',
    name: 'ABP Majha',
    nameMr: 'एबीपी माझा',
    logo: 'ABP Majha',
    liveStatus: 'Broadcasting Live',
    currentShow: 'Maha Fast 50 Headline Express',
    currentShowMr: 'महा फास्ट ५० सुपरफास्ट बुलेटिन',
    govtCoverageShare: '42%',
    sentiment: 'Positive',
    headlineTicker: 'Cabinet approves ₹1,400 Cr drought resilience package for Marathwada and Vidarbha farmers.',
    headlineTickerMr: 'मराठवाडा व विदर्भातील शेतकऱ्यांसाठी १४०० कोटी रुपयांच्या दुष्काळ निवारण निधीला मंत्रिमंडळाची मंजुरी.',
    viewerRating: '4.8 Tier-1',
  },
  {
    id: 'TV-TV9',
    name: 'TV9 Marathi',
    nameMr: 'टीव्ही९ मराठी',
    logo: 'TV9',
    liveStatus: 'Studio Bulletin',
    currentShow: 'Aapli Mumbai, Aapla Maharashtra',
    currentShowMr: 'आपली मुंबई, आपला महाराष्ट्र',
    govtCoverageShare: '39%',
    sentiment: 'Positive',
    headlineTicker: 'Mumbai Coastal Road Phase 2 traffic flow smooth; over 65,000 vehicles cross today without congestion.',
    headlineTickerMr: 'मुंबई कोस्टल रोड दुसऱ्या टप्प्यात वाहतूक सुरळीत; ६५ हजार वाहनांची सुसाट ये-जा.',
    viewerRating: '4.7 Tier-1',
  },
  {
    id: 'TV-ZEE',
    name: 'Zee 24 Taas',
    nameMr: 'झी २४ तास',
    logo: 'ZEE 24 Taas',
    liveStatus: 'Broadcasting Live',
    currentShow: 'Vishesh Report: Kalyan-Dombivli Infra',
    currentShowMr: 'विशेष रिपोर्ट: कल्याण-डोंबिवली विकास कामे',
    govtCoverageShare: '35%',
    sentiment: 'Neutral',
    headlineTicker: 'Chief Minister reviews smart public grievance disposal; instructions given to clear all pending files in 7 days.',
    headlineTickerMr: 'मुख्यमंत्र्यांनी घेतला प्रलंबित फायलींचा आढावा; ७ दिवसांत सर्व लोकतक्रारी निकाली काढण्याचे कडक आदेश.',
    viewerRating: '4.6 Tier-1',
  },
  {
    id: 'TV-SAAM',
    name: 'Saam TV',
    nameMr: 'साम टीव्ही',
    logo: 'SAAM TV',
    liveStatus: 'Prime Debate',
    currentShow: 'Loksabha to Grampanchayat Charcha',
    currentShowMr: 'ग्रामपंचायत ते मंत्रालय महाचर्चा',
    govtCoverageShare: '31%',
    sentiment: 'Neutral',
    headlineTicker: 'Debate on Ladki Bahin Yojana budget allocation and long-term women financial empowerment impact.',
    headlineTickerMr: 'लाडकी बहीण योजनेचा महिलांच्या आर्थिक स्वावलंबनावरील दूरगामी परिणाम; तज्ज्ञांचे विश्लेषण.',
    viewerRating: '4.5 Regional',
  },
  {
    id: 'TV-N18',
    name: 'News18 Lokmat',
    nameMr: 'न्यूज१८ लोकमत',
    logo: 'NEWS 18',
    liveStatus: 'Studio Bulletin',
    currentShow: 'Headline Mahayuddha Prime Time',
    currentShowMr: 'प्राइम टाइम महायुद्ध बुलेटिन',
    govtCoverageShare: '37%',
    sentiment: 'Positive',
    headlineTicker: 'Maharashtra achieves top rank nationally in Direct Benefit Transfer (DBT) citizen satisfaction index.',
    headlineTickerMr: 'थेट लाभ हस्तांतरण (DBT) नागरिक समाधान निर्देशांकात महाराष्ट्र देशात अव्वल स्थानी.',
    viewerRating: '4.7 Tier-1',
  },
  {
    id: 'TV-DD',
    name: 'DD Sahyadri',
    nameMr: 'दूरदर्शन सह्याद्री',
    logo: 'DD Sahyadri',
    liveStatus: 'Broadcasting Live',
    currentShow: 'Aamchi Mati Aamchi Manasa (Agri Special)',
    currentShowMr: 'आमची माती आमची माणसं (कृषी विशेष)',
    govtCoverageShare: '58%',
    sentiment: 'Positive',
    headlineTicker: 'Agricultural university experts provide organic fertilizer guidance live to state farmers.',
    headlineTickerMr: 'कृषी शास्त्रज्ञांकडून सेंद्रिय खत निर्मिती व पीक संरक्षण यावर शेतकऱ्यांना थेट मार्गदर्शन.',
    viewerRating: '4.9 Official',
  },
];

// Social Media Analysis data
export interface SocialPlatformStats {
  platform: 'X (Twitter)' | 'Facebook' | 'Instagram' | 'YouTube';
  handle: string;
  totalFollowers: string;
  monthlyReach: string;
  positiveSentimentPercent: number;
  neutralSentimentPercent: number;
  negativeSentimentPercent: number;
  trendingTopics: { tag: string; mentions: string }[];
}

export const SOCIAL_MEDIA_ANALYSIS: SocialPlatformStats[] = [
  {
    platform: 'X (Twitter)',
    handle: '@MahaDGIPR',
    totalFollowers: '1.42 Million',
    monthlyReach: '18.4 Million',
    positiveSentimentPercent: 81,
    neutralSentimentPercent: 14,
    negativeSentimentPercent: 5,
    trendingTopics: [
      { tag: '#MajhiLadkiBahin', mentions: '240K posts' },
      { tag: '#MahaInfrastructure', mentions: '115K posts' },
      { tag: '#SamruddhiHighway', mentions: '88K posts' },
      { tag: '#NamoShetkari', mentions: '72K posts' },
    ],
  },
  {
    platform: 'Facebook',
    handle: 'DGIPR Maharashtra',
    totalFollowers: '2.15 Million',
    monthlyReach: '26.8 Million',
    positiveSentimentPercent: 84,
    neutralSentimentPercent: 12,
    negativeSentimentPercent: 4,
    trendingTopics: [
      { tag: '#शासन_आपल्या_दारी', mentions: '310K shares' },
      { tag: '#लाडकी_बहीण_योजना', mentions: '290K shares' },
      { tag: '#शेतकरी_सन्मान', mentions: '145K shares' },
    ],
  },
  {
    platform: 'Instagram',
    handle: '@dgiprmaharashtra',
    totalFollowers: '985,000',
    monthlyReach: '14.2 Million',
    positiveSentimentPercent: 89,
    neutralSentimentPercent: 8,
    negativeSentimentPercent: 3,
    trendingTopics: [
      { tag: '#MahaVikasReels', mentions: '520K views' },
      { tag: '#YouthSkillFellowship', mentions: '340K views' },
      { tag: '#FortConservation', mentions: '280K views' },
    ],
  },
  {
    platform: 'YouTube',
    handle: 'Maha DGIPR Official',
    totalFollowers: '850,000 Subscribers',
    monthlyReach: '9.6 Million Views',
    positiveSentimentPercent: 87,
    neutralSentimentPercent: 10,
    negativeSentimentPercent: 3,
    trendingTopics: [
      { tag: 'Cabinet Briefing Live', mentions: '85K live concurrent' },
      { tag: 'Documentary on Swarajya Forts', mentions: '450K views' },
      { tag: 'Farmer Success Stories', mentions: '320K views' },
    ],
  },
];
