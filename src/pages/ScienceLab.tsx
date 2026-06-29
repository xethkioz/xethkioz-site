import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type LabArticle = {
  title: string
  summary: string
  tag: string
  evidence: string
}

type LabCategory = {
  id: string
  label: string
  value: string
  description: string
  articles: LabArticle[]
}

type ScienceCopy = {
  seoTitle: string
  seoDescription: string
  eyebrow: string
  title: string
  description: string
  status: string
  openLabel: string
  selectedLabel: string
  readLabel: string
  back: string
  categories: LabCategory[]
}

const copy: Record<'es' | 'en', ScienceCopy> = {
  es: {
    seoTitle: 'Tecnología y Ciencia · XETHKIOZ',
    seoDescription: 'Sección técnica de XETHKIOZ con categorías navegables de IA, ciencia y tecnología.',
    eyebrow: 'DATA_TERMINAL // BLUEPRINT',
    title: 'Tecnología / Ciencia',
    description: 'Laboratorio técnico con rutas navegables: IA, evidencia científica, hardware, software e infraestructura.',
    status: 'Estado: sección preparada para contenido verificable, fuentes y publicaciones categorizadas.',
    openLabel: 'Abrir módulo',
    selectedLabel: 'Módulo activo',
    readLabel: 'Ver informes completos',
    back: 'Volver al núcleo',
    categories: [
      {
        id: 'ai',
        label: 'IA / Modelos',
        value: 'análisis, prompts, automatización',
        description: 'Modelos locales, automatización, prompts, agentes y uso real para creadores.',
        articles: [
          { title: 'IA local para creadores', summary: 'Cómo usar modelos locales sin depender siempre de servicios externos.', tag: 'IA Local', evidence: 'Documentado' },
          { title: 'Prompts como sistema operativo', summary: 'Estructura para convertir prompts sueltos en flujos de trabajo repetibles.', tag: 'Prompts', evidence: 'Guía' },
          { title: 'Automatización editorial', summary: 'Pipeline para transformar fuentes en borradores, revisiones y publicaciones.', tag: 'Automation', evidence: 'En revisión' },
        ],
      },
      {
        id: 'science',
        label: 'Ciencia',
        value: 'fuentes, evidencia, contexto',
        description: 'Divulgación con separación clara entre evidencia, hipótesis y especulación.',
        articles: [
          { title: 'Cómo leer una fuente científica', summary: 'Checklist para distinguir papers, notas, opinión y evidencia verificable.', tag: 'Fuentes', evidence: 'Documentado' },
          { title: 'Misterios sin vender humo', summary: 'Formato editorial para tratar temas raros sin afirmar lo que no está probado.', tag: 'Pensamiento crítico', evidence: 'Hipótesis' },
          { title: 'Ciencia para comunidad gamer', summary: 'Explicaciones cortas sobre física, tecnología y salud digital para redes.', tag: 'Divulgación', evidence: 'Publicado' },
        ],
      },
      {
        id: 'tech',
        label: 'Tecnología',
        value: 'hardware, software, infraestructura',
        description: 'Hardware, software, servidores, streaming, Supabase, Vercel, Linux y herramientas reales.',
        articles: [
          { title: 'Setup de streaming estable', summary: 'Configuración práctica para OBS, Starlink, overlays y calidad visual.', tag: 'Streaming', evidence: 'Guía' },
          { title: 'Infraestructura del ecosistema', summary: 'Cómo se conectan React, Vite, Vercel, Supabase, GitHub y CMS.', tag: 'Infra', evidence: 'Documentado' },
          { title: 'Hardware gamer + IA', summary: 'Uso real de GPU, memoria y almacenamiento para gaming, edición y modelos.', tag: 'Hardware', evidence: 'En revisión' },
        ],
      },
    ],
  },
  en: {
    seoTitle: 'Technology and Science · XETHKIOZ',
    seoDescription: 'XETHKIOZ technical section with navigable AI, science and technology categories.',
    eyebrow: 'DATA_TERMINAL // BLUEPRINT',
    title: 'Technology / Science',
    description: 'A technical lab with navigable routes: AI, scientific evidence, hardware, software and infrastructure.',
    status: 'Status: section ready for verifiable content, sources and categorized publications.',
    openLabel: 'Open module',
    selectedLabel: 'Active module',
    readLabel: 'View full reports',
    back: 'Back to core',
    categories: [
      {
        id: 'ai',
        label: 'AI / Models',
        value: 'analysis, prompts, automation',
        description: 'Local models, automation, prompts, agents and real creator workflows.',
        articles: [
          { title: 'Local AI for creators', summary: 'How to use local models without always depending on external services.', tag: 'Local AI', evidence: 'Documented' },
          { title: 'Prompts as an operating system', summary: 'Structure to turn loose prompts into repeatable workflows.', tag: 'Prompts', evidence: 'Guide' },
          { title: 'Editorial automation', summary: 'Pipeline to transform sources into drafts, reviews and publications.', tag: 'Automation', evidence: 'In review' },
        ],
      },
      {
        id: 'science',
        label: 'Science',
        value: 'sources, evidence, context',
        description: 'Public science communication with clear separation between evidence, hypothesis and speculation.',
        articles: [
          { title: 'How to read a scientific source', summary: 'Checklist to distinguish papers, news, opinion and verifiable evidence.', tag: 'Sources', evidence: 'Documented' },
          { title: 'Mysteries without smoke', summary: 'Editorial format for strange topics without claiming what has not been proven.', tag: 'Critical thinking', evidence: 'Hypothesis' },
          { title: 'Science for gaming communities', summary: 'Short explainers about physics, technology and digital health for social platforms.', tag: 'Outreach', evidence: 'Published' },
        ],
      },
      {
        id: 'tech',
        label: 'Technology',
        value: 'hardware, software, infrastructure',
        description: 'Hardware, software, servers, streaming, Supabase, Vercel, Linux and real tools.',
        articles: [
          { title: 'Stable streaming setup', summary: 'Practical configuration for OBS, Starlink, overlays and visual quality.', tag: 'Streaming', evidence: 'Guide' },
          { title: 'Ecosystem infrastructure', summary: 'How React, Vite, Vercel, Supabase, GitHub and CMS connect.', tag: 'Infra', evidence: 'Documented' },
          { title: 'Gaming hardware + AI', summary: 'Real use of GPU, memory and storage for gaming, editing and models.', tag: 'Hardware', evidence: 'In review' },
        ],
      },
    ],
  },
}

export default function ScienceLab() {
  const { lang } = useLang()
  const t = copy[lang]
  const [selectedId, setSelectedId] = useState(t.categories[0].id)
  const activeCategory = useMemo(() => t.categories.find((category) => category.id === selectedId) ?? t.categories[0], [selectedId, t.categories])

  return (
    <>
      <SEO title={t.seoTitle} description={t.seoDescription} url="/science" />
      <section className="xk-page xk-blueprint px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel rounded-[2rem] border border-blue-400/45 bg-[#06111f]/80 p-6 shadow-[0_0_28px_rgba(59,130,246,.18)] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">{t.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">{t.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.categories.map((item) => {
              const isActive = item.id === activeCategory.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`xk-card rounded-3xl border bg-black/50 p-5 text-left shadow-[0_0_16px_rgba(139,92,246,.12)] transition hover:-translate-y-1 ${isActive ? 'border-[#32FF8A]/70 shadow-[0_0_28px_rgba(50,255,138,.18)]' : 'border-blue-300/30'}`}
                  aria-pressed={isActive}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8B5CF6]">{isActive ? t.selectedLabel : t.openLabel}</p>
                  <h2 className="mt-3 text-xl font-black uppercase text-white">{item.label}</h2>
                  <p className="mt-2 font-mono text-sm leading-relaxed text-gray-300">{item.value}</p>
                </button>
              )
            })}
          </div>

          <section className="mt-8 rounded-3xl border border-blue-300/30 bg-black/50 p-5 shadow-[0_0_24px_rgba(59,130,246,.12)] md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#32FF8A]">{activeCategory.label}</p>
            <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white">{activeCategory.value}</h2>
                <p className="mt-2 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">{activeCategory.description}</p>
              </div>
              <Link to="/news" className="inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.readLabel}</Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {activeCategory.articles.map((article) => (
                <article key={article.title} className="rounded-2xl border border-blue-300/20 bg-white/[0.04] p-5 transition hover:border-[#32FF8A]/50 hover:bg-white/[0.07]">
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <span className="rounded-full border border-[#8B5CF6]/35 px-3 py-1 text-[#8B5CF6]">{article.tag}</span>
                    <span className="rounded-full border border-[#32FF8A]/25 px-3 py-1 text-[#32FF8A]">{article.evidence}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-black uppercase leading-tight text-white">{article.title}</h3>
                  <p className="mt-3 font-mono text-sm leading-relaxed text-gray-300">{article.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 rounded-3xl border border-[#32FF8A]/25 bg-black/45 p-5 font-mono text-xs leading-relaxed text-gray-300">{t.status}</div>

          <Link to="/" className="mt-8 inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">
            {t.back}
          </Link>
        </div>
      </section>
    </>
  )
}
