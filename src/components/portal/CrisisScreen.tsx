'use client';

import React from 'react';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';

export const CrisisScreen: React.FC = () => {
  const { incidents, userRole, currentUser, language } = useDashboardStore();

  const isCollector = userRole === 'collector';
  const isOperator = userRole === 'dio_desk';
  const isAdmin = userRole === 'dg_admin';

  const localizedDistrict = getDistrictName(currentUser?.district || 'Palghar', language);

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <MaterialIcon name="gpp_bad" size="sm" className="text-red-700" />
          <span>
            {language === 'mr'
              ? 'आपत्कालीन वाढ व अफवा तत्पर प्रतिसाद कक्ष'
              : 'Crisis Escalation & Misinformation Rapid Response Desk'}
          </span>
        </h2>
        <p className="text-xs text-content-muted">
          {language === 'mr'
            ? 'अनिवार्य ९०-मिनिट एसएलए अफवा खंडन, जिल्हाधिकारी पडताळणी आणि सोशल अलर्ट उपायांची अंमलबजावणी'
            : 'Mandatory 90-Minute SLA Rumor Refutation, Collector Verification & Social Alert Countermeasures'}
        </p>
      </div>

      {/* Role Clearance Notice Banner */}
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

      {/* SLA Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] text-content-muted font-medium">
              {language === 'mr' ? '९०-मिनिट आपत्कालीन एसएलए' : '90-Minute Crisis SLA'}
            </div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">94.2%</div>
            <div className="text-[10px] text-emerald-800 font-medium mt-1">
              {language === 'mr' ? 'लक्ष्यांतर्गत' : 'Within Target'}
            </div>
          </div>
          <MaterialIcon name="schedule" size="md" className="text-slate-500" />
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] text-content-muted font-medium">
              {language === 'mr' ? 'सक्रिय घटना' : 'Active Incidents'}
            </div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">{incidents.length}</div>
            <div className="text-[10px] text-amber-800 font-medium mt-1">
              {isOperator
                ? language === 'mr'
                  ? `${localizedDistrict} स्थानिक घटना`
                  : `Local ${currentUser?.district || 'Palghar'} Incidents`
                : language === 'mr'
                ? 'छाननी अंतर्गत'
                : 'In Triage'}
            </div>
          </div>
          <MaterialIcon name="warning" size="md" className="text-slate-500" />
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] text-content-muted font-medium">
              {language === 'mr' ? 'अधिकृत खंडने' : 'Authorized Rebuttals'}
            </div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">
              {incidents.filter((i) => i.authorized).length + 28}
            </div>
            <div className="text-[10px] text-emerald-800 font-medium mt-1">
              {language === 'mr' ? 'माध्यमांकडे पाठवले' : 'Dispatched to Media'}
            </div>
          </div>
          <MaterialIcon name="check_circle" size="md" className="text-slate-500" />
        </div>
      </div>

      {/* Main Emergency Alert Component */}
      <EmergencyAlert />
    </div>
  );
};
