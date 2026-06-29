import { useMemo, useState, type FormEvent } from 'react'
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

const categories: { value: NewsCategory; label: string }[] = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'tech', label: 'Tecnología' },
  { value: 'science', label: 'Ciencia' },
  { value: 'ai', label: 'IA' },
  { value: 'community', label: 'Comunidad' },
  { value: 'green', label: 'Green Node' },
  { value: 'programming', label: 'Programación' },
]

function buildIdempotencyKey() {
  return `xethkioz_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export default function CmsGenerate() {
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
      setError('No hay sesión activa. Iniciá sesión con una cuenta admin antes de generar noticias.')
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
        throw new Error(`${payload?.error ?? 'Error al generar noticia.'}${details}`)
      }

      setResult(payload as GenerateResponse)
      setTopic('')
      setTitle('')
      setSummary('')
      setTags('')
      setSourceUrls('')
      setUseLLM(false)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Error inesperado al generar noticia.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-orange-400/30 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Nueva noticia</p>
        <h2 className="mt-3 text-3xl font-black">Generador editorial conectado</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Crea un borrador seguro en Supabase usando <code className="rounded bg-white/10 px-2 py-1">/api/generate-news</code>. La publicación queda en revisión antes de salir al sitio.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Categoría
            <select value={category} onChange={(event) => setCategory(event.target.value as NewsCategory)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">
              {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Idioma
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid gap-4">
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Tema principal
            <input value={topic} onChange={(event) => setTopic(event.target.value)} required minLength={3} maxLength={200} placeholder="Ej: nuevo modo Classic de League of Legends" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Título opcional
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={220} placeholder="Si lo dejás vacío, se usa el tema" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Resumen opcional
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={500} rows={3} placeholder="Bajada breve para el borrador" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Tags separados por coma
            <input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="gaming, riot, lol" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Fuentes, una URL por línea
            <textarea value={sourceUrls} onChange={(event) => setSourceUrls(event.target.value)} rows={4} placeholder="https://..." className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-purple-100">
          <input type="checkbox" checked={useLLM} onChange={(event) => setUseLLM(event.target.checked)} />
          Marcar como borrador asistido por IA
        </label>

        {error ? <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</p> : null}
        {result ? (
          <div className="mt-4 rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-100">
            <p className="font-bold">Borrador creado: {result.slug}</p>
            <p className="mt-1 text-green-100/75">Estado: {result.status}</p>
          </div>
        ) : null}

        <button disabled={!canSubmit} type="submit" className="mt-6 rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? 'Generando...' : 'Crear borrador'}
        </button>
      </form>

      <aside className="rounded-3xl border border-purple-500/25 bg-white/[0.04] p-6 text-sm text-purple-100">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-purple-300">Checklist</p>
        <ul className="mt-4 space-y-3 leading-6">
          <li>▣ Requiere sesión admin.</li>
          <li>▣ Guarda en <code className="rounded bg-black/40 px-1">news_articles</code>.</li>
          <li>▣ Queda como draft y review pending.</li>
          <li>▣ No publica automáticamente sin revisión.</li>
          <li>▣ Requiere <code className="rounded bg-black/40 px-1">SUPABASE_SERVICE_ROLE_KEY</code> en Vercel.</li>
        </ul>
      </aside>
    </section>
  )
}
