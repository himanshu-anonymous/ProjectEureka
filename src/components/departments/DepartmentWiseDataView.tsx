'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { DepartmentSelector } from './DepartmentSelector';
import { DepartmentPressReleases } from './DepartmentPressReleases';
import { DepartmentPhotographs } from './DepartmentPhotographs';
import { DepartmentVideos } from './DepartmentVideos';
import { DepartmentEmptySlot } from './DepartmentEmptySlot';
import { DepartmentSocialAnalysis } from './DepartmentSocialAnalysis';

export const DepartmentWiseDataView: React.FC = () => {
  const { selectedDepartmentId } = useDashboardStore();

  const selectedDept =
    DEPARTMENTS_DATA.find((d) => d.id === selectedDepartmentId) ||
    DEPARTMENTS_DATA[0];

  return (
    <div className="space-y-4">
      {/* Department Selector */}
      <DepartmentSelector />

      {/* Additional: Social Media Analysis of Dept */}
      <DepartmentSocialAnalysis
        stats={selectedDept.socialStats}
        deptName={selectedDept.name}
      />

      {/* 2-Column Grid for Items 1, 2, 3, 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Press Releases */}
        <DepartmentPressReleases releases={selectedDept.pressReleases} />

        {/* 2. Photographs */}
        <DepartmentPhotographs photos={selectedDept.photos} />

        {/* 3. Videos */}
        <DepartmentVideos videos={selectedDept.videos} />

        {/* 4. [Empty] Slot */}
        <DepartmentEmptySlot />
      </div>
    </div>
  );
};
