'use client';

import React from 'react';
import { DailyWorkflowItem } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface WorkflowStepCardProps {
  item: DailyWorkflowItem;
  isActive: boolean;
  isLast: boolean;
  stepNumber: number;
  onSelect: (id: number) => void;
}

export const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({
  item,
  isActive,
  isLast,
  stepNumber,
  onSelect,
}) => {
  const { language } = useDashboardStore();

  const metricText =
    language === 'mr'
      ? item.metricMr || item.metric
      : item.id === 5 && (item.metric.includes('Live Briefing') || item.metric.includes('Scheduled'))
      ? 'Live Broadcast Relay Ready'
      : item.metric;

  const displayTitle = language === 'mr' ? item.titleMr || item.title : item.title;

  return (
    <div className="relative flex-1 flex flex-col">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(item.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item.id);
          }
        }}
        className={`w-full p-3 rounded-md border transition-all text-left flex flex-col justify-between h-full select-none cursor-pointer ${
          isActive
            ? 'bg-surface border-gov-primary shadow-xs ring-2 ring-gov-primary/30'
            : 'bg-surface border-borderLine-standard hover:bg-surface-secondary/70 hover:border-slate-300'
        }`}
      >
        <div>
          {/* Top Row: Sequential Index & Status Pill */}
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-borderLine-standard bg-surface-secondary text-content-primary">
              {language === 'mr' ? `क्रम ०${stepNumber}` : `Sequence 0${stepNumber}`}
            </span>

            <div className="flex items-center gap-1 text-[11px] font-medium shrink-0">
              {item.status === 'Completed' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800">
                  <MaterialIcon name="check_circle" size="xs" className="text-emerald-700" />
                  <span>{language === 'mr' ? 'पूर्ण' : 'Done'}</span>
                </span>
              )}
              {item.status === 'In Progress' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 border border-amber-300 text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  <span>{language === 'mr' ? 'सक्रिय' : 'Active'}</span>
                </span>
              )}
              {item.status === 'Pending' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-secondary border border-borderLine-subtle text-content-muted">
                  <MaterialIcon name="schedule" size="xs" />
                  <span>{language === 'mr' ? 'नियोजित' : 'Scheduled'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Core Activity Title */}
          <h4
            className="text-xs font-bold text-content-primary leading-snug my-1.5 break-words min-h-[32px]"
            title={displayTitle}
          >
            {displayTitle}
          </h4>
        </div>

        {/* Primary Key Metric / Output Footer */}
        <div className="pt-2 mt-auto border-t border-borderLine-subtle flex items-center justify-between text-[11px] gap-2">
          <span className="text-[10px] text-content-muted font-medium">
            {language === 'mr' ? 'आउटपुट' : 'Output'}
          </span>
          <span
            className="font-mono font-bold text-content-primary text-right text-[10px] truncate"
            title={metricText}
          >
            {metricText}
          </span>
        </div>
      </div>

      {/* Continuity arrow for wide screens (hidden on last item) */}
      {!isLast && (
        <div className="hidden xl:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-surface border border-borderLine-standard items-center justify-center text-content-muted shadow-xs pointer-events-none">
          <MaterialIcon name="arrow_forward" size="xs" />
        </div>
      )}
    </div>
  );
};
