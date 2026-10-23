'use client';

import React, { useState, useEffect } from 'react';
import { CoreOperationalSwitchDeck } from '@/components/commandCenter/CoreOperationalSwitchDeck';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';
import {
  ShieldExclamationIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  HandThumbUpIcon,
  MegaphoneIcon,
  ArrowUturnLeftIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';

interface RumorStepper {
  id: string;
  district: string;
  districtMr: string;
  claim: string;
  claimMr: string;
  timeRemainingSec: number;
  urgency: 'AT RISK' | 'WATCH' | 'ON TRACK';
  steps: {
    num: number;
    title: string;
    titleMr: string;
    status: 'DONE' | 'IN PROGRESS' | 'PENDING';
  }[];
}

const INITIAL_RUMOR_STEPPERS: RumorStepper[] = [
  {
    id: 'INC-2026-PALGHAR-01',
    district: 'Palghar',
    districtMr: 'पालघर',
    claim: 'Viral claim of contaminated drinking water pipeline in Manor & Palghar municipal belts',
    claimMr: 'मनोर व पालघर नगरपालिका भागात पिण्याच्या पाण्यात रासायनिक प्रदूषण झाल्याची अफवा',
    timeRemainingSec: 1077, // ~17m 57s
    urgency: 'AT RISK',
    steps: [
      { num: 1, title: 'Rumor detected', titleMr: 'अफवा ओळखली', status: 'DONE' },
      { num: 2, title: 'Collectorate verification', titleMr: 'जिल्हाधिकारी पडताळणी', status: 'DONE' },
      { num: 3, title: 'Collector approval', titleMr: 'जिल्हाधिकारी मंजुरी', status: 'IN PROGRESS' },
      { num: 4, title: 'Rebuttal published', titleMr: 'खंडन प्रसिद्ध', status: 'PENDING' },
    ],
  },
  {
    id: 'INC-2026-RAIGAD-02',
    district: 'Raigad',
    districtMr: 'रायगड',
    claim: 'Unverified social media video alleging bridge crack on Mumbai-Goa Highway near Mahad',
    claimMr: 'महाडजवळ मुंबई-गोवा महामार्गावरील पुलाला तडे गेल्याचा असत्य व्हिडिओ व्हायरल',
    timeRemainingSec: 2467, // ~41m 07s
    urgency: 'WATCH',
    steps: [
      { num: 1, title: 'Rumor detected', titleMr: 'अफवा ओळखली', status: 'DONE' },
      { num: 2, title: 'Collectorate verification', titleMr: 'जिल्हाधिकारी पडताळणी', status: 'IN PROGRESS' },
      { num: 3, title: 'Collector approval', titleMr: 'जिल्हाधिकारी मंजुरी', status: 'PENDING' },
      { num: 4, title: 'Rebuttal published', titleMr: 'खंडन प्रसिद्ध', status: 'PENDING' },
    ],
  },
  {
    id: 'INC-2026-RATNAGIRI-03',
    district: 'Ratnagiri',
    districtMr: 'रत्नागिरी',
    claim: 'Misleading message alleging power grid shut-off across coastal tehsils during low-tide maintenance',
    claimMr: 'भरती-ओहोटी काळात किनारपट्टी भागात वीजपुरवठा खंडित केल्याचा दिशाभूल संदेश',
    timeRemainingSec: 3830, // ~63m 50s
    urgency: 'ON TRACK',
    steps: [
      { num: 1, title: 'Rumor detected', titleMr: 'अफवा ओळखली', status: 'DONE' },
      { num: 2, title: 'Collectorate verification', titleMr: 'जिल्हाधिकारी पडताळणी', status: 'IN PROGRESS' },
      { num: 3, title: 'Collector approval', titleMr: 'जिल्हाधिकारी मंजुरी', status: 'PENDING' },
      { num: 4, title: 'Rebuttal published', titleMr: 'खंडन प्रसिद्ध', status: 'PENDING' },
    ],
  },
];

export const CrisisScreen: React.FC = () => {
  const { incidents, userRole, currentUser, language, setToast } = useDashboardStore();
  const [rumorSteppers, setRumorSteppers] = useState<RumorStepper[]>(INITIAL_RUMOR_STEPPERS);
  const [activeIncidentId, setActiveIncidentId] = useState('INC-2026-PALGHAR-01');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const isCollector = userRole === 'collector';
  const isOperator = userRole === 'dio_desk';
  const isAdmin = userRole === 'dg_admin';
  const canAuthorize = isCollector || isAdmin;

  const localizedDistrict = getDistrictName(currentUser?.district || 'Palghar', language);

  // Live countdown timer ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRumorSteppers((prev) =>
        prev.map((r) => ({
          ...r,
          timeRemainingSec: Math.max(0, r.timeRemainingSec - 1),
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatHHMMSS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCollectorAction = async (action: 'authorize' | 'issue_advisory' | 'request_edits') => {
    if (!canAuthorize) {
      setToast({
        type: 'error',
        message:
          language === 'mr'
            ? 'परवानगी नाकारली: खंडन अधिकृत करण्यासाठी जिल्हाधिकारी किंवा राज्य प्रशासक आवश्यक.'
            : 'Permission Denied: District Collector or State DG Admin clearance required.',
      });
      return;
    }

    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/crisis/incidents/${activeIncidentId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          username: currentUser?.username || 'collector_palghar',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          type: 'success',
          message: data.message,
        });

        // Update active stepper to Completed
        setRumorSteppers((prev) =>
          prev.map((r) => {
            if (r.id === activeIncidentId) {
              return {
                ...r,
                steps: r.steps.map((s) => ({ ...s, status: 'DONE' })),
                urgency: 'ON TRACK',
              };
            }
            return r;
          })
        );
      } else {
        setToast({
          type: 'error',
          message: data.message || 'Action failed.',
        });
      }
    } catch {
      setToast({
        type: 'error',
        message: 'Network error communicating with crisis API.',
      });
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const containmentDistricts = [
    { name: 'Thane', nameMr: 'ठाणे', rate: 100, count: '14 / 14', status: 'Optimal' },
    { name: 'Sindhudurg', nameMr: 'सिंधुदुर्ग', rate: 100, count: '6 / 6', status: 'Optimal' },
    { name: 'Palghar', nameMr: 'पालघर', rate: 90.9, count: '10 / 11', status: 'Active Watch' },
    { name: 'Raigad', nameMr: 'रायगड', rate: 88.9, count: '8 / 9', status: 'In Triage' },
    { name: 'Ratnagiri', nameMr: 'रत्नागिरी', rate: 85.7, count: '6 / 7', status: 'In Triage' },
  ];

  const dailyActivityTopics = [
    { topic: 'Public Health & Drinking Water', topicMr: 'सार्वजनिक आरोग्य व पाणीपुरवठा', releases: 4, clippings: 18, flags: 1 },
    { topic: 'PWD & Coastal Transport Routes', topicMr: 'सार्वजनिक बांधकाम व रस्ते वाहतूक', releases: 3, clippings: 14, flags: 1 },
    { topic: 'Electricity Grid & Cyclone Readiness', topicMr: 'विद्युत पुरवठा व आपत्ती व्यवस्थापन', releases: 2, clippings: 11, flags: 1 },
    { topic: 'Agriculture & Kharif Relief Funds', topicMr: 'कृषी व खरीप अनुदान वितरण', releases: 5, clippings: 22, flags: 0 },
    { topic: 'Education & Ashram Shala Admissions', topicMr: 'शालेय शिक्षण व आश्रमशाळा प्रवेश', releases: 3, clippings: 9, flags: 0 },
  ];

  return (
    <div className="p-4 sm:p-5 max-w-[1780px] w-full mx-auto space-y-5">
      {/* 1. Core Switcher Header */}
      <CoreOperationalSwitchDeck currentActive="crisis" />

      {/* 2. Role Clearance Notice Banner */}
      <div
        className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
          isCollector
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : isOperator
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <MaterialIcon
            name={isCollector ? 'verified_user' : isOperator ? 'lock' : 'shield'}
            size="sm"
            className={isCollector ? 'text-emerald-700' : isOperator ? 'text-amber-700' : 'text-blue-700'}
          />
          <div>
            <span className="font-bold">
              {isCollector
                ? language === 'mr'
                  ? `अधिकारी स्तर: जिल्हा दंडाधिकारी व जिल्हाधिकारी (${localizedDistrict})`
                  : `Officer Clearance: District Magistrate & Collector (${currentUser?.district || 'Palghar'})`
                : isOperator
                ? language === 'mr'
                  ? `अधिकारी स्तर: जिल्हा माहिती अधिकारी ऑपरेटर (${localizedDistrict})`
                  : `Officer Clearance: DIO Operator (${currentUser?.district || 'Palghar Desk'})`
                : isAdmin
                ? language === 'mr'
                  ? 'अधिकारी स्तर: राज्य महासंचालक प्रशासक (राज्यव्यापी अधिकार)'
                  : 'Officer Clearance: State DG Admin (Statewide Clearance)'
                : language === 'mr'
                ? 'अधिकारी स्तर: विभागीय उपसंचालक'
                : 'Officer Clearance: Divisional Deputy Director'}
            </span>
            <p className="text-[11px] opacity-90 mt-0.5">
              {isCollector
                ? language === 'mr'
                  ? 'आपल्याकडे स्वाक्षरीचे अधिकार आहेत. आपल्या जिल्ह्यासाठी १-क्लिक अधिकृत खंडन मंजूरी सक्रिय आहे.'
                  : 'You hold signing authority. 1-click official rebuttal authorization is active for your district.'
                : isOperator
                ? language === 'mr'
                  ? 'आपण क्षेत्रीय छाननी व मसुदा मोडमध्ये काम करत आहात. अधिकृत खंडनासाठी जिल्हाधिकाऱ्यांची मान्यता आवश्यक आहे.'
                  : 'You are operating in Field Triage & Draft mode. Official rebuttal authorization requires Collector signature.'
                : language === 'mr'
                ? 'राज्यव्यापी कमांड नियंत्रण सक्रिय. स्थानिक जिल्हाधिकाऱ्यांनी मंजूर केलेली खंडने रिअल-टाइममध्ये नोंदवली जातात.'
                : 'Statewide command oversight active. Rebuttals authorized by local Collectors are indexed in real time.'}
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
          <span>
            {userRole === 'dg_admin'
              ? language === 'mr' ? 'राज्य स्तर १' : 'Clearance Tier 1'
              : userRole === 'director_konkan'
              ? language === 'mr' ? 'विभाग स्तर २' : 'Clearance Tier 2'
              : userRole === 'collector'
              ? language === 'mr' ? 'जिल्हा स्तर ३' : 'Clearance Tier 3'
              : language === 'mr' ? 'माहिती कक्ष स्तर ४' : 'Clearance Tier 4'}
          </span>
        </span>
      </div>

      {/* 3. Screen 3 Top Row: Pending Rumors with 4-Stage Stepper + Crisis Containment SLA Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Top Left (7 cols): Pending Rumors with 4-Stage Stepper & Live 90-min SLA Countdowns */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldExclamationIcon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {language === 'mr'
                    ? 'प्रलंबित अफवा • थेट ९०-मिनिट एसएलए काऊंटडाऊन'
                    : 'Pending Rumors · Live Countdown to 90-Minute SLA'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'mr'
                  ? '४-टप्पे जीवनचक्र: १. अफवा ओळखली ➔ २. जिल्हाधिकारी पडताळणी ➔ ३. जिल्हाधिकारी मंजुरी ➔ ४. खंडन प्रसिद्ध'
                  : '4-Stage Lifecycle: 1. Detected ➔ 2. Collectorate Verification ➔ 3. Collector Approval ➔ 4. Published'}
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
              3 Open Tickets
            </span>
          </div>

          <div className="space-y-4">
            {rumorSteppers.map((rumor) => {
              const isSelected = activeIncidentId === rumor.id;
              const formattedTime = formatHHMMSS(rumor.timeRemainingSec);

              return (
                <div
                  key={rumor.id}
                  onClick={() => setActiveIncidentId(rumor.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'border-rose-400 bg-rose-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-800">{rumor.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {language === 'mr' ? rumor.districtMr : rumor.district}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[11px] text-slate-500">
                        {language === 'mr' ? 'उर्वरित वेळ (९०-मि. लक्ष्य):' : 'SLA Time Remaining (90-Min Target):'}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                          rumor.urgency === 'AT RISK'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : rumor.urgency === 'WATCH'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                        {formattedTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    {language === 'mr' ? rumor.claimMr : rumor.claim}
                  </p>

                  {/* 4-Stage Visual Stepper */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {rumor.steps.map((st) => (
                      <div
                        key={st.num}
                        className={`p-2 rounded text-center border text-[10px] font-semibold transition-colors ${
                          st.status === 'DONE'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : st.status === 'IN PROGRESS'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {st.status === 'DONE' ? (
                            <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                          ) : st.status === 'IN PROGRESS' ? (
                            <ClockIcon className="w-3 h-3 text-amber-600 animate-pulse" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block" />
                          )}
                          <span>Step {st.num}</span>
                        </div>
                        <div className="truncate mt-0.5">
                          {language === 'mr' ? st.titleMr : st.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Right (5 cols): Crisis Containment SLA Gauge & 5-District Breakdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {language === 'mr'
                  ? 'संकट नियंत्रण एसएलए • कोकण विभाग (Q3 2026)'
                  : 'Crisis Containment SLA · Konkan (Q3 2026)'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'mr' ? 'एकूण विभाग यश: ९३.२%' : 'Overall Division Rate: 93.2%'}
              </p>
            </div>
            <span className="text-2xl font-black font-mono text-emerald-600">93.2%</span>
          </div>

          <div className="space-y-3">
            {containmentDistricts.map((cd) => (
              <div key={cd.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {language === 'mr' ? cd.nameMr : cd.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-slate-500">{cd.count}</span>
                    <span
                      className={`font-bold ${
                        cd.rate >= 95 ? 'text-emerald-700' : cd.rate >= 88 ? 'text-amber-700' : 'text-slate-700'
                      }`}
                    >
                      {cd.rate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cd.rate}%` }}
                    className={`h-full rounded-full ${
                      cd.rate >= 95 ? 'bg-emerald-500' : cd.rate >= 88 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">
              {language === 'mr' ? 'शासन निर्णय व एसएलए निर्देश:' : 'Government Resolution & SLA Directives:'}
            </div>
            <p>
              {language === 'mr'
                ? 'जिल्हाधिकारी मान्यता प्राप्त खंडन ९० मिनिटांच्या आत प्रकाशित करणे बंधनकारक आहे. ठाणे व सिंधुदुर्ग १००% निकषावर आहेत.'
                : 'Mandatory 90-minute SLA enforced across coastal districts. Collector sign-off triggers automated multi-wire dispatch.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Screen 3 Bottom 3-Column Split: Daily Activity Stream + Collector Action Console + Core Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Bottom Left (4 cols): Daily Activity Stream */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {language === 'mr' ? 'दैनंदिन माध्यम कृती प्रवाह (१३ ऑक्टो)' : 'Daily Activity Stream (13 Oct 2026)'}
            </h3>
            <span className="text-[11px] font-mono text-slate-500">5 Key Sectors</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2">{language === 'mr' ? 'विषय' : 'Topic Sector'}</th>
                  <th className="py-2 px-2 text-right">{language === 'mr' ? 'प्रसिद्धी' : 'Rel'}</th>
                  <th className="py-2 px-2 text-right">{language === 'mr' ? 'कात्रणे' : 'Clip'}</th>
                  <th className="py-2 px-2 text-right">{language === 'mr' ? 'अफवा' : 'Alert'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {dailyActivityTopics.map((top, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-2 font-medium">
                      {language === 'mr' ? top.topicMr : top.topic}
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-slate-700">{top.releases}</td>
                    <td className="py-2 px-2 text-right font-mono text-slate-600">{top.clippings}</td>
                    <td className="py-2 px-2 text-right font-mono">
                      {top.flags > 0 ? (
                        <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          {top.flags}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Middle (5 cols): Collector 1-Click Action Console */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HandThumbUpIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'mr'
                    ? 'जिल्हाधिकारी निर्णय मंच (१-क्लिक मंजुरी)'
                    : 'Collector Action Console (1-Click Decision)'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Active Ticket: <span className="font-mono font-bold text-slate-800">{activeIncidentId}</span>
              </p>
            </div>
            {canAuthorize ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Clearance Verified
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                <LockClosedIcon className="w-3 h-3" />
                Read-Only
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-slate-800">
                {language === 'mr' ? 'तपासणी निष्कर्ष व तयार खंडन मजकूर:' : 'Verified Finding & Draft Rebuttal:'}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? 'सार्वजनिक आरोग्य प्रयोगशाळा अहवाल #PH-2026-904 नुसार पाण्याचे नमुने १००% सुरक्षित आहेत. जनतेने अफवांवर विश्वास ठेवू नये.'
                  : 'Public Health Lab Report #PH-2026-904 verified 100% compliance. Official rebuttal draft ready for immediate multi-channel dispatch.'}
              </p>
            </div>

            {/* 3 Decision Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {/* Button 1: Authorize Rebuttal */}
              <button
                type="button"
                disabled={!canAuthorize || isSubmittingAction}
                onClick={() => handleCollectorAction('authorize')}
                className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                  canAuthorize
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
                title={canAuthorize ? 'Sign and dispatch rebuttal' : 'Collector clearance required'}
              >
                <CheckCircleIcon className="w-4 h-4 shrink-0" />
                <span>{language === 'mr' ? 'खंडन मंजूर करा' : 'Authorize Rebuttal'}</span>
              </button>

              {/* Button 2: Issue Press Advisory */}
              <button
                type="button"
                disabled={!canAuthorize || isSubmittingAction}
                onClick={() => handleCollectorAction('issue_advisory')}
                className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                  canAuthorize
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <MegaphoneIcon className="w-4 h-4 shrink-0" />
                <span>{language === 'mr' ? 'माध्यम सूचना' : 'Issue Advisory'}</span>
              </button>

              {/* Button 3: Return to DIO for edits */}
              <button
                type="button"
                disabled={!canAuthorize || isSubmittingAction}
                onClick={() => handleCollectorAction('request_edits')}
                className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                  canAuthorize
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <ArrowUturnLeftIcon className="w-4 h-4 shrink-0" />
                <span>{language === 'mr' ? 'सुधारणा पाठवा' : 'Request Edits'}</span>
              </button>
            </div>

            {!canAuthorize && (
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                <ExclamationCircleIcon className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Awaiting Collector Approval · Operator Clearance Insufficient</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right (3 cols): Core Benchmarks */}
        <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {language === 'mr' ? 'मुख्य एसएलए निकष' : 'Core Benchmarks'}
            </h3>
            <span className="text-[11px] font-mono text-emerald-600 font-bold">State SLA</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Max Rebuttal SLA</span>
              <span className="font-mono font-bold text-slate-900">90 mins</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Lab Cross-Verification</span>
              <span className="font-mono font-bold text-emerald-700">100% MET</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Multi-Channel Relay</span>
              <span className="font-mono font-bold text-blue-700">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Pending Resolution</span>
              <span className="font-mono font-bold text-rose-700">3 Open</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Complete Emergency Alert Incident Archive & Triage Desk */}
      <EmergencyAlert />
    </div>
  );
};

export default CrisisScreen;
