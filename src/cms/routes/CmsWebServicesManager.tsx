import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import SafeImage from '../../components/SafeImage'
import { fallbackWebServiceOffers } from '../../data/webServiceFallbacks'
import { supabase } from '../../services/supabaseClient'
import type { WebServiceOffer, WebServiceStatus } from '../../types/webServices'
import { useAdminSession } from '../hooks'

const BUCKET = 'web-service-media'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const acceptedImageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
])

const offerFields = [
  'id', 'slug', 'eyebrow', 'title', 'summary', 'description', 'image_url', 'image_path', 'image_alt',
  'price_label', 'delivery_label', 'features', 'cta_label', 'status', 'featured', 'sort_order', 'created_at', 'updated_at',
].join(', ')

const emptyForm = {
  slug: '',
  eyebrow: '',
  title: '',
  summary: '',
  description: '',
  image_url: '',
  image_path: '',
  image_alt: '',
  price_label: 'Presupuesto a medida',
  delivery_label: '',
  features: '',
  cta_label: 'Pedir presupuesto',
  status: 'draft' as WebServiceStatus,
  featured: false,
  sort_order: '100',
}

const inputClass = 'min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-orange-300'
const labelClass = 'grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200'

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

function parseFeatures(value: string) {
  return Array.from(new Set(value.split('\n').map((item) => item.trim()).filter(Boolean))).slice(0, 12)
}

export default function CmsWebServicesManager() {
  const { role, user, canManageWebServices } = useAdminSession()
  const [offers, setOffers] = useState<WebServiceOffer[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadOffers() {
    setLoading(true)
    setError(null)

    const { data, error: loadError } = await supabase
      .from('web_service_offers')
      .select(offerFields)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(200)
      .overrideTypes<WebServiceOffer[], { merge: false }>()

    if (loadError) {
      setOffers([])
      setError(loadError.message)
    } else {
      setOffers(data ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadOffers()
  }, [])

  const stats = useMemo(() => ({
    total: offers.length,
    published: offers.filter((offer) => offer.status === 'published').length,
    draft: offers.filter((offer) => offer.status === 'draft').length,
    featured: offers.filter((offer) => offer.featured && offer.status === 'published').length,
  }), [offers])

  function updateForm<Key extends keyof typeof form>(field: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [field]: value }))
    setError(null)
    setMessage(null)
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  function applyPreset(index: number) {
    const preset = fallbackWebServiceOffers[index]
    if (!preset) return
    setEditingId(null)
    setForm({
      slug: preset.slug,
      eyebrow: preset.eyebrow ?? '',
      title: preset.title,
      summary: preset.summary,
      description: preset.description ?? '',
      image_url: preset.image_url,
      image_path: '',
      image_alt: preset.image_alt,
      price_label: preset.price_label,
      delivery_label: preset.delivery_label ?? '',
      features: preset.features.join('\n'),
      cta_label: preset.cta_label,
      status: 'draft',
      featured: preset.featured,
      sort_order: String(preset.sort_order),
    })
    setMessage('Preset cargado como borrador. Revisalo antes de guardar.')
  }

  function startEdit(offer: WebServiceOffer) {
    setEditingId(offer.id)
    setForm({
      slug: offer.slug,
      eyebrow: offer.eyebrow ?? '',
      title: offer.title,
      summary: offer.summary,
      description: offer.description ?? '',
      image_url: offer.image_url,
      image_path: offer.image_path ?? '',
      image_alt: offer.image_alt,
      price_label: offer.price_label,
      delivery_label: offer.delivery_label ?? '',
      features: offer.features.join('\n'),
      cta_label: offer.cta_label,
      status: offer.status,
      featured: offer.featured,
      sort_order: String(offer.sort_order),
    })
    setError(null)
    setMessage(null)
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!canManageWebServices || !user) {
      setError('Solo ADMIN puede subir imágenes del catálogo.')
      return
    }

    const extension = acceptedImageTypes.get(file.type)
    if (!extension) {
      setError('Formato no permitido. Usá JPG, PNG, WebP o AVIF.')
      return
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError('La imagen supera el máximo de 5 MB.')
      return
    }

    setUploading(true)
    setError(null)
    setMessage(null)

    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    setForm((current) => ({ ...current, image_url: data.publicUrl, image_path: path }))
    setMessage('Imagen subida. Guardá la propuesta para asociarla al catálogo.')
    setUploading(false)
  }

  async function submitOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManageWebServices || !user) {
      setError('Solo ADMIN puede guardar propuestas.')
      return
    }

    const slug = slugify(form.slug || form.title)
    const features = parseFeatures(form.features)
    const sortOrder = Number.parseInt(form.sort_order, 10)

    if (!slug || form.title.trim().length < 3 || form.summary.trim().length < 20) {
      setError('Completá slug, título y un resumen de al menos 20 caracteres.')
      return
    }
    if (!form.image_url.trim() || !form.image_alt.trim()) {
      setError('La propuesta necesita una imagen y un texto alternativo descriptivo.')
      return
    }
    if (features.length < 2) {
      setError('Agregá al menos dos características, una por línea.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    const payload = {
      slug,
      eyebrow: form.eyebrow.trim() || null,
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim(),
      image_path: form.image_path.trim() || null,
      image_alt: form.image_alt.trim(),
      price_label: form.price_label.trim() || 'Presupuesto a medida',
      delivery_label: form.delivery_label.trim() || null,
      features,
      cta_label: form.cta_label.trim() || 'Pedir presupuesto',
      status: form.status,
      featured: form.featured,
      sort_order: Number.isFinite(sortOrder) ? Math.max(0, Math.min(sortOrder, 9999)) : 100,
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase.from('web_service_offers').update(payload).eq('id', editingId)
      : await supabase.from('web_service_offers').insert({ ...payload, created_by: user.id })

    if (result.error) {
      setError(result.error.message)
    } else {
      setMessage(editingId ? 'Propuesta actualizada correctamente.' : 'Propuesta creada correctamente.')
      resetForm()
      await loadOffers()
    }

    setSaving(false)
  }

  async function updateStatus(offer: WebServiceOffer, status: WebServiceStatus) {
    if (!canManageWebServices) {
      setError('Solo ADMIN puede cambiar el estado del catálogo.')
      return
    }

    if (status === 'published' && !window.confirm(`¿Publicar "${offer.title}" en /creacion-web?`)) return

    setSaving(true)
    setError(null)
    const { error: updateError } = await supabase
      .from('web_service_offers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', offer.id)

    if (updateError) setError(updateError.message)
    else {
      setMessage(`Estado actualizado a ${status.toUpperCase()}.`)
      await loadOffers()
    }
    setSaving(false)
  }

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">CREACIÓN WEB · CATÁLOGO</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Propuestas visuales y presupuestos</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Administrá las tarjetas públicas, el orden, los textos y las imágenes que se muestran en <a href="/creacion-web" target="_blank" rel="noreferrer" className="font-bold text-orange-200 underline">/creacion-web</a>.</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{role}</strong> · Gestión: <strong>{canManageWebServices ? 'habilitada' : 'solo lectura'}</strong></p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total', stats.total],
          ['Publicadas', stats.published],
          ['Borradores', stats.draft],
          ['Destacadas', stats.featured],
        ].map(([label, value]) => <article key={String(label)} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}
      </div>

      {error ? <p role="alert" className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
      {message ? <p role="status" className="rounded-3xl border border-orange-400/30 bg-orange-400/10 p-5 text-orange-100">{message}</p> : null}

      <div className="rounded-3xl border border-purple-400/20 bg-purple-500/[0.07] p-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-200">Bases rápidas</p>
        <p className="mt-2 text-sm text-purple-100/70">Cargan un ejemplo editable sin publicar automáticamente.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {fallbackWebServiceOffers.map((offer, index) => <button key={offer.id} type="button" onClick={() => applyPreset(index)} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:bg-purple-500/15">{offer.title}</button>)}
        </div>
      </div>

      <form onSubmit={submitOffer} className="rounded-3xl border border-white/10 bg-black/35 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">{editingId ? 'Editar propuesta' : 'Nueva propuesta'}</p>
            <h3 className="mt-2 text-2xl font-black">Contenido del catálogo</h3>
          </div>
          {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">Cancelar edición</button> : null}
        </div>

        <fieldset disabled={!canManageWebServices || saving} className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 disabled:opacity-55">
          <label className={labelClass}>Título<input required minLength={3} maxLength={100} value={form.title} onChange={(event) => updateForm('title', event.target.value)} className={inputClass} placeholder="Landing premium" /></label>
          <label className={labelClass}>Slug<input required maxLength={100} value={form.slug} onChange={(event) => updateForm('slug', slugify(event.target.value))} className={inputClass} placeholder="landing-premium" /></label>
          <label className={labelClass}>Antetítulo<input maxLength={80} value={form.eyebrow} onChange={(event) => updateForm('eyebrow', event.target.value)} className={inputClass} placeholder="Presencia digital" /></label>
          <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>Resumen<textarea required minLength={20} maxLength={320} rows={3} value={form.summary} onChange={(event) => updateForm('summary', event.target.value)} className={inputClass} placeholder="Propuesta corta visible en la tarjeta pública." /></label>
          <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>Descripción ampliada<textarea maxLength={1200} rows={4} value={form.description} onChange={(event) => updateForm('description', event.target.value)} className={inputClass} placeholder="Detalle adicional del alcance y el tipo de cliente ideal." /></label>
          <label className={labelClass}>Precio / llamada comercial<input required maxLength={80} value={form.price_label} onChange={(event) => updateForm('price_label', event.target.value)} className={inputClass} placeholder="Presupuesto a medida" /></label>
          <label className={labelClass}>Tiempo estimado<input maxLength={100} value={form.delivery_label} onChange={(event) => updateForm('delivery_label', event.target.value)} className={inputClass} placeholder="Entrega estimada: 2–4 semanas" /></label>
          <label className={labelClass}>Texto del botón<input required maxLength={60} value={form.cta_label} onChange={(event) => updateForm('cta_label', event.target.value)} className={inputClass} placeholder="Quiero esta propuesta" /></label>
          <label className={`${labelClass} md:col-span-2`}>Características · una por línea<textarea required rows={7} value={form.features} onChange={(event) => updateForm('features', event.target.value)} className={inputClass} placeholder={'Diseño responsive\nFormulario de contacto\nSEO técnico base'} /></label>
          <div className="space-y-5">
            <label className={labelClass}>Estado<select value={form.status} onChange={(event) => updateForm('status', event.target.value as WebServiceStatus)} className={inputClass}><option value="draft">BORRADOR</option><option value="published">PUBLICADA</option><option value="archived">ARCHIVADA</option></select></label>
            <label className={labelClass}>Orden<input type="number" min="0" max="9999" value={form.sort_order} onChange={(event) => updateForm('sort_order', event.target.value)} className={inputClass} /></label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/45 px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-purple-100"><input type="checkbox" checked={form.featured} onChange={(event) => updateForm('featured', event.target.checked)} className="h-4 w-4 accent-orange-500" />Destacada</label>
          </div>

          <label className={`${labelClass} md:col-span-2`}>URL de imagen<input required value={form.image_url} onChange={(event) => updateForm('image_url', event.target.value)} className={inputClass} placeholder="https://… o /web-services/…" /></label>
          <label className={labelClass}>Subir imagen<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => void uploadImage(event)} className="block min-h-12 rounded-2xl border border-dashed border-orange-400/35 bg-orange-400/[0.06] px-4 py-3 text-xs font-medium normal-case tracking-normal text-orange-100 file:mr-3 file:rounded-full file:border-0 file:bg-orange-400 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-black" />{uploading ? <span className="normal-case tracking-normal text-orange-200">Subiendo imagen…</span> : <span className="normal-case tracking-normal text-purple-200/65">JPG, PNG, WebP o AVIF · máximo 5 MB</span>}</label>
          <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>Texto alternativo<input required maxLength={180} value={form.image_alt} onChange={(event) => updateForm('image_alt', event.target.value)} className={inputClass} placeholder="Describí qué muestra la imagen para lectores de pantalla." /></label>
        </fieldset>

        {form.image_url ? <div className="mt-6 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-2"><SafeImage src={form.image_url} fallback="/web-services/landing-premium.svg" alt={form.image_alt || 'Vista previa de la propuesta'} className="aspect-[12/7.2] w-full rounded-[1.25rem] object-cover" /></div> : null}

        <button disabled={!canManageWebServices || saving || uploading} type="submit" className="mt-6 rounded-full bg-orange px-7 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? 'Guardando…' : editingId ? 'Actualizar propuesta' : 'Crear propuesta'}</button>
      </form>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando catálogo…</p> : null}

      <div className="grid gap-5 xl:grid-cols-2">
        {offers.map((offer) => (
          <article key={offer.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <SafeImage src={offer.image_url} fallback="/web-services/landing-premium.svg" alt={offer.image_alt} className="aspect-[12/5.4] w-full object-cover" />
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">{offer.status} · orden {offer.sort_order}{offer.featured ? ' · destacada' : ''}</p>
              <h3 className="mt-2 text-2xl font-black">{offer.title}</h3>
              <p className="mt-2 text-sm leading-6 text-purple-100/75">{offer.summary}</p>
              <p className="mt-3 text-xs text-purple-200">{offer.price_label}{offer.delivery_label ? ` · ${offer.delivery_label}` : ''}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => startEdit(offer)} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:bg-purple-500/10">Editar</button>
                <button disabled={!canManageWebServices || saving || offer.status === 'published'} type="button" onClick={() => void updateStatus(offer, 'published')} className="rounded-full border border-orange-400/45 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-orange-400/20 disabled:opacity-35">Publicar</button>
                <button disabled={!canManageWebServices || saving || offer.status === 'draft'} type="button" onClick={() => void updateStatus(offer, 'draft')} className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-100 transition hover:bg-yellow-400/20 disabled:opacity-35">Borrador</button>
                <button disabled={!canManageWebServices || saving || offer.status === 'archived'} type="button" onClick={() => void updateStatus(offer, 'archived')} className="rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-100 transition hover:bg-red-400/20 disabled:opacity-35">Archivar</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && offers.length === 0 && !error ? <p className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100">Todavía no hay propuestas. Usá una base rápida o creá la primera desde el formulario.</p> : null}
    </section>
  )
}
