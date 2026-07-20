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
type AssistantAnswer = { label: string; answer: string; link: string }

const categoryByBlock: Record<string, PublicNewsCategory[]> = {
  ai: ['ai'],
  science: ['science'],
  tech: ['tech', 'programming'],
}

const referenceSites = [
  { name: 'NASA Learning', scope: { es: 'Ciencia y proyectos por edad', en: 'Science and age-based projects' }, url: 'https://www.nasa.gov/learning-resources/', mark: 'NASA' },
  { name: 'Arduino Project Hub', scope: { es: 'Electrónica y proyectos prácticos', en: 'Electronics and practical projects' }, url: 'https://projecthub.arduino.cc/', mark: 'ARD' },
  { name: 'Raspberry Pi Projects', scope: { es: 'Programación, hardware y educación', en: 'Programming, hardware and education' }, url: 'https://projects.raspberrypi.org/', mark: 'RPI' },
  { name: 'CERN Science Gateway', scope: { es: 'Física, universo y recursos educativos', en: 'Physics, the universe and educational resources' }, url: 'https://visit.cern/science-gateway', mark: 'CERN' },
  { name: 'MIT Technology Review', scope: { es: 'Tendencias y análisis tecnológico', en: 'Technology trends and analysis' }, url: 'https://www.technologyreview.com/', mark: 'MIT' },
  { name: 'IEEE Spectrum', scope: { es: 'Ingeniería y tecnología mundial', en: 'Global engineering and technology' }, url: 'https://spectrum.ieee.org/', mark: 'IEEE' },
] as const

const content = {
  es: {
    title: 'Tecnología / Ciencia',
    description: 'Laboratorio técnico para IA, ciencia, hardware, software e infraestructura verificable.',
    switchLanguage: 'Cambiar a inglés',
    switchCode: 'EN',
    back: 'Volver al núcleo',
    open: 'Abrir laboratorio',
    status: 'Estado: sección conectada al radar real de IA, tecnología y ciencia. Cada tarjeta abre lectura ampliada con fuente original.',
    articleTitle: 'Laboratorio // IA + Tech + Ciencia',
    read: 'Leer completa',
    officialSource: 'fuente oficial',
    syncing: 'SINCRONIZANDO DATOS',
    verifiedSignals: 'SEÑALES VERIFICADAS',
    empty: 'LAB OFFLINE // No hay señales disponibles para esta ruta en este momento.',
    sponsor: 'SPONSOR DE XETHKIOZ TECH',
    blocks: [
      { id: 'ai', title: 'IA / Modelos', text: 'Análisis, prompts, automatización, gobernanza y modelos locales.' },
      { id: 'science', title: 'Ciencia', text: 'Fuentes, evidencia, pensamiento crítico y contexto.' },
      { id: 'tech', title: 'Tecnología', text: 'Hardware, software, infraestructura, streaming y rendimiento.' },
    ] as SectionBlock[],
    learning: {
      eyebrow: 'OASIS_LAB // ELEGÍ PARA QUIÉN',
      title: 'Tecnología que termina en algo útil',
      description: 'No hace falta saber programar. Cada ruta tendrá edad sugerida, dificultad, materiales, tiempo, costo y advertencias claras.',
      routes: [
        { code: 'KIDS', icon: '🧪', title: 'Explorar con chicos', level: '8–13 años', description: 'Experimentos seguros, espacio, programación visual y preguntas para aprender jugando.', action: 'Ver ideas familiares' },
        { code: 'START', icon: '🛠️', title: 'Primer proyecto', level: 'Desde cero', description: 'Proyectos pequeños con materiales claros, dificultad, costo aproximado y resultado esperado.', action: 'Elegir un proyecto' },
        { code: 'ADULT', icon: '🧠', title: 'Tecnología para adultos', level: 'Uso cotidiano', description: 'IA útil, privacidad, compras inteligentes, automatización y herramientas para trabajo o estudio.', action: 'Resolver algo real' },
        { code: 'GADGET', icon: '⌚', title: 'Radar de gadgets', level: 'Mercado mundial', description: 'Qué salió, para quién sirve, cuánto aporta y qué es solamente marketing.', action: 'Abrir el radar' },
      ],
    },
    loop: {
      eyebrow: 'LAB_LOOP // APRENDER HACIENDO',
      title: 'La tecnología sirve cuando podés usarla',
      description: 'Abrí la caja de herramientas, probá una respuesta guiada o llevate una señal semanal con contexto.',
      items: [
        { code: 'STACK', title: 'Abrir herramientas', detail: 'El stack real detrás del proyecto', to: '/science#tech-stack', action: 'Inspeccionar' },
        { code: 'ASK', title: 'Consultar al laboratorio', detail: 'Respuestas locales sobre IA y web', to: '/science#lab-assistant', action: 'Probar' },
        { code: 'SIGNAL', title: 'Recibir tendencias', detail: 'Tres noticias útiles por semana', to: '/science#science-newsletter', action: 'Suscribirme' },
      ],
    },
    stack: {
      eyebrow: 'TECH_STACK // HERRAMIENTAS REALES',
      title: 'Cómo está construido XETHKIOZ',
      description: 'Herramientas que hoy sostienen la web y el flujo creativo. Sin recomendaciones pagas ni productos inventados.',
      items: [
        { icon: '⚛', name: 'React + TypeScript', detail: 'Interfaz tipada y componentes reutilizables.' },
        { icon: '⚡', name: 'Vite', detail: 'Build rápido y entrega optimizada del frontend.' },
        { icon: '◫', name: 'Supabase', detail: 'Autenticación, base de datos y contenido dinámico.' },
        { icon: '▲', name: 'Vercel', detail: 'Deploy, previews y observabilidad del sitio.' },
        { icon: '◉', name: 'GitHub + Codex', detail: 'Versionado, revisión y automatización asistida.' },
        { icon: '▶', name: 'OBS + FFmpeg', detail: 'Producción y procesamiento audiovisual.' },
      ],
    },
    references: {
      eyebrow: 'WORLD_LINKS // FUENTES PARA SEGUIR APRENDIENDO',
      title: 'Referentes conectados al laboratorio',
      description: 'XETHKIOZ explica y ordena; estas instituciones permiten profundizar en la fuente. Los enlaces externos se identifican siempre.',
      externalLabel: 'Abrir fuente externa',
    },
    assistant: {
      eyebrow: 'MINI_BOT // MODO LOCAL',
      title: 'Preguntale al laboratorio',
      description: 'Elegí una ruta. Las respuestas están curadas en la página: no se envían datos a una API externa.',
      topicsLabel: 'Temas del asistente',
      response: 'RESPUESTA',
      related: 'ABRIR RUTA RELACIONADA',
      answers: {
        ia: { label: 'IA útil', answer: 'Empezá por una tarea concreta, definí qué dato puede equivocarse y verificá la salida antes de publicarla. Un buen prompt no reemplaza una buena fuente.', link: '/news?category=ai' },
        web: { label: 'Crear una web', answer: 'Priorizá objetivo, velocidad móvil, accesibilidad y una llamada a la acción medible. El efecto visual sirve cuando acompaña el recorrido.', link: '/creacion-web' },
        performance: { label: 'Rendimiento', answer: 'Medí primero: peso de imágenes, JavaScript inicial y estabilidad visual. Optimizá el cuello de botella real, no el que parece más técnico.', link: '/news?category=tech' },
        security: { label: 'Seguridad', answer: 'Usá 2FA, claves únicas, permisos mínimos y backups probados. Nunca pegues secretos o tokens en un chatbot o repositorio público.', link: '/green-node' },
      } as Record<string, AssistantAnswer>,
    },
    newsletter: {
      label: 'Newsletter de tendencias',
      eyebrow: 'WEEKLY_SIGNAL // 3 NOTICIAS QUE IMPORTAN',
      title: 'Una señal útil por semana',
      description: 'IA, ciencia y tecnología con contexto, fuentes y sin saturarte.',
    },
  },
  en: {
    title: 'Technology / Science',
    description: 'Technical lab for AI, science, hardware, software and verifiable infrastructure.',
    switchLanguage: 'Switch to Spanish',
    switchCode: 'ES',
    back: 'Back to core',
    open: 'Open lab',
    status: 'Status: this section is connected to the real AI, technology and science radar. Each card opens expanded reading with its original source.',
    articleTitle: 'Lab // AI + Tech + Science',
    read: 'Read full article',
    officialSource: 'official source',
    syncing: 'SYNCING DATA',
    verifiedSignals: 'VERIFIED SIGNALS',
    empty: 'LAB OFFLINE // No signals are available for this route right now.',
    sponsor: 'XETHKIOZ TECH SPONSOR',
    blocks: [
      { id: 'ai', title: 'AI / Models', text: 'Analysis, prompts, automation, governance and local models.' },
      { id: 'science', title: 'Science', text: 'Sources, evidence, critical thinking and context.' },
      { id: 'tech', title: 'Technology', text: 'Hardware, software, infrastructure, streaming and performance.' },
    ] as SectionBlock[],
    learning: {
      eyebrow: 'OASIS_LAB // CHOOSE THE AUDIENCE',
      title: 'Technology that becomes useful',
      description: 'No programming knowledge is required. Every route includes suggested age, difficulty, materials, time, approximate cost and clear warnings.',
      routes: [
        { code: 'KIDS', icon: '🧪', title: 'Explore with children', level: 'Ages 8–13', description: 'Safe experiments, space, visual programming and questions for learning through play.', action: 'View family ideas' },
        { code: 'START', icon: '🛠️', title: 'First project', level: 'From zero', description: 'Small projects with clear materials, difficulty, approximate cost and expected result.', action: 'Choose a project' },
        { code: 'ADULT', icon: '🧠', title: 'Technology for adults', level: 'Everyday use', description: 'Useful AI, privacy, smart purchases, automation and tools for work or study.', action: 'Solve something real' },
        { code: 'GADGET', icon: '⌚', title: 'Gadget radar', level: 'Global market', description: 'What launched, who it serves, what value it adds and what is only marketing.', action: 'Open the radar' },
      ],
    },
    loop: {
      eyebrow: 'LAB_LOOP // LEARN BY BUILDING',
      title: 'Technology matters when you can use it',
      description: 'Open the toolbox, try a guided answer or receive a weekly signal with context.',
      items: [
        { code: 'STACK', title: 'Open tools', detail: 'The real stack behind the project', to: '/science#tech-stack', action: 'Inspect' },
        { code: 'ASK', title: 'Ask the lab', detail: 'Local answers about AI and web', to: '/science#lab-assistant', action: 'Try it' },
        { code: 'SIGNAL', title: 'Receive trends', detail: 'Three useful stories per week', to: '/science#science-newsletter', action: 'Subscribe' },
      ],
    },
    stack: {
      eyebrow: 'TECH_STACK // REAL TOOLS',
      title: 'How XETHKIOZ is built',
      description: 'Tools that currently support the website and creative workflow. No paid recommendations or invented products.',
      items: [
        { icon: '⚛', name: 'React + TypeScript', detail: 'Typed interface and reusable components.' },
        { icon: '⚡', name: 'Vite', detail: 'Fast builds and optimized frontend delivery.' },
        { icon: '◫', name: 'Supabase', detail: 'Authentication, database and dynamic content.' },
        { icon: '▲', name: 'Vercel', detail: 'Deployments, previews and site observability.' },
        { icon: '◉', name: 'GitHub + Codex', detail: 'Version control, review and assisted automation.' },
        { icon: '▶', name: 'OBS + FFmpeg', detail: 'Audiovisual production and processing.' },
      ],
    },
    references: {
      eyebrow: 'WORLD_LINKS // SOURCES FOR CONTINUED LEARNING',
      title: 'References connected to the laboratory',
      description: 'XETHKIOZ explains and organizes; these institutions let you continue at the source. External links are always identified.',
      externalLabel: 'Open external source',
    },
    assistant: {
      eyebrow: 'MINI_BOT // LOCAL MODE',
      title: 'Ask the laboratory',
      description: 'Choose a route. These answers are curated on the page and no data is sent to an external API.',
      topicsLabel: 'Assistant topics',
      response: 'ANSWER',
      related: 'OPEN RELATED ROUTE',
      answers: {
        ia: { label: 'Useful AI', answer: 'Start with a concrete task, define which data could be wrong and verify the output before publishing it. A good prompt does not replace a good source.', link: '/news?category=ai' },
        web: { label: 'Build a website', answer: 'Prioritize the goal, mobile speed, accessibility and a measurable call to action. Visual effects matter when they support the journey.', link: '/creacion-web' },
        performance: { label: 'Performance', answer: 'Measure first: image weight, initial JavaScript and visual stability. Optimize the real bottleneck, not the one that merely sounds technical.', link: '/news?category=tech' },
        security: { label: 'Security', answer: 'Use 2FA, unique passwords, least privilege and tested backups. Never paste secrets or tokens into a chatbot or public repository.', link: '/green-node' },
      } as Record<string, AssistantAnswer>,
    },
    newsletter: {
      label: 'Technology trends newsletter',
      eyebrow: 'WEEKLY_SIGNAL // 3 STORIES THAT MATTER',
      title: 'One useful signal per week',
      description: 'AI, science and technology with context, sources and no information overload.',
    },
  },
} as const

export default function ScienceLab() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState<string>(t.blocks[0].id)
  const [assistantTopic, setAssistantTopic] = useState<string>('ia')
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const assistantEntries = Object.entries(t.assistant.answers)
  const assistant = t.assistant.answers[assistantTopic] ?? t.assistant.answers.ia

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

  function moveBlockFocus(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + t.blocks.length) % t.blocks.length
    const next = t.blocks[nextIndex]
    setActiveId(next.id)
    document.getElementById(`science-tab-${next.id}`)?.focus()
  }

  function moveAssistantFocus(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + assistantEntries.length) % assistantEntries.length
    const [nextId] = assistantEntries[nextIndex]
    setAssistantTopic(nextId)
    document.getElementById(`assistant-tab-${nextId}`)?.focus()
  }

  return (
    <>
      <SEO title={t.title} description={t.description} url="/science" />
      <main className="xk-page xk-blueprint px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="xk-section-panel rounded-[2rem] border border-blue-400/45 bg-[#06111f]/80 p-6 shadow-[0_0_28px_rgba(59,130,246,.18)] md:p-10" aria-labelledby="science-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">DATA_TERMINAL // BLUEPRINT</p>
              <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-blue-300/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-blue-100" aria-label={t.switchLanguage} title={t.switchLanguage}>{t.switchCode}</button>
            </div>
            <h1 id="science-title" className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">{t.description}</p>
          </section>

          <NexusDistrict tone="science" />

          <section className="xk-learning-routes" aria-labelledby="learning-routes-title">
            <div className="xk-learning-routes-head"><p>{t.learning.eyebrow}</p><h2 id="learning-routes-title">{t.learning.title}</h2><span>{t.learning.description}</span></div>
            <div>{t.learning.routes.map((route) => <a key={route.code} href="#lab-assistant"><span aria-hidden="true">{route.icon}</span><small>{route.code} // {route.level}</small><h3>{route.title}</h3><p>{route.description}</p><b>{route.action} →</b></a>)}</div>
          </section>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" role="tablist" aria-label={t.articleTitle}>
            {t.blocks.map((item, index) => (
              <button
                key={item.id}
                id={`science-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active.id === item.id}
                aria-controls="science-article-panel"
                tabIndex={active.id === item.id ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveBlockFocus(index, 1) }
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveBlockFocus(index, -1) }
                }}
                className={`xk-card rounded-3xl border p-5 text-left shadow-[0_0_16px_rgba(139,92,246,.12)] transition ${active.id === item.id ? 'border-[#32FF8A]/70 bg-[#031006]/80' : 'border-blue-300/30 bg-black/50 hover:border-blue-200/70'}`}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8B5CF6]">{item.title}</p>
                <p className="mt-4 font-mono text-sm leading-relaxed text-gray-300">{item.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <PortalPulseRail tone="cyan" eyebrow={t.loop.eyebrow} title={t.loop.title} description={t.loop.description} items={t.loop.items} />

          <section id="tech-stack" className="xk-tech-stack scroll-mt-28" aria-labelledby="tech-stack-title">
            <div><p>{t.stack.eyebrow}</p><h2 id="tech-stack-title">{t.stack.title}</h2><span>{t.stack.description}</span></div>
            <div>{t.stack.items.map((tool) => <article key={tool.name}><span aria-hidden="true">{tool.icon}</span><div><h3>{tool.name}</h3><p>{tool.detail}</p></div></article>)}</div>
          </section>

          <section className="xk-science-references" aria-labelledby="science-references-title">
            <div><p>{t.references.eyebrow}</p><h2 id="science-references-title">{t.references.title}</h2><span>{t.references.description}</span></div>
            <div>{referenceSites.map((site) => <a key={site.name} href={site.url} target="_blank" rel="noreferrer noopener" aria-label={`${t.references.externalLabel}: ${site.name}`}><i aria-hidden="true">{site.mark}</i><span><b>{site.name}</b><small>{site.scope[lang]}</small></span><em aria-hidden="true">↗</em></a>)}</div>
          </section>

          <section id="lab-assistant" className="xk-lab-assistant scroll-mt-28" aria-labelledby="lab-assistant-title">
            <div className="xk-assistant-console">
              <p>{t.assistant.eyebrow}</p>
              <h2 id="lab-assistant-title">{t.assistant.title}</h2>
              <span>{t.assistant.description}</span>
              <div role="tablist" aria-label={t.assistant.topicsLabel}>{assistantEntries.map(([id, item], index) => <button key={id} id={`assistant-tab-${id}`} type="button" role="tab" aria-selected={assistantTopic === id} aria-controls="assistant-answer" tabIndex={assistantTopic === id ? 0 : -1} onClick={() => setAssistantTopic(id)} onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveAssistantFocus(index, 1) }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveAssistantFocus(index, -1) }
              }}>{item.label}</button>)}</div>
            </div>
            <div id="assistant-answer" className="xk-assistant-answer" role="tabpanel" aria-labelledby={`assistant-tab-${assistantTopic}`} aria-live="polite"><small>{t.assistant.response} // {assistant.label}</small><p>{assistant.answer}</p><Link to={assistant.link}>{t.assistant.related} →</Link></div>
          </section>

          <section id="science-article-panel" className="mt-8 rounded-3xl border border-blue-300/25 bg-black/55 p-5 md:p-7" role="tabpanel" aria-labelledby={`science-tab-${active.id}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blue-200">{t.articleTitle}</p><h2 className="mt-2 text-2xl font-black uppercase text-white">{active.title}</h2></div>
              <span className="rounded-full border border-[#32FF8A]/30 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#32FF8A]" role="status" aria-live="polite">{loadingNews ? t.syncing : `${articles.length} ${t.verifiedSignals}`}</span>
            </div>
            {articles.length > 0 ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-blue-300/40">
                  <SafeImage src={article.cover_image_url} fallback="/images/articles/science.svg" alt={article.cover_image_alt || article.title} className="aspect-[16/8] w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                  <div className="p-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                    <h3 className="mt-3 text-lg font-black uppercase text-white">{article.title}</h3>
                    <p className="mt-3 text-xs leading-relaxed text-gray-300">{article.summary}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2"><Link to={`/news/${article.slug}`} className="inline-flex rounded-full border border-orange-400/40 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>{article.source_urls.length > 0 ? <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-blue-200/70"><span aria-hidden="true">●</span> {t.officialSource}</span> : null}</div>
                  </div>
                </article>
              ))}
            </div> : !loadingNews ? <p className="xk-empty-signal" role="status">{t.empty}</p> : null}
          </section>

          <div className="mt-8"><PublicAdSlot slotId="section-sidebar" fallbackLabel={t.sponsor} /></div>

          <section id="science-newsletter" className="xk-science-newsletter scroll-mt-28" aria-label={t.newsletter.label}><div><p>{t.newsletter.eyebrow}</p><h2>{t.newsletter.title}</h2><span>{t.newsletter.description}</span></div><Newsletter /></section>

          <div className="mt-8 rounded-3xl border border-[#32FF8A]/25 bg-black/45 p-5 font-mono text-xs leading-relaxed text-gray-300">{t.status}</div>
          <Link to="/" className="mt-8 inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
        </div>
      </main>
    </>
  )
}
