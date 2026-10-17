'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'linkedin';
  handle: string;
  timestampEn: string;
  timestampMr: string;
  textEn: string;
  textMr: string;
  engagementEn: string;
  engagementMr: string;
  sentiment: 'positive' | 'neutral';
}

const TWITTER_STREAM: SocialPost[] = [
  {
    id: 'tw-1',
    platform: 'twitter',
    handle: '@MahaDGIPR',
    timestampEn: '12m ago',
    timestampMr: '१२ मि पूर्वी',
    textEn: 'Crucial State Disaster Management Authority review meeting concluded under the chairmanship of Hon. Chief Minister.',
    textMr: 'माननीय मुख्यमंत्र्यांच्या अध्यक्षतेखाली राज्य आपत्ती निवारण प्राधिकरणाची महत्त्वपूर्ण आढावा बैठक संपली.',
    engagementEn: '1.4K Reposts • 6.2K Likes',
    engagementMr: '१.४ हजार पुनपोस्ट • ६.२ हजार लाईक्स',
    sentiment: 'positive',
  },
  {
    id: 'tw-2',
    platform: 'twitter',
    handle: '@CMOMaharashtra',
    timestampEn: '35m ago',
    timestampMr: '३५ मि पूर्वी',
    textEn: 'Direct bank transfer of micro-irrigation subsidies to farmers initiated across all 36 districts of Maharashtra.',
    textMr: 'शेतकऱ्यांना सूक्ष्म सिंचन अनुदानाचे थेट बँक खात्यात वितरण सुरू. ३६ जिल्ह्यांतील लाखो शेतकऱ्यांना लाभ.',
    engagementEn: '890 Reposts • 4.1K Likes',
    engagementMr: '८९० पुनपोस्ट • ४.१ हजार लाईक्स',
    sentiment: 'positive',
  },
  {
    id: 'tw-3',
    platform: 'twitter',
    handle: '@MahaCyber1',
    timestampEn: '1h ago',
    timestampMr: '१ तास पूर्वी',
    textEn: 'Do not believe unverified rumors. Rely on official announcements from @MahaDGIPR. State Cyber Cell public advisory.',
    textMr: 'अफवांवर विश्वास ठेवू नका. अधिकृत माहितीसाठी @MahaDGIPR चे अपडेट्स पहा. सायबर सेलचे आवाहन.',
    engagementEn: '520 Reposts • 2.8K Likes',
    engagementMr: '५२० पुनपोस्ट • २.८ हजार लाईक्स',
    sentiment: 'neutral',
  },
];

const MULTI_PLATFORM_STREAM: SocialPost[] = [
  {
    id: 'mp-1',
    platform: 'facebook',
    handle: 'DGIPR Maharashtra (FB)',
    timestampEn: '18m ago',
    timestampMr: '१८ मि पूर्वी',
    textEn: 'Live Briefing: Comprehensive update on Public Health Department welfare schemes and Patient Care Council restructuring.',
    textMr: 'थेट वार्तालाप: आरोग्य विभागाच्या नव्या योजनांची माहिती व रुग्ण कल्याण समिती पुनर्रचना निर्णय.',
    engagementEn: '12K Views • 1.1K Comments',
    engagementMr: '१२ हजार दृश्ये • १.१ हजार टिप्पण्या',
    sentiment: 'positive',
  },
  {
    id: 'mp-2',
    platform: 'instagram',
    handle: '@maharashtragovt (Insta)',
    timestampEn: '42m ago',
    timestampMr: '४२ मि पूर्वी',
    textEn: 'Reel: Mumbai Coastal Road new corridor inaugurated. Travel time slashed drastically from 70 mins to 25 mins.',
    textMr: 'रील: मुंबई कोस्टल रोड प्रवासाचा नवीन टप्पा खुला. प्रवाशांचा वेळ वाचला ७० मिनिटांवरून २५ मिनिटांवर.',
    engagementEn: '84.2K Plays • 9.4K Likes',
    engagementMr: '८४.२ हजार प्ले • ९.४ हजार लाईक्स',
    sentiment: 'positive',
  },
  {
    id: 'mp-3',
    platform: 'youtube',
    handle: 'Maha Govt Official (YouTube)',
    timestampEn: '1h ago',
    timestampMr: '१ तास पूर्वी',
    textEn: 'Full Press Conference: Live broadcast from Sahyadri Guest House, Mumbai detailing government cabinet decisions.',
    textMr: 'पूर्ण पत्रकार परिषद: सह्याद्री अतिथीगृह, मुंबई येथून थेट प्रक्षेपण व शासकीय निर्णय स्पष्टीकरण.',
    engagementEn: '35K Watched • 98% Upvote',
    engagementMr: '३५ हजार पाहिले • ९८% पसंती',
    sentiment: 'positive',
  },
];

export const SocialMediaAnalysis: React.FC = () => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col h-full shadow-xs overflow-hidden">
      {/* Header matching Wireframe 2 */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.leadership.socialTitle}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {t.leadership.socialSub}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
          <span>{language === 'mr' ? 'द्वि-प्रवाह थेट समक्रमण' : 'Dual Feed Stream Sync'}</span>
        </div>
      </div>

      {/* Split Stream Layout as depicted in Wireframe 2 */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
          {/* Stream 1: Twitter / X */}
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-black"></span>
                <span>{t.leadership.socialStreamX}</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {language === 'mr' ? 'थेट एपीआय' : 'Live API'}
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {TWITTER_STREAM.map((post) => (
                <div
                  key={post.id}
                  className="p-2 bg-white rounded border border-slate-200 shadow-2xs text-xs space-y-1 hover:border-gov-blue transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{post.handle}</span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      {language === 'mr' ? post.timestampMr : post.timestampEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                    {language === 'mr' ? post.textMr : post.textEn}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5 flex justify-between">
                    <span>{language === 'mr' ? post.engagementMr : post.engagementEn}</span>
                    <span className="text-emerald-700 font-semibold">
                      {language === 'mr' ? 'प्रमाणित' : 'Verified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stream 2: FB / Insta / YouTube / LinkedIn */}
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>FB / Insta / YouTube / LinkedIn</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {language === 'mr' ? 'एकत्रित संकलन' : 'Unified Aggregator'}
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {MULTI_PLATFORM_STREAM.map((post) => (
                <div
                  key={post.id}
                  className="p-2 bg-white rounded border border-slate-200 shadow-2xs text-xs space-y-1 hover:border-gov-accent transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{post.handle}</span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      {language === 'mr' ? post.timestampMr : post.timestampEn}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                    {language === 'mr' ? post.textMr : post.textEn}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5 flex justify-between">
                    <span>{language === 'mr' ? post.engagementMr : post.engagementEn}</span>
                    <span className="text-emerald-700 font-semibold">
                      {language === 'mr' ? 'अधिकृत प्रसारण' : 'Official Relay'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 flex-wrap gap-2">
          <span>
            {language === 'mr'
              ? 'सोशल मीडिया संनियंत्रण कक्ष: २४x७ थेट विश्लेषण'
              : 'Social Media Listening Wing: 24x7 Real-Time Stream Monitoring'}
          </span>
          <span className="font-mono text-gov-primary font-bold">
            {language === 'mr'
              ? 'एकूण पोहोच: ३.३ दशलक्ष नागरिक संवाद आज'
              : 'Total Reach: 3.3M Citizen Impressions Today'}
          </span>
        </div>
      </div>
    </div>
  );
};
