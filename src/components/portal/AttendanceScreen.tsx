'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { OFFICES_ATTENDANCE_DATA, STATE_ATTENDANCE_SUMMARY, OfficeAttendanceRecord } from '@/data/attendanceData';

export const AttendanceScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'full' | 'partial'>('all');

  const filteredOffices = useMemo(() => {
    return OFFICES_ATTENDANCE_DATA.filter((office) => {
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
      return matchesDiv && matchesSearch && matchesStatus;
    });
  }, [selectedDivision, searchQuery, statusFilter]);

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
    <div className="p-4 sm:p-6 max-w-[1720px] w-full mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{STATE_ATTENDANCE_SUMMARY.syncStatus}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gov-primary flex items-center gap-2">
            <MaterialIcon name="fingerprint" size="md" className="text-gov-primary" />
            <span>
              {language === 'mr'
                ? '३६ जिल्हा माहिती कार्यालये बायोमेट्रिक्स उपस्थिती प्रणाली'
                : '36 District Information Offices Biometrics Attendance'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'मुख्यालय व राज्यातील ३६ जिल्हा माहिती कार्यालयांमधील अधिकारी-कर्मचाऱ्यांची आधार आधारित दैनिक हजेरी व वेळेवर उपस्थिती नोंद.'
              : 'Real-time Aadhaar BAS punch-in records, field deployment status, and punctuality compliance monitoring.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportAttendance}
            className="px-4 py-2 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <MaterialIcon name="file_download" size="xs" />
            <span>{language === 'mr' ? 'उपस्थिती अहवाल डाउनलोड' : 'Export Attendance Report'}</span>
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
            <span className="text-2xl font-black text-emerald-700">{STATE_ATTENDANCE_SUMMARY.presentTodayCount}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {STATE_ATTENDANCE_SUMMARY.presentPercent}%
            </span>
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
          <div className="text-[11px] text-purple-700 font-semibold">
            {language === 'mr' ? 'जिल्हाधिकारी मान्यता प्राप्त दौरे' : 'All field operations geotagged'}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Division Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'All', label: language === 'mr' ? 'सर्व विभाग (३६)' : 'All Divisions (36)' },
            { id: 'Konkan', label: language === 'mr' ? 'कोकण' : 'Konkan' },
            { id: 'Pune', label: language === 'mr' ? 'पुणे' : 'Pune' },
            { id: 'Nashik', label: language === 'mr' ? 'नाशिक' : 'Nashik' },
            { id: 'Chhatrapati Sambhajinagar', label: language === 'mr' ? 'छ. संभाजीनगर' : 'Chh. Sambhajinagar' },
            { id: 'Amravati', label: language === 'mr' ? 'अमरावती' : 'Amravati' },
            { id: 'Nagpur', label: language === 'mr' ? 'नागपूर' : 'Nagpur' },
          ].map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDivision(div.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

      {/* Detailed District Offices Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-gov-primary uppercase tracking-wider flex items-center gap-1.5">
            <MaterialIcon name="table_chart" size="xs" />
            <span>
              {language === 'mr'
                ? `कार्यालयनिहाय बायोमेट्रिक्स उपस्थिती तपशील (${filteredOffices.length})`
                : `Office-wise Biometrics Ledger (${filteredOffices.length} Offices)`}
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
                <th className="px-4 py-3">{language === 'mr' ? 'कार्यालय व जिल्हा' : 'Office & District'}</th>
                <th className="px-3 py-3">{language === 'mr' ? 'माहिती अधिकारी' : 'Officer In-Charge'}</th>
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
              {filteredOffices.map((office) => {
                const isFull = office.attendancePercent === 100;
                return (
                  <tr key={office.officeId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">
                        {language === 'mr' ? office.officeNameMr : office.officeName}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {office.officeId} • {office.division} Division
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-800 font-medium">
                      {language === 'mr' ? office.officerInChargeMr : office.officerInCharge}
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
                      <span
                        className={`font-mono font-bold text-xs ${
                          isFull ? 'text-emerald-700' : 'text-slate-800'
                        }`}
                      >
                        {office.attendancePercent}%
                      </span>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
