'use client';

import React from 'react';
import { DepartmentVideo } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface DepartmentVideosProps {
  videos: DepartmentVideo[];
}

export const DepartmentVideos: React.FC<DepartmentVideosProps> = ({ videos }) => {
  const { language } = useDashboardStore();

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name="videocam" size="sm" className="text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">
            {language === 'mr' ? 'व्हिडिओ वार्तालाप व कव्हरेज' : 'Video Briefings & Coverage'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-content-muted">
          {videos.length} {language === 'mr' ? 'व्हिडिओ क्लिप्स' : 'Video Clips'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="border border-borderLine-subtle rounded p-2.5 bg-surface-secondary/50 hover:bg-surface-secondary transition-colors flex flex-col justify-between text-xs space-y-2 group"
          >
            <div className="w-full h-28 bg-surface-secondary rounded border border-borderLine-subtle flex flex-col items-center justify-center relative cursor-pointer">
              <MaterialIcon name="play_circle" size="lg" className="text-content-primary" />
              <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 bg-surface/90 border border-borderLine-subtle rounded font-bold">
                {vid.duration}
              </span>
            </div>

            <div>
              <p className="font-semibold text-content-primary text-xs line-clamp-1">{vid.title}</p>
              <div className="flex items-center justify-between text-[10px] text-content-muted mt-1 font-mono">
                <span className="flex items-center gap-1">
                  <MaterialIcon name="visibility" size="xs" />
                  <span>{vid.views} {language === 'mr' ? 'व्ह्यूज' : 'Views'}</span>
                </span>
                <span>{vid.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
