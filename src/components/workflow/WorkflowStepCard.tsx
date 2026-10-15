'use client';

import React from 'react';
import { DailyWorkflowItem } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

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
        className={`w-full p-3.5 rounded border transition-colors text-left flex flex-col justify-between h-full select-none cursor-pointer ${
          isActive
            ? 'bg-surface border-gov-primary shadow-xs ring-2 ring-gov-primary/30'
            : 'bg-surface border-borderLine-standard hover:bg-surface-secondary/70 hover:border-slate-300'
        }`}
      >
        <div>
          {/* Top Row: Stage Badge & Status Indicator */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-borderLine-standard bg-surface-secondary text-content-primary">
                0{stepNumber}
              </span>
              <span className="font-mono text-[10px] text-content-muted truncate max-w-[90px]">
                {item.timeSlot}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium shrink-0">
              {item.status === 'Completed' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 border border-emerald-300 text-emerald-800">
                  <MaterialIcon name="check_circle" size="xs" className="text-emerald-700" />
                  <span>Done</span>
                </span>
              )}
              {item.status === 'In Progress' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 border border-amber-300 text-amber-800">
                  <MaterialIcon name="schedule" size="xs" className="text-amber-700" />
                  <span>Active</span>
                </span>
              )}
              {item.status === 'Pending' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-surface-secondary border border-borderLine-subtle text-content-muted">
                  <MaterialIcon name="calendar_today" size="xs" />
                  <span>Scheduled</span>
                </span>
              )}
            </div>
          </div>

          {/* Time range */}
          <div className="font-mono text-[11px] font-semibold text-content-primary mb-1">
            {item.step}
          </div>

          {/* Title & Description */}
          <div className="space-y-1 my-1">
            <h4 className="text-xs font-bold text-content-primary line-clamp-1">
              {item.title}
            </h4>
            <p className="text-[11px] text-content-secondary line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Footer: Owner and Metric */}
        <div className="pt-2.5 mt-2 border-t border-borderLine-subtle flex items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-1 text-content-muted truncate max-w-[110px]" title={item.owner}>
            <MaterialIcon name="how_to_reg" size="xs" className="shrink-0" />
            <span className="truncate">{item.owner}</span>
          </div>
          <span className="font-mono font-semibold text-content-primary text-right shrink-0 text-[10px]">
            {item.metric}
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
