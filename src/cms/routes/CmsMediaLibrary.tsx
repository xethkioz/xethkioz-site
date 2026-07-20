import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import SafeImage from '../../components/SafeImage'
import { useLang } from '../../lib/LangContext'
import { supabase } from '../../services/supabaseClient'
import { useAdminSession } from '../hooks'

const NEWS_MEDIA_BUCKET = 'news-media'
const MAX_MEDIA_BYTES = 8 * 1024 * 1024
const MAX_LIBRARY_ITEMS = 300
const acceptedMediaTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
])

type StorageEntry = {
  id?: string | null
  name: string
  created_at?: string | null
  updated_at?: string | null
  metadata?: Record<string, unknown> | null
}

type MediaAsset = {
  path: string
  name: string
  ownerId: string
  publicUrl: string
  size: number
  mimeType: string
  createdAt: string | null
  updatedAt: string | null
}

type ScopeFilter = 'all' | 'mine'

const copy = {
  es: {
    eyebrow: 'MEDIA LIBRARY',
    title: 'Imágenes reutilizables del CMS',
    description: 'Explorá portadas ya subidas, cargá nuevos recursos y reutilizá su URL pública sin duplicar archivos.',
    permission: 'Acceso editorial',
    role: 'Rol',
    upload: 'Subir imágenes',
    uploadHint: 'JPG, PNG, WebP o AVIF · máximo 8 MB por archivo · hasta 10 archivos por carga.',
    uploadButton: 'Elegir archivos',
    uploading: 'Subiendo…',
    refresh: 'Actualizar biblioteca',
    search: 'Buscar archivos',
    searchPlaceholder: 'Nombre, ruta o tipo de archivo',
    scope: 'Alcance',
    all: 'Todos los recursos',
    mine: 'Mis recursos',
    loading: 'Leyendo el bucket news-media…',
    loadError: 'No se pudo cargar la biblioteca multimedia.',
    uploadError: 'No se pudieron subir todos los archivos.',
    invalidType: 'Formato no permitido',
    tooLarge: 'supera el máximo de 8 MB',
    maxFiles: 'Podés subir hasta 10 archivos por vez.',
    uploadSuccess: 'Archivos subidos correctamente.',
    copied: 'URL pública copiada.',
    copyError: 'No se pudo copiar la URL en este navegador.',
    deleteConfirm: '¿Eliminar este archivo de forma permanente?',
    deleteSuccess: 'Archivo eliminado de la biblioteca.',
    deleteError: 'No se pudo eliminar el archivo. Solo el propietario o ADMIN pueden borrarlo.',
    emptyTitle: 'No hay imágenes disponibles',
    emptyText: 'Subí el primer recurso o cambiá los filtros de búsqueda.',
    assetCount: 'recursos',
    owner: 'Propietario',
    size: 'Tamaño',
    updated: 'Actualizado',
    path: 'Ruta interna',
    preview: 'Abrir imagen',
    copy: 'Copiar URL',
    remove: 'Eliminar',
    noDate: 'Sin fecha',
    libraryLabel: 'Biblioteca multimedia editorial',
    fileInput: 'Seleccionar imágenes para la biblioteca',
    protectedNote: 'La biblioteca solo enumera archivos para usuarios editoriales autenticados. Las URLs siguen siendo públicas para que las portadas funcionen en el sitio.',
  },
  en: {
    eyebrow: 'MEDIA LIBRARY',
    title: 'Reusable CMS images',
    description: 'Browse uploaded covers, add new assets and reuse their public URL without duplicating files.',
    permission: 'Editorial access',
    role: 'Role',
    upload: 'Upload images',
    uploadHint: 'JPG, PNG, WebP or AVIF · maximum 8 MB per file · up to 10 files per upload.',
    uploadButton: 'Choose files',
    uploading: 'Uploading…',
    refresh: 'Refresh library',
    search: 'Search files',
    searchPlaceholder: 'Name, path or file type',
    scope: 'Scope',
    all: 'All assets',
    mine: 'My assets',
    loading: 'Reading the news-media bucket…',
    loadError: 'Could not load the media library.',
    uploadError: 'Not all files could be uploaded.',
    invalidType: 'Unsupported format',
    tooLarge: 'exceeds the 8 MB limit',
    maxFiles: 'You can upload up to 10 files at once.',
    uploadSuccess: 'Files uploaded successfully.',
    copied: 'Public URL copied.',
    copyError: 'This browser could not copy the URL.',
    deleteConfirm: 'Permanently delete this file?',
    deleteSuccess: 'File removed from the library.',
    deleteError: 'Could not delete the file. Only its owner or ADMIN can remove it.',
    emptyTitle: 'No images available',
    emptyText: 'Upload the first asset or change the search filters.',
    assetCount: 'assets',
    owner: 'Owner',
    size: 'Size',
    updated: 'Updated',
    path: 'Internal path',
    preview: 'Open image',
    copy: 'Copy URL',
    remove: 'Delete',
    noDate: 'No date',
    libraryLabel: 'Editorial media library',
    fileInput: 'Select images for the media library',
    protectedNote: 'Only authenticated editorial users can list this library. URLs remain public so covers continue working on the website.',
  },
} as const

function safeStem(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, '')
  return stem
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'asset'
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value: string | null, lang: 'es' | 'en', fallback: string) {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function isFolder(entry: StorageEntry) {
  return !entry.id && !entry.metadata
}

async function listMediaFolder(folder = '', depth = 0): Promise<MediaAsset[]> {
  if (depth > 3) return []

  const { data, error } = await supabase.storage.from(NEWS_MEDIA_BUCKET).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'updated_at', order: 'desc' },
  })
  if (error) throw error

  const assets: MediaAsset[] = []
  for (const rawEntry of data ?? []) {
    if (assets.length >= MAX_LIBRARY_ITEMS) break
    const entry = rawEntry as StorageEntry
    const path = folder ? `${folder}/${entry.name}` : entry.name

    if (isFolder(entry)) {
      assets.push(...await listMediaFolder(path, depth + 1))
      continue
    }

    const mimeType = String(entry.metadata?.mimetype ?? entry.metadata?.contentType ?? '')
    if (mimeType && !mimeType.startsWith('image/')) continue
    const { data: publicData } = supabase.storage.from(NEWS_MEDIA_BUCKET).getPublicUrl(path)
    assets.push({
      path,
      name: entry.name,
      ownerId: path.split('/')[0] ?? '',
      publicUrl: publicData.publicUrl,
      size: Number(entry.metadata?.size ?? 0),
      mimeType: mimeType || 'image',
      createdAt: entry.created_at ?? null,
      updatedAt: entry.updated_at ?? entry.created_at ?? null,
    })
  }

  return assets.slice(0, MAX_LIBRARY_ITEMS)
}

export default function CmsMediaLibrary() {
  const { lang } = useLang()
  const t = copy[lang]
  const { user, role, canAccessCms, canDelete } = useAdminSession()
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingPath, setDeletingPath] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState<ScopeFilter>('all')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadAssets() {
    setLoading(true)
    setError(null)
    try {
      const nextAssets = await listMediaFolder()
      setAssets(nextAssets.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()))
    } catch (caughtError) {
      setAssets([])
      setError(`${t.loadError} ${caughtError instanceof Error ? caughtError.message : ''}`.trim())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!canAccessCms) {
      setLoading(false)
      return
    }
    void loadAssets()
  }, [canAccessCms, lang])

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase()
    return assets.filter((asset) => {
      if (scope === 'mine' && asset.ownerId !== user?.id) return false
      if (!query) return true
      return `${asset.name} ${asset.path} ${asset.mimeType}`.toLowerCase().includes(query)
    })
  }, [assets, scope, search, user?.id])

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length || !user?.id || !canAccessCms) return
    setError(null)
    setMessage(null)

    if (files.length > 10) {
      setError(t.maxFiles)
      return
    }

    const validationErrors: string[] = []
    for (const file of files) {
      if (!acceptedMediaTypes.has(file.type)) validationErrors.push(`${file.name}: ${t.invalidType}`)
      else if (file.size > MAX_MEDIA_BYTES) validationErrors.push(`${file.name}: ${t.tooLarge}`)
    }
    if (validationErrors.length) {
      setError(validationErrors.join(' · '))
      return
    }

    setUploading(true)
    const uploadErrors: string[] = []
    for (const file of files) {
      const extension = acceptedMediaTypes.get(file.type) as string
      const path = `${user.id}/library/${Date.now()}-${safeStem(file.name)}-${crypto.randomUUID().slice(0, 8)}.${extension}`
      const { error: uploadError } = await supabase.storage.from(NEWS_MEDIA_BUCKET).upload(path, file, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      })
      if (uploadError) uploadErrors.push(`${file.name}: ${uploadError.message}`)
    }

    if (uploadErrors.length) setError(`${t.uploadError} ${uploadErrors.join(' · ')}`)
    else setMessage(t.uploadSuccess)
    await loadAssets()
    setUploading(false)
  }

  async function copyUrl(asset: MediaAsset) {
    setError(null)
    try {
      await navigator.clipboard.writeText(asset.publicUrl)
      setMessage(t.copied)
    } catch {
      setError(t.copyError)
    }
  }

  async function removeAsset(asset: MediaAsset) {
    if (!user?.id || (!canDelete && asset.ownerId !== user.id)) return
    if (!window.confirm(t.deleteConfirm)) return

    setDeletingPath(asset.path)
    setError(null)
    setMessage(null)
    const { error: deleteError } = await supabase.storage.from(NEWS_MEDIA_BUCKET).remove([asset.path])
    if (deleteError) setError(`${t.deleteError} ${deleteError.message}`)
    else {
      setAssets((current) => current.filter((item) => item.path !== asset.path))
      setMessage(t.deleteSuccess)
    }
    setDeletingPath(null)
  }

  return (
    <section className="space-y-6 text-white" aria-labelledby="cms-media-title" aria-busy={loading || uploading}>
      <div className="rounded-3xl border border-orange-400/25 bg-black/40 p-6 shadow-2xl shadow-orange-950/20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">{t.eyebrow}</p>
        <h2 id="cms-media-title" className="mt-3 text-3xl font-black md:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-purple-100">{t.description}</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-purple-100">{t.permission}: <strong>{canAccessCms ? 'OK' : 'DENIED'}</strong> · {t.role}: <strong>{role}</strong></p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-3 rounded-3xl border border-purple-500/20 bg-white/[0.04] p-4 md:grid-cols-[minmax(0,1fr)_220px]" role="search">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
            {t.search}
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-300" />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
            {t.scope}
            <select value={scope} onChange={(event) => setScope(event.target.value as ScopeFilter)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-orange-300">
              <option value="all">{t.all}</option>
              <option value="mine">{t.mine}</option>
            </select>
          </label>
        </div>

        <aside className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.05] p-5" aria-labelledby="media-upload-title">
          <h3 id="media-upload-title" className="font-black text-cyan-100">{t.upload}</h3>
          <p className="mt-2 text-xs leading-5 text-cyan-50/65">{t.uploadHint}</p>
          <label className="mt-4 inline-flex cursor-pointer rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-cyan-50 transition hover:bg-cyan-300/20 focus-within:ring-2 focus-within:ring-cyan-300">
            {uploading ? t.uploading : t.uploadButton}
            <input className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" aria-label={t.fileInput} disabled={uploading || !canAccessCms} onChange={(event) => void uploadFiles(event)} />
          </label>
          <button type="button" disabled={loading} onClick={() => void loadAssets()} className="mt-3 block rounded-full border border-purple-300/35 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-purple-100 transition hover:bg-purple-300/10 disabled:opacity-40">{t.refresh}</button>
        </aside>
      </div>

      <aside className="rounded-2xl border border-green-400/20 bg-green-400/[0.05] p-4 text-xs leading-5 text-green-50/75">{t.protectedNote}</aside>

      {loading ? <p className="rounded-3xl border border-purple-500/20 bg-white/[0.04] p-5 text-purple-100" role="status" aria-live="polite">{t.loading}</p> : null}
      {error ? <p className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-200" role="alert">{error}</p> : null}
      {message ? <p className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-100" role="status" aria-live="polite">{message}</p> : null}

      {!loading && !error ? <p className="text-xs text-purple-200" role="status" aria-live="polite">{filteredAssets.length} {t.assetCount}</p> : null}

      {!loading && !error && filteredAssets.length === 0 ? (
        <article className="rounded-3xl border border-dashed border-purple-400/20 bg-white/[0.025] p-6" role="status"><h3 className="text-xl font-black">{t.emptyTitle}</h3><p className="mt-2 text-sm text-purple-100">{t.emptyText}</p></article>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label={t.libraryLabel}>
        {filteredAssets.map((asset) => {
          const canRemove = Boolean(user?.id && (canDelete || asset.ownerId === user.id))
          return (
            <article key={asset.path} className="overflow-hidden rounded-3xl border border-purple-500/20 bg-white/[0.04] shadow-xl shadow-black/20">
              <a href={asset.publicUrl} target="_blank" rel="noreferrer noopener" aria-label={`${t.preview}: ${asset.name}`} className="block overflow-hidden bg-black/40">
                <SafeImage src={asset.publicUrl} fallback="/images/articles/fallback.svg" alt={asset.name} className="aspect-video w-full object-cover transition duration-500 hover:scale-[1.025]" />
              </a>
              <div className="p-5">
                <h3 className="break-all text-sm font-black">{asset.name}</h3>
                <dl className="mt-4 grid gap-2 text-xs text-purple-100/75">
                  <div><dt className="inline font-black text-purple-200">{t.owner}: </dt><dd className="inline break-all">{asset.ownerId}</dd></div>
                  <div><dt className="inline font-black text-purple-200">{t.size}: </dt><dd className="inline">{formatBytes(asset.size)}</dd></div>
                  <div><dt className="inline font-black text-purple-200">{t.updated}: </dt><dd className="inline"><time dateTime={asset.updatedAt ?? undefined}>{formatDate(asset.updatedAt, lang, t.noDate)}</time></dd></div>
                  <div><dt className="inline font-black text-purple-200">{t.path}: </dt><dd className="inline break-all font-mono text-[10px]">{asset.path}</dd></div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={asset.publicUrl} target="_blank" rel="noreferrer noopener" className="rounded-full border border-purple-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-purple-100 transition hover:bg-purple-500/10">{t.preview} ↗</a>
                  <button type="button" onClick={() => void copyUrl(asset)} className="rounded-full border border-cyan-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-500/10">{t.copy}</button>
                  {canRemove ? <button type="button" disabled={deletingPath === asset.path} onClick={() => void removeAsset(asset)} className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-100 transition hover:bg-red-500/10 disabled:opacity-40">{t.remove}</button> : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
