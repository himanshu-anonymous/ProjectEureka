'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface ComponentProps {
  [key: string]: any;
}

// 1. Stack Component
export const Stack: React.FC<{
  direction?: 'vertical' | 'horizontal';
  children: React.ReactNode;
  className?: string;
}> = ({ direction = 'vertical', children, className = '' }) => {
  return (
    <div
      className={`flex ${
        direction === 'horizontal' ? 'flex-row gap-3 flex-wrap' : 'flex-col gap-3'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// 2. KpiCard Component with "Explain this number"
export const KpiCard: React.FC<{
  title: string;
  value: string | number;
  unit?: string;
  delta?: number;
  status?: 'positive' | 'negative' | 'neutral' | 'critical';
  caption?: string;
  onExplain?: () => void;
}> = ({ title, value, unit, delta, status = 'neutral', caption, onExplain }) => {
  const statusStyles = {
    positive: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
    negative: 'border-rose-200 bg-rose-50/50 text-rose-900',
    critical: 'border-red-300 bg-red-100/60 text-red-950 font-bold',
    neutral: 'border-slate-200 bg-white text-slate-800',
  }[status];

  return (
    <div className={`p-4 rounded-xl border shadow-sm transition-all flex flex-col justify-between ${statusStyles}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{title}</span>
        {onExplain && (
          <button
            onClick={onExplain}
            title="Explain this number"
            className="text-slate-400 hover:text-amber-600 p-1 rounded transition-colors text-xs flex items-center gap-0.5"
            aria-label={`Explain value for ${title}`}
          >
            <MaterialIcon name="description" size="xs" />
          </button>
        )}
      </div>

      <div className="my-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-black tracking-tight">{value}</span>
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        {caption && <span>{caption}</span>}
        {delta !== undefined && (
          <span className={`font-semibold flex items-center gap-0.5 ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            <MaterialIcon name={delta >= 0 ? 'trending_up' : 'trending_down'} size="xs" />
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  );
};

// 3. DataTable Component
export const DataTable: React.FC<{
  columns: string | string[];
  rows: string | Array<Record<string, any>>;
  caption?: string;
}> = ({ columns, rows, caption }) => {
  const colList = Array.isArray(columns) ? columns : typeof columns === 'string' ? columns.split(',').map((c) => c.trim()) : [];
  let rowList: Array<Record<string, any>> = [];
  if (Array.isArray(rows)) {
    rowList = rows;
  } else if (typeof rows === 'string') {
    try {
      rowList = JSON.parse(rows);
    } catch {
      rowList = [];
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm my-2">
      {caption && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
          {caption}
        </div>
      )}
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
        <thead className="bg-slate-100/75 text-slate-700 font-semibold uppercase tracking-wider">
          <tr>
            {colList.map((col, idx) => (
              <th key={idx} scope="col" className="px-3 py-2.5">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {rowList.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-50'}>
              {colList.map((col, cIdx) => (
                <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                  {row[col] !== undefined ? String(row[col]) : row[Object.keys(row)[cIdx]] !== undefined ? String(row[Object.keys(row)[cIdx]]) : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 4. BarChart Component with "View as Table" toggle
export const BarChart: React.FC<{
  title: string;
  xKey?: string;
  yKey?: string;
  categories?: string | string[];
  values?: string | number[];
  series?: Array<{ name: string; data: number[] }>;
  data?: string | Array<Record<string, any>>;
  children?: React.ReactNode;
  onExplain?: () => void;
}> = ({ title, xKey = 'x', yKey = 'y', categories, values, series, data, children, onExplain }) => {
  const [viewAsTable, setViewAsTable] = useState(false);

  let chartData: Array<Record<string, any>> = [];

  // Parse categories & values or series if provided
  if (categories && values) {
    const catList = Array.isArray(categories) ? categories : typeof categories === 'string' ? categories.split(',').map((c) => c.trim()) : [];
    let valList: number[] = [];
    if (Array.isArray(values)) {
      valList = values.map(Number);
    } else if (typeof values === 'string') {
      try {
        valList = JSON.parse(values).map(Number);
      } catch {
        valList = values.split(',').map((v) => Number(v.trim()) || 0);
      }
    }
    chartData = catList.map((cat, i) => ({
      [xKey]: cat,
      [yKey]: valList[i] ?? 0,
    }));
  } else if (categories && series && series.length > 0) {
    const catList = Array.isArray(categories) ? categories : [];
    const s0 = series[0];
    chartData = catList.map((cat, i) => ({
      [xKey]: cat,
      [yKey]: s0.data?.[i] ?? 0,
      seriesName: s0.name,
    }));
  } else if (Array.isArray(data)) {
    chartData = data;
  } else if (typeof data === 'string') {
    try {
      chartData = JSON.parse(data);
    } catch {
      chartData = [];
    }
  }

  const maxVal = Math.max(...chartData.map((d) => Number(d[yKey]) || 0), 100);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm my-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <MaterialIcon name="bar_chart" size="sm" className="text-amber-600" />
          <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {onExplain && (
            <button
              onClick={onExplain}
              className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 border rounded px-2 py-0.5"
            >
              <MaterialIcon name="description" size="xs" /> Explain
            </button>
          )}
          <button
            onClick={() => setViewAsTable(!viewAsTable)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <MaterialIcon name={viewAsTable ? 'bar_chart' : 'checklist'} size="xs" />
            {viewAsTable ? 'View Chart' : 'View as Table'}
          </button>
        </div>
      </div>

      {viewAsTable ? (
        <DataTable
          columns={[xKey, yKey]}
          rows={chartData}
          caption={`${title} (Table View)`}
        />
      ) : (
        <div className="space-y-2 py-2">
          {chartData.map((d, idx) => {
            const val = Number(d[yKey]) || 0;
            const pct = Math.min(100, Math.round((val / maxVal) * 100));
            return (
              <div key={idx} className="space-y-0.5 text-xs">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>{String(d[xKey] || '')}</span>
                  <span className="font-bold text-slate-900">{val}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {children && <div className="mt-2 text-xs text-slate-600 border-t border-slate-50 pt-2">{children}</div>}
    </div>
  );
};

// 5. LineChart Component with "View as Table" toggle & SVG curve
export const LineChart: React.FC<{
  title: string;
  xKey?: string;
  yKey?: string;
  categories?: string | string[];
  values?: string | number[];
  series?: Array<{ name: string; data: number[] }>;
  data?: string | Array<Record<string, any>>;
  children?: React.ReactNode;
  onExplain?: () => void;
}> = ({ title, xKey = 'day', yKey = 'value', categories, values, series, data, children, onExplain }) => {
  const [viewAsTable, setViewAsTable] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  let chartData: Array<Record<string, any>> = [];

  if (categories && values) {
    const catList = Array.isArray(categories) ? categories : typeof categories === 'string' ? categories.split(',').map((c) => c.trim()) : [];
    let valList: number[] = [];
    if (Array.isArray(values)) {
      valList = values.map(Number);
    } else if (typeof values === 'string') {
      try {
        valList = JSON.parse(values).map(Number);
      } catch {
        valList = values.split(',').map((v) => Number(v.trim()) || 0);
      }
    }
    chartData = catList.map((cat, i) => ({
      [xKey]: cat,
      [yKey]: valList[i] ?? 0,
    }));
  } else if (categories && series && series.length > 0) {
    const catList = Array.isArray(categories) ? categories : [];
    const s0 = series[0];
    chartData = catList.map((cat, i) => ({
      [xKey]: cat,
      [yKey]: s0.data?.[i] ?? 0,
      seriesName: s0.name,
    }));
  } else if (Array.isArray(data)) {
    chartData = data;
  } else if (typeof data === 'string') {
    try {
      chartData = JSON.parse(data);
    } catch {
      chartData = [];
    }
  }

  const valuesArr = chartData.map((d) => Number(d[yKey]) || 0);
  const minVal = Math.min(0, ...valuesArr);
  const maxVal = Math.max(10, ...valuesArr);
  const range = maxVal - minVal || 1;

  const svgWidth = 360;
  const svgHeight = 120;
  const paddingX = 24;
  const paddingY = 16;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const points = chartData.map((d, idx) => {
    const x = paddingX + (chartData.length > 1 ? (idx / (chartData.length - 1)) * usableWidth : usableWidth / 2);
    const val = Number(d[yKey]) || 0;
    const y = paddingY + usableHeight - ((val - minVal) / range) * usableHeight;
    return { x, y, val, label: String(d[xKey] || '') };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(svgHeight - paddingY).toFixed(1)} L ${points[0].x.toFixed(1)} ${(svgHeight - paddingY).toFixed(1)} Z`
    : '';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm my-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <MaterialIcon name="trending_up" size="sm" className="text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {onExplain && (
            <button
              onClick={onExplain}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 border rounded px-2 py-0.5"
            >
              <MaterialIcon name="description" size="xs" /> Explain
            </button>
          )}
          <button
            onClick={() => setViewAsTable(!viewAsTable)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <MaterialIcon name={viewAsTable ? 'trending_up' : 'checklist'} size="xs" />
            {viewAsTable ? 'View Trend Line' : 'View as Table'}
          </button>
        </div>
      </div>

      {viewAsTable ? (
        <DataTable columns={[xKey, yKey]} rows={chartData} caption={`${title} (Historical Data)`} />
      ) : (
        <div className="py-2">
          <div className="w-full overflow-hidden flex flex-col items-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-32 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={paddingX} y1={paddingY + usableHeight / 2} x2={svgWidth - paddingX} y2={paddingY + usableHeight / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1" />

              {areaD && <path d={areaD} fill="url(#lineGrad)" />}

              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {points.map((p, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? '#1d4ed8' : '#3b82f6'}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1.5}
                      className="transition-all cursor-pointer"
                    />
                    {isHovered && (
                      <g>
                        <rect
                          x={Math.max(4, Math.min(svgWidth - 64, p.x - 30))}
                          y={Math.max(4, p.y - 24)}
                          width="60"
                          height="18"
                          rx="4"
                          fill="#0f172a"
                          opacity="0.9"
                        />
                        <text
                          x={Math.max(4, Math.min(svgWidth - 64, p.x - 30)) + 30}
                          y={Math.max(4, p.y - 24) + 12}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {p.val}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="w-full flex justify-between px-3 text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
              {chartData.map((d, idx) => (
                <span
                  key={idx}
                  className={`cursor-pointer transition-colors ${hoveredIdx === idx ? 'text-blue-600 font-bold' : ''}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {String(d[xKey] || '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {children && <div className="mt-2 text-xs text-slate-600 border-t border-slate-50 pt-2">{children}</div>}
    </div>
  );
};

// 5b. PieChart & DonutChart Component with "View as Table" toggle
export const PieChart: React.FC<{
  title: string;
  categories?: string | string[];
  values?: string | number[];
  variant?: 'pie' | 'donut';
  data?: string | Array<Record<string, any>>;
  xKey?: string;
  yKey?: string;
  children?: React.ReactNode;
  onExplain?: () => void;
}> = ({
  title,
  categories,
  values,
  variant = 'donut',
  data,
  xKey = 'name',
  yKey = 'value',
  children,
  onExplain,
}) => {
  const [viewAsTable, setViewAsTable] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const SLICE_COLORS = [
    '#f59e0b',
    '#3b82f6',
    '#10b981',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#f97316',
    '#64748b',
  ];

  let parsedItems: Array<{ label: string; value: number; color: string }> = [];

  if (categories && values) {
    const catList = Array.isArray(categories)
      ? categories
      : typeof categories === 'string'
      ? categories.split(',').map((c) => c.trim())
      : [];

    let valList: number[] = [];
    if (Array.isArray(values)) {
      valList = values.map(Number);
    } else if (typeof values === 'string') {
      try {
        valList = JSON.parse(values).map(Number);
      } catch {
        valList = values.split(',').map((v) => Number(v.trim()) || 0);
      }
    }

    parsedItems = catList.map((cat, i) => ({
      label: cat,
      value: valList[i] ?? 0,
      color: SLICE_COLORS[i % SLICE_COLORS.length],
    }));
  } else if (Array.isArray(data)) {
    parsedItems = data.map((d, i) => {
      const label = String(d[xKey] ?? d.name ?? d.label ?? d.category ?? `Item ${i + 1}`);
      const val = Number(d[yKey] ?? d.value ?? d.val ?? d.count ?? 0);
      return {
        label,
        value: val,
        color: d.fill || d.color || SLICE_COLORS[i % SLICE_COLORS.length],
      };
    });
  } else if (typeof data === 'string') {
    try {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        parsedItems = arr.map((d, i) => {
          const label = String(d[xKey] ?? d.name ?? d.label ?? d.category ?? `Item ${i + 1}`);
          const val = Number(d[yKey] ?? d.value ?? d.val ?? d.count ?? 0);
          return {
            label,
            value: val,
            color: d.fill || d.color || SLICE_COLORS[i % SLICE_COLORS.length],
          };
        });
      }
    } catch {
      parsedItems = [];
    }
  }

  const total = parsedItems.reduce((acc, item) => acc + (item.value || 0), 0);

  const size = 200;
  const center = size / 2;
  const radius = 80;
  const innerRadius = variant === 'donut' ? 48 : 0;

  let cumulativeAngle = -Math.PI / 2;
  const slices = parsedItems.map((item, idx) => {
    const fraction = total > 0 ? item.value / total : 0;
    const sweepAngle = fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sweepAngle;
    cumulativeAngle = endAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = sweepAngle > Math.PI ? 1 : 0;

    let pathD = '';
    if (variant === 'donut' && innerRadius > 0) {
      const ix1 = center + innerRadius * Math.cos(endAngle);
      const iy1 = center + innerRadius * Math.sin(endAngle);
      const ix2 = center + innerRadius * Math.cos(startAngle);
      const iy2 = center + innerRadius * Math.sin(startAngle);
      pathD = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        'Z',
      ].join(' ');
    } else {
      pathD = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
    }

    const percentage = total > 0 ? Math.round(fraction * 100) : 0;
    return { ...item, pathD, percentage, idx };
  });

  const activeItem = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm my-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 2.07c3.61.45 6.48 3.33 6.93 6.93H13V4.07zM4 12c0-4.07 3.06-7.44 7-7.93v15.87c-3.94-.5-7-3.87-7-7.94zm9 7.93V13h6.93c-.45 3.61-3.32 6.48-6.93 6.93z" />
          </svg>
          <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {onExplain && (
            <button
              onClick={onExplain}
              className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-1 border rounded px-2 py-0.5"
            >
              <MaterialIcon name="description" size="xs" /> Explain
            </button>
          )}
          <button
            onClick={() => setViewAsTable(!viewAsTable)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <MaterialIcon name={viewAsTable ? 'bar_chart' : 'checklist'} size="xs" />
            {viewAsTable ? 'View Chart' : 'View as Table'}
          </button>
        </div>
      </div>

      {viewAsTable ? (
        <DataTable
          columns={['Category', 'Value', 'Share (%)']}
          rows={slices.map((s) => ({
            Category: s.label,
            Value: s.value,
            'Share (%)': `${s.percentage}%`,
          }))}
          caption={`${title} (Distribution Table)`}
        />
      ) : (
        <div className="py-2 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
              {slices.map((s, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <path
                    key={idx}
                    d={s.pathD}
                    fill={s.color}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? '2.5' : '1.5'}
                    opacity={hoveredIndex === null || isHovered ? 1 : 0.6}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {variant === 'donut' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {activeItem ? (
                  <>
                    <span className="text-base font-black text-slate-900 leading-tight">
                      {activeItem.percentage}%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 max-w-[80px] truncate">
                      {activeItem.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-black text-slate-900 leading-tight">
                      {total}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Total
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-sm">
            {slices.map((s, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                    isHovered
                      ? 'border-slate-400 bg-slate-100 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="truncate max-w-[120px]">{s.label}</span>
                  <span className="font-bold text-slate-900">({s.percentage}%)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {children && <div className="mt-2 text-xs text-slate-600 border-t border-slate-50 pt-2">{children}</div>}
    </div>
  );
};

// 6. GraphView Component (Capped at 200 nodes) with "View as Table"
export const GraphView: React.FC<{
  title: string;
  nodes?: string | Array<Record<string, any>>;
  edges?: string | Array<Record<string, any>>;
  children?: React.ReactNode;
}> = ({ title, nodes, edges, children }) => {
  const [viewAsTable, setViewAsTable] = useState(false);

  let nodeList: Array<Record<string, any>> = [];
  if (Array.isArray(nodes)) nodeList = nodes.slice(0, 200);
  else if (typeof nodes === 'string') {
    try {
      nodeList = JSON.parse(nodes).slice(0, 200);
    } catch {
      nodeList = [];
    }
  }

  let edgeList: Array<Record<string, any>> = [];
  if (Array.isArray(edges)) edgeList = edges.slice(0, 300);
  else if (typeof edges === 'string') {
    try {
      edgeList = JSON.parse(edges).slice(0, 300);
    } catch {
      edgeList = [];
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm my-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <MaterialIcon name="alt_route" size="sm" className="text-purple-600" />
          <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        </div>
        <button
          onClick={() => setViewAsTable(!viewAsTable)}
          className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
        >
          <MaterialIcon name={viewAsTable ? 'alt_route' : 'checklist'} size="xs" />
          {viewAsTable ? 'View Network' : 'View as Table'}
        </button>
      </div>

      {viewAsTable ? (
        <DataTable
          columns={['From', 'Relation', 'To']}
          rows={edgeList.map((e) => ({
            From: e.from,
            Relation: e.relation || 'CONNECTED',
            To: e.to,
          }))}
          caption={`${title} (Edge List)`}
        />
      ) : (
        <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 mb-2">
            Network Topology ({nodeList.length} Nodes, {edgeList.length} Adjacencies):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {nodeList.map((n, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-purple-50 text-purple-900 border-purple-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                {n.label || n.id}
              </span>
            ))}
          </div>
        </div>
      )}

      {children && <div className="mt-2 text-xs text-slate-600">{children}</div>}
    </div>
  );
};

// 7. Callout Component
export const Callout: React.FC<{
  type?: 'info' | 'warning' | 'success' | 'critical';
  message: string;
}> = ({ type = 'info', message }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    critical: 'bg-rose-50 border-rose-300 text-rose-950 font-medium',
  }[type];

  const iconName: any = {
    info: 'description',
    warning: 'warning',
    success: 'check_circle',
    critical: 'error',
  }[type];

  return (
    <div className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${styles} my-2`}>
      <MaterialIcon name={iconName} size="sm" className="shrink-0 mt-0.5" />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
};

// 8. Heading Component
export const Heading: React.FC<{
  level?: number;
  text: string;
}> = ({ level = 2, text }) => {
  const sizeClasses = {
    1: 'text-lg font-black tracking-tight text-slate-900',
    2: 'text-sm font-bold text-slate-800',
    3: 'text-xs font-bold text-slate-700 uppercase tracking-wider',
    4: 'text-xs font-semibold text-slate-600',
  }[level] || 'text-sm font-bold';

  if (level === 1) return <h1 className={`${sizeClasses} my-1.5`}>{text}</h1>;
  if (level === 3) return <h3 className={`${sizeClasses} my-1.5`}>{text}</h3>;
  if (level === 4) return <h4 className={`${sizeClasses} my-1.5`}>{text}</h4>;
  return <h2 className={`${sizeClasses} my-1.5`}>{text}</h2>;
};

// 9. Text Component
export const Text: React.FC<{ content: string }> = ({ content }) => {
  return <p className="text-xs text-slate-700 leading-relaxed my-1">{content}</p>;
};
