'use client';

import React from 'react';
import { EnhancedMaharashtraGISMap } from './EnhancedMaharashtraGISMap';
import type { MapThematicMetric, DistrictMetricData } from '@/data/lovableDashboardData';

export interface Maharashtra3DModelMapProps {
  onDistrictSelect?: (district: DistrictMetricData) => void;
  className?: string;
  initialDistrictId?: string;
  initialMetric?: MapThematicMetric;
  initialDivisionFilter?: string;
  onToggle2D?: () => void;
}

/**
 * High-performance 2D GIS Map replacement for legacy 3D map calls.
 * Renders the high-fidelity 2D vector GIS map without heavy WebGL / Three.js overhead.
 */
export const Maharashtra3DModelMap: React.FC<Maharashtra3DModelMapProps> = ({
  onDistrictSelect,
  className,
  initialDistrictId,
  initialMetric,
  initialDivisionFilter,
}) => {
  return (
    <EnhancedMaharashtraGISMap
      className={className}
      initialDistrictId={initialDistrictId}
      initialMetric={initialMetric}
      initialDivisionFilter={initialDivisionFilter}
      onDistrictSelect={onDistrictSelect}
    />
  );
};
