'use client';

import React from 'react';
import { DistrictOperationsColumn } from './DistrictOperationsColumn';
import { CrisisOperationsColumn } from './CrisisOperationsColumn';

export const OperationsWorkspace: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column (8 of 12 columns) */}
      <DistrictOperationsColumn />

      {/* Right Column (4 of 12 columns) */}
      <CrisisOperationsColumn />
    </div>
  );
};
