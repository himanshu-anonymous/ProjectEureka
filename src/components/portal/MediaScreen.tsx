'use client';

import React from 'react';
import { OCRFeed } from '@/components/zones/OCRFeed/OCRFeed';
import { SocialMediaAnalysis } from '@/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis';
import { NewspaperDataSection } from '@/components/commandCenter/left/NewspaperDataSection';
import { TVChannelDataSection } from '@/components/commandCenter/left/TVChannelDataSection';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const MediaScreen: React.FC = () => {
  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <MaterialIcon name="layers" size="sm" />
          <span>Unified State Media Archive & Real-Time Monitoring</span>
        </h2>
        <p className="text-xs text-content-muted">
          Print Newspapers, TV Channels, OCR Feed, and Digital Social Listening Vault
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <NewspaperDataSection />
        <TVChannelDataSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OCRFeed />
        <SocialMediaAnalysis />
      </div>
    </div>
  );
};
