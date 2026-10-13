'use client';

import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

export const LiveStreaming: React.FC = () => {
  const [platform, setPlatform] = useState<'youtube' | 'facebook' | 'instagram' | 'tv'>('youtube');

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col h-full">
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-primary">Live Event Streaming</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setPlatform('youtube')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'youtube'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            YouTube
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
          <button
            onClick={() => setPlatform('instagram')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'instagram'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setPlatform('tv')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'tv'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            TV Channels
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col items-center justify-center text-center bg-surface-secondary m-4 rounded border border-borderLine-subtle">
        <PlayCircle className="w-10 h-10 text-content-muted mb-2 stroke-[1.5]" />
        <p className="text-xs font-semibold text-content-primary">No live stream currently active</p>
        <p className="text-[11px] text-content-muted mt-0.5 max-w-xs">
          Live press conferences and Chief Minister briefings will automatically stream here when broadcast starts.
        </p>
      </div>
    </div>
  );
};
