'use client';

import React, { useState } from 'react';
import { SOCIAL_MEDIA_DATA } from '@/data/dashboardData';

export const SocialMediaAnalysis: React.FC = () => {
  const [platform, setPlatform] = useState<'twitter' | 'facebook'>('twitter');

  const stats = SOCIAL_MEDIA_DATA[platform] || SOCIAL_MEDIA_DATA.twitter;

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col h-full">
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-primary">Social Media Analysis</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setPlatform('twitter')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'twitter'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            X (Twitter)
          </button>
          <button
            onClick={() => setPlatform('facebook')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'facebook'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            Facebook
          </button>
          <span className="text-content-muted self-center">| Instagram • YouTube • WhatsApp</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 text-xs">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="border border-borderLine-subtle p-2.5 rounded bg-surface-secondary">
            <span className="text-content-muted block text-[11px]">Total Mentions</span>
            <span className="font-mono text-base font-bold text-content-primary">
              {stats.totalMentions}
            </span>
            <span className="text-[10px] text-content-secondary block mt-0.5">
              {stats.totalMentionsGrowth}
            </span>
          </div>

          <div className="border border-borderLine-subtle p-2.5 rounded bg-surface-secondary">
            <span className="text-content-muted block text-[11px]">Organic Reach</span>
            <span className="font-mono text-base font-bold text-content-primary">
              {stats.organicReach}
            </span>
            <span className="text-[10px] text-content-secondary block mt-0.5">
              {stats.organicReachGrowth}
            </span>
          </div>

          <div className="border border-borderLine-subtle p-2.5 rounded bg-surface-secondary">
            <span className="text-content-muted block text-[11px]">Engagement Rate</span>
            <span className="font-mono text-base font-bold text-content-primary">
              {stats.engagementRate}
            </span>
            <span className="text-[10px] text-content-secondary block mt-0.5">
              {stats.engagementRateGrowth}
            </span>
          </div>

          <div className="border border-borderLine-subtle p-2.5 rounded bg-surface-secondary">
            <span className="text-content-muted block text-[11px]">Reel Completion</span>
            <span className="font-mono text-base font-bold text-content-primary">
              {stats.reelCompletion}
            </span>
            <span className="text-[10px] text-content-secondary block mt-0.5">
              {stats.reelCompletionGrowth}
            </span>
          </div>
        </div>

        {/* Taluka-wise Engagement */}
        <div>
          <span className="text-xs font-semibold text-content-primary block mb-2">
            Taluka-wise Engagement (Top 5)
          </span>
          <div className="space-y-1.5 font-mono text-[11px]">
            {stats.talukaEngagement.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <span className="w-20 text-content-secondary truncate">{t.name}</span>
                <div className="flex-1 bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-content-primary h-full rounded-full"
                    style={{ width: `${(t.num / 150) * 100}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right font-medium text-content-primary">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
