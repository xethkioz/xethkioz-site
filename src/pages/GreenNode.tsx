import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle, type PublicNewsCategory } from '../services/news/publicNewsService'

type NodeBlock = { id: string; title: string; text: string; signal: string; category: PublicNewsCategory; steps: readonly string[] }

type GreenCopy = {
  title: string
  description: string
  close: string
  status: string
  open: string
  active: string
  articleTitle: string
  read: string
  explore: string
  liveSignal: string
  sync: string
  loading: string
  blocks: readonly NodeBlock[]
}

const content: Record<'es' | 'en', GreenCopy> = {
  es: {
    title: 'Green Node',
    description: 'Nodo para Linux, programación, buenas prácticas digitales y documentación.',
    close: 'Cerrar portal',
    status: 'Estado: sección conectada a lectura técnica ampliada con fuentes visibles.',
    open: 'Abrir nodo',
    active: 'Nodo activo',
    articleTitle: 'Green Node // técnica y documentación',
    read: 'Leer completa',
    explore: 'Explorar archivo completo',
    liveSignal: 'Señal Wisp estable',
    sync: 'Sincronizado con el radar editorial',
    loading: 'Sincronizando publicaciones técnicas…',
    blocks: [
      { id: 'linux', title: 'Linux / Open Source', text: 'Bases limpias para usuarios nuevos, herramientas libres y cultura open source.', signal: 'LINUX_CORE', category: 'green', steps: ['Elegir una distribución amigable', 'Dominar archivos, permisos y terminal', 'Crear un entorno de trabajo recuperable'] },
      { id: 'programming', title: 'Programación', text: 'Rutas de aprendizaje, web, scripts, automatización y buenas prácticas.', signal: 'CODE_PATH', category: 'programming', steps: ['Entender lógica y control de versiones', 'Construir proyectos pequeños y verificables', 'Documentar decisiones antes de escalar'] },
      { id: 'privacy', title: 'Higiene digital educativa', text: 'Cuentas, contraseñas, 2FA y orden básico para creadores.', signal: 'SAFE_MODE', category: 'tech', steps: ['Activar 2FA y claves únicas', 'Separar cuentas personales y de proyecto', 'Mantener backups probados y actualizados'] },
      { id: 'research', title: 'Documentación', text: 'Archivo, fuentes, notas, seguimiento y límites editoriales claros.', signal: 'EVIDENCE_LOG', category: 'science', steps: ['Guardar fuente y fecha', 'Separar evidencia, inferencia y opinión', 'Actualizar conclusiones cuando cambien los datos'] },
    ],
  },
  en: {
    title: 'Green Node',
    description: 'Node for Linux, programming, digital good practices and documentation.',
    close: 'Close portal',
    status: 'Status: section connected to expanded technical reading with visible sources.',
    open: 'Open node',
    active: 'Active node',
    articleTitle: 'Green Node // tech and documentation',
    read: 'Read full article',
    explore: 'Explore full archive',
    liveSignal: 'Stable Wisp signal',
    sync: 'Synced with the editorial radar',
    loading: 'Syncing technical publications…',
    blocks: [
      { id: 'linux', title: 'Linux / Open Source', text: 'Clean basics for new users, free tools and open-source culture.', signal: 'LINUX_CORE', category: 'green', steps: ['Choose a beginner-friendly distribution', 'Master files, permissions and terminal', 'Build a recoverable workspace'] },
      { id: 'programming', title: 'Programming', text: 'Learning paths, web, scripts, automation and good practices.', signal: 'CODE_PATH', category: 'programming', steps: ['Learn logic and version control', 'Build small verifiable projects', 'Document decisions before scaling'] },
      { id: 'privacy', title: 'Digital hygiene', text: 'Accounts, passwords, 2FA and basic order for creators.', signal: 'SAFE_MODE', category: 'tech', steps: ['Enable 2FA and unique passwords', 'Separate personal and project accounts', 'Keep tested and current backups'] },
      { id: 'research', title: 'Documentation', text: 'Archives, sources, notes, tracking and clear editorial limits.', signal: 'EVIDENCE_LOG', category: 'science', steps: ['Save source and date', 'Separate evidence, inference and opinion', 'Update conclusions when data changes'] },
    ],
  },
}

export default function GreenNode() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const [publishedArticles, setPublishedArticles] = useState<PublicNewsArticle[]>([])
  const [loadingNews, setLoadingNews] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetchPublishedNews('green'),
      fetchPublishedNews('programming'),
      fetchPublishedNews('tech'),
      fetchPublishedNews('science'),
    ]).then((groups) => {
      if (!mounted) return
      const seen = new Set<string>()
      setPublishedArticles(groups.flat().filter((article) => {
        if (seen.has(article.slug)) return false
        seen.add(article.slug)
        return true
      }))
    }).catch(() => {
      if (mounted) setPublishedArticles([])
    }).finally(() => {
      if (mounted) setLoadingNews(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const articles = useMemo(() => {
    const curated = [...getCuratedExternalNews('tech'), ...getCuratedExternalNews('science')]
    const seen = new Set<string>()
    const merged = [...publishedArticles, ...curated].filter((article) => {
      if (seen.has(article.slug)) return false
      seen.add(article.slug)
      return true
    })
    const matching = merged.filter((article) => article.category === active.category)
    return (matching.length ? matching : merged).slice(0, 6)
  }, [active.category, publishedArticles])

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/green-node" />
      <section className="xk-green-shell px-4 py-12 sm:px-6 lg:px-8">
        <div className="xk-green-matrix" aria-hidden="true" />
        <div className="mx-auto max-w-7xl">
          <div className="xk-green-frame rounded-[2rem] bg-black/78 p-6 md:p-10">
            <div className="xk-green-content">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#32FF8A]/70">REALITY_OVERRIDE // WISP_ACCESS_GRANTED</p>
                <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-[#32FF8A]/50 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10">{lang.toUpperCase()}</button>
              </div>
              <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                <div>
                  <h1 className="font-mono text-4xl font-black uppercase tracking-[0.18em] text-[#D8FFE8] md:text-6xl">{t.title}</h1>
                  <p className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-[#B9FFD1] md:text-base">{t.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2 font-mono text-[9px] font-black uppercase tracking-[0.18em]">
                    <span className="rounded-full border border-[#32FF8A]/35 bg-[#32FF8A]/[0.07] px-3 py-2 text-[#32FF8A]">● {t.liveSignal}</span>
                    <span className="rounded-full border border-white/10 px-3 py-2 text-[#B9FFD1]/65">{t.sync}</span>
                  </div>
                </div>
                <div className="xk-green-core" aria-hidden="true">
                  <span className="xk-green-core-ring" />
                  <span className="xk-green-core-ring xk-green-core-ring-delayed" />
                  <img src="/assets/green-wisp.png" alt="" className="relative z-10 h-28 w-28 object-contain drop-shadow-[0_0_28px_rgba(50,255,138,.9)]" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {t.blocks.map((node) => (
                  <button key={node.id} type="button" onClick={() => setActiveId(node.id)} aria-pressed={active.id === node.id} className={`group rounded-2xl border p-5 text-left font-mono shadow-[0_0_18px_rgba(50,255,138,.12)] transition hover:-translate-y-1 ${active.id === node.id ? 'border-[#D8FFE8]/70 bg-[#0A2612]' : 'border-[#32FF8A]/35 bg-[#031006]/80 hover:border-[#32FF8A]/80'}`}>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/55">{node.signal}</p>
                    <h2 className="mt-3 text-lg font-black uppercase tracking-[0.12em] text-[#D8FFE8]">{node.title}</h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{node.text}</p>
                    <span className="mt-4 inline-flex text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
                  </button>
                ))}
              </div>

              <section className="mt-6 overflow-hidden rounded-2xl border border-[#32FF8A]/35 bg-[radial-gradient(circle_at_90%_10%,rgba(50,255,138,.13),transparent_32%),rgba(3,16,6,.88)] p-5 font-mono md:p-7" aria-live="polite">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#32FF8A]/60">{t.active} // {active.signal}</p>
                    <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-[#D8FFE8] md:text-3xl">{active.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#B9FFD1]/75">{active.text}</p>
                  </div>
                  <Link to={`/news?category=${active.category}`} className="shrink-0 rounded-full border border-[#32FF8A]/45 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10">{t.explore} →</Link>
                </div>
                <ol className="mt-6 grid gap-3 md:grid-cols-3">
                  {active.steps.map((step, index) => <li key={step} className="flex gap-3 rounded-xl border border-[#32FF8A]/15 bg-black/35 p-4 text-xs leading-6 text-[#B9FFD1]/80"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#32FF8A]/30 text-[9px] font-black text-[#32FF8A]">0{index + 1}</span><span>{step}</span></li>)}
                </ol>
              </section>

              <section className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{t.articleTitle}</p>
                {loadingNews ? <p className="mt-4 text-xs text-[#B9FFD1]/60">{t.loading}</p> : null}
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {articles.map((article) => (
                    <article key={article.slug} className="group overflow-hidden rounded-2xl border border-[#32FF8A]/20 bg-[#031006]/80 p-5 transition hover:-translate-y-1 hover:border-[#32FF8A]/70">
                      {article.cover_image_url ? <SafeImage src={article.cover_image_url} fallback="/images/articles/tech.svg" alt={article.cover_image_alt || article.title} className="mb-4 aspect-[16/8] w-full rounded-xl object-cover transition duration-700 group-hover:scale-[1.025]" /> : null}
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]/70">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                      <h3 className="mt-3 text-sm font-black uppercase text-[#D8FFE8]">{article.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{article.summary}</p>
                      <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
                    </article>
                  ))}
                </div>
              </section>

              <div className="mt-8">
                <PublicAdSlot slotId="section-sidebar" fallbackLabel="XETHKIOZ GREEN NODE SPONSOR" />
              </div>

              <div className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono text-xs leading-relaxed text-[#B9FFD1]">{t.status}</div>

              <Link to="/" className="mt-8 inline-flex rounded-full border border-[#32FF8A]/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_18px_rgba(50,255,138,.24)]">{t.close}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
