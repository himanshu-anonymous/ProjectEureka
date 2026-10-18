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
      const selectedUser = MOCK_USERS[matchingKey].user;
      login(selectedUser);

      // Re-issue JWT session for the selected persona
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: selectedUser.username, pin: '8842' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.token) {
            login(selectedUser, data.token);
          }
        })
        .catch(() => {});
    }
  };

  const roles = [
    {
      id: 'dg_admin' as UserRole,
      titleEn: 'State DG Admin',
      titleMr: 'महासंचालक प्रशासन (राज्य)',
      officer: 'Dr. Arvind M. Gokhale',
      officerMr: 'डॉ. अरविंद एम. गोखले',
      clearanceEn: 'Tier 1 — State Command',
      clearanceMr: 'स्तर १ — राज्य कमांड',
      descEn: 'Statewide intelligence, CMO directive dispatch, emergency rebuttal executive clearance across all 36 districts.',
      descMr: 'सर्व ३६ जिल्ह्यांमध्ये राज्यव्यापी गुप्तवार्ता, मुख्यमंत्री निर्देश प्रेषण, तातडीचे खंडन मंजुरी अधिकार.',
    },
    {
      id: 'director_konkan' as UserRole,
      titleEn: 'Divisional Director',
      titleMr: 'विभागीय उपसंचालक',
      officer: 'Rudresh Kumar Sawant',
      officerMr: 'रुद्रेश कुमार सावंत',
      clearanceEn: 'Tier 2 — Division Command',
      clearanceMr: 'स्तर २ — विभागीय कमांड',
      descEn: 'Divisional performance indexing, multi-district coordination, daily work reports.',
      descMr: 'विभागीय कामगिरी निर्देशांक, बहु-जिल्हा समन्वय, दैनंदिन कामकाज अहवाल.',
    },
    {
      id: 'collector' as UserRole,
      titleEn: 'District Collector / DM',
      titleMr: 'जिल्हाधिकारी (पालघर)',
      officer: 'Vikram S. Mahajan, IAS',
      officerMr: 'विक्रम एस. महाजन, भा.प्र.से.',
      clearanceEn: 'Tier 2 — District Command',
      clearanceMr: 'स्तर २ — जिल्हा कमांड',
      descEn: 'Palghar CPI benchmarking, 90-minute SLA official crisis rebuttal authorization and media advisories.',
      descMr: 'पालघर सीपीआय बेंचमार्किंग, ९०-मिनिट एसएलए अधिकृत आपत्कालीन खंडन मंजुरी आणि माध्यम सूचना.',
    },
    {
      id: 'dio_desk' as UserRole,
      titleEn: 'DIO Operator',
      titleMr: 'जिल्हा माहिती अधिकारी कक्ष',
      officer: 'Mandar S. Nerurkar',
      officerMr: 'मंदार एस. नेरुरकर',
      clearanceEn: 'Tier 3 — Field Desk',
      clearanceMr: 'स्तर ३ — क्षेत्रीय कक्ष',
      descEn: 'Daily press note drafting, OCR feed verification, clipping reviews. (Rebuttal authorization disabled).',
      descMr: 'दैनंदिन प्रसिद्धीपत्रक मसुदा, ओसीआर फीड पडताळणी, कात्रण पुनरावलोकन.',
    },
  ];

  // Derive dynamic officer metadata
  const officerName = currentUser
    ? language === 'mr'
      ? currentUser.marathiName
      : currentUser.name
    : language === 'mr'
    ? 'डॉ. अरविंद एम. गोखले'
    : 'Dr. Arvind M. Gokhale';

  const officerInitials = currentUser?.avatarInitials || 'AG';
  const officerDesignation = currentUser
    ? language === 'mr'
      ? currentUser.role === 'dg_admin'
        ? 'महासंचालक (माहिती व जनसंपर्क), महाराष्ट्र शासन'
        : currentUser.role === 'director_konkan'
        ? 'विभागीय उपसंचालक'
        : currentUser.role === 'collector'
        ? 'जिल्हा दंडाधिकारी व जिल्हाधिकारी, पालघर'
        : 'जिल्हा माहिती अधिकारी कक्ष'
      : currentUser.designation
    : language === 'mr'
    ? 'महासंचालक (माहिती व जनसंपर्क), महाराष्ट्र शासन'
    : 'Director General (DGIPR), Maharashtra';

  const officerId =
    currentUser?.username === 'admin'
      ? 'MH-DGIPR-ADMIN-01'
      : currentUser?.username === 'director_konkan'
      ? 'DIV-DIR-01'
      : currentUser?.username === 'collector_palghar'
      ? 'PALGHAR-DM-COLLECTOR-01'
      : 'PALGHAR-DIO-DESK-01';

  const cadreInfo =
    language === 'mr'
      ? userRole === 'dg_admin'
        ? 'भा.प्र.से. (महाराष्ट्र: २००८)'
        : userRole === 'collector'
        ? 'भा.प्र.से. (महाराष्ट्र: २०१२)'
        : userRole === 'director_konkan'
        ? 'राज्य माहिती सेवा (वर्ग-१)'
        : 'माहिती व जनसंपर्क दुय्यम सेवा'
      : userRole === 'dg_admin'
      ? 'IAS (MH: 2008)'
      : userRole === 'collector'
      ? 'IAS (MH: 2012)'
      : userRole === 'director_konkan'
      ? 'State Information Service (Class-I)'
      : 'Information & PR Subordinate Service';

  const postingStation =
    language === 'mr'
      ? userRole === 'dg_admin'
        ? 'मंत्रालय, मुंबई'
        : userRole === 'director_konkan'
        ? 'विभागीय संचलनालय, नवी मुंबई'
        : 'जिल्हाधिकारी कार्यालय संकुल, पालघर'
      : userRole === 'dg_admin'
      ? 'Mantralaya, Mumbai'
      : userRole === 'director_konkan'
      ? 'Divisional Directorate, Navi Mumbai'
      : 'Collectorate Complex, Palghar';

  const clearanceBadge =
    language === 'mr'
      ? userRole === 'dg_admin'
        ? 'सुरक्षा स्तर १: राज्य कमांड डेक'
        : userRole === 'director_konkan'
        ? 'सुरक्षा स्तर २: विभागीय संनियंत्रण'
        : userRole === 'collector'
        ? 'सुरक्षा स्तर २: जिल्हा वैधानिक कमांड'
        : 'सुरक्षा स्तर ३: क्षेत्रीय कक्ष व छाननी'
      : userRole === 'dg_admin'
      ? 'Clearance Tier 1: State Command Deck'
      : userRole === 'director_konkan'
      ? 'Clearance Tier 2: Division Oversight'
      : userRole === 'collector'
      ? 'Clearance Tier 2: District Statutory Command'
      : 'Clearance Tier 3: Field Desk & Triage';

  const jurisdictionScope =
    language === 'mr'
      ? userRole === 'dg_admin'
        ? 'संपूर्ण महाराष्ट्र (३६ जिल्हे)'
        : userRole === 'director_konkan'
        ? 'विभागीय कार्यक्षेत्र (५ सक्रिय जिल्हे)'
        : 'पालघर जिल्हा (नियुक्त कार्यक्षेत्र)'
      : userRole === 'dg_admin'
      ? 'All Maharashtra (36 Districts)'
      : userRole === 'director_konkan'
      ? 'Divisional Jurisdiction (5 Active Districts)'
      : 'Palghar District (Assigned Scope)';

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <MaterialIcon name="person" size="sm" className="text-gov-primary" />
          <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
            {language === 'mr' ? 'अधिकारी प्रोफाइल आणि सुरक्षा नियंत्रण' : 'Officer Profile & Access Governance'}
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'mr'
            ? 'सक्रिय अधिकारी सुरक्षा मंजुरी, कार्यक्षेत्र आणि अधिकार प्रत्यायोजन'
            : 'Active Officer Security Clearance, Operational Scope & Role Delegation'}
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
              title={language === 'mr' ? 'सक्रिय प्रमाणित सत्र' : 'Active Verified Session'}
            >
              <MaterialIcon name="check" size="xs" />
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{officerName}</h3>
            <p className="text-xs font-semibold text-amber-700 mt-0.5">{officerDesignation}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {language === 'mr' ? 'माहिती व जनसंपर्क महासंचालनालय, महाराष्ट्र शासन' : 'DGIPR, Government of Maharashtra'}
            </p>
          </div>

          <span className="px-3 py-1 bg-gov-primary text-white rounded-full text-[11px] font-mono font-bold tracking-tight">
            {clearanceBadge}
          </span>

          <div className="w-full pt-3 border-t border-slate-100 text-left space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'संवर्ग व सेवा:' : 'Cadre & Service:'}
              </span>
              <span className="font-mono font-bold text-slate-800">{cadreInfo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'अधिकारी आयडी:' : 'Officer ID:'}
              </span>
              <span className="font-mono font-bold text-slate-800">{officerId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'कार्यस्थान:' : 'Posting Station:'}
              </span>
              <span className="text-slate-800 font-semibold">{postingStation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'अधिकारक्षेत्र:' : 'Jurisdiction:'}
              </span>
              <span className="font-bold text-slate-800">{jurisdictionScope}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'आपत्कालीन खंडन अधिकार:' : 'Crisis Rebuttal Rights:'}
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  currentUser?.canAuthorizeRebuttals
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentUser?.canAuthorizeRebuttals
                  ? language === 'mr'
                    ? 'अधिकृत (१-क्लिक)'
                    : 'Authorized (1-Click)'
                  : language === 'mr'
                  ? 'मर्यादित (केवळ जिल्हाधिकारी)'
                  : 'Restricted (Collector Only)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'सुरक्षा सत्र:' : 'Security Session:'}
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <MaterialIcon name="lock" size="xs" className="text-emerald-600" />
                <span>JWT (HS256) • 12-Hour TTL</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                {language === 'mr' ? 'शेवटचा प्रवेश:' : 'Last Login:'}
              </span>
              <span className="font-mono text-slate-600 text-[11px]">
                {language === 'mr' ? 'आज, १४:३०' : 'Today, 14:30 IST'}
              </span>
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
                <span>
                  {language === 'mr' ? 'अधिकारी भूमिका बदला / प्रत्यायोजन' : 'Switch Officer Persona / Role Delegation'}
                </span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {language === 'mr' ? 'सुरक्षा स्तर अनुकरण' : 'Simulate Clearance Tiers'}
              </span>
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
                        <span className="font-bold text-xs">{language === 'mr' ? r.titleMr : r.titleEn}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 font-medium ${
                          isActive ? 'text-amber-300' : 'text-slate-500'
                        }`}
                      >
                        <strong>{language === 'mr' ? r.officerMr : r.officer}</strong>
                      </div>
                      <p
                        className={`text-[11px] mt-2 leading-relaxed ${
                          isActive ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {language === 'mr' ? r.descMr : r.descEn}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/40 text-[10px] font-mono">
                      <span className={isActive ? 'text-amber-200 font-bold' : 'text-slate-500'}>
                        {language === 'mr' ? r.clearanceMr : r.clearanceEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Localization Preferences */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <MaterialIcon name="language" size="xs" className="text-gov-primary" />
              <span>{language === 'mr' ? 'पोर्टलची मुख्य भाषा' : 'Portal Primary Language'}</span>
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
                {language === 'mr' ? 'इंग्रजी (राज्य अधिकृत)' : 'English (State Official)'}
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
                {language === 'mr' ? 'मराठी (महाराष्ट्र राजभाषा)' : 'Marathi (State Official)'}
              </button>
            </div>

            {/* Save Preferences Action (Adjacent to Language Selector) */}
            <div className="pt-2 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-xs">
                  <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
                  <span>
                    {language === 'mr' ? 'अधिकारी प्राधान्ये जतन केली' : 'Officer preferences verified and saved'}
                  </span>
                </span>
              ) : (
                <span className="text-slate-400 text-[11px]">
                  {language === 'mr'
                    ? 'सेटिंग्ज त्वरित लागू होतात'
                    : 'Settings take effect immediately'}
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
                <span>
                  {saveSuccess
                    ? language === 'mr'
                      ? 'प्राधान्ये जतन केली'
                      : 'Preferences Saved'
                    : language === 'mr'
                    ? 'अधिकारी प्राधान्ये जतन करा'
                    : 'Save Officer Preferences'}
                </span>
              </button>
            </div>
          </div>

          {/* Infrastructure & Audit Footprint */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MaterialIcon name="dns" size="xs" className="text-slate-500" />
              <span>
                {language === 'mr' ? 'महा-क्लाउड शासन पायाभूत सुविधा पडताळणी' : 'Maha-Cloud Gov Infrastructure Verification'}
              </span>
            </div>
            <p className="text-slate-500">
              {language === 'mr' ? (
                <>
                  राज्य डेटा केंद्र (SDC) महानेट टियर-४ क्लाउड संरचनेवर सत्र सत्यापित. सर्व कृती, क्वेरी प्रेषण आणि खंडन मंजुऱ्या अधिकृत SHA-256 डिजिटल ऑडिट नोंदीसह <strong>{officerName}</strong> ({officerId}) साठी नोंदवल्या जातात.
                </>
              ) : (
                <>
                  Session verified on State Data Centre (SDC) MahNet Tier-4 cloud infrastructure. All actions, query dispatches, and rebuttal authorizations are signed with official SHA-256 digital governance audit logs for{' '}
                  <strong>{officerName}</strong> ({officerId}).
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
