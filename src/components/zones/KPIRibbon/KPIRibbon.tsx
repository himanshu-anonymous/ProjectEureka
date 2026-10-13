'use client';

import React from 'react';
import { FileText, Clock, Smile, AlertCircle } from 'lucide-react';
import { KPICard } from './KPICard';

export const KPIRibbon: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Releases */}
      <KPICard
        icon={FileText}
        title="Total Releases"
        value="1,248"
        targetText="Target 1,500 (83%)"
        trendDirection="down"
        trendValue="12%"
      />

      {/* 2. Average TAT */}
      <KPICard
        icon={Clock}
        title="Average TAT"
        value={47}
        unit="min"
        targetText="Target ≤ 60 min (78%)"
        trendDirection="down"
        trendValue="18%"
      />

      {/* 3. Sentiment Index */}
      <KPICard
        icon={Smile}
        title="Sentiment Index"
        value="72%"
        targetText="Target ≥ 70% (Met)"
        trendDirection="up"
        trendValue="6%"
      />

      {/* 4. Misinformation Tickets */}
      <KPICard
        icon={AlertCircle}
        title="Misinformation Tickets"
        value={8}
        targetText="Target ≤ 15 (Met)"
        trendDirection="down"
        trendValue="33%"
      />
    </div>
  );
};
