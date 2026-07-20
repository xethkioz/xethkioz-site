import { useEffect, useMemo, useState } from 'react'
import SafeImage from '../../components/SafeImage'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'

const NEWS_MEDIA_BUCKET = 'news-media'
const MAX_PICKER_ITEMS = 200

type StorageEntry = {
  id?: string | null
  name: string
  created_at?: string | null
  updated_at?: string | null
  metadata?: Record<string, unknown> | null
}

export type CmsMediaSelection = {
  path: string
  name: string
  publicUrl: string
  ownerId: string
  updatedAt: string | null
}

type CmsMediaPickerProps = {
  open: boolean
  currentUrl?: string
  onClose: () => void
  onSelect: (asset: CmsMediaSelection) => void
}

const copy = {
  es: {
    title: 'Elegir desde Media Library',
    description: 'Seleccioná una imagen ya almacenada en news-media. No se crea una copia nueva.',
    close: 'Cerrar selector',
    search: 'Buscar imágenes',
    searchPlaceholder: 'Nombre o ruta',
    loading: 'Cargando imágenes…',
    error: 'No se pudo leer Media Library.',
    empty: 'No hay imágenes que coincidan con la búsqueda.',
    select: 'Usar esta portada',
    selected: 'Portada actual',
    updated: 'Actualizada',
    owner: 'Propietario',
    noDate: 'Sin fecha',
    results: 'resultados',
  },
  en: {
    title: 'Choose from Media Library',
    description: 'Select an image already stored in news-media. No duplicate file is created.',
    close: 'Close picker',
    search: 'Search images',
    searchPlaceholder: 'Name or path',
    loading: 'Loading images…',
    error: 'Could not read Media Library.',
    empty: 'No images match the search.',
    select: 'Use this cover',
    selected: 'Current cover',
    updated: 'Updated',
    owner: 'Owner',
    noDate: 'No date',
    results: 'results',
  },
} as const

function isFolder(entry: StorageEntry) {
  return !entry.id && !entry.metadata
}

async function listFolder(folder = '', depth = 0): Promise<CmsMediaSelection[]> {
  if (depth > 3) return []
  const { data, error } = await supabase.storage.from(NEWS_MEDIA_BUCKET).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'updated_at', order: 'desc' },
  })
  if (error) throw error

  const assets: CmsMediaSelection[] = []
  for (const rawEntry of data ?? []) {
    if (assets.length >= MAX_PICKER_ITEMS) break
    const entry = rawEntry as StorageEntry
    const path = folder ? `${folder}/${entry.name}` : entry.name
    if (isFolder(entry)) {
      assets.push(...await listFolder(path, depth + 1))
      continue
    }
    const mimeType = String(entry.metadata?.mimetype ?? entry.metadata?.contentType ?? '')
    if (mimeType && !mimeType.startsWith('image/')) continue
    const { data: publicData } = supabase.storage.from(NEWS_MEDIA_BUCKET).getPublicUrl(path)
    assets.push({
      path,
      name: entry.name,
      publicUrl: publicData.publicUrl,
      ownerId: path.split('/')[0] ?? '',
      updatedAt: entry.updated_at ?? entry.created_at ?? null,
    })
  }
  return assets.slice(0, MAX_PICKER_ITEMS)
}

function formatDate(value: string | null, lang: 'es' | 'en', fallback: string) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export default function CmsMediaPicker({ open, currentUrl, onClose, onSelect }: CmsMediaPickerProps) {
  const { lang } = useLang()
  const t = copy[lang]
  const [assets, setAssets] = useState<CmsMediaSelection[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let active = true
    setLoading(true)
    setError(null)
    void listFolder()
      .then((items) => {
        if (!active) return
        setAssets(items.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()))
      })
      .catch((caughtError) => {
        if (!active) return
        setAssets([])
        setError(`${t.error} ${caughtError instanceof Error ? caughtError.message : ''}`.trim())
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [open, t.error])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose, open])

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return assets
    return assets.filter((asset) => `${asset.name} ${asset.path}`.toLowerCase().includes(query))
  }, [assets, search])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}>
      <section className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-purple-400/30 bg-[#0a0811] text-white shadow-[0_40px_120px_rgba(0,0,0,.75)]" role="dialog" aria-modal="true" aria-labelledby="cms-media-picker-title" aria-busy={loading}>
        <header className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-start md:justify-between md:p-6">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-orange-300">MEDIA_PICKER</p>
            <h2 id="cms-media-picker-title" className="mt-2 text-2xl font-black md:text-3xl">{t.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100/75">{t.description}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t.close} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-xl text-purple-100 transition hover:border-orange-300 hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">×</button>
        </header>

        <div className="border-b border-white/10 p-5 md:p-6">
          <label className="grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-200">
            {t.search}
            <input autoFocus type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-orange-300" />
          </label>
          {!loading && !error ? <p className="mt-3 text-xs text-purple-200" role="status" aria-live="polite">{filteredAssets.length} {t.results}</p> : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          {loading ? <p className="rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
          {error ? <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200" role="alert">{error}</p> : null}
          {!loading && !error && filteredAssets.length === 0 ? <p className="rounded-2xl border border-dashed border-purple-400/20 p-6 text-purple-100" role="status">{t.empty}</p> : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAssets.map((asset) => {
              const selected = Boolean(currentUrl && asset.publicUrl === currentUrl)
              return (
                <article key={asset.path} className={`overflow-hidden rounded-2xl border bg-white/[0.035] ${selected ? 'border-green-300/60 shadow-[0_0_20px_rgba(50,255,138,.12)]' : 'border-white/10'}`}>
                  <SafeImage src={asset.publicUrl} fallback="/images/articles/fallback.svg" alt={asset.name} className="aspect-video w-full object-cover" />
                  <div className="p-4">
                    <h3 className="line-clamp-2 break-all text-sm font-black">{asset.name}</h3>
                    <p className="mt-2 break-all font-mono text-[9px] text-purple-200/55">{asset.path}</p>
                    <p className="mt-2 text-[10px] text-purple-100/65">{t.owner}: {asset.ownerId}</p>
                    <p className="mt-1 text-[10px] text-purple-100/65">{t.updated}: {formatDate(asset.updatedAt, lang, t.noDate)}</p>
                    <button type="button" onClick={() => onSelect(asset)} className={`mt-4 w-full rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${selected ? 'border-green-300/50 bg-green-300/10 text-green-100' : 'border-orange-300/40 text-orange-100 hover:bg-orange-300/10'}`}>{selected ? t.selected : t.select}</button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
