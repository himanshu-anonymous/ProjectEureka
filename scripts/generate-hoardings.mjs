import fs from 'fs';
import path from 'path';

const PUBLIC_HOARDINGS_DIR = path.join(process.cwd(), 'public', 'hoardings');
if (!fs.existsSync(PUBLIC_HOARDINGS_DIR)) {
  fs.mkdirSync(PUBLIC_HOARDINGS_DIR, { recursive: true });
}

const CAMPAIGNS = [
  {
    key: 'ladki-bahin',
    titleEn: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    titleMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    dept: 'Women & Child Development • महिला व बालविकास',
    bgStart: '#831843',
    bgEnd: '#BE185D',
    accent: '#FDF2F8',
    icon: '👩‍👧',
    tagline: '₹1,500 Monthly Direct Benefit Transfer • महिलांचे आर्थिक सक्षमीकरण',
  },
  {
    key: 'metro-infra',
    titleEn: 'Maha Metro Line 5 Infrastructure Milestone',
    titleMr: 'महा मेट्रो मार्गिका ५ पायाभूत सुविधा प्रगती',
    dept: 'Urban Development (MMRDA) • नगर विकास',
    bgStart: '#1E3A8A',
    bgEnd: '#2563EB',
    accent: '#EFF6FF',
    icon: '🚇',
    tagline: 'Connecting Thane-Bhiwandi-Kalyan • वेगवान, सुरक्षित, प्रदूषणमुक्त प्रवास',
  },
  {
    key: 'health-scheme',
    titleEn: 'Arogya Vardhini Universal Health Coverage',
    titleMr: 'आरोग्य वर्धिनी मोफत उपचार योजना',
    dept: 'Public Health Department • सार्वजनिक आरोग्य विभाग',
    bgStart: '#064E3B',
    bgEnd: '#059669',
    accent: '#ECFDF5',
    icon: '🏥',
    tagline: '₹5 Lakh Free Cashless Healthcare • दर्जेदार आरोग्य सेवा मोफत',
  },
  {
    key: 'fort-conservation',
    titleEn: 'Shivaji Maharaj Fort Conservation Mission',
    titleMr: 'छत्रपती शिवाजी महाराज गडकिल्ले संवर्धन अभियान',
    dept: 'Cultural Affairs & Tourism • सांस्कृतिक कार्य व पर्यटन',
    bgStart: '#7C2D12',
    bgEnd: '#C2410C',
    accent: '#FFF7ED',
    icon: '🚩',
    tagline: 'UNESCO World Heritage Heritage Forts • ऐतिहासिक स्वराज्याचा वारसा',
  },
  {
    key: 'atal-setu',
    titleEn: 'Atal Setu Regional Growth Corridor (MTHL)',
    titleMr: 'अटल सेतू प्रादेशिक विकास कॉरिडॉर',
    dept: 'Industries & Infrastructure • उद्योग व पायाभूत सुविधा',
    bgStart: '#0F172A',
    bgEnd: '#1E293B',
    accent: '#F8FAFC',
    icon: '🌉',
    tagline: '21.8 Km India’s Longest Sea Bridge • २० मिनिटांत मुंबई ते नवी मुंबई',
  },
  {
    key: 'coastal-road',
    titleEn: 'Dharmveer Swarajya Rakshak Coastal Road',
    titleMr: 'धर्मवीर स्वराज्यरक्षक संभाजी महाराज कोस्टल रोड',
    dept: 'Urban Infrastructure (BMC) • नगर पायाभूत सुविधा',
    bgStart: '#0C4A6E',
    bgEnd: '#0284C7',
    accent: '#F0F9FF',
    icon: '🌊',
    tagline: 'Undersea Tunnel & High-Speed Transit • विनाविलंब सागरी द्रुतगती प्रवास',
  },
  {
    key: 'vadhvan-port',
    titleEn: 'Vadhvan Green Deep-Sea Port Project',
    titleMr: 'वाढवण हरित महा-बंदराची निर्मिती',
    dept: 'Ports & Maritime Board • बंदरे व सागरी विकास',
    bgStart: '#134E4A',
    bgEnd: '#0D9488',
    accent: '#F0FDFA',
    icon: '🚢',
    tagline: 'Top 10 Global Port Capacity • लाखो स्थानिक रोजगारांची संधी',
  },
  {
    key: 'jalyukta-shivar',
    titleEn: 'Jalyukta Shivar Abhiyan 2.0 Drought Resilience',
    titleMr: 'जलयुक्त शिवार अभियान २.० दुष्काळमुक्ती',
    dept: 'Water Resources & Agriculture • जलसंपदा व कृषी विभाग',
    bgStart: '#1E3A5F',
    bgEnd: '#0284C7',
    accent: '#E0F2FE',
    icon: '💧',
    tagline: 'Decentralized Water Harvesting • प्रत्येक शेताला शाश्वत पाणी',
  },
  {
    key: 'solar-feeder',
    titleEn: 'Mukhyamantri Saur Krushi Vahini 2.0',
    titleMr: 'मुख्यमंत्री सौर कृषी वाहिनी २.०',
    dept: 'Energy Department • ऊर्जा विभाग',
    bgStart: '#78350F',
    bgEnd: '#D97706',
    accent: '#FEF3C7',
    icon: '☀️',
    tagline: 'Daytime Reliable Solar Power for Farmers • दिवसा हक्काची अखंडित वीज',
  },
  {
    key: 'pune-metro',
    titleEn: 'Pune Metro Rail Expansion & Connectivity',
    titleMr: 'पुणे मेट्रो विस्तार व जलद सार्वजनिक वाहतूक',
    dept: 'Maha Metro & Urban Transit • महा मेट्रो पुणे',
    bgStart: '#312E81',
    bgEnd: '#4F46E5',
    accent: '#EEF2FF',
    icon: '🚊',
    tagline: 'Connecting Hinjawadi to Shivajinagar • प्रदूषणमुक्त व वेगवान प्रवास',
  },
  {
    key: 'samruddhi-feeder',
    titleEn: 'Balasaheb Thackeray Samruddhi Expressway',
    titleMr: 'हिंदूहृदयसम्राट बाळासाहेब ठाकरे समृद्धी महामार्ग',
    dept: 'MSRDC • रस्ते विकास महामंडळ',
    bgStart: '#14532D',
    bgEnd: '#15803D',
    accent: '#F0FDF4',
    icon: '🛣️',
    tagline: '701 Km High-Speed Agro-Industrial Corridor • नागपूर ते मुंबई ८ तास',
  },
  {
    key: 'alphonso-agri',
    titleEn: 'Konkan GI-Tagged Alphonso Mango Export Mission',
    titleMr: 'कोकण हापूस आंबा जागतिक निर्यात अभियान',
    dept: 'Agriculture & Marketing Board • कृषी व पणन विभाग',
    bgStart: '#713F12',
    bgEnd: '#CA8A04',
    accent: '#FEFCE8',
    icon: '🥭',
    tagline: 'Direct GI Export to EU & USA • शेतकरी उत्पादक कंपन्यांचे सक्षमीकरण',
  },
  {
    key: 'sindhudurg-tourism',
    titleEn: 'Sindhudurg Pristine Eco-Tourism & Sea Forts',
    titleMr: 'सिंधुदुर्ग निसर्ग पर्यटन व आंतरराष्ट्रीय स्कूबा केंद्र',
    dept: 'Tourism & Environment • पर्यटन व पर्यावरण विभाग',
    bgStart: '#065F46',
    bgEnd: '#059669',
    accent: '#ECFDF5',
    icon: '🏝️',
    tagline: 'Pristine White Sands & Scuba Diving • आंतरराष्ट्रीय दर्जाचे पर्यटन',
  },
  {
    key: 'tadoba-eco',
    titleEn: 'Tadoba Andhari Tiger Reserve Conservation',
    titleMr: 'ताडोबा-अंधारी व्याघ्र प्रकल्प वन्यजीव संवर्धन',
    dept: 'Forest Department • वन विभाग महाराष्ट्र',
    bgStart: '#365314',
    bgEnd: '#65A30D',
    accent: '#F7FEE7',
    icon: '🐅',
    tagline: 'Wild Tiger Capital of India • पर्यावरण संतुलन व जैवविविधता',
  },
  {
    key: 'nagpur-metro',
    titleEn: 'Nagpur Metro Rail Eco-Transit Network',
    titleMr: 'नागपूर मेट्रो हरित व वेगवान प्रवास जाळे',
    dept: 'Maha Metro Nagpur • महा मेट्रो नागपूर',
    bgStart: '#1E293B',
    bgEnd: '#334155',
    accent: '#F8FAFC',
    icon: '🚄',
    tagline: 'Solar Powered Public Transit • विदर्भाचा अभिमान व आधुनिक विकास',
  },
  {
    key: 'yuva-karya',
    titleEn: 'CM Youth Work-Training & Skill Stipend Scheme',
    titleMr: 'मुख्यमंत्री युवा कार्यप्रशिक्षण व कौशल्य विकास योजना',
    dept: 'Skill Development & Entrepreneurship • कौशल्य विकास',
    bgStart: '#1E3A8A',
    bgEnd: '#3B82F6',
    accent: '#EFF6FF',
    icon: '🎓',
    tagline: '₹10,000 Monthly Apprenticeship Stipend • महाराष्ट्रातील तरुणांना रोजगार',
  },
  {
    key: 'tribal-welfare',
    titleEn: 'Birsa Munda Tribal Empowerment & Forest Rights',
    titleMr: 'बिरसा मुंडा आदिवासी सक्षमीकरण व वनहक्क योजना',
    dept: 'Tribal Development Department • आदिवासी विकास विभाग',
    bgStart: '#854D0E',
    bgEnd: '#EAB308',
    accent: '#FEFCE8',
    icon: '🏹',
    tagline: '100% Pucca Homes & Quality Tribal Education • आदिवासी पाड्यांचा विकास',
  },
  {
    key: 'orange-cluster',
    titleEn: 'Nagpur & Amravati Agro-Export Orange Cluster',
    titleMr: 'नागपूर-अमरावती संत्री प्रक्रिया व निर्यात केंद्र',
    dept: 'Food Processing & Cooperation • अन्न प्रक्रिया विभाग',
    bgStart: '#9A3412',
    bgEnd: '#EA580C',
    accent: '#FFF7ED',
    icon: '🍊',
    tagline: 'Modern Cold Chain & Processing Plants • संत्रा उत्पादक शेतकऱ्यांचा सन्मान',
  },
  {
    key: 'lonar-crater',
    titleEn: 'Lonar Crater Geo-Heritage Geo-Tourism',
    titleMr: 'लोणार उल्का सरोवर जागतिक भू-वारसा संवर्धन',
    dept: 'Tourism & Environment • पर्यटन व भूगर्भ संवर्धन',
    bgStart: '#1E1B4B',
    bgEnd: '#4338CA',
    accent: '#EEF2FF',
    icon: '☄️',
    tagline: 'Hyper-Velocity Meteorite Impact Crater • ५२,००० वर्षे प्राचीन वैज्ञानिक वारसा',
  },
  {
    key: 'ligo-science',
    titleEn: 'LIGO-India Gravitational Wave Observatory',
    titleMr: 'लायगो-इंडिया गुरुत्वीय लहरी वेधशाळा हिंगोली',
    dept: 'Science & Higher Education • विज्ञान व तंत्रज्ञान',
    bgStart: '#0B0F19',
    bgEnd: '#1E293B',
    accent: '#F1F5F9',
    icon: '🔭',
    tagline: 'International Frontier Astrophysics Project • हिंगोलीतून विश्वाचा शोध',
  },
];

function generateBillboardSvg(c) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bg-${c.key}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.bgStart}" />
      <stop offset="100%" stop-color="${c.bgEnd}" />
    </linearGradient>
    <pattern id="grid-${c.key}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Billboard Background -->
  <rect width="800" height="450" fill="url(#bg-${c.key})" />
  <rect width="800" height="450" fill="url(#grid-${c.key})" />

  <!-- Outer Structural Billboard Border Frame -->
  <rect x="12" y="12" width="776" height="426" rx="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>

  <!-- Top Institutional Bar -->
  <rect x="14" y="14" width="772" height="52" fill="rgba(0,0,0,0.35)" />
  
  <!-- Emblem Circle -->
  <circle cx="50" cy="40" r="18" fill="#F59E0B" />
  <text x="50" y="46" font-family="-apple-system, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#0F172A">MH</text>

  <text x="82" y="36" font-family="-apple-system, 'Mukta', sans-serif" font-size="15" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">
    महाराष्ट्र शासन • GOVERNMENT OF MAHARASHTRA
  </text>
  <text x="82" y="52" font-family="-apple-system, sans-serif" font-size="11" font-weight="600" fill="#FDE68A">
    ${c.dept}
  </text>

  <!-- PWD Geotag Verified Badge -->
  <rect x="640" y="24" width="134" height="28" rx="6" fill="#10B981" />
  <text x="707" y="42" font-family="-apple-system, sans-serif" font-size="10" font-weight="800" text-anchor="middle" fill="#FFFFFF" letter-spacing="0.5">
    ✓ PWD GEOTAG VERIFIED
  </text>

  <!-- Central Campaign Display -->
  <g transform="translate(48, 110)">
    <!-- Theme Graphic / Icon Badge -->
    <rect x="0" y="0" width="72" height="72" rx="16" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
    <text x="36" y="48" font-size="38" text-anchor="middle">${c.icon}</text>

    <!-- Scheme Titles -->
    <text x="96" y="32" font-family="-apple-system, 'Mukta', sans-serif" font-size="30" font-weight="900" fill="#FFFFFF" filter="url(#shadow)">
      ${c.titleMr}
    </text>
    <text x="96" y="66" font-family="-apple-system, 'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700" fill="#FDE68A">
      ${c.titleEn}
    </text>

    <!-- Tagline Card -->
    <rect x="0" y="102" width="704" height="74" rx="12" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="24" y="146" font-family="-apple-system, 'Mukta', sans-serif" font-size="20" font-weight="800" fill="#FFFFFF">
      ★ ${c.tagline}
    </text>

    <!-- Operational KPI Pills -->
    <g transform="translate(0, 196)">
      <rect x="0" y="0" width="220" height="34" rx="6" fill="rgba(255,255,255,0.12)" />
      <text x="14" y="22" font-family="-apple-system, monospace" font-size="11" font-weight="700" fill="#FFFFFF">
        GPS: 19.1860° N, 72.9750° E
      </text>

      <rect x="236" y="0" width="220" height="34" rx="6" fill="rgba(255,255,255,0.12)" />
      <text x="250" y="22" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#A7F3D0">
        LIVE ILLUMINATION: 248 LUX
      </text>

      <rect x="472" y="0" width="232" height="34" rx="6" fill="rgba(255,255,255,0.12)" />
      <text x="486" y="22" font-family="-apple-system, sans-serif" font-size="11" font-weight="700" fill="#FDE68A">
        REACH: 150,000+ CITIZENS/DAY
      </text>
    </g>
  </g>

  <!-- Bottom Attribution Footer -->
  <rect x="14" y="408" width="772" height="30" fill="rgba(0,0,0,0.45)" />
  <text x="32" y="427" font-family="-apple-system, sans-serif" font-size="10" font-weight="600" fill="#94A3B8">
    DIRECTORATE GENERAL OF INFORMATION &amp; PUBLIC RELATIONS (DGIPR) • STATE CAMPAIGN RELEASE LEDGER 2026
  </text>
  <text x="768" y="427" font-family="-apple-system, monospace" font-size="10" font-weight="600" text-anchor="end" fill="#6EE7B7">
    OFFICIAL PUBLIC RECORD
  </text>
</svg>`;
}

// Generate files for all campaigns
for (const c of CAMPAIGNS) {
  const svg = generateBillboardSvg(c);
  // Write .svg
  const svgPath = path.join(PUBLIC_HOARDINGS_DIR, `${c.key}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');

  // Also write .png using the svg content so any <img> requesting .png is satisfied
  const pngPath = path.join(PUBLIC_HOARDINGS_DIR, `${c.key}.png`);
  fs.writeFileSync(pngPath, svg, 'utf8');
}

// Write fallback default
const fallbackSvg = generateBillboardSvg({
  key: 'default-hoarding',
  titleEn: 'State Government Public Information Campaign',
  titleMr: 'महाराष्ट्र शासन जनसंपर्क व अधिकृत माहिती मोहीम',
  dept: 'DGIPR • माहिती व जनसंपर्क महासंचालनालय',
  bgStart: '#1E293B',
  bgEnd: '#0F172A',
  accent: '#F8FAFC',
  icon: '🏛️',
  tagline: 'Transparent Governance & Direct Citizen Welfare • पारदर्शक लोकप्रशासन',
});
fs.writeFileSync(path.join(PUBLIC_HOARDINGS_DIR, 'default.svg'), fallbackSvg, 'utf8');
fs.writeFileSync(path.join(PUBLIC_HOARDINGS_DIR, 'default.png'), fallbackSvg, 'utf8');

console.log(`Generated ${CAMPAIGNS.length * 2 + 2} hoarding billboard assets in ${PUBLIC_HOARDINGS_DIR}`);
