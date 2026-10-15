'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'linkedin';
  handle: string;
  timestamp: string;
  text: string;
  engagement: string;
  sentiment: 'positive' | 'neutral';
}

const TWITTER_STREAM: SocialPost[] = [
  {
    id: 'tw-1',
    platform: 'twitter',
    handle: '@MahaDGIPR',
    timestamp: '12m ago',
    text: 'माननीय मुख्यमंत्र्यांच्या अध्यक्षतेखाली राज्य आपत्ती निवारण प्राधिकरणाची महत्त्वपूर्ण आढावा बैठक संपली.',
    engagement: '1.4K Reposts • 6.2K Likes',
    sentiment: 'positive',
  },
  {
    id: 'tw-2',
    platform: 'twitter',
    handle: '@CMOMaharashtra',
    timestamp: '35m ago',
    text: 'शेतकऱ्यांना सूक्ष्म सिंचन अनुदानाचे थेट बँक खात्यात वितरण सुरू. ३६ जिल्ह्यांतील लाखो शेतकऱ्यांना लाभ.',
    engagement: '890 Reposts • 4.1K Likes',
    sentiment: 'positive',
  },
  {
    id: 'tw-3',
    platform: 'twitter',
    handle: '@MahaCyber1',
    timestamp: '1h ago',
    text: 'अफवांवर विश्वास ठेवू नका. अधिकृत माहितीसाठी @MahaDGIPR चे अपडेट्स पहा. सायबर सेलचे आवाहन.',
    engagement: '520 Reposts • 2.8K Likes',
    sentiment: 'neutral',
  },
];

const MULTI_PLATFORM_STREAM: SocialPost[] = [
  {
    id: 'mp-1',
    platform: 'facebook',
    handle: 'DGIPR Maharashtra (FB)',
    timestamp: '18m ago',
    text: 'लाइव्ह वार्तालाप: आरोग्य विभागाच्या नव्या योजनांची माहिती व रुग्ण कल्याण समिती पुनर्रचना निर्णय.',
    engagement: '12K Views • 1.1K Comments',
    sentiment: 'positive',
  },
  {
    id: 'mp-2',
    platform: 'instagram',
    handle: '@maharashtragovt (Insta)',
    timestamp: '42m ago',
    text: 'Reel: मुंबई कोस्टल रोड प्रवासाचा नवीन टप्पा खुला. प्रवाशांचा वेळ वाचला ७० मिनिटांवरून २५ मिनिटांवर.',
    engagement: '84.2K Plays • 9.4K Likes',
    sentiment: 'positive',
  },
  {
    id: 'mp-3',
    platform: 'youtube',
    handle: 'Maha Govt Official (YouTube)',
    timestamp: '1h ago',
    text: 'पूर्ण पत्रकार परिषद: सह्याद्री अतिथीगृह, मुंबई येथून थेट प्रक्षेपण व शासकीय निर्णय स्पष्टीकरण.',
    engagement: '35K Watched • 98% Upvote',
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
          <span>Dual Feed Stream Sync</span>
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
              <span className="font-mono text-[10px] text-slate-500">Live API</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {TWITTER_STREAM.map((post) => (
                <div
                  key={post.id}
                  className="p-2 bg-white rounded border border-slate-200 shadow-2xs text-xs space-y-1 hover:border-gov-blue transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{post.handle}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{post.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                    {post.text}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5 flex justify-between">
                    <span>{post.engagement}</span>
                    <span className="text-emerald-700 font-semibold">Verified</span>
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
              <span className="font-mono text-[10px] text-slate-500">Unified Aggregator</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {MULTI_PLATFORM_STREAM.map((post) => (
                <div
                  key={post.id}
                  className="p-2 bg-white rounded border border-slate-200 shadow-2xs text-xs space-y-1 hover:border-gov-accent transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{post.handle}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{post.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                    {post.text}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-0.5 flex justify-between">
                    <span>{post.engagement}</span>
                    <span className="text-emerald-700 font-semibold">Official Relay</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 flex-wrap gap-2">
          <span>Social Media Listening Wing: २४x७ सोशल मीडिया मॉनिटरिंग</span>
          <span className="font-mono text-gov-primary font-bold">
            Total Reach: ३.३M Citizen Impressions Today
          </span>
        </div>
      </div>
    </div>
  );
};
