'use client';

import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    type: 'SLA Warning',
    title: 'Pune District SLA Notice: 38 Minutes Remaining',
    desc: 'Unverified social media post regarding drinking water requires immediate fact check confirmation from Collectorate.',
    time: '12 min ago',
    urgent: true,
  },
  {
    id: 'NOTIF-2',
    type: 'DIO Dispatch',
    title: 'Nashik DIO Desk Submitted Event Coverage Report',
    desc: 'Bilingual press note and 6 high-resolution photographs submitted for Directorate review and publication.',
    time: '45 min ago',
    urgent: false,
  },
  {
    id: 'NOTIF-3',
    type: 'Live Briefing',
    title: 'Live Clean Feed Test Successful: Sahyadri Guest House',
    desc: 'CMO Press Briefing broadcast channel scheduled for 4:00 PM is verified and operational.',
    time: '1 hour ago',
    urgent: false,
  },
  {
    id: 'NOTIF-4',
    type: 'Leadership Directive',
    title: 'DG Directive Acknowledged Across All 6 Administrative Divisions',
    desc: 'Mandatory 90-minute SLA protocol briefing confirmed by 36 District Information Officers.',
    time: '2 hours ago',
    urgent: false,
  },
];

export const NotificationsScreen: React.FC = () => {
  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span>Operational Notification & Alert Center</span>
        </h2>
        <p className="text-xs text-content-muted">
          Real-time Executive Bulletins, Urgent SLA Alerts & Regional DIO Communications
        </p>
      </div>

      <div className="bg-surface border border-borderLine-standard rounded-md divide-y divide-borderLine-subtle">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className="p-4 flex items-start justify-between gap-3 text-xs hover:bg-surface-secondary transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-surface-secondary border border-borderLine-subtle shrink-0">
                {n.urgent ? (
                  <AlertCircle className="w-4 h-4 text-content-primary animate-pulse" />
                ) : (
                  <Bell className="w-4 h-4 text-content-secondary" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-content-primary text-xs">{n.title}</span>
                  {n.urgent && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-action-primary text-content-inverse rounded font-mono">
                      URGENT
                    </span>
                  )}
                </div>
                <p className="text-content-secondary text-xs">{n.desc}</p>
                <span className="font-mono text-[10px] text-content-muted block">{n.time}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Reviewing action for ${n.id}`)}
              className="px-2.5 py-1 text-xs border border-borderLine-standard rounded hover:bg-surface-secondary whitespace-nowrap"
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
