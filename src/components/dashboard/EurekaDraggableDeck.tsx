'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useTranslation } from '@/lib/translations'
import DraggableWidgetGrid, { type WidgetItem } from '@/components/ui/draggable-widget-grid'
import {
  ShieldExclamationIcon, ChartBarIcon, NewspaperIcon,
  GlobeAltIcon, BoltIcon, CpuChipIcon, MapPinIcon, SignalIcon,
} from '@heroicons/react/24/outline'

/* ─── Live Tick ─────────────────────────────────────────────────────────── */
const LiveCtx = createContext(true)
function useTick(ms = 2000) {
  const live = useContext(LiveCtx)
  const [t, setT] = useState(0)
  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => { if (!document.hidden) setT(x => x + 1) }, ms)
    return () => window.clearInterval(id)
  }, [live, ms])
  return t
}

function noise(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/* ─── Shared Shell ──────────────────────────────────────────────────────── */
function Shell({ title, badge, children, icon: Icon }: { title: string; badge?: string; children: React.ReactNode; icon: React.ElementType }) {
  return (
    <section className="@container flex h-full flex-col gap-3 p-4">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--gov-accent)]/10 border border-[var(--gov-accent)]/20">
            <Icon className="w-3.5 h-3.5 text-[var(--gov-accent)]" />
          </div>
          <h3 className="text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase truncate">{title}</h3>
        </div>
        {badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-selected)] text-[var(--gov-accent)] border border-[var(--gov-accent)]/20 shrink-0">{badge}</span>
        )}
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}

function BigNum({ value, unit }: { value: string; unit?: string }) {
  return (
    <p className="text-[28px] font-bold tracking-tight text-[var(--text-primary)] tabular-nums leading-none @[200px]:text-[32px]">
      {value}
      {unit && <span className="text-[12px] font-normal text-[var(--text-muted)] ml-1.5">{unit}</span>}
    </p>
  )
}

function MicroBar({ value, max, accent = false }: { value: number; max: number; accent?: boolean }) {
  return (
    <div className="h-[3px] w-full rounded-full bg-[var(--border-standard)]">
      <div className={`h-full rounded-full transition-all duration-700 ${accent ? 'bg-[var(--gov-accent)]' : 'bg-[var(--gov-blue)]'}`} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  )
}

/* ─── Widget Content Components ─────────────────────────────────────────── */
function SentimentWidget() {
  const t = useTick(3000)
  const pos = 66 + (t % 8)
  const neg = 12 - (t % 4)
  return (
    <Shell title="Sentiment Pulse" badge="LIVE" icon={SignalIcon}>
      <BigNum value={`${pos}%`} unit="positive" />
      <div className="mt-auto space-y-2">
        {[{ label: 'Positive', val: pos, color: 'bg-emerald-500' }, { label: 'Neutral', val: 100 - pos - neg, color: 'bg-[var(--gov-accent)]' }, { label: 'Negative', val: neg, color: 'bg-rose-500' }].map(item => (
          <div key={item.label} className="flex items-center gap-2 text-[12px]">
            <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
            <span className="text-[var(--text-secondary)] flex-1">{item.label}</span>
            <span className="text-[var(--text-muted)] tabular-nums font-mono">{item.val}%</span>
          </div>
        ))}
      </div>
    </Shell>
  )
}

function CrisisWidget() {
  const t = useTick(5000)
  const sla = 24 - (t % 5)
  return (
    <Shell title="Crisis SLA" badge="90-MIN" icon={ShieldExclamationIcon}>
      <BigNum value={`${sla}m`} unit="remaining" />
      <p className="mt-2 text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2">Thane water supply misinformation — collector rebuttal pending</p>
      <div className="mt-auto">
        <MicroBar value={sla} max={90} accent />
        <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">INC-2026-804 • Thane District</p>
      </div>
    </Shell>
  )
}

function ReleasesWidget() {
  const t = useTick(2500)
  const count = 247 + (t % 20)
  const days = Array.from({ length: 14 }, (_, i) => Math.round(14 + noise(i * 5) * 10 + (i === 13 ? (t % 8) * 0.5 : 0)))
  const max = Math.max(...days)
  return (
    <Shell title="Press Releases" badge="Today" icon={NewspaperIcon}>
      <BigNum value={String(count)} unit="dispatched" />
      <div className="mt-auto flex items-end gap-[3px] h-10">
        {days.map((d, i) => (
          <span key={i} className={`flex-1 rounded-sm transition-[height] duration-700 ${i === days.length - 1 ? 'bg-[var(--gov-accent)]' : 'bg-[var(--border-standard)]'}`} style={{ height: `${(d / max) * 100}%` }} />
        ))}
      </div>
    </Shell>
  )
}

function SocialWidget() {
  const t = useTick(2000)
  const reach = (4.2 + (t % 10) * 0.08).toFixed(1)
  const platforms = [{ name: 'X / Twitter', val: 1.8 + (t % 5) * 0.04 }, { name: 'WhatsApp', val: 1.4 }, { name: 'Instagram', val: 0.9 }]
  const max = Math.max(...platforms.map(p => p.val))
  return (
    <Shell title="Social Reach" badge="24h" icon={GlobeAltIcon}>
      <BigNum value={`${reach}M`} unit="impressions" />
      <dl className="mt-auto space-y-2.5">
        {platforms.map((p, i) => (
          <div key={p.name}>
            <div className="flex justify-between text-[11px] mb-0.5">
              <dt className="text-[var(--text-secondary)]">{p.name}</dt>
              <dd className="text-[var(--text-muted)] tabular-nums font-mono">{p.val.toFixed(1)}M</dd>
            </div>
            <MicroBar value={p.val} max={max} accent={i === 0} />
          </div>
        ))}
      </dl>
    </Shell>
  )
}

function MediaIngestWidget() {
  const t = useTick(1500)
  const total = 1842 + t * 3
  const channels = [{ label: 'Print OCR', count: 512, tag: 'OCR' }, { label: 'Broadcast TV', count: 280, tag: 'TV' }, { label: 'Social Listen', count: 1050 + t, tag: 'WEB' }]
  return (
    <Shell title="Media Ingest" badge={`${(total / 1000).toFixed(1)}K`} icon={CpuChipIcon}>
      <BigNum value={String(total.toLocaleString('en-IN'))} unit="records" />
      <dl className="mt-auto space-y-1.5">
        {channels.map(ch => (
          <div key={ch.label} className="flex items-center gap-2 text-[11px]">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">{ch.tag}</span>
            <dt className="flex-1 text-[var(--text-secondary)]">{ch.label}</dt>
            <dd className="text-[var(--text-muted)] tabular-nums font-mono">{ch.count.toLocaleString('en-IN')}</dd>
          </div>
        ))}
      </dl>
    </Shell>
  )
}

function CpiWidget() {
  const districts = [{ name: 'Thane', cpi: 96.7, rank: 1 }, { name: 'Raigad', cpi: 92.4, rank: 2 }, { name: 'Pune', cpi: 91.1, rank: 3 }, { name: 'Mumbai', cpi: 90.5, rank: 4 }]
  return (
    <Shell title="CPI Leaderboard" badge="36 Districts" icon={ChartBarIcon}>
      <dl className="flex flex-col gap-2">
        {districts.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[var(--gov-accent)] w-4">#{d.rank}</span>
            <dt className="flex-1 text-[11px] text-[var(--text-secondary)] truncate">{d.name}</dt>
            <dd className="text-[11px] tabular-nums font-mono font-semibold text-[var(--text-primary)]">{d.cpi}</dd>
            <div className="w-12"><MicroBar value={d.cpi} max={100} accent={i === 0} /></div>
          </div>
        ))}
      </dl>
    </Shell>
  )
}

function AlertWidget() {
  const t = useTick(4000)
  const alerts = [
    { level: 'HIGH', msg: 'Viral water supply hoax — Thane', dotColor: 'bg-rose-500 ring-rose-200' },
    { level: 'MED', msg: 'Fuel price misinformation', dotColor: 'bg-amber-500 ring-amber-200' },
    { level: 'LOW', msg: 'School closure rumour', dotColor: 'bg-emerald-500 ring-emerald-200' }
  ]
  return (
    <Shell title="Alert Monitor" badge={`${3 + (t % 2)} Active`} icon={BoltIcon}>
      <ul className="mt-1 space-y-2 text-[11px]">
        {alerts.map((a, i) => (
          <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
            <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ring-4 ${a.dotColor}`} />
            <div className="min-w-0">
              <span className="font-bold text-[var(--gov-accent)] text-[10px] uppercase tracking-wider">{a.level}</span>
              <p className="text-[var(--text-secondary)] leading-snug truncate">{a.msg}</p>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  )
}

function GeoWidget() {
  const districts = ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad']
  const t = useTick(3000)
  return (
    <Shell title="Geographic Coverage" badge="Maharashtra" icon={MapPinIcon}>
      <div className="grid grid-cols-2 gap-1.5 mt-1 flex-1">
        {districts.map((d, i) => {
          const active = noise(i * 7 + t * 0.1) > 0.3
          return (
            <div key={d} className={`px-2 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 border transition-colors duration-700 ${active ? 'bg-[var(--gov-accent)]/10 border-[var(--gov-accent)]/25 text-[var(--gov-accent)]' : 'bg-[var(--bg-hover)] border-[var(--border-subtle)] text-[var(--text-muted)]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[var(--gov-accent)] animate-pulse' : 'bg-[var(--text-muted)]/40'}`} />
              {d}
            </div>
          )
        })}
      </div>
    </Shell>
  )
}

/* ─── Widget Registry ────────────────────────────────────────────────────── */
type Kind = 'sentiment' | 'crisis' | 'releases' | 'social' | 'ingest' | 'cpi' | 'alerts' | 'geo'
interface EurekaWidget extends WidgetItem { kind: Kind }

const WIDGETS: EurekaWidget[] = [
  { id: 'sentiment', kind: 'sentiment', size: 'sm', label: 'Sentiment Pulse' },
  { id: 'crisis', kind: 'crisis', size: 'sm', label: 'Crisis SLA Monitor' },
  { id: 'releases', kind: 'releases', size: 'wide', label: 'Press Releases Activity' },
  { id: 'social', kind: 'social', size: 'sm', label: 'Social Media Reach' },
  { id: 'ingest', kind: 'ingest', size: 'sm', label: 'Media Ingest Feed' },
  { id: 'cpi', kind: 'cpi', size: 'wide', label: 'CPI District Leaderboard' },
  { id: 'alerts', kind: 'alerts', size: 'sm', label: 'Alert Monitor' },
  { id: 'geo', kind: 'geo', size: 'sm', label: 'Geographic Coverage' },
]

const VIEWS: Record<Kind, React.FC> = {
  sentiment: SentimentWidget, crisis: CrisisWidget, releases: ReleasesWidget,
  social: SocialWidget, ingest: MediaIngestWidget, cpi: CpiWidget,
  alerts: AlertWidget, geo: GeoWidget,
}

export const EurekaDraggableDeck: React.FC = () => {
  const { language } = useDashboardStore()
  const t = useTranslation(language)
  const [live, setLive] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setLive(false)
  }, [])

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
            {language === 'mr' ? 'इंटेलिजन्स विजेट डेक' : 'Intelligence Widget Deck'}
          </h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {language === 'mr' ? 'ड्रॅग करून पुनर्रचना करा' : 'Drag widgets to rearrange your command layout'}
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-[var(--bg-selected)] text-[var(--gov-accent)] border border-[var(--gov-accent)]/20 font-bold uppercase tracking-wider">
          EUREKA v2.4
        </span>
      </div>

      {/* Draggable Grid */}
      <LiveCtx.Provider value={live}>
        <DraggableWidgetGrid
          items={WIDGETS}
          renderItem={(item) => {
            const View = VIEWS[(item as EurekaWidget).kind]
            return View ? <View /> : null
          }}
          maxColumns={4}
          cellSize={220}
          gap={14}
          radius={16}
        />
      </LiveCtx.Provider>
    </div>
  )
}

export default EurekaDraggableDeck
