'use client';

import React from 'react';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { OCRFeed } from '@/components/zones/OCRFeed/OCRFeed';

export const CrisisOperationsColumn: React.FC = () => {
  return (
    <div className="lg:col-span-4 space-y-5">
      {/* ZONE 5: Emergency Alert & Crisis Monitor */}
      <EmergencyAlert />

      {/* ZONE 4: OCR Media Ingestion Feed */}
      <OCRFeed />
    </div>
  );
};
