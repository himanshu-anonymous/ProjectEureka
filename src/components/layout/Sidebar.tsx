'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  LayoutDashboard,
  Radio,
  FileText,
  AlertTriangle,
  Building2,
  Newspaper,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'command-overview', label: 'Command Overview', icon: LayoutDashboard },
  { id: 'media-surveillance', label: 'Media Surveillance', icon: Radio },
  { id: 'narrative-sentiment', label: 'Narrative & Sentiment', icon: FileText },
  { id: 'misinformation', label: 'Misinformation & Fact-Checking', icon: AlertTriangle },
  { id: 'district-operations', label: 'District Operations', icon: Building2 },
  { id: 'press-releases', label: 'Press Releases & Briefings', icon: Newspaper },
  { id: 'audit-telemetry', label: 'Audit & Telemetry', icon: ShieldCheck },
];

export const Sidebar: React.FC = () => {
  const { selectedNav, setSelectedNav, sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();

  return (
    <aside
      className={`bg-surface border-r border-borderLine-standard flex flex-col transition-all duration-200 z-20 ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav className="flex-1 py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors text-left ${
                isSelected
                  ? 'bg-surface-selected text-content-primary font-semibold'
                  : 'text-content-secondary hover:bg-surface-secondary hover:text-content-primary'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-content-primary" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Action */}
      <div className="p-2 border-t border-borderLine-subtle">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-content-secondary hover:bg-surface-secondary hover:text-content-primary transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
