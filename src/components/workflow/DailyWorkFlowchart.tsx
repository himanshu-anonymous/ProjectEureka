'use client';

import React from 'react';
import Link from 'next/link';
import { DAILY_WORKFLOW_STEPS } from '@/data/dashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import { WorkflowStepCard } from './WorkflowStepCard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

interface StepDetailMeta {
  route: string;
  routeLabel: string;
  deliverables: string[];
}

const STEP_DETAILS_MAP: Record<number, StepDetailMeta> = {
  1: {
    route: '/media',
    routeLabel: 'Explore Media Feeds',
    deliverables: [
      'Scanning 18 state daily print editions with automated OCR indexing',
      'Continuous recording and airtime transcription for 4 regional TV networks',
      'Ingesting high-velocity social media listening feeds into sentiment engine',
    ],
  },
  2: {
    route: '/districts',
    routeLabel: 'Open DIO District Desk',
    deliverables: [
      'Real-time ground verification across all 36 District Information Offices (DIOs)',
      'Assigning administrative sentiment polarity (Positive, Neutral, Critical)',
      'Immediate central escalation for emergent localized grievances',
    ],
  },
  3: {
    route: '/press-releases',
    routeLabel: 'Open Press Releases',
    deliverables: [
      'Bilingual drafting (Marathi & English) for departmental policy decisions',
      'Expedited ministerial and administrative clearance workflow',
      'Simultaneous multi-channel dispatch to accredited press pool and news wires',
    ],
  },
  4: {
    route: '/crisis',
    routeLabel: 'Open Crisis SLA Command',
    deliverables: [
      'Automated detection of viral misinformation and high-velocity rumors',
      'Mandatory 90-minute fact-check SLA timer linked to District Collectors',
      'Publication and dissemination of official counter-clarifications',
    ],
  },
  5: {
    route: '/command-center',
    routeLabel: 'View Broadcast Relays',
    deliverables: [
      'CMO & Cabinet ministerial press conference live multi-cast feeds',
      'Clean audio-video distribution to broadcast OB vans and TV stations',
      'Simultaneous streaming to official YouTube, Facebook, and X channels',
    ],
  },
  6: {
    route: '/reports',
    routeLabel: 'View Leadership Dossier',
    deliverables: [
      'Daily comprehensive Media Intelligence Digest synthesis',
      'Calculation of 36-district Chief Minister Perception Index (CPI)',
      'Confidential executive briefing note dispatched to Chief Secretary & CMO',
    ],
  },
};

export const DailyWorkFlowchart: React.FC = () => {
  const { activeWorkflowStep, setActiveWorkflowStep } = useDashboardStore();

  const currentStepData =
    DAILY_WORKFLOW_STEPS.find((s) => s.id === activeWorkflowStep) ||
    DAILY_WORKFLOW_STEPS[0];

  const currentMeta = STEP_DETAILS_MAP[currentStepData.id] || STEP_DETAILS_MAP[1];

  const completedCount = DAILY_WORKFLOW_STEPS.filter((s) => s.status === 'Completed').length;
  const activeCount = DAILY_WORKFLOW_STEPS.filter((s) => s.status === 'In Progress').length;
  const scheduledCount = DAILY_WORKFLOW_STEPS.filter((s) => s.status === 'Pending').length;

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col shadow-xs">
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <MaterialIcon name="alt_route" size="sm" className="text-content-primary" />
          <h3 className="text-xs font-bold text-content-primary">
            Webportals — Daily Operations Workflow
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-secondary text-content-secondary rounded border border-borderLine-standard">
            24h Life Cycle
          </span>
          <div className="flex items-center gap-2 text-[11px] text-content-muted">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {completedCount} Done
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {activeCount} Active
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-content-muted">
              {scheduledCount} Scheduled
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-content-muted">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <MaterialIcon name="calendar_today" size="xs" />
            <span>Today, 14:35 IST</span>
          </div>
          <span className="text-content-primary font-medium text-[11px] px-2 py-0.5 bg-surface-secondary rounded border border-borderLine-subtle">
            Shift 2 of 3 Active
          </span>
        </div>
      </div>

      {/* Stepper Timeline Progress Bar */}
      <div className="px-4 pt-4 pb-1">
        <div className="relative">
          {/* Background Track Line */}
          <div className="absolute top-3 left-4 right-4 h-0.5 bg-borderLine-standard -z-0" />
          {/* Completed Track Line */}
          <div
            className="absolute top-3 left-4 h-0.5 bg-emerald-600 -z-0 transition-all duration-300"
            style={{ width: `${((completedCount - 0.5) / (DAILY_WORKFLOW_STEPS.length - 1)) * 100}%` }}
          />

          {/* Stepper Nodes */}
          <div className="flex items-center justify-between relative z-10">
            {DAILY_WORKFLOW_STEPS.map((step, idx) => {
              const isSelected = activeWorkflowStep === step.id;
              const isCompleted = step.status === 'Completed';
              const isInProgress = step.status === 'In Progress';

              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveWorkflowStep(step.id)}
                  className="flex flex-col items-center group focus:outline-none cursor-pointer"
                  title={`Stage ${idx + 1}: ${step.title}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition-all ${
                      isSelected
                        ? 'bg-action-primary text-content-inverse border-action-primary ring-2 ring-borderLine-strong/60 scale-110'
                        : isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600 group-hover:scale-105'
                        : isInProgress
                        ? 'bg-amber-500 text-white border-amber-500 font-bold'
                        : 'bg-surface text-content-muted border-borderLine-standard group-hover:border-borderLine-strong'
                    }`}
                  >
                    {isCompleted ? (
                      <MaterialIcon name="check_circle" size="xs" className="text-white" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`mt-1 font-mono text-[9px] hidden sm:block font-medium transition-colors ${
                      isSelected
                        ? 'text-content-primary font-bold'
                        : 'text-content-muted group-hover:text-content-secondary'
                    }`}
                  >
                    {step.step.split(' - ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Steps in Sequence */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {DAILY_WORKFLOW_STEPS.map((step, index) => (
            <WorkflowStepCard
              key={step.id}
              item={step}
              stepNumber={index + 1}
              isLast={index === DAILY_WORKFLOW_STEPS.length - 1}
              isActive={activeWorkflowStep === step.id}
              onSelect={setActiveWorkflowStep}
            />
          ))}
        </div>

        {/* Selected Step Drill-Down Detail Banner */}
        <div className="p-3.5 bg-surface-secondary border border-borderLine-subtle rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-action-primary text-content-inverse">
                Stage 0{currentStepData.id}
              </span>
              <h4 className="font-bold text-content-primary text-xs">
                {currentStepData.title}
              </h4>
              <span className="font-mono text-[10px] text-content-muted px-1.5 py-0.2 bg-surface rounded border border-borderLine-subtle">
                {currentStepData.step}
              </span>
              <span className="text-[10px] font-semibold text-content-secondary font-mono">
                [{currentStepData.timeSlot}]
              </span>
            </div>

            <p className="text-content-secondary text-[11px] leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Key Deliverables */}
            <div className="pt-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-content-primary uppercase tracking-wider">
                <MaterialIcon name="checklist" size="xs" className="text-content-muted" />
                <span>Shift Standard Operating Procedures (SOP)</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-content-secondary font-mono">
                {currentMeta.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-content-muted font-bold">•</span>
                    <span className="line-clamp-2 text-[10px] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions & Ownership Controls */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-2.5 shrink-0 self-stretch md:self-auto border-t md:border-t-0 pt-2 md:pt-0 border-borderLine-subtle">
            <div className="flex items-center gap-1.5 text-content-secondary font-mono text-[11px]">
              <MaterialIcon name="how_to_reg" size="xs" className="text-content-muted" />
              <span className="font-medium text-content-primary">{currentStepData.owner}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={currentMeta.route}
                className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-borderLine-standard hover:border-borderLine-strong text-content-primary rounded text-[11px] font-medium transition-colors cursor-pointer"
              >
                <span>{currentMeta.routeLabel}</span>
                <MaterialIcon name="open_in_new" size="xs" />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const prevId = activeWorkflowStep > 1 ? activeWorkflowStep - 1 : DAILY_WORKFLOW_STEPS.length;
                    setActiveWorkflowStep(prevId);
                  }}
                  className="p-1 border border-borderLine-standard rounded hover:bg-surface transition-colors text-content-primary cursor-pointer"
                  title="Previous Stage"
                  aria-label="Previous Stage"
                >
                  <MaterialIcon name="arrow_back" size="xs" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextId = activeWorkflowStep < DAILY_WORKFLOW_STEPS.length ? activeWorkflowStep + 1 : 1;
                    setActiveWorkflowStep(nextId);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-action-primary text-content-inverse rounded text-[11px] font-medium hover:bg-action-primary-hover transition-colors cursor-pointer"
                  aria-label="Next Stage"
                >
                  <span>Next Stage</span>
                  <MaterialIcon name="arrow_forward" size="xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
