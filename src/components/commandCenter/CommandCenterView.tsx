'use client';

import React from 'react';
import { CommandCenterLeftSection } from './left/CommandCenterLeftSection';
import { CommandCenterCenterSection } from './center/CommandCenterCenterSection';
import { CommandCenterRightSection } from './right/CommandCenterRightSection';

export const CommandCenterView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* 3-Column Triptych Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (3.5 cols ~ 29% on desktop) */}
        <div className="lg:col-span-4 xl:col-span-4">
          <CommandCenterLeftSection />
        </div>

        {/* Center Column (5 cols ~ 42% on desktop) */}
        <div className="lg:col-span-4 xl:col-span-4">
          <CommandCenterCenterSection />
        </div>

        {/* Right Column (3.5 cols ~ 29% on desktop) */}
        <div className="lg:col-span-4 xl:col-span-4">
          <CommandCenterRightSection />
        </div>
      </div>
    </div>
  );
};
