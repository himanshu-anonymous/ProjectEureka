/**
 * High-Precision Geographic & Realistic GIS Detail Features for Google Maps-style rendering
 * Maharashtra Command Center (DGIPR)
 */

export interface HighwayCorridor {
  id: string;
  name: string;
  nameMr: string;
  code: string;
  path: string;
  type: 'expressway' | 'national_highway';
}

export interface RiverFeature {
  id: string;
  name: string;
  nameMr: string;
  path: string;
}

export interface WaterReservoir {
  id: string;
  name: string;
  nameMr: string;
  path: string;
  labelX: number;
  labelY: number;
}

export interface NatureReserve {
  id: string;
  name: string;
  nameMr: string;
  path: string;
  labelX: number;
  labelY: number;
}

export interface RailwayTrunkLine {
  id: string;
  name: string;
  nameMr: string;
  code: string;
  path: string;
}

export interface TerrainRidge {
  id: string;
  name: string;
  nameMr: string;
  path: string;
}

export interface KeyTown {
  id: string;
  name: string;
  nameMr: string;
  districtId: string;
  x: number;
  y: number;
  importance: 'metro' | 'major' | 'taluka';
}

export interface StateLandmark {
  id: string;
  name: string;
  nameMr: string;
  category: 'government' | 'port' | 'heritage' | 'transit';
  x: number;
  y: number;
}

export interface GISGridLine {
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'lat' | 'lng';
}

/* -------------------------------------------------------------------------- */
/* Physical Terrain: Sahyadri Western Ghats Mountain Ridges                   */
/* -------------------------------------------------------------------------- */

export const TERRAIN_RIDGES: TerrainRidge[] = [
  {
    id: 'sahyadri-north',
    name: 'Sahyadri Northern Ridge (Kalsubai / Harishchandragad)',
    nameMr: 'उत्तर सह्याद्री पर्वतरांग (कळसुबाई / हरिश्चंद्रगड)',
    path: 'M180,180 Q176,215 174,250 Q170,290 168,335 Q164,375 162,410',
  },
  {
    id: 'sahyadri-south',
    name: 'Sahyadri Southern Ridge (Mahabaleshwar / Koyna)',
    nameMr: 'दक्षिण सह्याद्री पर्वतरांग (महाबळेश्वर / कोयना)',
    path: 'M162,410 Q160,450 159,490 Q158,530 157,565 Q156,590 156,610',
  },
  {
    id: 'satpura-hills',
    name: 'Satpura Mountain Range (Narmada Border)',
    nameMr: 'सातपुडा पर्वतरांग (नर्मदा सीमा)',
    path: 'M170,95 Q230,90 300,92 Q370,95 440,94 Q500,92 560,94',
  },
  {
    id: 'ajanta-hills',
    name: 'Ajanta & Satmala Range',
    nameMr: 'अजिंठा व सातमाळा डोंगररांग',
    path: 'M230,175 Q290,195 350,192 Q410,190 460,205',
  },
  {
    id: 'balaghat-range',
    name: 'Balaghat Range (Ahmednagar - Beed - Latur)',
    nameMr: 'बालाघाट डोंगररांग (अहिल्यानगर - बीड - लातूर)',
    path: 'M240,290 Q290,320 350,335 Q400,345 450,355',
  },
];

/* -------------------------------------------------------------------------- */
/* Nature Reserves & Forest Biospheres                                        */
/* -------------------------------------------------------------------------- */

export const NATURE_RESERVES: NatureReserve[] = [
  {
    id: 'sanjay-gandhi-np',
    name: 'Sanjay Gandhi National Park',
    nameMr: 'संजय गांधी राष्ट्रीय उद्यान',
    // Polygon covering Borivali/Thane hills
    path: 'M130,285 Q136,282 138,290 Q139,298 134,302 Q128,300 130,285 Z',
    labelX: 138,
    labelY: 288,
  },
  {
    id: 'koyna-sanctuary',
    name: 'Koyna Wildlife Sanctuary (UNESCO)',
    nameMr: 'कोयना वन्यजीव अभयारण्य',
    path: 'M160,440 Q170,445 168,465 Q162,475 158,460 Z',
    labelX: 168,
    labelY: 452,
  },
  {
    id: 'tadoba-reserve',
    name: 'Tadoba Andhari Tiger Reserve',
    nameMr: 'ताडोबा अंधारी व्याघ्र प्रकल्प',
    path: 'M610,225 Q630,220 635,240 Q625,255 605,245 Z',
    labelX: 620,
    labelY: 238,
  },
  {
    id: 'melghat-reserve',
    name: 'Melghat Tiger Reserve (Amravati)',
    nameMr: 'मेळघाट व्याघ्र प्रकल्प',
    path: 'M465,100 Q495,98 500,120 Q480,128 460,118 Z',
    labelX: 480,
    labelY: 110,
  },
  {
    id: 'radhanagari-sanctuary',
    name: 'Radhanagari Bison Sanctuary',
    nameMr: 'राधानगरी गवे अभयारण्य',
    path: 'M168,545 Q178,548 176,562 Q166,568 162,555 Z',
    labelX: 176,
    labelY: 556,
  },
];

/* -------------------------------------------------------------------------- */
/* Major Water Reservoirs & Dam Lakes                                         */
/* -------------------------------------------------------------------------- */

export const WATER_RESERVOIRS: WaterReservoir[] = [
  {
    id: 'shivsagar-koyna',
    name: 'Koyna Dam (Shivsagar Lake)',
    nameMr: 'कोयना धरण (शिवसागर जलाशय)',
    path: 'M162,442 C164,452 165,462 166,472 C163,480 159,475 160,460 Z',
    labelX: 168,
    labelY: 466,
  },
  {
    id: 'nath-sagar-jayakwadi',
    name: 'Jayakwadi Dam (Nath Sagar)',
    nameMr: 'जायकवाडी धरण (नाथसागर जलाशय)',
    path: 'M315,250 C325,248 335,252 338,260 C330,266 318,262 315,250 Z',
    labelX: 330,
    labelY: 254,
  },
  {
    id: 'ujjani-reservoir',
    name: 'Ujjani Reservoir (Yashwant Sagar)',
    nameMr: 'उजनी धरण (यशवंत सागर)',
    path: 'M270,395 C282,402 292,410 298,422 C290,425 278,416 270,395 Z',
    labelX: 288,
    labelY: 412,
  },
  {
    id: 'arthur-lake-bhandardara',
    name: 'Bhandardara (Arthur Lake)',
    nameMr: 'भंडारदरा (ऑर्थर लेक)',
    path: 'M184,235 C190,233 194,238 191,242 C186,244 182,240 184,235 Z',
    labelX: 194,
    labelY: 236,
  },
  {
    id: 'totladoh-pench',
    name: 'Totladoh Reservoir (Pench)',
    nameMr: 'तोतलाडोह जलाशय (पेंच)',
    path: 'M600,98 C610,95 616,104 612,110 C604,112 598,106 600,98 Z',
    labelX: 615,
    labelY: 102,
  },
  {
    id: 'bhatsa-vaitarna',
    name: 'Bhatsa & Upper Vaitarna (Mumbai Water Lifeline)',
    nameMr: 'भातसा व वैतरणा जलाशय',
    path: 'M158,252 C164,248 168,256 165,262 C159,264 156,258 158,252 Z',
    labelX: 168,
    labelY: 258,
  },
];

/* -------------------------------------------------------------------------- */
/* Railway Trunk Corridors (Indian Railways Central & Western)               */
/* -------------------------------------------------------------------------- */

export const RAILWAY_TRUNK_LINES: RailwayTrunkLine[] = [
  {
    id: 'cr-trunk-north',
    name: 'Central Railway Main Line (CSMT - Kalyan - Nashik - Manmad - Bhusawal - Nagpur)',
    nameMr: 'मध्य रेल्वे मुख्य लाईन (मुंबई - कल्याण - नाशिक - मनमाड - भुसावळ - नागपूर)',
    code: 'CR-MAIN',
    path: 'M130,310 C145,298 160,270 185,235 C205,215 245,195 285,185 C335,125 365,130 420,155 C470,165 520,155 595,142 C640,140 680,135 700,135',
  },
  {
    id: 'cr-trunk-south',
    name: 'Central Railway South-East Trunk (Mumbai - Pune - Daund - Solapur)',
    nameMr: 'मध्य रेल्वे दक्षिण-पूर्व लाईन (मुंबई - पुणे - दौंड - सोलापूर)',
    code: 'CR-SOUTH',
    path: 'M130,310 C146,315 168,338 210,365 C240,380 270,392 335,450 C365,475 390,490 405,500',
  },
  {
    id: 'wr-trunk',
    name: 'Western Railway Coastal Trunk (Mumbai - Palghar - Dahanu - Gujarat)',
    nameMr: 'पश्चिम रेल्वे किनारी लाईन (मुंबई - पालघर - डहाणू - गुजरात)',
    code: 'WR-MAIN',
    path: 'M130,310 C132,275 133,240 134,200 C135,170 136,150 137,135',
  },
  {
    id: 'konkan-railway',
    name: 'Konkan Railway Coastal Route (Roha - Chiplun - Ratnagiri - Kankavli - Goa)',
    nameMr: 'कोकण रेल्वे (रोहा - चिपळूण - रत्नागिरी - कणकवली - गोवा)',
    code: 'KR-MAIN',
    path: 'M145,340 C144,385 144,435 145,490 C147,535 152,570 155,605',
  },
];

/* -------------------------------------------------------------------------- */
/* Major National Highway & Expressway Corridors                              */
/* -------------------------------------------------------------------------- */

export const HIGHWAY_CORRIDORS: HighwayCorridor[] = [
  {
    id: 'samruddhi-mahamarg',
    name: 'Hindu Hrudaysamrat Balasaheb Thackeray Samruddhi Mahamarg (Expressway 701 km)',
    nameMr: 'हिंदूहृदयसम्राट बाळासाहेब ठाकरे समृद्धी महामार्ग',
    code: 'ME-01',
    type: 'expressway',
    path: 'M148,282 C168,260 182,238 195,225 C230,238 275,236 325,230 C350,232 365,234 375,236 C410,230 432,224 450,222 C495,200 520,185 542,172 C565,158 580,148 595,142',
  },
  {
    id: 'mumbai-pune-exp',
    name: 'Yashwantrao Chavan Mumbai-Pune Expressway (94 km)',
    nameMr: 'यशवंतराव चव्हाण मुंबई-पुणे द्रुतगती महामार्ग',
    code: 'ME-02',
    type: 'expressway',
    path: 'M130,310 C140,314 150,320 165,335 C180,350 195,360 210,365',
  },
  {
    id: 'atal-setu-mthl',
    name: 'Shri Atal Bihari Vajpayee Trans Harbour Link (Atal Setu MTHL 21.8 km)',
    nameMr: 'अटल सेतू मुंबई ट्रान्स हार्बर लिंक (MTHL)',
    code: 'MTHL',
    type: 'expressway',
    path: 'M129,313 Q136,315 142,316',
  },
  {
    id: 'nh-48-pune-bengaluru',
    name: 'NH-48 Golden Quadrilateral (Pune - Satara - Kolhapur)',
    nameMr: 'राष्ट्रीय महामार्ग ४८ (पुणे - सातारा - कोल्हापूर)',
    code: 'NH-48',
    type: 'national_highway',
    path: 'M210,365 C205,395 200,420 195,440 C192,475 190,505 185,535',
  },
  {
    id: 'nh-53-east-west',
    name: 'NH-53 Surat-Kolkata Corridor (Dhule - Jalgaon - Akola - Amravati - Nagpur - Bhandara)',
    nameMr: 'राष्ट्रीय महामार्ग ५३ (धुळे - जळगाव - अकोला - अमरावती - नागपूर)',
    code: 'NH-53',
    type: 'national_highway',
    path: 'M225,135 C270,130 300,126 320,125 C375,148 410,165 435,175 C465,155 480,142 495,135 C540,138 570,140 595,140 C625,140 640,140 650,140 C675,138 690,136 700,135',
  },
  {
    id: 'nh-60-pune-nashik',
    name: 'NH-60 Pune-Nashik Industrial Highway',
    nameMr: 'राष्ट्रीय महामार्ग ६० (पुणे - नाशिक महामार्ग)',
    code: 'NH-60',
    type: 'national_highway',
    path: 'M210,365 C215,315 218,270 205,242 C200,234 198,229 195,225',
  },
  {
    id: 'nh-66-mumbai-goa',
    name: 'NH-66 Mumbai-Goa Konkan Coastal Highway',
    nameMr: 'राष्ट्रीय महामार्ग ६६ (मुंबई-गोवा कोकण महामार्ग)',
    code: 'NH-66',
    type: 'national_highway',
    path: 'M145,315 C142,350 142,390 144,435 C145,460 146,475 146,505 C148,535 152,560 155,580',
  },
  {
    id: 'nh-65-pune-solapur',
    name: 'NH-65 Pune-Solapur-Hyderabad Highway',
    nameMr: 'राष्ट्रीय महामार्ग ६५ (पुणे - सोलापूर महामार्ग)',
    code: 'NH-65',
    type: 'national_highway',
    path: 'M210,365 C250,385 285,410 305,425 C320,438 330,445 335,450',
  },
  {
    id: 'nh-52-solapur-dhule',
    name: 'NH-52 Solapur - Beed - Sambhajinagar - Dhule Corridor',
    nameMr: 'राष्ट्रीय महामार्ग ५२ (सोलापूर - बीड - संभाजीनगर - धुळे)',
    code: 'NH-52',
    type: 'national_highway',
    path: 'M335,450 C350,405 352,360 350,320 C340,275 330,250 325,230 C280,185 250,155 225,135',
  },
];

/* -------------------------------------------------------------------------- */
/* Major Geographic River Corridors across Maharashtra                       */
/* -------------------------------------------------------------------------- */

export const MAJOR_RIVERS: RiverFeature[] = [
  {
    id: 'godavari',
    name: 'Godavari River (दक्षिण गंगा)',
    nameMr: 'गोदावरी नदी',
    path: 'M185,225 C200,226 235,235 270,245 C305,252 340,255 385,260 C430,275 460,290 475,310 C515,335 550,350 580,365',
  },
  {
    id: 'krishna',
    name: 'Krishna River',
    nameMr: 'कृष्णा नदी',
    path: 'M175,420 C182,445 190,475 205,505 C215,518 225,522 230,510 C240,500 248,525 255,535',
  },
  {
    id: 'bhima',
    name: 'Bhima River (चंद्रभागा)',
    nameMr: 'भीमा नदी',
    path: 'M180,320 C200,345 225,365 250,385 C275,410 295,430 305,440 C320,455 335,475 342,488',
  },
  {
    id: 'tapi',
    name: 'Tapi River (तापी खोरे)',
    nameMr: 'तापी नदी',
    path: 'M345,118 C325,120 280,118 245,115 C215,112 185,108 175,105',
  },
  {
    id: 'wainganga',
    name: 'Wainganga River',
    nameMr: 'वैनगंगा नदी',
    path: 'M650,115 C650,140 655,185 645,225 C635,255 625,285 615,310',
  },
  {
    id: 'wardha-river',
    name: 'Wardha River',
    nameMr: 'वर्धा नदी',
    path: 'M530,120 C540,150 550,180 565,220 C580,250 595,275 605,310',
  },
];

/* -------------------------------------------------------------------------- */
/* Realistic Arabian Sea Bathymetry & Coastal Shelf Contours                 */
/* -------------------------------------------------------------------------- */

export const COASTAL_BATHYMETRY_PATHS = [
  // 10m coastal shallow shelf
  'M122,145 Q125,220 120,290 Q118,340 124,420 Q127,480 135,550 Q138,590 142,610',
  // 50m offshore contour
  'M105,145 Q108,220 102,290 Q100,340 106,420 Q110,480 118,550 Q122,590 126,610',
  // 100m continental slope
  'M85,145 Q88,220 82,290 Q80,340 86,420 Q90,480 98,550 Q102,590 106,610',
];

/* -------------------------------------------------------------------------- */
/* Key Municipal Corporations, Taluka Hubs & Industrial Centers               */
/* -------------------------------------------------------------------------- */

export const KEY_TOWNS: KeyTown[] = [
  // Metro Centers
  { id: 'mumbai-metro', name: 'Mumbai Metropolis', nameMr: 'मुंबई महानगर', districtId: 'mumbai-city', x: 128, y: 310, importance: 'metro' },
  { id: 'pune-metro', name: 'Pune Metropolis', nameMr: 'पुणे महानगर', districtId: 'pune', x: 210, y: 365, importance: 'metro' },
  { id: 'nagpur-metro', name: 'Nagpur Metropolis', nameMr: 'नागपूर महानगर', districtId: 'nagpur', x: 595, y: 140, importance: 'metro' },
  { id: 'nashik-city', name: 'Nashik', nameMr: 'नाशिक', districtId: 'nashik', x: 195, y: 225, importance: 'metro' },
  { id: 'csn-city', name: 'Chhatrapati Sambhajinagar', nameMr: 'छत्रपती संभाजीनगर', districtId: 'chhatrapati-sambhajinagar', x: 325, y: 230, importance: 'metro' },

  // Konkan
  { id: 'navi-mumbai', name: 'Navi Mumbai', nameMr: 'नवी मुंबई', districtId: 'thane', x: 142, y: 312, importance: 'major' },
  { id: 'kalyan', name: 'Kalyan-Dombivli', nameMr: 'कल्याण-डोंबिवली', districtId: 'thane', x: 147, y: 298, importance: 'major' },
  { id: 'vasai', name: 'Vasai-Virar', nameMr: 'वसई-विरार', districtId: 'palghar', x: 135, y: 275, importance: 'major' },
  { id: 'panvel', name: 'Panvel', nameMr: 'पनवेल', districtId: 'raigad', x: 148, y: 320, importance: 'major' },
  { id: 'alibag', name: 'Alibag', nameMr: 'अलिबाग', districtId: 'raigad', x: 134, y: 338, importance: 'taluka' },
  { id: 'chiplun', name: 'Chiplun', nameMr: 'चिपळूण', districtId: 'ratnagiri', x: 146, y: 435, importance: 'taluka' },
  { id: 'kankavli', name: 'Kankavli', nameMr: 'कणकवली', districtId: 'sindhudurg', x: 154, y: 550, importance: 'taluka' },
  { id: 'sawantwadi', name: 'Sawantwadi', nameMr: 'सावंतवाडी', districtId: 'sindhudurg', x: 155, y: 580, importance: 'taluka' },

  // Pune Division
  { id: 'pimpri', name: 'Pimpri-Chinchwad', nameMr: 'पिंपरी-चिंचवड', districtId: 'pune', x: 202, y: 358, importance: 'major' },
  { id: 'baramati', name: 'Baramati', nameMr: 'बारामती', districtId: 'pune', x: 242, y: 395, importance: 'major' },
  { id: 'karad', name: 'Karad', nameMr: 'कराड', districtId: 'satara', x: 190, y: 475, importance: 'taluka' },
  { id: 'wai', name: 'Wai', nameMr: 'वाई', districtId: 'satara', x: 185, y: 425, importance: 'taluka' },
  { id: 'ichalkaranji', name: 'Ichalkaranji', nameMr: 'इचलकरंजी', districtId: 'kolhapur', x: 198, y: 540, importance: 'major' },
  { id: 'miraj', name: 'Miraj', nameMr: 'मिरज', districtId: 'sangli', x: 225, y: 518, importance: 'major' },
  { id: 'pandharpur', name: 'Pandharpur', nameMr: 'पंढरपूर', districtId: 'solapur', x: 305, y: 440, importance: 'major' },

  // Nashik Division
  { id: 'malegaon', name: 'Malegaon', nameMr: 'मालेगाव', districtId: 'nashik', x: 235, y: 185, importance: 'major' },
  { id: 'shirdi', name: 'Shirdi', nameMr: 'शिर्डी', districtId: 'ahilyanagar', x: 235, y: 245, importance: 'major' },
  { id: 'sangamner', name: 'Sangamner', nameMr: 'संगमनेर', districtId: 'ahilyanagar', x: 215, y: 260, importance: 'taluka' },
  { id: 'bhusawal', name: 'Bhusawal', nameMr: 'भुसावळ', districtId: 'jalgaon', x: 335, y: 122, importance: 'major' },
  { id: 'shirpur', name: 'Shirpur', nameMr: 'शिरपूर', districtId: 'dhule', x: 230, y: 110, importance: 'taluka' },

  // Chhatrapati Sambhajinagar Division
  { id: 'paithan', name: 'Paithan', nameMr: 'पैठण', districtId: 'chhatrapati-sambhajinagar', x: 320, y: 255, importance: 'taluka' },
  { id: 'parli', name: 'Parli Vaijnath', nameMr: 'परळी वैजनाथ', districtId: 'beed', x: 385, y: 335, importance: 'taluka' },
  { id: 'tuljapur', name: 'Tuljapur', nameMr: 'तुळजापूर', districtId: 'dharashiv', x: 365, y: 420, importance: 'taluka' },
  { id: 'udgir', name: 'Udgir', nameMr: 'उदगीर', districtId: 'latur', x: 440, y: 375, importance: 'taluka' },
  { id: 'degloor', name: 'Degloor', nameMr: 'देगलूर', districtId: 'nanded', x: 485, y: 395, importance: 'taluka' },

  // Amravati Division
  { id: 'achalpur', name: 'Achalpur', nameMr: 'अचलपूर', districtId: 'amravati', x: 495, y: 115, importance: 'taluka' },
  { id: 'khamgaon', name: 'Khamgaon', nameMr: 'खामगाव', districtId: 'buldhana', x: 410, y: 165, importance: 'taluka' },
  { id: 'karanja', name: 'Karanja Lad', nameMr: 'कारंजा लाड', districtId: 'washim', x: 465, y: 195, importance: 'taluka' },
  { id: 'pusad', name: 'Pusad', nameMr: 'पुसद', districtId: 'yavatmal', x: 495, y: 245, importance: 'taluka' },

  // Nagpur Division
  { id: 'hinganghat', name: 'Hinganghat', nameMr: 'हिंगणघाट', districtId: 'wardha', x: 550, y: 195, importance: 'taluka' },
  { id: 'ballarpur', name: 'Ballarpur', nameMr: 'बल्लारपूर', districtId: 'chandrapur', x: 615, y: 258, importance: 'major' },
  { id: 'kamthi', name: 'Kamptee', nameMr: 'कामठी', districtId: 'nagpur', x: 605, y: 135, importance: 'taluka' },
  { id: 'tumser', name: 'Tumsar', nameMr: 'तुमसर', districtId: 'bhandara', x: 655, y: 125, importance: 'taluka' },
  { id: 'tiroda', name: 'Tiroda', nameMr: 'तिरोडा', districtId: 'gondia', x: 685, y: 125, importance: 'taluka' },
  { id: 'ahiri', name: 'Aheri', nameMr: 'अहेरी', districtId: 'gadchiroli', x: 645, y: 310, importance: 'taluka' },
];

/* -------------------------------------------------------------------------- */
/* Strategic Government Facilities & Cultural Heritage Landmarks              */
/* -------------------------------------------------------------------------- */

export const STATE_LANDMARKS: StateLandmark[] = [
  { id: 'mantralaya', name: 'Mantralaya (State Secretariat)', nameMr: 'मंत्रालय (महाराष्ट्र शासन)', category: 'government', x: 126, y: 312 },
  { id: 'gateway', name: 'Gateway of India', nameMr: 'गेटवे ऑफ इंडिया', category: 'heritage', x: 127, y: 314 },
  { id: 'jnpt', name: 'JNPT Port (Nhava Sheva)', nameMr: 'जवाहरलाल नेहरू बंदर (जेएनपीटी)', category: 'port', x: 142, y: 318 },
  { id: 'csmai', name: 'CSMIA International Airport', nameMr: 'छत्रपती शिवाजी महाराज आंतरराष्ट्रीय विमानतळ', category: 'transit', x: 132, y: 300 },
  { id: 'nagpur-ai', name: 'Dr. Babasaheb Ambedkar Airport NAG', nameMr: 'डॉ. बाबासाहेब आंबेडकर आंतरराष्ट्रीय विमानतळ', category: 'transit', x: 590, y: 148 },
  { id: 'shirdi-temple', name: 'Shirdi Saibaba Sansthan', nameMr: 'श्री साईबाबा संस्थान शिर्डी', category: 'heritage', x: 235, y: 245 },
  { id: 'trimbakeshwar', name: 'Trimbakeshwar Jyotirlinga', nameMr: 'त्र्यंबकेश्वर ज्योतिर्लिंग', category: 'heritage', x: 185, y: 228 },
  { id: 'ajanta', name: 'Ajanta Caves (UNESCO World Heritage)', nameMr: 'अजिंठा लेणी (युनेस्को जागतिक वारसा)', category: 'heritage', x: 350, y: 180 },
  { id: 'ellora', name: 'Ellora Caves (Kailasa Temple)', nameMr: 'वेरूळ लेणी (कैलास मंदिर)', category: 'heritage', x: 315, y: 220 },
  { id: 'tadoba', name: 'Tadoba-Andhari National Park', nameMr: 'ताडोबा-अंधारी व्याघ्र प्रकल्प', category: 'heritage', x: 620, y: 235 },
];

/* -------------------------------------------------------------------------- */
/* Professional GIS Lat/Long Graticule Grid Lines                             */
/* -------------------------------------------------------------------------- */

export const GIS_GRATICULE_GRID: GISGridLine[] = [
  // Parallels of Latitude
  { label: '22°N', x1: 100, y1: 85, x2: 730, y2: 85, type: 'lat' },
  { label: '20°N', x1: 100, y1: 220, x2: 730, y2: 220, type: 'lat' },
  { label: '18°N', x1: 100, y1: 395, x2: 730, y2: 395, type: 'lat' },
  { label: '16°N', x1: 100, y1: 565, x2: 730, y2: 565, type: 'lat' },

  // Meridians of Longitude
  { label: '73°E', x1: 130, y1: 60, x2: 130, y2: 630, type: 'lng' },
  { label: '75°E', x1: 280, y1: 60, x2: 280, y2: 630, type: 'lng' },
  { label: '77°E', x1: 440, y1: 60, x2: 440, y2: 630, type: 'lng' },
  { label: '79°E', x1: 600, y1: 60, x2: 600, y2: 630, type: 'lng' },
];
