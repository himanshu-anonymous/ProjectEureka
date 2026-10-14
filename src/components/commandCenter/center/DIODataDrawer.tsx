'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DIO_DIRECTORY } from '@/data/dashboardData';
import { User, Phone, Mail, Clock, Send } from 'lucide-react';

export const DIODataDrawer: React.FC = () => {
  const { selectedDistrictId, districts } = useDashboardStore();

  const selectedDistrict =
    districts.find((d) => d.id === selectedDistrictId) || districts[0];

  const dioInfo =
    DIO_DIRECTORY[selectedDistrictId] || {
      id: `dio-${selectedDistrict.id}`,
      districtId: selectedDistrict.id,
      districtName: selectedDistrict.name,
      division: `${selectedDistrict.division} Division`,
      officerName: `${selectedDistrict.name} DIO Desk Officer`,
      designation: 'District Information Officer',
      phone: '+91 20 2000 0000',
      email: `dio.${selectedDistrict.id}@maharashtra.gov.in`,
      status: selectedDistrict.dioActive ? 'Active' : 'Standby',
      pendingReleases: 2,
      localAlerts: 0,
      lastActive: '10 min ago',
    };

  return (
    <div className="bg-surface-secondary border border-borderLine-subtle rounded-md p-3.5 space-y-3">
      {/* DIO Header */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface border border-borderLine-standard flex items-center justify-center font-bold text-xs text-content-primary">
            <User className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-content-primary flex items-center gap-1.5">
              <span>{dioInfo.officerName}</span>
              <span className="text-[10px] font-normal text-content-secondary">
                ({dioInfo.designation})
              </span>
            </div>
            <div className="text-[10px] text-content-muted">
              {dioInfo.division} • District Headquarter
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${
            dioInfo.status === 'Active'
              ? 'bg-surface text-content-primary border-borderLine-strong'
              : 'bg-surface-secondary text-content-muted border-borderLine-subtle'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              dioInfo.status === 'Active' ? 'bg-content-primary animate-pulse' : 'bg-content-muted'
            }`}
          ></span>
          <span>{dioInfo.status}</span>
        </span>
      </div>

      {/* Grid of DIO Data Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">Pending Releases</span>
          <span className="font-mono font-bold text-content-primary text-sm">
            {dioInfo.pendingReleases}
          </span>
        </div>
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">Local Alerts</span>
          <span className="font-mono font-bold text-content-primary text-sm flex items-center gap-1">
            {dioInfo.localAlerts > 0 ? (
              <span className="text-content-primary font-bold">● {dioInfo.localAlerts} Active</span>
            ) : (
              '0 Active'
            )}
          </span>
        </div>
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">District CPI</span>
          <span className="font-mono font-bold text-content-primary text-sm">
            {selectedDistrict.cpi}/100
          </span>
        </div>
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">Last Desk Sync</span>
          <span className="font-mono text-content-primary text-xs flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-content-muted" />
            <span>{dioInfo.lastActive}</span>
          </span>
        </div>
      </div>

      {/* Contact & Actions Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-borderLine-subtle text-xs">
        <div className="flex items-center gap-3 text-[11px] text-content-secondary">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-content-muted" />
            <span className="font-mono">{dioInfo.phone}</span>
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-content-muted" />
            <span className="font-mono">{dioInfo.email}</span>
          </span>
        </div>

        <button
          onClick={() => alert(`Direct dispatch order sent to ${dioInfo.officerName} (${dioInfo.districtName} DIO Desk)`)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-action-primary text-content-inverse rounded text-[11px] font-medium hover:bg-action-primary-hover transition-colors shadow-sm"
        >
          <Send className="w-3 h-3" />
          <span>Dispatch Query to DIO</span>
        </button>
      </div>
    </div>
  );
};
