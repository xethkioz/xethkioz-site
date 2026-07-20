import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'

type NewsCategory = 'gaming' | 'tech' | 'science' | 'ai' | 'community' | 'green' | 'programming'
type Language = 'es' | 'en'

type GenerateResponse = {
  id: string
  slug: string
  status: string
  previewUrl: string
  createdAt: string
}

const categories: { value: NewsCategory; es: string; en: string }[] = [
  { value: 'gaming', es: 'Gaming', en: 'Gaming' },
  { value: 'tech', es: 'Tecnología', en: 'Technology' },
  { value: 'science', es: 'Ciencia', en: 'Science' },
  { value: 'ai', es: 'IA', en: 'AI' },
  { value: 'community', es: 'Comunidad', en: 'Community' },
  { value: 'green', es: 'Green Node', en: 'Green Node' },
  { value: 'programming', es: 'Programación', en: 'Programming' },
]

const copy = {
  es: {
    eyebrow: 'Nueva noticia',
    title: 'Generador editorial conectado',
    description: 'Crea un borrador seguro en Supabase usando el endpoint editorial. La publicación queda en revisión antes de salir al sitio.',
    category: 'Categoría',
    articleLanguage: 'Idioma del artículo',
    spanish: 'Español',
    english: 'Inglés',
    topic: 'Tema principal',
    topicPlaceholder: 'Ej: nuevo modo Classic de League of Legends',
    optionalTitle: 'Título opcional',
    titlePlaceholder: 'Si lo dejás vacío, se usa el tema',
    optionalSummary: 'Resumen opcional',
    summaryPlaceholder: 'Bajada breve para el borrador',
    tags: 'Tags separados por coma',
    tagsPlaceholder: 'gaming, riot, lol',
    sources: 'Fuentes, una URL por línea',
    sourcesHint: 'Máximo 20 fuentes. Las URLs se guardan para revisión editorial.',
    aiDraft: 'Marcar como borrador asistido por IA',
    noSession: 'No hay sesión activa. Iniciá sesión con una cuenta admin antes de generar noticias.',
    generationError: 'Error al generar noticia.',
    unexpectedError: 'Error inesperado al generar noticia.',
    generating: 'Generando…',
    create: 'Crear borrador',
    created: 'Borrador creado',
    status: 'Estado',
    edit: 'Abrir en el editor',
    publicPreview: 'Abrir vista previa',
    checklist: 'Checklist operativo',
    checklistItems: [
      'Requiere una sesión administrativa válida.',
      'Guarda el contenido en news_articles.',
      'El borrador queda con revisión pendiente.',
      'Nunca publica automáticamente sin revisión.',
      'El entorno de Vercel debe incluir la clave privada del servicio.',
    ],
    formLabel: 'Generador de borradores editoriales',
  },
  en: {
    eyebrow: 'New article',
    title: 'Connected editorial generator',
    description: 'Creates a safe draft in Supabase through the editorial endpoint. Publication remains in review before reaching the public website.',
    category: 'Category',
    articleLanguage: 'Article language',
    spanish: 'Spanish',
    english: 'English',
    topic: 'Main topic',
    topicPlaceholder: 'Example: new League of Legends Classic mode',
    optionalTitle: 'Optional title',
    titlePlaceholder: 'When empty, the topic is used',
    optionalSummary: 'Optional summary',
    summaryPlaceholder: 'Short deck for the draft',
    tags: 'Comma-separated tags',
    tagsPlaceholder: 'gaming, riot, lol',
    sources: 'Sources, one URL per line',
    sourcesHint: 'Maximum 20 sources. URLs are stored for editorial review.',
    aiDraft: 'Mark as an AI-assisted draft',
    noSession: 'There is no active session. Sign in with an admin account before generating articles.',
    generationError: 'Could not generate the article.',
    unexpectedError: 'Unexpected error while generating the article.',
    generating: 'Generating…',
    create: 'Create draft',
    created: 'Draft created',
    status: 'Status',
    edit: 'Open in editor',
    publicPreview: 'Open preview',
    checklist: 'Operational checklist',
    checklistItems: [
      'Requires a valid administrative session.',
      'Stores content in news_articles.',
      'The draft remains pending review.',
      'Never publishes automatically without review.',
      'The Vercel environment must include the private service key.',
    ],
    formLabel: 'Editorial draft generator',
  },
} as const

function buildIdempotencyKey() {
  return `xethkioz_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export default function CmsGenerate() {
  const { lang } = useLang()
  const t = copy[lang]
  const [category, setCategory] = useState<NewsCategory>('gaming')
  const [language, setLanguage] = useState<Language>('es')
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [sourceUrls, setSourceUrls] = useState('')
  const [useLLM, setUseLLM] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerateResponse | null>(null)

  const parsedTags = useMemo(() => tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 10), [tags])
  const parsedSources = useMemo(() => sourceUrls.split('\n').map((url) => url.trim()).filter(Boolean).slice(0, 20), [sourceUrls])
  const canSubmit = topic.trim().length >= 3 && !loading

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    if (!token) {
      setError(t.noSession)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Idempotency-Key': buildIdempotencyKey(),
        },
        body: JSON.stringify({
          category,
          language,
          topic: topic.trim(),
          title: title.trim() || undefined,
          summary: summary.trim() || undefined,
          tags: parsedTags,
          source_urls: parsedSources,
          useLLM,
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const details = payload?.details ? ` ${payload.details.join(' · ')}` : ''
        throw new Error(`${payload?.error ?? t.generationError}${details}`)
      }

      setResult(payload as GenerateResponse)
      setTopic('')
      setTitle('')
      setSummary('')
      setTags('')
      setSourceUrls('')
      setUseLLM(false)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" aria-labelledby="cms-generate-title">
      <form aria-label={t.formLabel} aria-busy={loading} onSubmit={handleSubmit} className="rounded-3xl border border-orange-400/30 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p>
        <h2 id="cms-generate-title" className="mt-3 text-3xl font-black">{t.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          {t.description} <code className="rounded bg-white/10 px-2 py-1">/api/generate-news</code>
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.category}
            <select value={category} onChange={(event) => setCategory(event.target.value as NewsCategory)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">
              {categories.map((item) => <option key={item.value} value={item.value}>{item[lang]}</option>)}
            </select>
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.articleLanguage}
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">
              <option value="es">{t.spanish}</option>
              <option value="en">{t.english}</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-4">
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.topic}
            <input value={topic} onChange={(event) => setTopic(event.target.value)} required minLength={3} maxLength={200} placeholder={t.topicPlaceholder} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.optionalTitle}
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={220} placeholder={t.titlePlaceholder} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.optionalSummary}
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={500} rows={3} placeholder={t.summaryPlaceholder} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.tags}
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder={t.tagsPlaceholder} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            {t.sources}
            <textarea value={sourceUrls} onChange={(event) => setSourceUrls(event.target.value)} rows={4} placeholder="https://…" aria-describedby="cms-source-hint" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
            <span id="cms-source-hint" className="block text-[10px] font-medium normal-case tracking-normal text-purple-200/70">{t.sourcesHint}</span>
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-purple-100">
          <input type="checkbox" checked={useLLM} onChange={(event) => setUseLLM(event.target.checked)} />
          {t.aiDraft}
        </label>

        {error ? <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200" role="alert">{error}</p> : null}
        {result ? (
          <div className="mt-4 rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-100" role="status" aria-live="polite">
            <p className="font-bold">{t.created}: {result.slug}</p>
            <p className="mt-1 text-green-100/75">{t.status}: {result.status}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`/cms/news/${result.id}`} className="rounded-full border border-green-300/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-green-50 transition hover:bg-green-300/10">{t.edit}</Link>
              {result.previewUrl ? <a href={result.previewUrl} target="_blank" rel="noreferrer noopener" className="rounded-full border border-purple-300/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-50 transition hover:bg-purple-300/10">{t.publicPreview} ↗</a> : null}
            </div>
          </div>
        ) : null}

        <button disabled={!canSubmit} type="submit" className="mt-6 rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? t.generating : t.create}
        </button>
      </form>

      <aside className="rounded-3xl border border-purple-500/25 bg-white/[0.04] p-6 text-sm text-purple-100" aria-labelledby="generator-checklist-title">
        <p id="generator-checklist-title" className="text-xs font-black uppercase tracking-[0.3em] text-purple-300">{t.checklist}</p>
        <ul className="mt-4 space-y-3 leading-6">
          {t.checklistItems.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">▣</span><span>{item}</span></li>)}
        </ul>
      </aside>
    </section>
  )
}
