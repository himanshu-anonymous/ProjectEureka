'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const SettingsScreen: React.FC = () => {
  const { language, setLanguage, setToast, currentUser, userRole } = useDashboardStore();

  // Settings State
  const [activeTab, setActiveTab] = useState<'general' | 'alerts' | 'map' | 'security'>('general');
  const [numeralsStyle, setNumeralsStyle] = useState<'standard' | 'devanagari'>('standard');
  const [sessionTimeout, setSessionTimeout] = useState<number>(60);
  const [slaWarningMinutes, setSlaWarningMinutes] = useState<number>(45);
  const [enableSmsAlerts, setEnableSmsAlerts] = useState<boolean>(true);
  const [enableMantralayaBanner, setEnableMantralayaBanner] = useState<boolean>(true);
  const [autoDraftRebuttals, setAutoDraftRebuttals] = useState<boolean>(true);
  const [defaultDivision, setDefaultDivision] = useState<string>('all');
  const [showNumbersOnLoad, setShowNumbersOnLoad] = useState<boolean>(true);
  const [showHighwaysOnLoad, setShowHighwaysOnLoad] = useState<boolean>(true);

  const handleSaveSettings = () => {
    setToast({
      message:
        language === 'mr'
          ? 'प्रणाली संरचना व सेटिंग्ज यशस्वीरित्या जतन करण्यात आल्या.'
          : 'Institutional settings and governance preferences saved successfully.',
      type: 'success',
    });
  };

  const handleResetDefaults = () => {
    setNumeralsStyle('standard');
    setSessionTimeout(60);
    setSlaWarningMinutes(45);
    setEnableSmsAlerts(true);
    setEnableMantralayaBanner(true);
    setShowNumbersOnLoad(true);
    setToast({
      message:
        language === 'mr'
          ? 'सेटिंग्ज डीफॉल्ट मूल्यांवर पुनर्संचयित करण्यात आल्या.'
          : 'Settings restored to official state defaults.',
      type: 'info',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1480px] w-full mx-auto space-y-6">
      {/* 1. Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Government Administrative Configuration Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MaterialIcon name="domain" size="md" className="text-slate-800" />
            <span>
              {language === 'mr'
                ? 'प्रणाली संरचना व संस्थात्मक सेटिंग्ज'
                : 'Institutional Settings & Governance Preferences'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'अधिकारी मंजुरी स्तर, भाषा प्राधान्ये, क्रायसिस एसएलए सूचना नियम व जीआयएस नकाशा नियंत्रण.'
              : 'Configure administrative clearance tiers, Devanagari numerals, crisis SLA dispatch thresholds, and cartography defaults.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'mr' ? 'डीफॉल्ट पुनर्संचयित करा' : 'Reset Defaults'}
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <MaterialIcon name="check" size="xs" />
            <span>{language === 'mr' ? 'सेटिंग्ज जतन करा' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MaterialIcon name="language" size="xs" />
          <span>{language === 'mr' ? '१. सामान्य व भाषा' : '1. General & Language'}</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MaterialIcon name="notifications" size="xs" />
          <span>{language === 'mr' ? '२. क्रायसिस एसएलए सूचना' : '2. Crisis SLA Alerts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'map'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MaterialIcon name="map" size="xs" />
          <span>{language === 'mr' ? '३. जीआयएस नकाशा सेटिंग्ज' : '3. GIS Map Settings'}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MaterialIcon name="shield" size="xs" />
          <span>{language === 'mr' ? '४. अधिकारी सुरक्षा व टोकन' : '4. Security & Officer Profile'}</span>
        </button>
      </div>

      {/* 3. Settings Forms Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {language === 'mr' ? 'भाषा व प्रादेशिक स्वरूप' : 'Language & Regional Localization'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mr'
                  ? 'संपूर्ण डॅशबोर्ड, अहवाल व विश्लेषणाची प्राथमिक भाषा निवडा.'
                  : 'Select primary administrative language for command center portals and exports.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setLanguage('mr')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  language === 'mr'
                    ? 'border-amber-500 bg-amber-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  language === 'mr' ? 'border-amber-600 bg-amber-600' : 'border-slate-400'
                }`}>
                  {language === 'mr' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">मराठी (देवनागरी राजभाषा)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    महाराष्ट्र शासनाची अधिकृत राजभाषा. सर्व मसुदे, वर्तमानपत्र कात्रणे व अहवाल मराठीत दिसतील.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  language === 'en'
                    ? 'border-amber-500 bg-amber-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                  language === 'en' ? 'border-amber-600 bg-amber-600' : 'border-slate-400'
                }`}>
                  {language === 'en' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">English (Administrative Official)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official English interface with synchronized dual-script district and telemetry overlays.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'अंक स्वरूप (Numeral Formatting):' : 'Numeral Formatting System:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'नकाशा क्रमांक व गुणांकांसाठी आंतरराष्ट्रीय (1,2,3) किंवा देवनागरी (१,२,३) अंक.'
                      : 'Display numbers on maps, indices, and telemetry in International or Devanagari numerals.'}
                  </span>
                </div>
                <select
                  value={numeralsStyle}
                  onChange={(e) => setNumeralsStyle(e.target.value as any)}
                  className="h-8.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="standard">International (1, 2, 3, 4)</option>
                  <option value="devanagari">Devanagari (१, २, ३, ४)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'सत्र कालबाह्यता (Session Timeout):' : 'Operational Session Timeout:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'अक्रियतेनंतर सुरक्षित आपोआप लॉगआउट कालावधी.'
                      : 'Inactivity duration before automatic secure re-authentication lock.'}
                  </span>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="h-8.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value={15}>15 Minutes (High Security)</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes (Standard)</option>
                  <option value={120}>120 Minutes (Briefing Mode)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {language === 'mr' ? 'क्रायसिस प्रतिसाद व ९०-मिनिट एसएलए सूचना' : 'Crisis Response & 90-Minute SLA Thresholds'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mr'
                  ? 'संवेदनशील बातम्या व सोशल मीडिया अफवांचे खंडन करण्यासाठी सूचना ट्रिगर करा.'
                  : 'Configure automated notification dispatch when crisis response SLA enters critical countdown.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? '९०-मिनिट पूर्वसूचना इशारा (SLA Warning Threshold):' : 'Early Warning Threshold:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'जिल्हाधिकारी व माहिती अधिकाऱ्यास सूचना पाठवण्याची उर्वरित वेळ.'
                      : 'Trigger escalation alerts when crisis timer has remaining time below this threshold.'}
                  </span>
                </div>
                <select
                  value={slaWarningMinutes}
                  onChange={(e) => setSlaWarningMinutes(Number(e.target.value))}
                  className="h-8.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value={60}>60 Minutes remaining</option>
                  <option value={45}>45 Minutes remaining (Recommended)</option>
                  <option value={30}>30 Minutes remaining (Urgent)</option>
                  <option value={15}>15 Minutes remaining (Emergency)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'एसएमएस व व्हॉट्सॲप थेट अलर्ट रिले:' : 'Emergency SMS & WhatsApp Relay:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'संबंधित जिल्हाधिकारी व विभागीय संचालकांच्या अधिकृत क्रमांकावर थेट संदेश.'
                      : 'Send real-time SMS to concerned District Collector and Divisional Director.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableSmsAlerts}
                  onChange={(e) => setEnableSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'मंत्रालय मुख्य फ्लॅश बॅनर (Mantralaya Banner):' : 'Mantralaya Flash Alert Ribbon:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'उच्चस्तरीय अधिकाऱ्यांच्या स्क्रीनवर लाल फ्लॅश अलर्ट दाखवा.'
                      : 'Display prominent flashing red banner at the top of the executive command deck.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableMantralayaBanner}
                  onChange={(e) => setEnableMantralayaBanner(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'स्वयंचलित प्रसिद्धीपत्रक मसुदा (Auto-Draft Rebuttal):' : 'Auto-Draft AI Rebuttal Dispatch:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'माध्यम भावना ६०% खाली घसरल्यास तात्काळ प्राथमिक प्रेस नोट तयार करा.'
                      : 'Generate pre-formatted official clarification release when public sentiment drops below 60%.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoDraftRebuttals}
                  onChange={(e) => setAutoDraftRebuttals(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {language === 'mr' ? 'जीआयएस नकाशा व कार्टोग्राफी प्राधान्ये' : 'GIS Map & Cartography Defaults'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mr'
                  ? 'महाराष्ट्र नकाशा उघडताना दिसणारे थर व जिल्हा क्रमांक प्राधान्ये सेट करा.'
                  : 'Customize default layer visibility and numbering badges for the interactive state map.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'जिल्हा क्रमांक बॅजेस (#१ ते #३६):' : 'District Number Badges (#1 to #36):'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'नकाशा लोड होताच प्रत्येक जिल्ह्यावर ठळक क्रमांक दाखवा.'
                      : 'Show high-contrast numbered badges prominently on each district by default.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showNumbersOnLoad}
                  onChange={(e) => setShowNumbersOnLoad(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'राष्ट्रीय महामार्ग व समृद्धी कॉरिडॉर थर:' : 'National Highways & Expressways Layer:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'गुगल मॅप्स शैलीतील महामार्ग व द्रुतगती मार्ग नेहमी दृश्यमान ठेवा.'
                      : 'Keep major highway conduits and Samruddhi expressway visible on map render.'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showHighwaysOnLoad}
                  onChange={(e) => setShowHighwaysOnLoad(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-xs text-slate-900 block font-bold">
                    {language === 'mr' ? 'प्रारंभिक विभाग निवड (Default Division Focus):' : 'Default Division Focus:'}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {language === 'mr'
                      ? 'डॅशबोर्ड उघडताना नकाशाचा प्रारंभिक झूम विभाग.'
                      : 'Initial division bounding box to frame on dashboard startup.'}
                  </span>
                </div>
                <select
                  value={defaultDivision}
                  onChange={(e) => setDefaultDivision(e.target.value)}
                  className="h-8.5 px-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="all">All 36 Districts (Full State)</option>
                  <option value="konkan">Konkan Division (Thane, Mumbai, Palghar, Raigad, Sindhudurg)</option>
                  <option value="pune">Pune Division</option>
                  <option value="nashik">Nashik Division</option>
                  <option value="chhatrapati-sambhajinagar">Chhatrapati Sambhajinagar Division</option>
                  <option value="nagpur">Nagpur Division</option>
                  <option value="amravati">Amravati Division</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {language === 'mr' ? 'सध्याचे अधिकारी प्रोफाइल व सुरक्षा स्तर' : 'Active Officer Profile & Security Tier'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mr'
                  ? 'डिजिटल स्वाक्षरी प्रमाणपत्र आणि शासकीय मंजुरी अधिकार पडताळणी.'
                  : 'Verified cryptographic identity token and administrative tier clearance.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {language === 'mr' ? 'प्रमाणित अधिकारी:' : 'Certified Officer:'}
                </span>
                <strong className="text-slate-900 text-sm font-bold block mt-0.5">
                  Dr. Arvind M. Gokhale
                </strong>
                <span className="text-slate-600 block text-[11px]">
                  Director General (DG), Information & Public Relations
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {language === 'mr' ? 'सुरक्षा मंजुरी स्तर:' : 'Clearance Tier:'}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 font-mono text-[11px]">
                    TIER 1 APEX STATEWIDE
                  </span>
                  <span className="text-slate-500 text-[11px]">• Role: {userRole}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {language === 'mr' ? 'डिजिटल टोकन (DSC):' : 'Digital Token (DSC):'}
                </span>
                <span className="font-mono text-slate-800 block mt-0.5">
                  e-Mudhra Class 3 Government Token [Active]
                </span>
                <span className="text-slate-400 text-[10px]">Valid thru: Dec 2027</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {language === 'mr' ? 'डेटा धारणा धोरण:' : 'Data Retention Protocol:'}
                </span>
                <span className="text-slate-800 block mt-0.5 font-medium">
                  90-Day Telemetry Logs Archive with NIC Cloud Backup
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
