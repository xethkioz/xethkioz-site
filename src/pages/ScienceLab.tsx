import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { PortalPulseRail } from '../components/PortalPulseRail'
import { NexusDistrict } from '../components/NexusDistrict'
import Newsletter from '../components/Newsletter'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle, type PublicNewsCategory } from '../services/news/publicNewsService'

type SectionBlock = { id: string; title: string; text: string }

const content: Record<'es' | 'en', { title: string; description: string; back: string; open: string; status: string; articleTitle: string; read: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Tecnología / Ciencia',
    description: 'Laboratorio técnico para IA, ciencia, hardware, software e infraestructura verificable.',
    back: 'Volver al núcleo',
    open: 'Abrir laboratorio',
    status: 'Estado: sección conectada al radar real de IA, tecnología y ciencia. Cada tarjeta abre lectura ampliada con fuente original.',
    articleTitle: 'Laboratorio // IA + Tech + Ciencia',
    read: 'Leer completa',
    blocks: [
      { id: 'ai', title: 'IA / Modelos', text: 'Análisis, prompts, automatización, gobernanza y modelos locales.' },
      { id: 'science', title: 'Ciencia', text: 'Fuentes, evidencia, pensamiento crítico y contexto.' },
      { id: 'tech', title: 'Tecnología', text: 'Hardware, software, infraestructura, streaming y rendimiento.' },
    ],
  },
  en: {
    title: 'Technology / Science',
    description: 'Technical lab for AI, science, hardware, software and verifiable infrastructure.',
    back: 'Back to core',
    open: 'Open lab',
    status: 'Status: section connected to the real AI, technology and science radar. Each card opens expanded reading with original source.',
    articleTitle: 'Lab // AI + Tech + Science',
    read: 'Read full article',
    blocks: [
      { id: 'ai', title: 'AI / Models', text: 'Analysis, prompts, automation, governance and local models.' },
      { id: 'science', title: 'Science', text: 'Sources, evidence, critical thinking and context.' },
      { id: 'tech', title: 'Technology', text: 'Hardware, software, infrastructure, streaming and performance.' },
    ],
  },
}

export default function ScienceLab() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const [assistantTopic, setAssistantTopic] = useState('ia')
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const categoryByBlock: Record<string, PublicNewsCategory[]> = {
    ai: ['ai'],
    science: ['science'],
    tech: ['tech', 'programming'],
  }
  const articles = useMemo(() => {
    const selected = categoryByBlock[activeId] ?? ['science', 'tech', 'ai']
    const fallback = selected.flatMap((category) => getCuratedExternalNews(category))
    const seen = new Set<string>()
    return [...published.filter((article) => selected.includes(article.category)), ...fallback]
      .filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug)))
      .slice(0, 12)
  }, [activeId, published])

  useEffect(() => {
    let alive = true
    Promise.all(['science', 'tech', 'ai', 'programming'].map((category) => fetchPublishedNews(category as PublicNewsCategory)))
      .then((groups) => {
        if (!alive) return
        const seen = new Set<string>()
        setPublished(groups.flat().filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug))))
      })
      .catch(() => { if (alive) setPublished([]) })
      .finally(() => { if (alive) setLoadingNews(false) })
    return () => { alive = false }
  }, [])
  const stack = [
    { icon: '⚛', name: 'React + TypeScript', detail: 'Interfaz tipada y componentes reutilizables.' },
    { icon: '⚡', name: 'Vite', detail: 'Build rápido y entrega optimizada del frontend.' },
    { icon: '◫', name: 'Supabase', detail: 'Autenticación, base de datos y contenido dinámico.' },
    { icon: '▲', name: 'Vercel', detail: 'Deploy, previews y observabilidad del sitio.' },
    { icon: '◉', name: 'GitHub + Codex', detail: 'Versionado, revisión y automatización asistida.' },
    { icon: '▶', name: 'OBS + FFmpeg', detail: 'Producción y procesamiento audiovisual.' },
  ]
  const assistantAnswers: Record<string, { label: string; answer: string; link: string }> = {
    ia: { label: 'IA útil', answer: 'Empezá por una tarea concreta, definí qué dato puede equivocarse y verificá la salida antes de publicarla. Un buen prompt no reemplaza una buena fuente.', link: '/news?category=ai' },
    web: { label: 'Crear una web', answer: 'Priorizá objetivo, velocidad móvil, accesibilidad y una llamada a la acción medible. El efecto visual sirve cuando acompaña el recorrido.', link: '/creacion-web' },
    performance: { label: 'Rendimiento', answer: 'Medí primero: peso de imágenes, JavaScript inicial y estabilidad visual. Optimizá el cuello de botella real, no el que parece más técnico.', link: '/news?category=tech' },
    security: { label: 'Seguridad', answer: 'Usá 2FA, claves únicas, permisos mínimos y backups probados. Nunca pegues secretos o tokens en un chatbot o repositorio público.', link: '/green-node' },
  }
  const assistant = assistantAnswers[assistantTopic]

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/science" />
      <section className="xk-page xk-blueprint px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel rounded-[2rem] border border-blue-400/45 bg-[#06111f]/80 p-6 shadow-[0_0_28px_rgba(59,130,246,.18)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">DATA_TERMINAL // BLUEPRINT</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-blue-300/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-blue-100">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">{t.description}</p>
          </div>

          <NexusDistrict tone="science" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={`xk-card rounded-3xl border p-5 text-left shadow-[0_0_16px_rgba(139,92,246,.12)] transition ${active.id === item.id ? 'border-[#32FF8A]/70 bg-[#031006]/80' : 'border-blue-300/30 bg-black/50 hover:border-blue-200/70'}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8B5CF6]">{item.title}</p>
                <p className="mt-4 font-mono text-sm leading-relaxed text-gray-300">{item.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <PortalPulseRail
            tone="cyan"
            eyebrow="LAB_LOOP // APRENDER HACIENDO"
            title="La tecnología sirve cuando podés usarla"
            description="Abrí la caja de herramientas, probá una respuesta guiada o llevate una señal semanal con contexto."
            items={[
              { code: 'STACK', title: 'Abrir herramientas', detail: 'El stack real detrás del proyecto', to: '/science#tech-stack', action: 'Inspeccionar' },
              { code: 'ASK', title: 'Consultar al laboratorio', detail: 'Respuestas locales sobre IA y web', to: '/science#lab-assistant', action: 'Probar' },
              { code: 'SIGNAL', title: 'Recibir tendencias', detail: 'Tres noticias útiles por semana', to: '/science#science-newsletter', action: 'Suscribirme' },
            ]}
          />

          <section id="tech-stack" className="xk-tech-stack scroll-mt-28" aria-labelledby="tech-stack-title">
            <div><p>TECH_STACK // HERRAMIENTAS REALES</p><h2 id="tech-stack-title">Cómo está construido XETHKIOZ</h2><span>Herramientas que hoy sostienen la web y el flujo creativo. Sin recomendaciones pagas ni productos inventados.</span></div>
            <div>{stack.map((tool) => <article key={tool.name}><span aria-hidden="true">{tool.icon}</span><div><h3>{tool.name}</h3><p>{tool.detail}</p></div></article>)}</div>
          </section>

          <section id="lab-assistant" className="xk-lab-assistant scroll-mt-28" aria-labelledby="lab-assistant-title">
            <div className="xk-assistant-console"><p>MINI_BOT // MODO LOCAL</p><h2 id="lab-assistant-title">Preguntale al laboratorio</h2><span>Elegí una ruta. Las respuestas están curadas en la página: no se envían datos a una API externa.</span><div role="tablist" aria-label="Temas del asistente">{Object.entries(assistantAnswers).map(([id, item]) => <button key={id} type="button" role="tab" aria-selected={assistantTopic === id} onClick={() => setAssistantTopic(id)}>{item.label}</button>)}</div></div>
            <div className="xk-assistant-answer" role="tabpanel" aria-live="polite"><small>RESPUESTA // {assistant.label}</small><p>{assistant.answer}</p><Link to={assistant.link}>ABRIR RUTA RELACIONADA →</Link></div>
          </section>

          <section className="mt-8 rounded-3xl border border-blue-300/25 bg-black/55 p-5 md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blue-200">{t.articleTitle}</p><h2 className="mt-2 text-2xl font-black uppercase text-white">{active.title}</h2></div>
              <span className="rounded-full border border-[#32FF8A]/30 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#32FF8A]">{loadingNews ? 'SINCRONIZANDO DATOS' : `${articles.length} SEÑALES VERIFICADAS`}</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-blue-300/40">
                  <SafeImage src={article.cover_image_url} fallback="/images/articles/science.svg" alt={article.cover_image_alt || article.title} className="aspect-[16/8] w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                  <div className="p-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                  <h3 className="mt-3 text-lg font-black uppercase text-white">{article.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{article.summary}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2"><Link to={`/news/${article.slug}`} className="inline-flex rounded-full border border-orange-400/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>{article.source_urls.length > 0 ? <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-blue-200/70">● fuente oficial</span> : null}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8">
            <PublicAdSlot slotId="section-sidebar" fallbackLabel="XETHKIOZ TECH SPONSOR" />
          </div>

          <section id="science-newsletter" className="xk-science-newsletter scroll-mt-28" aria-label="Newsletter de tendencias"><div><p>WEEKLY_SIGNAL // 3 NOTICIAS QUE IMPORTAN</p><h2>Una señal útil por semana</h2><span>IA, ciencia y tecnología con contexto, fuentes y sin saturarte.</span></div><Newsletter /></section>

          <div className="mt-8 rounded-3xl border border-[#32FF8A]/25 bg-black/45 p-5 font-mono text-xs leading-relaxed text-gray-300">{t.status}</div>
          <Link to="/" className="mt-8 inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
        </div>
      </section>
    </>
  )
}
