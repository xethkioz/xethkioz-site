import { useAdminSession } from '../hooks'

const adSlots = [
  { id: 'home-hero', label: 'Home Hero', placement: 'Inicio / portada', status: 'Planificado' },
  { id: 'news-inline', label: 'News Inline', placement: 'Entre tarjetas de noticias', status: 'Planificado' },
  { id: 'section-sidebar', label: 'Section Sidebar', placement: 'Gaming / Science / Fun / Green Node', status: 'Planificado' },
  { id: 'stream-banner', label: 'Stream Banner', placement: 'Avisos Kick / Twitch / YouTube', status: 'Planificado' },
]

export default function CmsAdsManager() {
  const { role, canManageAds } = useAdminSession()

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">ADS CONTROL</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Publicidades y sponsors</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Base operativa para gestionar espacios publicitarios dentro de XETHKIOZ. La creación, edición y activación queda reservada para ADMIN.
        </p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">
          Rol actual: <strong>{role}</strong> · Permiso ads: <strong>{canManageAds ? 'habilitado' : 'solo lectura'}</strong>
        </p>
      </div>

      {!canManageAds ? (
        <article className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100">
          <h3 className="text-xl font-black">Solo ADMIN puede administrar publicidades</h3>
          <p className="mt-2 text-sm leading-6">Moderadores y editores pueden revisar el mapa de espacios, pero no crear, borrar ni activar campañas.</p>
        </article>
      ) : (
        <article className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-100">
          <h3 className="text-xl font-black">ADMIN habilitado</h3>
          <p className="mt-2 text-sm leading-6">Próximo bloque: formulario real para crear campañas, fechas, secciones, link destino e imagen/banner.</p>
        </article>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adSlots.map((slot) => (
          <article key={slot.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">{slot.label}</p>
            <h3 className="mt-3 text-xl font-black">{slot.placement}</h3>
            <p className="mt-3 rounded-full border border-purple-400/30 px-3 py-2 text-xs uppercase tracking-[0.16em] text-purple-100">{slot.status}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 text-sm leading-6 text-purple-100">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">Reglas iniciales</p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Los banners deben ser aprobados por ADMIN.</li>
          <li>No se aceptan publicidades engañosas, apuestas, drogas, armas ni contenido sensible.</li>
          <li>Cada campaña debe tener fuente, sponsor, fecha de inicio, fecha de fin y ubicación.</li>
          <li>Los moderadores no pueden activar ni eliminar campañas.</li>
        </ul>
      </div>
    </section>
  )
}
