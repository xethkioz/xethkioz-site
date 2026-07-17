import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

type VisitLog = { id: number; visited_at: string; route: string; ip_address: string | null; device_type: string; os_family: string | null; browser_family: string | null; viewport_width: number | null; viewport_height: number | null; country_code: string | null; region_code: string | null; language: string | null; referrer_host: string | null }

export default function CmsTrafficLogs() {
  const [logs, setLogs] = useState<VisitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    void supabase.from('site_visit_logs').select('id,visited_at,route,ip_address,device_type,os_family,browser_family,viewport_width,viewport_height,country_code,region_code,language,referrer_host').order('visited_at', { ascending: false }).limit(250).then(({ data, error: queryError }) => {
      if (!alive) return
      if (queryError) setError(queryError.message)
      else setLogs((data ?? []) as VisitLog[])
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const stats = useMemo(() => ({ total: logs.length, mobile: logs.filter((log) => log.device_type === 'mobile').length, desktop: logs.filter((log) => log.device_type === 'desktop').length, routes: new Set(logs.map((log) => log.route)).size }), [logs])
  const formatDate = (value: string) => new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value))

  return <section className="space-y-6 text-white">
    <header className="rounded-3xl border border-emerald-500/25 bg-black/35 p-6"><p className="text-xs font-black uppercase tracking-[.3em] text-emerald-300">SYSTEM / TRAFFIC LOGS</p><h1 className="mt-3 text-3xl font-black md:text-4xl">Tráfico técnico</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-100/75">Diagnóstico privado de compatibilidad y funcionamiento. Acceso ADMIN; retención máxima de 30 días.</p></header>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Registros', stats.total], ['Mobile', stats.mobile], ['Desktop', stats.desktop], ['Rutas', stats.routes]].map(([label, value]) => <article key={label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><small className="uppercase tracking-[.16em] text-emerald-200">{label}</small><b className="mt-2 block text-3xl">{value}</b></article>)}</div>
    {loading ? <p className="rounded-2xl border border-white/10 p-5">Cargando registros…</p> : null}{error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
    {!loading && !error ? <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="min-w-[1050px] w-full text-left text-xs"><thead className="bg-emerald-500/10 text-emerald-200"><tr>{['Fecha','Ruta','IP','Dispositivo','Sistema / navegador','Pantalla','Zona','Referente'].map((item) => <th key={item} className="p-3 uppercase tracking-[.12em]">{item}</th>)}</tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-t border-white/10 bg-black/20"><td className="p-3 whitespace-nowrap">{formatDate(log.visited_at)}</td><td className="p-3 max-w-64 break-all text-orange-200">{log.route}</td><td className="p-3 font-mono">{log.ip_address ?? '—'}</td><td className="p-3 uppercase">{log.device_type}</td><td className="p-3">{log.os_family ?? '—'} / {log.browser_family ?? '—'}</td><td className="p-3">{log.viewport_width && log.viewport_height ? `${log.viewport_width}×${log.viewport_height}` : '—'}</td><td className="p-3">{[log.country_code, log.region_code, log.language].filter(Boolean).join(' · ') || '—'}</td><td className="p-3">{log.referrer_host ?? 'Directo'}</td></tr>)}</tbody></table></div> : null}
  </section>
}
