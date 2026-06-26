import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Logo from '../components/Logo'
import ArticleCard from '../components/ArticleCard'
import SafeImage from '../components/SafeImage'
import SocialSection from '../components/SocialSection'
import { useArticles, useStreams } from '../lib/hooks'
import { fallbackArticles } from '../lib/mockData'
import { GREEN_WISP_FORMS, v7Principles } from '../lib/greenWispCore'

const portals = [
  { title: 'Gaming Hub', desc: 'Noticias, directos, análisis y comunidad gamer.', to: '/gaming', tone: 'border-orange/30 bg-orange/10 text-orange' },
  { title: 'Tech Lab', desc: 'Tecnología, hardware, software y herramientas.', to: '/tech', tone: 'border-sky-400/30 bg-sky-400/10 text-sky-200' },
  { title: 'AI Lab', desc: 'IA aplicada a contenido, automatización y creatividad.', to: '/ai-lab', tone: 'border-neon/30 bg-neon/10 text-neon' },
  { title: 'Science Lab', desc: 'Divulgación, evidencia y ciencia clara.', to: '/science', tone: 'border-white/15 bg-white/5 text-white' },
  { title: 'Green Node', desc: 'El nodo oculto: Linux, programación y cyber cultura educativa.', to: '/green-node', tone: 'border-green-400/30 bg-green-400/10 text-green-200' },
  { title: 'Comunidad', desc: 'Chat, eventos, perfiles y reputación.', to: '/community', tone: 'border-orange/20 bg-ink-300/60 text-gray-200' },
]

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title gradient-text">{title}</h2>
      {desc && <p className="mt-2 text-sm leading-relaxed text-gray-400 md:text-base">{desc}</p>}
    </div>
  )
}

export default function Home() {
  const { articles, loading } = useArticles({ limit: 6 })
  const { streams } = useStreams({ featured: true })
  const featured = (articles.length ? articles : fallbackArticles).slice(0, 6)
  const hero = featured[0]
  const wisp = GREEN_WISP_FORMS.home

  return (
    <div className="animate-fade-in">
      <SEO />

      <section className="relative overflow-hidden px-4 py-10 md:py-16">
        <div className="absolute inset-0 scanline opacity-10" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_.95fr]">
          <div className="animate-fade-up">
            <Logo size="xl" className="mb-5 max-w-full" />
            <p className="section-eyebrow">XETHKIOZ ECOSYSTEM / V7 FOUNDATION</p>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight text-white md:text-6xl">
              Gaming, tecnología, IA y ciencia con identidad propia.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
              Menos paneles expuestos. Más experiencia. XETHKIOZ se reorganiza como un ecosistema de portales guiado por Green Wisp: la forma etérea de la marca.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/news" className="btn-primary">Ver noticias</Link>
              <Link to="/green-node" className="rounded-lg border border-green-400/35 bg-green-400/10 px-6 py-3 font-semibold text-green-200 transition-all hover:bg-green-400/20">Seguir al Wisp</Link>
              <Link to="/community" className="btn-secondary">Comunidad</Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-300/70 p-4 shadow-[0_0_45px_rgba(124,58,237,.18)]">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <SafeImage src={hero?.cover_image || '/images/articles/gaming-placeholder.svg'} fallback="/images/articles/gaming-placeholder.svg" alt={hero?.title || 'XETHKIOZ'} className="h-[260px] w-full object-cover md:h-[390px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="section-eyebrow">NOTICIA DESTACADA</p>
                <h2 className="mt-2 font-display text-2xl font-black text-white md:text-4xl">{hero?.title || 'XETHKIOZ Network'}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-gray-300">{hero?.excerpt || 'El ecosistema entra en fase de consolidación hasta V7.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="PORTALES" title="Cada sección con un propósito claro" desc="La navegación se reduce a lo que el visitante realmente necesita. Lo interno queda como backstage." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portals.map((portal) => (
              <Link key={portal.to} to={portal.to} className={`group rounded-3xl border p-5 transition-all hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(255,106,0,.12)] ${portal.tone}`}>
                <h3 className="font-display text-xl font-black">{portal.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{portal.desc}</p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.22em] opacity-80 group-hover:opacity-100">Entrar →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-3xl border border-green-400/20 bg-black/55 p-6 shadow-[0_0_35px_rgba(0,255,102,.1)]">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-300">{wisp.label}</p>
            <h2 className="mt-3 font-display text-3xl font-black text-green-100">{wisp.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-green-100/75">{wisp.message}</p>
            <div className="mt-5 rounded-2xl border border-green-400/15 bg-green-400/5 p-4 font-mono text-xs text-green-200">
              aura: {wisp.aura}<br />master egg: evoluciona al entrar en Green Node<br />estado: foundation activo
            </div>
            <Link to={wisp.route} className="mt-5 inline-flex rounded-lg border border-green-400/30 bg-green-400/10 px-5 py-3 font-mono text-xs font-bold text-green-200 hover:bg-green-400/20">{wisp.actionLabel}</Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-300/60 p-6">
            <SectionTitle eyebrow="V7 PRINCIPLES" title="Reglas para no volver a romper la experiencia" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {v7Principles.map((principle, index) => (
                <div key={principle} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-mono text-xs text-orange">0{index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-gray-200">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="EDITORIAL" title="Últimas publicaciones" desc="Pocas tarjetas, mejor jerarquía y carga más liviana para móvil." />
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-gray-400">Cargando publicaciones...</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>
          )}
        </div>
      </section>

      {streams.length > 0 && (
        <section className="px-4 py-8">
          <div className="mx-auto max-w-7xl rounded-3xl border border-orange/20 bg-orange/5 p-6">
            <SectionTitle eyebrow="STREAMING" title="Actividad en vivo y contenido reciente" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {streams.slice(0, 3).map((stream) => (
                <a key={stream.id} href={stream.channel_url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-black/20 p-4 transition-all hover:border-orange/40">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-orange">{stream.platform}</p>
                  <h3 className="mt-2 font-display text-lg font-black text-white">{stream.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{stream.is_live ? 'En vivo ahora' : 'Último contenido destacado'}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <SocialSection />
    </div>
  )
}
