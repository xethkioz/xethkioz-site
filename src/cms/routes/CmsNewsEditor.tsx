import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

type NewsStatus = 'draft' | 'review' | 'published' | 'archived'
type ReviewStatus = 'pending' | 'approved' | 'rejected'

type EditableNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  status: NewsStatus
  review_status: ReviewStatus
  editor_notes: string | null
  published_at: string | null
}

export default function CmsNewsEditor() {
  const { id } = useParams()
  const [article, setArticle] = useState<EditableNewsArticle | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState<NewsStatus>('draft')
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('pending')
  const [editorNotes, setEditorNotes] = useState('')
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isNew = !id

  useEffect(() => {
    let active = true

    async function loadArticle() {
      if (!id) return
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('news_articles')
        .select('id, slug, title, summary, status, review_status, editor_notes, published_at')
        .eq('id', id)
        .maybeSingle()

      if (!active) return

      if (queryError) {
        setError(queryError.message)
      } else if (!data) {
        setError('No se encontró la noticia solicitada.')
      } else {
        const row = data as EditableNewsArticle
        setArticle(row)
        setTitle(row.title)
        setSummary(row.summary ?? '')
        setStatus(row.status)
        setReviewStatus(row.review_status)
        setEditorNotes(row.editor_notes ?? '')
      }

      setLoading(false)
    }

    void loadArticle()

    return () => {
      active = false
    }
  }, [id])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id || !article) return

    setSaving(true)
    setError(null)
    setMessage(null)

    const shouldPublishNow = status === 'published' && !article.published_at
    const { error: updateError } = await supabase
      .from('news_articles')
      .update({
        title: title.trim(),
        summary: summary.trim() || null,
        status,
        review_status: reviewStatus,
        editor_notes: editorNotes.trim() || null,
        published_at: shouldPublishNow ? new Date().toISOString() : article.published_at,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Noticia actualizada correctamente.')
      setArticle((current) => current ? {
        ...current,
        title: title.trim(),
        summary: summary.trim() || null,
        status,
        review_status: reviewStatus,
        editor_notes: editorNotes.trim() || null,
        published_at: shouldPublishNow ? new Date().toISOString() : current.published_at,
      } : current)
    }

    setSaving(false)
  }

  if (isNew) {
    return (
      <section className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 text-white shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Editor</p>
        <h2 className="mt-3 text-3xl font-black">Nuevo artículo</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Para mantener trazabilidad, la creación inicial se hace desde el generador editorial.
        </p>
        <Link to="/cms/generate" className="mt-6 inline-flex rounded-full bg-orange px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">
          Ir al generador
        </Link>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 text-white shadow-2xl shadow-purple-950/20">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Editor</p>
      <h2 className="mt-3 text-3xl font-black">Editar artículo</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
        Revisión rápida de borradores generados antes de publicarlos.
      </p>

      {loading ? <p className="mt-6 rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando noticia...</p> : null}
      {error ? <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}

      {article ? (
        <form onSubmit={handleSave} className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-purple-500/20 bg-white/[0.03] p-5 text-sm text-purple-100">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Slug</p>
            <p className="mt-2 font-mono text-xs">{article.slug}</p>
          </div>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Título
            <input value={title} onChange={(event) => setTitle(event.target.value)} required className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Resumen
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
              Estado
              <select value={status} onChange={(event) => setStatus(event.target.value as NewsStatus)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">
                <option value="draft">Borrador</option>
                <option value="review">En revisión</option>
                <option value="published">Publicada</option>
                <option value="archived">Archivada</option>
              </select>
            </label>

            <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
              Revisión
              <select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value as ReviewStatus)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
              </select>
            </label>
          </div>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
            Notas editoriales
            <textarea value={editorNotes} onChange={(event) => setEditorNotes(event.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>

          {message ? <p className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-green-100">{message}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button disabled={saving} type="submit" className="rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:opacity-40">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <Link to="/cms/news" className="rounded-full border border-purple-400/40 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-purple-100 transition hover:bg-purple-500/10">
              Volver al listado
            </Link>
          </div>
        </form>
      ) : null}
    </section>
  )
}
