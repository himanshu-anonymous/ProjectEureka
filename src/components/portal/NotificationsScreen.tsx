'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'SLA Warning' | 'DIO Dispatch' | 'Live Briefing' | 'Leadership Directive';
  title: string;
  desc: string;
  time: string;
  urgent: boolean;
  read: boolean;
  source: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    type: 'SLA Warning',
    title: 'Pune District SLA Notice: 38 Minutes Remaining',
    desc: 'Unverified social media post regarding drinking water requires immediate fact check confirmation from Collectorate.',
    time: '12 min ago',
    urgent: true,
    read: false,
    source: 'Rapid Response Triage Desk',
  },
  {
    id: 'NOTIF-2',
    type: 'DIO Dispatch',
    title: 'Nashik DIO Desk Submitted Event Coverage Report',
    desc: 'Bilingual press note and 6 high-resolution photographs submitted for Directorate review and publication.',
    time: '45 min ago',
    urgent: false,
    read: false,
    source: 'Nashik DIO Desk',
  },
  {
    id: 'NOTIF-3',
    type: 'Live Briefing',
    title: 'Live Clean Feed Test Successful: Sahyadri Guest House',
    desc: 'CMO Press Briefing broadcast channel scheduled for 4:00 PM is verified and operational.',
    time: '1 hour ago',
    urgent: false,
    read: true,
    source: 'State Telecast Operations',
  },
  {
    id: 'NOTIF-4',
    type: 'Leadership Directive',
    title: 'DG Directive Acknowledged Across All 6 Administrative Divisions',
    desc: 'Mandatory 90-minute SLA protocol briefing confirmed by 36 District Information Officers.',
    time: '2 hours ago',
    urgent: false,
    read: true,
    source: 'Director General Secretariat',
  },
];

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('All');
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const filterTabs = ['All', 'SLA Warnings', 'DIO Dispatches', 'Directives'];

  const filtered = notifications.filter((n) => {
    if (filter === 'SLA Warnings') return n.type === 'SLA Warning';
    if (filter === 'DIO Dispatches') return n.type === 'DIO Dispatch';
    if (filter === 'Directives') return n.type === 'Leadership Directive';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="notifications" size="sm" className="text-gov-primary" />
            <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
              Operational Notification & Alert Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Executive Bulletins, Urgent SLA Alerts & Regional DIO Communications
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-surface border border-slate-200 rounded-lg p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
        {filterTabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filter === tab
                ? 'bg-gov-primary text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-surface border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {filtered.map((n) => (
          <div
            key={n.id}
            role="button"
            tabIndex={0}
            onClick={() => markAsRead(n.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                markAsRead(n.id);
              }
            }}
            className={`p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs transition-colors cursor-pointer ${
              !n.read ? 'bg-amber-500/5' : 'hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded shrink-0 border ${
                  n.urgent
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : n.type === 'DIO Dispatch'
                    ? 'bg-blue-50 text-gov-blue border-blue-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {n.urgent ? (
                  <MaterialIcon name="gpp_bad" size="sm" className="text-red-700" />
                ) : n.type === 'DIO Dispatch' ? (
                  <MaterialIcon name="how_to_reg" size="sm" className="text-gov-blue" />
                ) : n.type === 'Live Briefing' ? (
                  <MaterialIcon name="podcasts" size="sm" className="text-emerald-700" />
                ) : (
                  <MaterialIcon name="notifications" size="sm" className="text-slate-600" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                  {n.urgent && (
                    <span className="text-[10px] px-2 py-0.2 bg-red-100 text-red-800 font-bold border border-red-200 rounded font-mono">
                      URGENT SLA
                    </span>
                  )}
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" title="Unread notification"></span>
                  )}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{n.desc}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>{n.time}</span>
                  <span>•</span>
                  <span>Source: {n.source}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNotif(n);
                  markAsRead(n.id);
                }}
                className="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 text-slate-700 font-medium whitespace-nowrap shadow-2xs cursor-pointer"
              >
                Review Action
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Action Drawer / Modal */}
      {selectedNotif && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notif-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <MaterialIcon name="error" size="sm" className="text-gov-primary" />
                <h3 id="notif-modal-title" className="text-sm font-bold text-gov-primary">
                  Notification Dossier • {selectedNotif.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Classification</span>
                <span className="font-bold text-slate-900 text-xs">{selectedNotif.type}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Incident / Briefing Title</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedNotif.title}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">Summary & Instructions</span>
                <p className="text-slate-600 leading-relaxed mt-0.5">{selectedNotif.desc}</p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Timestamp: {selectedNotif.time}</span>
                <span>Origin: {selectedNotif.source}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              {selectedNotif.type === 'SLA Warning' ? (
                <Link
                  href="/crisis"
                  onClick={() => setSelectedNotif(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Go to Crisis Desk</span>
                  <MaterialIcon name="arrow_forward" size="xs" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedNotif(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <MaterialIcon name="check" size="xs" />
                  <span>Acknowledge Notice</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
