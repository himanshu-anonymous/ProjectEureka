'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { SampleDataBadge } from '@/components/shared/SampleDataBadge';
import {
  DISTRICT_GEOMETRY,
  MAP_WIDTH,
  MAP_HEIGHT,
  STATE_OUTLINE_PATH,
  DIVISION_BORDERS_PATH,
  type DistrictGeometry,
} from '@/data/maharashtraGeo.generated';
import { DIPR_DIVISIONS_CONFIG } from '@/data/diprDivisionsConfig';
import { getHoardings } from '@/lib/backendClient';
import type { SchemeHoardingData } from '@/types/dashboard';

// Build lookup mapping from district_code (e.g. MH-12) to Geo DistrictId (e.g. pune)
const DISTRICT_CODE_TO_GEO_ID: Record<string, string> = {};
const DISTRICT_CODE_TO_NAMES: Record<string, { en: string; mr: string }> = {};

DIPR_DIVISIONS_CONFIG.forEach((div) => {
  div.districts.forEach((dist) => {
    DISTRICT_CODE_TO_GEO_ID[dist.code] = dist.id;
    DISTRICT_CODE_TO_NAMES[dist.code] = { en: dist.nameEn, mr: dist.nameMr };
  });
});

export const GovernmentSchemeHoardingsPanel: React.FC = () => {
  const [hoardings, setHoardings] = useState<SchemeHoardingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHoardingId, setSelectedHoardingId] = useState<string | null>(null);
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getHoardings();
        if (isMounted) {
          if (res && res.hoardings) {
            setHoardings(res.hoardings);
          } else {
            setHoardings([]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load scheme hoardings');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Unique scheme list
  const uniqueSchemes = useMemo(() => {
    const set = new Set<string>();
    hoardings.forEach((h) => {
      if (h.scheme_name_en) set.add(h.scheme_name_en);
    });
    return Array.from(set).sort();
  }, [hoardings]);

  // Filtered hoardings
  const filteredHoardings = useMemo(() => {
    return hoardings.filter((h) => {
      if (selectedDistrictCode !== 'ALL' && h.district_code !== selectedDistrictCode) {
        return false;
      }
      if (selectedScheme !== 'ALL' && h.scheme_name_en !== selectedScheme) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAddr = (h.address || '').toLowerCase().includes(q);
        const matchScheme = (h.scheme_name_en || '').toLowerCase().includes(q) || (h.scheme_name_mr || '').toLowerCase().includes(q);
        const matchAnn = (h.announcement_en || '').toLowerCase().includes(q) || (h.announcement_mr || '').toLowerCase().includes(q);
        if (!matchAddr && !matchScheme && !matchAnn) return false;
      }
      return true;
    });
  }, [hoardings, selectedDistrictCode, selectedScheme, searchQuery]);

  // Selected hoarding object
  const activeHoarding = useMemo(() => {
    if (!selectedHoardingId) return null;
    return hoardings.find((h) => h.id === selectedHoardingId) || null;
  }, [selectedHoardingId, hoardings]);

  // Pre-calculate positions for hoardings on map
  const hoardingsOnMap = useMemo(() => {
    // Group hoardings by district_code to calculate offsets
    const byDistrict: Record<string, SchemeHoardingData[]> = {};
    filteredHoardings.forEach((h) => {
      if (!byDistrict[h.district_code]) byDistrict[h.district_code] = [];
      byDistrict[h.district_code].push(h);
    });

    const items: Array<{
      hoarding: SchemeHoardingData;
      x: number;
      y: number;
      districtGeoId: string;
    }> = [];

    const offsets = [
      { dx: -12, dy: -8 },
      { dx: 14, dy: -6 },
      { dx: 0, dy: 14 },
      { dx: -16, dy: 12 },
      { dx: 16, dy: 12 },
    ];

    Object.entries(byDistrict).forEach(([dCode, list]) => {
      const geoId = DISTRICT_CODE_TO_GEO_ID[dCode];
      const geo = DISTRICT_GEOMETRY.find((g) => g.id === geoId);
      const baseX = geo ? geo.pin.x : 400;
      const baseY = geo ? geo.pin.y : 330;

      list.forEach((h, idx) => {
        const offset = offsets[idx % offsets.length];
        items.push({
          hoarding: h,
          x: baseX + offset.dx,
          y: baseY + offset.dy,
          districtGeoId: geoId || '',
        });
      });
    });

    return items;
  }, [filteredHoardings]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <MaterialIcon name="podcasts" className="text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Government Scheme Hoardings & Outdoor Visibility
              </h3>
              <SampleDataBadge />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              शासकीय योजना फलक व जनजागृती संनियंत्रण (36 Districts GIS Tracker)
            </p>
          </div>
        </div>

        {/* Counter badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {filteredHoardings.length} of {hoardings.length} Hoardings
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* District Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Filter by District / जिल्हा
          </label>
          <select
            value={selectedDistrictCode}
            onChange={(e) => {
              setSelectedDistrictCode(e.target.value);
              setSelectedHoardingId(null);
            }}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All 36 Districts (सर्व ३६ जिल्हे)</option>
            {DIPR_DIVISIONS_CONFIG.flatMap((div) =>
              div.districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} - {d.nameEn} ({d.nameMr})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Scheme Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Filter by Scheme / शासकीय योजना
          </label>
          <select
            value={selectedScheme}
            onChange={(e) => {
              setSelectedScheme(e.target.value);
              setSelectedHoardingId(null);
            }}
            className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Schemes (सर्व योजना)</option>
            {uniqueSchemes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Search Location / Key words
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Chowk, Bus Stand, Health..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <MaterialIcon
              name="search"
              className="absolute left-2.5 top-2 text-slate-400 dark:text-slate-500 text-sm pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area: Map + List/Detail */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-2">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading Maharashtra Hoarding GIS coordinates...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Map Section (7 cols on LG) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
              <span className="flex items-center gap-1.5 font-medium">
                <MaterialIcon name="map" className="text-sm text-amber-600 dark:text-amber-400" />
                Open-boundary GIS Map (Survey of India / Census 2011)
              </span>
              <span className="text-[11px] text-slate-400">
                Click district or pin to inspect hoarding
              </span>
            </div>

            {/* SVG Map Container */}
            <div className="w-full max-w-[620px] aspect-[800/664] relative">
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                className="w-full h-full select-none"
                aria-label="Maharashtra Scheme Hoardings GIS Map"
              >
                {/* State outline */}
                <path
                  d={STATE_OUTLINE_PATH}
                  className="fill-slate-100 dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700 stroke-[1.5]"
                />

                {/* District Polygons */}
                {DISTRICT_GEOMETRY.map((district) => {
                  const isHovered = hoveredDistrictId === district.id;
                  const isSelected =
                    selectedDistrictCode !== 'ALL' &&
                    DISTRICT_CODE_TO_GEO_ID[selectedDistrictCode] === district.id;

                  return (
                    <path
                      key={district.id}
                      d={district.path}
                      onMouseEnter={() => setHoveredDistrictId(district.id)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                      onClick={() => {
                        // Find matching district code
                        const entry = Object.entries(DISTRICT_CODE_TO_GEO_ID).find(
                          ([, id]) => id === district.id
                        );
                        if (entry) {
                          setSelectedDistrictCode(
                            selectedDistrictCode === entry[0] ? 'ALL' : entry[0]
                          );
                          setSelectedHoardingId(null);
                        }
                      }}
                      className={`cursor-pointer transition-colors duration-150 ${
                        isSelected
                          ? 'fill-amber-100 dark:fill-amber-950/70 stroke-amber-600 dark:stroke-amber-400 stroke-2'
                          : isHovered
                          ? 'fill-blue-50 dark:fill-blue-950/50 stroke-blue-500 stroke-[1.5]'
                          : 'fill-white dark:fill-slate-800/80 stroke-slate-200 dark:stroke-slate-700/80 stroke-[0.8]'
                      }`}
                    >
                      <title>{`${district.name} (${district.nameMr})`}</title>
                    </path>
                  );
                })}

                {/* Division Borders */}
                <path
                  d={DIVISION_BORDERS_PATH}
                  className="fill-none stroke-slate-400 dark:stroke-slate-600 stroke-[1.2] pointer-events-none"
                />

                {/* District Pin Labels (Small names) */}
                {DISTRICT_GEOMETRY.map((district) => (
                  <text
                    key={`label-${district.id}`}
                    x={district.pin.x}
                    y={district.pin.y + 3}
                    textAnchor="middle"
                    className="text-[8px] font-semibold fill-slate-400 dark:fill-slate-500 pointer-events-none select-none"
                  >
                    {district.label}
                  </text>
                ))}

                {/* Hoarding Markers */}
                {hoardingsOnMap.map(({ hoarding, x, y }) => {
                  const isSelected = selectedHoardingId === hoarding.id;
                  return (
                    <g
                      key={`pin-${hoarding.id}`}
                      transform={`translate(${x}, ${y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHoardingId(hoarding.id);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Glow circle if selected */}
                      {isSelected && (
                        <circle
                          r="12"
                          className="fill-amber-400/30 dark:fill-amber-400/40 animate-ping"
                        />
                      )}
                      {/* Outer badge */}
                      <circle
                        r={isSelected ? 8 : 5.5}
                        className={`transition-all duration-150 ${
                          isSelected
                            ? 'fill-amber-600 stroke-white stroke-2'
                            : 'fill-amber-500 hover:fill-amber-600 stroke-white dark:stroke-slate-900 stroke-1'
                        }`}
                      />
                      {/* Inner dot */}
                      <circle
                        r={isSelected ? 3 : 2}
                        className="fill-white pointer-events-none"
                      />
                      <title>{`${hoarding.scheme_name_en} - ${hoarding.address}`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Legend */}
            <div className="w-full flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
                  Active Hoarding Location
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-white" />
                  Selected Hoarding
                </span>
              </div>
              <span className="italic">Pins plotted via district centroid pole-of-inaccessibility</span>
            </div>
          </div>

          {/* Right Section (5 cols on LG): Active Detail Card OR Accessible List */}
          <div className="lg:col-span-5 flex flex-col gap-3 min-w-0">
            {activeHoarding ? (
              /* Selected Hoarding Detail Card */
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-amber-300 dark:border-amber-700/80 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm animate-in fade-in duration-150">
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-1">
                      {activeHoarding.department_code} Department
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {activeHoarding.scheme_name_en}
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                      {activeHoarding.scheme_name_mr}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedHoardingId(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Close detail view"
                    aria-label="Close detail view"
                  >
                    <MaterialIcon name="close" className="text-base" />
                  </button>
                </div>

                {/* Hoarding Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">District</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {DISTRICT_CODE_TO_NAMES[activeHoarding.district_code]?.en || activeHoarding.district_code} (
                      {DISTRICT_CODE_TO_NAMES[activeHoarding.district_code]?.mr || ''})
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dimensions</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeHoarding.size} (Large Format)
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Installed On</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {new Date(activeHoarding.installed_on || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Display Status</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {activeHoarding.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Physical Location</span>
                  <p className="text-slate-700 dark:text-slate-300 flex items-start gap-1.5 font-medium">
                    <MaterialIcon name="location_on" className="text-sm text-red-500 shrink-0 mt-0.5" />
                    <span>{activeHoarding.address}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 pl-5">
                    GPS Coordinates: {activeHoarding.lat.toFixed(4)}° N, {activeHoarding.lon.toFixed(4)}° E
                  </p>
                </div>

                {/* Official Announcement Text */}
                <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Official Hoarding Content / फलकावरील संदेश
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 text-xs font-medium italic">
                    "{activeHoarding.announcement_en}"
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-serif italic border-t border-amber-200/60 dark:border-amber-900/40 pt-1">
                    "{activeHoarding.announcement_mr}"
                  </p>
                </div>

                {/* Photo Placeholder */}
                <div className="w-full h-32 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 text-xs relative overflow-hidden">
                  <MaterialIcon name="image" className="text-3xl text-slate-400 dark:text-slate-500 mb-1" />
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Field Verification Photo Available
                  </span>
                  <span className="text-[10px] text-slate-400">Captured via Mobile Inspection App</span>
                  <div className="absolute bottom-2 right-2">
                    <SampleDataBadge />
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHoardingId(null)}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5"
                >
                  <MaterialIcon name="arrow_back" className="text-sm" />
                  Return to Hoardings List
                </button>
              </div>
            ) : (
              /* Accessible List View of Hoardings */
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Accessible Hoardings Register
                  </span>
                  <span className="text-[11px]">Keyboard navigable (Enter/Space to view)</span>
                </div>

                <div
                  className="max-h-[460px] overflow-y-auto space-y-2 pr-1 focus:outline-none"
                  tabIndex={0}
                  aria-label="List of scheme hoardings"
                >
                  {filteredHoardings.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                      <MaterialIcon name="search" className="text-3xl mb-1 text-slate-400" />
                      <p>No hoardings match the selected filters.</p>
                    </div>
                  ) : (
                    filteredHoardings.map((h) => {
                      const distName = DISTRICT_CODE_TO_NAMES[h.district_code]?.en || h.district_code;
                      return (
                        <div
                          key={h.id}
                          tabIndex={0}
                          role="button"
                          onClick={() => setSelectedHoardingId(h.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedHoardingId(h.id);
                            }
                          }}
                          className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 hover:bg-amber-50/70 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {h.district_code} ({distName})
                                </span>
                                <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400">
                                  {h.size}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 leading-tight">
                                {h.scheme_name_en}
                              </h5>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                                <MaterialIcon name="location_on" className="text-xs text-red-500 shrink-0" />
                                {h.address}
                              </p>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                              Active
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
