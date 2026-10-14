'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
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

const PORTAL_SCREENS = [
  { href: '/', label: '2. Dashboard', icon: LayoutDashboard },
  { href: '/command-center', label: '3. Command Center', icon: Radio },
  { href: '/districts', label: '4. Districts', icon: MapPin },
  { href: '/press-releases', label: '5. Press Release', icon: FileText },
  { href: '/media', label: '6. Media', icon: Layers },
  { href: '/activities', label: '7. Activities', icon: Calendar },
  { href: '/crisis', label: '8. Crisis', icon: ShieldAlert },
  { href: '/reports', label: '9. Reports', icon: FileBarChart },
  { href: '/notifications', label: '10. Notification', icon: Bell },
  { href: '/profile', label: '11. Profile', icon: User },
  { href: '/login', label: '1. Logins (State/DM)', icon: KeyRound },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();

  return (
    <aside
      className={`bg-surface border-r border-borderLine-standard flex flex-col transition-all duration-200 z-20 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="py-2 px-3 border-b border-borderLine-subtle">
        <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
          {!sidebarCollapsed ? 'Portal Screens (11)' : 'Portal'}
        </span>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {PORTAL_SCREENS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                isActive
                  ? 'bg-action-primary text-content-inverse font-semibold shadow-sm'
                  : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Action */}
      <div className="p-2 border-t border-borderLine-subtle">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-content-secondary hover:bg-surface-secondary hover:text-content-primary transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
