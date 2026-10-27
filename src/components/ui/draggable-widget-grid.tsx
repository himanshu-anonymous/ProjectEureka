'use client'

import {
  memo, useCallback, useEffect, useId, useLayoutEffect, useMemo,
  useRef, useState,
  type CSSProperties, type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent, type ReactNode,
} from 'react'
import { MotionConfig, motion, useDragControls } from 'motion/react'

export type WidgetSize = 'sm' | 'wide' | 'tall' | 'lg'
export interface WidgetItem { id: string; size: WidgetSize; label?: string }
export interface DraggableWidgetGridProps {
  items?: WidgetItem[]; onChange?: (items: WidgetItem[]) => void
  renderItem?: (item: WidgetItem, size: WidgetSize) => ReactNode
  editable?: boolean; maxColumns?: number; cellSize?: number
  gap?: number; radius?: number; className?: string
}

const SPANS: { [K in WidgetSize]: { col: number; row: number } } = {
  sm: { col: 1, row: 1 }, wide: { col: 2, row: 1 },
  tall: { col: 1, row: 2 }, lg: { col: 2, row: 2 },
}
const SIZE_LABELS: { [K in WidgetSize]: string } = {
  sm: 'Small', wide: 'Wide', tall: 'Tall', lg: 'Large',
}
const DEFAULT_ITEMS: WidgetItem[] = [
  { id: 'w1', size: 'wide' }, { id: 'w2', size: 'sm' }, { id: 'w3', size: 'sm' },
  { id: 'w4', size: 'sm' }, { id: 'w5', size: 'wide' }, { id: 'w6', size: 'sm' },
  { id: 'w7', size: 'sm' }, { id: 'w8', size: 'wide' }, { id: 'w9', size: 'sm' },
]

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
function sizeOf(w: number, h: number): WidgetSize {
  if (w >= 2 && h >= 2) return 'lg'; if (w >= 2) return 'wide'
  if (h >= 2) return 'tall'; return 'sm'
}

interface Placement { id: string; col: number; row: number; w: number; h: number }
interface Box { col: number; row: number; w: number; h: number }
interface Slot { left: number; top: number; right: number; bottom: number }
interface Candidate { order: WidgetItem[]; slot: Slot }

const overlaps = (a: Box, b: Box) =>
  a.col < b.col + b.w && b.col < a.col + a.w && a.row < b.row + b.h && b.row < a.row + a.h
const contains = (o: Box, i: Box) =>
  i.col >= o.col && i.row >= o.row && i.col + i.w <= o.col + o.w && i.row + i.h <= o.row + o.h

function spanOf(item: WidgetItem, columns: number) {
  return { w: Math.min(SPANS[item.size].col, columns), h: SPANS[item.size].row }
}

function layout(items: WidgetItem[], columns: number): Placement[] {
  if (columns < 1 || items.length === 0) return []
  return tile(items, columns) ?? pack(items, columns)
}

const BUDGET = 20000
function tile(items: WidgetItem[], columns: number): Placement[] | null {
  const spans = items.map(it => spanOf(it, columns))
  const area = spans.reduce((n, s) => n + s.w * s.h, 0)
  const rows = Math.ceil(area / columns)
  const grid: boolean[] = new Array(rows * columns).fill(false)
  const used: boolean[] = new Array(items.length).fill(false)
  const out: Placement[] = []
  let budget = BUDGET
  const fits = (w: number, h: number, r: number, c: number) => {
    if (c + w > columns || r + h > rows) return false
    for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) if (grid[y * columns + x]) return false
    return true
  }
  const mark = (w: number, h: number, r: number, c: number, v: boolean) => {
    for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) grid[y * columns + x] = v
  }
  const place = (count: number): boolean => {
    if (count === items.length) return true; if (--budget < 0) return false
    const i = grid.indexOf(false); if (i < 0) return false
    const r = Math.floor(i / columns); const c = i % columns
    const tried = new Set<string>()
    for (let k = 0; k < items.length; k++) {
      if (used[k]) continue; const { w, h } = spans[k]; const shape = `${w}x${h}`
      if (tried.has(shape) || !fits(w, h, r, c)) continue
      tried.add(shape); used[k] = true; mark(w, h, r, c, true)
      out.push({ id: items[k].id, col: c, row: r, w, h })
      if (place(count + 1)) return true
      out.pop(); mark(w, h, r, c, false); used[k] = false
    }
    return false
  }
  return place(0) ? out : null
}

function pack(items: WidgetItem[], columns: number): Placement[] {
  const out: Placement[] = []; let row = 0
  let queue = items.map(it => ({ id: it.id, ...spanOf(it, columns) }))
  while (queue.length > 0) {
    const height = Math.max(...queue.slice(0, columns).map(q => q.h))
    const cells: boolean[] = new Array(height * columns).fill(false)
    const band: Placement[] = []; const rest: typeof queue = []
    for (const q of queue) {
      let spot = -1
      for (let i = 0; i < cells.length && spot < 0; i++) {
        const r = Math.floor(i / columns); const c = i % columns
        if (c + q.w > columns || r + q.h > height) continue
        let free = true
        for (let y = r; y < r + q.h && free; y++) for (let x = c; x < c + q.w && free; x++) if (cells[y * columns + x]) free = false
        if (free) spot = i
      }
      if (spot < 0 || rest.length > 0) { rest.push(q); continue }
      const r = Math.floor(spot / columns); const c = spot % columns
      for (let y = r; y < r + q.h; y++) for (let x = c; x < c + q.w; x++) cells[y * columns + x] = true
      band.push({ id: q.id, col: c, row: r, w: q.w, h: q.h })
    }
    for (let i = 0; i < cells.length; i++) {
      if (cells[i]) continue; const r = Math.floor(i / columns); const c = i % columns
      const left = band.find(p => p.col + p.w === c && p.row <= r && p.row + p.h > r && p.h === 1)
      const above = band.find(p => p.row + p.h === r && p.col === c && p.w === 1)
      const grow = left ?? above; if (!grow) continue
      if (grow === left) grow.w += 1; else grow.h += 1; cells[i] = true
    }
    out.push(...band.map(p => ({ ...p, row: p.row + row }))); row += height; queue = rest
  }
  return out
}

function canonical(items: WidgetItem[], columns: number): WidgetItem[] {
  const places = layout(items, columns)
  if (places.length !== items.length) return items
  const byId = new Map(items.map(it => [it.id, it]))
  const sorted = [...places].sort((a, b) => a.row - b.row || a.col - b.col).map(p => byId.get(p.id) as WidgetItem)
  if (sorted.every((it, i) => it === items[i])) return items
  const at = new Map(places.map(p => [p.id, p]))
  const same = layout(sorted, columns).every(p => { const q = at.get(p.id); return q && q.col === p.col && q.row === p.row && q.w === p.w && q.h === p.h })
  return same ? sorted : items
}

function moveTo(items: WidgetItem[], id: string, index: number) {
  const from = items.findIndex(it => it.id === id)
  if (from < 0 || from === index || index < 0 || index >= items.length) return items
  const next = [...items]; const [moved] = next.splice(from, 1); next.splice(index, 0, moved); return next
}

const sameOrder = (a: WidgetItem[], b: WidgetItem[]) => a.length === b.length && a.every((it, i) => it.id === b[i].id)
const ENTER = 0.18

function choose(home: Slot, candidates: Candidate[], cx: number, cy: number): WidgetItem[] | null {
  const dist = (s: Slot, inset: number) => {
    const ix = (s.right - s.left) * inset; const iy = (s.bottom - s.top) * inset
    return Math.hypot(Math.max(s.left + ix - cx, 0, cx - (s.right - ix)), Math.max(s.top + iy - cy, 0, cy - (s.bottom - iy)))
  }
  const toC = (s: Slot) => Math.hypot((s.left + s.right) / 2 - cx, (s.top + s.bottom) / 2 - cy)
  let best = dist(home, 0); if (best === 0) return null
  let pick: WidgetItem[] | null = null; let bestC = Infinity
  for (const { order, slot } of candidates) {
    const d = dist(slot, ENTER); const c = toC(slot)
    if (d < best || (d === best && pick && c < bestC)) { best = d; bestC = c; pick = order }
  }
  return pick
}

function candidatesFor(items: WidgetItem[], id: string, columns: number, toSlot: (b: Box) => Slot): Candidate[] {
  const places = layout(items, columns); const me = places.find(p => p.id === id); if (!me) return []
  const byId = new Map(items.map(it => [it.id, it]))
  const rows = Math.max(...places.map(p => p.row + p.h)); const out: Candidate[] = []
  for (let row = 0; row + me.h <= rows; row++) for (let col = 0; col + me.w <= columns; col++) {
    const area = { col, row, w: me.w, h: me.h }; if (overlaps(area, me)) continue
    const group = places.filter(p => overlaps(p, area))
    if (group.length < 2 || !group.every(p => contains(area, p))) continue
    const moved = places.map(p => p.id === id ? { ...p, col, row } : group.includes(p) ? { ...p, col: p.col - col + me.col, row: p.row - row + me.row } : p)
    moved.sort((a, b) => a.row - b.row || a.col - b.col)
    out.push({ order: moved.map(p => byId.get(p.id) as WidgetItem), slot: toSlot(area) })
  }
  const from = items.findIndex(it => it.id === id)
  for (let i = 0; i < items.length; i++) {
    if (i === from) continue; const order = moveTo(items, id, i)
    const p = layout(order, columns).find(q => q.id === id); if (p) out.push({ order, slot: toSlot(p) })
  }
  return out
}

const SPRING = { type: 'spring', visualDuration: 0.38, bounce: 0.16 } as const
const LIFT = { type: 'spring', visualDuration: 0.26, bounce: 0.32 } as const
const LIFT_SCALE = 1.06; const SETTLE_MS = 40; const LANDED_MS = 620
const LONG_PRESS_MS = 350; const PRESS_SLOP = 8
const SHADOW_REST = '0px 1px 2px 0px rgba(0,0,0,0.12), 0px 0px 0px 0px rgba(0,0,0,0)'
const SHADOW_LIFTED = '0px 28px 60px -16px rgba(0,0,0,0.45), 0px 10px 24px -8px rgba(0,0,0,0.3)'

interface Press { timer: number; pointerId: number; x: number; y: number }
type Phase = 'idle' | 'holding' | 'lifted'
interface WidgetHandlers {
  start: (id: string) => void; drag: () => void; end: (id: string) => void
  key: (e: ReactKeyboardEvent, id: string) => void; swallow: () => boolean; suppressClick: () => void
}

const Widget = memo(function Widget({ item, col, row, w, h, columns, rows, editable, held, raised, landed, handlers, hintId, position, count, renderItem }: {
  item: WidgetItem; col: number; row: number; w: number; h: number; columns: number; rows: number
  editable: boolean; held: boolean; raised: boolean; landed: boolean
  handlers: WidgetHandlers; hintId: string; position: number; count: number
  renderItem?: (item: never, size: WidgetSize) => ReactNode
}) {
  const controls = useDragControls(); const node = useRef(null as HTMLDivElement | null)
  const press = useRef(null as Press | null); const lifted = useRef(false)
  const cleanup = useRef(null as (() => void) | null); const [phase, setPhase] = useState('idle' as Phase)
  const release = useCallback(() => {
    if (press.current) window.clearTimeout(press.current.timer)
    press.current = null; lifted.current = false; cleanup.current?.(); cleanup.current = null; setPhase('idle')
  }, [])
  useEffect(() => {
    const el = node.current; if (!el) return
    const block = (e: TouchEvent) => { if (lifted.current) e.preventDefault() }
    el.addEventListener('touchmove', block, { passive: false })
    return () => { el.removeEventListener('touchmove', block); if (press.current) window.clearTimeout(press.current.timer); cleanup.current?.() }
  }, [])
  const onPointerDown = (e: ReactPointerEvent) => {
    if (!editable || e.button !== 0 || !e.isPrimary) return
    if (e.pointerType !== 'touch') { controls.start(e); return }
    if (press.current || lifted.current) return
    const origin = e.nativeEvent; const pointerId = e.pointerId
    setPhase('holding')
    press.current = {
      pointerId, x: e.clientX, y: e.clientY,
      timer: window.setTimeout(() => {
        press.current = null; lifted.current = true; setPhase('lifted'); navigator.vibrate?.(10); controls.start(origin)
        const done = (ev: PointerEvent) => { if (ev.pointerId !== pointerId) return; handlers.suppressClick(); release() }
        window.addEventListener('pointerup', done); window.addEventListener('pointercancel', done)
        cleanup.current = () => { window.removeEventListener('pointerup', done); window.removeEventListener('pointercancel', done) }
      }, LONG_PRESS_MS),
    }
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    const p = press.current
    if (p && e.pointerId === p.pointerId && Math.hypot(e.clientX - p.x, e.clientY - p.y) > PRESS_SLOP) release()
  }
  const onPointerEnd = (e: ReactPointerEvent) => { if (press.current?.pointerId === e.pointerId) release() }
  const delay = (col / Math.max(columns, 1) + row / Math.max(rows, 1)) * 0.26
  return (
    <motion.div ref={node} role="listitem" data-slot="widget" data-widget-id={item.id}
      tabIndex={editable ? 0 : undefined}
      aria-label={item.label ?? `${SIZE_LABELS[item.size]} widget`}
      aria-describedby={editable ? hintId : undefined}
      aria-posinset={position} aria-setsize={count}
      layout="position" drag={editable} dragListener={false} dragControls={controls}
      dragSnapToOrigin dragMomentum={false}
      onDragStart={() => handlers.start(item.id)} onDrag={handlers.drag} onDragEnd={() => handlers.end(item.id)}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
      onContextMenu={e => { if (phase !== 'idle') e.preventDefault() }}
      onKeyDown={e => handlers.key(e, item.id)}
      onClickCapture={e => { if (handlers.swallow() || (editable && (e.target as HTMLElement).closest('a'))) { e.preventDefault(); e.stopPropagation() } }}
      animate={{ scale: phase === 'holding' ? 0.97 : phase === 'lifted' ? LIFT_SCALE : 1, boxShadow: phase === 'lifted' ? SHADOW_LIFTED : SHADOW_REST }}
      whileDrag={{ scale: LIFT_SCALE, boxShadow: SHADOW_LIFTED, transition: LIFT }}
      transition={SPRING}
      className={`relative min-w-0 rounded-[var(--widget-radius)] outline-none focus-visible:ring-2 focus-visible:ring-ring [&_a]:[-webkit-user-drag:none] [&_img]:[-webkit-user-drag:none] ${editable ? 'cursor-grab touch-pan-y touch-pinch-zoom select-none [-webkit-touch-callout:none] active:cursor-grabbing' : ''}`}
      style={{ gridColumn: `${col + 1} / span ${w}`, gridRow: `${row + 1} / span ${h}`, zIndex: held ? 20 : raised ? 10 : 0 }}>
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', visualDuration: 0.6, bounce: 0.12, delay }}
        className={`relative isolate flex h-full w-full flex-col overflow-hidden rounded-[var(--widget-radius)] bg-card text-card-foreground ring-inset transition-shadow duration-300 [clip-path:inset(0_round_var(--widget-radius))] ${landed ? 'ring-2 ring-foreground/40' : 'ring-1 ring-border'}`}>
        {renderItem?.(item as never, sizeOf(w, h))}
      </motion.div>
    </motion.div>
  )
})

export function DraggableWidgetGrid({ items: initialItems, onChange, renderItem, editable = true, maxColumns = 4, cellSize = 215, gap = 12, radius = 20, className = '' }: DraggableWidgetGridProps) {
  const [items, setItems] = useState(() => initialItems ?? DEFAULT_ITEMS)
  const grid = useRef(null as HTMLDivElement | null); const hintId = useId()
  const minColumns = Math.min(2, Math.max(1, maxColumns))
  const [metrics, setMetrics] = useState({ unit: 0, columns: 0 })
  useIsoLayoutEffect(() => {
    const el = grid.current; if (!el) return
    const measure = () => {
      const width = el.getBoundingClientRect().width; if (width < 1) return
      const columns = Math.max(minColumns, Math.min(maxColumns, Math.round(width / cellSize)))
      const unit = (width - gap * (columns - 1)) / columns
      setMetrics(was => was.columns === columns && Math.abs(was.unit - unit) < 0.5 ? was : { unit, columns })
    }
    measure(); const observer = new ResizeObserver(measure); observer.observe(el); return () => observer.disconnect()
  }, [maxColumns, minColumns, cellSize, gap])
  const columns = metrics.columns || Math.max(minColumns, maxColumns)
  const placements = useMemo(() => layout(items, columns), [items, columns])
  const rows = placements.reduce((n, p) => Math.max(n, p.row + p.h), 0)
  const latest = useRef({ items, metrics, onChange })
  latest.current.metrics = metrics; latest.current.onChange = onChange
  useIsoLayoutEffect(() => { latest.current.items = items }, [items])
  const commit = useCallback((next: WidgetItem[]) => { latest.current.items = next; setItems(next) }, [])
  const toSlot = useCallback((box: Box): Slot => {
    const el = grid.current; const { unit } = latest.current.metrics; const rect = el?.getBoundingClientRect()
    const colStep = unit + gap; const rowStep = Math.round(unit) + gap
    const left = (rect?.left ?? 0) + box.col * colStep; const top = (rect?.top ?? 0) + box.row * rowStep
    return { left, top, right: left + box.w * colStep - gap, bottom: top + box.h * rowStep - gap }
  }, [gap])
  const [held, setHeld] = useState(null as string | null)
  const [raised, setRaised] = useState(null as string | null)
  const [landed, setLanded] = useState(null as string | null)
  const dragging = useRef(null as string | null); const startOrder = useRef(null as WidgetItem[] | null)
  const frame = useRef(0); const lastMove = useRef(0); const swallowUntil = useRef(0)
  const ring = useRef(0); const refocus = useRef(null as string | null)
  const step = useCallback((force = false) => {
    frame.current = 0; const id = dragging.current; const { items: current, metrics: m } = latest.current
    const el = id ? grid.current?.querySelector(`[data-widget-id="${CSS.escape(id)}"]`) as HTMLElement | null : null
    if (!id || !el || !m.columns) return
    const now = performance.now()
    if (!force && now - lastMove.current < SETTLE_MS) { frame.current = requestAnimationFrame(() => step()); return }
    const me = layout(current, m.columns).find(p => p.id === id); if (!me) return
    const r = el.getBoundingClientRect()
    const order = choose(toSlot(me), candidatesFor(current, id, m.columns, toSlot), r.left + r.width / 2, r.top + r.height / 2)
    if (!order) return; lastMove.current = now; commit(canonical(order, m.columns))
  }, [toSlot, commit])
  useEffect(() => () => { cancelAnimationFrame(frame.current); window.clearTimeout(ring.current) }, [])
  useIsoLayoutEffect(() => {
    const id = refocus.current; if (!id) return; refocus.current = null
    const el = grid.current?.querySelector(`[data-widget-id="${CSS.escape(id)}"]`) as HTMLElement | null; el?.focus()
  }, [items])
  const handlers: WidgetHandlers = useMemo(() => ({
    start: id => {
      dragging.current = id; startOrder.current = latest.current.items; lastMove.current = 0; setHeld(id); setRaised(id)
      window.addEventListener('pointerup', () => { swallowUntil.current = performance.now() + 300 }, { once: true, capture: true })
    },
    drag: () => { if (!frame.current) frame.current = requestAnimationFrame(() => step()) },
    end: id => {
      cancelAnimationFrame(frame.current); step(true); frame.current = 0; dragging.current = null; setHeld(null); setLanded(id)
      window.clearTimeout(ring.current); ring.current = window.setTimeout(() => { setLanded(null); setRaised(null) }, LANDED_MS)
      const before = startOrder.current; startOrder.current = null; const after = latest.current.items
      if (before && !sameOrder(before, after)) latest.current.onChange?.(after)
    },
    key: (e, id) => {
      if (!editable || !e.altKey) return
      if ((e.target as HTMLElement).closest('input, textarea, select')) return
      const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
      if (!delta) return; e.preventDefault()
      const { items: current, metrics: m } = latest.current; const cols = m.columns || maxColumns
      const from = current.findIndex(it => it.id === id)
      for (let to = from + delta; to >= 0 && to < current.length; to += delta) {
        const next = canonical(moveTo(current, id, to), cols)
        if (sameOrder(next, current)) continue; refocus.current = id; commit(next); latest.current.onChange?.(next); return
      }
    },
    swallow: () => performance.now() < swallowUntil.current,
    suppressClick: () => { swallowUntil.current = performance.now() + 300 },
  }), [step, commit, editable, maxColumns])
  const byId = useMemo(() => new Map(items.map(it => [it.id, it])), [items])
  const domOrder = useRef(items.map(it => it.id))
  for (const item of items) if (!domOrder.current.includes(item.id)) domOrder.current.push(item.id)
  const placementById = new Map(placements.map(p => [p.id, p]))
  const visualIndex = new Map([...placements].sort((a, b) => a.row - b.row || a.col - b.col).map((p, i) => [p.id, i]))
  return (
    <MotionConfig reducedMotion="user">
      <div className={`relative w-full ${className}`} style={{ '--widget-radius': `${radius}px` } as CSSProperties}>
        {editable && <p id={hintId} className="sr-only">Drag to rearrange. On touch screens, press and hold first. With a keyboard, hold Alt and press the arrow keys.</p>}
        <div ref={grid} role="list" data-slot="widget-grid" className="grid w-full"
          style={{ gap, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridAutoRows: metrics.unit ? `${Math.round(metrics.unit)}px` : `minmax(${cellSize * 0.75}px, auto)` }}>
          {domOrder.current.map(id => {
            const item = byId.get(id); const p = placementById.get(id); if (!item || !p) return null
            return <Widget key={id} position={(visualIndex.get(id) ?? 0) + 1} count={placements.length} item={item} col={p.col} row={p.row} w={p.w} h={p.h} columns={columns} rows={rows} editable={editable} held={held === p.id} raised={raised === p.id} landed={landed === p.id} handlers={handlers} hintId={hintId} renderItem={renderItem as (item: never, size: WidgetSize) => ReactNode} />
          })}
        </div>
      </div>
    </MotionConfig>
  )
}

export default DraggableWidgetGrid
