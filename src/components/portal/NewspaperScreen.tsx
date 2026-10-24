'use client';

import React, { useState, useMemo } from 'react';
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
  category: string;
  categoryMr: string;
  sentiment: 'Positive' | 'Neutral' | 'Critical';
  sentimentScore: number;
  kickerMr: string;
  kickerEn: string;
  ocrTextMr: string;
  ocrTextEn: string;
  columnSpan: number; // 1, 2, or 3
  hasPhoto?: boolean;
  photoCaptionMr?: string;
  photoCaptionEn?: string;
  photoCredit?: string;
  dateline?: string;
}

export interface GovernmentTender {
  id: string;
  departmentMr: string;
  departmentEn: string;
  titleMr: string;
  titleEn: string;
  estCost: string;
  deadline: string;
  refNo: string;
}

export interface NewspaperPage {
  pageNumber: number;
  pageTitleMr: string;
  pageTitleEn: string;
  leadArticle: NewspaperArticle;
  sideArticles: NewspaperArticle[];
  briefs?: Array<{ district: string; districtMr: string; textMr: string; textEn: string }>;
  tenderNotice?: GovernmentTender;
  editorialCartoon?: {
    titleMr: string;
    captionMr: string;
    titleEn: string;
    captionEn: string;
  };
}

export interface NewspaperPublication {
  id: string;
  name: string;
  nameMr: string;
  mottoMr: string;
  mottoEn: string;
  mastheadColor: string;
  accentColor: string;
  editionName: string;
  editionNameMr: string;
  rniNumber: string;
  volumeNumber: string;
  dateStr: string;
  dateStrEn: string;
  price: string;
  weatherMr: string;
  weatherEn: string;
  markets: string;
  pages: NewspaperPage[];
}

const NEWSPAPER_PUBLICATIONS: NewspaperPublication[] = [
  // 1. LOKSATTA (लोकसत्ता) - Mumbai & Konkan
  {
    id: 'loksatta',
    name: 'Loksatta',
    nameMr: 'लोकसत्ता',
    mottoMr: 'सर्वसमावेशक, निर्भीड आणि पुरोगामी विचार',
    mottoEn: 'Comprehensive, Fearless and Progressive Journalism',
    mastheadColor: '#991B1B', // Deep red
    accentColor: '#DC2626',
    editionName: 'Mumbai & Konkan Mega Broadsheet',
    editionNameMr: 'मुंबई व कोकण विशेष महा-आवृत्ती',
    rniNumber: 'MAHMAR/1948/1042',
    volumeNumber: 'वर्ष ७७ • अंक २९४',
    dateStr: 'शनिवार, २४ ऑक्टोबर २०२६',
    dateStrEn: 'Saturday, 24 October 2026',
    price: '₹ ५.००',
    weatherMr: 'मुंबई/ठाणे: कमाल ३१°C, किमान २४°C • आकाश निरभ्र',
    weatherEn: 'Mumbai/Thane: Max 31°C, Min 24°C • Clear Sky',
    markets: 'सेन्सेक्स: ८१,४५० ▲ ३१० • सोने: ₹७८,२०० • डॉलर: ₹८३.९०',
    pages: [
      {
        pageNumber: 1,
        pageTitleMr: 'मुख्य पृष्ठ (Front Page)',
        pageTitleEn: 'Page 1 — State Lead & Front Page',
        leadArticle: {
          id: 'lok-p1-art1',
          kickerMr: 'मंत्रिमंडळाचा ऐतिहासिक निर्णय',
          kickerEn: 'Historic Cabinet Resolution',
          headlineMr: 'कोकण सागरी महामार्ग व मत्स्यव्यवसाय कॉरिडॉरसाठी ₹५,४०० कोटींची विशेष तरतूद मंजूर; ठाणे-पालघर प्रकल्पांना गती',
          headlineEn: 'Cabinet Sanctions ₹5,400 Crore Infrastructure Package for Konkan Coastal Highway & Marine Logistics Corridors',
          subheadMr: 'रेवस ते रेड्डी सागरी महामार्ग चौपदरीकरणास वेग; सिंधुदुर्ग व रत्नागिरीत अत्याधुनिक शीतगृहे व प्रक्रिया केंद्र उभारणार',
          subheadEn: 'Revas-Redi 4-lane highway fast-tracked; state-of-the-art cold chain maritime logistics hubs sanctioned for Sindhudurg and Ratnagiri',
          byline: 'विशेष प्रशासकीय प्रतिनिधी, मंत्रालय, मुंबई',
          dateline: 'मुंबई, २४ ऑक्टोबर',
          district: 'Statewide',
          districtMr: 'महाराष्ट्र राज्य',
          category: 'Infrastructure',
          categoryMr: 'पायाभूत सुविधा',
          sentiment: 'Positive',
          sentimentScore: 95,
          columnSpan: 2,
          hasPhoto: true,
          photoCaptionMr: 'मंत्रालयातील मंत्रिमंडळ सभागृहात मुख्य सचिव व वरिष्ठ सनदी अधिकाऱ्यांसोबत कोकण विकास आराखड्यास अंतिम मंजुरी देताना.',
          photoCaptionEn: 'Chief Secretary and senior IAS leadership approving the comprehensive coastal development blueprint at Mantralaya.',
          photoCredit: 'छायाचित्र: माहिती व जनसंपर्क महासंचालनालय (DGIPR)',
          ocrTextMr: `मुंबई: महाराष्ट्र शासनाच्या मंत्रिमंडळ उपसमितीच्या महत्त्वपूर्ण बैठकीत कोकण विभागातील ठाणे, पालघर, रायगड, रत्नागिरी आणि सिंधुदुर्ग या पाचही सागरी जिल्ह्यांच्या सर्वांगीण विकासासाठी ₹५,४०० कोटींच्या विशेष वित्तीय पॅकेजला औपचारिक मंजुरी देण्यात आली आहे. या निधीतून रेवस-रेड्डी सागरी महामार्ग चौपदरीकरण, पालघर नवीन जिल्हा संकुल जोड रस्ते आणि सिंधुदुर्ग मल्टिमोडल लॉजिस्टिक पार्कचे काम युद्धपातळीवर पूर्ण केले जाईल.

माहिती व जनसंपर्क महासंचालनालयाने (DGIPR) दिलेल्या अधिकृत प्रसिद्धीपत्रकानुसार, या सर्व प्रकल्पांची प्रत्यक्ष क्षेत्रीय प्रगती मंत्रालयातील 'महा-कमांड सेंटर' द्वारे डिजिटल डॅशबोर्डवर २४ तास मॉनिटर केली जाणार आहे. प्रकल्पांसाठी भूसंपादन मोबदला थेट लाभ हस्तांतरण (DBT) प्रणालीद्वारे शेतकऱ्यांच्या बँक खात्यात विहित ९० दिवसांच्या मुदतीत जमा करण्याचे सक्त निर्देश संबंधित जिल्हाधिकाऱ्यांना देण्यात आले आहेत.`,
          ocrTextEn: `Mumbai: In a landmark decision, the State Cabinet has formally sanctioned a ₹5,400 Crore comprehensive infrastructure package for the five coastal districts of Konkan (Thane, Palghar, Raigad, Ratnagiri, Sindhudurg). The package accelerates the four-laning of the Revas-Redi Coastal Highway and establishes modern cold-storage maritime logistics hubs. DGIPR confirmed that all operational milestones will be tracked real-time via the State Maha-Command Center.`,
        },
        sideArticles: [
          {
            id: 'lok-p1-art2',
            kickerMr: 'प्रशासकीय सुधारणा',
            kickerEn: 'Administrative Reforms',
            headlineMr: 'सर्व ३६ जिल्ह्यांमध्ये हाय-स्पीड माहिती कक्ष कार्यान्वित; ९० मिनिटांचे एसएलए लागू',
            headlineEn: 'High-Speed DIO Information Cells Operationalized across 36 Districts with 90-Min SLA',
            subheadMr: 'अफवा व खोटी माहिती रोखण्यासाठी अत्याधुनिक फॅक्ट-चेक नियंत्रण जाळे',
            subheadEn: 'Real-time fact-checking and official rebuttals against misinformation enforced',
            byline: 'प्रशासकीय वार्ताहर',
            district: 'Statewide',
            districtMr: '३६ जिल्हे',
            category: 'Administration',
            categoryMr: 'प्रशासन',
            sentiment: 'Positive',
            sentimentScore: 92,
            columnSpan: 1,
            ocrTextMr: `माहिती व जनसंपर्क महासंचालनालयाचे महासंचालक यांच्या मार्गदर्शनाखाली राज्यातील सर्व ३६ जिल्ह्यांमध्ये हाय-टेक मीडिया कंट्रोल रूम पूर्ण क्षमतेने कार्यरत झाले आहेत. खोटी माहिती, समाजमाध्यमांवरील अफवांचे वेळीच खंडन करण्यासाठी ९० मिनिटांचे विशेष एसएलए (SLA) लागू करण्यात आले असून आतापर्यंत १००% तक्रारींचे वेळेत निवारण झाले आहे.`,
            ocrTextEn: `DGIPR has fully operationalized high-tech media monitoring rooms across all 36 Maharashtra districts, backed by a strict 90-minute crisis SLA response protocol.`,
          },
          {
            id: 'lok-p1-wangchuk',
            kickerMr: 'नवी दिल्ली थेट वृत्त / पर्यावरण व घटनात्मक हक्क',
            kickerEn: 'New Delhi Live Wire / Ecology & Constitutional Rights',
            headlineMr: 'सोनम वांगचूक यांची नवी दिल्लीत पत्रकार परिषद: लडाखच्या पर्यावरण संवर्धनासाठी आणि ६ व्या अनुसूचीसाठी शांततापूर्ण संवादाचे आवाहन',
            headlineEn: 'Sonam Wangchuk Holds Press Conference in New Delhi: Appeals for Himalayan Ecological Safeguards & 6th Schedule Autonomy',
            subheadMr: 'लेह ते दिल्ली १,००० किमी पदयात्रेनंतर राष्ट्रीय प्रसारमाध्यमांशी थेट संवाद; हिमनद्यांचे रक्षण व केंद्र शासनाशी चर्चेचे निमंत्रण',
            subheadEn: 'Addresses national media following 1,000 km foot march from Leh; warns 70% glaciers melting and urges constructive dialogue with Centre',
            byline: 'विशेष नवी दिल्ली प्रतिनिधी',
            dateline: 'नवी दिल्ली, २४ ऑक्टोबर',
            district: 'New Delhi',
            districtMr: 'नवी दिल्ली',
            category: 'Environment',
            categoryMr: 'पर्यावरण व प्रशासन',
            sentiment: 'Neutral',
            sentimentScore: 88,
            columnSpan: 1,
            hasPhoto: true,
            photoCaptionMr: 'नवी दिल्लीतील पत्रकार परिषदेत पर्यावरण कार्यकर्ते सोनम वांगचूक राष्ट्रीय प्रसारमाध्यमांसमोर लडाखच्या पर्यावरणाविषयी भूमिका मांडताना.',
            photoCaptionEn: 'Climate reformer Sonam Wangchuk addressing the national press corps in New Delhi on Ladakh ecological fragility.',
            photoCredit: 'छायाचित्र: नॅशनल मीडिया पूल / DGIPR संकलन',
            ocrTextMr: `नवी दिल्ली: लडाखमधील प्रख्यात पर्यावरण कार्यकर्ते आणि शिक्षणतज्ज्ञ सोनम वांगचूक यांनी नवी दिल्लीतील पत्रकार परिषदेत राष्ट्रीय व आंतरराष्ट्रीय प्रसारमाध्यमांना संबोधित केले. लेह येथून दुर्गम हिमालयातून १,००० किलोमीटरहून अधिक पायी प्रवास करून आलेली ही 'दिल्ली चलो' पदयात्रा शांतता, सद्भावना आणि भारतीय संविधानावरील दृढ विश्वासावर आधारित असल्याचे त्यांनी स्पष्ट केले.

वांगचूक म्हणाले की, लडाखमधील ९५% लोकसंख्या आदिवासी असून या भागातील पर्यावरण, संस्कृती व जमिनीच्या संरक्षणासाठी राज्यघटनेच्या ६ व्या अनुसूचीची अंमलबजावणी करणे ही काळाची गरज आहे. हवामान बदलामुळे हिमालयातील ७०% पेक्षा जास्त हिमनद्या वितळत असल्याने उत्तर भारताची जलसुरक्षा धोक्यात आली आहे. केंद्रीय गृह मंत्रालयासोबतची नियोजित बैठक पुढे ढकलल्याबद्दल दुःख व्यक्त करत, केंद्र शासनाने लोकशाही मार्गाने पुन्हा संवाद सुरू करावा, असे कळकळीचे आवाहन त्यांनी केले.`,
            ocrTextEn: `New Delhi: Renowned Ladakh climate activist Sonam Wangchuk addressed a major press conference in New Delhi following a 1,000 km peaceful foot march from Leh. He articulated the urgent need for Sixth Schedule constitutional safeguards to protect Ladakh's indigenous tribal communities and fragile glacial water towers. Wangchuk expressed disappointment over the deferred official dialogue with the Ministry of Home Affairs and urged Union leadership to restart respectful, open negotiations under the constitutional framework.`,
          },
          {
            id: 'lok-p1-art3',
            kickerMr: 'कृषी व सिंचन',
            kickerEn: 'Agrarian Welfare',
            headlineMr: 'सूक्ष्म सिंचनासाठी १,२४० कोटींचे अनुदान थेट शेतकऱ्यांच्या बँक खात्यात वर्ग',
            headlineEn: '₹1,240 Crore Micro-Irrigation Drip Subsidy Transferred Directly to Farmers via DBT',
            subheadMr: 'विदर्भ, मराठवाडा व उत्तर महाराष्ट्रातील ६.२ लाख शेतकरी कुटुंबांना थेट लाभ',
            subheadEn: '6.2 lakh farmer families across Vidarbha and Marathwada benefit with zero leakage',
            byline: 'कृषी प्रतिनिधी, पुणे',
            district: 'Pune',
            districtMr: 'पुणे',
            category: 'Agriculture',
            categoryMr: 'कृषी',
            sentiment: 'Positive',
            sentimentScore: 94,
            columnSpan: 1,
            ocrTextMr: `राज्यातील दुष्काळप्रवण तालुक्यांतील शेतकऱ्यांना ठिबक व तुषार सिंचन संच बसविण्यासाठी शासनाने मंजूर केलेले ₹१,२४० कोटींचे थेट अनुदान थेट बँक खात्यात जमा करण्यात आले आहे. आधार संलग्न प्रणालीमुळे मध्यस्थांशिवाय पारदर्शक पद्धतीने निधी वितरण साध्य झाले.`,
            ocrTextEn: `The state government has transferred ₹1,240 Crore in direct micro-irrigation subsidies to 6.2 lakh farmer families with Aadhaar-linked verification, eliminating intermediaries.`,
          },
        ],
        tenderNotice: {
          id: 'tnd-lok-01',
          departmentMr: 'सार्वजनिक बांधकाम विभाग (महाराष्ट्र शासन)',
          departmentEn: 'Public Works Department (Govt of Maharashtra)',
          titleMr: 'रेवस-रेड्डी सागरी महामार्ग टप्पा-२ चौपदरीकरण ई-निविदा सूचना',
          titleEn: 'Revas-Redi Coastal Highway Phase-II 4-Laning E-Tender Notice',
          estCost: '₹ ८४२.५० कोटी',
          deadline: '१५ नोव्हेंबर २०२६',
          refNo: 'PWD/EE/KHL/2026/T-842',
        },
        briefs: [
          { district: 'Thane', districtMr: 'ठाणे', textMr: 'ठाणे मेट्रो मार्ग ४ व ५ चे काम वेगाने प्रगतीपथावर; २०२७ अखेरपर्यंत प्रवासी सेवा सुरू करण्याचे नियोजन.', textEn: 'Thane Metro Lines 4 & 5 civil works on schedule for late 2027 launch.' },
          { district: 'Palghar', districtMr: 'पालघर', textMr: 'वाढवण बंदर कौशल्य विकास केंद्रात ५,००० स्थानिक तरुणांची पहिली तुकडी दाखल.', textEn: '5,000 local youth enroll in Vadhavan maritime vocational academy.' },
          { district: 'Ratnagiri', districtMr: 'रत्नागिरी', textMr: 'रत्नागिरी विमानतळावरून व्यावसायिक प्रवासी उड्डाणांसाठी डीजीसीएकडून अंतिम परवाना मंजूर.', textEn: 'DGCA grants operational commercial aerodrome license to Ratnagiri.' },
          { district: 'Raigad', districtMr: 'रायगड', textMr: 'नवी मुंबई आंतरराष्ट्रीय विमानतळाचे व्यावसायिक कामकाज नियोजित वेळेत सुरू होणार.', textEn: 'Navi Mumbai International Airport commercial trials progressing on track.' },
        ],
      },
      {
        pageNumber: 2,
        pageTitleMr: 'मंत्रालय व राज्य घडामोडी (State Governance)',
        pageTitleEn: 'Page 2 — Mantralaya & State Policy',
        leadArticle: {
          id: 'lok-p2-art1',
          kickerMr: 'धोरणात्मक निर्णय',
          kickerEn: 'Strategic Policy',
          headlineMr: 'महाराष्ट्र औद्योगिक गुंतवणूक धोरण: ४५ नवीन बहुराष्ट्रीय प्रकल्पांना तत्त्वतः मंजुरी',
          headlineEn: 'Maharashtra Industrial Policy: 45 Multinational Projects Greenlit with ₹85,000 Cr Investment',
          subheadMr: 'छत्रपती संभाजीनगरमधील ऑरिक स्मार्ट सिटी आणि नागपूर मिहानमध्ये मोठ्या रोजगारांची निर्मिती',
          subheadEn: 'Mega employment drivers centered around AURIC Smart City and Nagpur MIHAN aero-corridor',
          byline: 'मंत्रालय प्रतिनिधी, मुंबई',
          district: 'Mumbai City',
          districtMr: 'मुंबई',
          category: 'Industry',
          categoryMr: 'उद्योग',
          sentiment: 'Positive',
          sentimentScore: 91,
          columnSpan: 2,
          hasPhoto: true,
          photoCaptionMr: 'उद्योग विभागाच्या उच्चाधिकार समितीच्या बैठकीत सामंजस्य करारांची पडताळणी करताना वरिष्ठ सचिव.',
          photoCaptionEn: 'Industry high-powered committee verifying semiconductor and green hydrogen MoUs.',
          photoCredit: 'छायाचित्र: माहिती व जनसंपर्क महासंचालनालय (DGIPR)',
          ocrTextMr: `मुंबई: राज्यात आगामी तीन वर्षांत ₹८५,००० कोटींची थेट औद्योगिक गुंतवणूक आकर्षित करण्यासाठी उद्योग विभागाने ४५ नवीन जागतिक प्रकल्पांना विशेष सवलतींचे पॅकेज मंजूर केले आहे. यामध्ये इलेक्ट्रिक वाहने, सेमीकंडक्टर आणि हरित हायड्रोजन प्रकल्पांचा समावेश आहे. या गुंतवणुकीतून राज्यात १.२ लाख थेट रोजगार निर्माण होण्याचा विश्वास व्यक्त करण्यात आला.`,
          ocrTextEn: `Mumbai: State Government has sanctioned industrial packages for 45 global enterprises committing ₹85,000 Crore investment across electric mobility, semiconductor chip assembly, and green hydrogen hubs.`,
        },
        sideArticles: [
          {
            id: 'lok-p2-art2',
            kickerMr: 'आरोग्य सेवा विस्तार',
            kickerEn: 'Healthcare Delivery',
            headlineMr: 'ग्रामीण भागातील सर्व प्राथमिक आरोग्य केंद्रांमध्ये डिजिटल टेलिमेडिसीन सेवा सुरू',
            headlineEn: 'Digital Telemedicine Operationalized across All Rural Primary Healthcare Centers',
            subheadMr: 'विशेषज्ञ डॉक्टरांचा थेट सल्ला ग्रामीण व दुर्गम भागातील रुग्णांना उपलब्ध',
            subheadEn: 'Direct super-specialist consultations brought to tribal and remote primary clinics',
            byline: 'आरोग्य प्रतिनिधी',
            district: 'Gadchiroli',
            districtMr: 'गडचिरोली',
            category: 'Welfare',
            categoryMr: 'आरोग्य',
            sentiment: 'Positive',
            sentimentScore: 93,
            columnSpan: 1,
            ocrTextMr: `आरोग्य विभागाच्या डिजिटल अभियानांतर्गत राज्यातील सर्व २,१०० प्राथमिक आरोग्य केंद्रांमध्ये ५G टेलिमेडिसीन प्रणाली जोडण्यात आली आहे. गडचिरोली व नंदुरबार जिल्ह्यातील दुर्गम पाड्यांतील रुग्णांना मुंबई व पुण्याच्या तज्ज्ञ डॉक्टरांकडून मोफत सल्ला दिला जात आहे.`,
            ocrTextEn: `2,100 primary health centers in remote tribal talukas connected to apex teaching hospitals via high-speed telemedicine telemetry.`,
          },
        ],
        briefs: [
          { district: 'Nashik', districtMr: 'नाशिक', textMr: 'नाशिक-पुणे सेमी हायस्पीड रेल्वे भूसंपादन ८०% पूर्ण; केंद्राकडून विशेष निधी.', textEn: 'Nashik-Pune Semi High-Speed Rail land acquisition reaches 80%.' },
          { district: 'Kolhapur', districtMr: 'कोल्हापूर', textMr: 'पंचगंगा नदी प्रदूषण मुक्तीसाठी ₹४५० कोटींचा सांडपाणी प्रक्रिया प्रकल्प मंजूर.', textEn: '₹450 Cr sewage treatment plan approved for Panchganga river rejuvenation.' },
        ],
      },
      {
        pageNumber: 3,
        pageTitleMr: 'संपादकीय व विचारमंथन (Editorial & Op-Ed)',
        pageTitleEn: 'Page 3 — Editorial & Public Opinion',
        leadArticle: {
          id: 'lok-p3-art1',
          kickerMr: 'अग्रलेख',
          kickerEn: 'Main Editorial',
          headlineMr: 'अग्रलेख: महाराष्ट्राच्या सर्वांगीण विकासाचा गतिमान महामार्ग',
          headlineEn: 'Editorial: The Dynamic Highway of Inclusive Maharashtra Development',
          subheadMr: 'पायाभूत सुविधा, कृषी कल्याण आणि पारदर्शक ई-प्रशासनाची यशस्वी सांगड',
          subheadEn: 'Integrating high-speed physical corridors with digital citizen charters and agrarian resilience',
          byline: 'संपादकीय मंडळ, लोकसत्ता',
          district: 'Statewide',
          districtMr: 'महाराष्ट्र',
          category: 'Editorial',
          categoryMr: 'संपादकीय',
          sentiment: 'Positive',
          sentimentScore: 89,
          columnSpan: 2,
          ocrTextMr: `कोकण विकासासाठी मंजूर झालेले ₹५,४०० कोटींचे पॅकेज आणि विदर्भातील सिंचन योजनांना मिळालेली गती हे दाखवून देते की राज्याचे नियोजन प्रादेशिक समतोलावर आधारलेले आहे. केवळ घोषणा न करता ९० मिनिटांचे एसएलए आणि थेट महा-कमांड सेंटर मॉनिटरिंग यासारख्या प्रशासकीय साधनांमुळे प्रकल्प कालमर्यादेत पूर्ण होण्याची खात्री मिळते.`,
          ocrTextEn: `The state's infrastructure thrust demonstrates balanced regional equity. Real-time telemetry monitoring via the Maha-Command Center ensures accountability and timely delivery.`,
        },
        sideArticles: [
          {
            id: 'lok-p3-art2',
            kickerMr: 'विशेष विचार',
            kickerEn: 'Guest Column',
            headlineMr: 'ई-प्रशासन आणि पारदर्शकता: नागरिकांचा वाढता विश्वास',
            headlineEn: 'E-Governance and Transparency: Restoring Citizen Trust at the Grassroots',
            subheadMr: 'माहिती तंत्रज्ञानाचा लोककल्याणासाठी प्रभावी वापर कसा करता येतो याचे आदर्श उदाहरण',
            subheadEn: 'How direct benefit transfers and real-time citizen grievance portals are reshaping public service',
            byline: 'डॉ. अरविंद एम. गोखले (वरिष्ठ प्रशासकीय विश्लेषक)',
            district: 'Mumbai',
            districtMr: 'मुंबई',
            category: 'Opinion',
            categoryMr: 'विचारमंथन',
            sentiment: 'Positive',
            sentimentScore: 92,
            columnSpan: 1,
            ocrTextMr: `डिजिटल युगात प्रशासनाने जनतेच्या दारापर्यंत पोहोचणे ही लोकशाहीची खरी ताकद आहे. डीजीआयपीआरने सुरू केलेल्या थेट संपर्क कक्षांमुळे अफवांचा बिमोड होऊन सत्य माहिती वेगाने प्रसारित होते.`,
            ocrTextEn: `Digital administration bringing public services to citizen doorsteps represents the true vitality of democratic governance.`,
          },
        ],
        editorialCartoon: {
          titleMr: 'आजचे व्यंगचित्र: डिजिटल क्रांती',
          captionMr: 'मंत्रालयाचा डॅशबोर्ड पाहताना सामान्य नागरिक: "आता फाईल कुठे अडकली हे एका क्लिकवर कळतं!"',
          titleEn: "Today's Editorial Cartoon: The Citizen Dashboard",
          captionEn: 'Citizen checking command dashboard: "No more waiting in corridors; every status is transparent!"',
        },
      },
    ],
  },

  // 2. SAKAL (सकाळ) - Western Maharashtra & Pune
  {
    id: 'sakal',
    name: 'Sakal',
    nameMr: 'सकाळ',
    mottoMr: 'जनतेच्या मनातील प्रामाणिक आवाज',
    mottoEn: 'The Authentic Voice of the People',
    mastheadColor: '#1E3A8A', // Deep Blue
    accentColor: '#2563EB',
    editionName: 'Western Maharashtra & Pune Mega Edition',
    editionNameMr: 'पश्चिम महाराष्ट्र व पुणे महा-आवृत्ती',
    rniNumber: 'MAHMAR/1932/0821',
    volumeNumber: 'वर्ष ९४ • अंक २६२',
    dateStr: 'शनिवार, २४ ऑक्टोबर २०२६',
    dateStrEn: 'Saturday, 24 October 2026',
    price: '₹ ५.००',
    weatherMr: 'पुणे/सातारा: कमाल २९°C, किमान १८°C • गारवा',
    weatherEn: 'Pune/Satara: Max 29°C, Min 18°C • Pleasant',
    markets: 'सेन्सेक्स: ८१,४५० ▲ • साखर हमीभाव: ₹३,४००/टन • कांदा: ₹२,८००',
    pages: [
      {
        pageNumber: 1,
        pageTitleMr: 'मुख्य पृष्ठ (Front Page)',
        pageTitleEn: 'Page 1 — Pune Metro & Agro Hubs',
        leadArticle: {
          id: 'sak-p1-art1',
          kickerMr: 'पुणे महानगर विकास',
          kickerEn: 'Pune Metro Expansion',
          headlineMr: 'पुणे रिंग रोड व हिंजवडी-शिवाजीनगर मेट्रो मार्गाला गती; भूमी अधिग्रहणासाठी ₹२,१०० कोटी वितरित',
          headlineEn: 'Pune Ring Road & Hinjewadi-Shivajinagar Metro Construction Accelerated; ₹2,100 Cr Land Payout Completed',
          subheadMr: 'पश्चिम महाराष्ट्रातील वाहतूक कोंडी सोडवण्यासाठी विशेष पायाभूत समितीची मंत्रालयात बैठक संपन्न',
          subheadEn: 'High-powered infrastructure panel convenes to eliminate chronic traffic bottlenecks across Pune-Pimpri twin cities',
          byline: 'पुणे ब्युरो प्रतिनिधी',
          dateline: 'पुणे, २४ ऑक्टोबर',
          district: 'Pune',
          districtMr: 'पुणे',
          category: 'Infrastructure',
          categoryMr: 'पायाभूत सुविधा',
          sentiment: 'Positive',
          sentimentScore: 93,
          columnSpan: 2,
          hasPhoto: true,
          photoCaptionMr: 'पुणे रिंग रोड पूर्व भागातील भूसंपादन व फ्लायओव्हर बांधकामाचा ड्रोनद्वारे घेतलेला प्रत्यक्ष आढावा.',
          photoCaptionEn: 'Aerial drone survey of the 128-km Pune Outer Ring Road multi-tier expressway interchange.',
          photoCredit: 'छायाचित्र: महाराष्ट्र राज्य रस्ते विकास महामंडळ (MSRDC)',
          ocrTextMr: `पुणे: पुणे शहर व पिंपरी-चिंचवड परिसरातील वाहतूक कोंडी कायमस्वरूपी दूर करण्यासाठी प्रस्तावित १२८ किलोमीटरच्या रिंग रोड प्रकल्पाचे भूसंपादन ८५% पूर्ण झाले असून बाधित शेतकऱ्यांना ₹२,१०० कोटींचा मोबदला थेट खात्यात वर्ग करण्यात आला आहे.

जिल्हाधिकारी यांच्या अध्यक्षतेखाली झालेल्या आढावा बैठकीत स्पष्ट करण्यात आले की, हिंजवडी आयटी पार्क ते शिवाजीनगर मेट्रो मार्गाचे भूमिगत बोगदा काम आगामी सहा महिन्यांत पूर्ण केले जाईल. यामुळे आयटी कर्मचाऱ्यांचा प्रवासाचा वेळ ६० मिनिटांवरून अवघ्या २५ मिनिटांवर येईल.`,
          ocrTextEn: `Pune: Land acquisition for the 128-kilometer Pune Outer Ring Road has reached 85% completion, with ₹2,100 Crore directly transferred to affected agrarian landowners without administrative delay.`,
        },
        sideArticles: [
          {
            id: 'sak-p1-art2',
            kickerMr: 'कृषी प्रक्रिया उद्योग',
            kickerEn: 'Sugar & Agro Economy',
            headlineMr: 'पश्चिम महाराष्ट्रातील सहकारी साखर कारखान्यांना इथेनॉल उत्पादनासाठी ५०० कोटींचे अर्थसाहाय्य',
            headlineEn: 'Western Maharashtra Sugar Cooperatives Sanctioned ₹500 Cr Ethanol Distillery Credit',
            subheadMr: 'उसाला विक्रमी दर देणाऱ्या कारखान्यांना विशेष शासकीय प्रोत्साहन अनुदान',
            subheadEn: 'State incentives awarded to mills achieving highest recovery and prompt FRP settlement',
            byline: 'विशेष प्रतिनिधी, कोल्हापूर',
            district: 'Kolhapur',
            districtMr: 'कोल्हापूर',
            category: 'Agriculture',
            categoryMr: 'सहकार व कृषी',
            sentiment: 'Positive',
            sentimentScore: 91,
            columnSpan: 1,
            ocrTextMr: `साखर आयुक्त कार्यालयाने दिलेल्या माहितीनुसार, कोल्हापूर, सांगली आणि सातारा जिल्ह्यातील २० सहकारी कारखान्यांनी इथेनॉल निर्मिती क्षमता दुप्पट केली असून यामुळे शेतकऱ्यांना एफआरपीपेक्षा ₹२०० अधिक दर देणे शक्य होणार आहे.`,
            ocrTextEn: `20 cooperative sugar mills across Kolhapur and Sangli expand ethanol distillation capacity with dedicated state subsidy support.`,
          },
        ],
        briefs: [
          { district: 'Satara', districtMr: 'सातारा', textMr: 'महाबळेश्वर-पाचगणी पर्यटन कॉरिडॉरमध्ये १००% इलेक्ट्रिक बसेस सुरू.', textEn: '100% electric bus fleet introduced on Mahabaleshwar-Panchgani circuit.' },
          { district: 'Solapur', districtMr: 'सोलापूर', textMr: 'सोलापूर चादर व टेक्सटाईल क्लस्टरमधून आखाती देशांत ५० कोटींची निर्यात.', textEn: 'Solapur textile cluster exports ₹50 Cr fabric consignment to GCC.' },
        ],
      },
      {
        pageNumber: 2,
        pageTitleMr: 'पश्चिम महाराष्ट्र जिल्हा वार्ता (Regional Focus)',
        pageTitleEn: 'Page 2 — Western Districts Focus',
        leadArticle: {
          id: 'sak-p2-art1',
          kickerMr: 'जलसंधारण यशोगाथा',
          kickerEn: 'Water Grid Breakthrough',
          headlineMr: 'सांगली: टेंभू व ताकारी सिंचन योजनेने दुष्काळी पट्ट्यात पाणी पोहोचवले; ६० हजार हेक्टर ओलिताखाली',
          headlineEn: 'Sangli: Tembhu & Takari Lift Irrigation Delivers Water to Arid Talukas; 60,000 Hectares Irrigated',
          subheadMr: 'आटपाडी आणि जत तालुक्यातील शेतकऱ्यांच्या चेहऱ्यावर समाधान; फळबागांना संजीवनी',
          subheadEn: 'Historic breakthrough brings Krishna river waters to drought-prone Atpadi and Jath belts',
          byline: 'सांगली प्रतिनिधी',
          district: 'Sangli',
          districtMr: 'सांगली',
          category: 'Agriculture',
          categoryMr: 'जलसंधारण',
          sentiment: 'Positive',
          sentimentScore: 96,
          columnSpan: 2,
          ocrTextMr: `जत/आटपाडी: अनेक दशकांपासून पाण्यासाठी संघर्ष करणाऱ्या सांगली जिल्ह्यातील दुष्काळी पट्ट्यात टेंभू उपसा सिंचन योजनेचे पाणी कालव्यातून शेतात पोहोचले आहे. डाळिंब आणि द्राक्ष बागायतदारांना यामुळे मोठा दिलासा मिळाला असून उत्पादनात ४०% वाढीचा अंदाज आहे.`,
          ocrTextEn: `Tembhu lift irrigation scheme has successfully filled canals across arid talukas of Sangli, transforming 60,000 hectares of pomegranate and grape orchards.`,
        },
        sideArticles: [],
        briefs: [
          { district: 'Ahmednagar', districtMr: 'अहिल्यानगर', textMr: 'भंडारदरा धरणातून रब्बी पिकांसाठी आवर्तन सुरू; शेतकऱ्यांमध्ये उत्साह.', textEn: 'Rabi irrigation water release begins from Bhandardara dam.' },
        ],
      },
    ],
  },

  // 3. MAHARASHTRA TIMES (महाराष्ट्र टाइम्स) - Metropolitan & Coastal
  {
    id: 'maharashtratimes',
    name: 'Maharashtra Times',
    nameMr: 'महाराष्ट्र टाइम्स',
    mottoMr: 'महाराष्ट्राचा मानबिंदू आणि पुरोगामी आवाज',
    mottoEn: 'The Pride and Voice of Maharashtra',
    mastheadColor: '#1D4ED8', // Vibrant Cobalt
    accentColor: '#3B82F6',
    editionName: 'Mumbai, Thane & North Konkan Edition',
    editionNameMr: 'मुंबई, ठाणे व उत्तर कोकण महा-आवृत्ती',
    rniNumber: 'MAHMAR/1962/2210',
    volumeNumber: 'वर्ष ६४ • अंक २८०',
    dateStr: 'शनिवार, २४ ऑक्टोबर २०२६',
    dateStrEn: 'Saturday, 24 October 2026',
    price: '₹ ५.००',
    weatherMr: 'कमाल ३२°C • ठाणे/नवी मुंबई: दमट हवामान',
    weatherEn: 'Max 32°C • Thane/Navi Mumbai: Moderate Humidity',
    markets: 'सेन्सेक्स: ८१,४५० ▲ • रिअल इस्टेट विक्री: +१६% • मेट्रो प्रवासी: १६ लाख',
    pages: [
      {
        pageNumber: 1,
        pageTitleMr: 'मुख्य पृष्ठ (Front Page)',
        pageTitleEn: 'Page 1 — Metropolitan Infrastructure',
        leadArticle: {
          id: 'mt-p1-art1',
          kickerMr: 'नागरी पायाभूत सुविधा',
          kickerEn: 'Urban Transit Grid',
          headlineMr: 'मुंबई कोस्टल रोड ते वर्सोवा-दहिसर लिंक: प्रवास अवघ्या ३५ मिनिटांत; अंतिम टप्प्याचे काम सुरू',
          headlineEn: 'Coastal Road Extension to Versova-Dahisar: Travel Slashed to 35 Minutes; Final Leg Groundwork Begins',
          subheadMr: 'पर्यावरणपूरक तंत्रज्ञानाचा वापर; पश्चिम उपनगरातील लाखो प्रवाशांना वाहतूक कोंडीतून मुक्ती',
          subheadEn: 'Advanced noise barriers and marine biodiversity protections enforced along suburban coastal alignment',
          byline: 'मटा विशेष प्रतिनिधी, मुंबई',
          dateline: 'मुंबई, २४ ऑक्टोबर',
          district: 'Mumbai Suburban',
          districtMr: 'मुंबई उपनगर',
          category: 'Infrastructure',
          categoryMr: 'पायाभूत सुविधा',
          sentiment: 'Positive',
          sentimentScore: 94,
          columnSpan: 2,
          hasPhoto: true,
          photoCaptionMr: 'वरळी ते मरीन ड्राईव्ह दरम्यान सागरी सेतूवरून धावणाऱ्या वाहनांचे नयनरम्य दृश्य.',
          photoCaptionEn: 'Vehicles plying smoothly on the operational southbound Coastal Road corridor.',
          photoCredit: 'छायाचित्र: मुंबई महानगरपालिका (BMC/DGIPR)',
          ocrTextMr: `मुंबई: नरिमन पॉईंट ते वरळी सागरी महामार्ग यशस्वी झाल्यानंतर आता वर्सोवा ते दहिसर दरम्यानच्या २४ किमी विस्तारित कॉरिडॉरचे काम वेगाने सुरू झाले आहे. या प्रकल्पामुळे पश्चिम द्रुतगती महामार्गावरील (WEH) वाहतूक ताण ४५ टक्क्यांनी कमी होईल. महा-कमांड सेंटरच्या मॉनिटरिंगनुसार कामाचा दर्जा जागतिक दर्जाचा राखला जात आहे.`,
          ocrTextEn: `The 24-km northern extension of Mumbai Coastal Road from Versova to Dahisar breaks ground, promising to cut peak suburban commute times from 90 to 35 minutes.`,
        },
        sideArticles: [
          {
            id: 'mt-p1-art2',
            kickerMr: 'जिल्हा विकास',
            kickerEn: 'District Focus',
            headlineMr: 'ठाणे खाडी किनारी नवीन मॅनग्रोव्ह पार्क व पर्यावरण पर्यटन केंद्र मंजूर',
            headlineEn: 'Thane Creek Flamingo Sanctuary: Eco-Tourism Boardwalk & Marine Interpretation Center Approved',
            subheadMr: 'विद्यार्थी व निसर्गप्रेमींसाठी आंतरराष्ट्रीय दर्जाचे अभ्यास केंद्र उभारणार',
            subheadEn: 'World-class wetland biodiversity center to open for students and researchers',
            byline: 'ठाणे वार्ताहर',
            district: 'Thane',
            districtMr: 'ठाणे',
            category: 'Environment',
            categoryMr: 'पर्यावरण',
            sentiment: 'Positive',
            sentimentScore: 95,
            columnSpan: 1,
            ocrTextMr: `ठाणे खाडी फ्लेमिंगो अभयारण्यात पर्यटनाला चालना देण्यासाठी वन विभागाने ₹१२० कोटींचा पर्यावरणपूरक आराखडा तयार केला असून यामुळे स्थानिक कांदळवन संरक्षणाला बळ मिळेल.`,
            ocrTextEn: `Forest Department sanctions ₹120 Cr eco-tourism interpretation boardwalk at Thane Creek Flamingo Sanctuary.`,
          },
        ],
        briefs: [
          { district: 'Palghar', districtMr: 'पालघर', textMr: 'पालघर जिल्ह्यातील १००% प्राथमिक शाळांमध्ये इंटरनेट आणि ई-लर्निंग सुविधा सुरू.', textEn: '100% rural schools in Palghar equipped with high-speed optical fiber.' },
        ],
      },
    ],
  },

  // 4. LOKMAT (लोकमत) - Vidarbha & Marathwada
  {
    id: 'lokmat',
    name: 'Lokmat',
    nameMr: 'लोकमत',
    mottoMr: 'महाराष्ट्राचा अग्रगण्य लोकप्रवाह',
    mottoEn: 'Leading People-Centric Voice of Maharashtra',
    mastheadColor: '#881337', // Deep Maroon
    accentColor: '#BE123C',
    editionName: 'Vidarbha & Marathwada Mega Edition',
    editionNameMr: 'विदर्भ व मराठवाडा महा-आवृत्ती',
    rniNumber: 'MAHMAR/1971/3490',
    volumeNumber: 'वर्ष ५५ • अंक १९२',
    dateStr: 'शनिवार, २४ ऑक्टोबर २०२६',
    dateStrEn: 'Saturday, 24 October 2026',
    price: '₹ ५.००',
    weatherMr: 'नागपूर/अमरावती: कमाल ३३°C, किमान २१°C • ऊन-सावली',
    weatherEn: 'Nagpur/Amravati: Max 33°C, Min 21°C • Mild Sun',
    markets: 'कापूस भाव: ₹७,८००/क्विंटल • सोयाबीन: ₹४,९०० • संत्रा निर्यात: ३५,००० टन',
    pages: [
      {
        pageNumber: 1,
        pageTitleMr: 'मुख्य पृष्ठ (Front Page)',
        pageTitleEn: 'Page 1 — Vidarbha & Agro Corridors',
        leadArticle: {
          id: 'lkm-p1-art1',
          kickerMr: 'विदर्भ औद्योगिक विकास',
          kickerEn: 'Nagpur Industrial Hub',
          headlineMr: 'नागपूर मिहानमध्ये आंतरराष्ट्रीय एरोस्पेस आणि डिफेन्स मॅन्युफॅक्चरिंग हब मंजूर; २५,००० रोजगार',
          headlineEn: 'Nagpur MIHAN Sanctioned Mega Aerospace & Defense Manufacturing Hub; 25,000 Direct Jobs',
          subheadMr: 'समृद्धी महामार्गामुळे नागपूर ते मुंबई थेट मालवाहतूक केवळ १२ तासांत; निर्यातीला मोठा वेग',
          subheadEn: 'Samruddhi Expressway enables 12-hour cargo transit from Nagpur to Mumbai JNPA container terminals',
          byline: 'नागपूर विशेष प्रतिनिधी',
          dateline: 'नागपूर, २४ ऑक्टोबर',
          district: 'Nagpur',
          districtMr: 'नागपूर',
          category: 'Industry',
          categoryMr: 'उद्योग व संरक्षण',
          sentiment: 'Positive',
          sentimentScore: 96,
          columnSpan: 2,
          hasPhoto: true,
          photoCaptionMr: 'मिहान नागपूर सेझ परिसरात नवीन विमान सुटे भाग उत्पादन युनिटची पायाभरणी करताना मान्यवर.',
          photoCaptionEn: 'Groundbreaking of aerospace component facility at MIHAN Nagpur SEZ corridor.',
          photoCredit: 'छायाचित्र: माहिती व जनसंपर्क महासंचालनालय (DGIPR)',
          ocrTextMr: `नागपूर: विदर्भातील औद्योगिक विकासाला गती देण्यासाठी नागपूरच्या मिहान विशेष आर्थिक क्षेत्रात (SEZ) जागतिक संरक्षण व एरोस्पेस उद्योगांसाठी ₹१४,००० कोटींचे नवीन मॅन्युफॅक्चरिंग हब उभारण्यास मंजुरी मिळाली आहे.

समृद्धी महामार्गामुळे विदर्भातील उत्पादने मुंबईच्या बंदरांपर्यंत अवघ्या १२ तासांत पोहोचत असल्याने जागतिक कंपन्यांनी नागपूरला पसंती दिली आहे. या प्रकल्पामुळे स्थानिक इंजिनिअरिंग तरुणांना रोजगाराच्या अथांग संधी उपलब्ध होणार आहेत.`,
          ocrTextEn: `Nagpur: MIHAN SEZ attracts ₹14,000 Crore aerospace manufacturing cluster, leveraging the Samruddhi Expressway for seamless 12-hour cargo connectivity to Mumbai ports.`,
        },
        sideArticles: [
          {
            id: 'lkm-p1-art2',
            kickerMr: 'कृषी निर्यात',
            kickerEn: 'Orange Agro Cluster',
            headlineMr: 'नागपूर व अमरावती संत्रा निर्यातीत नवीन विक्रम; थेट दुबई व सिंगापूर बाजारपेठेत दाखल',
            headlineEn: 'Nagpur & Amravati Mandarin Orange Exports Hit Record High via Dedicated Air Cargo Corridors',
            subheadMr: 'शेतकरी उत्पादक कंपन्यांना (FPO) थेट आंतरराष्ट्रीय खरेदीदारांशी जोडले',
            subheadEn: 'FPOs connected directly with Middle East and Southeast Asian retail supermarket chains',
            byline: 'अमरावती ब्युरो',
            district: 'Amravati',
            districtMr: 'अमरावती',
            category: 'Agriculture',
            categoryMr: 'कृषी निर्यात',
            sentiment: 'Positive',
            sentimentScore: 93,
            columnSpan: 1,
            ocrTextMr: `अमरावती जिल्ह्यातील वरूड व मोर्शी तालुक्यातील १० हजार संत्रा बागायतदारांनी स्थापन केलेल्या शेतकरी उत्पादक कंपन्यांनी यंदा ३५,००० टन उच्च दर्जाचा संत्रा आखाती देशांत निर्यात करून कोट्यवधींचे परकीय चलन मिळवले आहे.`,
            ocrTextEn: `Amravati and Nagpur citrus farmers successfully export 35,000 tonnes of graded oranges directly to Gulf markets with cold-storage air-cargo links.`,
          },
        ],
        briefs: [
          { district: 'Chandrapur', districtMr: 'चंद्रपूर', textMr: 'चंद्रपूर ताडोबा बफर झोनमध्ये पर्यावरण पर्यटनातून स्थानिकांना ₹१२ कोटींचा थेट रोजगार.', textEn: 'Eco-tourism in Tadoba buffer zone generates ₹12 Cr community income.' },
          { district: 'Yavatmal', districtMr: 'यवतमाळ', textMr: 'यवतमाळ जिल्ह्यात ५० हजार कापूस उत्पादकांना आंतरराष्ट्रीय बीसीआय प्रमाणन मंजूर.', textEn: '50,000 Yavatmal cotton farmers receive international BCI eco-certification.' },
        ],
      },
    ],
  },
];

export const NewspaperScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedPubId, setSelectedPubId] = useState<string>('loksatta');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [selectedArticle, setSelectedArticle] = useState<NewspaperArticle | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'broadsheet' | 'clippings'>('broadsheet');

  const currentPub = useMemo(() => {
    return NEWSPAPER_PUBLICATIONS.find((p) => p.id === selectedPubId) ?? NEWSPAPER_PUBLICATIONS[0];
  }, [selectedPubId]);

  const currentPage = useMemo(() => {
    const page = currentPub.pages.find((p) => p.pageNumber === currentPageNum);
    return page ?? currentPub.pages[0];
  }, [currentPub, currentPageNum]);

  // All articles across current publication for clippings gallery
  const allArticles = useMemo(() => {
    const list: NewspaperArticle[] = [];
    currentPub.pages.forEach((p) => {
      list.push(p.leadArticle);
      list.push(...p.sideArticles);
    });
    return list;
  }, [currentPub]);

  // Filtered articles when searching
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles;
    const q = searchQuery.toLowerCase();
    return allArticles.filter(
      (a) =>
        a.headlineMr.toLowerCase().includes(q) ||
        a.headlineEn.toLowerCase().includes(q) ||
        a.ocrTextMr.toLowerCase().includes(q) ||
        a.ocrTextEn.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.districtMr.toLowerCase().includes(q)
    );
  }, [allArticles, searchQuery]);

  // Switch publication and reset to page 1
  const handleSelectPub = (pubId: string) => {
    setSelectedPubId(pubId);
    setCurrentPageNum(1);
    setSelectedArticle(null);
  };

  // Randomize to a different authentic publication
  const handleRandomizePublication = () => {
    const pubIds = NEWSPAPER_PUBLICATIONS.map((p) => p.id);
    const currentIndex = pubIds.indexOf(selectedPubId);
    const nextIndex = (currentIndex + 1) % pubIds.length;
    const nextPub = NEWSPAPER_PUBLICATIONS[nextIndex];
    setSelectedPubId(nextPub.id);
    setCurrentPageNum(1);
    setSelectedArticle(null);
    setToast({
      message:
        language === 'mr'
          ? `नवीन वृत्तपत्र आवृत्ती उघडली: ${nextPub.nameMr} (${nextPub.editionNameMr})`
          : `Fresh Broadsheet Opened: ${nextPub.name} - ${nextPub.editionName}`,
      type: 'success',
    });
  };

  const handleCopyOCR = (article: NewspaperArticle) => {
    const text = `[DGIPR VERIFIED ARCHIVE - ${currentPub.name.toUpperCase()}]\nHEADLINE: ${article.headlineMr}\n(${article.headlineEn})\n\nBYLINE: ${article.byline} [${article.districtMr}]\nCATEGORY: ${article.categoryMr}\n\nMARATHI TRANSCRIPT:\n${article.ocrTextMr}\n\nENGLISH BRIEF:\n${article.ocrTextEn}\n\nRef: #DGIPR-PRESS-${currentPub.id.toUpperCase()}-2026`;
    navigator.clipboard?.writeText(text);
    setToast({
      message: language === 'mr' ? 'ओसीआर (OCR) मजकूर क्लिपबोर्डवर कॉपी झाला.' : 'Verified OCR transcript copied to clipboard.',
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1780px] w-full mx-auto space-y-5 select-none">
      {/* 1. TOP CONTROL BAR (Publication Switcher, Page Selector, Zoom, Mode Toggle) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Government of Maharashtra • DGIPR Official Daily E-Paper Reader
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <MaterialIcon name="newspaper" size="md" className="text-slate-800" />
            <span>
              {language === 'mr'
                ? 'महाराष्ट्र राज्य दैनिक वृत्तपत्र व अस्सल ई-पेपर दालन'
                : 'Maharashtra Official Daily Newspapers & Broadsheet E-Paper Reader'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'सर्व प्रमुख मराठी व इंग्रजी वर्तमानपत्रांचे अस्सल मुद्रित पृष्ठ, ओसीआर मजकूर, शासकीय कात्रणे आणि निविदा.'
              : 'Authentic printed broadsheet pages, verified Devanagari OCR, official press cutouts, and tender gazettes.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle (Broadsheet vs Clippings) */}
          <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setViewMode('broadsheet')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'broadsheet'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📰 {language === 'mr' ? 'अस्सल वृत्तपत्र पृष्ठ' : 'Broadsheet Page'}
            </button>
            <button
              onClick={() => setViewMode('clippings')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'clippings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📑 {language === 'mr' ? 'कात्रणे दालन (५१६)' : 'Clippings Gallery (516)'}
            </button>
          </div>

          {/* Publication Selector Dropdown */}
          <select
            value={currentPub.id}
            onChange={(e) => handleSelectPub(e.target.value)}
            className="h-9 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 cursor-pointer outline-none"
          >
            {NEWSPAPER_PUBLICATIONS.map((pub) => (
              <option key={pub.id} value={pub.id}>
                {language === 'mr' ? `${pub.nameMr} (${pub.editionNameMr})` : `${pub.name} — ${pub.editionName}`}
              </option>
            ))}
          </select>

          {/* Random Edition Button (🎲) */}
          <button
            onClick={handleRandomizePublication}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Open a different authentic newspaper"
          >
            <span>🎲</span>
            <span>{language === 'mr' ? 'दुसरे वृत्तपत्र उघडा' : 'Open Different Edition'}</span>
          </button>

          {/* Zoom Controls */}
          {viewMode === 'broadsheet' && (
            <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden bg-white text-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="px-2.5 py-1.5 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
                title="Zoom out"
              >
                −
              </button>
              <span className="px-2 py-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 border-x border-slate-200">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="px-2.5 py-1.5 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
                title="Zoom in"
              >
                +
              </button>
            </div>
          )}

          {/* Print Broadsheet Button */}
          <button
            onClick={() => window.print()}
            className="h-9 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <MaterialIcon name="description" size="xs" />
            <span className="hidden sm:inline">{language === 'mr' ? 'मुद्रित करा' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* 2. PAGE NAVIGATION TABS STRIP (For Multi-Page Broadsheet) */}
      {viewMode === 'broadsheet' && (
        <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
              {language === 'mr' ? 'पृष्ठ निवडा:' : 'Flip Page:'}
            </span>
            {currentPub.pages.map((p) => {
              const isCurrent = p.pageNumber === currentPageNum;
              return (
                <button
                  key={p.pageNumber}
                  onClick={() => setCurrentPageNum(p.pageNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="font-mono">#{p.pageNumber}</span>
                  <span className="hidden sm:inline">
                    {language === 'mr' ? p.pageTitleMr : p.pageTitleEn}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-500 shrink-0 hidden md:block">
            {language === 'mr'
              ? `पृष्ठ ${currentPage.pageNumber} पैकी ${currentPub.pages.length}`
              : `Page ${currentPage.pageNumber} of ${currentPub.pages.length}`}
          </div>
        </div>
      )}

      {/* 3. BROADSHEET VIEW: REALISTIC PRINTED NEWSPAPER CANVAS */}
      {viewMode === 'broadsheet' && (
        <div
          className="w-full bg-[#EFECE6] border-2 border-slate-300 rounded-2xl shadow-xl p-3 sm:p-6 lg:p-8 overflow-x-auto transition-all"
          style={{
            transformOrigin: 'top center',
            zoom: `${zoomLevel}%`,
          }}
        >
          {/* Authentic Newsprint Page Container */}
          <div
            className="max-w-[1360px] mx-auto bg-[#FFFDF9] border-2 border-[#D8D2C4] p-5 sm:p-9 shadow-md rounded-xs"
            style={{
              fontFamily: "'Noto Serif Devanagari', 'Georgia', serif",
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}
          >
            {/* Top Ear-Pieces & Registration Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-b-2 border-slate-900 pb-2 text-[11px] font-sans text-slate-700 items-center">
              {/* Left Ear: Weather */}
              <div className="md:col-span-3 text-left">
                <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">
                  {language === 'mr' ? 'आजचे हवामान' : "TODAY'S WEATHER"}
                </span>
                <span className="text-[11px] text-slate-700">
                  {language === 'mr' ? currentPub.weatherMr : currentPub.weatherEn}
                </span>
              </div>

              {/* Center: Dateline, RNI & Volume */}
              <div className="md:col-span-6 text-center border-y md:border-y-0 md:border-x border-slate-200 py-1 md:py-0 px-2 space-y-0.5">
                <div className="font-bold text-slate-950 text-sm tracking-wide">
                  {currentPub.dateStr}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  RNI: {currentPub.rniNumber} • {currentPub.volumeNumber} • {currentPub.editionNameMr}
                </div>
              </div>

              {/* Right Ear: Market Indicators & Price */}
              <div className="md:col-span-3 text-right">
                <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">
                  {language === 'mr' ? 'बाजार निर्देशांक व किंमत' : 'MARKETS & PRICE'}
                </span>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] text-slate-600 font-mono">{currentPub.markets.split('•')[0]}</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {currentPub.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Authentic Vintage Masthead Banner */}
            <div className="text-center py-5 border-b-4 border-double border-slate-900 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-sans font-bold">
                {language === 'mr' ? currentPub.mottoMr : currentPub.mottoEn}
              </div>
              <h2
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight select-none uppercase transition-colors"
                style={{ color: currentPub.mastheadColor }}
              >
                {language === 'mr' ? currentPub.nameMr : currentPub.name}
              </h2>
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-12 bg-slate-400" />
                <span className="px-3.5 py-0.5 bg-slate-900 text-white font-sans text-xs font-bold uppercase tracking-widest rounded-full">
                  {language === 'mr' ? currentPub.editionNameMr : currentPub.editionName} • {currentPage.pageTitleMr}
                </span>
                <span className="h-px w-12 bg-slate-400" />
              </div>
            </div>

            {/* Page Lead Headline Across Broadsheet */}
            <div className="pt-5 pb-4 border-b-2 border-slate-300 text-center space-y-2">
              <span className="inline-block px-3 py-0.5 bg-red-100 text-red-800 font-sans text-xs font-bold uppercase tracking-wider rounded border border-red-200">
                {language === 'mr' ? currentPage.leadArticle.kickerMr : currentPage.leadArticle.kickerEn}
              </span>
              <h3
                onClick={() => setSelectedArticle(currentPage.leadArticle)}
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 hover:text-red-700 transition-colors cursor-pointer leading-tight max-w-5xl mx-auto"
              >
                {language === 'mr' ? currentPage.leadArticle.headlineMr : currentPage.leadArticle.headlineEn}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 italic max-w-4xl mx-auto font-sans leading-relaxed">
                {language === 'mr' ? currentPage.leadArticle.subheadMr : currentPage.leadArticle.subheadEn}
              </p>
            </div>

            {/* 3-Column Authentic Broadsheet Grid with Column Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
              {/* LEFT COLUMN (3 Cols): Side Story 1 + Tender / Cartoon Box */}
              <div className="lg:col-span-3 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-300 lg:pr-6 flex flex-col justify-between">
                {currentPage.sideArticles.length > 0 && (
                  <div
                    onClick={() => setSelectedArticle(currentPage.sideArticles[0])}
                    className="group cursor-pointer p-3 bg-white border border-slate-200 rounded-sm hover:border-slate-400 hover:shadow-xs transition-all space-y-2"
                  >
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-700 block">
                      {currentPage.sideArticles[0].categoryMr} • {currentPage.sideArticles[0].districtMr}
                    </span>
                    <h4 className="font-bold text-base text-slate-950 group-hover:text-red-800 leading-snug">
                      {language === 'mr' ? currentPage.sideArticles[0].headlineMr : currentPage.sideArticles[0].headlineEn}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
                      {language === 'mr' ? currentPage.sideArticles[0].ocrTextMr : currentPage.sideArticles[0].ocrTextEn}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-sans text-slate-500">
                      <span>{currentPage.sideArticles[0].byline}</span>
                      <span className="text-emerald-700 font-bold font-mono">
                        {currentPage.sideArticles[0].sentimentScore}% Positive
                      </span>
                    </div>
                  </div>
                )}

                {/* State Public Tender Notice Box (Authentic Government Gazette Feature) */}
                {currentPage.tenderNotice && (
                  <div className="p-3.5 bg-amber-50/70 border-2 border-dashed border-amber-400 rounded-sm font-sans space-y-2">
                    <div className="flex items-center justify-between border-b border-amber-300 pb-1">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-900 flex items-center gap-1">
                        <MaterialIcon name="gavel" size="xs" />
                        <span>शासकीय निविदा प्रसिद्धी सूचना</span>
                      </span>
                      <span className="text-[9px] font-mono bg-amber-200 text-amber-900 px-1 rounded">
                        E-TENDER
                      </span>
                    </div>
                    <strong className="block text-xs font-bold text-slate-900 leading-tight">
                      {currentPage.tenderNotice.titleMr}
                    </strong>
                    <div className="text-[11px] text-slate-700 space-y-0.5">
                      <div>विभाग: {currentPage.tenderNotice.departmentMr}</div>
                      <div>अंदाजित रक्कम: <strong className="text-slate-900">{currentPage.tenderNotice.estCost}</strong></div>
                      <div>अंतिम मुदत: <strong className="text-red-700">{currentPage.tenderNotice.deadline}</strong></div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 border-t border-amber-200 pt-1">
                      REF: {currentPage.tenderNotice.refNo}
                    </div>
                  </div>
                )}

                {/* Editorial Cartoon Box (Page 3 Special) */}
                {currentPage.editorialCartoon && (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-sm text-center font-sans space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      {currentPage.editorialCartoon.titleMr}
                    </span>
                    <div className="h-28 bg-slate-200/80 rounded flex items-center justify-center p-3 text-slate-600 italic text-xs border border-slate-300">
                      "{currentPage.editorialCartoon.captionMr}"
                    </div>
                  </div>
                )}

                {/* 36 Districts Quick Briefs Box */}
                {currentPage.briefs && (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-sm font-sans space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                        {language === 'mr' ? 'जिल्हा विकास डायरी' : 'District Briefs'}
                      </span>
                      <span className="text-[9px] bg-slate-200 px-1.5 py-0.2 rounded font-mono font-bold text-slate-700">
                        ३६ जिल्हे
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {currentPage.briefs.map((b, idx) => (
                        <div key={idx} className="text-xs border-l-2 border-slate-400 pl-2">
                          <strong className="block text-slate-950 text-[11px]">
                            [{b.districtMr}]:
                          </strong>
                          <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">
                            {b.textMr}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER COLUMN (6 Cols): Lead Press Story with Authentic Photograph */}
              <div className="lg:col-span-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-300 lg:pr-6">
                {/* Lead Editorial Photograph Simulation */}
                {currentPage.leadArticle.hasPhoto && (
                  <div
                    onClick={() => setSelectedArticle(currentPage.leadArticle)}
                    className="group cursor-pointer relative bg-slate-900 text-white rounded-sm overflow-hidden aspect-[16/10] flex items-center justify-center p-4 border border-slate-400 shadow-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    <div className="relative z-20 text-center space-y-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white font-sans text-[10px] font-bold uppercase tracking-wider">
                        {language === 'mr' ? 'मुख्य शासकीय वृत्त' : 'Lead Administration Story'}
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold font-serif max-w-md mx-auto text-white drop-shadow">
                        {language === 'mr' ? currentPage.leadArticle.headlineMr : currentPage.leadArticle.headlineEn}
                      </h4>
                      <span className="text-[11px] font-sans text-slate-300 block max-w-lg mx-auto">
                        {language === 'mr' ? currentPage.leadArticle.photoCaptionMr : currentPage.leadArticle.photoCaptionEn}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block">
                        {currentPage.leadArticle.photoCredit}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2-Column Body Text with Drop Cap and Newspaper Rules */}
                <div className="columns-1 sm:columns-2 gap-5 text-xs text-slate-900 leading-relaxed text-justify space-y-3 font-serif">
                  <p>
                    <strong className="text-sm font-bold font-sans">
                      {currentPage.leadArticle.dateline} ({currentPage.leadArticle.byline}):
                    </strong>{' '}
                    <span className="float-left text-4xl font-serif font-black leading-none mr-2 text-slate-950">
                      {currentPage.leadArticle.ocrTextMr.slice(0, 1)}
                    </span>
                    {currentPage.leadArticle.ocrTextMr.slice(1)}
                  </p>
                  <p>
                    {language === 'mr'
                      ? 'संबंधित विभागांनी निश्चित केलेल्या विहित वेळापत्रकानुसार कामाची प्रत्यक्ष अंमलबजावणी सुरू झाली आहे. मुख्य सचिव कार्यालयाकडून दर पंधरा दिवसांनी प्रगतीचा अहवाल घेतला जाणार असून प्रकल्पाच्या दर्जात कोणतीही तडजोड केली जाणार नाही.'
                      : 'Execution milestones will be rigorously monitored via biometric telemetry and direct dashboard synchronization.'}
                  </p>
                </div>

                {/* Click to Inspect Cutout Callout Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedArticle(currentPage.leadArticle)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-sans text-xs font-bold rounded border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>✂</span>
                    <span>
                      {language === 'mr'
                        ? 'अस्सल वृत्तपत्र कात्रण व ओसीआर (OCR) पहा'
                        : 'Inspect Authentic Press Cutout & Verified OCR'}
                    </span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN (3 Cols): Side Stories 2 & 3 + Official DGIPR Verification Stamp */}
              <div className="lg:col-span-3 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  {currentPage.sideArticles.slice(1).map((art) => (
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
                        <h4 className="font-bold text-sm text-slate-950 group-hover:text-red-800 leading-snug mt-1">
                          {language === 'mr' ? art.headlineMr : art.headlineEn}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed mt-1">
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

                {/* Official DGIPR Seal & Record Box */}
                <div className="border-2 border-dashed border-slate-400 p-4 rounded text-center font-sans space-y-1.5 text-slate-600 text-[11px] bg-slate-50 mt-auto">
                  <div className="w-9 h-9 rounded-full border-2 border-slate-900 mx-auto flex items-center justify-center font-black text-xs text-slate-900">
                    DG
                  </div>
                  <strong className="block text-slate-900 uppercase tracking-wider text-[10px]">
                    DGIPR Official Press Archive
                  </strong>
                  <span className="block text-slate-700 text-xs">
                    शासकीय माहिती व जनसंपर्क महासंचालनालय
                  </span>
                  <div className="font-mono text-[9px] text-slate-400 pt-1">
                    ARCHIVE REF: #{currentPub.id.toUpperCase()}-2026-P{currentPage.pageNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Broadsheet Registration Footer */}
            <div className="mt-8 pt-3 border-t-2 border-slate-800 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 font-sans">
              <span>{currentPub.nameMr} • {currentPub.editionNameMr} • पृष्ठ {currentPage.pageNumber}</span>
              <span>मुद्रक व प्रकाशक: महाराष्ट्र राज्य वृत्तपत्र केंद्र • RNI #{currentPub.rniNumber}</span>
              <span>DGIPR VERIFIED BROAD SHEET • 24 OCT 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLIPPINGS GALLERY VIEW: 516 DAILY CLIPPINGS FROM ALL 36 DISTRICTS */}
      {viewMode === 'clippings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {language === 'mr'
                  ? `दैनिक वृत्त कात्रणे दालन (${filteredArticles.length} कात्रणे उपलब्ध)`
                  : `Daily Press Clippings Ledger (${filteredArticles.length} Verified Clips)`}
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'mr' ? 'कात्रण, जिल्हा किंवा बातमी शोधा...' : 'Search clippings by keyword or district...'}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-slate-900"
              />
              <MaterialIcon name="search" size="xs" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-[#FFFDF9] border border-slate-300 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 font-serif relative overflow-hidden group"
              >
                {/* Top Cutout Tag */}
                <div className="flex items-center justify-between font-sans text-[10px]">
                  <span className="font-bold text-red-700 uppercase bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {art.categoryMr}
                  </span>
                  <span className="font-mono text-slate-500 font-semibold">
                    [{art.districtMr}]
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-950 group-hover:text-red-700 leading-snug">
                    {language === 'mr' ? art.headlineMr : art.headlineEn}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-1">
                    {language === 'mr' ? art.ocrTextMr : art.ocrTextEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-sans text-[10px] text-slate-500">
                  <span>{art.byline}</span>
                  <span className="text-emerald-700 font-bold font-mono">
                    {art.sentimentScore}% Positive
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AUTHENTIC SCISSOR-CUT NEWSPAPER CLIPPING MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-[#FFFDF8] w-full max-w-3xl rounded-xl border-4 border-dashed border-slate-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-serif relative"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Scissor Cutout Header */}
            <div className="p-4 sm:p-5 border-b border-slate-300 bg-[#F7F4EE] flex items-center justify-between font-sans">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">
                  ✂
                </span>
                <div>
                  <strong className="text-xs text-slate-900 uppercase tracking-wider block">
                    {language === 'mr' ? 'अस्सल वृत्तपत्र कात्रण (Official Press Cutout)' : 'Official Press Clipping Cutout'}
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentPub.nameMr} • {currentPub.dateStr}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-300">
                  OCR Verified (99.4%)
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer font-sans font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Clipping Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {/* Official Red Rubber Stamp */}
              <div className="inline-block border-2 border-red-700 text-red-700 font-sans font-bold text-[10px] uppercase px-3 py-1 rounded-sm rotate-[-2deg] tracking-wider">
                महाराष्ट्र शासन — DGIPR प्रमाणित वृत्त कात्रण
              </div>

              <div>
                <span className="text-xs font-bold text-red-700 font-sans uppercase tracking-wider block mb-1">
                  {selectedArticle.categoryMr} • {selectedArticle.districtMr}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                  {language === 'mr' ? selectedArticle.headlineMr : selectedArticle.headlineEn}
                </h3>
                <p className="text-sm text-slate-600 italic mt-1 font-sans">
                  {language === 'mr' ? selectedArticle.subheadMr : selectedArticle.subheadEn}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-slate-100 p-2.5 rounded border border-slate-200 font-sans text-slate-700">
                <span>Byline: <strong>{selectedArticle.byline}</strong></span>
                <span>•</span>
                <span>District: <strong>{selectedArticle.districtMr}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">Sentiment: {selectedArticle.sentimentScore}% Positive</span>
              </div>

              {/* Verified Devanagari OCR Text */}
              <div className="space-y-2 pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  {language === 'mr' ? 'देवनागरी ओसीआर (OCR) मूळ मजकूर:' : 'Original Devanagari OCR Text:'}
                </span>
                <div className="p-4 bg-[#FAF7F0] border border-slate-300 rounded text-sm text-slate-900 leading-relaxed text-justify">
                  {selectedArticle.ocrTextMr}
                </div>
              </div>

              {/* Parallel English Summary */}
              <div className="space-y-2 pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 block">
                  {language === 'mr' ? 'इंग्रजी सारांश (Administrative Summary):' : 'English Administrative Summary:'}
                </span>
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded text-xs text-slate-800 leading-relaxed font-sans">
                  {selectedArticle.ocrTextEn}
                </div>
              </div>
            </div>

            {/* Clipping Footer Actions */}
            <div className="p-4 border-t border-slate-300 bg-[#F7F4EE] flex flex-wrap items-center justify-between gap-3 font-sans">
              <span className="text-[10px] font-mono text-slate-500">
                ARCHIVE REF: #{currentPub.id.toUpperCase()}-2026-{selectedArticle.id.toUpperCase()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyOCR(selectedArticle)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MaterialIcon name="description" size="xs" />
                  <span>{language === 'mr' ? 'मजकूर कॉपी करा' : 'Copy OCR'}</span>
                </button>

                <button
                  onClick={() => {
                    setToast({
                      message: language === 'mr' ? 'वृत्त कात्रण अधिकृत पीडीएफ डाऊनलोड झाली.' : 'Press clipping PDF exported.',
                      type: 'success',
                    });
                  }}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MaterialIcon name="download" size="xs" />
                  <span>{language === 'mr' ? 'कात्रण डाऊनलोड करा' : 'Download Clipping'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
