export interface LokrajyaIssue {
  id: string;
  month: string;
  monthMr: string;
  year: number;
  language: 'marathi' | 'english' | 'hindi' | 'urdu' | 'gujarati';
  title: string;
  titleMr: string;
  theme: string;
  themeMr: string;
  volume: string;
  pages: number;
  fileSizeBytes: string;
  coverGradient: string;
  highlights: string[];
  highlightsMr: string[];
  downloadFileName: string;
}

export const LOKRAJYA_LANGUAGES = [
  { id: 'marathi' as const, name: 'मराठी', label: 'मराठी आवृत्ती', flag: '' },
  { id: 'english' as const, name: 'English', label: 'English Edition', flag: '' },
  { id: 'hindi' as const, name: 'हिंदी', label: 'हिंदी संस्करण', flag: '' },
  { id: 'urdu' as const, name: 'اردو', label: 'اردو ایڈیشن', flag: '' },
  { id: 'gujarati' as const, name: 'ગુજરાતી', label: 'ગુજરાતી આવૃત્તિ', flag: '' },
];

export const MONTH_THEMES = [
  {
    month: 'October',
    monthMr: 'ऑक्टोबर',
    year: 2026,
    vol: 'Vol. 80, Issue 10',
    themeEn: 'Diwali Special: Maharashtra Vikas Sankalp 2026',
    themeMr: 'दिवाळी महाविशेषांक: महाराष्ट्र विकास संकल्प २०२६',
    marathiTitle: 'लोकराज्य — दिवाळी महाविशेषांक २०२६',
    englishTitle: 'Lokrajya — Maharashtra Vision 2026 Special',
    hindiTitle: 'लोकराज्य — महाराष्ट्र विकास संकल्प दीपावली विशेषांक',
    urduTitle: 'لوک راجیہ — مہاراشٹر وکاس سنکلپ دیوالی اسپیشل',
    gujaratiTitle: 'લોકરાજ્ય — મહારાષ્ટ્ર વિકાસ સંકલ્પ દિવાળી વિશેષાંક',
    gradient: 'from-slate-800 via-blue-900 to-slate-950',
    highlights: ['Vikas Sankalp Blueprint', 'CM Vision Address', 'State Economic Corridor'],
    highlightsMr: ['विकास संकल्प रूपरेषा', 'मुख्यमंत्री दूरदृष्टी विचार', 'राज्य आर्थिक कॉरिडॉर'],
  },
  {
    month: 'September',
    monthMr: 'सप्टेंबर',
    year: 2026,
    vol: 'Vol. 80, Issue 09',
    themeEn: 'Women Empowerment: Mukhyamantri Majhi Ladki Bahin',
    themeMr: 'नारी शक्ती: मुख्यमंत्री माझी लाडकी बहीण महाअभियान',
    marathiTitle: 'लोकराज्य — लाडकी बहीण व महिला सशक्तीकरण',
    englishTitle: 'Lokrajya — Nari Shakti & Economic Independence',
    hindiTitle: 'लोकराज्य — नारी शक्ति एवं लाड़की बहिन योजना विशेषांक',
    urduTitle: 'لوک راجیہ — ناری شکتی اور لاڈکی بہن اسکیم خصوصی نمبر',
    gujaratiTitle: 'લોકરાજ્ય — નારી શક્તિ અને લાડકી બહિન યોજના વિશેષાંક',
    gradient: 'from-rose-700 via-pink-800 to-slate-900',
    highlights: ['Direct DBT Transfers', 'Self Help Groups', 'Women Entrepreneurs'],
    highlightsMr: ['थेट बँक जमा लाभ', 'महिला बचत गट क्रांती', 'उद्योजक महिला यशोगाथा'],
  },
  {
    month: 'August',
    monthMr: 'ऑगस्ट',
    year: 2026,
    vol: 'Vol. 80, Issue 08',
    themeEn: 'Infrastructure Revolution: Atal Setu & Coastal Corridors',
    themeMr: 'पायाभूत सुविधा क्रांती: अटल सेतू व सागरी महामार्ग',
    marathiTitle: 'लोकराज्य — समृद्ध महाराष्ट्र: पायाभूत सुविधा',
    englishTitle: 'Lokrajya — Infrastructure & Mobility Revolution',
    hindiTitle: 'लोकराज्य — अवसंरचना क्रांति एवं अटल सेतु कॉरिडोर',
    urduTitle: 'لوک راجیہ — انفراسٹرکچر انقلاب اور اَٹل سیتو کوریڈور',
    gujaratiTitle: 'લોકરાજ્ય — ઇન્ફ્રાસ્ટ્રક્ચર ક્રાંતિ અને અટલ સેતુ',
    gradient: 'from-blue-800 via-indigo-900 to-slate-900',
    highlights: ['Atal Setu Growth', 'Metro 3 & 5 Progress', 'Green Expressway Network'],
    highlightsMr: ['अटल सेतू विकास', 'मेट्रो ३ व ५ प्रगती', 'हरित द्रुतगती महामार्ग जाळे'],
  },
  {
    month: 'July',
    monthMr: 'जुलै',
    year: 2026,
    vol: 'Vol. 80, Issue 07',
    themeEn: 'Agrarian Security: Jalyukta Shivar 2.0 & MSP Protection',
    themeMr: 'बळीराजा समृद्धी: जलयुक्त शिवार २.० व शाश्वत शेती',
    marathiTitle: 'लोकराज्य — शेतकरी कल्याण व जलसुरक्षा विशेषांक',
    englishTitle: 'Lokrajya — Farmer Welfare & Water Security',
    hindiTitle: 'लोकराज्य — किसान कल्याण एवं जलयुक्त शिवार २.०',
    urduTitle: 'لوک راجیہ — کسان فلاح اور آبی تحفظ خصوصی شمارہ',
    gujaratiTitle: 'લોકરાજ્ય — કિસાન કલ્યાણ અને જળ સુરક્ષા વિશેષાંક',
    gradient: 'from-emerald-800 via-teal-900 to-slate-900',
    highlights: ['Water Conservation Feats', 'Solar Agri Feeders', 'MSP Subsidy Direct Pay'],
    highlightsMr: ['जलसंधारण यशोगाथा', 'सौर कृषी फिडर योजना', 'थेट हमीभाव अनुदान'],
  },
  {
    month: 'June',
    monthMr: 'जून',
    year: 2026,
    vol: 'Vol. 80, Issue 06',
    themeEn: 'Shivaji Maharaj Fort Heritage & UNESCO Conservation',
    themeMr: 'शिवकालीन गडकिल्ले संवर्धन व ऐतिहासिक वारसा',
    marathiTitle: 'लोकराज्य — शिवराज्याभिषेक व दुर्ग संवर्धन',
    englishTitle: 'Lokrajya — Maratha Heritage & UNESCO Forts',
    hindiTitle: 'लोकराज्य — छत्रपति शिवाजी महाराज दुर्ग संरक्षण',
    urduTitle: 'لوک راجیہ — چھترپتی شیواجی مہاراج قلعہ ورثہ اور تحفظ',
    gujaratiTitle: 'લોકરાજ્ય — શિવાજી મહારાજ કિલ્લા સંરક્ષણ અને વારસો',
    gradient: 'from-amber-800 via-orange-950 to-slate-950',
    highlights: ['UNESCO Nomination File', '37 Fort Masterplans', 'Eco-Tourism Treks'],
    highlightsMr: ['युनेस्को जागतिक वारसा नामांकन', '३७ किल्ल्यांचे आराखडे', 'पर्यावरणपूरक गडभ्रमण'],
  },
  {
    month: 'May',
    monthMr: 'मे',
    year: 2026,
    vol: 'Vol. 80, Issue 05',
    themeEn: 'Maharashtra Day Special: 66 Glorious Years of Growth',
    themeMr: 'महाराष्ट्र दिन गौरव विशेषांक: ६६ वर्षांची दैदीप्यमान वाटचाल',
    marathiTitle: 'लोकराज्य — १ मे महाराष्ट्र दिन गौरव विशेषांक',
    englishTitle: 'Lokrajya — Maharashtra Day Commemorative Issue',
    hindiTitle: 'लोकराज्य — महाराष्ट्र स्थापना दिवस हीरक यात्रा',
    urduTitle: 'لوک راجیہ — یوم مہاراشٹر خصوصی یادگاری شمارہ',
    gujaratiTitle: 'લોકરાજ્ય — ૧ મે મહારાષ્ટ્ર દિવસ ગૌરવ વિશેષાંક',
    gradient: 'from-red-800 via-amber-900 to-slate-950',
    highlights: ['66 Years State Milestones', 'Industrial Apex Leader', 'Literary & Cultural Roots'],
    highlightsMr: ['६६ वर्षांचे विकासाचे टप्पे', 'देशात उद्योग क्षेत्रात प्रथम', 'साहित्य व सांस्कृतिक समृद्धी'],
  },
  {
    month: 'April',
    monthMr: 'एप्रिल',
    year: 2026,
    vol: 'Vol. 80, Issue 04',
    themeEn: 'Dr. B.R. Ambedkar & Social Justice Revolution',
    themeMr: 'क्रांतिसूर्य डॉ. बाबासाहेब आंबेडकर व सामाजिक न्याय',
    marathiTitle: 'लोकराज्य — समता, बंधुता व सामाजिक न्याय',
    englishTitle: 'Lokrajya — Dr. B.R. Ambedkar & Constitutional Rights',
    hindiTitle: 'लोकराज्य — डॉ. भीमराव आंबेडकर सामाजिक न्याय विशेषांक',
    urduTitle: 'لوک راجیہ — ڈاکٹر بابا صاحب امبیڈکر اور سماجی انصاف',
    gujaratiTitle: 'લોકરાજ્ય — ડૉ. બાબાસાહેબ આંબેડકર સામાજિક ન્યાય',
    gradient: 'from-blue-900 via-sky-950 to-slate-950',
    highlights: ['Scholarships for 10L Students', 'Chhatrapati Shahu Hostels', 'Samata Hubs'],
    highlightsMr: ['१० लाख विद्यार्थ्यांना शिष्यवृत्ती', 'शाहू महाराज वसतिगृहे', 'समता केंद्र विस्तार'],
  },
  {
    month: 'March',
    monthMr: 'मार्च',
    year: 2026,
    vol: 'Vol. 80, Issue 03',
    themeEn: 'Maharashtra State Budget 2026-27: Citizen Blueprint',
    themeMr: 'महाराष्ट्र अर्थसंकल्प २०२६-२७: लोककल्याणकारी दिशा',
    marathiTitle: 'लोकराज्य — अर्थसंकल्प विशेषांक २०२६-२७',
    englishTitle: 'Lokrajya — State Fiscal Blueprint & Allocations',
    hindiTitle: 'लोकराज्य — महाराष्ट्र बजट २०२६-२७ विशेषांक',
    urduTitle: 'لوک راجیہ — مہاراشٹر بجٹ خصوصی شمسی شمارہ',
    gujaratiTitle: 'લોકરાજ્ય — મહારાષ્ટ્ર બજેટ ૨૦૨૬-૨૭ વિશેષાંક',
    gradient: 'from-emerald-900 via-slate-900 to-slate-950',
    highlights: ['Record Capital Outlay', 'Zero Farmer Premium Crop Insurance', 'Health Guarantee'],
    highlightsMr: ['विक्रमी भांडवली खर्च', '१ रुपयात पीक विमा हमी', 'आरोग्य संरक्षण तरतूद'],
  },
  {
    month: 'February',
    monthMr: 'फेब्रुवारी',
    year: 2026,
    vol: 'Vol. 80, Issue 02',
    themeEn: 'Youth Skill Mission & Start-up Maharashtra',
    themeMr: 'युवा कौशल्य व रोजगार क्रांती: स्टार्टअप महाराष्ट्र',
    marathiTitle: 'लोकराज्य — युवा कार्य प्रशिक्षण व रोजगार',
    englishTitle: 'Lokrajya — Youth Empowerment & Start-up Surge',
    hindiTitle: 'लोकराज्य — युवा कौशल एवं रोजगार महाअभियान',
    urduTitle: 'لوک راجیہ — نوجوانوں کی مہارت اور اسٹارٹ اپ انقلاب',
    gujaratiTitle: 'લોકરાજ્ય — યુવા કૌશલ્ય અને સ્ટાર્ટ-અપ ક્રાંતિ',
    gradient: 'from-purple-900 via-indigo-950 to-slate-950',
    highlights: ['10 Lakh Apprenticeships', 'Seed Capital Grants', 'FinTech & AI Incubators'],
    highlightsMr: ['१० लाख उमेदवारांना विद्यावेतन', 'बीज भांडवल अनुदान', 'आर्टिफिशियल इंटेलिजन्स हब्स'],
  },
  {
    month: 'January',
    monthMr: 'जानेवारी',
    year: 2026,
    vol: 'Vol. 80, Issue 01',
    themeEn: 'Republic Day & Digital Governance: Aaple Sarkar',
    themeMr: 'प्रजासत्ताक दिन: डिजिटल ई-प्रशासन व आपले सरकार',
    marathiTitle: 'लोकराज्य — प्रजासत्ताक दिन व सुशासन',
    englishTitle: 'Lokrajya — Republic Day & Citizen Governance',
    hindiTitle: 'लोकराज्य — गणतंत्र दिवस एवं ई-गवर्नेंस विशेषांक',
    urduTitle: 'لوک راجیہ — یوم جمہوریہ اور ڈیجیٹل ای گورننس',
    gujaratiTitle: 'લોકરાજ્ય — પ્રજાસત્તાક દિન અને ડિજિટલ ઈ-ગવર્નન્સ',
    gradient: 'from-amber-900 via-slate-900 to-slate-950',
    highlights: ['500+ Online Services', 'Service Guarantee Act', 'Paperless Secretariats'],
    highlightsMr: ['५००+ ऑनलाइन लोकसेवा', 'सेवा हमी कायद्याची अंमलबजावणी', 'कागदविरहित मंत्रालय'],
  },
  {
    month: 'December',
    monthMr: 'डिसेंबर',
    year: 2025,
    vol: 'Vol. 79, Issue 12',
    themeEn: 'Tribal Welfare & Forest Rights in Vidarbha',
    themeMr: 'आदिवासी कल्याण व वनहक्क: विदर्भ महाविकास',
    marathiTitle: 'लोकराज्य — पेसा कायदा व आदिवासी विकास',
    englishTitle: 'Lokrajya — PESA Act & Tribal Rights Victory',
    hindiTitle: 'लोकराज्य — आदिवासी कल्याण एवं वन अधिकार',
    urduTitle: 'لوک راجیہ — قبائلی فلاح و بہبود اور جنگلات کے حقوق',
    gujaratiTitle: 'લોકરાજ્ય — આદિવાસી કલ્યાણ અને વનાધિકાર વિશેષાંક',
    gradient: 'from-emerald-950 via-teal-950 to-slate-950',
    highlights: ['Surjagarh Direct Employment', 'Forest Land Titles', 'Tribal Ashram Upgrades'],
    highlightsMr: ['सुरजागड थेट रोजगार', 'वनहक्क पट्टे वाटप', 'आश्रमशाळांचे आधुनिकीकरण'],
  },
  {
    month: 'November',
    monthMr: 'नोव्हेंबर',
    year: 2025,
    vol: 'Vol. 79, Issue 11',
    themeEn: 'Constitution Day: Democracy & Citizen Fundamental Rights',
    themeMr: 'संविधान दिन: लोकशाहीची मूल्ये व नागरिक कर्तव्ये',
    marathiTitle: 'लोकराज्य — संविधान दिन विशेषांक',
    englishTitle: 'Lokrajya — Constitution Day & Democratic Values',
    hindiTitle: 'लोकराज्य — संविधान दिवस एवं नागरिक अधिकार',
    urduTitle: 'لوک راجیہ — یوم آئین اور جمہوری اقدار خصوصی شمارہ',
    gujaratiTitle: 'લોકરાજ્ય — બંધારણ દિન અને લોકશાહી મૂલ્યો વિશેષાંક',
    gradient: 'from-slate-800 via-slate-900 to-slate-950',
    highlights: ['Constitution Preamble Vow', 'Gram Sabha Empowerment', 'Judicial Awareness'],
    highlightsMr: ['संविधान उद्देशिका वाचन', 'ग्रामसभांचे सक्षमीकरण', 'कायदेविषयक जनजागृती'],
  },
];

// Helper to generate full 1-year (12 issues) for all 5 languages = 60 issues
export function getLokrajyaIssuesForLanguage(
  lang: 'marathi' | 'english' | 'hindi' | 'urdu' | 'gujarati'
): LokrajyaIssue[] {
  return MONTH_THEMES.map((item, idx) => {
    let title = item.englishTitle;
    let theme = item.themeEn;
    if (lang === 'marathi') {
      title = item.marathiTitle;
      theme = item.themeMr;
    } else if (lang === 'hindi') {
      title = item.hindiTitle;
      theme = item.themeEn;
    } else if (lang === 'urdu') {
      title = item.urduTitle;
      theme = item.themeEn;
    } else if (lang === 'gujarati') {
      title = item.gujaratiTitle;
      theme = item.themeEn;
    }

    const pages = 80 + ((idx * 3) % 18);
    const size = (14.2 + (idx * 0.4) % 4.6).toFixed(1);

    return {
      id: `lokrajya-${lang}-${item.year}-${String(10 - idx <= 0 ? 12 + (10 - idx) : 10 - idx).padStart(2, '0')}`,
      month: item.month,
      monthMr: item.monthMr,
      year: item.year,
      language: lang,
      title,
      titleMr: item.marathiTitle,
      theme,
      themeMr: item.themeMr,
      volume: item.vol,
      pages,
      fileSizeBytes: `${size} MB`,
      coverGradient: item.gradient,
      highlights: item.highlights,
      highlightsMr: item.highlightsMr,
      downloadFileName: `Lokrajya_${lang.toUpperCase()}_${item.month}_${item.year}.pdf`,
    };
  });
}
