'use client';

import React from 'react';
import { DistrictData } from '@/types/dashboard';

interface DistrictTableProps {
  districts: DistrictData[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const DistrictTable: React.FC<DistrictTableProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
}) => {
  return (
    <div className="overflow-x-auto border border-borderLine-subtle rounded">
      <table className="w-full text-left text-xs">
        <thead className="bg-surface-secondary text-content-secondary border-b border-borderLine-subtle font-medium">
          <tr>
            <th className="py-2.5 px-3 w-8">#</th>
            <th className="py-2.5 px-3">District</th>
            <th className="py-2.5 px-3">Division</th>
            <th className="py-2.5 px-3 text-right">Releases</th>
            <th className="py-2.5 px-3 text-right">Avg. TAT</th>
            <th className="py-2.5 px-3 text-right">Sentiment</th>
            <th className="py-2.5 px-3 text-right">Crisis SLA</th>
            <th className="py-2.5 px-3 text-right font-semibold">CPI</th>
            <th className="py-2.5 px-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderLine-subtle text-content-primary">
          {districts.map((d) => {
            const isSelected = d.id === selectedDistrictId;
            return (
              <tr
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-surface-selected font-medium'
                    : 'hover:bg-surface-secondary'
                }`}
              >
                <td className="py-2.5 px-3 font-mono text-content-muted">{d.rank}</td>
                <td className="py-2.5 px-3 font-semibold">{d.name}</td>
                <td className="py-2.5 px-3 text-content-secondary">{d.division}</td>
                <td className="py-2.5 px-3 text-right font-mono">{d.releases}</td>
                <td className="py-2.5 px-3 text-right font-mono">{d.avgTAT}m</td>
                <td className="py-2.5 px-3 text-right font-mono">{d.sentiment}%</td>
                <td className="py-2.5 px-3 text-right font-mono">{d.crisisSLA}%</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold">{d.cpi}</td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDistrict(d.id);
                    }}
                    className="px-2.5 py-1 text-[11px] bg-action-primary text-content-inverse rounded hover:bg-action-primary-hover transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
