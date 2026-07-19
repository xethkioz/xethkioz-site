import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

type VisitLog = { id: number; visited_at: string; route: string; ip_address: string | null; device_type: string; os_family: string | null; browser_family: string | null; viewport_width: number | null; viewport_height: number | null; country_code: string | null; region_code: string | null; language: string | null; referrer_host: string | null }
type DeviceFilter = 'all' | 'mobile' | 'tablet' | 'desktop'
type BreakdownPanel = { title: string; entries: [string, number][] }

const deviceLabels: Record<DeviceFilter, string> = {
  all: 'Todos los dispositivos',
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
}

function countBy(logs: VisitLog[], readKey: (log: VisitLog) => string) {
  const counts = new Map<string, number>()
  for (const log of logs) {
    const key = readKey(log) || 'Sin identificar'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

export default function CmsTrafficLogs() {
  const [logs, setLogs] = useState<VisitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('all')
  const [routeQuery, setRouteQuery] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    void supabase.from('site_visit_logs').select('id,visited_at,route,ip_address,device_type,os_family,browser_family,viewport_width,viewport_height,country_code,region_code,language,referrer_host').order('visited_at', { ascending: false }).limit(500).then(({ data, error: queryError }) => {
      if (!alive) return
      if (queryError) setError(queryError.message)
      else setLogs((data ?? []) as VisitLog[])
      setLoading(false)
    })
    return () => { alive = false }
  }, [refreshKey])

  const filteredLogs = useMemo(() => {
    const normalizedQuery = routeQuery.trim().toLocaleLowerCase('es')
    return logs.filter((log) => {
      if (deviceFilter !== 'all' && log.device_type !== deviceFilter) return false
      if (normalizedQuery && !log.route.toLocaleLowerCase('es').includes(normalizedQuery)) return false
      return true
    })
  }, [deviceFilter, logs, routeQuery])

  const stats = useMemo(() => {
    const mobile = logs.filter((log) => log.device_type === 'mobile').length
    return {
      total: logs.length,
      visitors: new Set(logs.map((log) => log.ip_address).filter(Boolean)).size,
      mobile,
      mobileShare: logs.length ? Math.round((mobile / logs.length) * 100) : 0,
      routes: new Set(logs.map((log) => log.route)).size,
      latest: logs[0]?.visited_at ?? null,
    }
  }, [logs])
  const deviceBreakdown = useMemo(() => countBy(logs, (log) => log.device_type), [logs])
  const routeBreakdown = useMemo(() => countBy(logs, (log) => log.route).slice(0, 5), [logs])
  const browserBreakdown = useMemo(() => countBy(logs, (log) => `${log.browser_family ?? 'Otro'} · ${log.os_family ?? 'Otro'}`).slice(0, 5), [logs])
  const breakdownPanels = useMemo<BreakdownPanel[]>(() => [
    { title: 'Dispositivos', entries: deviceBreakdown },
    { title: 'Rutas principales', entries: routeBreakdown },
    { title: 'Navegadores', entries: browserBreakdown },
  ], [browserBreakdown, deviceBreakdown, routeBreakdown])
  const formatDate = (value: string) => new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value))

  return <section className="space-y-6 text-white">
    <header className="flex flex-col gap-5 rounded-3xl border border-emerald-500/25 bg-[radial-gradient(circle_at_90%_0%,rgba(16,185,129,.14),transparent_34%),rgba(0,0,0,.35)] p-6 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-xs font-black uppercase tracking-[.3em] text-emerald-300">SYSTEM / TRAFFIC LOGS</p><h1 className="mt-3 text-3xl font-black md:text-4xl">Tráfico técnico</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-100/75">Diagnóstico privado de compatibilidad y funcionamiento. Acceso ADMIN; retención máxima de 30 días.</p></div>
      <button type="button" onClick={() => setRefreshKey((current) => current + 1)} disabled={loading} className="min-h-11 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-5 font-mono text-xs font-black uppercase tracking-[.16em] text-emerald-200 transition hover:bg-emerald-400/15 disabled:cursor-wait disabled:opacity-50">{loading ? 'Sincronizando…' : 'Actualizar registros'}</button>
    </header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[
      ['Registros', stats.total, 'últimos 30 días'],
      ['Visitantes', stats.visitors, 'IPs únicas'],
      ['Mobile', `${stats.mobileShare}%`, `${stats.mobile} accesos`],
      ['Rutas', stats.routes, 'secciones visitadas'],
      ['Último acceso', stats.latest ? formatDate(stats.latest) : '—', 'hora argentina'],
    ].map(([label, value, detail]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><small className="uppercase tracking-[.16em] text-emerald-200">{label}</small><b className={`mt-2 block ${label === 'Último acceso' ? 'text-base' : 'text-3xl'}`}>{value}</b><span className="mt-2 block text-[11px] text-white/40">{detail}</span></article>)}</div>
    <div className="grid gap-4 xl:grid-cols-3">
      {breakdownPanels.map(({ title, entries }) => <article key={title} className="rounded-2xl border border-white/10 bg-black/25 p-5"><h2 className="font-mono text-xs font-black uppercase tracking-[.18em] text-emerald-200">{title}</h2><div className="mt-4 space-y-3">{entries.map(([label, value]) => <div key={label}><div className="flex items-center justify-between gap-4 text-xs"><span className="truncate text-white/75">{label}</span><b>{value}</b></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5"><span className="block h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-300" style={{ width: `${Math.max(4, Math.round((value / Math.max(1, stats.total)) * 100))}%` }} /></div></div>)}</div></article>)}
    </div>
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
      <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.14em] text-emerald-200">Buscar ruta<input type="search" value={routeQuery} onChange={(event) => setRouteQuery(event.target.value)} placeholder="/gaming, /green-node…" className="min-h-11 rounded-xl border border-white/10 bg-black/45 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none placeholder:text-white/25 focus:border-emerald-300" /></label>
      <label className="grid gap-2 text-[10px] font-black uppercase tracking-[.14em] text-emerald-200">Dispositivo<select value={deviceFilter} onChange={(event) => setDeviceFilter(event.target.value as DeviceFilter)} className="min-h-11 rounded-xl border border-white/10 bg-black/45 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none focus:border-emerald-300">{(Object.keys(deviceLabels) as DeviceFilter[]).map((value) => <option key={value} value={value}>{deviceLabels[value]}</option>)}</select></label>
      <button type="button" onClick={() => { setRouteQuery(''); setDeviceFilter('all') }} className="min-h-11 rounded-xl border border-white/10 px-4 text-xs font-black uppercase tracking-[.12em] text-white/60 transition hover:border-white/25 hover:text-white">Limpiar</button>
    </div>
    {loading ? <p className="rounded-2xl border border-white/10 p-5">Cargando registros…</p> : null}{error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
    {!loading && !error ? <div className="overflow-x-auto rounded-2xl border border-white/10"><div className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/35 px-4 py-3 text-[10px] uppercase tracking-[.14em] text-white/45"><span>Detalle técnico</span><b className="text-emerald-200">{filteredLogs.length} registros visibles</b></div><table className="min-w-[1050px] w-full text-left text-xs"><caption className="sr-only">Registros técnicos de navegación del sitio</caption><thead className="bg-emerald-500/10 text-emerald-200"><tr>{['Fecha','Ruta','IP','Dispositivo','Sistema / navegador','Pantalla','Zona','Referente'].map((item) => <th key={item} className="p-3 uppercase tracking-[.12em]">{item}</th>)}</tr></thead><tbody>{filteredLogs.map((log) => <tr key={log.id} className="border-t border-white/10 bg-black/20 transition hover:bg-emerald-400/[.04]"><td className="p-3 whitespace-nowrap">{formatDate(log.visited_at)}</td><td className="p-3 max-w-64 break-all text-orange-200">{log.route}</td><td className="p-3 font-mono">{log.ip_address ?? '—'}</td><td className="p-3 uppercase">{log.device_type}</td><td className="p-3">{log.os_family ?? '—'} / {log.browser_family ?? '—'}</td><td className="p-3">{log.viewport_width && log.viewport_height ? `${log.viewport_width}×${log.viewport_height}` : '—'}</td><td className="p-3">{[log.country_code, log.region_code, log.language].filter(Boolean).join(' · ') || '—'}</td><td className="p-3">{log.referrer_host ?? 'Directo'}</td></tr>)}</tbody></table>{filteredLogs.length === 0 ? <p className="border-t border-white/10 p-6 text-center text-sm text-white/45">No hay registros que coincidan con los filtros.</p> : null}</div> : null}
  </section>
}
