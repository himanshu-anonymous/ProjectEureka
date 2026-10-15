'use client';

import React, { useState, useEffect } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface AnimatedTelemetryMeshProps {
  selectedDistrictFilter?: string;
  onDistrictSelect?: (district: string) => void;
  embedded?: boolean;
}

export const AnimatedTelemetryMesh: React.FC<AnimatedTelemetryMeshProps> = ({
  selectedDistrictFilter = 'All Konkan',
  onDistrictSelect,
  embedded = false,
}) => {
  const { language } = useDashboardStore();
  const [selectedDistrict, setSelectedDistrict] = useState<string>(selectedDistrictFilter);
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);
  const [totalDailyPackets, setTotalDailyPackets] = useState<number>(3820410);

  // Live packet stream state
  const [recentPackets, setRecentPackets] = useState<
    { id: string; node: string; district: string; latency: string; snr: string; size: string; time: string }[]
  >([
    { id: 'PKT-THN-881', node: 'THN-01', district: 'Thane', latency: '12ms', snr: '52 dBm', size: '2.4 KB', time: '17:42:01.120' },
    { id: 'PKT-RGD-719', node: 'RGD-02', district: 'Raigad', latency: '18ms', snr: '48 dBm', size: '1.8 KB', time: '17:42:01.440' },
    { id: 'PKT-PLG-402', node: 'PLG-03', district: 'Palghar', latency: '22ms', snr: '44 dBm', size: '1.2 KB', time: '17:42:01.980' },
    { id: 'PKT-RTG-511', node: 'RTG-04', district: 'Ratnagiri', latency: '25ms', snr: '49 dBm', size: '3.1 KB', time: '17:42:02.310' },
    { id: 'PKT-SND-209', node: 'SND-05', district: 'Sindhudurg', latency: '28ms', snr: '46 dBm', size: '1.5 KB', time: '17:42:02.750' },
  ]);

  // Keep internal filter in sync
  useEffect(() => {
    setSelectedDistrict(selectedDistrictFilter);
  }, [selectedDistrictFilter]);

  // Live Packet Feeding Loop
  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(() => {
      setTotalDailyPackets((prev) => prev + Math.floor(Math.random() * 8) + 4);

      const nodes = [
        { node: 'THN-01', district: 'Thane', latency: '12ms', snr: '52 dBm' },
        { node: 'RGD-02', district: 'Raigad', latency: '18ms', snr: '48 dBm' },
        { node: 'PLG-03', district: 'Palghar', latency: '22ms', snr: '44 dBm' },
        { node: 'RTG-04', district: 'Ratnagiri', latency: '25ms', snr: '49 dBm' },
        { node: 'SND-05', district: 'Sindhudurg', latency: '28ms', snr: '46 dBm' },
      ];

      const chosen = nodes[Math.floor(Math.random() * nodes.length)];
      const now = new Date();
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0'
      )}:${String(now.getSeconds()).padStart(2, '0')}.${ms}`;

      const newPkt = {
        id: `PKT-${chosen.node.split('-')[0]}-${Math.floor(Math.random() * 900) + 100}`,
        node: chosen.node,
        district: chosen.district,
        latency: chosen.latency,
        snr: chosen.snr,
        size: `${(Math.random() * 2 + 1).toFixed(1)} KB`,
        time: timeStr,
      };

      setRecentPackets((prev) => [newPkt, ...prev.slice(0, 4)]);
    }, 1800);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  const districtNodes = [
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

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    if (onDistrictSelect) {
      onDistrictSelect(dist);
    }
  };

  const filteredNodes =
    selectedDistrict === 'All Konkan'
      ? districtNodes
      : districtNodes.filter((d) => d.district.toLowerCase() === selectedDistrict.toLowerCase());

  return (
    <div
      className={
        embedded
          ? 'space-y-4'
          : 'bg-surface border border-borderLine-standard rounded-lg p-5 shadow-2xs space-y-4'
      }
    >
      {/* Top Header with Live Stream Status & District Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                liveStreamActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
              }`}
            ></span>
            <h3 className="text-base font-bold text-gov-primary tracking-tight">
              {language === 'mr'
                ? '१. कोकण प्रादेशिक दूरमिती अंतर्ग्रहण प्रवाह'
                : '1. Konkan Regional Telemetry Ingestion Flow'}
            </h3>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            5 District Gateways streaming telemetry packets directly into DGIPR State Central Command Hub
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
            <span className="text-slate-500 font-normal">Total Daily Packets:</span>{' '}
            <span className="text-gov-primary font-bold">{totalDailyPackets.toLocaleString()}</span>
          </div>

          {/* Live Ingestion Stream Toggle */}
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={`px-2.5 py-1 rounded font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
              liveStreamActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-600 border-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveStreamActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            ></span>
            <span>{liveStreamActive ? 'STREAMING: LIVE' : 'STREAM: PAUSED'}</span>
          </button>

          {/* District Scope Dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 px-2 py-1 rounded">
            <span className="text-slate-500 font-medium">District Scope:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-transparent font-bold text-gov-primary focus:outline-none cursor-pointer"
            >
              <option value="All Konkan">All 5 Konkan Districts</option>
              <option value="Thane">Thane (THN-01)</option>
              <option value="Raigad">Raigad (RGD-02)</option>
              <option value="Palghar">Palghar (PLG-03)</option>
              <option value="Ratnagiri">Ratnagiri (RTG-04)</option>
              <option value="Sindhudurg">Sindhudurg (SND-05)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 
        CLEAN, CONSISTENT TELEMETRY FLOW DIAGRAM (GATEWAYS ➔ CENTRAL HUB)
      */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Column: 5 District Edge Gateways (Span 7) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
              <span className="flex items-center gap-1.5">
                <MaterialIcon name="podcasts" size="xs" className="text-gov-primary" />
                <span>DISTRICT TELEMETRY GATEWAYS (5/5 ONLINE)</span>
              </span>
              <span className="text-[11px] font-mono">RATE / PING</span>
            </div>

            {filteredNodes.map((node) => {
              const isSelected = selectedDistrict === 'All Konkan' || selectedDistrict === node.district;

              return (
                <div
                  key={node.id}
                  onClick={() => handleDistrictChange(node.district)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-blue-400 shadow-xs ring-1 ring-blue-400/30'
                      : 'bg-white/70 border-slate-200 hover:border-slate-300 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-gov-primary">{node.id}</span>
                        <h4 className="font-bold text-xs text-slate-800">
                          {language === 'mr' ? node.nameMr : node.nameEn}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {node.district}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{node.linkType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                    {/* Simple Wave Signal Bars */}
                    <div className="flex items-end gap-0.5 h-4 px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                      <span
                        className={`w-1 bg-gov-primary rounded-xs ${liveStreamActive ? 'wave-bar-pulse' : 'h-2'}`}
                        style={{ height: '60%', animationDelay: '0s' }}
                      ></span>
                      <span
                        className={`w-1 bg-gov-primary rounded-xs ${liveStreamActive ? 'wave-bar-pulse' : 'h-3'}`}
                        style={{ height: '100%', animationDelay: '0.2s' }}
                      ></span>
                      <span
                        className={`w-1 bg-gov-primary rounded-xs ${liveStreamActive ? 'wave-bar-pulse' : 'h-4'}`}
                        style={{ height: '80%', animationDelay: '0.4s' }}
                      ></span>
                      <span
                        className={`w-1 bg-gov-primary rounded-xs ${liveStreamActive ? 'wave-bar-pulse' : 'h-2'}`}
                        style={{ height: '50%', animationDelay: '0.1s' }}
                      ></span>
                    </div>

                    <div className="text-right">
                      <div className="text-emerald-700 font-bold text-xs">{node.rate}</div>
                      <div className="text-[10px] text-slate-500">{node.latency}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Central Ingestion Core Hub (Span 5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center text-gov-primary shadow-xs relative">
              <MaterialIcon name="dns" size="md" className="text-gov-primary" />
              {liveStreamActive && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                State Central Hub
              </span>
              <h4 className="text-sm font-bold text-gov-primary mt-1.5">
                DGIPR Telemetry Ingestion Core
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Mantralaya & Kokan Bhavan High-Capacity Hub
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-slate-200 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Total Inflow Rate</span>
                <span className="text-emerald-700 font-bold">1,480 ev/min</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Avg Ping Latency</span>
                <span className="text-gov-primary font-bold">18.2 ms</span>
              </div>
            </div>

            <div className="w-full bg-emerald-50 border border-emerald-200 rounded p-1.5 text-[11px] font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
              <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
              <span>5/5 District Gateways Active (0.00% Packet Loss)</span>
            </div>
          </div>
        </div>

        {/* 
          ANIMATED CONDUIT FLOW LINE (Light Theme)
          Smooth dashed animated line showing packets streaming from districts to central core
        */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span className="flex items-center gap-1 text-gov-primary font-semibold">
              <MaterialIcon name="sync" size="xs" />
              <span>ACTIVE OPTICAL TELEMETRY BUS (GATEWAYS ➔ CENTRAL CORE)</span>
            </span>
            <span className="text-emerald-700 font-bold">Latency: 18.2ms avg</span>
          </div>

          <svg className="w-full h-6" viewBox="0 0 1000 24" fill="none">
            {/* Base Wire Track */}
            <line x1="20" y1="12" x2="980" y2="12" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

            {/* Smooth Animated Telemetry Flow Line */}
            <line
              x1="20"
              y1="12"
              x2="980"
              y2="12"
              stroke={liveStreamActive ? '#0284C7' : '#94A3B8'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className={liveStreamActive ? 'telemetry-conduit-stream' : ''}
            />

            {/* District Checkpoint Nodes */}
            {[60, 260, 460, 660, 860].map((cx, i) => (
              <circle
                key={i}
                cx={cx}
                cy="12"
                r={liveStreamActive ? 4.5 : 3.5}
                fill={liveStreamActive ? '#0284C7' : '#94A3B8'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* 
        LIVE TELEMETRY PACKET FEED (Light Theme Ticker)
      */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gov-primary">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-Time Ingestion Packet Feed</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">CRC-32 Checksum Verified</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 font-mono text-xs">
          {recentPackets.map((pkt) => (
            <div
              key={pkt.id}
              className="bg-slate-50 p-2 rounded border border-slate-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-gov-primary font-bold text-[11px]">{pkt.id}</span>
                <span className="text-[10px] font-bold px-1 rounded bg-white text-slate-600 border border-slate-200">
                  {pkt.node}
                </span>
              </div>
              <div className="text-slate-700 text-[11px] font-semibold mt-1">{pkt.district} Gateway</div>
              <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500 pt-1 border-t border-slate-200">
                <span className="text-emerald-700 font-bold">{pkt.latency}</span>
                <span className="text-slate-600">{pkt.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 font-medium">Gateway Inbound Velocity</span>
          <div className="text-lg font-bold font-mono text-gov-primary mt-0.5">
            1,480 <span className="text-xs font-normal text-slate-500">ev/min</span>
          </div>
          <span className="text-emerald-700 text-[10px] font-medium">↑ 4.2% from last hour</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 font-medium">Packet Drop Rate</span>
          <div className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
            0.00% <span className="text-xs font-normal text-slate-500">(0 / 3.8M)</span>
          </div>
          <span className="text-emerald-700 text-[10px] font-medium">Zero critical losses</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 font-medium">Avg Ping Latency</span>
          <div className="text-lg font-bold font-mono text-gov-primary mt-0.5">
            18.2 <span className="text-xs font-normal text-slate-500">ms</span>
          </div>
          <span className="text-slate-600 text-[10px]">Nominal threshold &lt; 50ms</span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] text-slate-500 font-medium">Socket Reconnects</span>
          <div className="text-lg font-bold font-mono text-gov-primary mt-0.5">
            1 <span className="text-xs font-normal text-slate-500">(Self-Healed)</span>
          </div>
          <span className="text-emerald-700 text-[10px] font-medium">Auto-failover active</span>
        </div>
      </div>
    </div>
  );
};
