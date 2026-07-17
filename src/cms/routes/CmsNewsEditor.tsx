import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import SafeImage from '../../components/SafeImage'
import { authNexusService } from '../../services/auth/authNexusService'
import type { XethkiozAuthorizedSession } from '../../services/auth/authSchema'
import { supabase } from '../../services/supabaseClient'

type NewsStatus = 'draft' | 'review' | 'published' | 'archived'
type ReviewStatus = 'pending' | 'approved' | 'rejected'

const NEWS_MEDIA_BUCKET = 'news-media'
const MAX_COVER_BYTES = 8 * 1024 * 1024
const acceptedCoverTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
])

type EditableNewsArticle = {
  id: string
  slug: string
  title: string
  summary: string | null
  status: NewsStatus
  review_status: ReviewStatus
  editor_notes: string | null
  published_at: string | null
  cover_image_url: string | null
  cover_image_alt: string | null
  cover_image_path: string | null
  content: Array<{ type?: string; text?: string }>
  source_urls: string[]
  tags: string[]
}

function countEditorialWords(content: EditableNewsArticle['content']) {
  return content.reduce((total, block) => total + String(block.text ?? '').trim().split(/\s+/).filter(Boolean).length, 0)
}

export default function CmsNewsEditor() {
  const { id } = useParams()
  const [session, setSession] = useState<XethkiozAuthorizedSession | null>(() => authNexusService.getSnapshot())
  const [article, setArticle] = useState<EditableNewsArticle | null>(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState<NewsStatus>('draft')
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>('pending')
  const [editorNotes, setEditorNotes] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [coverImageAlt, setCoverImageAlt] = useState('')
  const [coverImagePath, setCoverImagePath] = useState('')
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isNew = !id
  const isAdmin = session?.role === 'ADMIN'
  const canEdit = Boolean(session?.permissions.canAccessCms || session?.permissions.canInsertArticles || isAdmin)
  const cleanTitleLength = title.trim().length
  const cleanSummaryLength = summary.trim().length
  const publicUrl = article ? `https://www.xethkioz.com.ar/news/${article.slug}` : 'https://www.xethkioz.com.ar/news/...'
  const contentWordCount = article ? countEditorialWords(article.content) : 0
  const headingCount = article?.content.filter((block) => block.type === 'heading').length ?? 0
  const hasSource = Boolean(article?.source_urls.length)
  const depthReady = contentWordCount >= 220 && headingCount >= 3 && hasSource
  const editorialChecks = [
    { label: 'Título claro (35–70 caracteres)', pass: cleanTitleLength >= 35 && cleanTitleLength <= 70 },
    { label: 'Resumen SEO (120–165 caracteres)', pass: cleanSummaryLength >= 120 && cleanSummaryLength <= 165 },
    { label: 'Portada configurada', pass: Boolean(coverImageUrl.trim()) },
    { label: 'Portada accesible', pass: Boolean(coverImageAlt.trim()) },
    { label: 'Revisión editorial aprobada', pass: reviewStatus === 'approved' },
    { label: 'Desarrollo editorial (mínimo 220 palabras)', pass: contentWordCount >= 220 },
    { label: 'Ruta narrativa (mínimo 3 capítulos)', pass: headingCount >= 3 },
    { label: 'Al menos una fuente verificable', pass: hasSource },
  ]
  const passedChecks = editorialChecks.filter((check) => check.pass).length

  useEffect(() => {
    const stopAuthListener = authNexusService.startAuthStateListener()
    const unsubscribe = authNexusService.onChange(setSession)
    void authNexusService.hydrateCurrentSession().catch(() => undefined)
    return () => {
      unsubscribe()
      stopAuthListener()
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadArticle() {
      if (!id) return
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('news_articles')
        .select('id, slug, title, summary, status, review_status, editor_notes, published_at, cover_image_url, cover_image_alt, cover_image_path, content, source_urls, tags')
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
        setCoverImageUrl(row.cover_image_url ?? '')
        setCoverImageAlt(row.cover_image_alt ?? '')
        setCoverImagePath(row.cover_image_path ?? '')
      }

      setLoading(false)
    }

    void loadArticle()

    return () => {
      active = false
    }
  }, [id])

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!canEdit || !session?.userId) {
      setError('Necesitás permisos editoriales para subir una portada.')
      return
    }

    const extension = acceptedCoverTypes.get(file.type)
    if (!extension) {
      setError('Formato no permitido. Usá JPG, PNG, WebP o AVIF.')
      return
    }
    if (file.size > MAX_COVER_BYTES) {
      setError('La portada supera el máximo de 8 MB.')
      return
    }

    setUploadingCover(true)
    setError(null)
    setMessage(null)

    const path = `${session.userId}/${id}/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from(NEWS_MEDIA_BUCKET).upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      setError(uploadError.message)
      setUploadingCover(false)
      return
    }

    const { data } = supabase.storage.from(NEWS_MEDIA_BUCKET).getPublicUrl(path)
    setCoverImageUrl(data.publicUrl)
    setCoverImagePath(path)
    setMessage('Portada subida. Guardá los cambios para asociarla a la noticia.')
    setUploadingCover(false)
  }

  async function updateArticle(nextStatus = status, nextReviewStatus = reviewStatus, publishNow = false) {
    if (!id || !article) return
    if (!canEdit) {
      setError('No tenés permisos para editar esta noticia.')
      return
    }

    const cleanTitle = title.trim()
    if (!cleanTitle) {
      setError('El título no puede quedar vacío.')
      return
    }
    const cleanCoverImageUrl = coverImageUrl.trim()
    const cleanCoverImageAlt = coverImageAlt.trim()
    if (cleanCoverImageUrl && !/^(https:\/\/|\/)/.test(cleanCoverImageUrl)) {
      setError('La portada debe usar una URL HTTPS o una ruta interna que comience con /.')
      return
    }
    if (cleanCoverImageUrl && !cleanCoverImageAlt) {
      setError('Agregá un texto alternativo para que la portada sea accesible.')
      return
    }

    const requestedStatus = publishNow || nextStatus === 'published'
    if (requestedStatus && !depthReady) {
      setError(`La publicación no supera el control de profundidad: ${contentWordCount}/220 palabras, ${headingCount}/3 capítulos y ${hasSource ? 'fuente presente' : 'sin fuente'}. Ampliá el dossier desde el generador antes de publicarlo.`)
      return
    }
    const safeStatus: NewsStatus = requestedStatus && !isAdmin ? 'review' : nextStatus
    const safeReviewStatus: ReviewStatus = requestedStatus && !isAdmin ? 'pending' : nextReviewStatus

    setSaving(true)
    setError(null)
    setMessage(null)

    const publishedAt = isAdmin && (publishNow || (safeStatus === 'published' && !article.published_at))
      ? new Date().toISOString()
      : safeStatus === 'published'
        ? article.published_at
        : null

    const { error: updateError } = await supabase
      .from('news_articles')
      .update({
        title: cleanTitle,
        summary: summary.trim() || null,
        status: safeStatus,
        review_status: safeReviewStatus,
        editor_notes: editorNotes.trim() || null,
        cover_image_url: cleanCoverImageUrl || null,
        cover_image_alt: cleanCoverImageUrl ? cleanCoverImageAlt : null,
        cover_image_path: cleanCoverImageUrl ? coverImagePath || null : null,
        published_at: publishedAt,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage(safeStatus === 'published' ? 'Noticia publicada correctamente.' : 'Noticia enviada/guardada para revisión.')
      setStatus(safeStatus)
      setReviewStatus(safeReviewStatus)
      setArticle((current) => current ? {
        ...current,
        title: cleanTitle,
        summary: summary.trim() || null,
        status: safeStatus,
        review_status: safeReviewStatus,
        editor_notes: editorNotes.trim() || null,
        published_at: publishedAt,
        cover_image_url: cleanCoverImageUrl || null,
        cover_image_alt: cleanCoverImageUrl ? cleanCoverImageAlt : null,
        cover_image_path: cleanCoverImageUrl ? coverImagePath || null : null,
      } : current)
    }

    setSaving(false)
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await updateArticle(status === 'published' && !isAdmin ? 'review' : status, reviewStatus)
  }

  async function handleSubmitForReview() {
    await updateArticle('review', 'pending', false)
  }

  async function handlePublishNow() {
    if (!isAdmin) {
      setError('Solo un administrador puede aprobar y publicar directamente.')
      return
    }
    await updateArticle('published', 'approved', true)
  }

  if (isNew) {
    return (
      <section className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 text-white shadow-2xl shadow-purple-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Editor</p>
        <h2 className="mt-3 text-3xl font-black">Nuevo artículo</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Para mantener trazabilidad, la creación inicial se hace desde el generador editorial.</p>
        <Link to="/cms/generate" className="mt-6 inline-flex rounded-full bg-orange px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">Ir al generador</Link>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-purple-500/20 bg-black/35 p-6 text-white shadow-2xl shadow-purple-950/20">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Editor</p>
      <h2 className="mt-3 text-3xl font-black">Editar artículo</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Moderadores y editores pueden guardar/enviar a revisión. Solo ADMIN puede aprobar, publicar o eliminar.</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{session?.role ?? 'GUEST'}</strong></p>

      {loading ? <p className="mt-6 rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando noticia...</p> : null}
      {error ? <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}

      {article ? (
        <form onSubmit={handleSave} className="mt-6 grid gap-4">
          <div className="rounded-2xl border border-purple-500/20 bg-white/[0.03] p-5 text-sm text-purple-100">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200">Slug</p>
            <p className="mt-2 font-mono text-xs">{article.slug}</p>
            {article.status === 'published' ? <Link to={`/news/${article.slug}`} className="mt-4 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/10">Ver pública</Link> : null}
          </div>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Título<span className={`float-right font-mono tracking-normal ${cleanTitleLength >= 35 && cleanTitleLength <= 70 ? 'text-green-300' : 'text-orange-300'}`}>{cleanTitleLength}/70</span><input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} aria-describedby="news-title-guidance" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /><span id="news-title-guidance" className="block normal-case tracking-normal text-purple-200/65">Ideal para buscadores: entre 35 y 70 caracteres.</span></label>
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Resumen<span className={`float-right font-mono tracking-normal ${cleanSummaryLength >= 120 && cleanSummaryLength <= 165 ? 'text-green-300' : 'text-orange-300'}`}>{cleanSummaryLength}/165</span><textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} maxLength={320} aria-describedby="news-summary-guidance" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /><span id="news-summary-guidance" className="block normal-case tracking-normal text-purple-200/65">Ideal para Google y redes: entre 120 y 165 caracteres.</span></label>

          <div className="grid gap-4 rounded-2xl border border-orange-400/20 bg-orange-500/[0.04] p-5 md:grid-cols-[1fr_12rem]">
            <div className="grid gap-4">
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Subir portada<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploadingCover || !canEdit} onChange={(event) => void uploadCover(event)} className="block min-h-12 w-full rounded-2xl border border-dashed border-orange-400/35 bg-orange-400/[0.06] px-4 py-3 text-xs font-medium normal-case tracking-normal text-orange-100 file:mr-3 file:rounded-full file:border-0 file:bg-orange-400 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-black disabled:opacity-50" />{uploadingCover ? <span className="normal-case tracking-normal text-orange-200">Subiendo portada…</span> : <span className="normal-case tracking-normal text-purple-200/65">JPG, PNG, WebP o AVIF · máximo 8 MB</span>}</label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">URL de portada<input type="url" value={coverImageUrl} onChange={(event) => { setCoverImageUrl(event.target.value); setCoverImagePath('') }} placeholder="https://... o /images/..." className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Texto alternativo<input value={coverImageAlt} onChange={(event) => setCoverImageAlt(event.target.value)} maxLength={240} placeholder="Qué muestra la imagen" className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>
              <p className="text-xs normal-case leading-5 tracking-normal text-purple-200/75">Usá una imagen horizontal, idealmente 1600 × 900. El texto alternativo es obligatorio cuando hay portada.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {coverImageUrl ? <SafeImage src={coverImageUrl} fallback="/images/articles/fallback.svg" alt={coverImageAlt || 'Vista previa de portada'} className="aspect-video h-full w-full object-cover" /> : <div className="grid aspect-video h-full place-items-center p-4 text-center text-xs text-purple-200/60">Vista previa</div>}
            </div>
          </div>

          <section className="grid gap-5 rounded-3xl border border-[#32FF8A]/20 bg-[radial-gradient(circle_at_100%_0%,rgba(50,255,138,.09),transparent_38%),rgba(0,0,0,.35)] p-5 xl:grid-cols-[.75fr_1.25fr]" aria-labelledby="editorial-quality-title">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#32FF8A]">QUALITY_GATE</p><h3 id="editorial-quality-title" className="mt-2 text-xl font-black uppercase text-white">Control editorial</h3></div>
                <strong className="rounded-full border border-[#32FF8A]/30 bg-[#32FF8A]/10 px-3 py-2 font-mono text-xs text-[#32FF8A]">{passedChecks}/{editorialChecks.length}</strong>
              </div>
              <ul className="mt-5 grid gap-2">
                {editorialChecks.map((check) => <li key={check.label} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-xs ${check.pass ? 'border-green-400/20 bg-green-400/[0.06] text-green-100' : 'border-white/10 bg-white/[0.025] text-purple-100/65'}`}><span aria-hidden="true">{check.pass ? '✓' : '○'}</span>{check.label}<span className="sr-only">: {check.pass ? 'completo' : 'pendiente'}</span></li>)}
              </ul>
              <p className="mt-4 text-xs leading-5 text-purple-200/65">La publicación sigue bajo control del ADMIN. Esta guía previene títulos cortados, resúmenes débiles e imágenes sin descripción.</p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white p-4 text-[#202124] shadow-xl">
                <p className="truncate text-xs text-[#202124]">XETHKIOZ › news › {article.slug}</p>
                <p className="mt-1 line-clamp-1 text-xl text-[#1a0dab]">{title.trim() || 'Título de la noticia · XETHKIOZ'}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#4d5156]">{summary.trim() || 'El resumen aparecerá aquí para anticipar cómo se verá la noticia en los resultados de búsqueda.'}</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111118] shadow-xl">
                {coverImageUrl ? <SafeImage src={coverImageUrl} fallback="/images/articles/fallback.svg" alt="" className="aspect-[1.91/1] w-full object-cover" /> : <div className="grid aspect-[1.91/1] place-items-center bg-[linear-gradient(135deg,#201337,#0A0A0F)] font-mono text-xs uppercase tracking-[0.2em] text-purple-200/60">Vista social sin portada</div>}
                <div className="p-4"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-purple-300">XETHKIOZ.COM.AR</p><h4 className="mt-2 line-clamp-2 text-lg font-black text-white">{title.trim() || 'Título para compartir en redes'}</h4><p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400">{summary.trim() || 'Resumen de la publicación para redes sociales.'}</p></div>
              </div>
              <p className="break-all font-mono text-[9px] text-purple-200/45">Canonical preview: {publicUrl}</p>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Estado<select value={status} onChange={(event) => setStatus(event.target.value as NewsStatus)} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300"><option value="draft">Borrador</option><option value="review">En revisión</option>{isAdmin ? <option value="published">Publicada</option> : null}<option value="archived">Archivada</option></select></label>
            <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Revisión<select value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value as ReviewStatus)} disabled={!isAdmin} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300 disabled:opacity-60"><option value="pending">Pendiente</option>{isAdmin ? <option value="approved">Aprobada</option> : null}<option value="rejected">Rechazada</option></select></label>
          </div>

          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">Notas editoriales<textarea value={editorNotes} onChange={(event) => setEditorNotes(event.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>

          {message ? <p className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-green-100">{message}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button disabled={saving || !canEdit} type="submit" className="rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
            <button disabled={saving || !canEdit} type="button" onClick={handleSubmitForReview} className="rounded-full border border-blue-400/50 bg-blue-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-blue-100 transition hover:bg-blue-400/20 disabled:opacity-40">Enviar a revisión</button>
            {isAdmin ? <button disabled={saving} type="button" onClick={handlePublishNow} className="rounded-full border border-green-400/50 bg-green-400/10 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-green-100 transition hover:bg-green-400/20 disabled:opacity-40">Publicar ahora</button> : null}
            <Link to="/cms/news" className="rounded-full border border-purple-400/40 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-purple-100 transition hover:bg-purple-500/10">Volver al listado</Link>
          </div>
        </form>
      ) : null}
    </section>
  )
}
