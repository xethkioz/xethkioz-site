import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import { fallbackArticles, fallbackCategories, fallbackMedia } from '../lib/mockData'
import { SITE_VERSION } from '../lib/siteConfig'
import DailyNewsSourcesPanel from '../components/DailyNewsSourcesPanel'
import RoleLadder from '../components/RoleLadder'
import DatabaseBaselinePanel from '../components/DatabaseBaselinePanel'
import ContentOpsDashboard from '../components/ContentOpsDashboard'
import EditorialCommandCenter from '../components/EditorialCommandCenter'

const checklist = [
  'Título claro y sin clickbait',
  'Bajada optimizada para SEO',
  'Categoría y etiquetas cargadas',
  'Portada 16:9 lista para redes',
  'Open Graph preparado',
  'Artículo relacionado seleccionado',
  'Revisión humana antes de publicar',
]

export default function CmsStudio() {
  const [mode, setMode] = useState<'draft' | 'seo' | 'media'>('draft')
  const articles = fallbackArticles.slice(0, 6)
  const hero = articles[0]
  const media = fallbackMedia.slice(0, 6)
  const categories = useMemo(() => fallbackCategories.filter((c) => ['gaming', 'tech', 'science', 'streaming'].includes(c.portal)), [])

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="CMS Studio"
        description="Panel visual base para administrar noticias, multimedia, SEO y publicaciones de XETHKIOZ."
        url="/cms"
      />

      <section className="relative overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 p-6 md:p-8 mb-8 shadow-[0_0_48px_rgba(255,106,0,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
          <div>
            <p className="section-eyebrow">XETHKIOZ ADMIN FOUNDATION</p>
            <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">CMS Studio</h1>
            <p className="text-gray-300 max-w-2xl leading-relaxed">
              Base visual para publicar noticias, ordenar multimedia, preparar SEO y dejar listo el flujo editorial antes de conectarlo completamente con Supabase.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/admin" className="btn-primary">Ir al Admin protegido</Link>
              <Link to="/content-system" className="btn-secondary">Content OS</Link>
              <Link to="/live-checklist" className="btn-secondary">Checklist LIVE</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-orange mb-3">Estado de versión</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3"><span className="text-gray-500">Versión</span><strong className="block text-white">{SITE_VERSION}</strong></div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3"><span className="text-gray-500">Modo</span><strong className="block text-green-300">Preview</strong></div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3"><span className="text-gray-500">CMS</span><strong className="block text-orange">Preparado</strong></div>
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3"><span className="text-gray-500">Realtime</span><strong className="block text-neon">Próximo sprint</strong></div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8">
        <EditorialCommandCenter />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ['draft', '📰 Redacción'],
          ['seo', '🌍 SEO'],
          ['media', '🎬 Multimedia'],
        ].map(([key, label]) => (
          <button key={key} onClick={() => setMode(key as typeof mode)} className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${mode === key ? 'border-orange bg-orange/10 text-orange' : 'border-white/10 text-gray-400 hover:text-white'}`}>{label}</button>
        ))}
      </div>

      {mode === 'draft' && (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-6">
          <article className="news-card rounded-2xl overflow-hidden border border-orange/20">
            <div className="aspect-video"><SafeImage src={hero.cover_image} alt={hero.title} fallback="/images/articles/fallback.svg" className="w-full h-full object-cover" /></div>
            <div className="p-5">
              <span className="tag-badge">{hero.category?.name}</span>
              <h2 className="font-display text-2xl font-black text-white mt-3">{hero.title}</h2>
              <p className="text-gray-400 mt-2">{hero.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">{hero.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">#{tag}</span>)}</div>
            </div>
          </article>

          <div className="space-y-4">
            <div className="glass rounded-2xl border border-white/10 p-5">
              <h3 className="font-display text-xl font-bold text-white mb-4">Cola editorial</h3>
              <div className="space-y-3">
                {articles.slice(1).map((article) => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:border-orange/40 transition-all">
                    <SafeImage src={article.cover_image} alt={article.title} fallback="/images/articles/fallback.svg" className="h-16 w-24 rounded-lg object-cover" />
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-orange">{article.category?.name}</p>
                      <h4 className="font-display text-sm font-bold text-white line-clamp-2">{article.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === 'seo' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl border border-white/10 p-6">
            <h2 className="font-display text-2xl font-black text-white mb-4">Asistente editorial con IA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea className="input-field min-h-44" defaultValue={'Pegá acá un enlace, idea o noticia base. El asistente generará título, bajada, etiquetas, SEO y estructura del artículo.'} />
              <div className="rounded-2xl border border-neon/25 bg-neon/10 p-4">
                <p className="section-eyebrow">Salida sugerida</p>
                <h3 className="font-display text-xl font-bold text-white">Título optimizado + enfoque XETHKIOZ</h3>
                <p className="text-sm text-gray-300 mt-2">Resumen corto, tags, descripción para Open Graph, slug, categoría y checklist de verificación antes de publicar.</p>
                <button className="btn-primary mt-4">Generar borrador</button>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl border border-white/10 p-6">
            <h3 className="font-display text-xl font-bold text-white mb-4">Checklist SEO</h3>
            <ul className="space-y-3">
              {checklist.map((item) => <li key={item} className="flex gap-2 text-sm text-gray-300"><span className="text-green-300">✓</span>{item}</li>)}
            </ul>
          </div>
        </section>
      )}

      {mode === 'media' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <article key={item.id} className="news-card rounded-2xl overflow-hidden border border-white/10">
              <div className="aspect-video"><SafeImage src={item.thumbnail || item.url} alt={item.title} fallback="/images/media/video-placeholder.svg" className="h-full w-full object-cover" /></div>
              <div className="p-4">
                <span className="tag-badge uppercase">{item.type}</span>
                <h3 className="font-display text-lg font-bold text-white mt-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </article>
          ))}
        </section>
      )}


      <section className="mt-10 space-y-6">
        <ContentOpsDashboard />
        <DailyNewsSourcesPanel />
        <DatabaseBaselinePanel />
        <RoleLadder />
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.slice(0, 8).map((cat) => (
          <div key={cat.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-2xl mb-2">{cat.icon}</div>
            <h3 className="font-display text-white font-bold">{cat.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
