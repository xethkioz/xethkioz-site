import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import SafeImage from '../../components/SafeImage'
import { fallbackWebServiceOffers } from '../../data/webServiceFallbacks'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import type { WebServiceOffer, WebServiceStatus } from '../../types/webServices'
import { useAdminSession } from '../hooks'

const BUCKET = 'web-service-media'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const acceptedImageTypes = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['image/avif', 'avif']])
const offerFields = ['id', 'slug', 'eyebrow', 'title', 'summary', 'description', 'image_url', 'image_path', 'image_alt', 'price_label', 'delivery_label', 'features', 'cta_label', 'status', 'featured', 'sort_order', 'created_at', 'updated_at'].join(', ')
const inputClass = 'min-h-12 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-medium normal-case tracking-normal text-white outline-none transition placeholder:text-white/25 focus:border-orange-300'
const labelClass = 'grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200'

type OfferForm = { slug: string; eyebrow: string; title: string; summary: string; description: string; image_url: string; image_path: string; image_alt: string; price_label: string; delivery_label: string; features: string; cta_label: string; status: WebServiceStatus; featured: boolean; sort_order: string }
const emptyForm: OfferForm = { slug: '', eyebrow: '', title: '', summary: '', description: '', image_url: '', image_path: '', image_alt: '', price_label: 'Presupuesto a medida', delivery_label: '', features: '', cta_label: 'Pedir presupuesto', status: 'draft', featured: false, sort_order: '100' }

const copy = {
  es: {
    eyebrow: 'CREACIÓN WEB · CATÁLOGO', title: 'Propuestas visuales y presupuestos', description: 'Administrá las tarjetas públicas, el orden, los textos y las imágenes que se muestran en',
    currentRole: 'Rol actual', management: 'Gestión', enabled: 'habilitada', readOnly: 'solo lectura', stats: { total: 'Total', published: 'Publicadas', draft: 'Borradores', featured: 'Destacadas' },
    quickBases: 'Bases rápidas', quickText: 'Cargan un ejemplo editable sin publicar automáticamente.', presetLoaded: 'Preset cargado como borrador. Revisalo antes de guardar.',
    editEyebrow: 'Editar propuesta', newEyebrow: 'Nueva propuesta', formTitle: 'Contenido del catálogo', cancel: 'Cancelar edición',
    fields: { title: 'Título', slug: 'Slug', eyebrow: 'Antetítulo', summary: 'Resumen', description: 'Descripción ampliada', price: 'Precio / llamada comercial', delivery: 'Tiempo estimado', cta: 'Texto del botón', features: 'Características · una por línea', status: 'Estado', order: 'Orden', featured: 'Destacada', imageUrl: 'URL de imagen', upload: 'Subir imagen', alt: 'Texto alternativo' },
    placeholders: { title: 'Landing premium', slug: 'landing-premium', eyebrow: 'Presencia digital', summary: 'Propuesta corta visible en la tarjeta pública.', description: 'Detalle adicional del alcance y el tipo de cliente ideal.', price: 'Presupuesto a medida', delivery: 'Entrega estimada: 2–4 semanas', cta: 'Quiero esta propuesta', features: 'Diseño responsive\nFormulario de contacto\nSEO técnico base', alt: 'Describí qué muestra la imagen para lectores de pantalla.' },
    statuses: { draft: 'Borrador', published: 'Publicada', archived: 'Archivada' } as Record<WebServiceStatus, string>,
    uploading: 'Subiendo imagen…', uploadHint: 'JPG, PNG, WebP o AVIF · máximo 5 MB', previewAlt: 'Vista previa de la propuesta', saving: 'Guardando…', update: 'Actualizar propuesta', create: 'Crear propuesta', loading: 'Cargando catálogo…',
    adminUpload: 'Solo ADMIN puede subir imágenes del catálogo.', adminSave: 'Solo ADMIN puede guardar propuestas.', adminStatus: 'Solo ADMIN puede cambiar el estado del catálogo.', invalidFormat: 'Formato no permitido. Usá JPG, PNG, WebP o AVIF.', tooLarge: 'La imagen supera el máximo de 5 MB.', uploaded: 'Imagen subida. Guardá la propuesta para asociarla al catálogo.', required: 'Completá slug, título y un resumen de al menos 20 caracteres.', imageRequired: 'La propuesta necesita una imagen y un texto alternativo descriptivo.', invalidImage: 'La imagen debe usar HTTPS o una ruta interna que comience con /.', featuresRequired: 'Agregá al menos dos características, una por línea.', created: 'Propuesta creada correctamente.', updated: 'Propuesta actualizada correctamente.',
    confirmPublish: '¿Publicar esta propuesta en /creacion-web?', statusUpdated: 'Estado actualizado', order: 'orden', featured: 'destacada', edit: 'Editar', publish: 'Publicar', draft: 'Borrador', archive: 'Archivar', empty: 'Todavía no hay propuestas. Usá una base rápida o creá la primera desde el formulario.', listLabel: 'Propuestas del catálogo de creación web', publicPage: 'Abrir página pública', updatedLabel: 'Actualizada', noDate: 'Sin fecha',
  },
  en: {
    eyebrow: 'WEB CREATION · CATALOG', title: 'Visual solutions and quotes', description: 'Manage the public cards, order, copy and images displayed on',
    currentRole: 'Current role', management: 'Management', enabled: 'enabled', readOnly: 'read only', stats: { total: 'Total', published: 'Published', draft: 'Drafts', featured: 'Featured' },
    quickBases: 'Quick foundations', quickText: 'Load an editable example without publishing automatically.', presetLoaded: 'Preset loaded as a draft. Review it before saving.',
    editEyebrow: 'Edit solution', newEyebrow: 'New solution', formTitle: 'Catalog content', cancel: 'Cancel editing',
    fields: { title: 'Title', slug: 'Slug', eyebrow: 'Eyebrow', summary: 'Summary', description: 'Expanded description', price: 'Price / commercial message', delivery: 'Estimated timing', cta: 'Button text', features: 'Features · one per line', status: 'Status', order: 'Order', featured: 'Featured', imageUrl: 'Image URL', upload: 'Upload image', alt: 'Alternative text' },
    placeholders: { title: 'Premium landing page', slug: 'premium-landing-page', eyebrow: 'Digital presence', summary: 'Short proposal visible on the public card.', description: 'Additional details about scope and ideal client.', price: 'Custom quote', delivery: 'Estimated delivery: 2–4 weeks', cta: 'I want this solution', features: 'Responsive design\nContact form\nBaseline technical SEO', alt: 'Describe what the image shows for screen readers.' },
    statuses: { draft: 'Draft', published: 'Published', archived: 'Archived' } as Record<WebServiceStatus, string>,
    uploading: 'Uploading image…', uploadHint: 'JPG, PNG, WebP or AVIF · maximum 5 MB', previewAlt: 'Solution preview', saving: 'Saving…', update: 'Update solution', create: 'Create solution', loading: 'Loading catalog…',
    adminUpload: 'Only ADMIN can upload catalog images.', adminSave: 'Only ADMIN can save solutions.', adminStatus: 'Only ADMIN can change catalog status.', invalidFormat: 'Unsupported format. Use JPG, PNG, WebP or AVIF.', tooLarge: 'The image exceeds the 5 MB limit.', uploaded: 'Image uploaded. Save the solution to attach it to the catalog.', required: 'Complete the slug, title and a summary of at least 20 characters.', imageRequired: 'The solution needs an image and descriptive alternative text.', invalidImage: 'The image must use HTTPS or an internal path beginning with /.', featuresRequired: 'Add at least two features, one per line.', created: 'Solution created successfully.', updated: 'Solution updated successfully.',
    confirmPublish: 'Publish this solution on /creacion-web?', statusUpdated: 'Status updated', order: 'order', featured: 'featured', edit: 'Edit', publish: 'Publish', draft: 'Draft', archive: 'Archive', empty: 'There are no solutions yet. Use a quick foundation or create the first one from the form.', listLabel: 'Web Creation catalog solutions', publicPage: 'Open public page', updatedLabel: 'Updated', noDate: 'No date',
  },
} as const

function slugify(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100) }
function parseFeatures(value: string) { return Array.from(new Set(value.split('\n').map((item) => item.trim()).filter(Boolean))).slice(0, 12) }
function validImageUrl(value: string) { return /^(https:\/\/|\/)/.test(value) }
function formatDate(value: string, lang: 'es' | 'en', fallback: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? fallback : new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date) }

export default function CmsWebServicesManager() {
  const { lang } = useLang()
  const t = copy[lang]
  const { role, user, canManageWebServices } = useAdminSession()
  const [offers, setOffers] = useState<WebServiceOffer[]>([])
  const [form, setForm] = useState<OfferForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadOffers() {
    setLoading(true); setError(null)
    const { data, error: loadError } = await supabase.from('web_service_offers').select(offerFields).order('sort_order', { ascending: true }).order('created_at', { ascending: false }).limit(200).overrideTypes<WebServiceOffer[], { merge: false }>()
    if (loadError) { setOffers([]); setError(loadError.message) } else setOffers(data ?? [])
    setLoading(false)
  }
  useEffect(() => { void loadOffers() }, [])
  const stats = useMemo(() => ({ total: offers.length, published: offers.filter((offer) => offer.status === 'published').length, draft: offers.filter((offer) => offer.status === 'draft').length, featured: offers.filter((offer) => offer.featured && offer.status === 'published').length }), [offers])

  function updateForm<Key extends keyof OfferForm>(field: Key, value: OfferForm[Key]) { setForm((current) => ({ ...current, [field]: value })); setError(null); setMessage(null) }
  function resetForm() { setEditingId(null); setForm({ ...emptyForm, price_label: lang === 'es' ? 'Presupuesto a medida' : 'Custom quote', cta_label: lang === 'es' ? 'Pedir presupuesto' : 'Request a quote' }) }
  function applyPreset(index: number) {
    const preset = fallbackWebServiceOffers[index]; if (!preset) return
    setEditingId(null); setForm({ slug: preset.slug, eyebrow: preset.eyebrow ?? '', title: preset.title, summary: preset.summary, description: preset.description ?? '', image_url: preset.image_url, image_path: '', image_alt: preset.image_alt, price_label: preset.price_label, delivery_label: preset.delivery_label ?? '', features: preset.features.join('\n'), cta_label: preset.cta_label, status: 'draft', featured: preset.featured, sort_order: String(preset.sort_order) }); setMessage(t.presetLoaded)
  }
  function startEdit(offer: WebServiceOffer) {
    setEditingId(offer.id); setForm({ slug: offer.slug, eyebrow: offer.eyebrow ?? '', title: offer.title, summary: offer.summary, description: offer.description ?? '', image_url: offer.image_url, image_path: offer.image_path ?? '', image_alt: offer.image_alt, price_label: offer.price_label, delivery_label: offer.delivery_label ?? '', features: offer.features.join('\n'), cta_label: offer.cta_label, status: offer.status, featured: offer.featured, sort_order: String(offer.sort_order) }); setError(null); setMessage(null); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
    if (!canManageWebServices || !user) { setError(t.adminUpload); return }
    const extension = acceptedImageTypes.get(file.type); if (!extension) { setError(t.invalidFormat); return }
    if (file.size > MAX_IMAGE_BYTES) { setError(t.tooLarge); return }
    setUploading(true); setError(null); setMessage(null)
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false })
    if (uploadError) setError(uploadError.message)
    else { const { data } = supabase.storage.from(BUCKET).getPublicUrl(path); setForm((current) => ({ ...current, image_url: data.publicUrl, image_path: path })); setMessage(t.uploaded) }
    setUploading(false)
  }

  async function submitOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!canManageWebServices || !user) { setError(t.adminSave); return }
    const slug = slugify(form.slug || form.title); const features = parseFeatures(form.features); const sortOrder = Number.parseInt(form.sort_order, 10); const imageUrl = form.image_url.trim()
    if (!slug || form.title.trim().length < 3 || form.summary.trim().length < 20) { setError(t.required); return }
    if (!imageUrl || !form.image_alt.trim()) { setError(t.imageRequired); return }
    if (!validImageUrl(imageUrl)) { setError(t.invalidImage); return }
    if (features.length < 2) { setError(t.featuresRequired); return }
    setSaving(true); setError(null); setMessage(null)
    const payload = { slug, eyebrow: form.eyebrow.trim() || null, title: form.title.trim(), summary: form.summary.trim(), description: form.description.trim() || null, image_url: imageUrl, image_path: form.image_path.trim() || null, image_alt: form.image_alt.trim(), price_label: form.price_label.trim() || (lang === 'es' ? 'Presupuesto a medida' : 'Custom quote'), delivery_label: form.delivery_label.trim() || null, features, cta_label: form.cta_label.trim() || (lang === 'es' ? 'Pedir presupuesto' : 'Request a quote'), status: form.status, featured: form.featured, sort_order: Number.isFinite(sortOrder) ? Math.max(0, Math.min(sortOrder, 9999)) : 100, updated_at: new Date().toISOString() }
    const result = editingId ? await supabase.from('web_service_offers').update(payload).eq('id', editingId) : await supabase.from('web_service_offers').insert({ ...payload, created_by: user.id })
    if (result.error) setError(result.error.message); else { setMessage(editingId ? t.updated : t.created); resetForm(); await loadOffers() }
    setSaving(false)
  }

  async function updateStatus(offer: WebServiceOffer, status: WebServiceStatus) {
    if (!canManageWebServices) { setError(t.adminStatus); return }
    if (status === 'published' && !window.confirm(`${t.confirmPublish}\n\n${offer.title}`)) return
    setSaving(true); setError(null)
    const { error: updateError } = await supabase.from('web_service_offers').update({ status, updated_at: new Date().toISOString() }).eq('id', offer.id)
    if (updateError) setError(updateError.message); else { setMessage(`${t.statusUpdated}: ${t.statuses[status]}.`); await loadOffers() }
    setSaving(false)
  }

  return <section className="space-y-6 text-white" aria-labelledby="cms-web-services-title" aria-busy={loading || saving || uploading}>
    <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20"><p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p><h2 id="cms-web-services-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">{t.description} <a href="/creacion-web" target="_blank" rel="noreferrer noopener" className="font-bold text-orange-200 underline">/creacion-web</a>.</p><p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">{t.currentRole}: <strong>{role}</strong> · {t.management}: <strong>{canManageWebServices ? t.enabled : t.readOnly}</strong></p><a href="/creacion-web" target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100">{t.publicPage} ↗</a></div>
    <div className="grid gap-4 md:grid-cols-4">{[[t.stats.total, stats.total], [t.stats.published, stats.published], [t.stats.draft, stats.draft], [t.stats.featured, stats.featured]].map(([label, value]) => <article key={String(label)} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}</div>
    {error ? <p role="alert" className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}{message ? <p role="status" aria-live="polite" className="rounded-3xl border border-orange-400/30 bg-orange-400/10 p-5 text-orange-100">{message}</p> : null}
    <div className="rounded-3xl border border-purple-400/20 bg-purple-500/[0.07] p-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-purple-200">{t.quickBases}</p><p className="mt-2 text-sm text-purple-100/70">{t.quickText}</p><div className="mt-4 flex flex-wrap gap-2">{fallbackWebServiceOffers.map((offer, index) => <button key={offer.id} type="button" onClick={() => applyPreset(index)} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:bg-purple-500/15">{offer.title}</button>)}</div></div>
    <form onSubmit={submitOffer} className="rounded-3xl border border-white/10 bg-black/35 p-6 md:p-8"><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">{editingId ? t.editEyebrow : t.newEyebrow}</p><h3 className="mt-2 text-2xl font-black">{t.formTitle}</h3></div>{editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">{t.cancel}</button> : null}</div>
      <fieldset disabled={!canManageWebServices || saving} className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3 disabled:opacity-55">
        <label className={labelClass}>{t.fields.title}<input required minLength={3} maxLength={100} value={form.title} onChange={(e) => updateForm('title', e.target.value)} className={inputClass} placeholder={t.placeholders.title} /></label><label className={labelClass}>{t.fields.slug}<input required maxLength={100} value={form.slug} onChange={(e) => updateForm('slug', slugify(e.target.value))} className={inputClass} placeholder={t.placeholders.slug} /></label><label className={labelClass}>{t.fields.eyebrow}<input maxLength={80} value={form.eyebrow} onChange={(e) => updateForm('eyebrow', e.target.value)} className={inputClass} placeholder={t.placeholders.eyebrow} /></label>
        <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>{t.fields.summary}<textarea required minLength={20} maxLength={320} rows={3} value={form.summary} onChange={(e) => updateForm('summary', e.target.value)} className={inputClass} placeholder={t.placeholders.summary} /></label><label className={`${labelClass} md:col-span-2 xl:col-span-3`}>{t.fields.description}<textarea maxLength={1200} rows={4} value={form.description} onChange={(e) => updateForm('description', e.target.value)} className={inputClass} placeholder={t.placeholders.description} /></label>
        <label className={labelClass}>{t.fields.price}<input required maxLength={80} value={form.price_label} onChange={(e) => updateForm('price_label', e.target.value)} className={inputClass} placeholder={t.placeholders.price} /></label><label className={labelClass}>{t.fields.delivery}<input maxLength={100} value={form.delivery_label} onChange={(e) => updateForm('delivery_label', e.target.value)} className={inputClass} placeholder={t.placeholders.delivery} /></label><label className={labelClass}>{t.fields.cta}<input required maxLength={60} value={form.cta_label} onChange={(e) => updateForm('cta_label', e.target.value)} className={inputClass} placeholder={t.placeholders.cta} /></label>
        <label className={`${labelClass} md:col-span-2`}>{t.fields.features}<textarea required rows={7} value={form.features} onChange={(e) => updateForm('features', e.target.value)} className={inputClass} placeholder={t.placeholders.features} /></label><div className="space-y-5"><label className={labelClass}>{t.fields.status}<select value={form.status} onChange={(e) => updateForm('status', e.target.value as WebServiceStatus)} className={inputClass}>{(Object.keys(t.statuses) as WebServiceStatus[]).map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}</select></label><label className={labelClass}>{t.fields.order}<input type="number" min="0" max="9999" value={form.sort_order} onChange={(e) => updateForm('sort_order', e.target.value)} className={inputClass} /></label><label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/45 px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-purple-100"><input type="checkbox" checked={form.featured} onChange={(e) => updateForm('featured', e.target.checked)} className="h-4 w-4 accent-orange-500" />{t.fields.featured}</label></div>
        <label className={`${labelClass} md:col-span-2`}>{t.fields.imageUrl}<input required value={form.image_url} onChange={(e) => { updateForm('image_url', e.target.value); updateForm('image_path', '') }} className={inputClass} placeholder="https://… /web-services/…" /></label><label className={labelClass}>{t.fields.upload}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" aria-label={t.fields.upload} onChange={(e) => void uploadImage(e)} className="block min-h-12 rounded-2xl border border-dashed border-orange-400/35 bg-orange-400/[0.06] px-4 py-3 text-xs font-medium normal-case tracking-normal text-orange-100 file:mr-3 file:rounded-full file:border-0 file:bg-orange-400 file:px-3 file:py-1.5 file:text-xs file:font-black file:text-black" />{uploading ? <span className="normal-case tracking-normal text-orange-200">{t.uploading}</span> : <span className="normal-case tracking-normal text-purple-200/65">{t.uploadHint}</span>}</label><label className={`${labelClass} md:col-span-2 xl:col-span-3`}>{t.fields.alt}<input required maxLength={180} value={form.image_alt} onChange={(e) => updateForm('image_alt', e.target.value)} className={inputClass} placeholder={t.placeholders.alt} /></label>
      </fieldset>{form.image_url ? <div className="mt-6 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-2"><SafeImage src={form.image_url} fallback="/web-services/landing-premium.svg" alt={form.image_alt || t.previewAlt} className="aspect-[12/7.2] w-full rounded-[1.25rem] object-cover" /></div> : null}<button disabled={!canManageWebServices || saving || uploading} type="submit" className="mt-6 rounded-full bg-orange px-7 py-3 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? t.saving : editingId ? t.update : t.create}</button>
    </form>
    {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
    <div className="grid gap-5 xl:grid-cols-2" aria-label={t.listLabel}>{offers.map((offer) => <article key={offer.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"><SafeImage src={offer.image_url} fallback="/web-services/landing-premium.svg" alt={offer.image_alt} className="aspect-[12/5.4] w-full object-cover" /><div className="p-5"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">{t.statuses[offer.status]} · {t.order} {offer.sort_order}{offer.featured ? ` · ${t.featured}` : ''}</p><h3 className="mt-2 text-2xl font-black">{offer.title}</h3><p className="mt-2 text-sm leading-6 text-purple-100/75">{offer.summary}</p><p className="mt-3 text-xs text-purple-200">{offer.price_label}{offer.delivery_label ? ` · ${offer.delivery_label}` : ''}</p><p className="mt-2 text-[10px] text-purple-200/50">{t.updatedLabel}: <time dateTime={offer.updated_at}>{formatDate(offer.updated_at, lang, t.noDate)}</time></p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => startEdit(offer)} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:bg-purple-500/10">{t.edit}</button><button disabled={!canManageWebServices || saving || offer.status === 'published'} type="button" onClick={() => void updateStatus(offer, 'published')} className="rounded-full border border-orange-400/45 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-orange-100 transition hover:bg-orange-400/20 disabled:opacity-35">{t.publish}</button><button disabled={!canManageWebServices || saving || offer.status === 'draft'} type="button" onClick={() => void updateStatus(offer, 'draft')} className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-yellow-100 transition hover:bg-yellow-400/20 disabled:opacity-35">{t.draft}</button><button disabled={!canManageWebServices || saving || offer.status === 'archived'} type="button" onClick={() => void updateStatus(offer, 'archived')} className="rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-100 transition hover:bg-red-400/20 disabled:opacity-35">{t.archive}</button></div></div></article>)}</div>
    {!loading && offers.length === 0 && !error ? <p className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100" role="status">{t.empty}</p> : null}
  </section>
}
