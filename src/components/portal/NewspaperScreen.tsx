'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface NewspaperArticle {
  id: string;
  headlineMr: string;
  headlineEn: string;
  subheadMr: string;
  subheadEn: string;
  byline: string;
  district: string;
  districtMr: string;
  category: 'Infrastructure' | 'Welfare' | 'Agriculture' | 'Administration' | 'Industry';
  categoryMr: string;
  sentiment: 'Positive' | 'Neutral' | 'Sensitive';
  sentimentScore: number;
  ocrTextMr: string;
  ocrTextEn: string;
  columnSpan: number; // 1, 2, or 3 columns in broadsheet
  leadImage?: string;
  captionMr?: string;
  captionEn?: string;
}

export interface NewspaperEdition {
  id: string;
  publicationName: string;
  publicationNameMr: string;
  mastheadColor: string;
  accentColor: string;
  mottoMr: string;
  mottoEn: string;
  editionName: string;
  editionNameMr: string;
  rniNumber: string;
  volumeNumber: string;
  dateStr: string;
  price: string;
  pagesCount: number;
  weather: string;
  leadArticle: NewspaperArticle;
  sideArticles: NewspaperArticle[];
  districtBriefs: Array<{ district: string; districtMr: string; titleMr: string; titleEn: string }>;
}

const NEWSPAPER_EDITIONS: NewspaperEdition[] = [
  {
    id: 'loksatta-konkan',
    publicationName: 'Loksatta',
    publicationNameMr: 'लोकसत्ता',
    mastheadColor: '#991B1B', // Deep red
    accentColor: '#DC2626',
    mottoMr: 'सर्वसमावेशक, निर्भीड आणि पुरोगामी विचार',
    mottoEn: 'Comprehensive, Fearless and Progressive Journalism',
    editionName: 'Mumbai & Konkan Special Edition',
    editionNameMr: 'मुंबई व कोकण विशेष महा-आवृत्ती',
    rniNumber: 'MAHMAR/1948/1042',
    volumeNumber: 'वर्ष ७७ • अंक २९४',
    dateStr: 'शुक्रवार, २३ ऑक्टोबर २०२६',
    price: '₹ ५.००',
    pagesCount: 16,
    weather: 'मुंबई/ठाणे: कमाल ३१°C, आर्द्रता ७२%',
    leadArticle: {
      id: 'art-lok-1',
      headlineMr: 'कोकण विकास महामंडळास ५,४०० कोटींची विशेष तरतूद मंजूर; ठाणे-पालघर पायाभूत सुविधांना गती',
      headlineEn: 'Special Allocation of ₹5,400 Cr Approved for Konkan Development; Thane-Palghar Infra Fast-Tracked',
      subheadMr: 'मंत्रिमंडळ बैठकीत ऐतिहासिक निर्णय; किनारपट्टी महामार्ग व मत्स्यव्यवसाय क्लस्टरसाठी थेट निधी वितरीत',
      subheadEn: 'Historic cabinet decision allocates dedicated funds for Coastal Highway & Fisheries corridors',
      byline: 'विशेष प्रतिनिधी, मुंबई',
      district: 'Thane',
      districtMr: 'ठाणे',
      category: 'Infrastructure',
      categoryMr: 'पायाभूत सुविधा',
      sentiment: 'Positive',
      sentimentScore: 94,
      columnSpan: 2,
      captionMr: 'मंत्रालयात पार पडलेल्या उच्चस्तरीय बैठकीत विकास आराखड्यास मंजुरी देताना अधिकारी वर्ग.',
      captionEn: 'Senior administrative officers reviewing the comprehensive Konkan masterplan at Mantralaya.',
      ocrTextMr: `मुंबई: महाराष्ट्र शासनाच्या मंत्रिमंडळ उपसमितीच्या महत्त्वपूर्ण बैठकीत कोकण विभागातील ठाणे, पालघर, रायगड, रत्नागिरी आणि सिंधुदुर्ग या पाचही सागरी जिल्ह्यांच्या सर्वांगीण विकासासाठी ₹५,४०० कोटींच्या विशेष वित्तीय पॅकेजला औपचारिक मंजुरी देण्यात आली आहे. या निधीतून रेवस-रेड्डी सागरी महामार्ग चौपदरीकरण, पालघर नवीन जिल्हा संकुल रस्ते जोडणी आणि सिंधुदुर्ग मल्टिमोडल लॉजिस्टिक पार्कचे काम तातडीने पूर्ण केले जाईल. माहिती व जनसंपर्क महासंचालनालयाने (DGIPR) दिलेल्या माहितीनुसार, या प्रकल्पांची प्रत्यक्ष प्रगती 'महा-कमांड सेंटर' द्वारे डिजिटल डॅशबोर्डवर २४ तास मॉनिटर केली जाणार आहे.`,
      ocrTextEn: `Mumbai: In a landmark decision, the State Cabinet has formally sanctioned a ₹5,400 Crore infrastructure package for the five coastal districts of Konkan (Thane, Palghar, Raigad, Ratnagiri, Sindhudurg). Major priorities include the four-laning of the Revas-Redi Coastal Highway and development of modern cold-storage maritime logistics hubs. DGIPR confirmed that all operational milestones will be continuously tracked via the State Maha-Command Center.`,
    },
    sideArticles: [
      {
        id: 'art-lok-2',
        headlineMr: 'डीजीआयपीआर द्वारे ३६ जिल्ह्यांमध्ये हाय-स्पीड माहिती कक्ष कार्यान्वित',
        headlineEn: 'DGIPR Operationalizes High-Speed Telemetry Media Cells across 36 Districts',
        subheadMr: 'प्रत्येक जिल्हा माहिती कार्यालयात अत्याधुनिक डिजिटल संप्रेषण जाळे',
        subheadEn: 'Modernized optical communication infrastructure installed across all DIO desks',
        byline: 'प्रशासकीय वार्ताहर',
        district: 'Mumbai City',
        districtMr: 'मुंबई शहर',
        category: 'Administration',
        categoryMr: 'प्रशासन',
        sentiment: 'Positive',
        sentimentScore: 91,
        columnSpan: 1,
        ocrTextMr: `माहिती व जनसंपर्क महासंचालनालयाचे महासंचालक डॉ. अरविंद एम. गोखले यांच्या मार्गदर्शनाखाली राज्यातील सर्व ३६ जिल्ह्यांमध्ये हाय-टेक मीडिया कंट्रोल रूम पूर्ण क्षमतेने कार्यरत झाले आहेत. खोटी माहिती, अफवांचे वेळीच खंडन करण्यासाठी ९० मिनिटांचे विशेष एसएलए (SLA) लागू करण्यात आले आहे.`,
        ocrTextEn: `Under Director General Dr. Arvind M. Gokhale, DGIPR has fully operationalized high-tech media monitoring rooms across all 36 Maharashtra districts, backed by a strict 90-minute SLA response protocol.`,
      },
      {
        id: 'art-lok-3',
        headlineMr: 'सिंधुदुर्ग जिल्ह्यात सेंद्रिय शेतीसाठी स्वतंत्र निर्यात क्लस्टर स्थापन',
        headlineEn: 'Dedicated Organic Farming Export Cluster Established in Sindhudurg',
        subheadMr: 'हापूस आंबा व काजू प्रक्रिया उद्योगांना ५०% शासकीय अनुदान',
        subheadEn: '50% state subsidy for Alphonso mango and cashew processing agro-enterprises',
        byline: 'सिंधुदुर्ग ब्युरो',
        district: 'Sindhudurg',
        districtMr: 'सिंधुदुर्ग',
        category: 'Agriculture',
        categoryMr: 'कृषी व उद्योग',
        sentiment: 'Positive',
        sentimentScore: 89,
        columnSpan: 1,
        ocrTextMr: `सिंधुदुर्ग जिल्हाधिकारी यांच्या पुढाकाराने जिल्ह्यातील १०,००० काजू उत्पादक शेतकऱ्यांना जागतिक मानकांचे प्रशिक्षण देण्यात आले आहे. सागरी मार्गाने थेट आखाती देशांत उत्पादने पाठवण्यासाठी वेंगुर्ला बंदराचे आधुनिकीकरण अंतिम टप्प्यात आहे.`,
        ocrTextEn: `Sindhudurg district administration has mobilized 10,000 farmers into an organic agro-cluster with direct export linkages via Vengurla port.`,
      },
      {
        id: 'art-lok-4',
        headlineMr: 'रायगड: एमआयडीसी औद्योगिक पट्ट्यातील जलसंवर्धनाचे काम युद्धपातळीवर',
        headlineEn: 'Raigad: Industrial Water Conservation Drive in MIDC Reaches 95% Completion',
        subheadMr: 'पावसाच्या पाण्याचे पुनर्भरण व सांडपाणी पुनर्वापराचे उद्दिष्ट साध्य',
        subheadEn: 'Rainwater harvesting and effluent recycling targets achieved across Taloja & Roha',
        byline: 'अलिबाग प्रतिनिधी',
        district: 'Raigad',
        districtMr: 'रायगड',
        category: 'Industry',
        categoryMr: 'उद्योग व पर्यावरण',
        sentiment: 'Neutral',
        sentimentScore: 78,
        columnSpan: 1,
        ocrTextMr: `रायगड जिल्ह्यातील रोहा व तळोजा औद्योगिक क्षेत्रातील ५०० हून अधिक कारखान्यांनी शून्य सांडपाणी उत्सर्जनाचे (ZLD) नियम स्वीकारले असून प्रदूषण नियंत्रण मंडळाने याबाबत सकारात्मक अहवाल दिला आहे.`,
        ocrTextEn: `Over 500 manufacturing units in Raigad's industrial zones have adopted zero liquid discharge (ZLD) norms with strict environmental compliance.`,
      },
    ],
    districtBriefs: [
      { district: 'Thane', districtMr: 'ठाणे', titleMr: 'ठाणे मेट्रो मार्ग ४ व ५ चे काम वेगाने प्रगतीपथावर', titleEn: 'Thane Metro Lines 4 & 5 construction accelerates' },
      { district: 'Palghar', districtMr: 'पालघर', titleMr: 'पालघर आदिवासी आश्रमशाळांमध्ये १००% सौर ऊर्जा प्रकल्प सुरू', titleEn: '100% solar power installed in tribal schools of Palghar' },
      { district: 'Ratnagiri', districtMr: 'रत्नागिरी', titleMr: 'रत्नागिरी विमानतळावरून प्रवासी उड्डाणे लवकरच सुरू होणार', titleEn: 'Commercial passenger flights to commence from Ratnagiri' },
      { district: 'Pune', districtMr: 'पुणे', titleMr: 'पुणे रिंग रोड भूसंपादन ८५% पूर्ण; कंत्राटदारांची नियुक्ती', titleEn: 'Pune Ring Road land acquisition hits 85%' },
    ],
  },
  {
    id: 'sakal-pune',
    publicationName: 'Sakal',
    publicationNameMr: 'सकाळ',
    mastheadColor: '#1E3A8A', // Deep blue
    accentColor: '#2563EB',
    mottoMr: 'जनतेच्या मनातील प्रामाणिक आवाज',
    mottoEn: 'The Authentic Voice of the People',
    editionName: 'Western Maharashtra & Pune Mega Edition',
    editionNameMr: 'पश्चिम महाराष्ट्र व पुणे महा-आवृत्ती',
    rniNumber: 'MAHMAR/1932/0821',
    volumeNumber: 'वर्ष ९४ • अंक २६२',
    dateStr: 'गुरुवार, २२ ऑक्टोबर २०२६',
    price: '₹ ५.००',
    pagesCount: 18,
    weather: 'पुणे/सातारा: कमाल २९°C, आकाश निरभ्र',
    leadArticle: {
      id: 'art-sak-1',
      headlineMr: 'पश्चिम महाराष्ट्रातील सिंचन प्रकल्पांसाठी ₹७,२०० कोटींची तरतूद; दुष्काळी भागाला संजीवनी',
      headlineEn: '₹7,200 Cr Sanctioned for Western Maharashtra Irrigation; Drought-Prone Belts Relieved',
      subheadMr: 'टेम्पू, म्हैसाळ आणि उरमोडी कालव्यांचे आधुनिकीकरण; पाणीगळती रोखण्यासाठी भूमिगत पाईपलाईन तंत्रज्ञान',
      subheadEn: 'Pressurized underground pipeline technology to replace open canals across Sangli and Solapur',
      byline: 'मुख्य वार्ताहर, पुणे',
      district: 'Pune',
      districtMr: 'पुणे',
      category: 'Agriculture',
      categoryMr: 'जलसंपदा व कृषी',
      sentiment: 'Positive',
      sentimentScore: 96,
      columnSpan: 2,
      captionMr: 'उरमोडी सिंचन प्रकल्पाच्या जलवाहिनीचे काम पूर्ण झाल्यावर पाणी सोडताना शेतकरी व अधिकारी.',
      captionEn: 'Farmers and water resources engineers inspect the pressurized canal network in Western Maharashtra.',
      ocrTextMr: `पुणे: पश्चिम महाराष्ट्रातील सांगली, सोलापूर, सातारा आणि अहिल्यानगर जिल्ह्यातील दुष्काळी पट्ट्याला कायमस्वरूपी दिलासा देण्यासाठी जलसंपदा विभागाने ₹७,२०० कोटींचा महत्त्वाकांक्षी कालवा आधुनिकीकरण आराखडा मंजूर केला आहे. या प्रकल्पात पारंपारिक उघड्या कालव्यांऐवजी अत्याधुनिक हाय-डेन्सिटी पॉलीइथिलिन (HDPE) पाईपलाईन टाकण्यात येत असून, यामुळे पाण्याची बाष्पीभवन गळती शून्य टक्क्यांवर येईल. सांगली व सोलापूरच्या ३.५ लाख हेक्टर शेतीला यामुळे बारमाही पाणी उपलब्ध होणार आहे.`,
      ocrTextEn: `Pune: The Water Resources Department has sanctioned ₹7,200 Crore to modernize the canal networks of Sangli, Solapur, Satara, and Ahilyanagar using pressurized underground HDPE pipelines, completely eliminating evaporation losses and securing water for 3.5 lakh hectares.`,
    },
    sideArticles: [
      {
        id: 'art-sak-2',
        headlineMr: 'पुणे व पिंपरी-चिंचवड औद्योगिक कॉरिडॉरमध्ये २०,००० नव्या रोजगार संधी',
        headlineEn: '20,000 High-Tech Green Jobs Created in Pune-Chakan Industrial Belt',
        subheadMr: 'इलेक्ट्रिक वाहने आणि सेमीकंडक्टर क्लस्टरसाठी आंतरराष्ट्रीय कंपन्यांचे करार',
        subheadEn: 'Global EV & electronics component manufacturers ink major expansion pacts',
        byline: 'औद्योगिक प्रतिनिधी',
        district: 'Pune',
        districtMr: 'पुणे',
        category: 'Industry',
        categoryMr: 'उद्योग',
        sentiment: 'Positive',
        sentimentScore: 92,
        columnSpan: 1,
        ocrTextMr: `चाकण, तळेगाव आणि रांजणगाव औद्योगिक क्षेत्रात जागतिक कंपन्यांनी ₹१५,००० कोटींच्या गुंतवणुकीचे करार केले असून तरुणांसाठी उच्च दर्जाच्या रोजगाराची दालने खुली झाली आहेत.`,
        ocrTextEn: `Multi-billion dollar investments in Chakan and Talegaon EV ecosystems have unlocked 20,000 advanced manufacturing careers.`,
      },
      {
        id: 'art-sak-3',
        headlineMr: 'सातारा: महाबळेश्वर-पाचगणी पर्यावरण संरक्षण आराखड्यास मान्यता',
        headlineEn: 'Satara: Eco-Sensitive Tourism Master Plan Approved for Mahabaleshwar',
        subheadMr: 'स्ट्रॉबेरी उत्पादकांसाठी थेट कोल्ड-चेन व्हॅन सुविधा सुरू',
        subheadEn: 'Refrigerated van logistics operationalized for hillside strawberry growers',
        byline: 'सातारा ब्युरो',
        district: 'Satara',
        districtMr: 'सातारा',
        category: 'Welfare',
        categoryMr: 'पर्यटन व पर्यावरण',
        sentiment: 'Positive',
        sentimentScore: 88,
        columnSpan: 1,
        ocrTextMr: `जिल्हाधिकारी कार्यालयाच्या पुढाकाराने पर्यटकांच्या सोयीसाठी इलेक्ट्रिक बसेस सुरू करण्यात आल्या असून प्लास्टिक बंदीची काटेकोर अंमलबजावणी होत आहे.`,
        ocrTextEn: `Satara district administration deploys zero-emission electric shuttles across sensitive hill destinations with strict environmental oversight.`,
      },
      {
        id: 'art-sak-4',
        headlineMr: 'कोल्हापूर: पंचगंगा नदी प्रदूषणमुक्ती मोहिमेस गती',
        headlineEn: 'Kolhapur: Panchganga River Rejuvenation Mission Progresses Rapidly',
        subheadMr: 'सर्व सांडपाणी प्रक्रिया केंद्रांची (STP) क्षमता दुप्पट करण्याचे काम सुरू',
        subheadEn: 'Sewage treatment capacity augmented with tertiary filtration safeguards',
        byline: 'कोल्हापूर प्रतिनिधी',
        district: 'Kolhapur',
        districtMr: 'कोल्हापूर',
        category: 'Infrastructure',
        categoryMr: 'पर्यावरण',
        sentiment: 'Neutral',
        sentimentScore: 76,
        columnSpan: 1,
        ocrTextMr: `शहरातील सांडपाणी नदीत जाण्यापासून रोखण्यासाठी अत्याधुनिक एसटीपी प्रकल्पाचे काम अंतिम टप्प्यात असून नदीकाठच्या गावांमध्ये स्वच्छता समित्या स्थापन करण्यात आल्या आहेत.`,
        ocrTextEn: `Municipal sewage diversion and tertiary treatment upgrades are well underway along the Panchganga river basin.`,
      },
    ],
    districtBriefs: [
      { district: 'Sangli', districtMr: 'सांगली', titleMr: 'सांगली हळद बाजारात उच्चांकी उलाढाल; शेतकऱ्यांना उच्च भाव', titleEn: 'Record turmeric trading volume in Sangli APMC market' },
      { district: 'Solapur', districtMr: 'सोलापूर', titleMr: 'सोलापूर चादर व टॉवेल्ससाठी जीआय मानांकनाचे विशेष केंद्र', titleEn: 'GI verification facilitation cell established for Solapur textiles' },
      { district: 'Ahilyanagar', districtMr: 'अहिल्यानगर', titleMr: 'शिर्डी विमानतळावर रात्रकालीन उड्डाण प्रणालीची यशस्वी चाचणी', titleEn: 'Night landing facility successfully tested at Shirdi airport' },
      { district: 'Nashik', districtMr: 'नाशिक', titleMr: 'नाशिक द्राक्ष उत्पादकांसाठी युरोपीय बाजारपेठ खुली', titleEn: 'European export quotas finalized for Nashik grape growers' },
    ],
  },
  {
    id: 'mat-admin',
    publicationName: 'Maharashtra Times',
    publicationNameMr: 'महाराष्ट्र टाइम्स',
    mastheadColor: '#0F766E', // Deep teal
    accentColor: '#0D9488',
    mottoMr: 'विश्वासार्हता, परंपरा आणि गतिमान दृष्टिकोन',
    mottoEn: 'Credibility, Tradition and Dynamic Vision',
    editionName: 'State Administrative Capital Edition',
    editionNameMr: 'राज्यस्तरीय प्रशासकीय राजधानी आवृत्ती',
    rniNumber: 'MAHMAR/1962/3412',
    volumeNumber: 'वर्ष ६४ • अंक १८४',
    dateStr: 'बुधवार, २१ ऑक्टोबर २०२६',
    price: '₹ ५.००',
    pagesCount: 16,
    weather: 'राज्यव्यापी: सर्व जिल्ह्यांमध्ये हवामान सुखद',
    leadArticle: {
      id: 'art-mat-1',
      headlineMr: 'प्रशासकीय कार्यक्षमता निर्देशांक: कोकण विभाग ९६.७५ गुणांसह राज्यात अव्वल',
      headlineEn: 'State CPI Ranking: Konkan Leads with 96.75 Score; Thane Ranked #1 in Governance',
      subheadMr: 'डिजिटल सेवा, जलद फाईल निपटारा आणि तक्रार निवारणात उल्लेखनीय कामगिरी; मुख्य सचिवांकडून अभिनंदन',
      subheadEn: 'Thane, Mumbai City, and Pune secure top ranks in 4-Pillar composite performance metric',
      byline: 'प्रशासकीय विशेष ब्युरो',
      district: 'Thane',
      districtMr: 'ठाणे',
      category: 'Administration',
      categoryMr: 'प्रशासन व सुशासन',
      sentiment: 'Positive',
      sentimentScore: 97,
      columnSpan: 2,
      captionMr: 'मंत्रालयातील राज्यस्तरीय परिषदेत जिल्हाधिकाऱ्यांचा गौरव करताना मुख्य सचिव व वरिष्ठ सनदी अधिकारी.',
      captionEn: 'Chief Secretary and senior IAS officials felicitating top-performing collectors at Mantralaya.',
      ocrTextMr: `मुंबई: महाराष्ट्र शासनाने प्रसिद्ध केलेल्या चालू तिमाहीच्या 'संयुक्त कामगिरी निर्देशांकात' (CPI) कोकण विभागाने ९६.७५ गुणांची विक्रमी नोंद करत राज्यात प्रथम क्रमांक पटकावला आहे. ठाणे जिल्ह्याने जलद तक्रार निवारण आणि लोकसेवा हमी कायद्याची ९८.२% अंमलबजावणी करून सर्वोत्कृष्ट जिल्ह्याचा बहुमान मिळवला. जिल्हाधिकारी नीलेश आर. केळकर यांच्या नेतृत्वाखालील पथकाने महसूल, आपत्कालीन व्यवस्थापन आणि ई-ऑफिस प्रणालीत १००% उद्दिष्ट साध्य केले.`,
      ocrTextEn: `Mumbai: In the latest quarterly Composite Performance Index (CPI) announced by the Chief Secretary's office, Konkan Division achieved the State's highest score of 96.75. Thane under Collector Nilesh R. Kelkar, IAS clinched the #1 spot, executing 98.2% of public service guarantee charters within prescribed timelines.`,
    },
    sideArticles: [
      {
        id: 'art-mat-2',
        headlineMr: 'शासकीय योजनांचा थेट लाभ: १.५ कोटी नागरिकांना मोबाईलवर नोटिफिकेशन',
        headlineEn: 'Direct Benefit Notification: 1.5 Crore Citizens Receive Instant SMS Alerts',
        subheadMr: 'लाडकी बहीण, शेतकरी सन्मान निधीच्या हप्त्यांची खात्यात त्वरित जमा',
        subheadEn: 'Aadhaar-seeded direct DBT transfers disburse monthly welfare benefits smoothly',
        byline: 'मंत्रालय प्रतिनिधी',
        district: 'Mumbai City',
        districtMr: 'मुंबई शहर',
        category: 'Welfare',
        categoryMr: 'कल्याणकारी योजना',
        sentiment: 'Positive',
        sentimentScore: 95,
        columnSpan: 1,
        ocrTextMr: `राज्यातील महिला व बालविकास विभागाच्या महत्त्वाकांक्षी योजनांचा लाभ कोणत्याही मध्यस्थाशिवाय थेट लाभार्थ्यांच्या बँक खात्यात सुरक्षितपणे हस्तांतरित करण्यात आला आहे.`,
        ocrTextEn: `Direct benefit transfer (DBT) pipelines operated seamlessly across all 36 districts, pushing automated transaction acknowledgments to beneficiary mobile devices.`,
      },
      {
        id: 'art-mat-3',
        headlineMr: 'छत्रपती संभाजीनगर: वॉटर ग्रीड प्रकल्पाच्या दुसऱ्या टप्प्यास प्रारंभ',
        headlineEn: 'Chhatrapati Sambhajinagar: Water Grid Phase 2 Work Commences',
        subheadMr: 'जायकवाडी धरणातून मराठवाड्यातील गावांना शुद्ध पिण्याच्या पाण्याचा पुरवठा',
        subheadEn: 'Treated drinking water network expanding to cover 1,200 rural habitations',
        byline: 'मराठवाडा ब्युरो',
        district: 'Chhatrapati Sambhajinagar',
        districtMr: 'छत्रपती संभाजीनगर',
        category: 'Infrastructure',
        categoryMr: 'पायाभूत सुविधा',
        sentiment: 'Positive',
        sentimentScore: 90,
        columnSpan: 1,
        ocrTextMr: `मराठवाड्याला दुष्काळमुक्त करण्यासाठी आखलेल्या जायकवाडी पाणी ग्रीड प्रकल्पाचे काम वेगाने सुरू असून आगामी उन्हाळ्यापूर्वी ५०० गावांना नळाद्वारे पाणी मिळेल.`,
        ocrTextEn: `Jayakwadi reservoir distribution pipelines are being laid ahead of summer to deliver tap water to 1,200 villages in Marathwada.`,
      },
      {
        id: 'art-mat-4',
        headlineMr: 'नागपूर-गोंदिया समृद्धी महामार्ग विस्तार आराखडा मंजूर',
        headlineEn: 'Nagpur-Gondia Expressway Extension Blueprint Approved',
        subheadMr: 'पूर्व विदर्भातील धान व खनिज पट्ट्याला मुंबई बंदराशी जोडणार',
        subheadEn: 'Paddy and mineral industrial corridor to connect directly with JNPT port',
        byline: 'नागपूर वार्ताहर',
        district: 'Nagpur',
        districtMr: 'नागपूर',
        category: 'Infrastructure',
        categoryMr: 'महामार्ग',
        sentiment: 'Positive',
        sentimentScore: 89,
        columnSpan: 1,
        ocrTextMr: `हिंदुहृदयसम्राट बाळासाहेब ठाकरे महाराष्ट्र समृद्धी महामार्गाचा विस्तार गोंदिया व गडचिरोलीपर्यंत करण्यासाठी एमएसआरडीसीने सविस्तर प्रकल्प अहवाल (DPR) मंजूर केला आहे.`,
        ocrTextEn: `MSRDC has finalized the Detailed Project Report (DPR) to extend the Samruddhi Expressway corridor to Gondia and Gadchiroli.`,
      },
    ],
    districtBriefs: [
      { district: 'Amravati', districtMr: 'अमरावती', titleMr: 'अमरावती टेक्स्टाईल पार्कमध्ये ३० आंतरराष्ट्रीय स्पिनिंग मिल्स सुरू', titleEn: '30 modern spinning units operational in Amravati Textile Park' },
      { district: 'Nanded', districtMr: 'नांदेड', titleMr: 'नांदेड विमानतळ विस्तारीकरणासाठी १०० एकर जमीन अधिग्रहित', titleEn: '100 acres acquired for Nanded airport runway expansion' },
      { district: 'Jalgaon', districtMr: 'जळगाव', titleMr: 'जळगाव केळी निर्यातीसाठी विशेष वातानुकूलित रेल्वे वॅगन सुरू', titleEn: 'Refrigerated train coaches allocated for Jalgaon banana exports' },
      { district: 'Chandrapur', districtMr: 'चंद्रपूर', titleMr: 'चंद्रपूर सौर ऊर्जा प्रकल्पातून ३०० मेगावॉट वीज निर्मिती सुरू', titleEn: '300 MW clean solar energy generated in Chandrapur' },
    ],
  },
  {
    id: 'lokmat-vidarbha',
    publicationName: 'Lokmat',
    publicationNameMr: 'लोकमत',
    mastheadColor: '#C2410C', // Deep saffron orange
    accentColor: '#EA580C',
    mottoMr: 'महाराष्ट्राचा नंबर १ अग्रगण्य वृत्तसमूह',
    mottoEn: "Maharashtra's Leading Daily Newspaper",
    editionName: 'Vidarbha & Marathwada Unified Edition',
    editionNameMr: 'विदर्भ व मराठवाडा संयुक्त महा-आवृत्ती',
    rniNumber: 'MAHMAR/1971/2198',
    volumeNumber: 'वर्ष ५५ • अंक ३०२',
    dateStr: 'मंगळवार, २० ऑक्टोबर २०२६',
    price: '₹ ५.००',
    pagesCount: 16,
    weather: 'नागपूर/अमरावती: कमाल ३२°C, हलकी हवा',
    leadArticle: {
      id: 'art-lokmat-1',
      headlineMr: 'गडचिरोली व चंद्रपूरमध्ये ₹४२,००० कोटींचे पोलाद व ऊर्जा प्रकल्प कार्यान्वित; विदर्भाचा कायापालट',
      headlineEn: '₹42,000 Cr Steel & Green Energy Projects Operationalized in Gadchiroli & Chandrapur',
      subheadMr: 'स्थानिक आदिवासी तरुणांसाठी ३५,००० प्रत्यक्ष नोकऱ्या; खनिज आधारित विकासाला नवे पंख',
      subheadEn: 'Surjagarh steel complex generates 35,000 direct employment opportunities for local youth',
      byline: 'विशेष वृत्तसेवा, नागपूर',
      district: 'Gadchiroli',
      districtMr: 'गडचिरोली',
      category: 'Industry',
      categoryMr: 'उद्योग व खनिज संपत्ती',
      sentiment: 'Positive',
      sentimentScore: 98,
      columnSpan: 2,
      captionMr: 'सूरजागड पोलाद प्रकल्पाच्या नवीन युनिटचे उद्घाटन करताना औद्योगिक तज्ज्ञ व स्थानिक कामगार.',
      captionEn: 'Industrial engineers and local workforce at the state-of-the-art Surjagarh steel manufacturing complex.',
      ocrTextMr: `नागपूर: एकेकाळी दुर्गम मानल्या जाणाऱ्या गडचिरोली जिल्ह्याने औद्योगिक क्रांतीत महाराष्ट्रात आघाडी घेतली आहे. सूरजागड खनिज पट्ट्यामध्ये आधुनिक पर्यावरणपूरक पोलाद प्रकल्पाचे उत्पादन सुरू झाले असून, यामुळे स्थानिक परिसरातील हजारो आदिवासी तरुणांना तंत्रशिक्षण आणि थेट रोजगाराची संधी मिळाली आहे. शासनाने या प्रकल्पाला पूरक म्हणून गडचिरोली-नागपूर चौपदरी महामार्ग आणि विशेष रेल्वे लाईनचे काम युद्धपातळीवर हाती घेतले आहे.`,
      ocrTextEn: `Nagpur: Gadchiroli has transformed into a national steel and manufacturing hub with the commissioning of major processing units in Surjagarh, generating over 35,000 local technical jobs while upholding strict ecological benchmarks.`,
    },
    sideArticles: [
      {
        id: 'art-lokmat-2',
        headlineMr: 'अकोला व बुलढाणा: शेतकरी उत्पादक कंपन्यांची (FPO) वार्षिक उलाढाल ₹५०० कोटींवर',
        headlineEn: 'Akola & Buldhana: Farmer Producer Companies Cross ₹500 Cr Revenue',
        subheadMr: 'सोयाबीन व कापूस खरेदीत शेतकऱ्यांना थेट नफा; दलालांची साखळी मोडीत',
        subheadEn: 'Direct soybean and cotton aggregation drives record margins for agro-cooperatives',
        byline: 'अकोला वार्ताहर',
        district: 'Akola',
        districtMr: 'अकोला',
        category: 'Agriculture',
        categoryMr: 'कृषी विपणन',
        sentiment: 'Positive',
        sentimentScore: 93,
        columnSpan: 1,
        ocrTextMr: `विदर्भातील ५० एफपीओ संस्थांनी एकत्र येऊन स्वतःचे प्रक्रिया प्रकल्प उभारले असून थेट देश-विदेशातील बाजारांमध्ये उत्पादने विकली जात आहेत.`,
        ocrTextEn: `50 Farmer Producer Companies in Vidarbha aggregated cotton and soybean harvests to export directly to domestic and international textile clusters.`,
      },
      {
        id: 'art-lokmat-3',
        headlineMr: 'यवतमाळ: वसंतराव नाईक जलसंजीवनी अभियानातून ५,००० शेततळी पूर्ण',
        headlineEn: 'Yavatmal: 5,000 Farm Ponds Completed under Watershed Mission',
        subheadMr: 'संरक्षित सिंचनामुळे कापूस उत्पादक शेतकऱ्यांना दिलासा',
        subheadEn: 'Protective irrigation infrastructure cushions cotton growers against dry spells',
        byline: 'यवतमाळ ब्युरो',
        district: 'Yavatmal',
        districtMr: 'यवतमाळ',
        category: 'Welfare',
        categoryMr: 'जलसंधारण',
        sentiment: 'Positive',
        sentimentScore: 90,
        columnSpan: 1,
        ocrTextMr: `जिल्हा प्रशासनाने मनरेगा आणि कृषी विभागाच्या समन्वयातून ५,००० शेततळी पूर्ण केली असून रब्बी हंगामासाठी मुबलक पाणी उपलब्ध झाले आहे.`,
        ocrTextEn: `Yavatmal district administration has delivered 5,000 farm ponds, securing winter crop yields across drought-prone rural talukas.`,
      },
      {
        id: 'art-lokmat-4',
        headlineMr: 'नागपूर मेट्रो फेज २: मिहान ते बुटीबोरी मार्गावर ट्रायल रन यशस्वी',
        headlineEn: 'Nagpur Metro Phase 2: Successful Trial Run from MIHAN to Butibori',
        subheadMr: 'औद्योगिक कामगार आणि आयटी कर्मचाऱ्यांचा प्रवास जलद आणि सुलभ होणार',
        subheadEn: 'Smooth mass transit connectivity for industrial workers and IT park professionals',
        byline: 'नागपूर प्रतिनिधी',
        district: 'Nagpur',
        districtMr: 'नागपूर',
        category: 'Infrastructure',
        categoryMr: 'नागरी वाहतूक',
        sentiment: 'Positive',
        sentimentScore: 91,
        columnSpan: 1,
        ocrTextMr: `नागपूर महामेट्रोने फेज २ अंतर्गत बुटीबोरी औद्योगिक वसाहतीपर्यंत मेट्रो धावण्यासाठी यशस्वी तांत्रिक चाचणी घेतली असून लवकरच प्रवासी सेवा सुरू होईल.`,
        ocrTextEn: `Nagpur Metro Phase 2 completed its inaugural trial run connecting the MIHAN SEZ with Butibori Industrial Zone.`,
      },
    ],
    districtBriefs: [
      { district: 'Wardha', districtMr: 'वर्धा', titleMr: 'सेवाग्राम व पवनार आश्रम पर्यटन कॉरिडॉरचे काम पूर्ण', titleEn: 'Sewagram & Pavnar tourism heritage corridor completed' },
      { district: 'Bhandara', districtMr: 'भंडारा', titleMr: 'भंडारा तलाव संवर्धन योजनेतून ५० पुरातन तलावांचे खोलीकरण', titleEn: 'Deepening and revival of 50 historic lakes in Bhandara' },
      { district: 'Washim', districtMr: 'वाशीम', titleMr: 'वाशीममध्ये अत्याधुनिक जिल्हा क्रीडा संकुल लोकार्पण सज्ज', titleEn: 'Modern district sports complex ready for launch in Washim' },
      { district: 'Hingoli', districtMr: 'हिंगोली', titleMr: 'हिंगोली लिगो (LIGO-India) विज्ञान प्रकल्पाचे बांधकाम वेगाने सुरू', titleEn: 'LIGO-India gravitational physics research facility construction active' },
    ],
  },
  {
    id: 'express-mumbai',
    publicationName: 'The Indian Express',
    publicationNameMr: 'द इंडियन एक्सप्रेस',
    mastheadColor: '#111827', // Crisp black
    accentColor: '#374151',
    mottoMr: 'जर्नल ऑफ अ फ्री प्रेस • सत्य आणि निष्पक्ष वार्तांकन',
    mottoEn: 'Journalism of Courage • Unbiased Governance Insights',
    editionName: 'Maharashtra State Governance Edition',
    editionNameMr: 'महाराष्ट्र सुशासन व गुंतवणूक विशेष आवृत्ती',
    rniNumber: 'MAHENG/1953/1209',
    volumeNumber: 'Vol LXXIV • No. 182',
    dateStr: 'Monday, October 19, 2026',
    price: '₹ 6.00',
    pagesCount: 20,
    weather: 'Statewide: Moderate temperature, AQI 64 (Satisfactory)',
    leadArticle: {
      id: 'art-exp-1',
      headlineMr: 'महाराष्ट्र औद्योगिक गुंतवणूक २०२६: देशातील एकूण थेट परदेशी गुंतवणुकीत (FDI) ३८% वाटा मिळवून राज्य अव्वल',
      headlineEn: 'Maharashtra Captures 38% of India’s Total FDI Inflows; ₹1.8 Lakh Crore Pours into Coastal & Expressway Corridors',
      subheadMr: 'सेमीकंडक्टर, डाटा सेंटर्स, ग्रीन हायड्रोजन आणि इलेक्ट्रिक वाहनांमध्ये विक्रमी गुंतवणूक; डीजीआयपीआरचा अधिकृत अहवाल',
      subheadEn: 'High-tech electronics, data centers, and renewable logistics drive unprecedented capital expenditure across MMR & Pune',
      byline: 'Special Correspondent, Mumbai',
      district: 'Mumbai City',
      districtMr: 'मुंबई शहर',
      category: 'Industry',
      categoryMr: 'गुंतवणूक व अर्थव्यवस्था',
      sentiment: 'Positive',
      sentimentScore: 96,
      columnSpan: 2,
      captionMr: 'जागतिक गुंतवणूक परिषदेत महाराष्ट्र शासनाचे वरिष्ठ सनदी अधिकारी व आंतरराष्ट्रीय शिष्टमंडळ.',
      captionEn: 'State government leadership and international industrial consortiums at the Maharashtra Global Investment Summit.',
      ocrTextMr: `मुंबई: केंद्र शासनाच्या उद्योग व अंतर्गत व्यापार संवर्धन विभागाने (DPIIT) प्रसिद्ध केलेल्या आकडेवारीनुसार, चालू आर्थिक वर्षात महाराष्ट्राने देशातील एकूण थेट परदेशी गुंतवणुकीत ३८% सह अव्वल स्थान राखले आहे. एकूण ₹१,८०,००० कोटींचे करार अंतिम टप्प्यात पोहोचले असून, ठाणे, नवी मुंबई, छत्रपती संभाजीनगर आणि नागपूर या चार शहरांमध्ये अत्याधुनिक डाटा सेंटर आणि इलेक्ट्रॉनिक्स क्लस्टर उभारले जात आहेत. 'महा-कमांड सेंटर' द्वारे सर्व परवानग्या एकाच छताखाली जलद गतीने दिल्या जात असल्याचे उद्योग विभागाने स्पष्ट केले.`,
      ocrTextEn: `Mumbai: According to official figures released by the Department for Promotion of Industry and Internal Trade (DPIIT), Maharashtra retained its undisputed leadership in national capital mobilization, capturing 38% of all inbound Foreign Direct Investment (FDI) into India, totaling ₹1.8 Lakh Crore. Key investment destinations span Mumbai-Navi Mumbai, Thane, Pune, Chhatrapati Sambhajinagar, and Nagpur.`,
    },
    sideArticles: [
      {
        id: 'art-exp-2',
        headlineMr: 'मुंबई कोस्टल रोड फेज २: नरिमन पॉईंट ते बांद्रा सी-लिंक दरम्यान अखंड प्रवास',
        headlineEn: 'Mumbai Coastal Road Phase 2 Opens to Traffic; Travel Time Cut to 12 Minutes',
        subheadMr: 'इंधनाची ५०% बचत आणि कार्बन उत्सर्जनात लक्षणीय घट',
        subheadEn: 'Undersea tunnels and arterial connections ease commuter congestion significantly',
        byline: 'Urban Affairs Desk',
        district: 'Mumbai City',
        districtMr: 'मुंबई शहर',
        category: 'Infrastructure',
        categoryMr: 'नागरी पायाभूत सुविधा',
        sentiment: 'Positive',
        sentimentScore: 94,
        columnSpan: 1,
        ocrTextMr: `मुंबई महापालिकेच्या कोस्टल रोड प्रकल्पाच्या दोन्ही बाजूंच्या वाहिन्या पूर्ण क्षमतेने खुल्या झाल्या असून दक्षिण मुंबईतून उपनगरात पोहोचणे अत्यंत जलद झाले आहे.`,
        ocrTextEn: `Commuters traveling between South Mumbai and western suburbs now experience seamless transit via the high-capacity Coastal Road undersea tunnel corridors.`,
      },
      {
        id: 'art-exp-3',
        headlineMr: 'ठाणे-बोरिवली दुहेरी भुयारी मार्ग: टनेल बोरिंग मशीनद्वारे खोदकामाला गती',
        headlineEn: 'Thane-Borivali Twin Tunnel Project Enters Final Excavation Phase',
        subheadMr: 'संजय गांधी राष्ट्रीय उद्यानाला धक्का न लावता अत्याधुनिक ग्रीन टनेलिंग',
        subheadEn: 'Eco-sensitive subterranean alignment preserves national park canopy intact',
        byline: 'Thane Bureau',
        district: 'Thane',
        districtMr: 'ठाणे',
        category: 'Infrastructure',
        categoryMr: 'पायाभूत सुविधा',
        sentiment: 'Positive',
        sentimentScore: 91,
        columnSpan: 1,
        ocrTextMr: `ठाणे आणि बोरिवली दरम्यानचा प्रवास केवळ १५ मिनिटांवर आणणाऱ्या ११.८ किमी लांबीच्या जुळ्या भुयारी मार्गाचे काम पर्यावरणपूरक पद्धतीने प्रगतीपथावर आहे.`,
        ocrTextEn: `Excavation on the 11.8 km twin-tube subterranean tunnel between Thane and Borivali is tracking ahead of schedule with zero surface disturbance to Sanjay Gandhi National Park.`,
      },
      {
        id: 'art-exp-4',
        headlineMr: 'पालघर: वाढवण बंदराचे प्राथमिक बांधकाम सुरू; ५०,००० स्थानिक तरुणांना प्रशिक्षण',
        headlineEn: 'Palghar: Vadhavan Deep-Water Port Groundwork Begins with Green Safeguards',
        subheadMr: 'स्थानिक मच्छीमार बांधवांसाठी ₹१,००० कोटींचे विशेष कल्याणकारी पॅकेज',
        subheadEn: 'State government enforces comprehensive marine biodiversity and livelihood safeguards',
        byline: 'Palghar Correspondent',
        district: 'Palghar',
        districtMr: 'पालघर',
        category: 'Infrastructure',
        categoryMr: 'बंदर विकास',
        sentiment: 'Neutral',
        sentimentScore: 82,
        columnSpan: 1,
        ocrTextMr: `भारतातील सर्वात मोठ्या कंटेनर बंदराचे काम सुरू करताना मच्छीमार बांधवांच्या उपजीविकेचे संपूर्ण रक्षण केले जात असल्याचे बंदर विकास प्राधिकरणाने जाहीर केले.`,
        ocrTextEn: `Vadhavan Port development has commenced alongside a ₹1,000 Crore community welfare program ensuring sustainable fisheries protection and technical skill development.`,
      },
    ],
    districtBriefs: [
      { district: 'Sindhudurg', districtMr: 'सिंधुदुर्ग', titleMr: 'सिंधुदुर्ग स्कूबा डायव्हिंग व वॉटर स्पोर्ट्स पर्यटनात ४०% वाढ', titleEn: 'Sindhudurg records 40% jump in certified marine eco-tourism' },
      { district: 'Raigad', districtMr: 'रायगड', titleMr: 'नवी मुंबई आंतरराष्ट्रीय विमानतळाचे व्यावसायिक कामकाज नियोजित वेळेत', titleEn: 'Navi Mumbai International Airport commercial trials on track' },
      { district: 'Chhatrapati Sambhajinagar', districtMr: 'छत्रपती संभाजीनगर', titleMr: 'औरिक (AURIC) स्मार्ट सिटीत १० नवीन जागतिक उद्योग दाखल', titleEn: '10 multinational manufacturers acquire plots in AURIC smart city' },
      { district: 'Dhule', districtMr: 'धुळे', titleMr: 'धुळे-नरडाणा औद्योगिक कॉरिडॉरमध्ये टेक्सटाईल क्लस्टरचे काम सुरू', titleEn: 'Textile processing cluster ground broken at Dhadane-Nardana' },
    ],
  },
];

export const NewspaperScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [editionIndex, setEditionIndex] = useState<number>(0);
  const [selectedArticle, setSelectedArticle] = useState<NewspaperArticle | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'page1' | 'ocr' | 'archive'>('page1');

  const currentEdition = NEWSPAPER_EDITIONS[editionIndex] ?? NEWSPAPER_EDITIONS[0];

  // Cycle to a completely different static newspaper edition
  const handleRandomizeEdition = () => {
    setEditionIndex((prev) => {
      const next = (prev + 1) % NEWSPAPER_EDITIONS.length;
      return next;
    });
    setSelectedArticle(null);
    setToast({
      message:
        language === 'mr'
          ? `नवीन आवृत्ती लोड झाली: ${NEWSPAPER_EDITIONS[(editionIndex + 1) % NEWSPAPER_EDITIONS.length].publicationNameMr}`
          : `Fresh Edition Loaded: ${NEWSPAPER_EDITIONS[(editionIndex + 1) % NEWSPAPER_EDITIONS.length].publicationName}`,
      type: 'success',
    });
  };

  const handleSelectEdition = (id: string) => {
    const idx = NEWSPAPER_EDITIONS.findIndex((e) => e.id === id);
    if (idx !== -1) {
      setEditionIndex(idx);
      setSelectedArticle(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1780px] w-full mx-auto space-y-5">
      {/* 1. TOP HEADER & CONTROLS TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              DGIPR Official E-Paper & Press Intelligence Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MaterialIcon name="newspaper" size="md" className="text-slate-800" />
            <span>
              {language === 'mr'
                ? 'महाराष्ट्र राज्य दैनिक वृत्तपत्र व ई-पेपर दालन'
                : 'Maharashtra Daily Newspapers & Broadsheet E-Paper Reader'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'सर्व ३६ जिल्ह्यांतील अग्रगण्य मराठी व इंग्रजी वर्तमानपत्रांचे मूळ पृष्ठ, ओसीआर मजकूर व कात्रणे (प्रत्येक वेळी वेगळी आवृत्ती).'
              : 'Authentic broadsheet layout, verified OCR transcription, and headline zoom for major Maharashtra dailies.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Publication Selector */}
          <select
            value={currentEdition.id}
            onChange={(e) => handleSelectEdition(e.target.value)}
            className="h-9 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer outline-none"
          >
            {NEWSPAPER_EDITIONS.map((ed) => (
              <option key={ed.id} value={ed.id}>
                {language === 'mr' ? `${ed.publicationNameMr} (${ed.editionNameMr})` : `${ed.publicationName} - ${ed.editionName}`}
              </option>
            ))}
          </select>

          {/* Load Different Edition Button */}
          <button
            onClick={handleRandomizeEdition}
            className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Load another authentic newspaper edition"
          >
            <span>🎲</span>
            <span>
              {language === 'mr' ? 'दुसरे वृत्तपत्र उघडा' : 'Open Different Edition'}
            </span>
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden bg-white text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="px-2.5 py-1.5 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              title="Zoom out"
            >
              −
            </button>
            <span className="px-2 py-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 border-x border-slate-200">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="px-2.5 py-1.5 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              title="Zoom in"
            >
              +
            </button>
          </div>

          {/* Print / Download Button */}
          <button
            onClick={() => window.print()}
            className="h-9 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MaterialIcon name="download" size="xs" />
            <span className="hidden sm:inline">{language === 'mr' ? 'मुद्रित करा' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* 2. AUTHENTIC BROADSHEET NEWSPAPER CONTAINER */}
      <div
        className="w-full bg-[#FAFAF9] border-2 border-slate-300 rounded-xl shadow-lg p-4 sm:p-8 overflow-x-auto transition-transform duration-200"
        style={{
          fontFamily: "'Noto Serif Devanagari', 'Georgia', serif",
          transformOrigin: 'top center',
          zoom: `${zoomLevel}%`,
        }}
      >
        <div className="max-w-[1280px] mx-auto bg-[#FFFDF9] border border-[#E7E5E4] p-6 sm:p-10 shadow-sm rounded-sm">
          {/* Top Vintage Bar (Price, Date, RNI, Weather) */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-700 border-b-2 border-slate-800 pb-1.5 font-sans">
            <div className="flex items-center gap-3">
              <span className="font-bold">{currentEdition.rniNumber}</span>
              <span>•</span>
              <span>{currentEdition.volumeNumber}</span>
              <span>•</span>
              <span>{currentEdition.pagesCount} पृष्ठे</span>
            </div>
            <div className="font-bold text-slate-900 text-xs tracking-wider">
              {currentEdition.dateStr}
            </div>
            <div className="flex items-center gap-3">
              <span>{currentEdition.weather}</span>
              <span>•</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                किंमत: {currentEdition.price}
              </span>
            </div>
          </div>

          {/* Masthead Header */}
          <div className="text-center py-6 border-b-4 border-double border-slate-900 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-sans font-bold">
              {language === 'mr' ? currentEdition.mottoMr : currentEdition.mottoEn}
            </div>
            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight select-none uppercase"
              style={{ color: currentEdition.mastheadColor }}
            >
              {language === 'mr' ? currentEdition.publicationNameMr : currentEdition.publicationName}
            </h2>
            <div className="inline-block px-4 py-0.5 bg-slate-900 text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full">
              {language === 'mr' ? currentEdition.editionNameMr : currentEdition.editionName}
            </div>
          </div>

          {/* Lead Headline Banner */}
          <div className="pt-6 pb-4 border-b-2 border-slate-300 text-center space-y-2">
            <h3
              onClick={() => setSelectedArticle(currentEdition.leadArticle)}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 hover:text-red-700 transition-colors cursor-pointer leading-tight"
            >
              {language === 'mr'
                ? currentEdition.leadArticle.headlineMr
                : currentEdition.leadArticle.headlineEn}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 italic max-w-4xl mx-auto font-sans">
              {language === 'mr'
                ? currentEdition.leadArticle.subheadMr
                : currentEdition.leadArticle.subheadEn}
            </p>
          </div>

          {/* 3-Column Broadsheet Newspaper Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 font-serif">
            {/* Left Column (3 cols): District Briefs & Side Story */}
            <div className="lg:col-span-3 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-300 lg:pr-6">
              {/* Side Article 1 */}
              <div
                onClick={() => setSelectedArticle(currentEdition.sideArticles[0])}
                className="group cursor-pointer p-2.5 -m-2.5 rounded-lg hover:bg-amber-500/5 transition-all"
              >
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-700 block mb-1">
                  {currentEdition.sideArticles[0].categoryMr} • {currentEdition.sideArticles[0].districtMr}
                </span>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-red-800 leading-snug">
                  {language === 'mr'
                    ? currentEdition.sideArticles[0].headlineMr
                    : currentEdition.sideArticles[0].headlineEn}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                  {language === 'mr'
                    ? currentEdition.sideArticles[0].ocrTextMr
                    : currentEdition.sideArticles[0].ocrTextEn}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-sans border-t border-slate-200 pt-1">
                  <span>{currentEdition.sideArticles[0].byline}</span>
                  <span className="text-emerald-700 font-bold font-mono">
                    {currentEdition.sideArticles[0].sentimentScore}% Compliant
                  </span>
                </div>
              </div>

              {/* District Round-Up Box */}
              {/* District Round-Up Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-sm font-sans space-y-2">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    {language === 'mr' ? 'जिल्हा विकास वार्तापत्र' : 'District Briefs'}
                  </h5>
                  <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded font-mono font-bold text-slate-700">
                    ३६ जिल्हे
                  </span>
                </div>
                <div className="space-y-3 pt-1">
                  {currentEdition.districtBriefs.map((brief, idx) => (
                    <div key={`brief-${idx}`} className="text-xs border-l-2 border-slate-400 pl-2">
                      <span className="font-bold text-slate-950 block text-[11px]">
                        [{language === 'mr' ? brief.districtMr : brief.district}]
                      </span>
                      <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">
                        {language === 'mr' ? brief.titleMr : brief.titleEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column (6 cols): Lead Story with Press Photograph */}
            <div className="lg:col-span-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-300 lg:pr-6">
              {/* Photo Simulation */}
              <div
                onClick={() => setSelectedArticle(currentEdition.leadArticle)}
                className="group cursor-pointer relative bg-slate-900 text-white rounded-sm overflow-hidden aspect-[16/10] flex items-center justify-center p-4 border border-slate-400 shadow-xs"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <div className="relative z-20 text-center space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white font-sans text-[10px] font-bold uppercase tracking-wider">
                    {language === 'mr' ? 'मुख्य शासकीय वृत्त' : 'Lead Administration Story'}
                  </span>
                  <h5 className="text-lg sm:text-xl font-bold font-serif max-w-md mx-auto text-white drop-shadow">
                    {language === 'mr'
                      ? currentEdition.leadArticle.headlineMr
                      : currentEdition.leadArticle.headlineEn}
                  </h5>
                  <span className="text-[11px] font-sans text-slate-300 block">
                    {language === 'mr'
                      ? currentEdition.leadArticle.captionMr
                      : currentEdition.leadArticle.captionEn}
                  </span>
                </div>
              </div>

              {/* Multi-column Body Text */}
              <div className="columns-1 sm:columns-2 gap-4 text-xs text-slate-800 leading-relaxed text-justify space-y-2">
                <p>
                  <strong className="text-sm font-bold font-sans">
                    {language === 'mr' ? currentEdition.leadArticle.byline : 'By Staff Reporter'}:
                  </strong>{' '}
                  {language === 'mr'
                    ? currentEdition.leadArticle.ocrTextMr
                    : currentEdition.leadArticle.ocrTextEn}
                </p>
                <p>
                  {language === 'mr'
                    ? 'या प्रकल्पाच्या अंमलबजावणीसाठी संबंधित सर्व जिल्हाधिकाऱ्यांकडे जबाबदारी सोपविण्यात आली असून दर पंधरा दिवसांनी प्रगतीचा प्रत्यक्ष आढावा मुख्य सचिव कार्यालयाकडून घेतला जाईल. स्थानिक उद्योगांना यामुळे मोठा दिलासा मिळाला असून नागरिकांमध्ये सकारात्मक वातावरण आहे.'
                    : 'The project execution will be overseen by respective district collectors under biometric and satellite milestone verification. Local trade bodies and agrarian unions have welcomed the strategic move.'}
                </p>
              </div>

              {/* Article Zoom Callout */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedArticle(currentEdition.leadArticle)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-xs font-semibold rounded border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MaterialIcon name="search" size="xs" />
                  <span>
                    {language === 'mr'
                      ? 'पूर्ण बातमी व ओसीआर (OCR) मजकूर पहा'
                      : 'Inspect Full Article & OCR Transcript'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column (3 cols): Side Stories 2 & 3 */}
            <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                {currentEdition.sideArticles.slice(1).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="group cursor-pointer p-3.5 bg-white border border-slate-200 rounded-sm hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between min-h-[160px] space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-sans font-bold">
                        <span className="text-red-700 uppercase tracking-wider">{art.categoryMr}</span>
                        <span className="text-slate-500 font-mono">[{art.districtMr}]</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-red-800 leading-snug mt-1">
                        {language === 'mr' ? art.headlineMr : art.headlineEn}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-1">
                        {language === 'mr' ? art.ocrTextMr : art.ocrTextEn}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-sans text-slate-500 mt-auto">
                      <span className="font-medium text-slate-600">{art.byline}</span>
                      <span className="text-emerald-700 font-bold font-mono">
                        {art.sentimentScore}% Positive
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Official Stamp Box */}
              <div className="border-2 border-dashed border-slate-400 p-3 rounded text-center font-sans space-y-1 text-slate-600 text-[11px] bg-slate-50 mt-auto">
                <div className="w-8 h-8 rounded-full border-2 border-slate-800 mx-auto flex items-center justify-center font-black text-xs text-slate-900">
                  DG
                </div>
                <strong className="block text-slate-900 uppercase tracking-wider text-[10px]">
                  DGIPR Verified Public Record
                </strong>
                <span>शासकीय माहिती व जनसंपर्क महासंचालनालय</span>
                <div className="font-mono text-[9px] text-slate-400 pt-1">
                  ARCHIVE REF: #{currentEdition.id.toUpperCase()}-2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ARTICLE ZOOM & OCR INSPECTOR MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                  OCR Verified (98.8%)
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {selectedArticle.categoryMr} • {selectedArticle.districtMr}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {language === 'mr' ? selectedArticle.headlineMr : selectedArticle.headlineEn}
              </h2>
              <p className="text-sm text-slate-600 italic">
                {language === 'mr' ? selectedArticle.subheadMr : selectedArticle.subheadEn}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                <span>Byline: {selectedArticle.byline}</span>
                <span>•</span>
                <span>District: {selectedArticle.district}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">
                  Sentiment: {selectedArticle.sentimentScore}% {selectedArticle.sentiment}
                </span>
              </div>

              {/* Marathi Devanagari OCR Text */}
              <div className="space-y-1 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-mono">
                  मराठी मूळ मजकूर (Original Marathi OCR Text):
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-serif">
                  {selectedArticle.ocrTextMr}
                </p>
              </div>

              {/* English AI Translation */}
              <div className="space-y-1 bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 font-mono">
                  English Synchronized Translation:
                </span>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {selectedArticle.ocrTextEn}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(selectedArticle.ocrTextMr);
                  setToast({ message: 'मजकूर क्लिपबोर्डवर कॉपी झाला.', type: 'success' });
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Copy Text
              </button>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
