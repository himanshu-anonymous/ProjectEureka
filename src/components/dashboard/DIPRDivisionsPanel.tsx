'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Panel } from '@/components/shared/Panel';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { SampleDataBadge } from '@/components/shared/SampleDataBadge';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DIPR_DIVISIONS_CONFIG, DIPRDivisionConfig, DIPRDistrictConfig } from '@/data/diprDivisionsConfig';

export const DIPRDivisionsPanel: React.FC = () => {
  const { language, districts, selectedDistrictId, setSelectedDistrictId } = useDashboardStore();
  const [openDivisionKey, setOpenDivisionKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close open dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDivisionKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick lookup for composite score & rank from live store
  const districtScoreMap = new Map<string, { rank: number; cpi: number }>();
  districts.forEach((d) => {
    districtScoreMap.set(d.id.toLowerCase(), { rank: d.rank, cpi: d.cpi });
    if (d.name) districtScoreMap.set(d.name.toLowerCase(), { rank: d.rank, cpi: d.cpi });
  });

  const toggleDropdown = (key: string) => {
    setOpenDivisionKey((prev) => (prev === key ? null : key));
  };

  return (
    <Panel
      title={
        <div className="flex items-center gap-2">
          <MaterialIcon name="domain" size="sm" />
          <span>
            {language === 'mr'
              ? 'माहिती व जनसंपर्क महासंचालनालय (DIPR) — ९ माहिती विभाग'
              : 'DIPR Divisional Network — 9 Administrative Information Divisions'}
          </span>
        </div>
      }
      subtitle={
        language === 'mr'
          ? '३६ जिल्ह्यांमधील विभागीय माहिती कार्यालये, डीआयओ संपर्क, कामगिरी गुण व माध्यम संदर्भ'
          : 'Divisional Information Offices, District Information Officers, Scores & Direct Media Feeds'
      }
      actions={<SampleDataBadge size="xs" />}
      accentColor="navy"
      className="w-full"
    >
      <div ref={containerRef} className="space-y-4">
        {/* Helper Note */}
        <p className="text-xs text-content-secondary leading-relaxed">
          {language === 'mr'
            ? 'विभागावर क्लिक करून त्याअंतर्गत येणारे जिल्हे, संबंधित डीआयओ आणि थेट शासकीय पदे, बातम्या, समाजमाध्यम व वृत्तवाहिनी नोंदी पहा:'
            : 'Select any of the 9 DGIPR divisions below to inspect districts, assigned DIOs, composite rankings, and quick media links:'}
        </p>

        {/* The 9 Dropdown Menus Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DIPR_DIVISIONS_CONFIG.map((division: DIPRDivisionConfig) => {
            const isOpen = openDivisionKey === division.key;
            const title = language === 'mr' ? division.nameMr : division.nameEn;

            return (
              <div
                key={division.key}
                className="relative bg-surface-secondary border border-borderLine-subtle rounded-md transition-all"
              >
                {/* Dropdown Menu Header / Trigger Button */}
                <button
                  type="button"
                  onClick={() => toggleDropdown(division.key)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className={`w-full flex items-center justify-between p-3 text-left font-medium text-xs rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-gov-primary ${
                    isOpen ? 'bg-surface border-b border-borderLine-standard shadow-2xs font-bold text-gov-primary' : 'hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-gov-primary shrink-0" />
                    <span className="truncate text-content-primary">
                      {title} {language === 'mr' ? 'विभाग' : 'Division'}
                    </span>
                    <span className="text-[10px] font-mono text-content-muted">
                      ({division.districts.length} {language === 'mr' ? 'जिल्हे' : 'districts'})
                    </span>
                  </div>
                  <MaterialIcon
                    name={isOpen ? 'expand_less' : 'expand_more'}
                    size="xs"
                    className="text-content-muted shrink-0"
                  />
                </button>

                {/* Dropdown Menu Body */}
                {isOpen && (
                  <div
                    className="p-3 space-y-2.5 max-h-[380px] overflow-y-auto bg-surface border-t border-borderLine-subtle shadow-md rounded-b-md animate-in fade-in duration-150"
                    role="menu"
                  >
                    <div className="text-[10px] font-mono text-content-muted flex items-center justify-between pb-1 border-b border-borderLine-subtle">
                      <span>{division.officeNameMr}</span>
                      <span className="uppercase text-[9px] font-bold text-gov-primary">{division.code}</span>
                    </div>

                    {division.districts.map((d: DIPRDistrictConfig) => {
                      const scoreInfo = districtScoreMap.get(d.id.toLowerCase()) ||
                        districtScoreMap.get(d.nameEn.toLowerCase()) || { rank: 1, cpi: 85.0 };
                      const isSelected = selectedDistrictId.toLowerCase() === d.id.toLowerCase();

                      return (
                        <div
                          key={d.code}
                          className={`p-2 rounded border text-xs transition-colors space-y-1.5 ${
                            isSelected
                              ? 'bg-blue-50/70 border-gov-primary font-medium'
                              : 'bg-surface-secondary/70 border-borderLine-subtle hover:bg-surface hover:border-borderLine-standard'
                          }`}
                        >
                          {/* District Title & Rank */}
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDistrictId(d.id)}
                              className="font-bold text-content-primary hover:text-gov-primary text-left cursor-pointer truncate"
                              title="Select district in dashboard"
                            >
                              <span>{language === 'mr' ? d.nameMr : d.nameEn}</span>
                              <span className="font-mono text-[10px] text-content-muted ml-1.5">
                                ({d.code})
                              </span>
                            </button>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-mono text-[10px] text-slate-500">
                                #{scoreInfo.rank}
                              </span>
                              <span className="font-mono font-bold text-[11px] text-content-primary bg-surface px-1.5 py-0.5 rounded border border-borderLine-subtle">
                                {scoreInfo.cpi}
                              </span>
                            </div>
                          </div>

                          {/* DIO Contact */}
                          <div className="text-[10px] text-content-secondary flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MaterialIcon name="person" size="xs" className="text-content-muted" />
                              <span className="truncate max-w-[120px]">{d.dioName}</span>
                            </span>
                            <a
                              href={`tel:${d.dioPhone}`}
                              className="font-mono text-content-muted hover:text-content-primary flex items-center gap-0.5"
                            >
                              <MaterialIcon name="call" size="xs" />
                              <span>{d.dioPhone}</span>
                            </a>
                          </div>

                          {/* Quick Links: Positions, Clippings, Social, TV */}
                          <div className="flex items-center gap-1.5 pt-1 border-t border-borderLine-subtle/60 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setSelectedDistrictId(d.id)}
                              className="px-1.5 py-0.5 rounded bg-surface hover:bg-slate-100 text-content-secondary border border-borderLine-subtle flex items-center gap-0.5 cursor-pointer"
                              title={language === 'mr' ? 'शासकीय पदे पहा' : 'View Positions'}
                            >
                              <MaterialIcon name="domain" size="xs" />
                              <span>{language === 'mr' ? 'पदे' : 'Positions'}</span>
                            </button>

                            <Link
                              href={`/sources/clipping/CLIP-${d.code}-001`}
                              className="px-1.5 py-0.5 rounded bg-surface hover:bg-slate-100 text-content-secondary border border-borderLine-subtle flex items-center gap-0.5"
                              title={language === 'mr' ? 'बातम्या / कात्रणे' : 'Clippings'}
                            >
                              <MaterialIcon name="newspaper" size="xs" />
                              <span>{language === 'mr' ? 'कात्रणे' : 'Press'}</span>
                            </Link>

                            <Link
                              href={`/sources/social/SOC-${d.code}-001`}
                              className="px-1.5 py-0.5 rounded bg-surface hover:bg-slate-100 text-content-secondary border border-borderLine-subtle flex items-center gap-0.5"
                              title={language === 'mr' ? 'समाजमाध्यम' : 'Social'}
                            >
                              <MaterialIcon name="share" size="xs" />
                              <span>{language === 'mr' ? 'सोशल' : 'Social'}</span>
                            </Link>

                            <Link
                              href={`/sources/tv/TV-${d.code}-001`}
                              className="px-1.5 py-0.5 rounded bg-surface hover:bg-slate-100 text-content-secondary border border-borderLine-subtle flex items-center gap-0.5"
                              title={language === 'mr' ? 'वृत्तवाहिनी क्लिप' : 'TV Clips'}
                            >
                              <MaterialIcon name="tv" size="xs" />
                              <span>{language === 'mr' ? 'टीव्ही' : 'TV'}</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
};
