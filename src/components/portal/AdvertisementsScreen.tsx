'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { STATE_ADVERTISEMENTS_DATA, StateAdvertisement } from '@/data/advertisementsData';
import { ALL_HOARDINGS, HoardingRecord } from '@/data/maharashtraDistrictsData';

export const AdvertisementsScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'hoardings'>('campaigns');
  const [selectedHoarding, setSelectedHoarding] = useState<HoardingRecord | null>(null);

  const filteredAds = useMemo(() => {
    return STATE_ADVERTISEMENTS_DATA.filter((ad) => {
      const matchesMedia = selectedMediaType === 'all' || ad.mediaType === selectedMediaType;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        ad.campaignTitle.toLowerCase().includes(q) ||
        ad.campaignTitleMr.toLowerCase().includes(q) ||
        ad.department.toLowerCase().includes(q) ||
        ad.departmentMr.toLowerCase().includes(q) ||
        ad.roNumber.toLowerCase().includes(q);
      return matchesMedia && matchesSearch;
    });
  }, [selectedMediaType, searchQuery]);

  const filteredHoardings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ALL_HOARDINGS.filter(
      (h) =>
        !searchQuery ||
        h.districtName.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.campaign.toLowerCase().includes(q) ||
        h.department.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleExportRO = (roNumber: string) => {
    setToast({
      message:
        language === 'mr'
          ? `प्रसिद्धी आदेश (${roNumber}) अधिकृत प्रत डाउनलोड झाली.`
          : `Release Order (${roNumber}) official order PDF exported.`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] w-full mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-2">
            <MaterialIcon name="campaign" size="xs" />
            <span>{language === 'mr' ? 'माहिती व जनसंपर्क महासंचालनालय जाहिरात शाखा' : 'DGIPR Advertising Wing'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gov-primary flex items-center gap-2">
            <MaterialIcon name="newspaper" size="md" className="text-gov-primary" />
            <span>
              {language === 'mr'
                ? 'शासकीय जाहिराती व मोहीम व्यवस्थापन'
                : 'State Advertisements & Campaign Releases'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'वर्तमानपत्र जाहिराती, होर्डिंग्ज, सोशल मीडिया व डिजिटल मोहिमांचे अधिकृत प्रसिद्धी आदेश (RO) व पडताळणी.'
              : 'Official Release Orders (ROs), print displays, outdoor hoardings ledger, and verified citizen impressions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'campaigns'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'mr' ? 'प्रसिद्धी आदेश (RO) मोहिमा' : 'Campaign Release Orders'}
          </button>
          <button
            onClick={() => setActiveTab('hoardings')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hoardings'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'mr' ? 'राज्यव्यापी होर्डिंग नोंदवही' : 'Outdoor Hoardings Ledger'}
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'सक्रिय प्रसिद्धी आदेश (ROs)' : 'Active Release Orders'}
          </span>
          <div className="text-2xl font-black text-slate-900">42 Orders</div>
          <span className="text-xs text-emerald-700 font-semibold">100% Budget Authorized</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'वृत्तपत्र प्रसिद्धी माध्यम' : 'Print Media Dailies'}
          </span>
          <div className="text-2xl font-black text-blue-700">64 Dailies</div>
          <span className="text-xs text-slate-500">Marathi, Hindi, English</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'प्रमाणित होर्डिंग साइट्स' : 'Verified Outdoor Sites'}
          </span>
          <div className="text-2xl font-black text-amber-700">140 Sites</div>
          <span className="text-xs text-amber-700 font-semibold">Geotagged & Inspected</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'एकूण पोहोच (नागरिक)' : 'Verified Citizen Reach'}
          </span>
          <div className="text-2xl font-black text-emerald-700">4.2 Crore</div>
          <span className="text-xs text-slate-500">Cross-platform Verified</span>
        </div>
      </div>

      {/* Interactive Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {activeTab === 'campaigns' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: language === 'mr' ? 'सर्व माध्यमे' : 'All Media' },
              { id: 'Print Newspaper', label: language === 'mr' ? 'वृत्तपत्र जाहिराती' : 'Print Newspaper' },
              { id: 'Outdoor Hoarding', label: language === 'mr' ? 'होर्डिंग व फलक' : 'Outdoor Hoarding' },
              { id: 'Digital & Social', label: language === 'mr' ? 'डिजिटल व सोशल' : 'Digital & Social' },
              { id: 'Radio & Audio', label: language === 'mr' ? 'रेडिओ जिंगल' : 'Radio Jingles' },
              { id: 'TV Commercial', label: language === 'mr' ? 'टीव्ही जाहिराती' : 'TV Commercial' },
            ].map((media) => (
              <button
                key={media.id}
                onClick={() => setSelectedMediaType(media.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedMediaType === media.id
                    ? 'bg-gov-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {media.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-700">
            {language === 'mr' ? '३६ जिल्ह्यांमधील शासकीय होर्डिंग्ज' : 'State-wide Government Outdoor Hoardings'}
          </div>
        )}

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'मोहीम, विभाग किंवा स्थळ शोधा...'
                : 'Search campaigns, department, or location...'
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gov-blue"
          />
          <MaterialIcon
            name="search"
            size="xs"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* Campaigns Tab View */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {ad.roNumber}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {language === 'mr' ? ad.statusMr : ad.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {language === 'mr' ? ad.campaignTitleMr : ad.campaignTitle}
                  </h4>
                  <span className="text-xs text-slate-500 block mt-1">
                    {language === 'mr' ? ad.departmentMr : ad.department}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {language === 'mr' ? 'माध्यम प्रकार' : 'Media Format'}
                    </span>
                    <strong className="text-slate-800 text-xs">
                      {language === 'mr' ? ad.mediaTypeMr : ad.mediaType}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {language === 'mr' ? 'मंजूर बजेट' : 'Sanctioned Budget'}
                    </span>
                    <strong className="text-slate-900 text-xs">{ad.budgetAllocated}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {language === 'mr' ? 'प्रसिद्धी कालावधी' : 'Release Period'}
                    </span>
                    <span className="text-slate-700 text-[11px]">
                      {ad.releaseDate} – {ad.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {language === 'mr' ? 'पडताळणी पोहोच' : 'Verified Reach'}
                    </span>
                    <span className="text-emerald-700 font-bold text-xs">{ad.verifiedImpressions}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{ad.schemeCode}</span>
                <button
                  onClick={() => handleExportRO(ad.roNumber)}
                  className="px-3 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MaterialIcon name="download" size="xs" />
                  <span>{language === 'mr' ? 'RO आदेश डाउनलोड' : 'Download RO'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hoardings Ledger Tab View */}
      {activeTab === 'hoardings' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-bold text-gov-primary uppercase tracking-wider flex items-center gap-1.5">
              <MaterialIcon name="pin_drop" size="xs" />
              <span>
                {language === 'mr'
                  ? `शासकीय होर्डिंग्ज नोंदवही (${filteredHoardings.length} फलक)`
                  : `State Outdoor Hoardings Registry (${filteredHoardings.length} Sites)`}
              </span>
            </span>
            <span className="text-[11px] text-slate-500">
              {language === 'mr' ? 'जीपीएस पडताळणीकृत' : 'All sites GPS Geotagged'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{language === 'mr' ? 'आयडी व जिल्हा' : 'Site ID & District'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'फलक स्थान / चौक' : 'Location & Landmark'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'मोहीम व योजना' : 'Campaign Theme'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'आकारमान' : 'Dimensions'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'दैनिक पोहोच' : 'Daily Impressions'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                  <th className="px-4 py-3 text-right">{language === 'mr' ? 'कृती' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHoardings.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-amber-700 block">{h.id}</span>
                      <span className="text-slate-800 font-semibold">{h.districtName}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-slate-900 font-medium block">
                        {language === 'mr' ? h.locationMr : h.location}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        GPS: {h.geotag.lat.toFixed(3)}, {h.geotag.lng.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <strong className="text-gov-primary block">
                        {language === 'mr' ? h.campaignMr : h.campaign}
                      </strong>
                      <span className="text-[11px] text-slate-500">
                        {language === 'mr' ? h.departmentMr : h.department}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-700">{h.size}</td>
                    <td className="px-3 py-3 font-mono text-emerald-700 font-semibold">{h.impressionsDaily}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{h.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedHoarding(h)}
                        className="px-2.5 py-1 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {language === 'mr' ? 'पहा' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hoarding Detail Modal */}
      {selectedHoarding && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-gov-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="image" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm">
                  {selectedHoarding.id} — {selectedHoarding.districtName}
                </span>
              </div>
              <button
                onClick={() => setSelectedHoarding(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Simulated Photo Preview */}
              <div className="aspect-[16/9] bg-gradient-to-br from-amber-700 via-amber-800 to-slate-900 rounded-xl p-4 flex flex-col justify-between text-white border border-amber-500/40 shadow-inner">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">
                    GOVERNMENT OF MAHARASHTRA
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">
                    VERIFIED
                  </span>
                </div>
                <div className="text-center py-2">
                  <h3 className="text-lg font-black font-serif text-white drop-shadow-md">
                    {language === 'mr' ? selectedHoarding.campaignMr : selectedHoarding.campaign}
                  </h3>
                  <p className="text-xs text-amber-200 mt-1">
                    {language === 'mr' ? selectedHoarding.departmentMr : selectedHoarding.department}
                  </p>
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 border-t border-white/20 pt-1">
                  <span>{selectedHoarding.size}</span>
                  <span>{selectedHoarding.location}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-900">{selectedHoarding.location}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Daily Impressions:</span>
                  <span className="font-semibold text-emerald-700">{selectedHoarding.impressionsDaily}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-slate-500">Last Verified:</span>
                  <span className="font-semibold text-slate-900">{selectedHoarding.verifiedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Geotag Coordinates:</span>
                  <span className="font-mono text-slate-900">
                    {selectedHoarding.geotag.lat}, {selectedHoarding.geotag.lng}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHoarding(null)}
                className="w-full py-2 bg-gov-primary text-white rounded-lg text-xs font-bold hover:bg-gov-primary-dark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
