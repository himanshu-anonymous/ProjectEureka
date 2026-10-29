'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { EnhancedMaharashtraGISMap } from '@/components/dashboard/EnhancedMaharashtraGISMap';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import {
  ALL_36_DISTRICTS,
  DISTRICT_DETAILS_BY_ID,
  DistrictInfoDetails,
  HoardingRecord,
} from '@/data/maharashtraDistrictsData';

export const DistrictsScreen: React.FC = () => {
  const {
    language,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    setSelectedDivision,
    setToast,
  } = useDashboardStore();

  const [activeInspectorTab, setActiveInspectorTab] = useState<'hoardings' | 'history' | 'office'>('hoardings');
  const [inspectingHoardingPhoto, setInspectingHoardingPhoto] = useState<HoardingRecord | null>(null);

  // Active District Details
  const currentDistrictDetails: DistrictInfoDetails = useMemo(() => {
    const id = selectedDistrictId?.toLowerCase() || 'thane';
    return (
      DISTRICT_DETAILS_BY_ID[id] ||
      ALL_36_DISTRICTS.find((d) => d.id === id) ||
      ALL_36_DISTRICTS[0]
    );
  }, [selectedDistrictId]);

  const districtHoardings = currentDistrictDetails.hoardings || [];

  return (
    <div className="p-3 sm:p-5 max-w-[1780px] w-full mx-auto space-y-4">
      {/* Sleek Minimalist District Header & Division Filter */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <MaterialIcon name="location_on" size="sm" className="text-gov-primary" />
          <h1 className="text-sm font-bold text-slate-900 tracking-tight">
            {language === 'mr' ? 'जिल्हा प्रशासन व फलक संनियंत्रण' : 'District Governance & Outdoor Hoardings'}
          </h1>
          <span className="font-mono text-xs font-bold text-gov-primary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            #{currentDistrictDetails.rank} {language === 'mr' ? currentDistrictDetails.nameMr : currentDistrictDetails.name} · {currentDistrictDetails.cpi} CPI
          </span>
        </div>

        {/* Division Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'All Maharashtra', label: language === 'mr' ? 'सर्व' : 'All' },
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedDivision === div.id
                  ? 'bg-gov-primary text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {div.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: GIS Map on Left + Selected District Inspection Hub on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 3D/2D GIS Map & Lovable Graph Decompositions */}
        <div className="lg:col-span-7 space-y-5">
          <EnhancedMaharashtraGISMap
            className="min-h-[540px] shadow-sm"
            initialDistrictId={selectedDistrictId || 'thane'}
            onDistrictSelect={(district) => {
              setSelectedDistrictId(district.id);
            }}
          />
          {/* Lovable Graph Manner: 4-Pillar Decomposition & Velocity Trajectory */}
          <ScoreDecomposition />
        </div>

        {/* Right Column: Respective Hoardings, District History & DIO Office Card */}
        <div className="lg:col-span-5 space-y-5">
          {/* Dynamic District Detail Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Panel Top Tabs */}
            <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveInspectorTab('hoardings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeInspectorTab === 'hoardings'
                      ? 'bg-gov-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white/80'
                  }`}
                >
                  <MaterialIcon name="pin_drop" size="xs" />
                  <span>
                    {language === 'mr' ? 'होर्डिंग्ज' : 'Hoardings'} ({districtHoardings.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveInspectorTab('history')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeInspectorTab === 'history'
                      ? 'bg-gov-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white/80'
                  }`}
                >
                  <MaterialIcon name="history_edu" size="xs" />
                  <span>{language === 'mr' ? 'इतिहास व माहिती' : 'History & Info'}</span>
                </button>
                <button
                  onClick={() => setActiveInspectorTab('office')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    activeInspectorTab === 'office'
                      ? 'bg-gov-primary text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white/80'
                  }`}
                >
                  <MaterialIcon name="apartment" size="xs" />
                  <span>{language === 'mr' ? 'माहिती कार्यालय' : 'DIO Office'}</span>
                </button>
              </div>

              <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {currentDistrictDetails.name}
              </span>
            </div>

            {/* TAB CONTENT 1: RESPECTIVE HOARDINGS IN THIS DISTRICT */}
            {activeInspectorTab === 'hoardings' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                    {language === 'mr'
                      ? `${currentDistrictDetails.nameMr} सक्रिय शासकीय होर्डिंग्ज`
                      : `Active Hoardings · ${currentDistrictDetails.name}`}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {districtHoardings.length} Verified
                  </span>
                </div>

                {districtHoardings.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-2">
                    <MaterialIcon name="pin_drop" size="lg" className="mx-auto text-slate-300" />
                    <p className="text-xs">No active outdoor campaign registered for this district yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {districtHoardings.map((hrd) => (
                      <div
                        key={hrd.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/40 hover:border-amber-300 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                            {hrd.id} • {hrd.size}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            {hrd.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {language === 'mr' ? hrd.campaignMr : hrd.campaign}
                          </h4>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {language === 'mr' ? hrd.departmentMr : hrd.department}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                          <MaterialIcon name="near_me" size="xs" className="text-gov-primary shrink-0" />
                          <span className="truncate">{language === 'mr' ? hrd.locationMr : hrd.location}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Verified: {hrd.verifiedDate}</span>
                          <span className="font-bold text-emerald-700">{hrd.impressionsDaily}</span>
                        </div>

                        <button
                          onClick={() => setInspectingHoardingPhoto(hrd)}
                          className="w-full py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                        >
                          <MaterialIcon name="image" size="xs" />
                          <span>{language === 'mr' ? 'होर्डिंग छायाचित्र व जीपीएस पहा' : 'View Hoarding Proof & GPS'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: DISTRICT HISTORY & PROFILE */}
            {activeInspectorTab === 'history' && (
              <div className="p-4 space-y-4">
                <div className="space-y-1.5 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
                    {language === 'mr' ? 'जिल्हा ऐतिहासिक वारसा व ओळख' : 'District Historical Heritage'}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
                    "{language === 'mr' ? currentDistrictDetails.historyMr : currentDistrictDetails.history}"
                  </p>
                </div>

                {/* Quick Demographic & Geo Statistics */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {language === 'mr' ? 'महत्त्वाची सांख्यिकी व भौगोलिक माहिती:' : 'Key Geographic & Demographic Statistics:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">
                        {language === 'mr' ? 'मुख्यालय' : 'Headquarters'}
                      </span>
                      <strong className="text-slate-800 text-xs">
                        {language === 'mr'
                          ? currentDistrictDetails.quickStats.headquartersMr
                          : currentDistrictDetails.quickStats.headquarters}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">
                        {language === 'mr' ? 'क्षेत्रफळ' : 'Area'}
                      </span>
                      <strong className="text-slate-800 text-xs">
                        {currentDistrictDetails.quickStats.areaKm2}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">
                        {language === 'mr' ? 'लोकसंख्या' : 'Population'}
                      </span>
                      <strong className="text-slate-800 text-xs">
                        {currentDistrictDetails.quickStats.population}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-medium block">
                        {language === 'mr' ? 'तालुके / साक्षरता' : 'Talukas / Literacy'}
                      </span>
                      <strong className="text-slate-800 text-xs">
                        {currentDistrictDetails.quickStats.talukasCount} Talukas • {currentDistrictDetails.quickStats.literacyRate}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Major Industries */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {language === 'mr' ? 'प्रमुख उद्योग व शेती:' : 'Major Economic Drivers & Agriculture:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(language === 'mr'
                      ? currentDistrictDetails.quickStats.majorIndustriesMr
                      : currentDistrictDetails.quickStats.majorIndustries
                    ).map((ind, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: DIO OFFICE DETAILS & COLLECTOR CONTACTS */}
            {activeInspectorTab === 'office' && (
              <div className="p-4 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      {language === 'mr' ? 'जिल्हाधिकारी व जिल्हा दंडाधिकारी' : 'District Collector & Magistrate'}
                    </span>
                    <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                      {language === 'mr'
                        ? currentDistrictDetails.dioOffice.collectorNameMr
                        : currentDistrictDetails.dioOffice.collectorName}
                    </strong>
                  </div>

                  <div className="border-t border-slate-200 pt-2.5">
                    <span className="text-[10px] font-bold text-gov-primary uppercase tracking-wider block">
                      {language === 'mr' ? 'जिल्हा माहिती अधिकारी (DIO)' : 'District Information Officer'}
                    </span>
                    <strong className="text-sm font-bold text-slate-900 block mt-0.5">
                      {language === 'mr'
                        ? currentDistrictDetails.dioOffice.officerMr
                        : currentDistrictDetails.dioOffice.officer}
                    </strong>
                    <span className="text-[11px] text-slate-500 block">
                      {language === 'mr'
                        ? currentDistrictDetails.dioOffice.designationMr
                        : currentDistrictDetails.dioOffice.designation}
                    </span>
                  </div>
                </div>

                {/* Office Contact Info */}
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-100 bg-white">
                    <MaterialIcon name="place" size="xs" className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Office Address</span>
                      <span className="leading-snug">
                        {language === 'mr'
                          ? currentDistrictDetails.dioOffice.addressMr
                          : currentDistrictDetails.dioOffice.address}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Email</span>
                      <a
                        href={`mailto:${currentDistrictDetails.dioOffice.email}`}
                        className="font-mono text-gov-blue hover:underline text-[11px] truncate block"
                      >
                        {currentDistrictDetails.dioOffice.email}
                      </a>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Phone</span>
                      <span className="font-mono text-slate-800 text-[11px] block">
                        {currentDistrictDetails.dioOffice.phone}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-white space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span>Staff Sanctioned / Present:</span>
                      <strong className="font-mono text-emerald-700">
                        {currentDistrictDetails.dioOffice.staffPresentToday} / {currentDistrictDetails.dioOffice.staffSanctioned}
                      </strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (currentDistrictDetails.dioOffice.staffPresentToday /
                              Math.max(1, currentDistrictDetails.dioOffice.staffSanctioned)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top & Lower Matrix */}
          <TopLowerMatrix />
        </div>
      </div>

      {/* Full-Width Comprehensive Statewide District Leaderboard */}
      <div className="w-full">
        <DistrictLeaderboard />
      </div>

      {/* Hoarding Photo Inspection Modal */}
      {inspectingHoardingPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-gov-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="image" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm">
                  {inspectingHoardingPhoto.id} — {inspectingHoardingPhoto.districtName}
                </span>
              </div>
              <button
                onClick={() => setInspectingHoardingPhoto(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Realistic Photo Card Simulation */}
              <div className="aspect-[16/9] bg-gradient-to-br from-amber-600 via-amber-800 to-slate-950 rounded-xl p-4 flex flex-col justify-between text-white border-2 border-amber-400/40 shadow-inner">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest text-amber-200 font-bold uppercase">
                    GOVERNMENT OF MAHARASHTRA • OUTDOOR
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black">
                    GEOTAGGED
                  </span>
                </div>
                <div className="text-center py-2">
                  <h3 className="text-lg font-black font-serif text-white drop-shadow-md">
                    {language === 'mr' ? inspectingHoardingPhoto.campaignMr : inspectingHoardingPhoto.campaign}
                  </h3>
                  <p className="text-xs text-amber-200 mt-1">
                    {language === 'mr' ? inspectingHoardingPhoto.departmentMr : inspectingHoardingPhoto.department}
                  </p>
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 border-t border-white/20 pt-1">
                  <span>{inspectingHoardingPhoto.size}</span>
                  <span>{inspectingHoardingPhoto.location}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Site Location:</span>
                  <span className="font-semibold text-slate-900">{inspectingHoardingPhoto.location}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Daily Footfall Impressions:</span>
                  <span className="font-semibold text-emerald-700">{inspectingHoardingPhoto.impressionsDaily}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Last Field Verification:</span>
                  <span className="font-semibold text-slate-900">{inspectingHoardingPhoto.verifiedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-mono text-slate-900">
                    {inspectingHoardingPhoto.geotag.lat}, {inspectingHoardingPhoto.geotag.lng}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setInspectingHoardingPhoto(null)}
                className="w-full py-2 bg-gov-primary text-white rounded-lg text-xs font-bold hover:bg-gov-primary-dark transition-colors cursor-pointer"
              >
                Close Proof Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
