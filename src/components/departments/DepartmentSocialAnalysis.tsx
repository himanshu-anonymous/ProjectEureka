'use client';

import React from 'react';
import { DepartmentData } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getLocalizedDepartment } from '@/lib/dataLocalization';

interface DepartmentSocialAnalysisProps {
  stats: DepartmentData['socialStats'];
  deptName: string;
}

export const DepartmentSocialAnalysis: React.FC<DepartmentSocialAnalysisProps> = ({
  stats,
  deptName,
}) => {
  const { language } = useDashboardStore();
  const localizedDeptName = getLocalizedDepartment(deptName, language);

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name="share" size="sm" className="text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">
            {language === 'mr'
              ? `विभागीय सोशल मीडिया विश्लेषण — ${localizedDeptName}`
              : `Department Social Media Analysis — ${deptName}`}
          </h4>
        </div>
        <span className="text-xs font-mono font-medium text-content-muted whitespace-nowrap">
          {stats.handle}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-surface-secondary p-2.5 rounded border border-borderLine-subtle">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <MaterialIcon name="group" size="xs" />
            <span>{language === 'mr' ? 'फॉलोअर्स' : 'Followers'}</span>
          </div>
          <div className="text-base font-bold font-mono text-content-primary mt-1">
            {stats.followers}
          </div>
        </div>

        <div className="bg-surface-secondary p-2.5 rounded border border-borderLine-subtle">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <MaterialIcon name="chat_bubble" size="xs" />
            <span>{language === 'mr' ? '२४ तासांतील उल्लेख' : '24h Mentions'}</span>
          </div>
          <div className="text-base font-bold font-mono text-content-primary mt-1">
            {stats.mentions24h}
          </div>
        </div>

        <div className="bg-surface-secondary p-2.5 rounded border border-borderLine-subtle">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <MaterialIcon name="auto_awesome" size="xs" />
            <span>{language === 'mr' ? 'एकूण जनभावना' : 'Net Sentiment'}</span>
          </div>
          <div className="text-base font-bold font-mono text-content-primary mt-1">
            {stats.sentimentScore}%
          </div>
        </div>

        <div className="bg-surface-secondary p-2.5 rounded border border-borderLine-subtle">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <MaterialIcon name="trending_up" size="xs" />
            <span>{language === 'mr' ? 'व्हायरल पोहोच' : 'Viral Reach'}</span>
          </div>
          <div className="text-base font-bold font-mono text-content-primary mt-1">
            {stats.viralReach}
          </div>
        </div>
      </div>
    </div>
  );
};
