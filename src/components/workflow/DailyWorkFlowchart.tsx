'use client';

import React from 'react';
import { DAILY_WORKFLOW_STEPS } from '@/data/dashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import { WorkflowStepCard } from './WorkflowStepCard';
import { GitBranch, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export const DailyWorkFlowchart: React.FC = () => {
  const { activeWorkflowStep, setActiveWorkflowStep } = useDashboardStore();

  const currentStepData =
    DAILY_WORKFLOW_STEPS.find((s) => s.id === activeWorkflowStep) ||
    DAILY_WORKFLOW_STEPS[0];

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-content-primary" />
          <h3 className="text-sm font-semibold text-content-primary">
            Webportals — Daily Operations Workflow
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 bg-surface-secondary text-content-secondary rounded border border-borderLine-standard">
            24h Life Cycle
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-content-muted">
          <div className="flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Today, 14:35 IST</span>
          </div>
          <span className="text-content-primary font-medium">Shift 2 of 3 Active</span>
        </div>
      </div>

      {/* Grid of Steps in Sequence */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {DAILY_WORKFLOW_STEPS.map((step) => (
            <WorkflowStepCard
              key={step.id}
              item={step}
              isActive={activeWorkflowStep === step.id}
              onSelect={setActiveWorkflowStep}
            />
          ))}
        </div>

        {/* Selected Step Drill-Down Detail Banner */}
        <div className="mt-4 p-3 bg-surface-secondary border border-borderLine-subtle rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-content-primary">
                Stage {currentStepData.id}: {currentStepData.title}
              </span>
              <span className="font-mono text-[11px] text-content-muted">({currentStepData.step})</span>
            </div>
            <p className="text-content-secondary text-[11px]">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <div className="flex items-center gap-1.5 text-content-secondary font-mono text-[11px]">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{currentStepData.owner}</span>
            </div>
            <button
              onClick={() => {
                const nextId = activeWorkflowStep < DAILY_WORKFLOW_STEPS.length ? activeWorkflowStep + 1 : 1;
                setActiveWorkflowStep(nextId);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-action-primary text-content-inverse rounded text-[11px] font-medium hover:bg-action-primary-hover transition-colors"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
