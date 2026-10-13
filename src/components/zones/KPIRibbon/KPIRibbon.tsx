'use client';

import React from 'react';
import { FileText, Clock, Smile, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';

export const KPIRibbon: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Releases */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-content-secondary mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-content-primary" />
            <span className="text-xs font-medium text-content-primary">Total Releases</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-content-primary">1,248</div>
          <div className="flex items-center justify-between text-xs mt-2 text-content-muted">
            <span>Target 1,500 (83%)</span>
            <div className="flex items-center gap-0.5 text-content-secondary font-medium">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Average TAT */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-content-secondary mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-content-primary" />
            <span className="text-xs font-medium text-content-primary">Average TAT</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-content-primary">
            47 <span className="text-sm font-normal text-content-secondary">min</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-2 text-content-muted">
            <span>Target ≤ 60 min (78%)</span>
            <div className="flex items-center gap-0.5 text-content-secondary font-medium">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>18%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sentiment Index */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-content-secondary mb-2">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-content-primary" />
            <span className="text-xs font-medium text-content-primary">Sentiment Index</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-content-primary">72%</div>
          <div className="flex items-center justify-between text-xs mt-2 text-content-muted">
            <span>Target ≥ 70% (Met)</span>
            <div className="flex items-center gap-0.5 text-content-secondary font-medium">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Misinformation Tickets */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between text-content-secondary mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-content-primary" />
            <span className="text-xs font-medium text-content-primary">Misinformation Tickets</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold tracking-tight text-content-primary">8</div>
          <div className="flex items-center justify-between text-xs mt-2 text-content-muted">
            <span>Target ≤ 15 (Met)</span>
            <div className="flex items-center gap-0.5 text-content-secondary font-medium">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>33%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
