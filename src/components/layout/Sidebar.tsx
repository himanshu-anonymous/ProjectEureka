'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  LayoutDashboard,
  Radio,
  MapPin,
  FileText,
  Layers,
  Calendar,
  ShieldAlert,
  FileBarChart,
  Bell,
  User,
  KeyRound,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, language } = useDashboardStore();
  const t = useTranslation(language);

  const portalScreens = [
    { href: '/', label: t.sidebar.dashboard, icon: LayoutDashboard },
    { href: '/command-center', label: t.sidebar.commandCenter, icon: Radio },
    { href: '/districts', label: t.sidebar.districts, icon: MapPin },
    { href: '/press-releases', label: t.sidebar.pressReleases, icon: FileText },
    { href: '/media', label: t.sidebar.media, icon: Layers },
    { href: '/activities', label: t.sidebar.activities, icon: Calendar },
    { href: '/crisis', label: t.sidebar.crisis, icon: ShieldAlert },
    { href: '/reports', label: t.sidebar.reports, icon: FileBarChart },
    { href: '/notifications', label: t.sidebar.notifications, icon: Bell },
    { href: '/profile', label: t.sidebar.profile, icon: User },
    { href: '/login', label: t.sidebar.login, icon: KeyRound },
  ];

  return (
    <aside
      className={`bg-[#1E293B] border-r border-slate-800 flex flex-col transition-all duration-200 z-20 select-none shadow-md ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="py-2.5 px-3 border-b border-slate-800/80 bg-[#16202E]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center justify-between">
          {!sidebarCollapsed ? t.sidebar.title : 'MH'}
        </span>
      </div>

      <nav className="flex-1 py-2.5 px-2 space-y-1 overflow-y-auto">
        {portalScreens.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-all ${
                isActive
                  ? 'bg-gov-accent text-white font-bold shadow-xs border-l-3 border-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Action */}
      <div className="p-2 border-t border-slate-800/80 bg-[#16202E]">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto text-amber-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span className="font-medium">{t.sidebar.collapse}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
