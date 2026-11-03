'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { OFFICES_ATTENDANCE_DATA, STATE_ATTENDANCE_SUMMARY, OfficeAttendanceRecord, OfficerHierarchyTier } from '@/data/attendanceData';

const TIER_ORDER: OfficerHierarchyTier[] = ['DG', 'Director', 'Deputy Director', 'DIO'];

const TIER_META: Record<
  OfficerHierarchyTier,
  {
    titleEn: string;
    titleMr: string;
    icon: any;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    headerBg: string;
    headerBorder: string;
    headerText: string;
    subtitleEn: string;
    subtitleMr: string;
  }
> = {
  DG: {
    titleEn: 'Director General (DG)',
    titleMr: 'महासंचालक (Director General)',
    icon: 'military_tech',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    headerBg: 'bg-amber-500/10',
    headerBorder: 'border-amber-200',
    headerText: 'text-amber-950',
    subtitleEn: 'State Leadership & Executive Command • Mantralaya HQ',
    subtitleMr: 'राज्य नेतृत्व व प्रशासकीय मुख्यालय • मंत्रालय',
  },
  Director: {
    titleEn: 'Directors',
    titleMr: 'संचालक (Directors)',
    icon: 'corporate_fare',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-900',
    badgeBorder: 'border-indigo-300',
    headerBg: 'bg-indigo-500/10',
    headerBorder: 'border-indigo-200',
    headerText: 'text-indigo-950',
    subtitleEn: 'Statewide Media, News, Digital & Administration Directors',
    subtitleMr: 'वृत्त, जनसंपर्क, समाजमाध्यम व प्रशासन संचालक',
  },
  'Deputy Director': {
    titleEn: 'Deputy Directors & Senior PROs',
    titleMr: 'उपसंचालक व जनसंपर्क अधिकारी (Deputy Directors)',
    icon: 'groups',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
    badgeBorder: 'border-blue-300',
    headerBg: 'bg-blue-500/10',
    headerBorder: 'border-blue-200',
    headerText: 'text-blue-950',
    subtitleEn: 'CMO, DCM, Media Crisis, Delhi & Divisional Deputy Directors',
    subtitleMr: 'सीएमओ, डीसीएम, संकट निवारण व विभागीय उपसंचालक',
  },
  DIO: {
    titleEn: 'District Information Officers (DIO)',
    titleMr: 'जिल्हा माहिती अधिकारी (DIO)',
    icon: 'location_on',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    headerBg: 'bg-emerald-500/10',
    headerBorder: 'border-emerald-200',
    headerText: 'text-emerald-950',
    subtitleEn: '36 District Information Offices Across Maharashtra',
    subtitleMr: 'महाराष्ट्रातील सर्व ३६ जिल्हा माहिती कार्यालये',
  },
};

export const AttendanceScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'partial'>('all');

  const filteredOffices = useMemo(() => {
    return OFFICES_ATTENDANCE_DATA.filter((office) => {
      const matchesTier = selectedTier === 'All' || office.tier === selectedTier;
      const matchesDiv = selectedDivision === 'All' || office.division === selectedDivision;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        office.officeName.toLowerCase().includes(q) ||
        office.officeNameMr.toLowerCase().includes(q) ||
        office.officerInCharge.toLowerCase().includes(q) ||
        office.officerInChargeMr.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'full'
          ? office.attendancePercent === 100
          : office.attendancePercent < 100;
      return matchesTier && matchesDiv && matchesSearch && matchesStatus;
    });
  }, [selectedTier, selectedDivision, searchQuery, statusFilter]);

  const groupedOffices = useMemo(() => {
    const groups: { tier: OfficerHierarchyTier; offices: OfficeAttendanceRecord[] }[] = [];
    TIER_ORDER.forEach((tier) => {
      const officesInTier = filteredOffices.filter((o) => o.tier === tier);
      if (officesInTier.length > 0) {
        groups.push({ tier, offices: officesInTier });
      }
    });
    return groups;
  }, [filteredOffices]);

  const handleExportAttendance = () => {
    setToast({
      message:
        language === 'mr'
          ? 'बायोमेट्रिक्स उपस्थिती अहवाल (CSV/Excel) निर्यात केला जात आहे.'
          : 'Exporting Aadhaar BAS Biometric Attendance Report (Excel)...',
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-4">
      {/* Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MaterialIcon name="fingerprint" size="sm" className="text-gov-primary" />
            <span>
              {language === 'mr'
                ? 'केआरए जबाबदार अधिकारी व ३६ जिल्हा कार्यालये बायोमेट्रिक्स उपस्थिती'
                : 'KRA Leadership & 36 District Offices Biometric Attendance'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'मुख्यालय, मंत्रालय कक्ष व ३६ जिल्हा केआरए अधिकाऱ्यांची आधार आधारित दैनिक हजेरी व वेळपालन'
              : 'Aadhaar BAS punch-in records, field duty status & punctuality for KRA Mandated Officers & DIOs'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportAttendance}
            className="px-3 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-lg text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <MaterialIcon name="file_download" size="xs" />
            <span>{language === 'mr' ? 'उपस्थिती अहवाल' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* State-Level KPI Summary Cards (Power BI Inspired) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'एकूण मंजूर कर्मचारी' : 'Total Sanctioned Staff'}
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <MaterialIcon name="groups" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{STATE_ATTENDANCE_SUMMARY.totalSanctionedStaff}</span>
            <span className="text-xs font-semibold text-slate-500">
              {language === 'mr' ? '३७ कार्यालये (मुख्यालय + ३६ जिल्हे)' : '37 Offices (HQ + 36 DIOs)'}
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <MaterialIcon name="verified" size="xs" />
            <span>100% Aadhaar BAS Enrolled</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'आज उपस्थित कर्मचारी' : 'Present Today'}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <MaterialIcon name="how_to_reg" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{STATE_ATTENDANCE_SUMMARY.presentTodayCount}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {STATE_ATTENDANCE_SUMMARY.presentPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 mt-1">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${STATE_ATTENDANCE_SUMMARY.presentPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">
            {language === 'mr' ? 'कालच्या तुलनेत +१.८% वाढ' : '+1.8% vs yesterday attendance'}
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'वेळेवर उपस्थिती (१० वाजेपूर्वी)' : 'On-Time Punctuality'}
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <MaterialIcon name="schedule" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{STATE_ATTENDANCE_SUMMARY.punctualityPercent}%</span>
            <span className="text-xs font-semibold text-slate-500">
              {language === 'mr' ? 'विहित वेळेत पंच-इन' : 'Punched in ≤ 10:00 AM'}
            </span>
          </div>
          <div className="relative w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 mt-1">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${STATE_ATTENDANCE_SUMMARY.punctualityPercent}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
              style={{ left: '85%' }}
              title="Target: 85%"
            />
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <MaterialIcon name="arrow_upward" size="xs" />
            <span>Target: ≥ 85% (Met)</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'क्षेत्रीय दौऱ्यावर / रजेवर' : 'On Field Tour / Leave'}
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <MaterialIcon name="commute" size="sm" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{STATE_ATTENDANCE_SUMMARY.onFieldDutyCount}</span>
            <span className="text-xs text-slate-500">
              {language === 'mr' ? 'दौऱ्यावर • १४ अधिकृत रजा' : 'On field • 14 Approved leave'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex border border-slate-200 mt-1">
            <div className="bg-purple-500 h-full" style={{ width: '65%' }} title="Field Duty" />
            <div className="bg-amber-400 h-full" style={{ width: '35%' }} title="Leave" />
          </div>
          <div className="text-[11px] text-purple-700 font-semibold">
            {language === 'mr' ? 'जिल्हाधिकारी मान्यता प्राप्त दौरे' : 'All field operations geotagged'}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        {/* Row 1: Position Hierarchy Segregation Bar (DG -> Director -> Deputy Director -> DIO) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <MaterialIcon name="military_tech" size="xs" className="text-amber-600" />
            <span>{language === 'mr' ? 'पदक्रम स्तर वर्गीकरण (Position Segregation):' : 'Hierarchy Segregation:'}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
            {[
              { id: 'All', labelMr: 'सर्व पदक्रम (४८)', labelEn: 'All Positions (48)', icon: 'groups' },
              { id: 'DG', labelMr: '१. महासंचालक (DG)', labelEn: '1. DG (1)', icon: 'military_tech' },
              { id: 'Director', labelMr: '२. संचालक (Director)', labelEn: '2. Director (4)', icon: 'corporate_fare' },
              { id: 'Deputy Director', labelMr: '३. उपसंचालक (Dep. Director)', labelEn: '3. Deputy Director (11)', icon: 'verified_user' },
              { id: 'DIO', labelMr: '४. जिल्हा माहिती अधिकारी (DIO)', labelEn: '4. DIO (32)', icon: 'location_on' },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedTier === tier.id
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <MaterialIcon name={tier.icon as any} size="xs" />
                <span>{language === 'mr' ? tier.labelMr : tier.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Division & Search Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Division Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
            {[
              { id: 'All', label: language === 'mr' ? 'सर्व विभाग' : 'All Divisions' },
              { id: 'Mumbai Region', label: language === 'mr' ? 'मुंबई मुख्यालय' : 'Mumbai HQ' },
              { id: 'CMO / DCM Office', label: language === 'mr' ? 'सीएमओ / डीसीएम' : 'CMO / DCM' },
              { id: 'Konkan', label: language === 'mr' ? 'कोकण' : 'Konkan' },
              { id: 'Pune', label: language === 'mr' ? 'पुणे' : 'Pune' },
              { id: 'Kolhapur', label: language === 'mr' ? 'कोल्हापूर' : 'Kolhapur' },
              { id: 'Nashik', label: language === 'mr' ? 'नाशिक' : 'Nashik' },
              { id: 'Chhatrapati Sambhajinagar', label: language === 'mr' ? 'छ. संभाजीनगर' : 'Chh. Sambhajinagar' },
              { id: 'Latur', label: language === 'mr' ? 'लातूर' : 'Latur' },
              { id: 'Amravati', label: language === 'mr' ? 'अमरावती' : 'Amravati' },
              { id: 'Nagpur', label: language === 'mr' ? 'नागपूर' : 'Nagpur' },
              { id: 'Delhi Office', label: language === 'mr' ? 'दिल्ली केंद्र' : 'Delhi Office' },
            ].map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDivision === div.id
                    ? 'bg-gov-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {div.label}
              </button>
            ))}
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'mr' ? 'कार्यालय / अधिकारी शोधा...' : 'Search office or officer...'}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gov-blue"
              />
              <MaterialIcon
                name="search"
                size="xs"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">{language === 'mr' ? 'सर्व उपस्थिती' : 'All Status'}</option>
              <option value="full">{language === 'mr' ? '१००% उपस्थिती' : '100% Present'}</option>
              <option value="partial">{language === 'mr' ? 'काही रजेवर / दौऱ्यावर' : 'Partial / Leave'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Detailed District Offices Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-gov-primary uppercase tracking-wider flex items-center gap-1.5">
            <MaterialIcon name="table_chart" size="xs" />
            <span>
              {language === 'mr'
                ? `पदक्रमनिहाय बायोमेट्रिक्स उपस्थिती तपशील (${filteredOffices.length})`
                : `Position-Segregated Biometrics Ledger (${filteredOffices.length} Records)`}
            </span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {language === 'mr' ? 'शेवटचे सिंक: ' : 'Last Synced: '} {STATE_ATTENDANCE_SUMMARY.lastSyncTime}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{language === 'mr' ? 'कार्यालय व पदक्रम' : 'Office & Tier'}</th>
                <th className="px-3 py-3">{language === 'mr' ? 'केआरए जबाबदार अधिकारी व पदनाम' : 'KRA In-Charge Officer & Role'}</th>
                <th className="px-3 py-3 text-center">{language === 'mr' ? 'मंजूर' : 'Sanctioned'}</th>
                <th className="px-3 py-3 text-center">{language === 'mr' ? 'उपस्थित' : 'Present'}</th>
                <th className="px-3 py-3 text-center">{language === 'mr' ? 'दौरा / रजा' : 'Field / Leave'}</th>
                <th className="px-3 py-3 text-center">{language === 'mr' ? 'हजेरी %' : 'Rate %'}</th>
                <th className="px-3 py-3">{language === 'mr' ? 'पंच इन वेळ' : 'Avg Punch In'}</th>
                <th className="px-3 py-3">{language === 'mr' ? 'डिव्हाइस स्थिती' : 'BAS Device'}</th>
                <th className="px-4 py-3 text-right">{language === 'mr' ? 'वेळपालन स्कोअर' : 'Punctuality'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupedOffices.map((group) => {
                const meta = TIER_META[group.tier];
                return (
                  <React.Fragment key={group.tier}>
                    {/* Tier Segregation Section Header */}
                    <tr className={`border-y ${meta.headerBorder} ${meta.headerBg}`}>
                      <td colSpan={9} className="px-4 py-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-md ${meta.badgeBg} ${meta.badgeText} border ${meta.badgeBorder}`}>
                              <MaterialIcon name={meta.icon} size="xs" />
                            </div>
                            <div>
                              <span className={`font-black text-xs uppercase tracking-wide ${meta.headerText}`}>
                                {language === 'mr' ? meta.titleMr : meta.titleEn}
                              </span>
                              <span className="text-[11px] text-slate-500 ml-2 hidden md:inline">
                                • {language === 'mr' ? meta.subtitleMr : meta.subtitleEn}
                              </span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                            {group.offices.length} {language === 'mr' ? 'अधिकारी' : 'Officers'}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Officer Rows in this Tier */}
                    {group.offices.map((office) => {
                      const isFull = office.attendancePercent === 100;
                      return (
                        <tr key={office.officeId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0 ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                              >
                                {office.tier}
                              </span>
                              <div className="font-bold text-slate-900 leading-tight">
                                {language === 'mr' ? office.officeNameMr : office.officeName}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5 ml-11">
                              {office.officeId} • {office.division}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-slate-800">
                            <div className="font-bold text-slate-900 leading-tight">
                              {language === 'mr' ? office.officerInChargeMr : office.officerInCharge}
                            </div>
                            {office.designation && (
                              <div className="text-[10px] font-semibold text-amber-800 leading-tight mt-0.5">
                                {language === 'mr' ? office.designationMr : office.designation}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-semibold text-slate-700">
                            {office.sanctionedStrength}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className="font-mono font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                              {office.presentToday}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center text-slate-500 font-mono text-[11px]">
                            {office.onFieldDuty > 0 && (
                              <span className="text-purple-700 font-semibold mr-1">{office.onFieldDuty} Field</span>
                            )}
                            {office.onLeave > 0 && (
                              <span className="text-amber-700 font-semibold">{office.onLeave} Leave</span>
                            )}
                            {office.onFieldDuty === 0 && office.onLeave === 0 && <span>—</span>}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`font-mono font-bold text-xs ${
                                  isFull ? 'text-emerald-700' : 'text-slate-800'
                                }`}
                              >
                                {office.attendancePercent}%
                              </span>
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                                <div
                                  className={`h-full rounded-full ${
                                    isFull ? 'bg-emerald-500' : office.attendancePercent >= 90 ? 'bg-amber-500' : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${office.attendancePercent}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-mono text-slate-600">
                            <div className="flex items-center gap-1">
                              <MaterialIcon name="schedule" size="xs" className="text-slate-400" />
                              <span>{office.averagePunchIn}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{office.deviceStatus}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-1.5 font-bold font-mono text-slate-800">
                              <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full rounded-full"
                                  style={{ width: `${office.punctualityScore}%` }}
                                />
                              </div>
                              <span>{office.punctualityScore}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
