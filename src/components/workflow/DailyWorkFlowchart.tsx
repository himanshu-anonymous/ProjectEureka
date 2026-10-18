'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { DAILY_WORKFLOW_STEPS } from '@/data/dashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import { WorkflowStepCard } from './WorkflowStepCard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

interface StepDetailMeta {
  route: string;
  routeLabelEn: string;
  routeLabelMr: string;
}

const STEP_DETAILS_MAP: Record<number, StepDetailMeta> = {
  1: {
    route: '/media',
    routeLabelEn: 'Explore Media Feeds',
    routeLabelMr: 'माध्यम फीड पहा',
  },
  2: {
    route: '/system-monitoring',
    routeLabelEn: 'Open System Monitoring',
    routeLabelMr: 'प्रणाली निरीक्षण उघडा',
  },
  3: {
    route: '/press-releases',
    routeLabelEn: 'Open Press Releases',
    routeLabelMr: 'प्रसिद्धीपत्रके उघडा',
  },
  4: {
    route: '/crisis',
    routeLabelEn: 'Open Crisis SLA Command',
    routeLabelMr: 'आपत्कालीन एसएलए कमांड उघडा',
  },
  5: {
    route: '/command-center',
    routeLabelEn: 'View Broadcast Relays',
    routeLabelMr: 'थेट प्रक्षेपण रिले पहा',
  },
  6: {
    route: '/reports',
    routeLabelEn: 'View Leadership Dossier',
    routeLabelMr: 'नेतृत्व डॉसियर पहा',
  },
};

interface CycleState {
  quadrant: number;
  hourInCycle: number;
  minutesInCycle: number;
  isPastMidpoint: boolean;
  activeCycleStepId: number;
}

function getCycleState(): CycleState {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // 4 quadrants per day across 24h:
  // Q1: 00:00 - 05:59, Q2: 06:00 - 11:59, Q3: 12:00 - 17:59, Q4: 18:00 - 23:59
  const quadrant = Math.floor(hours / 6) + 1;
  const hourInCycle = hours % 6; // 0 to 5
  const minutesInCycle = hourInCycle * 60 + minutes; // 0 to 359

  // Midpoint is at 180 minutes (3 hours = exactly 50% of the 6-hour timeline duration)
  const isPastMidpoint = minutesInCycle >= 180;

  // Active step (1 to 6) shifts sequentially each hour of the 6h cycle
  const activeCycleStepId = Math.min(6, Math.max(1, hourInCycle + 1));

  return {
    quadrant,
    hourInCycle,
    minutesInCycle,
    isPastMidpoint,
    activeCycleStepId,
  };
}

export const DailyWorkFlowchart: React.FC = () => {
  const { activeWorkflowStep, setActiveWorkflowStep, language } = useDashboardStore();
  const [cycleState, setCycleState] = useState<CycleState>(getCycleState);

  // Periodically update 6-hour cycle state
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCycleState(getCycleState());
    }, 30000);
    return () => clearInterval(cycleInterval);
  }, []);

  // Dynamically compute steps status based on the 6-hour operational cycle
  const dynamicSteps = useMemo(() => {
    return DAILY_WORKFLOW_STEPS.map((step, idx) => {
      const stepNum = idx + 1;
      let status: 'Completed' | 'In Progress' | 'Pending';
      if (stepNum < cycleState.activeCycleStepId) {
        status = 'Completed';
      } else if (stepNum === cycleState.activeCycleStepId) {
        status = 'In Progress';
      } else {
        status = 'Pending';
      }

      return {
        ...step,
        step: `Sequence 0${stepNum}`,
        metric: step.id === 5 ? 'Live Broadcast Relay Ready' : step.metric,
        status,
      };
    });
  }, [cycleState.activeCycleStepId]);

  const currentStepData =
    dynamicSteps.find((s) => s.id === activeWorkflowStep) || dynamicSteps[0];
  const currentMeta = STEP_DETAILS_MAP[currentStepData.id] || STEP_DETAILS_MAP[1];

  const completedCount = dynamicSteps.filter((s) => s.status === 'Completed').length;
  const activeCount = dynamicSteps.filter((s) => s.status === 'In Progress').length;
  const scheduledCount = dynamicSteps.filter((s) => s.status === 'Pending').length;

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col shadow-xs">
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <MaterialIcon name="alt_route" size="sm" className="text-content-primary" />
          <h3 className="text-xs font-bold text-content-primary">
            {language === 'mr' ? 'वेबपोर्टल — दैनंदिन कामकाज कार्यप्रवाह' : 'Webportals — Daily Operations Workflow'}
          </h3>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono px-2.5 py-0.5 rounded-md">
            {language === 'mr' ? '६-तास स्थिती चक्र' : '6h Status Cycle'}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-content-muted">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {completedCount} {language === 'mr' ? 'पूर्ण' : 'Done'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {activeCount} {language === 'mr' ? 'सक्रिय' : 'Active'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-content-muted">
              {scheduledCount} {language === 'mr' ? 'नियोजित' : 'Scheduled'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Half-Timeline (50% Midpoint) Auto-Trigger Status Pill */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-amber-50/80 border border-amber-300 text-amber-900 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            <span>
              {language === 'mr'
                ? 'स्वयंचलित ट्रिगर: ५०% टप्पा (३ तास)'
                : 'Auto-Trigger: @ 50% Timeline (3h Midpoint)'}
            </span>
          </span>

          {/* 6-Hour Cycle Rotation Indicator */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>
              {language === 'mr'
                ? 'स्वयंचलित रीफ्रेश: दर ६ तासांनी • चक्र सक्रिय'
                : 'Auto-Refresh: Every 6 Hours • Cycle Active'}
            </span>
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
            style={{ width: `${((completedCount - 0.5) / (dynamicSteps.length - 1)) * 100}%` }}
          />

          {/* Stepper Nodes */}
          <div className="flex items-center justify-between relative z-10">
            {dynamicSteps.map((step, idx) => {
              const isSelected = activeWorkflowStep === step.id;
              const isCompleted = step.status === 'Completed';
              const isInProgress = step.status === 'In Progress';
              const stepTitle = language === 'mr' ? step.titleMr || step.title : step.title;

              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveWorkflowStep(step.id)}
                  className="flex flex-col items-center group focus:outline-none cursor-pointer"
                  title={`${language === 'mr' ? `क्रम ०${idx + 1}` : `Sequence ${idx + 1}`}: ${stepTitle}`}
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
                    {language === 'mr' ? `क्रम ०${idx + 1}` : `SEQ 0${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Steps in Sequence */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {dynamicSteps.map((step, index) => (
            <WorkflowStepCard
              key={step.id}
              item={step}
              stepNumber={index + 1}
              isLast={index === dynamicSteps.length - 1}
              isActive={activeWorkflowStep === step.id}
              onSelect={setActiveWorkflowStep}
            />
          ))}
        </div>

        {/* Compact, Streamlined Active Sequence Action Row */}
        <div className="p-3 bg-surface-secondary border border-borderLine-subtle rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 1. Active Sequence Badge */}
            <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-action-primary text-content-inverse">
              {language === 'mr' ? `क्रम ०${currentStepData.id}` : `Sequence 0${currentStepData.id}`} •{' '}
              {currentStepData.status === 'Completed'
                ? language === 'mr'
                  ? 'पूर्ण'
                  : 'Done'
                : currentStepData.status === 'In Progress'
                ? language === 'mr'
                  ? 'सक्रिय'
                  : 'Active'
                : language === 'mr'
                ? 'नियोजित'
                : 'Scheduled'}
            </span>

            {/* 2. Activity Title */}
            <h4 className="font-bold text-content-primary text-xs">
              {language === 'mr' ? currentStepData.titleMr || currentStepData.title : currentStepData.title}
            </h4>

            {/* 3. Assigned Desk */}
            <div className="flex items-center gap-1.5 text-content-secondary font-mono text-[11px] pl-2 border-l border-borderLine-subtle">
              <MaterialIcon name="how_to_reg" size="xs" className="text-content-muted" />
              <span className="font-medium text-content-primary">
                {language === 'mr' ? currentStepData.ownerMr || currentStepData.owner : currentStepData.owner}
              </span>
            </div>
          </div>

          {/* 4. Essential Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Link
              href={currentMeta.route}
              className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-borderLine-standard hover:border-borderLine-strong text-content-primary rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              <span>{language === 'mr' ? currentMeta.routeLabelMr : currentMeta.routeLabelEn}</span>
              <MaterialIcon name="open_in_new" size="xs" />
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const prevId =
                    activeWorkflowStep > 1 ? activeWorkflowStep - 1 : dynamicSteps.length;
                  setActiveWorkflowStep(prevId);
                }}
                className="p-1 border border-borderLine-standard rounded hover:bg-surface transition-colors text-content-primary cursor-pointer"
                title={language === 'mr' ? 'मागील क्रम' : 'Previous Sequence'}
                aria-label={language === 'mr' ? 'मागील क्रम' : 'Previous Sequence'}
              >
                <MaterialIcon name="arrow_back" size="xs" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextId =
                    activeWorkflowStep < dynamicSteps.length ? activeWorkflowStep + 1 : 1;
                  setActiveWorkflowStep(nextId);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-action-primary text-content-inverse rounded text-[11px] font-medium hover:bg-action-primary-hover transition-colors cursor-pointer"
                aria-label={language === 'mr' ? 'पुढील क्रम' : 'Next Sequence'}
              >
                <span>{language === 'mr' ? 'पुढील क्रम' : 'Next Sequence'}</span>
                <MaterialIcon name="arrow_forward" size="xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
