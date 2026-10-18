import { Language, IncidentData, OCRRecord } from '@/types/dashboard';

// ==========================================
// 1. ALL 36 MAHARASHTRA DISTRICTS LOCALIZATION
// ==========================================
export const DISTRICT_MAP: Record<string, { en: string; mr: string }> = {
  thane: { en: 'Thane', mr: 'ठाणे' },
  palghar: { en: 'Palghar', mr: 'पालघर' },
  raigad: { en: 'Raigad', mr: 'रायगड' },
  ratnagiri: { en: 'Ratnagiri', mr: 'रत्नागिरी' },
  sindhudurg: { en: 'Sindhudurg', mr: 'सिंधुदुर्ग' },
  pune: { en: 'Pune', mr: 'पुणे' },
  'mumbai-city': { en: 'Mumbai City', mr: 'मुंबई शहर' },
  mumbai: { en: 'Mumbai City', mr: 'मुंबई शहर' },
  'mumbai-suburban': { en: 'Mumbai Suburban', mr: 'मुंबई उपनगर' },
  nashik: { en: 'Nashik', mr: 'नाशिक' },
  nagpur: { en: 'Nagpur', mr: 'नागपूर' },
  'chhatrapati-sambhajinagar': { en: 'Chhatrapati Sambhajinagar', mr: 'छत्रपती संभाजीनगर' },
  aurangabad: { en: 'Chhatrapati Sambhajinagar', mr: 'छत्रपती संभाजीनगर' },
  kolhapur: { en: 'Kolhapur', mr: 'कोल्हापूर' },
  solapur: { en: 'Solapur', mr: 'सोलापूर' },
  satara: { en: 'Satara', mr: 'सातारा' },
  sangli: { en: 'Sangli', mr: 'सांगली' },
  amravati: { en: 'Amravati', mr: 'अमरावती' },
  akola: { en: 'Akola', mr: 'अकोला' },
  yavatmal: { en: 'Yavatmal', mr: 'यवतमाळ' },
  buldhana: { en: 'Buldhana', mr: 'बुलढाणा' },
  washim: { en: 'Washim', mr: 'वाशीम' },
  nanded: { en: 'Nanded', mr: 'नांदेड' },
  latur: { en: 'Latur', mr: 'लातूर' },
  parbhani: { en: 'Parbhani', mr: 'परभणी' },
  jalna: { en: 'Jalna', mr: 'जालना' },
  beed: { en: 'Beed', mr: 'बीड' },
  dharashiv: { en: 'Dharashiv', mr: 'धाराशिव' },
  hingoli: { en: 'Hingoli', mr: 'हिंगोली' },
  jalgaon: { en: 'Jalgaon', mr: 'जळगाव' },
  dhule: { en: 'Dhule', mr: 'धुळे' },
  nandurbar: { en: 'Nandurbar', mr: 'नंदुरबार' },
  ahmednagar: { en: 'Ahilyanagar', mr: 'अहिल्यानगर' },
  ahilyanagar: { en: 'Ahilyanagar', mr: 'अहिल्यानगर' },
  wardha: { en: 'Wardha', mr: 'वर्धा' },
  chandrapur: { en: 'Chandrapur', mr: 'चंद्रपूर' },
  gadchiroli: { en: 'Gadchiroli', mr: 'गडचिरोली' },
  bhandara: { en: 'Bhandara', mr: 'भंडारा' },
  gondia: { en: 'Gondia', mr: 'गोंदिया' },
};

export function getDistrictName(nameOrId: string | undefined | null, lang: Language): string {
  if (!nameOrId) return lang === 'mr' ? 'सर्व जिल्हे' : 'All Districts';
  const key = nameOrId.trim().toLowerCase().replace(/\s+/g, '-');
  const directMatch = DISTRICT_MAP[key] || DISTRICT_MAP[nameOrId.trim().toLowerCase()];
  if (directMatch) {
    return lang === 'mr' ? directMatch.mr : directMatch.en;
  }
  // Check if string is already in Marathi or English
  for (const entry of Object.values(DISTRICT_MAP)) {
    if (entry.en.toLowerCase() === nameOrId.toLowerCase()) {
      return lang === 'mr' ? entry.mr : entry.en;
    }
    if (entry.mr === nameOrId) {
      return lang === 'mr' ? entry.mr : entry.en;
    }
  }
  return nameOrId;
}

// ==========================================
// 2. ADMINISTRATIVE DIVISIONS LOCALIZATION
// ==========================================
export const DIVISION_MAP: Record<string, { en: string; mr: string }> = {
  'all maharashtra': { en: 'All Maharashtra', mr: 'सर्व महाराष्ट्र' },
  'state command': { en: 'State Command', mr: 'राज्य कमांड' },
  'konkan division': { en: 'Konkan Division', mr: 'कोकण विभाग' },
  konkan: { en: 'Konkan', mr: 'कोकण' },
  'pune division': { en: 'Pune Division', mr: 'पुणे विभाग' },
  pune: { en: 'Pune Division', mr: 'पुणे विभाग' },
  'nagpur division': { en: 'Nagpur Division', mr: 'नागपूर विभाग' },
  nagpur: { en: 'Nagpur Division', mr: 'नागपूर विभाग' },
  'nashik division': { en: 'Nashik Division', mr: 'नाशिक विभाग' },
  nashik: { en: 'Nashik Division', mr: 'नाशिक विभाग' },
  'chhatrapati sambhajinagar division': { en: 'Chhatrapati Sambhajinagar Division', mr: 'छत्रपती संभाजीनगर विभाग' },
  'amravati division': { en: 'Amravati Division', mr: 'अमरावती विभाग' },
  amravati: { en: 'Amravati Division', mr: 'अमरावती विभाग' },
};

export function getDivisionName(div: string | undefined | null, lang: Language): string {
  if (!div) return lang === 'mr' ? 'सर्व महाराष्ट्र' : 'All Maharashtra';
  const key = div.trim().toLowerCase();
  const match = DIVISION_MAP[key];
  if (match) return lang === 'mr' ? match.mr : match.en;
  return div;
}

// ==========================================
// 3. OFFICER PERSONAS & NAMES LOCALIZATION
// ==========================================
export const OFFICER_MAP: Record<string, { en: string; mr: string; titleEn: string; titleMr: string }> = {
  'Dr. Arvind M. Gokhale': {
    en: 'Dr. Arvind M. Gokhale',
    mr: 'डॉ. अरविंद एम. गोखले',
    titleEn: 'State Observer • Clearance L5',
    titleMr: 'राज्य निरीक्षक • स्तर ५',
  },
  'Rudresh Kumar Sawant': {
    en: 'Rudresh Kumar Sawant',
    mr: 'रुद्रेश कुमार सावंत',
    titleEn: 'Divisional Deputy Director',
    titleMr: 'विभागीय उपसंचालक',
  },
  'Vikram S. Mahajan, IAS': {
    en: 'Vikram S. Mahajan, IAS',
    mr: 'विक्रम एस. महाजन, भा.प्र.से.',
    titleEn: 'District Collector (Palghar)',
    titleMr: 'जिल्हाधिकारी (पालघर)',
  },
  'Nilesh R. Kelkar, IAS': {
    en: 'Nilesh R. Kelkar, IAS',
    mr: 'निलेश आर. केळकर, भा.प्र.से.',
    titleEn: 'District Collector (Thane)',
    titleMr: 'जिल्हाधिकारी (ठाणे)',
  },
  'Mandar S. Nerurkar': {
    en: 'Mandar S. Nerurkar',
    mr: 'मंदार एस. नेरुरकर',
    titleEn: 'DIO Desk Operator',
    titleMr: 'जिल्हा माहिती अधिकारी कक्ष',
  },
  'Tanmay V. Bapat': {
    en: 'Tanmay V. Bapat',
    mr: 'तन्मय व्ही. बापट',
    titleEn: 'Chief Information Officer (HQ)',
    titleMr: 'मुख्य माहिती अधिकारी (मुख्यालय)',
  },
  'Tanmay V. Bapat (HQ)': {
    en: 'Tanmay V. Bapat (HQ)',
    mr: 'तन्मय व्ही. बापट (मुख्यालय)',
    titleEn: 'Chief Information Officer (HQ)',
    titleMr: 'मुख्य माहिती अधिकारी (मुख्यालय)',
  },
  'Suhas R. Bhalerao': {
    en: 'Suhas R. Bhalerao',
    mr: 'सुहास आर. भालेराव',
    titleEn: 'Senior DIO & Liaison Head',
    titleMr: 'वरिष्ठ जिल्हा माहिती अधिकारी व संपर्क प्रमुख',
  },
  'Ganesh T. Wanjari': {
    en: 'Ganesh T. Wanjari',
    mr: 'गणेश टी. वंजारी',
    titleEn: 'District Information Officer',
    titleMr: 'जिल्हा माहिती अधिकारी',
  },
  'Pranav K. Soman': {
    en: 'Pranav K. Soman',
    mr: 'प्रणव के. सोमन',
    titleEn: 'District Information Officer',
    titleMr: 'जिल्हा माहिती अधिकारी',
  },
  'Milind D. Salunkhe': {
    en: 'Milind D. Salunkhe',
    mr: 'मिलिंद डी. साळुंखे',
    titleEn: 'District Information Officer',
    titleMr: 'जिल्हा माहिती अधिकारी',
  },
  'Digambar R. Tawde': {
    en: 'Digambar R. Tawde',
    mr: 'दिगंबर आर. तावडे',
    titleEn: 'District Information Officer',
    titleMr: 'जिल्हा माहिती अधिकारी',
  },
  'Shashank B. Gole': {
    en: 'Shashank B. Gole',
    mr: 'शशांक बी. गोळे',
    titleEn: 'District Information Officer',
    titleMr: 'जिल्हा माहिती अधिकारी',
  },
};

export function getOfficerName(name: string | undefined | null, lang: Language): string {
  if (!name) return '';
  for (const [key, val] of Object.entries(OFFICER_MAP)) {
    if (name.includes(key) || key.includes(name)) {
      return lang === 'mr' ? val.mr : val.en;
    }
  }
  return name;
}

export function getOfficerRole(nameOrRole: string | undefined | null, lang: Language): string {
  if (!nameOrRole) return '';
  for (const [key, val] of Object.entries(OFFICER_MAP)) {
    if (nameOrRole.includes(key) || key.includes(nameOrRole)) {
      return lang === 'mr' ? val.titleMr : val.titleEn;
    }
  }
  return nameOrRole;
}

export function getOfficerInfo(name: string | undefined | null, lang: Language): { name: string; role: string } | null {
  if (!name) return null;
  for (const [key, val] of Object.entries(OFFICER_MAP)) {
    if (name.includes(key) || key.includes(name)) {
      return {
        name: lang === 'mr' ? val.mr : val.en,
        role: lang === 'mr' ? val.titleMr : val.titleEn,
      };
    }
  }
  return { name, role: '' };
}

// ==========================================
// 4. GENERAL STATUSES & SENTIMENTS LOCALIZATION
// ==========================================
export const STATUS_MAP: Record<string, { en: string; mr: string }> = {
  active: { en: 'Active', mr: 'सक्रिय' },
  standby: { en: 'Standby', mr: 'प्रतीक्षारत' },
  'field operation': { en: 'Field Operation', mr: 'क्षेत्रीय मोहीम' },
  'not configured': { en: 'Not configured', mr: 'कॉन्फिगर नाही' },
  completed: { en: 'Completed', mr: 'पूर्ण' },
  ongoing: { en: 'Ongoing', mr: 'सुरू' },
  scheduled: { en: 'Scheduled', mr: 'नियोजित' },
  done: { en: 'Done', mr: 'पूर्ण' },
  'in progress': { en: 'Active', mr: 'सक्रिय' },
  pending: { en: 'Scheduled', mr: 'नियोजित' },
  verified: { en: 'Verified', mr: 'प्रमाणित' },
  'fact-check passed': { en: 'Fact-Checked', mr: 'तपासणी पूर्ण' },
  'fact checked': { en: 'Fact Checked', mr: 'तथ्य तपासणी पूर्ण' },
  'under review': { en: 'Under Review', mr: 'पुनरावलोकन चालू' },
  'flagged misinfo': { en: 'Flagged Misinfo', mr: 'अफवा चिन्हांकित' },
  authorized: { en: 'Authorized', mr: 'अधिकृत' },
  'rebuttal dispatched': { en: 'Rebuttal Dispatched', mr: 'खंडन जारी' },
  'collectorate verification': { en: 'Collectorate Verification', mr: 'जिल्हाधिकारी पडताळणी' },
  published: { en: 'Published', mr: 'प्रकाशित' },
  draft: { en: 'Draft', mr: 'मसुदा' },
  operational: { en: 'Operational', mr: 'कार्यरत' },
  degraded: { en: 'Degraded', mr: 'संथ' },
  offline: { en: 'Offline', mr: 'ऑफलाइन' },
  high: { en: 'High', mr: 'उच्च' },
  medium: { en: 'Medium', mr: 'मध्यम' },
  low: { en: 'Low', mr: 'कमी' },
  critical: { en: 'Critical', mr: 'गंभीर' },
  positive: { en: 'Positive', mr: 'सकारात्मक' },
  neutral: { en: 'Neutral', mr: 'तटस्थ' },
  negative: { en: 'Negative', mr: 'नकारात्मक' },
  'top high': { en: 'Top High', mr: 'शीर्ष कामगिरी' },
  'lower band': { en: 'Lower Band', mr: 'तळ गट' },
};

export function getLocalizedStatus(status: string | undefined | null, lang: Language): string {
  if (!status) return '';
  const key = status.trim().toLowerCase();
  const match = STATUS_MAP[key];
  if (match) return lang === 'mr' ? match.mr : match.en;
  return status;
}

// ==========================================
// 5. NEWS CHANNELS & MEDIA SOURCES
// ==========================================
export const CHANNEL_MAP: Record<string, { en: string; mr: string; shortEn: string; shortMr: string }> = {
  'abp majha': { en: 'ABP Majha', mr: 'एबीपी माझा', shortEn: 'ABP Majha', shortMr: 'एबीपी' },
  'tv9 marathi': { en: 'TV9 Marathi', mr: 'टीव्ही९ मराठी', shortEn: 'TV9', shortMr: 'टीव्ही९' },
  lokmat: { en: 'Lokmat', mr: 'लोकमत', shortEn: 'Lokmat', shortMr: 'लोकमत' },
  'zee 24 taas': { en: 'Zee 24 Taas', mr: 'झी २४ तास', shortEn: 'Zee 24', shortMr: 'झी २४' },
  'saam tv': { en: 'Saam TV', mr: 'साम टीव्ही', shortEn: 'Saam TV', shortMr: 'साम' },
  'maharashtra times': { en: 'Maharashtra Times', mr: 'महाराष्ट्र टाइम्स', shortEn: 'Maha Times', shortMr: 'मटा' },
  pudhari: { en: 'Pudhari', mr: 'पुढारी', shortEn: 'Pudhari', shortMr: 'पुढारी' },
  'news18 lokmat': { en: 'News18 Lokmat', mr: 'न्यूज१८ लोकमत', shortEn: 'News18', shortMr: 'न्यूज१८' },
  sakal: { en: 'Sakal', mr: 'सकाळ', shortEn: 'Sakal', shortMr: 'सकाळ' },
  'pti bhasha': { en: 'PTI Bhasha', mr: 'पीटीआय भाषा', shortEn: 'PTI', shortMr: 'पीटीआय' },
  'konkan today': { en: 'Regional Today', mr: 'प्रादेशिक टुडे', shortEn: 'Reg Today', shortMr: 'प्रादेशिक' },
  navakal: { en: 'Navakal', mr: 'नवाकाळ', shortEn: 'Navakal', shortMr: 'नवाकाळ' },
  loksatta: { en: 'Loksatta', mr: 'लोकसत्ता', shortEn: 'Loksatta', shortMr: 'लोकसत्ता' },
  'punya nagari': { en: 'Punya Nagari', mr: 'पुण्य नगरी', shortEn: 'Punya Nagari', shortMr: 'पुण्य नगरी' },
};

export function getLocalizedChannel(name: string | undefined | null, lang: Language): string {
  if (!name) return '';
  const clean = name.toLowerCase().replace(/\(.*?\)/g, '').trim();
  for (const [key, val] of Object.entries(CHANNEL_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return lang === 'mr' ? val.mr : val.en;
    }
  }
  return name;
}

// ==========================================
// 6. FOCUS CATEGORIES LOCALIZATION
// ==========================================
export const CATEGORY_MAP: Record<string, { en: string; mr: string }> = {
  'agrarian relief': { en: 'Agrarian Relief', mr: 'शेतकरी दिलासा' },
  'metro phase ii': { en: 'Metro Phase II', mr: 'मेट्रो टप्पा २' },
  'coastal security': { en: 'Coastal Security', mr: 'किनारपट्टी सुरक्षा' },
  'kumbh prep': { en: 'Kumbh Prep', mr: 'कुंभमेळा पूर्वतयारी' },
  'water grid': { en: 'Water Grid', mr: 'जल ग्रीड प्रकल्प' },
  'urban transit': { en: 'Urban Transit', mr: 'शहरी वाहतूक' },
  'sugar msp': { en: 'Sugar MSP', mr: 'साखर हमीभाव' },
  'cotton textile': { en: 'Cotton Textile', mr: 'कापूस वस्त्रोद्योग' },
  'tribal outreach': { en: 'Tribal Outreach', mr: 'आदिवासी कल्याण' },
  'health camp': { en: 'Health Camp', mr: 'आरोग्य शिबिर' },
  'tourism alert': { en: 'Tourism Alert', mr: 'पर्यटन सूचना' },
  'paddy msp': { en: 'Paddy MSP', mr: 'धान हमीभाव' },
  'road works': { en: 'Road Works', mr: 'रस्ते कामे' },
  'district dev': { en: 'District Dev', mr: 'जिल्हा विकास' },
  'field welfare': { en: 'Field Welfare', mr: 'क्षेत्रीय कल्याण' },
};

export function getLocalizedCategory(cat: string | undefined | null, lang: Language): string {
  if (!cat) return '';
  const key = cat.trim().toLowerCase();
  const match = CATEGORY_MAP[key];
  if (match) return lang === 'mr' ? match.mr : match.en;
  return cat;
}

// ==========================================
// 7. LINE DEPARTMENTS LOCALIZATION
// ==========================================
export const DEPARTMENT_MAP: Record<string, { en: string; mr: string }> = {
  'agriculture department': { en: 'Agriculture Department', mr: 'कृषी विभाग' },
  'public health department': { en: 'Public Health Department', mr: 'सार्वजनिक आरोग्य विभाग' },
  'home department': { en: 'Home Department', mr: 'गृह विभाग' },
  'revenue department': { en: 'Revenue Department', mr: 'महसूल विभाग' },
  'revenue & forest department': { en: 'Revenue & Forest Department', mr: 'महसूल व वन विभाग' },
  'cmo press wing': { en: 'CMO Press Wing', mr: 'मुख्यमंत्री कार्यालय कक्ष' },
  'school education department': { en: 'School Education Department', mr: 'शालेय शिक्षण विभाग' },
  'industries department': { en: 'Industries Department', mr: 'उद्योग विभाग' },
};

export function getLocalizedDepartment(dept: string | undefined | null, lang: Language): string {
  if (!dept) return '';
  const key = dept.trim().toLowerCase();
  const match = DEPARTMENT_MAP[key];
  if (match) return lang === 'mr' ? match.mr : match.en;
  return dept;
}

export const PRESS_RELEASE_MAP: Record<string, { en: string; mr: string }> = {
  'pr-ag-101': {
    en: 'PM Kisan Sanman Nidhi 17th installment disbursement across 36 districts',
    mr: '३६ जिल्ह्यांमध्ये पीएम किसान सन्मान निधी १७ व्या हप्त्याचे वितरण',
  },
  'pr-ag-102': {
    en: 'Subsidies approved for automated drip irrigation for Marathwada farmers',
    mr: 'मराठवाड्यातील शेतकऱ्यांसाठी स्वयंचलित ठिबक सिंचनासाठी अनुदान मंजूर',
  },
  'pr-ag-103': {
    en: 'Draft guideline on organic produce certification framework',
    mr: 'सेंद्रिय शेती उत्पादन प्रमाणीकरण आराखड्याबाबत मसुदा मार्गदर्शक तत्त्वे',
  },
  'pr-ph-201': {
    en: 'Mahatma Jyotirao Phule Jan Arogya Yojana expanded coverage ceiling to ₹5 Lakh',
    mr: 'महात्मा ज्योतिराव फुले जन आरोग्य योजनेची मर्यादा ₹५ लाखांपर्यंत वाढवली',
  },
  'pr-ph-202': {
    en: 'District civil hospitals equipped with 24x7 automated diagnostic suites',
    mr: 'जिल्हा रुग्णालयांमध्ये २४x७ स्वयंचलित निदान सुविधा उपलब्ध',
  },
};

export function getLocalizedPressReleaseTitle(id: string, title: string, lang: Language): string {
  if (id && PRESS_RELEASE_MAP[id]) {
    return lang === 'mr' ? PRESS_RELEASE_MAP[id].mr : PRESS_RELEASE_MAP[id].en;
  }
  const hasMarathi = /[\u0900-\u097F]/.test(title);
  if (lang === 'en' && hasMarathi) {
    return 'Official government press release and administrative notification';
  }
  if (lang === 'mr' && !hasMarathi) {
    return 'शासकीय अधिकृत प्रसिद्धीपत्रक आणि प्रशासकीय माहिती';
  }
  return title;
}

// ==========================================
// 8. OCR RECORD HEADLINES & CRISIS INCIDENTS
// ==========================================
export const OCR_HEADLINES_MAP: Record<string, { en: string; mr: string }> = {
  'ocr-1': {
    en: 'Vadhvan Port development in Palghar accelerated, generating thousands of jobs',
    mr: 'पालघरमधील वाढवण बंदर विकासाच्या कामाला गती, हजारो रोजगार उपलब्ध होणार',
  },
  'ocr-2': {
    en: 'Thane City Metro project on-ground review successfully conducted',
    mr: 'ठाणे शहरातील मेट्रो प्रकल्पाच्या कामाची प्रत्यक्ष पाहणी संपन्न',
  },
  'ocr-3': {
    en: 'Special state government funding approved for tourism development in Raigad',
    mr: 'रायगड जिल्ह्यात पर्यटन विकासासाठी शासनाकडून विशेष निधी मंजूर',
  },
  'ocr-4': {
    en: 'Comprehensive crop insurance scheme announced for mango and cashew orchardists in Sindhudurg',
    mr: 'सिंधुदुर्ग जिल्ह्यात आंबा व काजू बागायतदारांसाठी विमा योजना जाहीर',
  },
  'ocr-5': {
    en: 'Immediate review of coastal infrastructure completed along Ratnagiri belt',
    mr: 'रत्नागिरी किनारपट्टीवरील पायाभूत सुविधांचा तातडीने आढावा',
  },
};

export function getLocalizedOcrHeadline(record: OCRRecord, lang: Language): string {
  if (record.id && OCR_HEADLINES_MAP[record.id]) {
    return lang === 'mr' ? OCR_HEADLINES_MAP[record.id].mr : OCR_HEADLINES_MAP[record.id].en;
  }
  // Check if headline itself contains Marathi
  const hasMarathi = /[\u0900-\u097F]/.test(record.headline);
  if (lang === 'en' && hasMarathi) {
    if (record.headlineEn) return record.headlineEn;
    return 'State infrastructure and development initiatives review completed with high velocity.';
  }
  if (lang === 'mr' && !hasMarathi) {
    if (record.headlineMr) return record.headlineMr;
    return 'राज्य शासन विकास व जनकल्याण उपक्रमांचा आढावा यशस्वीरीत्या पूर्ण.';
  }
  return record.headline;
}

export const INCIDENT_SUMMARIES_MAP: Record<string, { en: string; mr: string }> = {
  'INC-2026-PALGHAR-01': {
    en: 'False rumor regarding bridge structural risk in Palghar rural',
    mr: 'पालघर ग्रामीण भागात पुलाच्या सुरक्षिततेबाबत खोटी अफवा पसरवण्याचा प्रयत्न',
  },
  'INC-2026-RAIGAD-02': {
    en: 'Misleading video of NH66 landslide near Mangaon',
    mr: 'माणगावजवळील राष्ट्रीय महामार्ग ६६ वरील दरड कोसळल्याचा दिशाभूल करणारा व्हिडिओ',
  },
  'INC-2026-RATNAGIRI-03': {
    en: 'Unverified claim of fishery ban in Ratnagiri coastal belt',
    mr: 'रत्नागिरी किनारपट्टीवर मासेमारी बंदीचा असत्य व अपडताळलेला दावा',
  },
};

export function getLocalizedIncidentSummary(incident: IncidentData, lang: Language): string {
  if (incident.id && INCIDENT_SUMMARIES_MAP[incident.id]) {
    return lang === 'mr' ? INCIDENT_SUMMARIES_MAP[incident.id].mr : INCIDENT_SUMMARIES_MAP[incident.id].en;
  }
  const hasMarathi = /[\u0900-\u097F]/.test(incident.summary);
  if (lang === 'en' && hasMarathi) {
    return 'Unverified localized social media claim under rapid administrative review.';
  }
  if (lang === 'mr' && !hasMarathi) {
    return 'प्रशासकीय पडताळणी अंतर्गत सोशल मीडियावरील अपडताळलेली माहिती.';
  }
  return incident.summary;
}
