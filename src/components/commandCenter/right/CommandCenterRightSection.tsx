'use client';

import React from 'react';
import { LeadershipMessagesSection } from './LeadershipMessagesSection';
import { LiveStreamingLinkSection } from './LiveStreamingLinkSection';

export const CommandCenterRightSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider">
          Executive Directives & State Broadcast Feed
        </h3>
        <span className="text-[10px] font-mono text-content-muted">DG Messages & Live Feeds</span>
      </div>

      {/* DG and Director messages */}
      <LeadershipMessagesSection />

      {/* Live streaming Link */}
      <LiveStreamingLinkSection />
    </div>
  );
};
