'use client';

import React, { useState } from 'react';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  getLocalizedDepartment,
  getLocalizedPressReleaseTitle,
  getLocalizedStatus,
} from '@/lib/dataLocalization';

type ReleaseFilter = 'All' | 'Published' | 'Under Review' | 'Draft';

interface PressReleaseItem {
  id: string;
  title: string;
  department: string;
  date: string;
  status: 'Published' | 'Under Review' | 'Draft';
  downloads: number;
  district?: string;
  tatMinutes?: number;
}

export const PressReleasesScreen: React.FC = () => {
  const { language, userRole } = useDashboardStore();
  const [filter, setFilter] = useState<ReleaseFilter>('All');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // Draft form state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDept, setDraftDept] = useState('Agriculture Department');
  const [draftContent, setDraftContent] = useState('');
  const [draftSubmitted, setDraftSubmitted] = useState(false);

  const initialReleases: PressReleaseItem[] = DEPARTMENTS_DATA.flatMap((d) =>
    d.pressReleases.map((pr) => ({
      ...pr,
      department: d.name,
      district: pr.district || 'State HQ',
      tatMinutes: pr.tatMinutes || 30,
    }))
  );

  const [releasesList, setReleasesList] = useState<PressReleaseItem[]>(initialReleases);

  const isLeadershipRole = userRole === 'dg_admin' || userRole === 'director_konkan';

  const filtered = releasesList.filter((pr) => {
    const matchesFilter = filter === 'All' || pr.status === filter;
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase()) ||
      (pr.district && pr.district.toLowerCase().includes(search.toLowerCase())) ||
      pr.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: ReleaseFilter[] = ['All', 'Published', 'Under Review', 'Draft'];

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Increment download counter
      setReleasesList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))
      );
    }, 1200);
  };

  const handleApprove = (id: string) => {
    setReleasesList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Published' as const } : r))
    );
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    const newRelease: PressReleaseItem = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: draftTitle,
      department: draftDept,
      date: language === 'mr' ? 'आज, १४:४०' : 'Today, 14:40 IST',
      status: 'Under Review',
      downloads: 0,
    };

    setReleasesList([newRelease, ...releasesList]);
    setDraftSubmitted(true);
    setTimeout(() => {
      setDraftSubmitted(false);
      setIsDraftModalOpen(false);
      setDraftTitle('');
      setDraftContent('');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="description" size="md" className="text-gov-primary" />
            <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
              {language === 'mr' ? 'राज्य प्रसिद्धीपत्रक वितरण प्रणाली' : 'State Press Release Distribution Pipeline'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'अधिकृत प्रसिद्धीपत्रके, मंत्रालयीन माहिती आणि अधिकृत माध्यम फीड'
              : 'Official Press Notes, Ministerial Dispatches & Accredited Media Feeds'}
          </p>
        </div>

        <button
          onClick={() => setIsDraftModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary text-white rounded text-xs font-semibold hover:bg-gov-primary-dark transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <MaterialIcon name="add" size="xs" className="text-amber-400" />
          <span>
            {isLeadershipRole
              ? (language === 'mr' ? 'राज्य निर्देश / प्रसिद्धी टिपण जारी करा' : 'Issue State Directive / Press Note')
              : (language === 'mr' ? '+ नवीन स्थानिक प्रसिद्धीपत्रक मसुदा' : '+ Draft Local Press Release')}
          </span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-surface border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab
                  ? 'bg-gov-primary text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'All'
                ? (language === 'mr' ? 'सर्व' : 'All')
                : getLocalizedStatus(tab, language)}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <MaterialIcon name="search" size="xs" className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={language === 'mr' ? 'शीर्षक, विभाग किंवा आयडीने शोधा...' : 'Search by title, dept, or ID...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-gov-blue text-slate-800"
          />
        </div>
      </div>

      {/* Releases Table */}
      <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक नोंदवही' : 'Official Dispatches Ledger'}
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {language === 'mr' ? `${filtered.length} प्रसिद्धीपत्रके उपलब्ध` : `${filtered.length} Dispatches Listed`}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <MaterialIcon name="description" size="xl" className="text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              {language === 'mr' ? 'कोणतीही प्रसिद्धीपत्रके जुळत नाहीत' : 'No press releases match your filter'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'mr'
                ? 'कृपया शोध शब्द तपासा किंवा सर्व प्रसिद्धीपत्रके निवडा.'
                : 'Try adjusting your search query or switching to All dispatches.'}
            </p>
            <button
              onClick={() => {
                setFilter('All');
                setSearch('');
              }}
              className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
            >
              {language === 'mr' ? 'फिल्टर पूर्ववत करा' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'पीआर आयडी' : 'PR ID'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'शीर्षक व विषय' : 'Title & Subject'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'विभाग' : 'Department'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'जिल्हा' : 'District'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'दिनांक' : 'Release Date'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'प्रकाशन वेळ' : 'Publish TAT'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'डाउनलोड्स' : 'Downloads'}</th>
                  <th className="py-2.5 px-3 text-center">{language === 'mr' ? 'कृती' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map((pr) => {
                  let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (pr.status === 'Published') {
                    badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                  } else if (pr.status === 'Under Review') {
                    badgeClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                  }

                  const isDownloading = downloadingId === pr.id;
                  const localizedTitle = getLocalizedPressReleaseTitle(pr.id, pr.title, language);
                  const localizedDept = getLocalizedDepartment(pr.department, language);

                  return (
                    <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{pr.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-md">{localizedTitle}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{localizedDept}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{pr.district || 'State HQ'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{pr.date}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-700">{pr.tatMinutes || 30}m</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] border ${badgeClass}`}>
                          {getLocalizedStatus(pr.status, language)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">{pr.downloads}</td>
                      <td className="py-2.5 px-3 text-center">
                        {pr.status === 'Under Review' ? (
                          isLeadershipRole ? (
                            <button
                              onClick={() => handleApprove(pr.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border border-amber-300 bg-amber-50 text-amber-800 rounded font-semibold hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                              title="Review and approve draft dispatch"
                            >
                              <MaterialIcon name="verified_user" size="xs" className="text-amber-600" />
                              <span>{language === 'mr' ? 'पुनरावलोकन व मंजुरी' : 'Review & Approve'}</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border border-slate-200 bg-slate-100 text-slate-500 rounded font-medium">
                              <MaterialIcon name="schedule" size="xs" className="text-slate-400" />
                              <span>{language === 'mr' ? 'मंजुरी प्रलंबित' : 'Pending Approval'}</span>
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => handleDownload(pr.id)}
                            disabled={isDownloading}
                            aria-label={`Download PDF for ${localizedTitle}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border rounded transition-colors shadow-2xs cursor-pointer ${
                              isDownloading
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <MaterialIcon name="check" size="xs" className="text-emerald-600" />
                                <span>{language === 'mr' ? 'डाउनलोड केले' : 'Downloaded'}</span>
                              </>
                            ) : (
                              <>
                                <MaterialIcon name="download" size="xs" className="text-slate-500" />
                                <span>{language === 'mr' ? 'पीडीएफ डाउनलोड' : 'Download PDF'}</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drafting Modal */}
      {isDraftModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक मसुदा तयार करा' : 'Draft Official Press Release'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 transition-opacity duration-150 ease-out"
        >
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-5 space-y-4 shadow-xl transition-all duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <MaterialIcon name="description" size="sm" className="text-gov-primary" />
                <h3 className="text-sm font-bold text-gov-primary">
                  {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक मसुदा तयार करा' : 'Draft Official Press Release'}
                </h3>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'प्रसिद्धीपत्रक शीर्षक / विषय' : 'Release Headline / Subject'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    language === 'mr'
                      ? 'उदा. राज्य मंत्रिमंडळ बैठकीत महत्वपूर्ण निर्णयांना मंजुरी...'
                      : 'e.g. State cabinet approves key infrastructure initiatives...'
                  }
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'संबंधित विभाग' : 'Originating Department'}
                </label>
                <select
                  value={draftDept}
                  onChange={(e) => setDraftDept(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue cursor-pointer"
                >
                  <option value="Agriculture Department">
                    {language === 'mr' ? 'कृषी विभाग' : 'Agriculture Department'}
                  </option>
                  <option value="Public Health Department">
                    {language === 'mr' ? 'सार्वजनिक आरोग्य विभाग' : 'Public Health Department'}
                  </option>
                  <option value="Home Department">
                    {language === 'mr' ? 'गृह विभाग' : 'Home Department'}
                  </option>
                  <option value="Revenue & Forest Department">
                    {language === 'mr' ? 'महसूल व वन विभाग' : 'Revenue & Forest Department'}
                  </option>
                  <option value="CMO Press Wing">
                    {language === 'mr' ? 'मुख्यमंत्री कार्यालय कक्ष' : 'CMO Press Wing'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'संक्षिप्त प्रसिद्धीपत्रक सारांश' : 'Brief Dispatch Summary'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    language === 'mr'
                      ? 'तपशीलवार प्रसिद्धीपत्रक किंवा घोषणा सारांश प्रविष्ट करा...'
                      : 'Enter detailed press notes or gazette summary...'
                  }
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={draftSubmitted}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                    draftSubmitted
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gov-primary hover:bg-gov-primary-dark text-white'
                  }`}
                >
                  {draftSubmitted ? (
                    <>
                      <MaterialIcon name="check" size="xs" />
                      <span>{language === 'mr' ? 'पुनरावलोकनासाठी सादर' : 'Submitted for Review'}</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="send" size="xs" />
                      <span>{language === 'mr' ? 'संपादकीय पुनरावलोकनासाठी पाठवा' : 'Submit for Editorial Review'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
