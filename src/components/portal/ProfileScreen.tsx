'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { UserRole } from '@/types/dashboard';
import { MOCK_USERS } from '@/lib/serverData';

export const ProfileScreen: React.FC = () => {
  const { userRole, setUserRole, currentUser, login, language, setLanguage } = useDashboardStore();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRoleSwitch = (roleKey: UserRole) => {
    setUserRole(roleKey);

    // Sync currentUser to the corresponding mock user persona
    const matchingKey = Object.keys(MOCK_USERS).find((k) => MOCK_USERS[k].user.role === roleKey);
    if (matchingKey && MOCK_USERS[matchingKey]) {
      login(MOCK_USERS[matchingKey].user);
    }
  };

  const roles = [
    {
      id: 'dg_admin' as UserRole,
      title: 'State DG Admin',
      marathi: 'महासंचालक प्रशासन (राज्य)',
      officer: 'Dr. Arvind M. Gokhale',
      clearance: 'Tier 1 — State Command',
      desc: 'Statewide intelligence, CMO directive dispatch, emergency rebuttal executive clearance across all 36 districts.',
    },
    {
      id: 'director_konkan' as UserRole,
      title: 'Divisional Director',
      marathi: 'विभागीय उपसंचालक (कोकण)',
      officer: 'Rudresh Kumar Sawant',
      clearance: 'Tier 2 — Division Command',
      desc: 'Konkan Division performance indexing, multi-district coordination, daily work reports.',
    },
    {
      id: 'collector' as UserRole,
      title: 'District Collector / DM',
      marathi: 'जिल्हाधिकारी (पालघर)',
      officer: 'Vikram S. Mahajan, IAS',
      clearance: 'Tier 2 — District Command',
      desc: 'Palghar CPI benchmarking, 90-minute SLA official crisis rebuttal authorization and media advisories.',
    },
    {
      id: 'dio_desk' as UserRole,
      title: 'DIO Operator 1',
      marathi: 'जिल्हा माहिती अधिकारी कक्ष',
      officer: 'Mandar S. Nerurkar',
      clearance: 'Tier 3 — Field Desk',
      desc: 'Daily press note drafting, OCR feed verification, clipping reviews. (Rebuttal authorization disabled).',
    },
  ];

  // Derive dynamic officer metadata
  const officerName = currentUser
    ? language === 'mr'
      ? currentUser.marathiName
      : currentUser.name
    : 'Dr. Arvind M. Gokhale';

  const officerInitials = currentUser?.avatarInitials || 'AG';
  const officerDesignation = currentUser?.designation || 'Director General (DGIPR), Maharashtra';

  const officerId =
    currentUser?.username === 'admin'
      ? 'MH-DGIPR-ADMIN-01'
      : currentUser?.username === 'director_konkan'
      ? 'KONKAN-DIV-DIR-01'
      : currentUser?.username === 'collector_palghar'
      ? 'PALGHAR-DM-COLLECTOR-01'
      : 'PALGHAR-DIO-DESK-01';

  const cadreInfo =
    userRole === 'dg_admin'
      ? 'IAS (MH: 2008)'
      : userRole === 'collector'
      ? 'IAS (MH: 2012)'
      : userRole === 'director_konkan'
      ? 'State Information Service (Class-I)'
      : 'Information & PR Subordinate Service';

  const postingStation =
    userRole === 'dg_admin'
      ? 'Mantralaya, Mumbai'
      : userRole === 'director_konkan'
      ? 'Kokan Bhavan, CBD Belapur, Navi Mumbai'
      : 'Collectorate Complex, Palghar';

  const clearanceBadge =
    userRole === 'dg_admin'
      ? 'Clearance Tier 1: State Command Deck'
      : userRole === 'director_konkan'
      ? 'Clearance Tier 2: Division Oversight'
      : userRole === 'collector'
      ? 'Clearance Tier 2: District Statutory Command'
      : 'Clearance Tier 3: Field Desk & Triage';

  const jurisdictionScope =
    userRole === 'dg_admin'
      ? 'All Maharashtra (36 Districts)'
      : userRole === 'director_konkan'
      ? 'Konkan Division (5 Districts)'
      : 'Palghar District (Assigned Scope)';

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="person" size="sm" className="text-gov-primary" />
          <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
            Officer Profile & Access Governance
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Active Officer Security Clearance, Operational Scope & Role Delegation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Officer Identity Card — Dynamic to Authenticated User */}
        <div className="bg-surface border border-slate-200 rounded-lg p-5 flex flex-col items-center text-center space-y-4 shadow-2xs">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center font-bold text-2xl text-white shadow-xs">
              {officerInitials}
            </div>
            <span
              className="absolute bottom-0 right-0 p-1 bg-emerald-600 rounded-full text-white border-2 border-white"
              title="Active Verified Session"
            >
              <MaterialIcon name="check" size="xs" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{officerName}</h3>
            <p className="text-xs font-semibold text-amber-700 mt-0.5">{officerDesignation}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">DGIPR, Government of Maharashtra</p>
          </div>

          <span className="px-3 py-1 bg-gov-primary text-white rounded-full text-[11px] font-mono font-bold tracking-tight">
            {clearanceBadge}
          </span>

          <div className="w-full pt-3 border-t border-slate-100 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Cadre & Service:</span>
              <span className="font-mono font-bold text-slate-800">{cadreInfo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Officer ID:</span>
              <span className="font-mono font-bold text-slate-800">{officerId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Posting Station:</span>
              <span className="text-slate-800 font-semibold">{postingStation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Jurisdiction:</span>
              <span className="font-bold text-slate-800">{jurisdictionScope}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Crisis Rebuttal Rights:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  currentUser?.canAuthorizeRebuttals
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentUser?.canAuthorizeRebuttals ? 'Authorized (1-Click)' : 'Restricted (Collector Only)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Security Session:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <MaterialIcon name="lock" size="xs" className="text-emerald-600" />
                <span>256-Bit Encrypted SDC</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Last Login:</span>
              <span className="font-mono text-slate-600 text-[11px]">Today, 14:30 IST</span>
            </div>
          </div>
        </div>

        {/* Role Delegation & Preferences */}
        <div className="lg:col-span-2 bg-surface border border-slate-200 rounded-lg p-5 space-y-5 text-xs shadow-2xs">
          {/* Active Role Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MaterialIcon name="shield" size="xs" className="text-gov-primary" />
                <span>Switch Officer Persona / Role Delegation</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Simulate Clearance Tiers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((r) => {
                const isActive = userRole === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => handleRoleSwitch(r.id)}
                    className={`p-3.5 rounded-lg border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'bg-gov-primary text-white border-gov-primary shadow-xs ring-2 ring-gov-accent/50'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{r.title}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 font-medium ${
                          isActive ? 'text-amber-300' : 'text-slate-500'
                        }`}
                      >
                        {r.marathi} • <strong>{r.officer}</strong>
                      </div>
                      <p
                        className={`text-[11px] mt-2 leading-relaxed ${
                          isActive ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {r.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/40 text-[10px] font-mono">
                      <span className={isActive ? 'text-amber-200 font-bold' : 'text-slate-500'}>
                        {r.clearance}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Localization Preferences */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <MaterialIcon name="language" size="xs" className="text-gov-primary" />
              <span>Portal Primary Language</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-md font-semibold text-xs border transition-colors text-center cursor-pointer ${
                  language === 'en'
                    ? 'bg-gov-primary text-white border-gov-primary shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                English (State Official)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`py-2 px-3 rounded-md font-semibold text-xs border transition-colors text-center cursor-pointer ${
                  language === 'mr'
                    ? 'bg-gov-primary text-white border-gov-primary shadow-2xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                मराठी (महाराष्ट्र राजभाषा)
              </button>
            </div>
          </div>

          {/* Infrastructure & Audit Footprint */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MaterialIcon name="dns" size="xs" className="text-slate-500" />
              <span>Maha-Cloud Gov Infrastructure Verification</span>
            </div>
            <p className="text-slate-500">
              Session verified on State Data Centre (SDC) MahNet Tier-4 cloud infrastructure. All actions, query dispatches, and rebuttal authorizations are signed with official SHA-256 digital governance audit logs for{' '}
              <strong>{officerName}</strong> ({officerId}).
            </p>
          </div>

          {/* Save Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-xs">
                <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
                <span>Officer preferences verified and saved</span>
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                Settings take effect across all portal screens immediately
              </span>
            )}

            <button
              type="button"
              onClick={handleSave}
              className={`px-4 py-2 rounded text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gov-primary hover:bg-gov-primary-dark text-white'
              }`}
            >
              {saveSuccess && <MaterialIcon name="check_circle" size="xs" />}
              <span>{saveSuccess ? 'Preferences Saved' : 'Save Officer Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
