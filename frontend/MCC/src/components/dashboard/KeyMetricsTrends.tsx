'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DISTRICT_DETAILS_BY_ID } from '@/data/maharashtraDistrictsData';
import { Skeleton } from '@/components/shared/Skeleton';
import {
  ShieldCheck,
  Phone,
  Mail,
  UserCheck,
  Search,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Radio,
  FileCheck2,
} from 'lucide-react';

export const KeyMetricsTrends: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    language,
    isLoadingData,
  } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<'roster' | 'model'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');

  // Currently focused district
  const currentDistrict = useMemo(() => {
    if (!selectedDistrictId) return districts[0] || null;
    const normalized = selectedDistrictId.toLowerCase().trim();
    return (
      districts.find((d) => {
        const dId = d.id.toLowerCase().trim();
        return (
          dId === normalized ||
          d.name.toLowerCase() === normalized ||
          (dId === 'mumbai-city' && (normalized === 'mumbai' || normalized === 'mumbai-city')) ||
          (dId === 'ahilyanagar' && (normalized === 'ahmednagar' || normalized === 'ahilyanagar')) ||
          (dId === 'chhatrapati-sambhajinagar' && (normalized === 'aurangabad' || normalized === 'chhatrapati-sambhajinagar')) ||
          (dId === 'dharashiv' && (normalized === 'osmanabad' || normalized === 'dharashiv'))
        );
      }) || districts[0] || null
    );
  }, [districts, selectedDistrictId]);

  const currentDetails = useMemo(() => {
    if (!currentDistrict) return null;
    return DISTRICT_DETAILS_BY_ID[currentDistrict.id] || null;
  }, [currentDistrict]);

  // Filtered district list for 36-District KRA Roster
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const details = DISTRICT_DETAILS_BY_ID[d.id];
      const dioName = (d.dioOfficer || details?.dioOffice.officer || '').toLowerCase();
      const dioNameMr = (d.dioOfficerMr || details?.dioOffice.officerMr || '');
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.nameMr && d.nameMr.includes(q)) ||
        dioName.includes(q) ||
        dioNameMr.includes(q);

      const matchDivision =
        divisionFilter === 'all' ||
        d.division.toLowerCase() === divisionFilter.toLowerCase() ||
        (divisionFilter === 'chhatrapati-sambhajinagar' &&
          (d.division.toLowerCase().includes('sambhajinagar') || d.division.toLowerCase().includes('aurangabad')));

      return matchSearch && matchDivision;
    });
  }, [districts, searchQuery, divisionFilter]);

  if (isLoadingData) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-sm space-y-2.5 min-h-[300px] overflow-hidden">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton variant="subtle" className="h-4 w-20 rounded" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full min-h-0 w-full overflow-x-hidden">
      {/* 1. Header with KRA Identity & View Switcher */}
      <div className="px-2.5 py-1.5 border-b border-slate-200/90 bg-white flex items-center justify-between gap-1.5 shrink-0 overflow-hidden">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded-md bg-amber-500 text-white shrink-0 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none truncate">
              {language === 'mr' ? 'जिल्हा KRA जबाबदारी व यादी' : 'District KRA Governance'}
            </h3>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-[10px] font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? '📋 यादी' : '📋 Roster'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('model')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activeTab === 'model'
                ? 'bg-white text-amber-900 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'mr' ? '🎯 तपशील' : '🎯 Focus'}
          </button>
        </div>
      </div>

      {/* 2. BODY CONTENT: ROSTER VIEW OR DETAILED MODEL VIEW */}
      {activeTab === 'roster' ? (
        <div className="flex-1 min-h-0 flex flex-col p-2 overflow-x-hidden overflow-y-hidden">
          {/* A. Search and Division Dropdown Filter (NO SIDE SCROLLING) */}
          <div className="flex items-center gap-1.5 mb-2 shrink-0">
            <div className="relative flex-1 min-w-0">
              <Search className="w-3 h-3 absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'mr'
                    ? 'जिल्हा / KRA अधिकारी शोधा...'
                    : 'Search district / officer...'
                }
                className="w-full pl-6.5 pr-5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1.5 top-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Division Dropdown Selector (Fits within card without horizontal scrolling) */}
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="py-1 px-1.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 cursor-pointer focus:outline-none shrink-0 max-w-[110px]"
            >
              <option value="all">{language === 'mr' ? 'सर्व विभाग (३६)' : 'All Divisions'}</option>
              <option value="konkan">{language === 'mr' ? 'कोकण' : 'Konkan'}</option>
              <option value="pune">{language === 'mr' ? 'पुणे' : 'Pune'}</option>
              <option value="nashik">{language === 'mr' ? 'नाशिक' : 'Nashik'}</option>
              <option value="chhatrapati-sambhajinagar">{language === 'mr' ? 'संभाजीनगर' : 'Chh. Sambh.'}</option>
              <option value="amravati">{language === 'mr' ? 'अमरावती' : 'Amravati'}</option>
              <option value="nagpur">{language === 'mr' ? 'नागपूर' : 'Nagpur'}</option>
            </select>
          </div>

          {/* B. The 36 Districts KRA Segregated Roster Cards */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin space-y-2 pr-0.5 overflow-x-hidden">
            {filteredDistricts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                {language === 'mr' ? 'कोणताही जिल्हा आढळला नाही' : 'No matching districts found'}
              </div>
            ) : (
              filteredDistricts.map((d) => {
                const details = DISTRICT_DETAILS_BY_ID[d.id];
                const officerName =
                  language === 'mr'
                    ? (d.dioOfficerMr || details?.dioOffice.officerMr || d.dioOfficer)
                    : (d.dioOfficer || details?.dioOffice.officer);
                const isSelected = selectedDistrictId === d.id;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrictId(d.id)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
                    }`}
                  >
                    {/* Line 1: District Name, Rank, Division & CPI Score */}
                    <div className="flex items-center justify-between gap-1 w-full">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-4 h-4 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold text-[9px] flex items-center justify-center shrink-0">
                          #{d.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {language === 'mr' ? (d.nameMr || d.name) : d.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase shrink-0">
                          ({d.division})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] font-mono font-black text-slate-900">
                          {d.cpi}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded">
                          ✓ KRA Met
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDistrictId(d.id);
                            setActiveTab('model');
                          }}
                          className="p-0.5 rounded hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                          title={language === 'mr' ? 'तपशील पहा' : 'View Focus Details'}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Line 2: Prominently Visible KRA In-Charge Officer Name (NO TRUNCATION, FULL WIDTH) */}
                    <div className="px-2 py-1 rounded-md bg-amber-50 border border-amber-200/90 flex items-center justify-between gap-1 w-full">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[8px] font-bold text-amber-800 uppercase tracking-wider block leading-none">
                            {language === 'mr' ? 'केआरए जबाबदार अधिकारी (DIO)' : 'KRA In-Charge Lead (DIO)'}
                          </span>
                          <span className="text-xs font-black text-amber-950 leading-tight block">
                            {officerName}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8.5px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                        Active Lead
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* 3. DETAILED KRA MODEL VIEW (Focused Single-District Deep Dive) */
        <div className="flex-1 min-h-0 flex flex-col p-2 overflow-y-auto scrollbar-thin space-y-2 overflow-x-hidden">
          {/* Top Switcher Strip */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 hover:text-amber-950 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3 h-3" />
              {language === 'mr' ? 'यादीकडे परत' : 'Back to Roster'}
            </button>

            {/* Quick District Picker Dropdown */}
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 cursor-pointer focus:outline-none max-w-[140px] truncate"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.rank} {language === 'mr' ? (d.nameMr || d.name) : d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hero Officer Credential Card */}
          {currentDistrict && (
            <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-300 shadow-2xs space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-black font-mono text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    KRA
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8.5px] font-bold text-amber-800 uppercase tracking-wider block leading-none">
                      {language === 'mr' ? 'KRA जबाबदार अधिकारी' : 'KRA In-Charge Lead'}
                    </span>
                    <h4 className="text-sm font-black text-amber-950 leading-tight">
                      {language === 'mr'
                        ? (currentDistrict.dioOfficerMr || currentDetails?.dioOffice.officerMr || currentDistrict.dioOfficer)
                        : (currentDistrict.dioOfficer || currentDetails?.dioOffice.officer)}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-600">
                      {currentDetails?.dioOffice.designation || 'District Information Officer, Class-I'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black font-mono text-amber-900 leading-none">
                    {currentDistrict.cpi}
                  </div>
                  <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100/80 px-1 py-0.2 rounded inline-block mt-0.5">
                    ✓ Compliant
                  </span>
                </div>
              </div>

              {/* Collector Reference & Contacts */}
              <div className="pt-1.5 border-t border-amber-200 flex flex-col gap-1 text-[9.5px] text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    {language === 'mr' ? 'जिल्हाधिकारी:' : 'Collector:'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {language === 'mr'
                      ? (currentDistrict.collectorNameMr || currentDetails?.dioOffice.collectorNameMr)
                      : (currentDistrict.collectorName || currentDetails?.dioOffice.collectorName)}
                  </span>
                </div>

                {currentDetails?.dioOffice && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {language === 'mr' ? 'थेट संपर्क:' : 'Direct Phone:'}
                      </span>
                      <span className="font-mono font-bold text-amber-900">
                        {currentDetails.dioOffice.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {language === 'mr' ? 'कार्यालय ईमेल:' : 'Official Email:'}
                      </span>
                      <span className="font-mono font-bold text-slate-800 truncate max-w-[150px]">
                        {currentDetails.dioOffice.email}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 4-Pillar Segregated Scorecard Model */}
          {currentDistrict && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 px-0.5">
                <span className="uppercase tracking-wider">
                  {language === 'mr' ? '४-स्तंभ केआरए वर्गीकरण' : '4-Pillar KRA Segregation'}
                </span>
                <span className="font-mono text-slate-500">
                  Target: 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {/* Pillar 1: Crisis SLA */}
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-emerald-950 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      {language === 'mr' ? '१. आपत्कालीन SLA' : '1. Crisis SLA'}
                    </span>
                    <span className="text-[8.5px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                      30% Wt
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-emerald-900">
                      {currentDistrict.crisisSLA || 100}%
                    </span>
                    <span className="text-[8.5px] text-slate-600 font-medium">
                      ≥ 95% in &lt;4h
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, currentDistrict.crisisSLA || 100)}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 2: Grievance TAT */}
                <div className="p-2 rounded-lg bg-sky-50/70 border border-sky-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-sky-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-sky-700" />
                      {language === 'mr' ? '२. तक्रार निवारण' : '2. Grievance TAT'}
                    </span>
                    <span className="text-[8.5px] font-mono font-bold text-sky-800 bg-sky-100 px-1 rounded">
                      30% Wt
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-sky-900">
                      {currentDistrict.avgTAT || 38} {language === 'mr' ? 'मि.' : 'min'}
                    </span>
                    <span className="text-[8.5px] text-slate-600 font-medium">
                      Mandate &lt; 48h
                    </span>
                  </div>
                  <div className="w-full bg-sky-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-sky-600 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                {/* Pillar 3: Media Releases Cadence */}
                <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-amber-950 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-amber-700" />
                      {language === 'mr' ? '३. प्रसिद्धीपत्रके' : '3. Media Releases'}
                    </span>
                    <span className="text-[8.5px] font-mono font-bold text-amber-800 bg-amber-100 px-1 rounded">
                      20% Wt
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-amber-900">
                      {currentDistrict.releases}
                    </span>
                    <span className="text-[8.5px] text-slate-600 font-medium">
                      Benchmark 300+
                    </span>
                  </div>
                  <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, ((currentDistrict.releases || 300) / 450) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 4: Field Hoarding Inspection */}
                <div className="p-2 rounded-lg bg-purple-50/70 border border-purple-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-purple-950 flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-purple-700" />
                      {language === 'mr' ? '४. फील्ड तपासणी' : '4. Field Audit'}
                    </span>
                    <span className="text-[8.5px] font-mono font-bold text-purple-800 bg-purple-100 px-1 rounded">
                      20% Wt
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-purple-900">
                      100% {language === 'mr' ? 'पूर्ण' : 'Verified'}
                    </span>
                    <span className="text-[8.5px] text-slate-600 font-medium">
                      Geotagged Active
                    </span>
                  </div>
                  <div className="w-full bg-purple-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              {/* Responsibilities Checklist */}
              <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-200">
                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  {language === 'mr' ? 'विभागीय केआरए पडताळणी' : 'Mandated KRA Checklist'}
                </span>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="truncate">SLA &ge;95% (&lt;4h)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="truncate">Rumor Debunk &lt;2h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="truncate">Grievance &ge;98%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="truncate">Outdoor Audit 100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
