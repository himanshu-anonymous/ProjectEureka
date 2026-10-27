'use client';

import React from 'react';
import { LEADERSHIP_MESSAGES } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const LeadershipMessagesSection: React.FC = () => {
  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col p-4 space-y-3 shadow-2xs">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <MaterialIcon name="speaker_notes" size="sm" className="text-gov-primary" />
          <div>
            <h4 className="text-xs font-bold text-gov-primary">DG & Director Messages</h4>
            <p className="text-[10px] text-slate-500">Executive Bulletins & Statewide Directives</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Official Feed</span>
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-2.5">
        {LEADERSHIP_MESSAGES.map((msg) => {
          let badgeStyle = 'text-slate-600';
          let dotColor = 'bg-slate-400';
          if (msg.priority === 'Urgent') {
            badgeStyle = 'text-rose-700 font-bold';
            dotColor = 'bg-rose-600 animate-pulse';
          } else if (msg.priority === 'Directive') {
            badgeStyle = 'text-amber-700 font-bold';
            dotColor = 'bg-amber-500';
          }

          return (
            <div
              key={msg.id}
              className="p-3 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5 text-xs shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="military_tech" size="xs" className="text-gov-accent" />
                  <span className="font-bold text-gov-primary">{msg.sender}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-mono whitespace-nowrap ${badgeStyle}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                  <span>{msg.priority}</span>
                </span>
              </div>

              <div className="text-[11px] font-bold text-slate-900">
                {msg.title}
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {msg.content}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <MaterialIcon name="schedule" size="xs" className="text-slate-400" />
                  <span>{msg.timestamp}</span>
                </span>
                <span className="text-gov-primary font-semibold">{msg.role}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
