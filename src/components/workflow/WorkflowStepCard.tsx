'use client';

import React from 'react';
import { DailyWorkflowItem } from '@/types/dashboard';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface WorkflowStepCardProps {
  item: DailyWorkflowItem;
  isActive: boolean;
  onSelect: (id: number) => void;
}

export const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({
  item,
  isActive,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(item.id)}
      className={`p-3.5 rounded border transition-all cursor-pointer flex flex-col justify-between ${
        isActive
          ? 'bg-surface border-borderLine-strong shadow-sm ring-1 ring-borderLine-strong'
          : 'bg-surface border-borderLine-standard hover:bg-surface-secondary'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[11px] font-bold text-content-primary px-1.5 py-0.5 bg-surface-secondary rounded border border-borderLine-subtle">
          {item.step}
        </span>
        <div className="flex items-center gap-1 text-[11px]">
          {item.status === 'Completed' && (
            <span className="flex items-center gap-1 text-content-primary font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </span>
          )}
          {item.status === 'In Progress' && (
            <span className="flex items-center gap-1 text-content-primary font-semibold">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Active</span>
            </span>
          )}
          {item.status === 'Pending' && (
            <span className="flex items-center gap-1 text-content-muted">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Pending</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 my-1">
        <h4 className="text-xs font-bold text-content-primary line-clamp-1">{item.title}</h4>
        <p className="text-[11px] text-content-secondary line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="pt-2.5 mt-2 border-t border-borderLine-subtle flex items-center justify-between text-[11px]">
        <span className="text-content-muted truncate max-w-[130px]">{item.owner}</span>
        <span className="font-mono font-semibold text-content-primary text-right">{item.metric}</span>
      </div>
    </div>
  );
};
