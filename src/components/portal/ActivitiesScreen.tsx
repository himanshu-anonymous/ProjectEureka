'use client';

import React from 'react';
import { DailyWorkFlowchart } from '@/components/workflow/DailyWorkFlowchart';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

const EVENTS = [
  {
    time: '10:30 AM',
    title: 'State Seed & Fertilizer Distribution Review',
    location: 'Pune District Collectorate',
    minister: 'Minister for Agriculture',
    coverage: 'Accredited Media & DIO Pune',
    status: 'Completed',
  },
  {
    time: '02:00 PM',
    title: 'Review Meeting: Monsoon Disaster Readiness & Dam Levels',
    location: 'Mantralaya Conference Hall, Mumbai',
    minister: 'Hon. Deputy Chief Minister',
    coverage: 'Live Clean Feed & DGIPR Press Pool',
    status: 'Ongoing',
  },
  {
    time: '04:00 PM',
    title: 'Press Briefing: State Cabinet Decisions',
    location: 'Sahyadri Guest House, Mumbai',
    minister: 'Hon. Chief Minister',
    coverage: 'National & Regional Broadcasters',
    status: 'Scheduled',
  },
  {
    time: '06:30 PM',
    title: 'District Information Officers Performance Review',
    location: 'Virtual Command Link (All 36 Districts)',
    minister: 'Director General (DGIPR)',
    coverage: 'Internal Operations',
    status: 'Scheduled',
  },
];

export const ActivitiesScreen: React.FC = () => {
  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <MaterialIcon name="calendar_today" size="sm" className="text-content-primary" />
          <span>Government Activities & Press Coverage Itinerary</span>
        </h2>
        <p className="text-xs text-content-muted">
          Daily Ministerial Tours, Cabinet Briefings & Field Press Coverage
        </p>
      </div>

      {/* Daily Work Flowchart */}
      <DailyWorkFlowchart />

      {/* Events Itinerary */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
          <h3 className="text-xs font-bold text-content-primary">
            Today&apos;s High-Level Public Schedules & VIP Itinerary
          </h3>
          <span className="text-[11px] font-mono text-content-muted">
            {EVENTS.length} Events Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EVENTS.map((ev, i) => (
            <div
              key={i}
              className="p-3 bg-surface-secondary/40 border border-borderLine-subtle rounded space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-content-primary px-1.5 py-0.5 bg-surface rounded border border-borderLine-subtle text-[11px]">
                  {ev.time}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-borderLine-standard bg-surface">
                  {ev.status}
                </span>
              </div>

              <h4 className="font-bold text-content-primary text-xs">{ev.title}</h4>

              <div className="space-y-1 text-[11px] text-content-secondary">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="location_on" size="xs" className="text-content-muted shrink-0" />
                  <span>{ev.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="person" size="xs" className="text-content-muted shrink-0" />
                  <span>{ev.minister}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
