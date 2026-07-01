import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAdminSession } from '../hooks'
import { supabase } from '../../services/supabaseClient'

type AdStatus = 'draft' | 'review' | 'active' | 'paused' | 'archived'

type AdSlot = {
  id: string
  label: string
  placement: string
  is_active: boolean
}

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

const fallbackSlots: AdSlot[] = [
  { id: 'home-hero', label: 'Home Hero', placement: 'Inicio / portada', is_active: true },
  { id: 'news-inline', label: 'News Inline', placement: 'Entre tarjetas de noticias', is_active: true },
  { id: 'section-sidebar', label: 'Section Sidebar', placement: 'Gaming / Science / Fun / Green Node', is_active: true },
  { id: 'stream-banner', label: 'Stream Banner', placement: 'Avisos Kick / Twitch / YouTube', is_active: true },
]

const statusOptions: AdStatus[] = ['draft', 'review', 'active', 'paused', 'archived']

const emptyForm = {
  slot_id: 'home-hero',
  sponsor_name: '',
  title: '',
  description: '',
  target_url: '',
  image_url: '',
  status: 'draft' as AdStatus,
  starts_at: '',
  ends_at: '',
}

function formatDate(value: string | null) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

function fromDatetimeLocal(value: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export default function CmsAdsManager() {
  const { role, canManageAds } = useAdminSession()
  const [slots, setSlots] = useState<AdSlot[]>(fallbackSlots)
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [form, setForm] = useState(emptyForm)
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
      setError(slotsResult.error?.message ?? campaignsResult.error?.message ?? 'No se pudo cargar ads.')
      setSlots(fallbackSlots)
      setCampaigns([])
    } else {
      const nextSlots = (slotsResult.data ?? []) as AdSlot[]
      setSlots(nextSlots.length ? nextSlots : fallbackSlots)
      setCampaigns((campaignsResult.data ?? []) as AdCampaign[])
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadAds()
  }, [])

  const stats = useMemo(() => ({
    total: campaigns.length,
    active: campaigns.filter((campaign) => campaign.status === 'active').length,
    draft: campaigns.filter((campaign) => campaign.status === 'draft').length,
    paused: campaigns.filter((campaign) => campaign.status === 'paused').length,
  }), [campaigns])

  function updateForm(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function startEdit(campaign: AdCampaign) {
    setEditingId(campaign.id)
    setForm({
      slot_id: campaign.slot_id,
      sponsor_name: campaign.sponsor_name,
      title: campaign.title,
      description: campaign.description ?? '',
      target_url: campaign.target_url ?? '',
      image_url: campaign.image_url ?? '',
      status: campaign.status,
      starts_at: toDatetimeLocal(campaign.starts_at),
      ends_at: toDatetimeLocal(campaign.ends_at),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...emptyForm, slot_id: slots[0]?.id ?? 'home-hero' })
  }

  async function submitCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canManageAds) {
      setError('Solo ADMIN puede crear o editar campañas.')
      return
    }

    const title = form.title.trim()
    const sponsorName = form.sponsor_name.trim()
    if (!title || !sponsorName) {
      setError('Sponsor y título son obligatorios.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    const payload = {
      slot_id: form.slot_id,
      sponsor_name: sponsorName,
      title,
      description: form.description.trim() || null,
      target_url: form.target_url.trim() || null,
      image_url: form.image_url.trim() || null,
      status: form.status,
      starts_at: fromDatetimeLocal(form.starts_at),
      ends_at: fromDatetimeLocal(form.ends_at),
      updated_at: new Date().toISOString(),
    }

    const result = editingId
      ? await supabase.from('ads_campaigns').update(payload).eq('id', editingId)
      : await supabase.from('ads_campaigns').insert(payload)

    if (result.error) {
      setError(result.error.message)
    } else {
      setMessage(editingId ? 'Campaña actualizada correctamente.' : 'Campaña creada correctamente.')
      resetForm()
      await loadAds()
    }

    setSaving(false)
  }

  async function updateCampaignStatus(campaign: AdCampaign, nextStatus: AdStatus) {
    if (!canManageAds) {
      setError('Solo ADMIN puede cambiar estado de campañas.')
      return
    }

    const confirmation = window.confirm(`Cambiar campaña "${campaign.title}" a estado ${nextStatus.toUpperCase()}?`)
    if (!confirmation) return

    setSaving(true)
    setError(null)
    setMessage(null)

    const { error: updateError } = await supabase
      .from('ads_campaigns')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', campaign.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Estado actualizado correctamente.')
      await loadAds()
    }

    setSaving(false)
  }

  return (
    <section className="space-y-6 text-white">
      <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">ADS CONTROL</p>
        <h2 className="mt-3 text-3xl font-black md:text-4xl">Publicidades y sponsors</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">Gestión real de campañas publicitarias conectada a Supabase. La activación queda reservada para ADMIN.</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">Rol actual: <strong>{role}</strong> · Permiso ads: <strong>{canManageAds ? 'habilitado' : 'solo lectura'}</strong></p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Total</p><strong className="mt-2 block text-3xl">{stats.total}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Activas</p><strong className="mt-2 block text-3xl">{stats.active}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Borrador</p><strong className="mt-2 block text-3xl">{stats.draft}</strong></article>
        <article className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-[0.2em] text-purple-200">Pausadas</p><strong className="mt-2 block text-3xl">{stats.paused}</strong></article>
      </div>

      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">{error}</p> : null}
      {message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100">{message}</p> : null}

      <form onSubmit={submitCampaign} className="rounded-3xl border border-purple-500/20 bg-black/35 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">{editingId ? 'Editar campaña' : 'Nueva campaña'}</p>
            <h3 className="mt-2 text-2xl font-black">{editingId ? 'Actualizar sponsor/banner' : 'Crear sponsor/banner'}</h3>
          </div>
          {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">Cancelar edición</button> : null}
        </div>

        <fieldset disabled={!canManageAds || saving} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 disabled:opacity-60">
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Slot<select value={form.slot_id} onChange={(event) => updateForm('slot_id', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">{slots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label} · {slot.placement}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Sponsor<input value={form.sponsor_name} onChange={(event) => updateForm('sponsor_name', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="Marca / sponsor" /></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Título<input value={form.title} onChange={(event) => updateForm('title', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="Título visible" /></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200 xl:col-span-2">Descripción<textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} rows={3} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="Texto corto de campaña" /></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Estado<select value={form.status} onChange={(event) => updateForm('status', event.target.value as AdStatus)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300">{statusOptions.map((status) => <option key={status} value={status}>{status.toUpperCase()}</option>)}</select></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Link destino<input value={form.target_url} onChange={(event) => updateForm('target_url', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="https://..." /></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Imagen/banner URL<input value={form.image_url} onChange={(event) => updateForm('image_url', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" placeholder="https://..." /></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Inicio<input type="datetime-local" value={form.starts_at} onChange={(event) => updateForm('starts_at', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Fin<input type="datetime-local" value={form.ends_at} onChange={(event) => updateForm('ends_at', event.target.value)} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" /></label>
        </fieldset>

        <button disabled={!canManageAds || saving} type="submit" className="mt-5 rounded-full bg-orange px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:shadow-glow-action disabled:opacity-40">{saving ? 'Guardando...' : editingId ? 'Actualizar campaña' : 'Crear campaña'}</button>
      </form>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100">Cargando campañas...</p> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">{campaign.slot_id} · {campaign.status}</p>
                <h3 className="mt-2 text-2xl font-black text-white">{campaign.title}</h3>
                <p className="mt-1 text-sm text-purple-200">Sponsor: {campaign.sponsor_name}</p>
                {campaign.description ? <p className="mt-3 text-sm leading-6 text-purple-100">{campaign.description}</p> : null}
                {campaign.image_url ? <p className="mt-3 break-all text-xs text-purple-200">Imagen: {campaign.image_url}</p> : null}
                {campaign.target_url ? <p className="mt-1 break-all text-xs text-purple-200">Destino: {campaign.target_url}</p> : null}
                <p className="mt-3 text-xs text-purple-200">Inicio: {formatDate(campaign.starts_at)} · Fin: {formatDate(campaign.ends_at)}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 md:max-w-xs md:justify-end">
                <button type="button" onClick={() => startEdit(campaign)} className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-500/10">Editar</button>
                <button disabled={!canManageAds || saving || campaign.status === 'active'} type="button" onClick={() => void updateCampaignStatus(campaign, 'active')} className="rounded-full border border-green-400/50 bg-green-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-green-100 transition hover:bg-green-400/20 disabled:opacity-40">Activar</button>
                <button disabled={!canManageAds || saving || campaign.status === 'paused'} type="button" onClick={() => void updateCampaignStatus(campaign, 'paused')} className="rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-yellow-100 transition hover:bg-yellow-400/20 disabled:opacity-40">Pausar</button>
                <button disabled={!canManageAds || saving || campaign.status === 'archived'} type="button" onClick={() => void updateCampaignStatus(campaign, 'archived')} className="rounded-full border border-red-400/50 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-100 transition hover:bg-red-400/20 disabled:opacity-40">Archivar</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && campaigns.length === 0 ? <article className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-yellow-100"><h3 className="text-xl font-black">Sin campañas todavía</h3><p className="mt-2 text-sm leading-6">Ejecutá la migración de ads y creá la primera campaña desde este panel.</p></article> : null}
    </section>
  )
}
