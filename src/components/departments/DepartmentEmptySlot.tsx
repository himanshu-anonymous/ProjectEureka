'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface ArchivalDocument {
  id: string;
  departmentId: string;
  title: string;
  category: 'Government Resolution' | 'Gazette Notification' | 'Circular' | 'Directive';
  refNo: string;
  date: string;
  size: string;
  clearance: 'Official Public' | 'Departmental Restricted' | 'Urgent Executive';
}

const DEFAULT_DOCUMENTS: ArchivalDocument[] = [
  {
    id: 'doc-1',
    departmentId: 'agriculture',
    title: 'Kisan Samman Direct Benefit Transfer Implementation Guidelines 2026-27',
    category: 'Government Resolution',
    refNo: 'GR-AGRI-2026/0411',
    date: '12 Oct 2026',
    size: '2.4 MB',
    clearance: 'Official Public',
  },
  {
    id: 'doc-2',
    departmentId: 'agriculture',
    title: 'Maharashtra State Organic Farming Accreditation Gazette Notification',
    category: 'Gazette Notification',
    refNo: 'GAZ-EXT-8821/26',
    date: '08 Oct 2026',
    size: '4.8 MB',
    clearance: 'Official Public',
  },
  {
    id: 'doc-3',
    departmentId: 'health',
    title: 'Ayushman Maharashtra Public Health Infrastructure Modernization Scheme',
    category: 'Government Resolution',
    refNo: 'GR-MED-2026/0192',
    date: '10 Oct 2026',
    size: '3.1 MB',
    clearance: 'Official Public',
  },
  {
    id: 'doc-4',
    departmentId: 'health',
    title: 'Monsoon Communicable Disease Surveillance Protocol & Emergency Buffer Stock',
    category: 'Circular',
    refNo: 'CIRC-HLTH-2026/088',
    date: '04 Oct 2026',
    size: '1.2 MB',
    clearance: 'Departmental Restricted',
  },
  {
    id: 'doc-5',
    departmentId: 'education',
    title: 'Adoption of Smart Classroom AI Tutoring Systems in Zilla Parishad Schools',
    category: 'Government Resolution',
    refNo: 'GR-EDU-2026/0339',
    date: '11 Oct 2026',
    size: '5.2 MB',
    clearance: 'Official Public',
  },
  {
    id: 'doc-6',
    departmentId: 'infrastructure',
    title: 'Samruddhi Expressway Corridor Smart Freight Logistics Zone Notification',
    category: 'Gazette Notification',
    refNo: 'GAZ-MSRDC-2026/112',
    date: '09 Oct 2026',
    size: '6.4 MB',
    clearance: 'Official Public',
  },
  {
    id: 'doc-7',
    departmentId: 'revenue',
    title: 'Digital 7/12 Land Records Blockchain Integration Directive',
    category: 'Directive',
    refNo: 'DIR-REV-2026/0014',
    date: '07 Oct 2026',
    size: '1.9 MB',
    clearance: 'Urgent Executive',
  },
];

export const DepartmentEmptySlot: React.FC = () => {
  const { selectedDepartmentId } = useDashboardStore();
  const [documents, setDocuments] = useState<ArchivalDocument[]>(DEFAULT_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRefNo, setNewRefNo] = useState('');
  const [newCategory, setNewCategory] = useState<ArchivalDocument['category']>('Government Resolution');
  const [newClearance, setNewClearance] = useState<ArchivalDocument['clearance']>('Official Public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDept =
    DEPARTMENTS_DATA.find((d) => d.id === selectedDepartmentId) || DEPARTMENTS_DATA[0];

  const filteredDocs = documents.filter((doc) => {
    const matchesDept = doc.departmentId === selectedDept.id || doc.departmentId === 'all';
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.refNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesCategory && matchesSearch;
  });

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedId(id);
      setTimeout(() => setDownloadedId(null), 2500);
    }, 600);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created: ArchivalDocument = {
        id: `doc-${Date.now()}`,
        departmentId: selectedDept.id,
        title: newTitle.trim(),
        category: newCategory,
        refNo: newRefNo.trim() || `GR-${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        date: 'Today, Just now',
        size: '1.8 MB',
        clearance: newClearance,
      };

      setDocuments((prev) => [created, ...prev]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setNewTitle('');
      setNewRefNo('');
      setFeedbackMsg(`Document "${created.refNo}" successfully archived.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }, 600);
  };

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name="inventory_2" size="sm" className="text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">
            Gazette & Resolution Archival Vault
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-surface-secondary text-content-secondary rounded border border-borderLine-subtle">
            {selectedDept.name}
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 bg-action-primary text-content-inverse rounded text-[11px] font-medium hover:bg-action-primary-hover transition-colors shadow-xs cursor-pointer"
          >
            <MaterialIcon name="add" size="xs" />
            <span>Archive Document</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs flex items-center gap-2">
          <MaterialIcon name="fact_check" size="xs" className="text-emerald-700 shrink-0" />
          <span className="font-medium">{feedbackMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-[11px]">
          {['All', 'Government Resolution', 'Gazette Notification', 'Circular'].map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition-colors font-medium border cursor-pointer ${
                activeCategory === cat
                  ? 'bg-action-primary text-content-inverse border-action-primary'
                  : 'bg-surface-secondary text-content-secondary border-borderLine-subtle hover:text-content-primary'
              }`}
            >
              {cat === 'Government Resolution' ? 'GRs' : cat === 'Gazette Notification' ? 'Gazettes' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-48">
          <MaterialIcon name="search" size="xs" className="absolute left-2 top-2 text-content-muted" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1 text-[11px] border border-borderLine-standard rounded bg-surface text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-borderLine-strong"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded max-h-72 overflow-y-auto">
        {filteredDocs.length === 0 ? (
          <div className="p-6 text-center text-xs text-content-muted flex flex-col items-center justify-center space-y-1">
            <MaterialIcon name="description" size="lg" className="text-content-muted/60" />
            <p className="font-medium">No matching archived documents found.</p>
            <p className="text-[11px]">Try adjusting your search query or filter criteria.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-2.5 flex items-center justify-between hover:bg-surface-secondary/70 transition-colors text-xs gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-content-primary px-1.5 py-0.2 bg-surface-secondary border border-borderLine-subtle rounded">
                    {doc.refNo}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded border border-borderLine-subtle text-content-secondary bg-surface">
                    {doc.category}
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-surface-secondary text-content-muted">
                    {doc.clearance}
                  </span>
                </div>
                <p className="font-medium text-content-primary text-xs leading-snug line-clamp-1">
                  {doc.title}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-content-muted font-mono">
                  <span className="flex items-center gap-1">
                    <MaterialIcon name="calendar_today" size="xs" />
                    <span>{doc.date}</span>
                  </span>
                  <span>{doc.size}</span>
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <MaterialIcon name="verified_user" size="xs" />
                    <span>Digitally Signed</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(doc.id)}
                disabled={downloadingId === doc.id}
                className={`p-1.5 border rounded transition-colors flex items-center gap-1 text-[11px] shrink-0 cursor-pointer ${
                  downloadedId === doc.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-borderLine-standard hover:bg-surface-selected text-content-primary'
                }`}
                title="Download Official Record"
                aria-label={`Download ${doc.title}`}
              >
                {downloadingId === doc.id ? (
                  <MaterialIcon name="progress_activity" size="xs" spin={true} />
                ) : downloadedId === doc.id ? (
                  <>
                    <MaterialIcon name="check" size="xs" className="text-emerald-700" />
                    <span className="text-[10px] font-medium hidden sm:inline">Downloaded</span>
                  </>
                ) : (
                  <MaterialIcon name="download" size="xs" />
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog for Uploading GR / Gazette */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="bg-surface border border-borderLine-strong rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-borderLine-subtle bg-surface-secondary">
              <div className="flex items-center gap-2">
                <MaterialIcon name="inventory_2" size="sm" className="text-content-primary" />
                <h3 id="archive-modal-title" className="text-xs font-bold text-content-primary">
                  Attach Official Gazette / GR Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-content-muted hover:text-content-primary transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-content-primary block text-[11px]">
                  Document Subject / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanction of Irrigation Scheme Phase-II..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-borderLine-standard rounded bg-surface text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-borderLine-strong text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-content-primary block text-[11px]">
                    Reference / File No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GR-2026/781"
                    value={newRefNo}
                    onChange={(e) => setNewRefNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-borderLine-standard rounded bg-surface text-content-primary font-mono text-xs placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-borderLine-strong"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-content-primary block text-[11px]">
                    Document Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ArchivalDocument['category'])}
                    className="w-full px-2.5 py-1.5 border border-borderLine-standard rounded bg-surface text-content-primary text-xs focus:outline-none focus:ring-1 focus:ring-borderLine-strong"
                  >
                    <option value="Government Resolution">Government Resolution (GR)</option>
                    <option value="Gazette Notification">Gazette Notification</option>
                    <option value="Circular">Departmental Circular</option>
                    <option value="Directive">Cabinet Directive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-content-primary block text-[11px]">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedDept.name}
                    className="w-full px-2.5 py-1.5 border border-borderLine-subtle rounded bg-surface-secondary text-content-secondary text-xs font-mono cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-content-primary block text-[11px]">
                    Clearance Tier
                  </label>
                  <select
                    value={newClearance}
                    onChange={(e) => setNewClearance(e.target.value as ArchivalDocument['clearance'])}
                    className="w-full px-2.5 py-1.5 border border-borderLine-standard rounded bg-surface text-content-primary text-xs focus:outline-none focus:ring-1 focus:ring-borderLine-strong"
                  >
                    <option value="Official Public">Official Public</option>
                    <option value="Departmental Restricted">Departmental Restricted</option>
                    <option value="Urgent Executive">Urgent Executive</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone Preview */}
              <div className="border-2 border-dashed border-borderLine-standard rounded p-3 text-center bg-surface-secondary/40 flex flex-col items-center justify-center space-y-1">
                <MaterialIcon name="cloud_upload" size="md" className="text-content-muted" />
                <span className="text-[11px] font-medium text-content-primary">
                  Attach Signed PDF / Scanned Gazette
                </span>
                <span className="text-[10px] text-content-muted">
                  Max file size: 25 MB (Digital Signature verification required)
                </span>
              </div>

              <div className="pt-2 border-t border-borderLine-subtle flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-borderLine-standard rounded text-content-primary hover:bg-surface-secondary transition-colors text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-action-primary text-content-inverse rounded text-xs font-medium hover:bg-action-primary-hover disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <MaterialIcon name="progress_activity" size="xs" spin={true} />
                      <span>Archiving...</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="fact_check" size="xs" />
                      <span>Verify & Archive</span>
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
