'use client';

import React, { useMemo, useState } from 'react';
import { DistrictData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  ArrowUpRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/20/solid';
import { getDistrictName, getDivisionName } from '@/lib/dataLocalization';
import { MetricHoverDetail } from '@/components/shared/MetricHoverDetail';
import { DistrictViewScope } from './DistrictSearchBar';

interface DistrictTableProps {
  districts: DistrictData[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  /** Optional prop to enable cross-panel highlighting when a district row is clicked */
  highlightDistrict?: (districtId: string) => void;
  viewScope?: DistrictViewScope;
}

type SortColumn = 'rank' | 'name' | 'division' | 'releases' | 'avgTAT' | 'sentiment' | 'crisisSLA' | 'cpi';
type SortOrder = 'asc' | 'desc';

export const DistrictTable: React.FC<DistrictTableProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  highlightDistrict,
  viewScope = 'topBottom5',
}) => {
  const { language, userRole, currentUser } = useDashboardStore();
  const t = useTranslation(language);

  const assignedDistrictName = currentUser?.district?.toLowerCase() || 'palghar';
  const isUserDistrictScoped = userRole === 'collector' || userRole === 'dio_desk';

  const [sortColumn, setSortColumn] = useState<SortColumn>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      // For CPI and Releases, default to desc on first click; for others, default to asc
      setSortOrder(col === 'cpi' || col === 'releases' || col === 'sentiment' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  const sortedDistricts = useMemo(() => {
    const sorted = [...districts].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
    return sorted;
  }, [districts, sortColumn, sortOrder]);

  // Pagination logic
  const totalItems = sortedDistricts.length;
  const isAll = pageSize === 0;
  const totalPages = isAll ? 1 : Math.ceil(totalItems / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedDistricts = useMemo(() => {
    if (isAll) return sortedDistricts;
    const startIndex = (safePage - 1) * pageSize;
    return sortedDistricts.slice(startIndex, startIndex + pageSize);
  }, [sortedDistricts, safePage, pageSize, isAll]);

  const renderSortIcon = (col: SortColumn) => {
    if (sortColumn !== col) {
      return <ChevronUpDownIcon className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUpIcon className="w-3.5 h-3.5 text-amber-300 font-bold shrink-0" />
    ) : (
      <ChevronDownIcon className="w-3.5 h-3.5 text-amber-300 font-bold shrink-0" />
    );
  };

  const getAriaSort = (col: SortColumn): 'ascending' | 'descending' | 'none' => {
    if (sortColumn !== col) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  const handleHeaderKeyDown = (e: React.KeyboardEvent, col: SortColumn) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(col);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between gap-3 w-full">
      <div className="overflow-x-auto -mx-1 px-1 border border-slate-200/90 rounded-lg shadow-2xs bg-white w-full">
        <table className="w-full text-left text-xs min-w-[500px]">
          <thead className="bg-gov-primary text-white font-semibold border-b border-gov-primary-dark select-none">
            <tr>
              {/* Rank */}
              <th
                onClick={() => handleSort('rank')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'rank')}
                tabIndex={0}
                aria-sort={getAriaSort('rank')}
                className="py-3 px-3 w-10 text-center cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by Rank"
              >
                <div className="flex items-center justify-center gap-0.5">
                  <span>{t.zone2.rankCol}</span>
                  {renderSortIcon('rank')}
                </div>
              </th>

              {/* District & Division */}
              <th
                onClick={() => handleSort('name')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'name')}
                tabIndex={0}
                aria-sort={getAriaSort('name')}
                className="py-3 px-3 cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by District"
              >
                <div className="flex items-center gap-0.5">
                  <span>{t.zone2.districtCol}</span>
                  {renderSortIcon('name')}
                </div>
              </th>

              {/* KRA In-Charge (Collector / Incharge Highlighted Column) */}
              <th className="py-3 px-3 text-left bg-amber-600/90 text-amber-50 font-bold tracking-tight border-b-2 border-amber-700 whitespace-nowrap select-none">
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-amber-200" />
                  <span>{language === 'mr' ? 'KRA प्रमुख (जिल्हाधिकारी / अधिकारी)' : 'KRA In-Charge (Collector / Officer)'}</span>
                </div>
              </th>

              {/* Releases */}
              <th
                onClick={() => handleSort('releases')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'releases')}
                tabIndex={0}
                aria-sort={getAriaSort('releases')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by Releases"
              >
                <div className="flex items-center justify-end gap-0.5">
                  <span>{t.zone2.releasesCol}</span>
                  {renderSortIcon('releases')}
                </div>
              </th>

              {/* Avg TAT */}
              <th
                onClick={() => handleSort('avgTAT')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'avgTAT')}
                tabIndex={0}
                aria-sort={getAriaSort('avgTAT')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by Citizen Resolution Rate"
              >
                <div className="flex items-center justify-end gap-0.5">
                  <span>{t.zone2.tatCol}</span>
                  {renderSortIcon('avgTAT')}
                </div>
              </th>

              {/* Sentiment */}
              <th
                onClick={() => handleSort('sentiment')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'sentiment')}
                tabIndex={0}
                aria-sort={getAriaSort('sentiment')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by Sentiment"
              >
                <div className="flex items-center justify-end gap-0.5">
                  <span>{t.zone2.sentimentCol}</span>
                  {renderSortIcon('sentiment')}
                </div>
              </th>

              {/* Crisis SLA */}
              <th
                onClick={() => handleSort('crisisSLA')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'crisisSLA')}
                tabIndex={0}
                aria-sort={getAriaSort('crisisSLA')}
                className="py-3 px-3 text-right cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by Crisis SLA"
              >
                <div className="flex items-center justify-end gap-0.5">
                  <span>{t.zone2.crisisCol}</span>
                  {renderSortIcon('crisisSLA')}
                </div>
              </th>

              {/* CPI */}
              <th
                onClick={() => handleSort('cpi')}
                onKeyDown={(e) => handleHeaderKeyDown(e, 'cpi')}
                tabIndex={0}
                aria-sort={getAriaSort('cpi')}
                className="py-3 px-3 text-right font-bold cursor-pointer hover:bg-gov-primary-light focus-visible:bg-gov-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors group"
                title="Sort by CPI Composite Performance Index"
              >
                <div className="flex items-center justify-end gap-0.5">
                  <span>{t.zone2.cpiCol}</span>
                  {renderSortIcon('cpi')}
                </div>
              </th>

              {/* Action */}
              <th className="py-3 px-3 text-center w-16">{t.zone2.actionCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
            {paginatedDistricts.map((d, index) => {
              const isSelected =
                d.id === selectedDistrictId ||
                (selectedDistrictId === 'aurangabad' && d.id === 'chhatrapati-sambhajinagar') ||
                (selectedDistrictId === 'mumbai' && d.id === 'mumbai-city');

              // Semantic color scoring for CPI
              let cpiColorClass = 'text-slate-900';
              if (d.cpi >= 80) cpiColorClass = 'text-emerald-700 font-bold';
              else if (d.cpi >= 70) cpiColorClass = 'text-amber-800 font-bold';
              else cpiColorClass = 'text-rose-700 font-bold';

              // Visual dividers when viewing user-requested Top 5 & Low 5
              const showTopHeader = viewScope === 'topBottom5' && index === 0;
              const showBottomHeader = viewScope === 'topBottom5' && index === 5;

              return (
                <React.Fragment key={d.id}>
                  {showTopHeader && (
                    <tr className="bg-emerald-50/90 border-y border-emerald-200">
                      <td colSpan={9} className="py-1.5 px-3 text-emerald-900 font-bold text-[11px] tracking-wide">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{language === 'mr' ? '⭐ शीर्ष ५ सर्वोत्तम जिल्हे (उत्कृष्ट प्रशासकीय कामगिरी)' : '⭐ TOP 5 LEADING DISTRICTS (STATEWIDE EXCELLENCE BENCHMARK)'}</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {showBottomHeader && (
                    <tr className="bg-rose-50/90 border-y border-rose-200">
                      <td colSpan={9} className="py-1.5 px-3 text-rose-900 font-bold text-[11px] tracking-wide">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          <span>{language === 'mr' ? '⚠️ तळ ५ प्राधान्य जिल्हे (तात्काळ प्रशासकीय सहाय्य व सुधारणा आवश्यक)' : '⚠️ LOW 5 PRIORITY FOCUS DISTRICTS (SPECIAL INTERVENTION & HANDHOLDING)'}</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      onSelectDistrict(d.id);
                      highlightDistrict?.(d.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectDistrict(d.id);
                      }
                    }}
                    className={`cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-accent ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-2 border-l-gov-accent font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-2 font-mono text-center text-slate-500 font-semibold">
                      <MetricHoverDetail
                        customMethodology={{
                          title: `Rank #${d.rank} (${d.name})`,
                          titleMr: `क्रमांक #${d.rank} (${d.nameMr || d.name})`,
                          termDefinition: 'District statewide rank sorted in descending order of Composite Performance Index (CPI).',
                          termDefinitionMr: 'एकत्रित कामगिरी निर्देशांकावर (CPI) आधारित राज्यव्यापी क्रमवारी.',
                          formula: 'Rank = DenseRank(CPI DESC)',
                          calculationExplanation: `Rank #${d.rank} out of 36 districts with a CPI score of ${d.cpi}.`,
                          calculationExplanationMr: `३६ जिल्ह्यांपैकी #${d.rank} वा क्रमांक (CPI: ${d.cpi}).`,
                          targetBenchmark: 'Top Quintile: Rank 1 to 7',
                          dataSources: ['Planning Department, Government of Maharashtra'],
                        }}
                        currentValue={`#${d.rank}`}
                        position="right"
                      >
                        <span className="underline decoration-dotted decoration-slate-300">#{d.rank}</span>
                      </MetricHoverDetail>
                    </td>

                    {/* District & Division */}
                    <td className="py-3 px-2.5 font-bold text-gov-primary">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name}</span>
                          {isUserDistrictScoped && d.name.toLowerCase() === assignedDistrictName && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-amber-700 whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>{language === 'mr' ? 'आपला' : 'Your District'}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-normal text-slate-500">
                          {language === 'mr' ? getDivisionName(d.division, 'mr') : d.division}
                        </span>
                      </div>
                    </td>

                    {/* KRA In-Charge: Collector & DIO Highlight */}
                    <td className="py-2.5 px-3">
                      <MetricHoverDetail
                        customMethodology={{
                          title: `KRA In-Charge: ${d.collectorName || 'District Collector, IAS'}`,
                          titleMr: `KRA प्रमुख: ${d.collectorNameMr || d.collectorName || 'जिल्हाधिकारी, भा.प्र.से.'}`,
                          termDefinition: 'Key Result Area (KRA) officer holding statutory accountability for district governance.',
                          termDefinitionMr: 'जिल्ह्यातील शासकीय कामगिरी, आणीबाणी प्रतिसाद व लोककल्याणकारी योजनांचा प्रमुख उत्तरदायी अधिकारी.',
                          formula: 'KRA Scorecard = Crisis SLA (30%) + Grievance TAT (30%) + Public Communications (20%) + Field Inspection (20%)',
                          weights: 'Crisis Response: 30% | Citizen TAT: 30% | Public Media: 20% | Field Compliance: 20%',
                          calculationExplanation: `Collector ${d.collectorName} leads district administration. Key responsibilities include crisis resolution (<4h SLA), prompt rumor debunking, and citizen grievance redressal.`,
                          calculationExplanationMr: `जिल्हाधिकारी ${d.collectorNameMr || d.collectorName} यांच्याकडे आपत्कालीन SLA पूर्तता, अफवांचे तातडीने खंडन व नागरी तक्रार निवारणाची जबाबदारी आहे.`,
                          targetBenchmark: 'KRA Target: 100% Compliance | Mandated Grievance TAT < 48 Hours',
                          dataSources: [
                            'General Administration Department (GAD), Mantralaya',
                            'District Collectorate Official Roster',
                            'DGIPR Administrative Directory',
                          ],
                        }}
                        currentValue="KRA Active"
                        position="left"
                      >
                        <div className="flex flex-col gap-1 min-w-[210px] cursor-help">
                          {/* Prominently Highlighted Collector Badge */}
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-950 border-2 border-amber-400 font-extrabold text-xs shadow-xs hover:bg-amber-100 transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                            <span className="truncate font-black text-slate-900">
                              {language === 'mr' ? (d.collectorNameMr || d.collectorName) : (d.collectorName || 'District Collector, IAS')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
                            <span className="truncate text-slate-600 font-medium">
                              {d.dioOfficer ? `DIO: ${language === 'mr' ? (d.dioOfficerMr || d.dioOfficer) : d.dioOfficer}` : 'DIO Desk Active'}
                            </span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              KRA Met
                            </span>
                          </div>
                        </div>
                      </MetricHoverDetail>
                    </td>

                    {/* Releases */}
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      <MetricHoverDetail
                        methodologyKey="totalReleases"
                        currentValue={d.releases}
                        position="left"
                      >
                        <div className="flex flex-col items-end gap-1 cursor-help">
                          <span className="underline decoration-dotted decoration-slate-300">
                            {d.releases}
                          </span>
                          <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.round((d.releases / 500) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </MetricHoverDetail>
                    </td>

                    {/* Avg TAT / Citizen Grievance Resolution */}
                    <td className="py-3 px-3 text-right font-mono">
                      <MetricHoverDetail
                        customMethodology={{
                          title: 'Citizen Grievance Resolution Rate',
                          titleMr: 'नागरी तक्रार निवारण दर',
                          termDefinition: 'Statutory citizen grievance and inquiry resolution compliance within Aaple Sarkar Citizen Charter timeframe (48 hours).',
                          termDefinitionMr: 'आपले सरकार नागरी हक्क सनद विहित वेळेत (४८ तास) तक्रारींचे १००% निवारण प्रमाण.',
                          formula: 'Resolution Rate % = max(93.5, 100 - (Avg TAT minutes / 25))%',
                          calculationExplanation: `District Average Turnaround Time is ${d.avgTAT ?? 40} minutes. Derived into a compliance resolution percentage benchmarked against 45-minute golden standard.`,
                          calculationExplanationMr: `या जिल्ह्याचा सरासरी निवारण वेळ ${d.avgTAT} मिनिटे आहे. ४५ मिनिटांच्या विहित मानकानुसार गुणोत्तर काढले जाते.`,
                          targetBenchmark: 'Target: ≥ 95% Citizen Charter Compliance',
                          dataSources: ['Aaple Sarkar Public Grievance Portal', 'Collectorate Grievance Redressal Cell'],
                        }}
                        currentValue={`${(Math.min(99.8, Math.max(93.5, 100 - ((d.avgTAT ?? 40) / 25)))).toFixed(1)}%`}
                        position="left"
                      >
                        <div className="flex flex-col items-end gap-1 cursor-help">
                          <span
                            className={`underline decoration-dotted decoration-slate-300 ${(d.avgTAT ?? 40) <= 45 ? 'text-emerald-700 font-semibold' : 'text-slate-700'}`}
                          >
                            {(Math.min(99.8, Math.max(93.5, 100 - ((d.avgTAT ?? 40) / 25)))).toFixed(1)}%
                          </span>
                          <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${(d.avgTAT ?? 40) <= 45 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(99.8, Math.max(93.5, 100 - ((d.avgTAT ?? 40) / 25)))}%` }}
                            />
                          </div>
                        </div>
                      </MetricHoverDetail>
                    </td>

                    {/* Sentiment */}
                    <td className="py-3 px-3 text-right font-mono">
                      <MetricHoverDetail
                        methodologyKey="sentimentIndex"
                        currentValue={`${d.sentiment}%`}
                        position="left"
                      >
                        <div className="flex flex-col items-end gap-1 cursor-help">
                          <span className="inline-flex items-center justify-end gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                d.sentiment >= 70
                                  ? 'bg-emerald-500'
                                  : d.sentiment >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span className="underline decoration-dotted decoration-slate-300">{d.sentiment}%</span>
                          </span>
                          <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${d.sentiment >= 70 ? 'bg-emerald-500' : d.sentiment >= 60 ? 'bg-amber-500' : 'bg-slate-400'}`}
                              style={{ width: `${d.sentiment}%` }}
                            />
                          </div>
                        </div>
                      </MetricHoverDetail>
                    </td>

                    {/* Crisis SLA */}
                    <td className="py-3 px-3 text-right font-mono">
                      <MetricHoverDetail
                        methodologyKey="crisisSlaResolutionRate"
                        currentValue={`${d.crisisSLA}%`}
                        position="left"
                      >
                        <div className="flex flex-col items-end gap-1 cursor-help">
                          <span className={`underline decoration-dotted decoration-slate-300 ${d.crisisSLA >= 85 ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}`}>
                            {d.crisisSLA}%
                          </span>
                          <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${d.crisisSLA >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${d.crisisSLA}%` }}
                            />
                          </div>
                        </div>
                      </MetricHoverDetail>
                    </td>

                    {/* CPI with Power BI Data Bar */}
                    <td className={`py-3 px-3 text-right font-mono text-xs sm:text-sm ${cpiColorClass}`}>
                      <MetricHoverDetail
                        methodologyKey="cpiIndex"
                        currentValue={d.cpi}
                        position="left"
                      >
                        <div className="flex flex-col items-end gap-1 cursor-help">
                          <span className="underline decoration-dotted decoration-slate-300 font-bold">{d.cpi}</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full ${d.cpi >= 90 ? 'bg-emerald-600' : d.cpi >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(100, d.cpi)}%` }}
                            />
                          </div>
                        </div>
                      </MetricHoverDetail>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDistrict(d.id);
                        }}
                        aria-label={language === 'mr' ? `${d.nameMr || getDistrictName(d.name, 'mr')} कामगिरी विश्लेषण` : `Inspect ${d.name} performance metrics`}
                        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1 text-[10px] rounded transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-amber-700 bg-amber-500/10 border-l-2 border-amber-500 font-semibold rounded-l-none'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <span>{isSelected ? t.zone2.selectedBtn : t.zone2.viewBtn}</span>
                        <ArrowUpRightIcon className="w-3 h-3 shrink-0" />
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination & Density Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-xs text-slate-500 pt-2 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2">
          <span>
            {language === 'mr' ? (
              <>
                दर्शवित आहे <strong className="font-mono text-slate-800">{isAll ? totalItems : `${Math.min(totalItems, (safePage - 1) * pageSize + 1)}-${Math.min(totalItems, safePage * pageSize)}`}</strong> पैकी <strong className="font-mono text-slate-800">{totalItems}</strong> जिल्हे
              </>
            ) : (
              <>
                Showing <strong className="font-mono text-slate-800">{isAll ? totalItems : `${Math.min(totalItems, (safePage - 1) * pageSize + 1)}-${Math.min(totalItems, safePage * pageSize)}`}</strong> of <strong className="font-mono text-slate-800">{totalItems}</strong> districts
              </>
            )}
          </span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1 text-[11px]">
            <span>{language === 'mr' ? 'पृष्ठ आकार:' : 'Page size:'}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-1.5 py-0.5 border border-slate-300 rounded text-slate-800 bg-white focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={0}>{language === 'mr' ? 'सर्व (३६)' : 'All (36)'}</option>
            </select>
          </div>
        </div>

        {!isAll && totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-disabled={safePage === 1}
              className="p-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={language === 'mr' ? 'मागील पृष्ठ' : 'Previous Page'}
              aria-label={language === 'mr' ? 'मागील पृष्ठ' : 'Previous Page'}
            >
              <ChevronLeftIcon className="w-3.5 h-3.5 shrink-0" />
            </button>
            <span className="font-mono text-xs font-semibold px-2 text-slate-800">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-disabled={safePage === totalPages}
              className="p-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title={language === 'mr' ? 'पुढील पृष्ठ' : 'Next Page'}
              aria-label={language === 'mr' ? 'पुढील पृष्ठ' : 'Next Page'}
            >
              <ChevronRightIcon className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

