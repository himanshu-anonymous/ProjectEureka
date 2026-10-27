export interface LiveEventStream {
  id: string;
  isCurrentlyLive: boolean;
  title: string;
  titleMr: string;
  speaker: string;
  speakerMr: string;
  location: string;
  locationMr: string;
  streamUrl: string;
  youtubeEmbedId: string;
  viewerCount: string;
  resolution: string;
  category: 'Cabinet Briefing' | 'Chief Minister Address' | 'Departmental Announcement' | 'Foundation & Inauguration';
  categoryMr: string;
  startTime: string;
  liveKeyTakeaways: { time: string; text: string; textMr: string }[];
}

export interface UpcomingEventSchedule {
  id: string;
  title: string;
  titleMr: string;
  date: string;
  time: string;
  location: string;
  locationMr: string;
  dignitaries: string;
  dignitariesMr: string;
  webcastStatus: 'Confirmed Live Feed' | 'Media Pool Available' | 'Live Recorded';
}

export const CURRENT_LIVE_EVENT: LiveEventStream = {
  id: 'LIVE-2026-1023',
  isCurrentlyLive: true,
  title: 'State Cabinet Decisions & Weekly Media Briefing by Hon. Chief Minister',
  titleMr: 'मा. मुख्यमंत्री यांची पत्रकार परिषद व राज्य मंत्रिमंडळ निर्णय थेट प्रक्षेपण',
  speaker: 'Hon. Chief Minister & Deputy Chief Ministers',
  speakerMr: 'मा. मुख्यमंत्री व उपमुख्यमंत्री महोदय',
  location: 'Mantralaya Media Centre, Main Hall, Mumbai',
  locationMr: 'मंत्रालय माध्यम केंद्र, मुख्य सभागृह, मुंबई',
  streamUrl: 'https://dgipr.maharashtra.gov.in/live-webcast',
  youtubeEmbedId: 'live_dgipr_stream',
  viewerCount: '16,420 Active Viewers',
  resolution: '1080p 60fps HD Low Latency',
  category: 'Cabinet Briefing',
  categoryMr: 'मंत्रिमंडळ निर्णय',
  startTime: 'Started at 11:30 AM IST (Live for 42 mins)',
  liveKeyTakeaways: [
    {
      time: '11:35 AM',
      text: 'Special Diwali bonus approved for 3.8 lakh state municipal and transport workers.',
      textMr: 'महापालिका व राज्य परिवहन (एसटी) कर्मचाऱ्यांसाठी विशेष दिवाळी सानुग्रह अनुदानास मंजुरी.',
    },
    {
      time: '11:48 AM',
      text: 'Cabinet sanctions ₹2,200 Crore for expanding feeder solar power lines to 15,000 agrarian villages.',
      textMr: '१५ हजार गावांमध्ये दिवसा अखंड वीज पुरवठ्यासाठी सौर कृषी वाहिनी प्रकल्पास २२०० कोटींची मंजुरी.',
    },
    {
      time: '12:02 PM',
      text: 'Vadhvan Port environmental mitigation and fishermen livelihood rehabilitation package ratified.',
      textMr: 'वाढवण बंदर पर्यावरण रक्षण व स्थानिक मच्छीमार पुनर्वसन पॅकेजला मंत्रिमंडळाची अंतिम मान्यता.',
    },
    {
      time: '12:10 PM',
      text: 'Arogya Vardhini universal health treatment coverage enhanced from ₹5 Lakh to ₹10 Lakh per family.',
      textMr: 'आरोग्य वर्धिनी मोफत उपचारांची मर्यादा ५ लाखांवरून १० लाख रुपये प्रति कुटुंब वाढवण्याचा निर्णय.',
    },
  ],
};

export const UPCOMING_EVENTS_SCHEDULE: UpcomingEventSchedule[] = [
  {
    id: 'EVT-SCH-01',
    title: 'Dedication of Solapur-Pune 4-Lane Highway Bypass & Agro Logistics Park',
    titleMr: 'सोलापूर-पुणे चौपदरी बायपास व कृषी लॉजिस्टिक पार्क लोकार्पण सोहळा',
    date: '24 Oct 2026',
    time: '10:30 AM IST',
    location: 'Solapur City Bypass Interchange',
    locationMr: 'सोलापूर शहर बायपास जंक्शन',
    dignitaries: 'Union Minister for Road Transport & Chief Minister',
    dignitariesMr: 'केंद्रीय रस्ते वाहतूक मंत्री व मा. मुख्यमंत्री',
    webcastStatus: 'Confirmed Live Feed',
  },
  {
    id: 'EVT-SCH-02',
    title: 'State Startup & AI Innovation Summit 2026 Opening Keynote',
    titleMr: 'महाराष्ट्र स्टार्टअप व कृत्रिम बुद्धिमत्ता परिषद २०२६ उद्घाटन',
    date: '25 Oct 2026',
    time: '02:00 PM IST',
    location: 'Jio World Convention Centre, BKC, Mumbai',
    locationMr: 'जिओ वर्ल्ड कन्व्हेन्शन सेंटर, बीकेसी, मुंबई',
    dignitaries: 'Industries Minister & Global Tech Leaders',
    dignitariesMr: 'उद्योग मंत्री व आंतरराष्ट्रीय तंत्रज्ञान तज्ज्ञ',
    webcastStatus: 'Confirmed Live Feed',
  },
  {
    id: 'EVT-SCH-03',
    title: 'Chhatrapati Shivaji Maharaj Fort Restoration Milestone Review',
    titleMr: 'शिवकालीन गडकिल्ले संवर्धन प्रगती आढावा बैठक व पत्रकार परिषद',
    date: '27 Oct 2026',
    time: '11:00 AM IST',
    location: 'Raigad Fort Base Station, Pachad',
    locationMr: 'रायगड पायथा बेस स्टेशन, पाचाड',
    dignitaries: 'Minister for Cultural Affairs & Archaeology Council',
    dignitariesMr: 'सांस्कृतिक कार्य मंत्री व पुरातत्व परिषद',
    webcastStatus: 'Media Pool Available',
  },
];

export const RECORDED_BROADCAST_ARCHIVES = [
  {
    id: 'REC-2026-091',
    title: 'Foundation Stone Laying of Thane Coastal Ring Road Phase 1',
    titleMr: 'ठाणे कोस्टल रिंग रोड टप्पा १ भूमिपूजन सोहळा',
    date: '19 Oct 2026',
    duration: '48 mins',
    views: '124,000 views',
    thumbnail: '/streams/thane-coastal.png',
  },
  {
    id: 'REC-2026-092',
    title: 'Full Launch Ceremony: Mukhyamantri Majhi Ladki Bahin Portal',
    titleMr: 'मुख्यमंत्री माझी लाडकी बहीण ऑनलाइन पोर्टल अधिकृत लोकार्पण',
    date: '14 Oct 2026',
    duration: '62 mins',
    views: '340,000 views',
    thumbnail: '/streams/ladki-bahin-launch.png',
  },
  {
    id: 'REC-2026-093',
    title: 'Press Briefing on Marathwada Water Grid Fast-Tracking',
    titleMr: 'मराठवाडा वॉटर ग्रीड प्रकल्प गतीमान आढावा पत्रकार परिषद',
    date: '08 Oct 2026',
    duration: '35 mins',
    views: '89,000 views',
    thumbnail: '/streams/water-grid.png',
  },
];
