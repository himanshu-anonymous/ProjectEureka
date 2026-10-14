'use client';

import React from 'react';
import { DepartmentPhoto } from '@/types/dashboard';
import { Image as ImageIcon, Camera, Calendar } from 'lucide-react';

interface DepartmentPhotographsProps {
  photos: DepartmentPhoto[];
}

export const DepartmentPhotographs: React.FC<DepartmentPhotographsProps> = ({ photos }) => {
  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">2. Event Photographs Gallery</h4>
        </div>
        <span className="text-[10px] font-mono text-content-muted">
          {photos.length} High-Res Assets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {photos.map((ph) => (
          <div
            key={ph.id}
            className="border border-borderLine-subtle rounded p-2 bg-surface-secondary/50 hover:bg-surface-secondary transition-colors flex flex-col justify-between text-xs space-y-2"
          >
            <div className="w-full h-24 bg-surface-secondary rounded border border-borderLine-subtle flex items-center justify-center relative overflow-hidden">
              <Camera className="w-6 h-6 text-content-muted stroke-[1.5]" />
              <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 bg-surface/90 border border-borderLine-subtle rounded text-content-muted">
                {ph.category}
              </span>
            </div>

            <div>
              <p className="font-semibold text-content-primary text-xs line-clamp-1">{ph.title}</p>
              <div className="flex items-center justify-between text-[10px] text-content-muted mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{ph.date}</span>
                </span>
                <span>Photo: {ph.photographer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
