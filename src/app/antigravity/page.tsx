'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AntigravityPage() {
  const [gravityInverted, setGravityInverted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getTiltStyle = (speedMultiplier: number = 1.0) => {
    const rotX = -mousePos.y * 12 * speedMultiplier;
    const rotY = mousePos.x * 14 * speedMultiplier;
    const transZ = gravityInverted ? 35 : 10;
    const transY = gravityInverted ? -20 : 0;
    return {
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${transZ}px) translateY(${transY}px)`,
      transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
    };
  };

  return (
    <div className="min-h-screen w-full bg-[#030611] text-slate-100 relative overflow-x-hidden font-sans select-none">
      {/* Background Starfield Particles */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-[1780px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6" ref={containerRef}>
        {/* Top Antigravity Flight Deck Header */}
        <header
          style={getTiltStyle(0.6)}
          className="flex flex-wrap items-center justify-between gap-4 p-4 lg:px-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-0.5 animate-spin shadow-[0_0_20px_rgba(0,240,255,0.6)]">
              <div className="w-full h-full bg-[#030611] rounded-full flex items-center justify-center font-bold text-xs text-cyan-400">
                0G
              </div>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent uppercase">
                Antigravity Command Cockpit
              </h1>
              <p className="text-xs font-mono text-cyan-400/80 tracking-wide">
                WEIGHTLESS MULTI-DIMENSIONAL TELEMETRY • MAHARASHTRA ORBITAL GRID
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">ZERO-G DAMPING: 99.8%</span>
            </div>

            <button
              type="button"
              onClick={() => setGravityInverted(!gravityInverted)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-lg ${
                gravityInverted
                  ? 'bg-rose-500/30 border-rose-400 text-rose-200 shadow-rose-500/40'
                  : 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-cyan-500/30 hover:bg-cyan-500/30'
              }`}
            >
              {gravityInverted ? '🌀 RESTORE GRAVITY FIELD' : '⚡ INVERT GRAVITY FIELD'}
            </button>

            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Back to Standard Cockpit →
            </Link>
          </div>
        </header>

        {/* 3-Column Floating Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Floating Metric Widgets (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Widget 1: Public Sentiment Pulse */}
            <div
              style={getTiltStyle(1.2)}
              className="p-5 rounded-2xl bg-slate-900/45 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/50 shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Public Sentiment Pulse</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  REAL-TIME
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold font-mono bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  78.4%
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">▲ +3.2%</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Desynchronized weightless sentiment radar streaming from 36 reporting district DIO desks.
              </p>

              {/* Glowing Radial Gauge */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset="58"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-center">
                  <span className="text-xl font-bold text-white">78.4</span>
                  <span className="text-[9px] text-cyan-400 font-bold uppercase">STABLE</span>
                </div>
              </div>
            </div>

            {/* Widget 2: 3D Data Pillars */}
            <div
              style={getTiltStyle(0.9)}
              className="p-5 rounded-2xl bg-slate-900/45 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/50 shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">District Pillars</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  3D ARRAY
                </span>
              </div>

              <div className="flex justify-between items-end h-28 pt-2">
                {[
                  { label: 'THN', height: '86%' },
                  { label: 'RGD', height: '94%' },
                  { label: 'PLG', height: '72%' },
                  { label: 'RTN', height: '82%' },
                  { label: 'SND', height: '68%' },
                ].map((pillar) => (
                  <div key={pillar.label} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-4 h-24 bg-white/5 rounded-md overflow-hidden border border-white/10 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500/40 to-cyan-400 rounded shadow-[0_0_12px_rgba(0,240,255,0.6)] transition-all duration-700"
                        style={{ height: pillar.height }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{pillar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Suspended 3D Visualization Map (6 cols) */}
          <div className="lg:col-span-6">
            <div
              style={getTiltStyle(1.8)}
              className="relative h-[530px] rounded-3xl bg-radial from-slate-900/80 via-slate-950/90 to-[#030611] border border-cyan-400/30 shadow-[0_0_60px_rgba(0,240,255,0.15)] flex flex-col items-center justify-center p-6 overflow-hidden"
            >
              {/* Perspective Grid Floor */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0, 240, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.12) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                  transform: 'rotateX(65deg) translateZ(-50px)',
                }}
              />

              {/* Floating Holographic State Map Silhouette */}
              <div className="relative w-full max-w-lg z-10 drop-shadow-[0_20px_35px_rgba(0,240,255,0.4)]">
                <svg viewBox="0 0 600 500" className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="neonMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 80,180 L 140,110 L 220,90 L 320,100 L 440,70 L 520,110 L 540,180 L 500,240 L 460,320 L 360,400 L 260,420 L 190,440 L 140,380 L 110,290 Z"
                    fill="url(#neonMapGrad)"
                    stroke="#00F0FF"
                    strokeWidth="2.5"
                  />

                  {/* Connecting Coordinates */}
                  <line x1="80" y1="180" x2="260" y2="240" stroke="rgba(0,240,255,0.3)" strokeDasharray="4 4" />
                  <line x1="320" y1="100" x2="260" y2="240" stroke="rgba(0,240,255,0.3)" strokeDasharray="4 4" />
                  <line x1="520" y1="110" x2="380" y2="220" stroke="rgba(0,240,255,0.3)" strokeDasharray="4 4" />
                </svg>

                {/* Softly Pulsing Suspended Data Nodes */}
                {[
                  { name: 'Thane', top: '38%', left: '24%', cpi: '96.8' },
                  { name: 'Mumbai', top: '48%', left: '32%', cpi: '94.2' },
                  { name: 'Pune', top: '56%', left: '42%', cpi: '91.2' },
                  { name: 'Nagpur', top: '30%', left: '70%', cpi: '88.5' },
                ].map((node) => (
                  <div
                    key={node.name}
                    className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_#00F0FF] animate-pulse cursor-pointer group"
                    style={{ top: node.top, left: node.left }}
                  >
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 border border-cyan-400/80 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap text-cyan-200 pointer-events-none shadow-lg">
                      {node.name} • {node.cpi} CPI
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Hologram Telemetry Bar */}
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-xs font-mono text-cyan-400/80 z-20">
                <span>GRID LAT: 19.7515° N • LON: 75.7139° E</span>
                <span className="text-purple-400">SUSPENSION ELEVATION: 420 KM</span>
              </div>
            </div>
          </div>

          {/* Column 3: Live Telemetry & Crisis Radar (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Widget 3: Live Telemetry Ingestion */}
            <div
              style={getTiltStyle(1.1)}
              className="p-5 rounded-2xl bg-slate-900/45 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/50 shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Telemetry Feeds</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { title: 'PALGHAR MARINE SENSOR', sub: 'GPS Beacon Active • 19.69°', status: 'OK 99.4%', color: 'text-emerald-400' },
                  { title: 'PUNE WATER GRID INTAKE', sub: 'Telemetry Sync • 120 L/s', status: 'SYNCD', color: 'text-cyan-400' },
                  { title: 'NAGPUR METRO LINE 2', sub: 'Vibration Damping Vector', status: 'STEADY', color: 'text-purple-400' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-[11px]">{item.title}</div>
                      <div className="text-[9px] text-slate-400">{item.sub}</div>
                    </div>
                    <span className={`font-mono font-bold text-[10px] ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 4: Incident Response SLA */}
            <div
              style={getTiltStyle(1.3)}
              className="p-5 rounded-2xl bg-slate-900/45 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/50 shadow-xl transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Incident Response SLA</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  CRITICAL
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold font-mono bg-gradient-to-r from-white to-rose-400 bg-clip-text text-transparent">
                  98.4%
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">4m 12s avg</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                <div className="w-[98.4%] h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full shadow-[0_0_10px_#10B981]" />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>RESOLVED: 41</span>
                <span>OPEN ESCALATIONS: 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
