'use client';

import React from 'react';
import { NewspaperDataSection } from './NewspaperDataSection';
import { TVChannelDataSection } from './TVChannelDataSection';
import { SocialMediaDataSection } from './SocialMediaDataSection';

export const CommandCenterLeftSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider">
          Live Broadcast & Media Ingestion Monitoring
        </h3>
        <span className="text-[10px] font-mono text-content-muted">Infographics & Graphs</span>
      </div>

      {/* 1. Newspaper Data */}
      <NewspaperDataSection />

      {/* 2. TV Channel Data */}
      <TVChannelDataSection />

      {/* 3. Social Media Data Analysis */}
      <SocialMediaDataSection />
    </div>
  );
};
