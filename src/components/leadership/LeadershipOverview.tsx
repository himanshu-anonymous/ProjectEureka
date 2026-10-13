'use client';

import React from 'react';
import { TopLowerMatrix } from './TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from './SocialMediaAnalysis/SocialMediaAnalysis';
import { GISMap } from './GISMap/GISMap';
import { LiveStreaming } from './LiveStreaming/LiveStreaming';

export const LeadershipOverview: React.FC = () => {
  return (
    <section className="pt-2" aria-label="Leadership Overview">
      <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-3">
        Leadership Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Panel 1: Top / Lower Five Matrix */}
        <TopLowerMatrix />

        {/* Panel 2: Social Media Analysis */}
        <SocialMediaAnalysis />

        {/* Panel 3: Maharashtra GIS Map */}
        <GISMap />

        {/* Panel 4: Live Event Streaming */}
        <LiveStreaming />
      </div>
    </section>
  );
};
