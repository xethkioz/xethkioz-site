import SEO from '../components/SEO'
import DailyNewsSourcesPanel from '../components/DailyNewsSourcesPanel'
import { trustedNewsSources } from '../lib/newsSources'
import ContentOpsDashboard from '../components/ContentOpsDashboard'

export default function NewsEngine() {
  const ready = trustedNewsSources.filter((s) => s.status === 'ready').length
  const review = trustedNewsSources.filter((s) => s.status === 'manual-review').length

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="News Engine"
        description="Base de fuentes externas, atribución editorial y actualización diaria preparada para XETHKIOZ."
        url="/news-engine"
      />

      <section className="relative overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 p-6 md:p-8 mb-8 shadow-[0_0_48px_rgba(255,106,0,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
          <div>
            <p className="section-eyebrow">XETHKIOZ RC1</p>
            <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">Dynamic News Platform</h1>
            <p className="text-gray-300 max-w-2xl leading-relaxed">
              Motor editorial preparado para combinar noticias propias del CMS con fuentes externas verificadas. La automatización diaria queda diseñada para trabajar con atribución, revisión humana y resúmenes propios.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
              <span className="text-xs uppercase tracking-[0.22em] text-green-300">Ready</span>
              <strong className="block font-display text-3xl text-white mt-2">{ready}</strong>
              <p className="text-xs text-gray-400 mt-1">fuentes oficiales o RSS claras</p>
            </div>
            <div className="rounded-2xl border border-orange/20 bg-orange/10 p-4">
              <span className="text-xs uppercase tracking-[0.22em] text-orange">Review</span>
              <strong className="block font-display text-3xl text-white mt-2">{review}</strong>
              <p className="text-xs text-gray-400 mt-1">fuentes con revisión manual</p>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/10 bg-black/25 p-4">
              <span className="text-xs uppercase tracking-[0.22em] text-neon">Regla clave</span>
              <p className="text-sm text-gray-300 mt-2">
                XETHKIOZ no copia artículos: usa fuentes como disparador, enlaza al original y publica análisis propio.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8"><ContentOpsDashboard /></div>
      <DailyNewsSourcesPanel />
    </div>
  )
}
