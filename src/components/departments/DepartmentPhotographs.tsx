'use client';

import React from 'react';
import { DepartmentPhoto } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getLocalizedCategory } from '@/lib/dataLocalization';

interface DepartmentPhotographsProps {
  photos: DepartmentPhoto[];
}

export const DepartmentPhotographs: React.FC<DepartmentPhotographsProps> = ({ photos }) => {
  const { language } = useDashboardStore();

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name="image" size="sm" className="text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">
            {language === 'mr' ? 'कार्यक्रमांची छायाचित्रे' : 'Event Photographs'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-content-muted">
          {photos.length} {language === 'mr' ? 'छायाचित्रे' : 'High-Res Assets'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {photos.map((ph) => (
          <div
            key={ph.id}
            className="border border-borderLine-subtle rounded p-2 bg-surface-secondary/50 hover:bg-surface-secondary transition-colors flex flex-col justify-between text-xs space-y-2"
          >
            <div className="w-full h-24 bg-surface-secondary rounded border border-borderLine-subtle flex items-center justify-center relative overflow-hidden">
              <MaterialIcon name="photo_camera" size="lg" className="text-content-muted" />
              <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 bg-surface/90 border border-borderLine-subtle rounded text-content-muted">
                {getLocalizedCategory(ph.category, language)}
              </span>
            </div>

            <div>
              <p className="font-semibold text-content-primary text-xs line-clamp-1">{ph.title}</p>
              <div className="flex items-center justify-between text-[10px] text-content-muted mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <MaterialIcon name="calendar_today" size="xs" />
                  <span>{ph.date}</span>
                </span>
                <span>{language === 'mr' ? 'छायाचित्रकार:' : 'Photo:'} {ph.photographer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
