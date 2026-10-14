'use client';

import React from 'react';
import { LEADERSHIP_MESSAGES } from '@/data/dashboardData';
import { MessageSquareText, Award, Clock } from 'lucide-react';

export const LeadershipMessagesSection: React.FC = () => {
  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col p-4 space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">DG & Director Messages</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-surface-secondary text-content-primary rounded border border-borderLine-standard">
          Official Directives
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {LEADERSHIP_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className="p-3 rounded border border-borderLine-subtle bg-surface-secondary/50 hover:bg-surface-secondary transition-colors space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-content-primary" />
                <span className="font-bold text-content-primary">{msg.sender}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                  msg.priority === 'Urgent'
                    ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                    : 'bg-surface text-content-secondary border-borderLine-standard'
                }`}
              >
                ● {msg.priority}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-content-primary">
              {msg.title}
            </div>

            <p className="text-[11px] text-content-secondary leading-relaxed">
              {msg.content}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-borderLine-subtle text-[10px] text-content-muted font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{msg.timestamp}</span>
              </span>
              <span className="text-content-primary font-medium">{msg.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
