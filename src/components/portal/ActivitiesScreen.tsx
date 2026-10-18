'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DailyWorkFlowchart } from '@/components/workflow/DailyWorkFlowchart';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface ItineraryItem {
  id: number;
  titleEn: string;
  titleMr: string;
  locationEn: string;
  locationMr: string;
  ministerEn: string;
  ministerMr: string;
  coverageEn: string;
  coverageMr: string;
}

const BASE_ITINERARY_EVENTS: ItineraryItem[] = [
  {
    id: 1,
    titleEn: 'State Seed & Fertilizer Distribution Review',
    titleMr: 'राज्य बियाणे व खते वितरण आढावा बैठक',
    locationEn: 'Pune District Collectorate',
    locationMr: 'पुणे जिल्हाधिकारी कार्यालय',
    ministerEn: 'Minister for Agriculture',
    ministerMr: 'मा. कृषिमंत्री',
    coverageEn: 'Accredited Media & DIO Pune',
    coverageMr: 'अधिकृत माध्यम आणि डीआयओ पुणे',
  },
  {
    id: 2,
    titleEn: 'Review Meeting: Monsoon Disaster Readiness & Dam Levels',
    titleMr: 'आढावा बैठक: मान्सून आपत्ती सज्जता व धरण पाणी पातळी',
    locationEn: 'Mantralaya Conference Hall, Mumbai',
    locationMr: 'मंत्रालय परिषद सभागृह, मुंबई',
    ministerEn: 'Hon. Deputy Chief Minister',
    ministerMr: 'मा. उपमुख्यमंत्री',
    coverageEn: 'Live Clean Feed & DGIPR Press Pool',
    coverageMr: 'थेट प्रक्षेपण व डीजीआयपीआर माध्यम कक्ष',
  },
  {
    id: 3,
    titleEn: 'Press Briefing: State Cabinet Decisions',
    titleMr: 'वार्ताहर परिषद: राज्य मंत्रिमंडळ महत्त्वपूर्ण निर्णय',
    locationEn: 'Sahyadri Guest House, Mumbai',
    locationMr: 'सह्याद्री अतिथीगृह, मुंबई',
    ministerEn: 'Hon. Chief Minister',
    ministerMr: 'मा. मुख्यमंत्री',
    coverageEn: 'National & Regional Broadcasters',
    coverageMr: 'राष्ट्रीय व प्रादेशिक वृत्तवाहिन्या',
  },
  {
    id: 4,
    titleEn: 'District Information Officers Performance Review',
    titleMr: 'जिल्हा माहिती अधिकारी कामकाज कामगिरी आढावा',
    locationEn: 'Virtual Command Link (All 36 Districts)',
    locationMr: 'व्हर्च्युअल कमांड लिंक (सर्व ३६ जिल्हे)',
    ministerEn: 'Director General (DGIPR)',
    ministerMr: 'महासंचालक (माहिती व जनसंपर्क)',
    coverageEn: 'Internal Operations',
    coverageMr: 'अंतर्गत कामकाज',
  },
];

export const ActivitiesScreen: React.FC = () => {
  const { language } = useDashboardStore();
  const [minutesInCycle, setMinutesInCycle] = useState<number>(() => {
    const now = new Date();
    return (now.getHours() % 6) * 60 + now.getMinutes();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setMinutesInCycle((now.getHours() % 6) * 60 + now.getMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Compute dynamic status of the 4 VIP/Public itinerary events based on the 6h cycle (360m total)
  const itineraryEvents = useMemo(() => {
    return BASE_ITINERARY_EVENTS.map((ev, index) => {
      let status: 'Completed' | 'Ongoing' | 'Scheduled' = 'Scheduled';

      if (minutesInCycle < 90) {
        status = index === 0 ? 'Ongoing' : 'Scheduled';
      } else if (minutesInCycle < 180) {
        if (index === 0) status = 'Completed';
        else if (index === 1) status = 'Ongoing';
        else status = 'Scheduled';
      } else if (minutesInCycle < 270) {
        if (index <= 1) status = 'Completed';
        else if (index === 2) status = 'Ongoing';
        else status = 'Scheduled';
      } else {
        if (index <= 2) status = 'Completed';
        else status = 'Ongoing';
      }

      return {
        ...ev,
        status,
      };
    });
  }, [minutesInCycle]);

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <MaterialIcon name="calendar_today" size="sm" className="text-content-primary" />
          <span>
            {language === 'mr'
              ? 'शासकीय उपक्रम व माध्यम कव्हरेज कार्यसूची'
              : 'Government Activities & Press Coverage Itinerary'}
          </span>
        </h2>
        <p className="text-xs text-content-muted">
          {language === 'mr'
            ? 'दैनंदिन मंत्र्यांचे दौरे, मंत्रिमंडळ वार्तालाप आणि क्षेत्रीय माध्यम कव्हरेज'
            : 'Daily Ministerial Tours, Cabinet Briefings & Field Press Coverage'}
        </p>
      </div>

      {/* Daily Work Flowchart */}
      <DailyWorkFlowchart />

      {/* Events Itinerary */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs font-bold text-content-primary">
              {language === 'mr'
                ? 'आजचे सार्वजनिक वेळापत्रक आणि व्हीआयपी कार्यसूची'
                : "Today's High-Level Public Schedules & VIP Itinerary"}
            </h3>
            <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded">
              {language === 'mr' ? '६-तास चक्र आवर्तन' : '6h Cycle Rotation'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-content-muted flex-wrap">
            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span>{language === 'mr' ? '५०% टप्प्यावर स्वयंचलित बदल' : 'Midpoint Trigger @ 50%'}</span>
            </span>
            <span>
              {language === 'mr' ? `${itineraryEvents.length} उपक्रम नोंदवले` : `${itineraryEvents.length} Events Tracked`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {itineraryEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3 bg-surface-secondary/40 border border-borderLine-subtle rounded space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-content-primary px-2 py-0.5 bg-surface rounded border border-borderLine-subtle text-[11px]">
                  {language === 'mr' ? `क्रमवारी #${String(ev.id).padStart(2, '0')}` : `Sequence #${String(ev.id).padStart(2, '0')}`}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    ev.status === 'Completed'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : ev.status === 'Ongoing'
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-surface border-borderLine-standard text-content-muted'
                  }`}
                >
                  {ev.status === 'Completed'
                    ? language === 'mr'
                      ? 'पूर्ण'
                      : 'Completed'
                    : ev.status === 'Ongoing'
                    ? language === 'mr'
                      ? 'सुरू'
                      : 'Ongoing'
                    : language === 'mr'
                    ? 'नियोजित'
                    : 'Scheduled'}
                </span>
              </div>

              <h4 className="font-bold text-content-primary text-xs">
                {language === 'mr' ? ev.titleMr : ev.titleEn}
              </h4>

              <div className="space-y-1 text-[11px] text-content-secondary">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon
                    name="location_on"
                    size="xs"
                    className="text-content-muted shrink-0"
                  />
                  <span>{language === 'mr' ? ev.locationMr : ev.locationEn}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MaterialIcon
                    name="person"
                    size="xs"
                    className="text-content-muted shrink-0"
                  />
                  <span>{language === 'mr' ? ev.ministerMr : ev.ministerEn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Publicity & IEC Telemetry Deck (Blueprint Pillar 4) */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-4 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MaterialIcon name="podcasts" size="sm" className="text-amber-600" />
            <div>
              <h3 className="text-xs font-bold text-content-primary">
                {language === 'mr'
                  ? 'क्षेत्रीय प्रसिद्धी व आयईसी दूरमिती संनियंत्रण कक्ष'
                  : 'Field Publicity & IEC Grassroots Telemetry Deck'}
              </h3>
              <p className="text-[11px] text-content-muted">
                {language === 'mr'
                  ? 'माहिती व्हॅन जीपीएस ट्रॅकिंग, पथनाट्य मोहीम व तळागाळातील जनसंवाद'
                  : 'Mobile Publicity Van GPS Tracking, Street Play (पथनाट्य) Metrics & Taluka Outreach'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {language === 'mr' ? 'थेट जीपीएस जोडणी' : 'Live GPS Feed Connected'}
          </span>
        </div>

        {/* 3 Telemetry Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{language === 'mr' ? 'सक्रिय फिरत्या प्रसिद्धी व्हॅन्स' : 'Active Mobile Publicity Vans'}</span>
              <MaterialIcon name="alt_route" size="xs" className="text-gov-primary" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">36 / 36</div>
            <div className="text-[11px] text-emerald-700 font-medium">
              {language === 'mr' ? '१,४२० किमी आज प्रवास • १००% सक्रिय' : '1,420 KM Driven Today • 100% Active'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{language === 'mr' ? 'पथनाट्य प्रयोग संपन्न' : 'Street Plays (पथनाट्य) Completed'}</span>
              <MaterialIcon name="speaker_notes" size="xs" className="text-amber-600" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">84 {language === 'mr' ? 'प्रयोग' : 'Shows'}</div>
            <div className="text-[11px] text-amber-800 font-medium">
              {language === 'mr' ? '~४८,००० ग्रामीण नागरिक उपस्थिती' : '~48,000 Rural Citizen Reach'}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{language === 'mr' ? 'तालुका व्याप्ती प्रमाण' : 'Taluka Coverage Saturation'}</span>
              <MaterialIcon name="domain" size="xs" className="text-blue-600" />
            </div>
            <div className="text-lg font-bold font-mono text-slate-900">358 / 358</div>
            <div className="text-[11px] text-blue-800 font-medium">
              {language === 'mr' ? '९४.२% ग्रामपंचायत थेट संपर्क' : '94.2% Gram Panchayat Direct Reach'}
            </div>
          </div>
        </div>

        {/* Live Van Operations Log Table */}
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2 px-3">{language === 'mr' ? 'जिल्हा / तालुका' : 'District / Taluka'}</th>
                <th className="py-2 px-3">{language === 'mr' ? 'व्हॅन क्रमांक' : 'Van Reg. No.'}</th>
                <th className="py-2 px-3">{language === 'mr' ? 'सध्याचे स्थान / मार्ग' : 'Live Location / Route'}</th>
                <th className="py-2 px-3 font-mono">{language === 'mr' ? 'आजचा प्रवास' : 'KM Logged'}</th>
                <th className="py-2 px-3">{language === 'mr' ? 'पथनाट्य ठिकाण' : 'Street Play Venue'}</th>
                <th className="py-2 px-3 text-center">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-medium">Thane / Shahapur</td>
                <td className="py-2 px-3 font-mono text-slate-600">MH-04-GV-1021</td>
                <td className="py-2 px-3 text-slate-700">Khardi Gram Panchayat Road</td>
                <td className="py-2 px-3 font-mono">68 KM</td>
                <td className="py-2 px-3 text-slate-700">Weekly Bazaar Ground, Shahapur</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    {language === 'mr' ? 'प्रयोग सुरू' : 'Performing'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-medium">Palghar / Dahanu</td>
                <td className="py-2 px-3 font-mono text-slate-600">MH-48-GV-0842</td>
                <td className="py-2 px-3 text-slate-700">Gholvad Coastal Tribal Hamlet</td>
                <td className="py-2 px-3 font-mono">82 KM</td>
                <td className="py-2 px-3 text-slate-700">ZP High School Compound</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    {language === 'mr' ? 'पूर्ण' : 'Completed'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-medium">Raigad / Mahad</td>
                <td className="py-2 px-3 font-mono text-slate-600">MH-06-GV-1405</td>
                <td className="py-2 px-3 text-slate-700">Poladpur Rural Feeder Line</td>
                <td className="py-2 px-3 font-mono">54 KM</td>
                <td className="py-2 px-3 text-slate-700">Agricultural Market Committee</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
                    {language === 'mr' ? 'मार्गावर' : 'En Route'}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-2 px-3 font-medium">Ratnagiri / Chiplun</td>
                <td className="py-2 px-3 font-mono text-slate-600">MH-08-GV-0918</td>
                <td className="py-2 px-3 text-slate-700">Guhagar Bypass Junction</td>
                <td className="py-2 px-3 font-mono">71 KM</td>
                <td className="py-2 px-3 text-slate-700">Chiplun Municipal Council Hall</td>
                <td className="py-2 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    {language === 'mr' ? 'पूर्ण' : 'Completed'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
