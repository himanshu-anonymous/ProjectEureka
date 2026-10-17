'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

export interface DistrictNodeItem {
  id: string;
  nameEn: string;
  nameMr: string;
  district: string;
  linkType: string;
  latency: string;
  status: string;
  rate: string;
  packets: string;
  snr: string;
}

const DISTRICT_NODES: DistrictNodeItem[] = [
  {
    id: 'THN-01',
    nameEn: 'Thane Division Central',
    nameMr: 'ठाणे विभाग केंद्रीय गेटवे',
    district: 'Thane',
    linkType: 'Dedicated High-Speed Fiber Backbone',
    latency: '12ms',
    status: 'Online',
    rate: '420 ev/min',
    packets: '1.24M',
    snr: '52 dBm',
  },
  {
    id: 'PLG-03',
    nameEn: 'Palghar Tribal Corridor Node',
    nameMr: 'पालघर आदिवासी पट्टा नोड',
    district: 'Palghar',
    linkType: 'Microwave Relay & Redundant 5G Link',
    latency: '22ms',
    status: 'Online',
    rate: '195 ev/min',
    packets: '610K',
    snr: '44 dBm',
  },
  {
    id: 'RGD-02',
    nameEn: 'Raigad Coastal Gateway',
    nameMr: 'रायगड तटीय गेटवे',
    district: 'Raigad',
    linkType: 'Coastal Optical Fiber Ring',
    latency: '18ms',
    status: 'Online',
    rate: '280 ev/min',
    packets: '840K',
    snr: '48 dBm',
  },
  {
    id: 'RTG-04',
    nameEn: 'Ratnagiri Maritime Gateway',
    nameMr: 'रत्नागिरी सागरी बंदर गेटवे',
    district: 'Ratnagiri',
    linkType: 'Maritime Harbor Fiber & Point-to-Point Link',
    latency: '25ms',
    status: 'Online',
    rate: '210 ev/min',
    packets: '690K',
    snr: '49 dBm',
  },
  {
    id: 'SND-05',
    nameEn: 'Sindhudurg South Coastal Node',
    nameMr: 'सिंधुदुर्ग दक्षिण सीमा नोड',
    district: 'Sindhudurg',
    linkType: 'South Coastal Microwave Wireless',
    latency: '28ms',
    status: 'Online',
    rate: '160 ev/min',
    packets: '480K',
    snr: '46 dBm',
  },
];

// --- STEP 1: ISOLATED HIGH-FREQUENCY TELEMETRY SUB-COMPONENTS ---

/**
 * Isolated Live Packet Counter Component
 * Throttled updates prevent the parent dashboard from re-rendering on tick
 */
const LiveDailyPacketsCount = memo<{ liveStreamActive: boolean }>(({ liveStreamActive }) => {
  const [packets, setPackets] = useState<number>(3820511);

  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(() => {
      setPackets((prev) => prev + Math.floor(Math.random() * 8) + 4);
    }, 2400);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  return (
    <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-medium shadow-2xs">
      <span className="text-slate-500 font-normal">Total Daily Packets:</span>{' '}
      <span className="text-slate-900 font-bold">{packets.toLocaleString()}</span>
    </div>
  );
});
LiveDailyPacketsCount.displayName = 'LiveDailyPacketsCount';

/**
 * Step 2: Individual District Gateway Card with Node-Focus State & GPU Acceleration
 * Smooth CSS transition: scale-[1.02] + glowing border on active, opacity-40 on others
 */
interface DistrictGatewayCardProps {
  node: DistrictNodeItem;
  isFocused: boolean;
  isOtherFocused: boolean;
  language: string;
  liveStreamActive: boolean;
  onToggleFocus: (nodeId: string, district: string) => void;
}

const DistrictGatewayCard = memo<DistrictGatewayCardProps>(
  ({ node, isFocused, isOtherFocused, language, liveStreamActive, onToggleFocus }) => {
    return (
      <div
        onClick={() => onToggleFocus(node.id, node.district)}
        className={`group border rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200 cursor-pointer select-none ${
          isFocused
            ? 'scale-[1.01] border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20 z-10'
            : isOtherFocused
            ? 'opacity-40 scale-[0.99] bg-white border-slate-200/60'
            : 'bg-white hover:bg-slate-50/70 border-slate-200/90 border-l-[3px] border-l-emerald-500 shadow-2xs hover:shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded transition-colors ${
                  isFocused ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-900 bg-slate-100'
                }`}
              >
                {node.id}
              </span>
              <h4
                className={`font-bold text-xs transition-colors ${
                  isFocused ? 'text-emerald-950 font-extrabold' : 'text-slate-900'
                }`}
              >
                {language === 'mr' ? node.nameMr : node.nameEn}
              </h4>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border transition-colors ${
                  isFocused
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {node.district}
              </span>
              {isFocused && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-white animate-in fade-in duration-200">
                  FOCUSED
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{node.linkType}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          {/* Mini 4-Bar Signal Visualizer */}
          <div
            className={`flex items-end gap-0.5 h-4 px-1.5 py-0.5 rounded border transition-colors ${
              isFocused ? 'bg-emerald-100 border-emerald-300' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <span
              className={`w-1 inline-block rounded-xs ${
                isFocused ? 'bg-emerald-700' : 'bg-emerald-600'
              } ${isFocused && liveStreamActive ? 'wave-bar-pulse' : 'h-2'}`}
              style={{ height: '60%', animationDelay: '0s' }}
            />
            <span
              className={`w-1 inline-block rounded-xs ${
                isFocused ? 'bg-emerald-700' : 'bg-emerald-600'
              } ${isFocused && liveStreamActive ? 'wave-bar-pulse' : 'h-3'}`}
              style={{ height: '100%', animationDelay: '0.2s' }}
            />
            <span
              className={`w-1 inline-block rounded-xs ${
                isFocused ? 'bg-emerald-700' : 'bg-emerald-600'
              } ${isFocused && liveStreamActive ? 'wave-bar-pulse' : 'h-4'}`}
              style={{ height: '80%', animationDelay: '0.4s' }}
            />
            <span
              className={`w-1 inline-block rounded-xs ${
                isFocused ? 'bg-emerald-700' : 'bg-emerald-600'
              } ${isFocused && liveStreamActive ? 'wave-bar-pulse' : 'h-2'}`}
              style={{ height: '50%', animationDelay: '0.1s' }}
            />
          </div>

          <div className="text-right">
            <div
              className={`font-bold transition-all ${
                isFocused ? 'text-emerald-700 text-[13px]' : 'text-emerald-600 text-xs'
              }`}
            >
              {node.rate}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">{node.latency}</div>
          </div>
        </div>
      </div>
    );
  }
);
DistrictGatewayCard.displayName = 'DistrictGatewayCard';

/**
 * Step 3: Dynamic Optical Bus & Single-Thread Stream Redirection
 * Highlights active node stream, smoothly fades the other 4, and renders vibrant animated laser conduits & moving photon packets
 */
interface OpticalTelemetryBusBridgeProps {
  liveStreamActive: boolean;
  selectedNode: string | null;
  nodes: DistrictNodeItem[];
}

const OpticalTelemetryBusBridge = memo<OpticalTelemetryBusBridgeProps>(
  ({ liveStreamActive, selectedNode, nodes }) => {
    // Aligned to exact vertical centers of the 5 gateway cards (header: ~28px, card: 62px, gap: 10px)
    const yCoordinates = [59, 131, 203, 275, 347];
    const hubCenterY = 203;

    return (
      <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-between relative py-2 select-none will-change-transform transform-gpu min-h-[380px]">
        {/* Floating Optical Bus Top Header Pill (Keeps All 5 Conduit Guide Lines 100% Unobscured) */}
        <div className="relative z-10 mb-auto mt-0 pt-0.5 pointer-events-none">
          {selectedNode ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap animate-in fade-in duration-300 flex items-center gap-1.5 pointer-events-auto">
              <span className="relative flex h-1.5 w-1.5 shrink-0 will-change-transform transform-gpu">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>STREAM: {selectedNode} (ACTIVE)</span>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 text-sky-700 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap transition-colors duration-300 flex items-center gap-1.5 pointer-events-auto">
              <span className="relative flex h-1.5 w-1.5 shrink-0 will-change-transform transform-gpu">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
              </span>
              <span>OPTICAL BUS (5/5 CONDUITS)</span>
            </div>
          )}
        </div>

        {/* SVG Live Conduit Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <svg
            className="w-full h-full will-change-transform transform-gpu"
            viewBox="0 0 140 380"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* 5 Inflow Conduit Guide Lines */}
            {nodes.map((node, idx) => {
              const y = yCoordinates[idx];
              const isFocused = selectedNode === node.id;
              const isOtherFocused = selectedNode !== null && !isFocused;

              // Smooth trajectory from gateway card directly into the central hub port at (140, hubCenterY)
              const d =
                y === hubCenterY
                  ? `M 0 ${hubCenterY} L 140 ${hubCenterY}`
                  : `M 0 ${y} C 55 ${y}, 85 ${hubCenterY}, 140 ${hubCenterY}`;

              return (
                <g key={node.id}>
                  {/* 1. Permanent Structural Guide Line Track - Always Visible for ALL 5 Nodes */}
                  <path
                    d={d}
                    stroke={isFocused ? '#10B981' : isOtherFocused ? '#CBD5E1' : '#94A3B8'}
                    strokeWidth={isFocused ? '4' : '1.75'}
                    strokeDasharray={isFocused ? 'none' : '4 3'}
                    strokeOpacity={isFocused ? '0.45' : isOtherFocused ? '0.35' : '0.65'}
                    fill="none"
                    className="transition-all duration-300"
                  />

                  {/* 2. Active Streaming Conduit (Dashed Moving Laser) */}
                  <path
                    d={d}
                    stroke={isFocused ? '#10B981' : '#0284C7'}
                    strokeWidth={isFocused ? '3.5' : '2'}
                    strokeDasharray={isFocused ? '8 5' : '5 4'}
                    strokeOpacity={isOtherFocused ? '0.1' : '1'}
                    className={`will-change-transform transform-gpu transition-all duration-300 ${
                      liveStreamActive && !isOtherFocused
                        ? isFocused
                          ? 'telemetry-conduit-stream-fast'
                          : 'telemetry-conduit-stream'
                        : ''
                    }`}
                    fill="none"
                  />
                </g>
              );
            })}

            {/* 3. Luminous Animated Photons Gliding Along Active Conduit */}
            {liveStreamActive && (
              <g>
                {selectedNode ? (
                  // When a node is focused: render high-velocity packet ONLY along the focused line
                  (() => {
                    const focusedIdx = nodes.findIndex((n) => n.id === selectedNode);
                    if (focusedIdx === -1) return null;
                    const y = yCoordinates[focusedIdx];
                    const d =
                      y === hubCenterY
                        ? `M 0 ${hubCenterY} L 140 ${hubCenterY}`
                        : `M 0 ${y} C 55 ${y}, 85 ${hubCenterY}, 140 ${hubCenterY}`;

                    return (
                      <g key={`photons-${selectedNode}`}>
                        <circle r="4" fill="#34D399">
                          <animateMotion path={d} dur="0.8s" repeatCount="indefinite" />
                        </circle>
                        <circle r="2" fill="#FFFFFF">
                          <animateMotion path={d} dur="0.8s" repeatCount="indefinite" />
                        </circle>
                        <circle r="3.5" fill="#10B981">
                          <animateMotion path={d} dur="0.8s" begin="0.4s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    );
                  })()
                ) : (
                  // Multi-stream mode: render a single central bus packet along the main hub axis
                  <g key="photons-hub-spine">
                    <circle r="3" fill="#38BDF8">
                      <animateMotion
                        path={`M 0 ${hubCenterY} L 140 ${hubCenterY}`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="1.5" fill="#FFFFFF">
                      <animateMotion
                        path={`M 0 ${hubCenterY} L 140 ${hubCenterY}`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                )}
              </g>
            )}

            {/* Ingestion Hub Terminal Port at x=136, y=203 */}
            <g transform={`translate(136, ${hubCenterY})`}>
              <circle
                r="7"
                fill={selectedNode ? '#10B981' : '#0284C7'}
                opacity="0.3"
                className={liveStreamActive ? 'animate-ping' : ''}
              />
              <circle
                r="4.5"
                fill={selectedNode ? '#34D399' : '#38BDF8'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </div>

        {/* Subtle Bottom Bus Label */}
        <div className="relative z-10 mt-auto mb-0 pb-0.5 text-[8px] font-mono uppercase tracking-widest text-slate-400">
          {selectedNode ? 'DIRECT FIBER PIPE' : 'FDM MULTIPLEX'}
        </div>
      </div>
    );
  }
);
OpticalTelemetryBusBridge.displayName = 'OpticalTelemetryBusBridge';

/**
 * Step 3: Central Core Sync with Node-Focus State
 * When a node is selected, displays active stream stats and quick reset button
 */
interface CentralHubEnclosureProps {
  liveStreamActive: boolean;
  focusedNode: DistrictNodeItem | null;
  onResetFocus: () => void;
}

const CentralHubEnclosure = memo<CentralHubEnclosureProps>(
  ({ liveStreamActive, focusedNode, onResetFocus }) => {
    return (
      <div className="lg:col-span-5 flex flex-col justify-center pl-0 lg:pl-1 mt-4 lg:mt-0">
        <div className="bg-[#0B1120] text-white border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden h-full min-h-[340px]">
          {/* Top Identity Block */}
          <div className="text-center">
            {/* Server Icon Emblem with Status Dot */}
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/80 text-sky-400 flex items-center justify-center mx-auto mb-3 relative shadow-xs">
              <MaterialIcon name="dns" size="md" className="text-sky-400" />
              {liveStreamActive && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5 will-change-transform transform-gpu">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
              )}
            </div>

            {/* State Central Hub Badge or Reset Control */}
            {focusedNode ? (
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-950/90 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                  <MaterialIcon name="alt_route" size="xs" />
                  <span>THREAD ISOLATED</span>
                </span>
                <button
                  type="button"
                  onClick={onResetFocus}
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                  title="Show all streams"
                >
                  <MaterialIcon name="refresh" size="xs" />
                  <span>Show All Streams</span>
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-slate-800/90 text-amber-400 border border-slate-700 px-2.5 py-0.5 rounded-md inline-block mx-auto mb-2">
                STATE CENTRAL HUB
              </span>
            )}

            <h4 className="text-base font-bold text-white tracking-tight">
              DGIPR Telemetry Ingestion Core
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {focusedNode
                ? `Dedicated Channel: ${focusedNode.id} · ${focusedNode.nameEn}`
                : 'Mantralaya State Data Centre High-Capacity Hub'}
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center shadow-2xs transition-all duration-300">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono truncate">
                {focusedNode ? `Isolating Stream: ${focusedNode.id}` : 'Total Inflow Rate'}
              </span>
              <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
                {focusedNode ? focusedNode.rate : '1,480 ev/min'}
              </span>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-center shadow-2xs transition-all duration-300">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono truncate">
                {focusedNode ? 'Node Ping Latency' : 'Avg Ping Latency'}
              </span>
              <span className="text-lg font-mono font-bold text-white mt-1 block">
                {focusedNode ? focusedNode.latency : '18.2 ms'}
              </span>
            </div>
          </div>

          {/* Bottom Status Banner */}
          <div
            className={`w-full border rounded-xl p-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              focusedNode
                ? 'bg-emerald-950/80 border-emerald-600/80 text-emerald-200'
                : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
            }`}
          >
            <MaterialIcon name="check_circle" size="xs" className="text-emerald-400 shrink-0" />
            <span>
              {focusedNode
                ? `Direct Optical Channel Locked: ${focusedNode.id} (100% Ingestion Integrity)`
                : '5/5 District Gateways Active (0.00% Packet Loss)'}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
CentralHubEnclosure.displayName = 'CentralHubEnclosure';

/**
 * Isolated Real-Time Packet Stream Feed Component
 */
const LiveTelemetryPacketFeed = memo<{ liveStreamActive: boolean }>(({ liveStreamActive }) => {
  const [packets, setPackets] = useState([
    { id: 'PKT-THN-881', node: 'THN-01', district: 'Thane', latency: '12ms', snr: '52 dBm', size: '2.4 KB' },
    { id: 'PKT-RGD-719', node: 'RGD-02', district: 'Raigad', latency: '18ms', snr: '48 dBm', size: '1.8 KB' },
    { id: 'PKT-PLG-402', node: 'PLG-03', district: 'Palghar', latency: '22ms', snr: '44 dBm', size: '1.2 KB' },
    { id: 'PKT-RTG-511', node: 'RTG-04', district: 'Ratnagiri', latency: '25ms', snr: '49 dBm', size: '3.1 KB' },
    { id: 'PKT-SND-209', node: 'SND-05', district: 'Sindhudurg', latency: '28ms', snr: '46 dBm', size: '1.5 KB' },
  ]);

  useEffect(() => {
    if (!liveStreamActive) return;

    const pool = [
      { node: 'THN-01', district: 'Thane', latency: '12ms', snr: '52 dBm' },
      { node: 'RGD-02', district: 'Raigad', latency: '18ms', snr: '48 dBm' },
      { node: 'PLG-03', district: 'Palghar', latency: '22ms', snr: '44 dBm' },
      { node: 'RTG-04', district: 'Ratnagiri', latency: '25ms', snr: '49 dBm' },
      { node: 'SND-05', district: 'Sindhudurg', latency: '28ms', snr: '46 dBm' },
    ];

    const interval = setInterval(() => {
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      const newPkt = {
        id: `PKT-${chosen.node.split('-')[0]}-${Math.floor(Math.random() * 900) + 100}`,
        node: chosen.node,
        district: chosen.district,
        latency: chosen.latency,
        snr: chosen.snr,
        size: `${(Math.random() * 2 + 1).toFixed(1)} KB`,
      };
      setPackets((prev) => [newPkt, ...prev.slice(0, 4)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Real-Time Ingestion Packet Feed</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">CRC-32 Checksum Verified</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 font-mono text-xs">
        {packets.map((pkt) => (
          <div
            key={pkt.id}
            className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold text-[11px]">{pkt.id}</span>
              <span className="text-[10px] font-bold px-1 rounded bg-white text-slate-700 border border-slate-200">
                {pkt.node}
              </span>
            </div>
            <div className="text-slate-800 text-[11px] font-semibold mt-1">{pkt.district} Gateway</div>
            <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500 pt-1 border-t border-slate-200">
              <span className="text-emerald-700 font-bold">{pkt.latency}</span>
              <span className="text-slate-600">{pkt.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
LiveTelemetryPacketFeed.displayName = 'LiveTelemetryPacketFeed';

// --- MAIN ANIMATED TELEMETRY MESH COMPONENT ---

interface AnimatedTelemetryMeshProps {
  selectedDistrictFilter?: string;
  onDistrictSelect?: (district: string) => void;
  embedded?: boolean;
}

export const AnimatedTelemetryMesh: React.FC<AnimatedTelemetryMeshProps> = memo(({
  selectedDistrictFilter = 'All',
  onDistrictSelect,
  embedded = false,
}) => {
  const { language } = useDashboardStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    selectedDistrictFilter === 'All Konkan' ? 'All' : selectedDistrictFilter
  );
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);

  // Step 2: Interactive Node-Focus State (null = all nodes active, string = focused node ID)
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Sync internal filter state when external filter changes
  useEffect(() => {
    const normalized = selectedDistrictFilter === 'All Konkan' ? 'All' : selectedDistrictFilter;
    setSelectedDistrict(normalized);
    if (normalized === 'All') {
      setSelectedNode(null);
    } else {
      const match = DISTRICT_NODES.find(
        (d) => d.district.toLowerCase() === normalized.toLowerCase()
      );
      if (match) {
        setSelectedNode(match.id);
      }
    }
  }, [selectedDistrictFilter]);

  // Direct zero-latency node selection toggle (No artificial RAF delay)
  const handleToggleNodeFocus = useCallback(
    (nodeId: string, district: string) => {
      setSelectedNode((prev) => {
        const next = prev === nodeId ? null : nodeId;
        const nextDist = next ? district : 'All';
        setSelectedDistrict(nextDist);
        if (onDistrictSelect) {
          onDistrictSelect(nextDist);
        }
        return next;
      });
    },
    [onDistrictSelect]
  );

  // Direct reset focus to all nodes
  const handleResetFocus = useCallback(() => {
    setSelectedNode(null);
    setSelectedDistrict('All');
    if (onDistrictSelect) {
      onDistrictSelect('All');
    }
  }, [onDistrictSelect]);

  // Direct dropdown change handler
  const handleDistrictChange = useCallback(
    (dist: string) => {
      const normalized = dist === 'All Konkan' ? 'All' : dist;
      setSelectedDistrict(normalized);
      if (normalized === 'All') {
        setSelectedNode(null);
      } else {
        const matching = DISTRICT_NODES.find(
          (d) => d.district.toLowerCase() === normalized.toLowerCase()
        );
        setSelectedNode(matching ? matching.id : null);
      }
      if (onDistrictSelect) {
        onDistrictSelect(normalized);
      }
    },
    [onDistrictSelect]
  );

  const focusedNodeItem = selectedNode
    ? DISTRICT_NODES.find((n) => n.id === selectedNode) || null
    : null;

  return (
    <div
      className={
        embedded
          ? 'space-y-5 bg-surface border-borderLine-standard text-gov-primary'
          : 'bg-surface border border-borderLine-standard rounded-2xl p-5 shadow-2xs space-y-5 text-gov-primary'
      }
    >
      {/* 
        Section Header & Telemetry Controls
      */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        {/* Left Block: Clean Title & Subtitle */}
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight text-gov-primary">
            {language === 'mr'
              ? '१. प्रादेशिक दूरमिती अंतर्ग्रहण प्रवाह'
              : '1. Regional Telemetry Ingestion Flow'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedNode
              ? language === 'mr'
                ? `वाहिनी वेगळी केली: नोड ${selectedNode} थेट माहिती महासंचालनालय मुख्य केंद्राकडे वहन करत आहे`
                : `Channel isolated: Node ${selectedNode} streaming exclusively to DGIPR Central Hub`
              : language === 'mr'
              ? '५ जिल्हा गेटवे थेट माहिती व जनसंपर्क महासंचालनालय राज्य मुख्य केंद्राकडे पॅकेट वहन करत आहेत'
              : '5 District Gateways streaming telemetry packets directly into DGIPR State Central Command Hub'}
          </p>
        </div>

        {/* Right Block: Total Daily Packets, Streaming Live Dot, District Scope */}
        <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
          {/* Isolated High-Frequency Telemetry Sub-Component */}
          <LiveDailyPacketsCount liveStreamActive={liveStreamActive} />

          {/* STREAMING: LIVE Badge with Hardware Accelerated Pulsing Dot */}
          <button
            type="button"
            onClick={() => setLiveStreamActive((prev) => !prev)}
            className="bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-2xs active:scale-[0.98]"
            title="Toggle Live Telemetry Feed"
          >
            <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>
              {liveStreamActive
                ? language === 'mr'
                  ? 'थेट प्रवाह: सुरू'
                  : 'STREAMING: LIVE'
                : language === 'mr'
                ? 'प्रवाह: थांबवला'
                : 'STREAM: PAUSED'}
            </span>
          </button>

          {/* District Scope Select Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer appearance-none"
            >
              <option value="All">
                {language === 'mr' ? 'जिल्हा कार्यक्षेत्र: सर्व जिल्हे' : 'District Scope: All Districts'}
              </option>
              <option value="Thane">
                {language === 'mr' ? 'जिल्हा कार्यक्षेत्र: ठाणे (THN-01)' : 'District Scope: Thane (THN-01)'}
              </option>
              <option value="Raigad">
                {language === 'mr' ? 'जिल्हा कार्यक्षेत्र: रायगड (RGD-02)' : 'District Scope: Raigad (RGD-02)'}
              </option>
              <option value="Palghar">
                {language === 'mr' ? 'जिल्हा कार्यक्षेत्र: पालघर (PLG-03)' : 'District Scope: Palghar (PLG-03)'}
              </option>
              <option value="Ratnagiri">
                {language === 'mr' ? 'जिल्हा कार्यक्षेत्र: रत्नागिरी (RTG-04)' : 'District Scope: Ratnagiri (RTG-04)'}
              </option>
              <option value="Sindhudurg">
                {language === 'mr' ? 'जिल्हा कार्यक्षेत्र: सिंधुदुर्ग (SND-05)' : 'District Scope: Sindhudurg (SND-05)'}
              </option>
            </select>
            <MaterialIcon
              name="expand_more"
              size="xs"
              className="text-slate-400 pointer-events-none absolute right-2.5"
            />
          </div>
        </div>
      </div>

      {/* 
        3-COLUMN TOPOLOGY: Left Gateway Nodes + Optical Bus Bridge + Central Hub Enclosure
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Left Column: 5 District Gateway Nodes (lg:col-span-5 space-y-2.5) */}
        <div className="lg:col-span-5 space-y-2.5 pr-0 lg:pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <MaterialIcon name="podcasts" size="xs" className="text-slate-700" />
              <span>
                {selectedNode
                  ? language === 'mr'
                    ? `नोड फोकस सक्रिय (१/५ निवडलेले)`
                    : `NODE FOCUS ACTIVE (1 / 5 SELECTED)`
                  : language === 'mr'
                  ? 'जिल्हा टेलिमेट्री गेटवे (५/५ सुरू)'
                  : 'DISTRICT TELEMETRY GATEWAYS (5/5 ONLINE)'}
              </span>
            </span>
            <span className="text-[11px] font-mono">
              {selectedNode
                ? language === 'mr'
                  ? 'रीसेट करण्यासाठी क्लिक करा'
                  : 'CLICK NODE TO RESET'
                : language === 'mr'
                ? 'थ्रूपूट / विलंबता'
                : 'THROUGHPUT / LATENCY'}
            </span>
          </div>

          {DISTRICT_NODES.map((node) => {
            const isFocused = selectedNode === node.id;
            const isOtherFocused = selectedNode !== null && !isFocused;

            return (
              <DistrictGatewayCard
                key={node.id}
                node={node}
                isFocused={isFocused}
                isOtherFocused={isOtherFocused}
                language={language}
                liveStreamActive={liveStreamActive}
                onToggleFocus={handleToggleNodeFocus}
              />
            );
          })}
        </div>

        {/* Center Column: Live Optical Telemetry Bus Bridge (lg:col-span-1) */}
        <OpticalTelemetryBusBridge
          liveStreamActive={liveStreamActive}
          selectedNode={selectedNode}
          nodes={DISTRICT_NODES}
        />

        {/* Right Column: DGIPR Telemetry Ingestion Core (lg:col-span-5) */}
        <CentralHubEnclosure
          liveStreamActive={liveStreamActive}
          focusedNode={focusedNodeItem}
          onResetFocus={handleResetFocus}
        />
      </div>

      {/* 
        Isolated Real-Time Telemetry Packet Feed Ticker
      */}
      <LiveTelemetryPacketFeed liveStreamActive={liveStreamActive} />

      {/* Static Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Gateway Inbound Velocity</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {focusedNodeItem ? focusedNodeItem.rate : '1,480'}{' '}
            <span className="text-xs font-normal text-slate-500">ev/min</span>
          </div>
          <span className="text-emerald-700 text-[10px] font-medium">
            {focusedNodeItem ? `Dedicated stream: ${focusedNodeItem.id}` : '↑ 4.2% from last hour'}
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Packet Drop Rate</span>
          <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
            0.00% <span className="text-xs font-normal text-slate-500">(0 / 3.8M)</span>
          </div>
          <span className="text-emerald-700 text-[10px] font-medium">Zero critical losses</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Avg Ping Latency</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {focusedNodeItem ? focusedNodeItem.latency : '18.2'}{' '}
            <span className="text-xs font-normal text-slate-500">ms</span>
          </div>
          <span className="text-slate-600 text-[10px]">
            {focusedNodeItem ? `Link: ${focusedNodeItem.district}` : 'Nominal threshold < 50ms'}
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Socket Reconnects</span>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            1 <span className="text-xs font-normal text-slate-500">(Self-Healed)</span>
          </div>
          <span className="text-emerald-700 text-[10px] font-medium">Auto-failover active</span>
        </div>
      </div>
    </div>
  );
});

AnimatedTelemetryMesh.displayName = 'AnimatedTelemetryMesh';
export default AnimatedTelemetryMesh;
