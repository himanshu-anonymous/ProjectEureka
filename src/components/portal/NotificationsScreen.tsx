'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import Link from 'next/link';
import { useDashboardStore } from '@/stores/dashboardStore';

interface NotificationItem {
  id: string;
  type: 'SLA Warning' | 'DIO Dispatch' | 'Live Briefing' | 'Leadership Directive';
  typeMr: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  timeEn: string;
  timeMr: string;
  urgent: boolean;
  read: boolean;
  sourceEn: string;
  sourceMr: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-1',
    type: 'SLA Warning',
    typeMr: 'एसएलए इशारा',
    titleEn: 'Pune District SLA Notice: 38 Minutes Remaining',
    titleMr: 'पुणे जिल्हा एसएलए सूचना: ३८ मिनिटे शिल्लक',
    descEn: 'Unverified social media post regarding drinking water requires immediate fact check confirmation from Collectorate.',
    descMr: 'पिण्याच्या पाण्याबाबत सोशल मीडियावरील अपडताळलेल्या पोस्टची जिल्हाधिकारी कार्यालयाकडून तातडीने तथ्य तपासणी आवश्यक आहे.',
    timeEn: '12 min ago',
    timeMr: '१२ मिनिटांपूर्वी',
    urgent: true,
    read: false,
    sourceEn: 'Rapid Response Triage Desk',
    sourceMr: 'त्वरित प्रतिसाद छाननी कक्ष',
  },
  {
    id: 'NOTIF-2',
    type: 'DIO Dispatch',
    typeMr: 'डीआयओ प्रेषण',
    titleEn: 'Nashik DIO Desk Submitted Event Coverage Report',
    titleMr: 'नाशिक जिल्हा माहिती अधिकारी कक्षाने कार्यक्रम कव्हरेज अहवाल सादर केला',
    descEn: 'Official press note and 6 high-resolution photographs submitted for Directorate review and publication.',
    descMr: 'संचालनालय पुनरावलोकन आणि प्रकाशनासाठी अधिकृत प्रसिद्धीपत्रक आणि ६ छायाचित्रे सादर केली.',
    timeEn: '45 min ago',
    timeMr: '४५ मिनिटांपूर्वी',
    urgent: false,
    read: false,
    sourceEn: 'Nashik DIO Desk',
    sourceMr: 'नाशिक जिल्हा माहिती कक्ष',
  },
  {
    id: 'NOTIF-3',
    type: 'Live Briefing',
    typeMr: 'थेट वार्तालाप',
    titleEn: 'Live Clean Feed Test Successful: Sahyadri Guest House',
    titleMr: 'थेट प्रक्षेपण चाचणी यशस्वी: सह्याद्री अतिथीगृह',
    descEn: 'CMO Press Briefing broadcast channel scheduled for 4:00 PM is verified and operational.',
    descMr: 'दुपारी ४:०० वाजता नियोजित मुख्यमंत्री वार्ताहर परिषद प्रसारण वाहिनी प्रमाणित व कार्यान्वित आहे.',
    timeEn: '1 hour ago',
    timeMr: '१ तासापूर्वी',
    urgent: false,
    read: true,
    sourceEn: 'State Telecast Operations',
    sourceMr: 'राज्य दूरचित्रवाणी कामकाज',
  },
  {
    id: 'NOTIF-4',
    type: 'Leadership Directive',
    typeMr: 'नेतृत्व निर्देश',
    titleEn: 'DG Directive Acknowledged Across All 6 Administrative Divisions',
    titleMr: 'सर्व ६ प्रशासकीय विभागांमध्ये महासंचालकांच्या निर्देशांची दखल',
    descEn: 'Mandatory 90-minute SLA protocol briefing confirmed by 36 District Information Officers.',
    descMr: 'अनिवार्य ९०-मिनिट एसएलए नियमावलीची ३६ जिल्हा माहिती अधिकाऱ्यांकडून पुष्टी.',
    timeEn: '2 hours ago',
    timeMr: '२ तासांपूर्वी',
    urgent: false,
    read: true,
    sourceEn: 'Director General Secretariat',
    sourceMr: 'महासंचालक सचिवालय',
  },
];

export const NotificationsScreen: React.FC = () => {
  const { language } = useDashboardStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<string>('All');
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);

  const filterTabs = [
    { key: 'All', labelEn: 'All', labelMr: 'सर्व' },
    { key: 'SLA Warnings', labelEn: 'SLA Warnings', labelMr: 'एसएलए इशारे' },
    { key: 'DIO Dispatches', labelEn: 'DIO Dispatches', labelMr: 'डीआयओ प्रेषणे' },
    { key: 'Directives', labelEn: 'Directives', labelMr: 'निर्देश' },
  ];

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
              {language === 'mr' ? 'कामकाज सूचना व अलर्ट केंद्र' : 'Operational Notification & Alert Center'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'रिअल-टाइम कार्यकारी बुलेटिन, तातडीचे एसएलए अलर्ट आणि विभागीय डीआयओ संदेश'
              : 'Real-time Executive Bulletins, Urgent SLA Alerts & Regional DIO Communications'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
            <span>
              {language === 'mr'
                ? `सर्व वाचले म्हणून चिन्हांकित करा (${unreadCount})`
                : `Mark All as Read (${unreadCount})`}
            </span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-surface border border-slate-200 rounded-lg p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
        {filterTabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              filter === tab.key
                ? 'bg-gov-primary text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {language === 'mr' ? tab.labelMr : tab.labelEn}
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
                  <span className="font-bold text-slate-900 text-xs">
                    {language === 'mr' ? n.titleMr : n.titleEn}
                  </span>
                  {n.urgent && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-700 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                      <span>{language === 'mr' ? 'तातडीचे एसएलए' : 'URGENT SLA'}</span>
                    </span>
                  )}
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread notification"></span>
                  )}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {language === 'mr' ? n.descMr : n.descEn}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>{language === 'mr' ? n.timeMr : n.timeEn}</span>
                  <span>•</span>
                  <span>{language === 'mr' ? 'स्रोत:' : 'Source:'} {language === 'mr' ? n.sourceMr : n.sourceEn}</span>
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
                {language === 'mr' ? 'कृती तपासा' : 'Review Action'}
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
                  {language === 'mr' ? 'सूचना डॉसियर' : 'Notification Dossier'} • {selectedNotif.id}
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
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  {language === 'mr' ? 'वर्गीकरण' : 'Classification'}
                </span>
                <span className="font-bold text-slate-900 text-xs">
                  {language === 'mr' ? selectedNotif.typeMr : selectedNotif.type}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  {language === 'mr' ? 'घटना / माहिती शीर्षक' : 'Incident / Briefing Title'}
                </span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {language === 'mr' ? selectedNotif.titleMr : selectedNotif.titleEn}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  {language === 'mr' ? 'सारांश व सूचना' : 'Summary & Instructions'}
                </span>
                <p className="text-slate-600 leading-relaxed mt-0.5">
                  {language === 'mr' ? selectedNotif.descMr : selectedNotif.descEn}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 font-mono flex justify-between">
                <span>{language === 'mr' ? 'वेळ:' : 'Timestamp:'} {language === 'mr' ? selectedNotif.timeMr : selectedNotif.timeEn}</span>
                <span>{language === 'mr' ? 'उगम:' : 'Origin:'} {language === 'mr' ? selectedNotif.sourceMr : selectedNotif.sourceEn}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              {selectedNotif.type === 'SLA Warning' ? (
                <Link
                  href="/crisis"
                  onClick={() => setSelectedNotif(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{language === 'mr' ? 'आपत्कालीन कक्षाकडे जा' : 'Go to Crisis Desk'}</span>
                  <MaterialIcon name="arrow_forward" size="xs" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedNotif(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <MaterialIcon name="check" size="xs" />
                  <span>{language === 'mr' ? 'सूचना मान्य करा' : 'Acknowledge Notice'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              >
                {language === 'mr' ? 'बंद करा' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
