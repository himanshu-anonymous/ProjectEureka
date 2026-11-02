'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DISTRICT_DETAILS_BY_ID } from '@/data/maharashtraDistrictsData';
import { Skeleton } from '@/components/shared/Skeleton';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import {
  ShieldCheck,
  Award,
  Phone,
  Mail,
  UserCheck,
  Search,
  ExternalLink,
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
    selectedDivision,
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
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm space-y-3 min-h-[300px]">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton variant="subtle" className="h-5 w-24 rounded" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full min-h-0">
      {/* 1. Header with KRA Identity & View Switcher */}
      <div className="px-2.5 py-1.5 border-b border-slate-200/80 bg-linear-to-r from-amber-50/60 via-white to-emerald-50/40 flex items-center justify-between flex-wrap gap-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-amber-500 text-white shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none">
                {language === 'mr' ? 'जिल्हा केआरए जबाबदारी व प्रशासकीय कामगिरी' : 'District KRA Accountability & Governance'}
              </h3>
              <span className="text-[8.5px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1 py-0.2 rounded">
                KRA
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1">
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mr' ? '📋 केआरए यादी' : '📋 KRA Roster'}
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
              {language === 'mr' ? '🎯 केआरए मॉडेल' : '🎯 KRA Model'}
            </button>
          </div>
          <span className="text-[8.5px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            36/36 {language === 'mr' ? 'सक्रिय' : 'Active'}
          </span>
        </div>
      </div>

      {/* 2. BODY CONTENT: ROSTER VIEW OR DETAILED MODEL VIEW */}
      {activeTab === 'roster' ? (
        <div className="flex-1 min-h-0 flex flex-col p-2 overflow-hidden">
          {/* A. Search and Division Filter Strip */}
          <div className="space-y-1.5 mb-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'mr'
                    ? 'जिल्हा किंवा केआरए अधिकारी शोधा...'
                    : 'Filter by district name or KRA officer...'
                }
                className="w-full pl-7 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Division Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5 text-[9px] font-semibold text-slate-600">
              {[
                { id: 'all', label: language === 'mr' ? 'सर्व (३६)' : 'All (36)' },
                { id: 'konkan', label: language === 'mr' ? 'कोकण' : 'Konkan' },
                { id: 'pune', label: language === 'mr' ? 'पुणे' : 'Pune' },
                { id: 'nashik', label: language === 'mr' ? 'नाशिक' : 'Nashik' },
                { id: 'chhatrapati-sambhajinagar', label: language === 'mr' ? 'संभाजीनगर' : 'Chh. Sambh.' },
                { id: 'amravati', label: language === 'mr' ? 'अमरावती' : 'Amravati' },
                { id: 'nagpur', label: language === 'mr' ? 'नागपूर' : 'Nagpur' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDivisionFilter(tab.id)}
                  className={`px-1.5 py-0.5 rounded-full border whitespace-nowrap cursor-pointer transition-colors ${
                    divisionFilter === tab.id
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* B. The 36 Districts KRA Segregated Roster List */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 space-y-1.5">
            {filteredDistricts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                {language === 'mr' ? 'कोणताही जिल्हा आढळला नाही' : 'No matching districts found'}
              </div>
            ) : (
              filteredDistricts.map((d) => {
                const details = DISTRICT_DETAILS_BY_ID[d.id];
                const officerName = language === 'mr' ? (d.dioOfficerMr || details?.dioOffice.officerMr || d.dioOfficer) : (d.dioOfficer || details?.dioOffice.officer);
                const isSelected = selectedDistrictId === d.id;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrictId(d.id)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-50/90 border-amber-400 ring-1 ring-amber-400 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs'
                    }`}
                  >
                    {/* Left: District Rank & Name */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        #{d.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {language === 'mr' ? (d.nameMr || d.name) : d.name}
                          </span>
                          <span className="text-[8.5px] font-mono text-slate-400 uppercase">
                            • {d.division}
                          </span>
                        </div>
                        {/* KRA Officer Pill */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-100/80 text-amber-950 font-bold text-[9.5px] border border-amber-300 truncate">
                            <ShieldCheck className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                            <span className="truncate">{officerName}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center-Right: 4-Pillar Metric Badges */}
                    <div className="hidden sm:flex items-center gap-1 shrink-0 text-[9px] font-mono font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200" title="Crisis SLA Rate">
                        SLA: {d.crisisSLA || 100}%
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200" title="Average TAT">
                        TAT: {d.avgTAT || 38}m
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200" title="Press Dispatches">
                        Cadence: {d.releases}
                      </span>
                    </div>

                    {/* Right: KRA Status & Inspect Action */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="text-right">
                        <div className="text-[11px] font-black font-mono text-slate-900 leading-none">
                          {d.cpi}
                        </div>
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded inline-block mt-0.5">
                          ✓ KRA Met
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrictId(d.id);
                          setActiveTab('model');
                        }}
                        className="p-1 rounded hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                        title={language === 'mr' ? 'तपशीलवार केआरए मॉडेल पहा' : 'View KRA Model'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* 3. DETAILED KRA MODEL VIEW (Focused Single-District Deep Dive) */
        <div className="flex-1 min-h-0 flex flex-col p-2 overflow-y-auto scrollbar-thin space-y-2">
          {/* Top Switcher Strip */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {language === 'mr' ? 'सर्व ३६ जिल्हे यादीकडे परत' : 'Back to 36 Districts Roster'}
            </button>

            {/* Quick District Picker Dropdown */}
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 cursor-pointer focus:outline-none"
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
            <div className="bg-linear-to-br from-amber-500/10 via-amber-50/50 to-white rounded-xl p-2.5 border border-amber-300/80 shadow-2xs space-y-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-amber-500 to-amber-700 text-white font-black font-mono text-sm flex items-center justify-center shadow-xs">
                    KRA
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {language === 'mr'
                          ? (currentDistrict.dioOfficerMr || currentDetails?.dioOffice.officerMr || currentDistrict.dioOfficer)
                          : (currentDistrict.dioOfficer || currentDetails?.dioOffice.officer)}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                        ✓ {language === 'mr' ? '१००% केआरए पूर्ण' : '100% KRA Compliant'}
                      </span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-600 mt-0.5">
                      {language === 'mr'
                        ? `${currentDetails?.dioOffice.designationMr || 'जिल्हा माहिती अधिकारी, वर्ग-१'} तथा KRA प्रमुख`
                        : `${currentDetails?.dioOffice.designation || 'District Information Officer, Class-I'} & KRA Lead`}
                    </p>
                    <p className="text-[9.5px] font-semibold text-slate-500">
                      {language === 'mr' ? 'जिल्हाधिकारी:' : 'Collector:'}{' '}
                      <span className="text-slate-800 font-bold">
                        {language === 'mr'
                          ? (currentDistrict.collectorNameMr || currentDetails?.dioOffice.collectorNameMr)
                          : (currentDistrict.collectorName || currentDetails?.dioOffice.collectorName)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black font-mono text-amber-900 leading-none">
                    {currentDistrict.cpi}
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                    {language === 'mr' ? 'संयुक्त केआरए गुण' : 'Composite KRA Score'}
                  </span>
                </div>
              </div>

              {/* Office Contact Strip */}
              {currentDetails?.dioOffice && (
                <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between flex-wrap gap-2 text-[9.5px] text-slate-600">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-amber-700" />
                    {currentDetails.dioOffice.phone}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono truncate">
                    <Mail className="w-3 h-3 text-amber-700" />
                    {currentDetails.dioOffice.email}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    {currentDetails.dioOffice.staffPresentToday}/{currentDetails.dioOffice.staffSanctioned}{' '}
                    {language === 'mr' ? 'कर्मचारी हजर' : 'Staff Deployed'}
                  </span>
                </div>
              )}
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
                  Formula: SLA(30%) + TAT(30%) + Media(20%) + Audit(20%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {/* Pillar 1: Crisis SLA */}
                <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-950 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      {language === 'mr' ? '१. आपत्कालीन SLA निवारण' : '1. Crisis SLA Resolution'}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                      30% Weight
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-emerald-900">
                      {currentDistrict.crisisSLA || 100}%
                    </span>
                    <span className="text-[9px] text-slate-600 font-medium">
                      {language === 'mr' ? 'उद्दिष्ट: ≥ ९५% (<४ तास)' : 'Target: ≥ 95% (<4h)'}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, currentDistrict.crisisSLA || 100)}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 2: Grievance TAT */}
                <div className="p-2 rounded-lg bg-sky-50/70 border border-sky-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-sky-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-sky-700" />
                      {language === 'mr' ? '२. नागरी तक्रार निवारण TAT' : '2. Citizen Grievance TAT'}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-sky-800 bg-sky-100 px-1 rounded">
                      30% Weight
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-sky-900">
                      {currentDistrict.avgTAT || 38} {language === 'mr' ? 'मिनिटे' : 'min avg'}
                    </span>
                    <span className="text-[9px] text-slate-600 font-medium">
                      {language === 'mr' ? 'उद्दिष्ट: < ४८ तास' : 'Mandate: < 48 hours'}
                    </span>
                  </div>
                  <div className="w-full bg-sky-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-sky-600 h-full rounded-full transition-all duration-500"
                      style={{ width: '96%' }}
                    />
                  </div>
                </div>

                {/* Pillar 3: Media Releases Cadence */}
                <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-950 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-amber-700" />
                      {language === 'mr' ? '३. प्रसिद्धीपत्रके व माहिती' : '3. Media Dispatches'}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1 rounded">
                      20% Weight
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-amber-900">
                      {currentDistrict.releases} {language === 'mr' ? 'पत्रके' : 'dispatches'}
                    </span>
                    <span className="text-[9px] text-slate-600 font-medium">
                      {language === 'mr' ? 'उद्दिष्ट: ३००+' : 'Benchmark: 300+'}
                    </span>
                  </div>
                  <div className="w-full bg-amber-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((currentDistrict.releases || 300) / 450) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 4: Field Hoarding Inspection */}
                <div className="p-2 rounded-lg bg-purple-50/70 border border-purple-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-purple-950 flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-purple-700" />
                      {language === 'mr' ? '४. होर्डिंग्ज व फील्ड तपासणी' : '4. Field & Hoardings Audit'}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-purple-800 bg-purple-100 px-1 rounded">
                      20% Weight
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-black font-mono text-purple-900">
                      100% {language === 'mr' ? 'प्रमाणित' : 'Verified'}
                    </span>
                    <span className="text-[9px] text-slate-600 font-medium">
                      {language === 'mr' ? 'जिओटॅगिंग तपासणी' : 'Geotagged & Active'}
                    </span>
                  </div>
                  <div className="w-full bg-purple-200/70 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Responsibilities Checklist */}
              <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-200/80">
                <span className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  {language === 'mr' ? 'विभागीय केआरए जबाबदाऱ्या पडताळणी' : 'Mandated KRA Responsibilities Verification'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9.5px] text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{language === 'mr' ? 'आपत्कालीन SLA निवारण दर (≥९५%)' : 'Crisis SLA Resolution (≥95%)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{language === 'mr' ? 'अफवांचे खंडन (<२ तास वेळ)' : 'Rumor Debunking (<2h SLA)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{language === 'mr' ? 'नागरी तक्रार निवारण (≥९८%)' : 'Citizen Grievance Redressal (≥98%)'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{language === 'mr' ? 'माहिती प्रसिद्धी व होर्डिंग्ज ऑडिट' : 'Media Dispatches & Outdoor Audit'}</span>
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
