'use client';

import React, { useState } from 'react';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { FileText, Plus, Search } from 'lucide-react';

type ReleaseFilter = 'All' | 'Published' | 'Under Review' | 'Draft';

export const PressReleasesScreen: React.FC = () => {
  const [filter, setFilter] = useState<ReleaseFilter>('All');
  const [search, setSearch] = useState('');

  const allReleases = DEPARTMENTS_DATA.flatMap((d) =>
    d.pressReleases.map((pr) => ({ ...pr, department: d.name }))
  );

  const filtered = allReleases.filter((pr) => {
    const matchesFilter = filter === 'All' || pr.status === filter;
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: ReleaseFilter[] = ['All', 'Published', 'Under Review', 'Draft'];

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>State Press Release Distribution Pipeline</span>
          </h2>
          <p className="text-xs text-content-muted">
            Bilingual Marathi/English Press Notes, Ministerial Dispatches & Accredited Media Feeds
          </p>
        </div>

        <button
          onClick={() => alert('Opening Press Release Drafting Studio')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-action-primary text-content-inverse rounded text-xs font-semibold hover:bg-action-primary-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft New Press Release</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-surface border border-borderLine-standard rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                filter === tab
                  ? 'bg-action-primary text-content-inverse'
                  : 'bg-surface-secondary text-content-secondary hover:text-content-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-content-muted" />
          <input
            type="text"
            placeholder="Search title or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-borderLine-standard rounded text-xs bg-surface focus:outline-none focus:border-borderLine-strong"
          />
        </div>
      </div>

      {/* Releases Table */}
      <div className="bg-surface border border-borderLine-standard rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-content-secondary border-b border-borderLine-subtle font-medium">
              <tr>
                <th className="py-2.5 px-3">PR ID</th>
                <th className="py-2.5 px-3">Title & Summary</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Release Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Downloads</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLine-subtle text-content-primary">
              {filtered.map((pr) => (
                <tr key={pr.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="py-2.5 px-3 font-mono text-content-muted">{pr.id}</td>
                  <td className="py-2.5 px-3 font-semibold max-w-md">{pr.title}</td>
                  <td className="py-2.5 px-3 text-content-secondary">{pr.department}</td>
                  <td className="py-2.5 px-3 font-mono text-content-muted">{pr.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold border border-borderLine-standard bg-surface-secondary">
                      {pr.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">{pr.downloads}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => alert(`Downloading release ${pr.id}`)}
                      className="px-2 py-1 text-[11px] border border-borderLine-standard rounded hover:bg-surface-secondary"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
