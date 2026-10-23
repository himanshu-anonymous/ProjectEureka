'use client';

import React, { useEffect, useState } from 'react';
import { CoreOperationalSwitchDeck } from '@/components/commandCenter/CoreOperationalSwitchDeck';
import { useDashboardStore } from '@/stores/dashboardStore';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { OCRFeed } from '@/components/zones/OCRFeed/OCRFeed';
import { POINTS_LOST_DATA, DistrictPointsLost } from '@/data/pointsLostData';
import {
  DocumentTextIcon,
  ClockIcon,
  HeartIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid';

export const KonkanIndexScreen: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId, setSearchDistrict } = useDashboardStore();
  const [pointsLost, setPointsLost] = useState<DistrictPointsLost[]>(POINTS_LOST_DATA);

  useEffect(() => {
    fetch('/api/districts/points-lost')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPointsLost(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const konkanDistricts = [
    {
      rank: 1,
      id: 'thane',
      name: 'Thane',
      nameMr: 'ठाणे',
      releases: 462,
      tat: 38,
      sentiment: 87,
      crisisSLA: 100,
      scores: { volume: 25.0, speed: 25.0, sentiment: 21.75, crisis: 25.0 },
      cpi: 96.75,
    },
    {
      rank: 2,
      id: 'raigad',
      name: 'Raigad',
      nameMr: 'रायगड',
      releases: 295,
      tat: 44,
      sentiment: 81,
      crisisSLA: 98,
      scores: { volume: 24.2, speed: 23.5, sentiment: 20.2, crisis: 24.5 },
      cpi: 92.4,
    },
    {
      rank: 3,
      id: 'palghar',
      name: 'Palghar',
      nameMr: 'पालघर',
      releases: 310,
      tat: 41,
      sentiment: 76,
      crisisSLA: 89,
      scores: { volume: 23.8, speed: 24.1, sentiment: 19.0, crisis: 22.25 },
      cpi: 89.15,
    },
    {
      rank: 4,
      id: 'ratnagiri',
      name: 'Ratnagiri',
      nameMr: 'रत्नागिरी',
      releases: 224,
      tat: 52,
      sentiment: 83,
      crisisSLA: 86,
      scores: { volume: 22.5, speed: 22.0, sentiment: 20.8, crisis: 21.5 },
      cpi: 86.8,
    },
    {
      rank: 5,
      id: 'sindhudurg',
      name: 'Sindhudurg',
      nameMr: 'सिंधुदुर्ग',
      releases: 191,
      tat: 43,
      sentiment: 80,
      crisisSLA: 100,
      scores: { volume: 15.92, speed: 24.0, sentiment: 20.0, crisis: 25.0 },
      cpi: 84.92,
      highlight: '-9.08 Volume Gap',
    },
  ];

  return (
    <div className="p-4 sm:p-5 max-w-[1780px] w-full mx-auto space-y-5">
      {/* 1. Core Switcher Header */}
      <CoreOperationalSwitchDeck currentActive="konkan-index" />

      {/* 2. Top KPI Ribbon (4 Ribbon Counters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Releases */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'mr' ? 'एकूण प्रसिद्धीपत्रके' : 'Total Releases'}
            </span>
            <DocumentTextIcon className="w-4 h-4 text-gov-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">1,482</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
              +18%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {language === 'mr'
              ? 'ठाणे ४६२ • पालघर ३१० • रायगड २९५ • रत्नागिरी २२४ • सिंधुदुर्ग १९१'
              : 'Thane 462 · Palghar 310 · Raigad 295 · Ratnagiri 224 · Sindhudurg 191'}
          </p>
        </div>

        {/* Card 2: Division Avg TAT */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'mr' ? 'सरासरी वितरण वेळ (TAT)' : 'Division Avg TAT'}
            </span>
            <ClockIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">46.6m</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
              -9%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'mr' ? 'विहित उद्दिष्ट: ≤४५ मिनिटे (निकट)' : 'Target: ≤45m (Near Target)'}
          </p>
        </div>

        {/* Card 3: Net Sentiment */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'mr' ? 'निव्वळ जनमत भावना' : 'Net Sentiment Index'}
            </span>
            <HeartIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">69.2%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
              +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'mr' ? 'विहित उद्दिष्ट: ≥६५% (यशस्वी)' : 'Target: ≥65% (Above Benchmark)'}
          </p>
        </div>

        {/* Card 4: Misinfo Tickets */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'mr' ? 'गैरमाहिती प्रकरणे (SLA)' : 'Misinformation Tickets'}
            </span>
            <ShieldCheckIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">3 Open</span>
            <span className="text-xs font-semibold text-slate-600">
              / 44 Total
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            {language === 'mr' ? '४१ प्रकरणे ९०-मि. वेळेत सोडवली' : '41 Resolved in 90m SLA · 3 Active'}
          </p>
        </div>
      </div>

      {/* 3. Main 2-Column Split: 8 cols (Leaderboard & Points Lost) + 4 cols (OCR Feed & Emergency Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Leaderboard · Total Index Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'mr'
                    ? 'कोकण विभाग • १००-गुणांक गुणवत्ता निर्देशांक (CPI)'
                    : 'Konkan Division · 100-Point Performance Index (CPI Leaderboard)'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'mr'
                    ? '४ घटक: खंड (२५) • वेग (२५) • भावना (२५) • आपत्कालीन एसएलए (२५)'
                    : '4 Pillars: Volume (25) + Speed/TAT (25) + Sentiment (25) + Crisis SLA (25)'}
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                Pilot · 5 Districts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">{language === 'mr' ? 'जिल्हा' : 'District'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'प्रसिद्धी' : 'Releases'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'TAT' : 'Avg TAT'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'भावना' : 'Sentiment'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'संकट SLA' : 'Crisis SLA'}</th>
                    <th className="py-2.5 px-3 w-48">{language === 'mr' ? '४-घटक विभागणी (२५ प्रत्येकी)' : '4-Pillar Score Bar'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'गुण (१००)' : 'Index'}</th>
                    <th className="py-2.5 px-3 text-center">{language === 'mr' ? 'तपशील' : 'Drill'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {konkanDistricts.map((dist) => {
                    const isSelected = selectedDistrictId === dist.id;

                    return (
                      <tr
                        key={dist.id}
                        onClick={() => {
                          setSelectedDistrictId(dist.id);
                          setSearchDistrict(dist.name);
                        }}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{dist.rank}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{language === 'mr' ? dist.nameMr : dist.name}</div>
                          {dist.highlight && (
                            <span className="text-[10px] text-rose-600 font-medium">{dist.highlight}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">{dist.releases}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{dist.tat}m</td>
                        <td className="py-2.5 px-3 text-right font-mono">{dist.sentiment}%</td>
                        <td className="py-2.5 px-3 text-right font-mono">{dist.crisisSLA}%</td>
                        <td className="py-2.5 px-3">
                          {/* Stacked 4-Pillar Bar (Volume, Speed, Sentiment, Crisis) */}
                          <div className="h-4 w-full bg-slate-100 rounded overflow-hidden flex" title={`Vol: ${dist.scores.volume}, Spd: ${dist.scores.speed}, Sent: ${dist.scores.sentiment}, Crisis: ${dist.scores.crisis}`}>
                            <div style={{ width: `${(dist.scores.volume / 25) * 25}%` }} className="bg-blue-600 h-full" />
                            <div style={{ width: `${(dist.scores.speed / 25) * 25}%` }} className="bg-cyan-500 h-full" />
                            <div style={{ width: `${(dist.scores.sentiment / 25) * 25}%` }} className="bg-emerald-500 h-full" />
                            <div style={{ width: `${(dist.scores.crisis / 25) * 25}%` }} className="bg-purple-600 h-full" />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5">
                            <span>V:{dist.scores.volume}</span>
                            <span>T:{dist.scores.speed}</span>
                            <span>S:{dist.scores.sentiment}</span>
                            <span>C:{dist.scores.crisis}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-black text-sm font-mono text-slate-900">{dist.cpi.toFixed(2)}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pillar Legend */}
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                  Volume (25)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                  Speed/TAT (25)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  Sentiment (25)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                  Crisis SLA (25)
                </span>
              </div>
              <span className="text-slate-400 font-mono">Max Index: 100.00 Pts</span>
            </div>
          </div>

          {/* Grouped Bar Chart: Points Lost per Pillar */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'mr'
                    ? 'घटकनिहाय गमावलेले गुण (Points Lost per Pillar)'
                    : 'Pillar Score Decomposition · Points Lost per Pillar'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'mr'
                    ? '२५ पैकी गमावलेले गुण — त्रुटी शोध व सुधारात्मक उपाययोजना'
                    : 'Deductions from the 25-point benchmark per pillar across pilot districts'}
                </p>
              </div>
              <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-semibold flex items-center gap-1">
                <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                Sindhudurg Volume Gap: -9.08 pts
              </span>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-3 pt-2">
              {pointsLost.map((item) => (
                <div key={item.district} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {language === 'mr' ? item.districtMr : item.district}
                    </span>
                    <span className="font-mono text-slate-600">
                      Total Lost: <span className="font-bold text-rose-600">-{item.totalLost.toFixed(2)} pts</span> / Final CPI: {item.totalScore.toFixed(2)}
                    </span>
                  </div>

                  {/* Horizontal Bar Breakdown */}
                  <div className="h-6 w-full bg-slate-100 rounded-md overflow-hidden flex text-[10px] font-mono text-white font-bold items-center">
                    {item.volumeLost > 0 && (
                      <div
                        style={{ width: `${(item.volumeLost / 16) * 100}%` }}
                        className="bg-rose-500 h-full flex items-center justify-center px-1"
                        title={`Volume Lost: -${item.volumeLost}`}
                      >
                        V: -{item.volumeLost}
                      </div>
                    )}
                    {item.speedLost > 0 && (
                      <div
                        style={{ width: `${(item.speedLost / 16) * 100}%` }}
                        className="bg-amber-500 h-full flex items-center justify-center px-1"
                        title={`Speed Lost: -${item.speedLost}`}
                      >
                        T: -{item.speedLost}
                      </div>
                    )}
                    {item.sentimentLost > 0 && (
                      <div
                        style={{ width: `${(item.sentimentLost / 16) * 100}%` }}
                        className="bg-blue-500 h-full flex items-center justify-center px-1"
                        title={`Sentiment Lost: -${item.sentimentLost}`}
                      >
                        S: -{item.sentimentLost}
                      </div>
                    )}
                    {item.crisisLost > 0 && (
                      <div
                        style={{ width: `${(item.crisisLost / 16) * 100}%` }}
                        className="bg-purple-500 h-full flex items-center justify-center px-1"
                        title={`Crisis SLA Lost: -${item.crisisLost}`}
                      >
                        C: -{item.crisisLost}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
              <span className="font-medium text-slate-700">
                Key Analytical Takeaway:
              </span>
              <span className="text-[11px] text-slate-600">
                Thane achieved lowest deduction (-3.25 pts), while Sindhudurg shows critical volume deficit (-9.08 pts) requiring taluka outreach reinforcement.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Emergency Alerts & Live Rumors */}
          <EmergencyAlert />

          {/* Live Ingestion Stream (OCR Feed) */}
          <OCRFeed />
        </div>
      </div>
    </div>
  );
};

export default KonkanIndexScreen;
