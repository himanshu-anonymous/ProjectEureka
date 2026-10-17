'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DIO_DIRECTORY } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { getOfficerName, getOfficerRole, getDivisionName } from '@/lib/dataLocalization';

export const DIODataDrawer: React.FC = () => {
  const { selectedDistrictId, districts, language } = useDashboardStore();
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => setDispatched(false), 3000);
  };

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

  const officerDisplay = getOfficerName(dioInfo.officerName, language);
  const designationDisplay =
    getOfficerRole(dioInfo.officerName, language) ||
    (language === 'mr' ? 'जिल्हा माहिती अधिकारी' : dioInfo.designation);
  const divisionDisplay = getDivisionName(dioInfo.division, language);
  const statusDisplay =
    dioInfo.status === 'Active'
      ? language === 'mr'
        ? 'सक्रिय'
        : 'Active'
      : language === 'mr'
      ? 'स्टँडबाय'
      : dioInfo.status;

  const lastActiveDisplay =
    language === 'mr'
      ? dioInfo.lastActive.replace('min ago', 'मि. पूर्वी').replace('hour ago', 'तासापूर्वी')
      : dioInfo.lastActive;

  return (
    <div className="bg-surface-secondary border border-borderLine-subtle rounded-md p-3.5 space-y-3">
      {/* DIO Header */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface border border-borderLine-standard flex items-center justify-center font-bold text-xs text-content-primary">
            <MaterialIcon name="person" size="xs" />
          </div>
          <div>
            <div className="text-xs font-bold text-content-primary flex items-center gap-1.5">
              <span>{officerDisplay}</span>
              <span className="text-[10px] font-normal text-content-secondary">
                ({designationDisplay})
              </span>
            </div>
            <div className="text-[10px] text-content-muted">
              {divisionDisplay} • {language === 'mr' ? 'जिल्हा मुख्यालय' : 'District Headquarter'}
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1.5 border ${
            dioInfo.status === 'Active'
              ? 'bg-surface text-content-primary border-borderLine-strong'
              : 'bg-surface-secondary text-content-muted border-borderLine-subtle'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              dioInfo.status === 'Active' ? 'bg-emerald-600' : 'bg-content-muted'
            }`}
          />
          <span>{statusDisplay}</span>
        </span>
      </div>

      {/* Grid of DIO Data Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">
            {language === 'mr' ? 'प्रलंबित प्रसिद्धी' : 'Pending Releases'}
          </span>
          <span className="font-mono font-bold text-content-primary text-sm">
            {dioInfo.pendingReleases}
          </span>
        </div>
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">
            {language === 'mr' ? 'स्थानिक सूचना' : 'Local Alerts'}
          </span>
          <span className="font-mono font-bold text-content-primary text-sm flex items-center gap-1">
            {dioInfo.localAlerts > 0 ? (
              <span className="text-content-primary font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                <span>
                  {dioInfo.localAlerts} {language === 'mr' ? 'सक्रिय' : 'Active'}
                </span>
              </span>
            ) : (
              `0 ${language === 'mr' ? 'सक्रिय' : 'Active'}`
            )}
          </span>
        </div>
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">
            {language === 'mr' ? 'जिल्हा सीपीआय' : 'District CPI'}
          </span>
          <span className="font-mono font-bold text-content-primary text-sm">
            {selectedDistrict.cpi}/100
          </span>
        </div>
        <div className="bg-surface p-2 rounded border border-borderLine-subtle">
          <span className="text-[10px] text-content-muted block">
            {language === 'mr' ? 'शेवटचे डेस्क सिंक' : 'Last Desk Sync'}
          </span>
          <span className="font-mono text-content-primary text-xs flex items-center gap-1 mt-0.5">
            <MaterialIcon name="schedule" size="xs" className="text-content-muted" />
            <span>{lastActiveDisplay}</span>
          </span>
        </div>
      </div>

      {/* Contact & Actions Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-borderLine-subtle text-xs">
        <div className="flex items-center gap-3 text-[11px] text-content-secondary">
          <span className="flex items-center gap-1">
            <MaterialIcon name="call" size="xs" className="text-content-muted" />
            <span className="font-mono">{dioInfo.phone}</span>
          </span>
          <span className="flex items-center gap-1">
            <MaterialIcon name="mail" size="xs" className="text-content-muted" />
            <span className="font-mono">{dioInfo.email}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleDispatch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
            dispatched
              ? 'bg-emerald-700 text-white'
              : 'bg-gov-primary text-white hover:bg-gov-primary-dark'
          }`}
        >
          {dispatched ? (
            <>
              <MaterialIcon name="check" size="xs" />
              <span>
                {language === 'mr' ? 'विचारणा डेस्कवर पाठवली' : 'Query Dispatched to Desk'}
              </span>
            </>
          ) : (
            <>
              <MaterialIcon name="send" size="xs" />
              <span>
                {language === 'mr' ? 'डीआयओला विचारणा पाठवा' : 'Dispatch Query to DIO'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
