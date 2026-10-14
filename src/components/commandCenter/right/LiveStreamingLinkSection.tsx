'use client';

import React, { useState } from 'react';
import { PlayCircle, Video, ExternalLink, Radio, Users } from 'lucide-react';

export const LiveStreamingLinkSection: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<'cmo' | 'cabinet' | 'emergency'>('cmo');

  const sources = [
    { id: 'cmo' as const, label: 'CMO Briefing', viewers: '14.2K Live' },
    { id: 'cabinet' as const, label: 'Cabinet Hall', viewers: 'Standby' },
    { id: 'emergency' as const, label: 'Crisis Desk', viewers: 'Active Feed' },
  ];

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col p-4 space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2.5">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">Live Streaming Link & Broadcast</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-surface-secondary text-content-primary rounded border border-borderLine-standard flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-content-primary animate-ping"></span>
          <span>Broadcasting</span>
        </span>
      </div>

      {/* Source Selectors */}
      <div className="flex gap-1.5 text-xs">
        {sources.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSource(s.id)}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors text-center ${
              selectedSource === s.id
                ? 'bg-action-primary text-content-inverse'
                : 'bg-surface-secondary text-content-secondary hover:text-content-primary'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Video Mock Player Canvas */}
      <div className="w-full h-44 bg-surface-secondary rounded border border-borderLine-subtle flex flex-col items-center justify-center p-4 relative group overflow-hidden">
        <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-surface/90 rounded border border-borderLine-subtle text-content-primary">
          <Radio className="w-3 h-3 text-content-primary" />
          <span>720p HD Clean Feed</span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-surface/90 rounded border border-borderLine-subtle text-content-primary">
          <Users className="w-3 h-3" />
          <span>
            {sources.find((s) => s.id === selectedSource)?.viewers}
          </span>
        </div>

        <PlayCircle className="w-10 h-10 text-content-primary mb-2 stroke-[1.5] group-hover:scale-110 transition-transform cursor-pointer" />
        <p className="text-xs font-semibold text-content-primary">
          {selectedSource === 'cmo' && 'Chief Minister Press Briefing (Live Relay)'}
          {selectedSource === 'cabinet' && 'Cabinet Hall Internal Telecast Relay'}
          {selectedSource === 'emergency' && 'Disaster Response Command Line'}
        </p>
        <p className="text-[11px] text-content-muted mt-0.5">
          DGIPR State Telecast Hub • Sahyadri Guest House
        </p>
      </div>

      {/* Live Stream Direct Link Button */}
      <div className="flex items-center justify-between pt-1">
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-action-primary text-content-inverse rounded text-xs font-medium hover:bg-action-primary-hover transition-colors shadow-sm"
        >
          <span>Open Direct Live Stream Feed</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
