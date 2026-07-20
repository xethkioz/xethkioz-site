import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import { useAdminSession } from '../hooks'

type AdStatus = 'draft' | 'review' | 'active' | 'paused' | 'archived'
type StatusFilter = 'all' | AdStatus

type AdSlot = { id: string; label: string; placement: string; is_active: boolean }
type AdCampaign = {
  id: string
  slot_id: string
  sponsor_name: string
  title: string
  description: string | null
  target_url: string | null
  image_url: string | null
  status: AdStatus
  starts_at: string | null
  ends_at: string | null
  created_at: string
  updated_at: string
}

type AdForm = {
  slot_id: string
  sponsor_name: string
  title: string
  description: string
  target_url: string
  image_url: string
  status: AdStatus
  starts_at: string
  ends_at: string
}

const fallbackSlots: AdSlot[] = [
  { id: 'home-hero', label: 'Home Hero', placement: 'Inicio / portada', is_active: true },
  { id: 'news-inline', label: 'News Inline', placement: 'Entre tarjetas de noticias', is_active: true },
  { id: 'section-sidebar', label: 'Section Sidebar', placement: 'Gaming / Science / Fun / Green Node', is_active: true },
  { id: 'stream-banner', label: 'Stream Banner', placement: 'Avisos Kick / Twitch / YouTube', is_active: true },
]
const statusOptions: AdStatus[] = ['draft', 'review', 'active', 'paused', 'archived']
const emptyForm: AdForm = { slot_id: 'home-hero', sponsor_name: '', title: '', description: '', target_url: '', image_url: '', status: 'draft', starts_at: '', ends_at: '' }

const copy = {
  es: {
    eyebrow: 'CONTROL DE PUBLICIDADES', title: 'Publicidades y sponsors', description: 'Gestión real de campañas publicitarias conectada a Supabase. La activación queda reservada para ADMIN.',
    currentRole: 'Rol actual', permission: 'Permiso ads', enabled: 'habilitado', readOnly: 'solo lectura',
    stats: { total: 'Total', active: 'Activas', draft: 'Borradores', paused: 'Pausadas' },
    presets: 'Presets internos', presetLabels: { stream: 'Banner de stream', news: 'Noticias inline', community: 'Comunidad' },
    editEyebrow: 'Editar campaña', newEyebrow: 'Nueva campaña', editTitle: 'Actualizar sponsor/banner', newTitle: 'Crear sponsor/banner', cancelEdit: 'Cancelar edición',
    slot: 'Slot', sponsor: 'Sponsor', campaignTitle: 'Título', descriptionField: 'Descripción', status: 'Estado', target: 'Link destino', image: 'Imagen/banner URL', start: 'Inicio', end: 'Fin',
    sponsorPlaceholder: 'Marca / sponsor', titlePlaceholder: 'Título visible', descriptionPlaceholder: 'Texto corto de campaña',
    saving: 'Guardando…', updateCampaign: 'Actualizar campaña', createCampaign: 'Crear campaña', loading: 'Cargando campañas…',
    adminCreate: 'Solo ADMIN puede crear o editar campañas.', adminStatus: 'Solo ADMIN puede cambiar el estado de campañas.', required: 'Sponsor y título son obligatorios.',
    invalidTarget: 'El destino debe usar HTTPS o una ruta interna que comience con /.', invalidImage: 'La imagen debe usar HTTPS o una ruta interna que comience con /.', invalidWindow: 'La fecha final debe ser posterior a la fecha de inicio.',
    created: 'Campaña creada correctamente.', updated: 'Campaña actualizada correctamente.', statusUpdated: 'Estado actualizado correctamente.',
    confirmStatus: 'Cambiar campaña', toStatus: 'al estado',
    statuses: { draft: 'Borrador', review: 'En revisión', active: 'Activa', paused: 'Pausada', archived: 'Archivada' } as Record<AdStatus, string>,
    filter: 'Filtrar campañas', allStatuses: 'Todos los estados', imageLabel: 'Imagen', destination: 'Destino', dates: 'Inicio / fin', noDate: 'Sin fecha', edit: 'Editar', activate: 'Activar', pause: 'Pausar', archive: 'Archivar',
    emptyTitle: 'Sin campañas todavía', emptyText: 'Ejecutá la migración de ads y creá la primera campaña desde este panel.', noResults: 'No hay campañas en este estado.', listLabel: 'Campañas publicitarias', formLabel: 'Formulario de campaña publicitaria',
    presetsContent: {
      stream: ['XETHKIOZ en vivo', 'Streams, gaming, tecnología y comunidad. Activá este banner cuando estés por salir en Twitch, Kick o YouTube.'],
      news: ['Radar XETHKIOZ actualizado', 'Noticias gaming, IA, tecnología, memes y comunidad con lectura ampliada y fuente visible.'],
      community: ['Sumate a la comunidad XETHKIOZ', 'Gaming Is My Passion • Beyond The Game. Comunidad, noticias, tecnología y directos.'],
    },
  },
  en: {
    eyebrow: 'ADS CONTROL', title: 'Advertising and sponsors', description: 'Live campaign management connected to Supabase. Activation remains restricted to ADMIN.',
    currentRole: 'Current role', permission: 'Ads permission', enabled: 'enabled', readOnly: 'read only',
    stats: { total: 'Total', active: 'Active', draft: 'Drafts', paused: 'Paused' },
    presets: 'Internal presets', presetLabels: { stream: 'Stream banner', news: 'News inline', community: 'Community' },
    editEyebrow: 'Edit campaign', newEyebrow: 'New campaign', editTitle: 'Update sponsor/banner', newTitle: 'Create sponsor/banner', cancelEdit: 'Cancel editing',
    slot: 'Slot', sponsor: 'Sponsor', campaignTitle: 'Title', descriptionField: 'Description', status: 'Status', target: 'Target link', image: 'Image/banner URL', start: 'Start', end: 'End',
    sponsorPlaceholder: 'Brand / sponsor', titlePlaceholder: 'Visible title', descriptionPlaceholder: 'Short campaign copy',
    saving: 'Saving…', updateCampaign: 'Update campaign', createCampaign: 'Create campaign', loading: 'Loading campaigns…',
    adminCreate: 'Only ADMIN can create or edit campaigns.', adminStatus: 'Only ADMIN can change campaign status.', required: 'Sponsor and title are required.',
    invalidTarget: 'The target must use HTTPS or an internal path beginning with /.', invalidImage: 'The image must use HTTPS or an internal path beginning with /.', invalidWindow: 'The end date must be later than the start date.',
    created: 'Campaign created successfully.', updated: 'Campaign updated successfully.', statusUpdated: 'Status updated successfully.',
    confirmStatus: 'Change campaign', toStatus: 'to status',
    statuses: { draft: 'Draft', review: 'In review', active: 'Active', paused: 'Paused', archived: 'Archived' } as Record<AdStatus, string>,
    filter: 'Filter campaigns', allStatuses: 'All statuses', imageLabel: 'Image', destination: 'Destination', dates: 'Start / end', noDate: 'No date', edit: 'Edit', activate: 'Activate', pause: 'Pause', archive: 'Archive',
    emptyTitle: 'No campaigns yet', emptyText: 'Run the ads migration and create the first campaign from this dashboard.', noResults: 'There are no campaigns in this status.', listLabel: 'Advertising campaigns', formLabel: 'Advertising campaign form',
    presetsContent: {
      stream: ['XETHKIOZ live', 'Streams, gaming, technology and community. Enable this banner before going live on Twitch, Kick or YouTube.'],
      news: ['XETHKIOZ radar updated', 'Gaming, AI, technology, memes and community news with expanded reading and visible sources.'],
      community: ['Join the XETHKIOZ community', 'Gaming Is My Passion • Beyond The Game. Community, news, technology and live streams.'],
    },
  },
} as const

function formatDate(value: string | null, lang: 'es' | 'en', fallback: string) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}
function fromDatetimeLocal(value: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}
function validPublicUrl(value: string) { return !value || /^(https:\/\/|\/)/.test(value) }

export default function CmsAdsManager() {
  const { lang } = useLang()
  const t = copy[lang]
  const { role, canManageAds } = useAdminSession()
  const [slots, setSlots] = useState<AdSlot[]>(fallbackSlots)
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [form, setForm] = useState<AdForm>(emptyForm)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadAds() {
    setLoading(true)
    setError(null)
    const [slotsResult, campaignsResult] = await Promise.all([
      supabase.from('ads_slots').select('id, label, placement, is_active').order('id', { ascending: true }),
      supabase.from('ads_campaigns').select('id, slot_id, sponsor_name, title, description, target_url, image_url, status, starts_at, ends_at, created_at, updated_at').order('created_at', { ascending: false }).limit(100),
    ])
    if (slotsResult.error || campaignsResult.error) {
      setError(slotsResult.error?.message ?? campaignsResult.error?.message ?? t.loading)
      setSlots(fallbackSlots)
      setCampaigns([])
    } else {
      const nextSlots = (slotsResult.data ?? []) as AdSlot[]
      setSlots(nextSlots.length ? nextSlots : fallbackSlots)
      setCampaigns((campaignsResult.data ?? []) as AdCampaign[])
    }
    setLoading(false)
  }
  useEffect(() => { void loadAds() }, [lang])

  const stats = useMemo(() => ({ total: campaigns.length, active: campaigns.filter((campaign) => campaign.status === 'active').length, draft: campaigns.filter((campaign) => campaign.status === 'draft').length, paused: campaigns.filter((campaign) => campaign.status === 'paused').length }), [campaigns])
  const visibleCampaigns = useMemo(() => filter === 'all' ? campaigns : campaigns.filter((campaign) => campaign.status === filter), [campaigns, filter])

  function updateForm<Key extends keyof AdForm>(field: Key, value: AdForm[Key]) { setForm((current) => ({ ...current, [field]: value })) }
  function applyPreset(kind: 'stream' | 'news' | 'community') {
    const [title, description] = t.presetsContent[kind]
    const presetMeta = {
      stream: { slot_id: 'stream-banner', target_url: 'https://www.twitch.tv/xethkioz' },
      news: { slot_id: 'news-inline', target_url: 'https://xethkioz.com.ar/news' },
      community: { slot_id: 'section-sidebar', target_url: 'https://xethkioz.com.ar/community' },
    }[kind]
    setEditingId(null)
    setForm({ slot_id: presetMeta.slot_id, sponsor_name: 'XETHKIOZ', title, description, target_url: presetMeta.target_url, image_url: '/ads/xethkioz-stream-banner.svg', status: 'draft', starts_at: '', ends_at: '' })
  }
  function startEdit(campaign: AdCampaign) {
    setEditingId(campaign.id)
    setForm({ slot_id: campaign.slot_id, sponsor_name: campaign.sponsor_name, title: campaign.title, description: campaign.description ?? '', target_url: campaign.target_url ?? '', image_url: campaign.image_url ?? '', status: campaign.status, starts_at: toDatetimeLocal(campaign.starts_at), ends_at: toDatetimeLocal(campaign.ends_at) })
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  function resetForm() { setEditingId(null); setForm({ ...emptyForm, slot_id: slots[0]?.id ?? 'home-hero' }) }

  async function submitCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManageAds) { setError(t.adminCreate); return }
    const title = form.title.trim()
    const sponsorName = form.sponsor_name.trim()
    if (!title || !sponsorName) { setError(t.required); return }
    if (!validPublicUrl(form.target_url.trim())) { setError(t.invalidTarget); return }
    if (!validPublicUrl(form.image_url.trim())) { setError(t.invalidImage); return }
    const startsAt = fromDatetimeLocal(form.starts_at)
    const endsAt = fromDatetimeLocal(form.ends_at)
    if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) { setError(t.invalidWindow); return }

    setSaving(true); setError(null); setMessage(null)
    const payload = { slot_id: form.slot_id, sponsor_name: sponsorName, title, description: form.description.trim() || null, target_url: form.target_url.trim() || null, image_url: form.image_url.trim() || null, status: form.status, starts_at: startsAt, ends_at: endsAt, updated_at: new Date().toISOString() }
    const result = editingId ? await supabase.from('ads_campaigns').update(payload).eq('id', editingId) : await supabase.from('ads_campaigns').insert(payload)
    if (result.error) setError(result.error.message)
    else { setMessage(editingId ? t.updated : t.created); resetForm(); await loadAds() }
    setSaving(false)
  }

  async function updateCampaignStatus(campaign: AdCampaign, nextStatus: AdStatus) {
    if (!canManageAds) { setError(t.adminStatus); return }
    if (!window.confirm(`${t.confirmStatus} “${campaign.title}” ${t.toStatus} ${t.statuses[nextStatus]}?`)) return
    setSaving(true); setError(null); setMessage(null)
    const { error: updateError } = await supabase.from('ads_campaigns').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', campaign.id)
    if (updateError) setError(updateError.message)
    else { setMessage(t.statusUpdated); await loadAds() }
    setSaving(false)
  }

  return <section className="space-y-6 text-white" aria-labelledby="cms-ads-title" aria-busy={loading || saving}>
    <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20"><p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p><h2 id="cms-ads-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">{t.description}</p><p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">{t.currentRole}: <strong>{role}</strong> · {t.permission}: <strong>{canManageAds ? t.enabled : t.readOnly}</strong></p></div>
    <div className="grid gap-4 md:grid-cols-4">{[[t.stats.total, stats.total], [t.stats.active, stats.active], [t.stats.draft, stats.draft], [t.stats.paused, stats.paused]].map(([label, value]) => <article key={String(label)} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></article>)}</div>
    {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200" role="alert">{error}</p> : null}{message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100" role="status" aria-live="polite">{message}</p> : null}
    <div className="rounded-3xl border border-orange-400/20 bg-orange-500/10 p-5"><p className="text-xs font-black uppercase tracking-[0.25em] text-orange-200">{t.presets}</p><div className="mt-4 flex flex-wrap gap-2">{(['stream', 'news', 'community'] as const).map((kind) => <button key={kind} type="button" onClick={() => applyPreset(kind)} className="rounded-full border border-orange-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-100 transition hover:bg-orange-500/10">{t.presetLabels[kind]}</button>)}</div></div>
    <form onSubmit={submitCampaign} aria-label={t.formLabel} className="rounded-3xl border border-purple-500/20 bg-black/35 p-6"><div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">{editingId ? t.editEyebrow : t.newEyebrow}</p><h3 className="mt-2 text-2xl font-black">{editingId ? t.editTitle : t.newTitle}</h3></div>{editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">{t.cancelEdit}</button> : null}</div>
      <fieldset disabled={!canManageAds || saving} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 disabled:opacity-60">
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.slot}<select value={form.slot_id} onChange={(e) => updateForm('slot_id', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">{slots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label} · {slot.placement}</option>)}</select></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.sponsor}<input required maxLength={120} value={form.sponsor_name} onChange={(e) => updateForm('sponsor_name', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder={t.sponsorPlaceholder} /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.campaignTitle}<input required maxLength={180} value={form.title} onChange={(e) => updateForm('title', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder={t.titlePlaceholder} /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200 xl:col-span-2">{t.descriptionField}<textarea maxLength={500} value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={3} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder={t.descriptionPlaceholder} /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.status}<select value={form.status} onChange={(e) => updateForm('status', e.target.value as AdStatus)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">{statusOptions.map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}</select></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.target}<input type="text" maxLength={500} value={form.target_url} onChange={(e) => updateForm('target_url', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="https://..." /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.image}<input type="text" maxLength={500} value={form.image_url} onChange={(e) => updateForm('image_url', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="/ads/xethkioz-stream-banner.svg" /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.start}<input type="datetime-local" value={form.starts_at} onChange={(e) => updateForm('starts_at', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>
        <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">{t.end}<input type="datetime-local" value={form.ends_at} onChange={(e) => updateForm('ends_at', e.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>
      </fieldset><button disabled={!canManageAds || saving} type="submit" className="mt-5 rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? t.saving : editingId ? t.updateCampaign : t.createCampaign}</button>
    </form>
    <label className="grid max-w-sm gap-2 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs font-black uppercase tracking-[.14em] text-purple-200">{t.filter}<select value={filter} onChange={(event) => setFilter(event.target.value as StatusFilter)} className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm normal-case tracking-normal text-white"><option value="all">{t.allStatuses}</option>{statusOptions.map((status) => <option key={status} value={status}>{t.statuses[status]}</option>)}</select></label>
    {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
    <div className="grid gap-4 xl:grid-cols-2" aria-label={t.listLabel}>{visibleCampaigns.map((campaign) => <article key={campaign.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">{campaign.slot_id} · {t.statuses[campaign.status]}</p><h3 className="mt-2 text-2xl font-black text-white">{campaign.title}</h3><p className="mt-1 text-sm text-purple-200">{t.sponsor}: {campaign.sponsor_name}</p>{campaign.description ? <p className="mt-3 text-sm leading-6 text-purple-100">{campaign.description}</p> : null}{campaign.image_url ? <p className="mt-3 break-all text-xs text-purple-200">{t.imageLabel}: {campaign.image_url}</p> : null}{campaign.target_url ? <p className="mt-1 break-all text-xs text-purple-200">{t.destination}: {campaign.target_url}</p> : null}<p className="mt-3 text-xs text-purple-200">{t.dates}: <time dateTime={campaign.starts_at ?? undefined}>{formatDate(campaign.starts_at, lang, t.noDate)}</time> · <time dateTime={campaign.ends_at ?? undefined}>{formatDate(campaign.ends_at, lang, t.noDate)}</time></p></div><div className="flex shrink-0 flex-wrap gap-2 md:max-w-xs md:justify-end"><button type="button" onClick={() => startEdit(campaign)} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">{t.edit}</button><button disabled={!canManageAds || saving || campaign.status === 'active'} type="button" onClick={() => void updateCampaignStatus(campaign, 'active')} className="rounded-full border border-green-400/50 bg-green-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-green-100 transition hover:bg-green-400/20 disabled:opacity-40">{t.activate}</button><button disabled={!canManageAds || saving || campaign.status === 'paused'} type="button" onClick={() => void updateCampaignStatus(campaign, 'paused')} className="rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-yellow-100 transition hover:bg-yellow-400/20 disabled:opacity-40">{t.pause}</button><button disabled={!canManageAds || saving || campaign.status === 'archived'} type="button" onClick={() => void updateCampaignStatus(campaign, 'archived')} className="rounded-full border border-red-400/50 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-400/20 disabled:opacity-40">{t.archive}</button></div></div></article>)}</div>
    {!loading && campaigns.length === 0 ? <article className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100" role="status"><h3 className="text-xl font-black">{t.emptyTitle}</h3><p className="mt-2 text-sm leading-6">{t.emptyText}</p></article> : null}
    {!loading && campaigns.length > 0 && visibleCampaigns.length === 0 ? <p className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-white/50" role="status">{t.noResults}</p> : null}
  </section>
}
