import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'
import { SITE_VERSION, SOCIAL_LINKS } from '../lib/siteConfig'
import './creator-platform.css'

type Kind = 'programa' | 'videojuego' | 'video' | 'arte' | 'herramienta_ia' | 'otro'
type Status = 'draft' | 'pending_review' | 'published' | 'rejected'
type Project = {
  id: string
  author_id: string
  author_name: string
  title: string
  summary: string
  category: Kind
  external_url: string
  cover_url: string | null
  license: string
  tags: string[]
  status: Status
  created_at: string
  rejection_reason?: string | null
}
type FormValues = Pick<Project, 'title' | 'summary' | 'category' | 'external_url' | 'license'> & { tags: string }
const categories: { id: Kind | 'todos'; label: string; icon: string }[] = [
  { id: 'todos', label: 'Todo', icon: '✦' },
  { id: 'programa', label: 'Programas', icon: '⌘' },
  { id: 'videojuego', label: 'Videojuegos', icon: '◈' },
  { id: 'video', label: 'Videos', icon: '▶' },
  { id: 'arte', label: 'Arte digital', icon: '✳' },
  { id: 'herramienta_ia', label: 'Inteligencia artificial', icon: '✧' },
  { id: 'otro', label: 'Otros proyectos', icon: '◇' },
]
const kindLabel = (key: Kind) => categories.find((category) => category.id === key)?.label || 'Proyecto'
const emptyForm: FormValues = { title: '', summary: '', category: 'programa', external_url: '', license: 'Todos los derechos reservados', tags: '' }

function safeCloudLink(value: string): boolean {
  if (value.length > 2048 || /[\u0000-\u001f]/.test(value)) return false
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false
    const host = url.hostname.toLowerCase()
    return host.includes('.') && host !== 'localhost'
      && !host.endsWith('.localhost') && !host.endsWith('.local') && !host.endsWith('.internal')
      && !/^(127|10|0|169\.254|192\.168)\./.test(host)
      && !/^172\.(1[6-9]|2\d|3[01])\./.test(host)
      // Keep browser submission checks aligned with moderation: raw IPs,
      // encoded addresses and local targets cannot be approved as cloud links.
      && !/^(?:\d+\.){3}\d+$/.test(host) && !host.startsWith('0x')
      && host !== '::1' && !host.startsWith('[')
  } catch {
    return false
  }
}
function creatorLogin(redirect: string) {
  return '/account?mode=signin&redirect=' + encodeURIComponent(redirect)
}
export function PlatformFrame({ children }: { children: ReactNode }) {
  const { openSettings } = usePrivacyConsent()
  return (
    <div className="xk-creator-app">
      <header className="xk-creator-nav">
        <Link className="xk-creator-mark" to="/" aria-label="XETHKIOZ inicio"><span aria-hidden="true">✦</span> XETHKIOZ <small>CREATOR NETWORK</small></Link>
        <nav aria-label="Navegación principal">
          <Link to="/explorar">Explorar</Link>
          <Link to="/green-node">Green Node</Link>
          <Link to="/science">Ciencia</Link>
          <a href="/mascotas/">Mascotas</a>
        </nav>
        <div className="xk-creator-nav-actions">
          <Link className="xk-creator-myspace" to="/mis-proyectos">Mi espacio</Link>
          <Link className="xk-creator-primary xk-creator-primary-small" to="/publicar">+ Publicar</Link>
        </div>
      </header>
      {children}
      <footer className="xk-creator-footer">
        <span>© {new Date().getFullYear()} XETHKIOZ · Creá, compartí, descubrí. · {SITE_VERSION}</span>
        <nav aria-label="Redes oficiales">{SOCIAL_LINKS.filter((social) => social.name === 'Threads' || social.name === 'Instagram').map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">{social.name}</a>)}</nav>
        <nav aria-label="Información"><Link to="/privacy">Privacidad</Link><Link to="/editorial-policy">Reglas de publicación</Link><Link to="/account">Mi cuenta</Link><button type="button" onClick={openSettings}>Cookies</button></nav>
      </footer>
    </div>
  )
}
function ProjectCard({ project }: { project: Project }) {
  const icon = categories.find((item) => item.id === project.category)?.icon ?? '✦'
  return (
    <article className="xk-creator-card">
      <Link to={'/proyecto/' + project.id} className="xk-creator-card-link">
        <div className={'xk-creator-card-art art-' + project.category}><span aria-hidden="true">{icon}</span><small>{kindLabel(project.category)}</small></div>
        <div className="xk-creator-card-body">
          <p className="xk-creator-card-overline">CREACIÓN COMUNITARIA</p>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="xk-creator-card-meta"><span>por {project.author_name}</span><span aria-hidden="true">↗</span></div>
        </div>
      </Link>
    </article>
  )
}
// All catalog filtering and pagination runs on the database, not only on the
// first page shown in the browser. No public project is fabricated for demos.
const PUBLISHED_COLUMNS = 'id,author_id,author_name,title,summary,category,external_url,cover_url,license,tags,status,created_at'
function safeCatalogSearch(value: string) {
  // PostgREST .or() accepts a filter expression. Strip operator syntax and
  // wildcard characters from untrusted search input before interpolating it.
  return value.trim().slice(0, 80).replace(/[%,()."\\_*]/g, ' ').replace(/\s+/g, ' ').trim()
}
function publishedQuery(category: Kind | 'todos', search: string, authorId?: string) {
  let query = supabase.from('creator_projects').select(PUBLISHED_COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
  if (category !== 'todos') query = query.eq('category', category)
  if (authorId) query = query.eq('author_id', authorId)
  const text = safeCatalogSearch(search)
  if (text) query = query.or('title.ilike.%' + text + '%,summary.ilike.%' + text + '%,author_name.ilike.%' + text + '%')
  return query
}
function usePublishedProjects(category: Kind | 'todos' = 'todos', search = '', pageSize = 6, authorId?: string, enabled = true) {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const generation = useRef(0)

  useEffect(() => {
    const currentGeneration = ++generation.current
    setItems([])
    setError('')
    setLoading(true)
    setLoadingMore(false)
    setHasMore(false)
    if (!enabled) {
      setLoading(false)
      return () => { generation.current++ }
    }
    if (!isSupabaseConfigured) {
      setError('El catálogo todavía no está conectado.')
      setLoading(false)
      return () => { generation.current++ }
    }
    void publishedQuery(category, search, authorId).range(0, pageSize)
      .then(({ data, error: queryError }) => {
        if (generation.current !== currentGeneration) return
        if (queryError) setError('Estamos preparando la apertura del catálogo.')
        else {
          setItems((data || []).slice(0, pageSize) as Project[])
          setHasMore((data || []).length > pageSize)
        }
        setLoading(false)
      })
    return () => { generation.current++ }
  }, [category, search, pageSize, authorId, enabled])

  async function loadMore() {
    if (loading || loadingMore || !hasMore || !isSupabaseConfigured || !enabled) return
    const currentGeneration = generation.current
    setLoadingMore(true)
    setError('')
    try {
      const { data, error: queryError } = await publishedQuery(category, search, authorId)
        .range(items.length, items.length + pageSize)
      if (generation.current !== currentGeneration) return
      if (queryError) setError('No pudimos cargar más proyectos. Intentá nuevamente.')
      else {
        setItems((current) => [...current, ...((data || []).slice(0, pageSize) as Project[])])
        setHasMore((data || []).length > pageSize)
      }
    } catch {
      if (generation.current === currentGeneration) setError('No pudimos cargar más proyectos. Intentá nuevamente.')
    } finally {
      if (generation.current === currentGeneration) setLoadingMore(false)
    }
  }
  return { items, loading, error, hasMore, loadingMore, loadMore }
}
function ProjectGrid({ items, loading, error, emptyMessage }: { items: Project[]; loading: boolean; error: string; emptyMessage?: string }) {
  if (loading) return <p className="xk-creator-state" role="status">Cargando proyectos…</p>
  if (error && !items.length) return <p className="xk-creator-state" role="alert">{error}</p>
  if (!items.length) return <div className="xk-creator-state"><h3>Un espacio para nuevas ideas</h3><p>{emptyMessage || 'Todavía no hay proyectos publicados y aprobados. El catálogo crecerá con los primeros creadores.'}</p><Link to="/publicar">Presentá tu proyecto →</Link></div>
  return <>{error && <p className="xk-creator-state" role="alert">{error}</p>}<div className="xk-creator-grid">{items.map((project) => <ProjectCard key={project.id} project={project} />)}</div></>
}

export function CreatorHome() {
  const { items, loading, error } = usePublishedProjects('todos', '', 6)
  return <PlatformFrame>
    <SEO title="XETHKIOZ — Creá, compartí y descubrí" description="La plataforma donde los creadores comparten videojuegos, programas, videos, arte e ideas hechas con inteligencia artificial." url="/" />
    <main>
      <section className="xk-creator-hero">
        <div className="xk-creator-hero-copy">
          <p className="xk-creator-eyebrow"><span aria-hidden="true">●</span> UN ESPACIO PARA CREAR SIN LÍMITES</p>
          <h1>Ideas que inspiran.<br /><em>Creaciones que conectan.</em></h1>
          <p>Compartí tu próximo videojuego, programa, video o proyecto de IA. Encontrá personas con las mismas ganas de crear y hacé que tus ideas lleguen más lejos.</p>
          <div className="xk-creator-hero-actions"><Link className="xk-creator-primary" to="/explorar">Explorar proyectos <span>↗</span></Link><Link className="xk-creator-secondary" to="/publicar">Compartir mi creación <span>→</span></Link></div>
          <div className="xk-creator-hero-note"><span aria-hidden="true">✧</span> Tu creatividad es tuya. Los archivos permanecen en tu nube.</div>
        </div>
        <div className="xk-creator-hero-visual" aria-label="Un universo de creaciones digitales">
          <div className="xk-orbit xk-orbit-one"></div><div className="xk-orbit xk-orbit-two"></div>
          <div className="xk-creator-sphere"><span>✦</span><strong>IMAGINÁ<br />CREÁ<br />COMPARTÍ</strong></div>
          <span className="xk-orb xk-orb-a">🎮</span><span className="xk-orb xk-orb-b">✧</span><span className="xk-orb xk-orb-c">⌘</span><span className="xk-orb xk-orb-d">▶</span>
        </div>
      </section>
      <section className="xk-creator-section">
        <div className="xk-creator-section-head"><div><p className="xk-creator-eyebrow">EXPLORÁ A TU MANERA</p><h2>Cada idea tiene su lugar.</h2></div><Link to="/explorar">Ver categorías →</Link></div>
        <div className="xk-creator-categories">{categories.filter((x) => x.id !== 'todos').map((x) => <Link key={x.id} to={'/explorar?categoria=' + x.id} className={'xk-category-tile tile-' + x.id}><span aria-hidden="true">{x.icon}</span><strong>{x.label}</strong><small>Descubrir →</small></Link>)}</div>
      </section>
      <section className="xk-creator-section">
        <div className="xk-creator-section-head"><div><p className="xk-creator-eyebrow">HECHO POR LA COMUNIDAD</p><h2>Últimas creaciones.</h2></div><Link to="/explorar">Explorar catálogo →</Link></div>
        <ProjectGrid items={items.slice(0, 6)} loading={loading} error={error} />
      </section>
      <section className="xk-creator-section"><div className="xk-creator-section-head"><div><p className="xk-creator-eyebrow">MUNDOS QUE SIGUEN VIVOS</p><h2>Conocimiento, tecnología y naturaleza.</h2></div></div>
        <div className="xk-creator-verticals">
          <Link className="xk-vertical xk-vertical-node" to="/green-node"><small>01 · TECNOLOGÍA</small><strong>GREEN NODE</strong><span>Seguridad, redes y cultura digital.</span><b>Descubrir ↗</b></Link>
          <Link className="xk-vertical xk-vertical-science" to="/science"><small>02 · CONOCIMIENTO</small><strong>CIENCIA</strong><span>Ideas, investigación y curiosidad.</span><b>Explorar ↗</b></Link>
          <a className="xk-vertical xk-vertical-pets" href="/mascotas/"><small>03 · COMUNIDAD</small><strong>MASCOTAS</strong><span>Huellas Argentina: conectar y cuidar.</span><b>Conocer ↗</b></a>
        </div>
      </section>
      <section className="xk-creator-invite"><span aria-hidden="true">✦</span><h2>¿Y si tu próxima idea<br />inspira a miles?</h2><p>Tu espacio creativo comienza con una cuenta gratuita.</p><Link className="xk-creator-primary" to="/account?mode=signup&redirect=%2Fpublicar">Quiero ser creador ↗</Link></section>
    </main>
  </PlatformFrame>
}

export function CreatorExplore() {
  const initial = new URLSearchParams(window.location.search)
  const initialCategory = initial.get('categoria') || 'todos'
  const [category, setCategory] = useState<Kind | 'todos'>(categories.some((item) => item.id === initialCategory) ? initialCategory as Kind | 'todos' : 'todos')
  const [search, setSearch] = useState(initial.get('q') || '')
  const [querySearch, setQuerySearch] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setQuerySearch(search), 350)
    return () => clearTimeout(timer)
  }, [search])
  const { items, loading, error, hasMore, loadingMore, loadMore } = usePublishedProjects(category, querySearch, 24)
  const filtered = items
  return <PlatformFrame>
    <SEO title="Explorar proyectos · XETHKIOZ" description="Explorá videojuegos, programas, videos y herramientas de la comunidad." url="/explorar" />
    <main className="xk-creator-inner"><p className="xk-creator-eyebrow">EL CATÁLOGO DE LA COMUNIDAD</p><h1>Descubrí lo próximo.</h1><p className="xk-creator-lead">Creaciones compartidas por personas de todo el mundo. Publicaciones revisadas antes de aparecer.</p>
      <label className="xk-creator-search"><span aria-hidden="true">⌕</span><span className="sr-only">Buscar proyectos</span><input value={search} maxLength={80} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar juegos, programas, videos, creadores…" /></label>
      <div className="xk-creator-pills" role="group" aria-label="Filtrar por categoría">{categories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.icon} {item.label}</button>)}</div>
      <ProjectGrid items={filtered} loading={loading} error={error} emptyMessage="No encontramos proyectos que coincidan con tu búsqueda. Probá otros términos o categorías." />
      {hasMore && !loading && <div className="xk-creator-more"><button type="button" disabled={loadingMore} onClick={() => void loadMore()}>{loadingMore ? 'Cargando…' : error ? 'Reintentar cargar más' : 'Mostrar más creaciones'}</button></div>}
    </main>
  </PlatformFrame>
}

export function CreatorProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  const [reportReason, setReportReason] = useState<'needs_review' | 'malware' | 'copyright' | 'spam' | 'other'>('needs_review')
  const validId = Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
  useEffect(() => {
    let active = true
    setProject(null)
    setError('')
    setReportMessage('')
    setReportReason('needs_review')
    if (!validId || !isSupabaseConfigured) {
      setError('Proyecto no disponible.')
      return () => { active = false }
    }
    void supabase.from('creator_projects').select(PUBLISHED_COLUMNS).eq('id', id!).eq('status', 'published').maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError || !data) setError('Proyecto no encontrado o aún no aprobado.')
        else setProject(data as Project)
      })
    return () => { active = false }
  }, [id, validId])
  // A route parameter can change without remounting the detail component.
  // Never display or report a previously loaded project's data under a new URL.
  const visibleProject = project && project.id === id ? project : null
  async function reportProject() {
    if (!visibleProject) return
    const { data } = await supabase.auth.getUser()
    if (!data.user) { setReportMessage('Iniciá sesión para reportar este proyecto.'); return }
    const { error: reportError } = await supabase.from('creator_project_reports').insert({ project_id: visibleProject.id, reporter_id: data.user.id, reason: reportReason })
    setReportMessage(reportError ? 'No fue posible registrar el reporte; puede que ya lo hayas reportado.' : 'Reporte recibido para revisión.')
  }
  return <PlatformFrame>
    <SEO title={visibleProject ? visibleProject.title + ' · XETHKIOZ' : 'Proyecto · XETHKIOZ'} url={validId ? '/proyecto/' + id : '/explorar'} noIndex={!visibleProject} />
    <main className="xk-creator-inner"><Link to="/explorar" className="xk-creator-back">← Volver al catálogo</Link>
      {error && <p className="xk-creator-state" role="alert">{error}</p>}
      {!error && !visibleProject && <p className="xk-creator-state">Cargando proyecto…</p>}
      {visibleProject && <article className="xk-creator-detail"><span className="xk-creator-eyebrow">{kindLabel(visibleProject.category)} · POR <Link className="xk-creator-author-link" to={"/creador/" + visibleProject.author_id}>{visibleProject.author_name}</Link></span><h1>{visibleProject.title}</h1><p className="xk-creator-lead">{visibleProject.summary}</p>
        <div className="xk-creator-pills">{visibleProject.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        <p><strong>Licencia:</strong> {visibleProject.license}</p>
        <p>El archivo está alojado fuera de XETHKIOZ, en la nube del creador. Revisá los permisos y la procedencia del archivo antes de descargarlo o ejecutarlo.</p>
        <a className="xk-creator-primary" href={safeCloudLink(visibleProject.external_url) ? visibleProject.external_url : undefined} target="_blank" rel="noopener noreferrer nofollow" aria-disabled={!safeCloudLink(visibleProject.external_url)}>Abrir en la nube del creador ↗</a>
        <div className="xk-creator-report"><label htmlFor="creator-report-reason">¿Por qué querés reportar esta creación?</label><select id="creator-report-reason" value={reportReason} onChange={(event) => setReportReason(event.target.value as typeof reportReason)}><option value="needs_review">Solicitar revisión</option><option value="malware">Posible malware o enlace peligroso</option><option value="copyright">Derechos de autor</option><option value="spam">Spam o engaño</option><option value="other">Otro problema</option></select><button type="button" onClick={() => void reportProject()}>Enviar reporte</button><span role="status">{reportMessage}</span></div>
      </article>}
    </main>
  </PlatformFrame>
}

export function CreatorPublish() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [authorName, setAuthorName] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [rejection, setRejection] = useState('')
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      if (!data.user) { navigate(creatorLogin(id ? '/publicar/' + id : '/publicar'), { replace: true }); return }
      setUserId(data.user.id)
      setAuthorName(String(data.user.user_metadata?.display_name || 'Creador XETHKIOZ').slice(0, 70))
      if (id) {
        const { data: project } = await supabase.from('creator_projects').select('*').eq('id', id).eq('author_id', data.user.id).maybeSingle()
        if (!active) return
        if (!project || !['draft', 'rejected'].includes(project.status)) {
          navigate('/mis-proyectos', { replace: true }); return
        }
        setForm({ title: project.title, summary: project.summary, category: project.category, external_url: project.external_url, license: project.license, tags: (project.tags || []).join(', ') })
        setRejection(typeof project.rejection_reason === 'string' ? project.rejection_reason : '')
      }
      setReady(true)
    }
    void load()
    return () => { active = false }
  }, [navigate, id])
  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }
  async function submit(status: 'draft' | 'pending_review') {
    setMessage('')
    const tags = [...new Set(form.tags.split(',').map((tag) => tag.trim().slice(0, 24)).filter(Boolean))].slice(0, 8)
    if (!userId) { setMessage('Tu sesión expiró. Volvé a iniciar sesión.'); return }
    if ((status === 'pending_review' && (form.title.trim().length < 4 || form.summary.trim().length < 20)) || form.title.trim().length > 100 || form.summary.trim().length > 1200) {
      setMessage('Título: 4–100 caracteres. Descripción: 20–1200 caracteres.'); return
    }
    if (status === 'pending_review' && !safeCloudLink(form.external_url)) { setMessage('Ingresá un enlace HTTPS público y válido de tu nube.'); return }
    if (status === 'draft' && form.external_url.trim() && !safeCloudLink(form.external_url)) { setMessage('El enlace de nube no es seguro. Dejalo en blanco o ingresá un enlace HTTPS válido.'); return }
    setBusy(true)
    const payload = { title: form.title.trim(), summary: form.summary.trim(), category: form.category, external_url: form.external_url.trim(), license: form.license.trim().slice(0, 80), tags, author_name: authorName, status }
    // Author identity is immutable. The browser cannot update author_id or a pending project.
    const result = id
      ? await supabase.from('creator_projects').update(payload).eq('id', id).eq('author_id', userId)
          .in('status', ['draft', 'rejected']).select('id').maybeSingle()
      : await supabase.from('creator_projects').insert({ ...payload, author_id: userId }).select('id').single()
    setBusy(false)
    if (result.error || !result.data) { setMessage('No pudimos guardar. La ficha pudo haber cambiado de estado; revisá tu biblioteca y volvé a intentarlo.'); return }
    navigate('/mis-proyectos?guardado=1')
  }
  return <PlatformFrame>
    <SEO title="Publicar una creación · XETHKIOZ" url="/publicar" noIndex />
    <main className="xk-creator-inner xk-creator-form-page"><Link className="xk-creator-back" to="/mis-proyectos">← Mi espacio</Link><p className="xk-creator-eyebrow">ESTUDIO DE CREACIÓN</p><h1>{id ? 'Editar mi proyecto' : 'Compartí tu creación.'}</h1>
      <p className="xk-creator-lead">Tu archivo sigue guardado en Google Drive, Dropbox, OneDrive o tu nube. XETHKIOZ muestra la ficha y el enlace después de una revisión.</p>
      {rejection && <p className="xk-creator-message" role="status"><strong>Corrección solicitada:</strong> {rejection}</p>}
      {!ready ? <p className="xk-creator-state">Verificando tu cuenta…</p> : <form className="xk-creator-form" onSubmit={(event) => { event.preventDefault(); void submit('pending_review') }}>
        <label>Título<input maxLength={100} minLength={4} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ej.: Mi videojuego de aventuras" /></label>
        <label>Tipo de creación<select value={form.category} onChange={(e) => set('category', e.target.value as Kind)}>{categories.filter((item) => item.id !== 'todos').map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label>Contá de qué se trata<textarea maxLength={1200} minLength={20} rows={6} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="¿Qué creaste? ¿Cómo funciona? ¿Usaste inteligencia artificial?" /></label>
        <div className="xk-creator-cloud-instructions"><strong>01. Guardá el archivo en tu propia nube</strong><p>Elegí un proveedor, subí allí tu programa, juego, video o proyecto y generá un enlace compartido de solo lectura.</p><div><a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/u/0/my-drive">Abrir Google Drive ↗</a><a target="_blank" rel="noopener noreferrer" href="https://onedrive.live.com/">Abrir OneDrive ↗</a><a target="_blank" rel="noopener noreferrer" href="https://www.dropbox.com/home">Abrir Dropbox ↗</a></div></div>
        <label>02. Pegá el enlace público de solo lectura<input type="url" value={form.external_url} onChange={(e) => set('external_url', e.target.value)} placeholder="https://drive.google.com/file/d/…" /><small>No pegues enlaces privados, contraseñas, tokens ni archivos que no tengas derecho a distribuir. XETHKIOZ no puede cambiar los permisos de tu nube.</small></label>
        <label>Etiquetas (separadas por comas, máximo 8)<input maxLength={255} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="unity, arte, IA, comunidad" /></label>
        <label>Licencia o permisos de uso<input maxLength={80} required value={form.license} onChange={(e) => set('license', e.target.value)} /></label>
        <p className="xk-creator-form-policy">No se permiten malware, contenido robado, engaños, piratería ni enlaces peligrosos. Una solicitud de publicación no aparece automáticamente en el sitio.</p>
        {message && <p role="alert" className="xk-creator-message">{message}</p>}
        <div className="xk-creator-form-actions"><button type="button" disabled={busy} onClick={() => void submit('draft')}>Guardar borrador</button><button className="xk-creator-primary" type="submit" disabled={busy}>{busy ? 'Guardando…' : 'Enviar a revisión ↗'}</button></div>
      </form>}
    </main>
  </PlatformFrame>
}

export function CreatorMyProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      if (!data.user) { navigate(creatorLogin('/mis-proyectos'), { replace: true }); return }
      const { data: rows, error: queryError } = await supabase.from('creator_projects').select('*').eq('author_id', data.user.id).order('created_at', { ascending: false }).limit(100)
      if (!active) return
      if (queryError) setError('Todavía no se pudo cargar tu biblioteca. Es posible que la nueva base de datos esté pendiente de activación.')
      else setProjects((rows || []) as Project[])
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [navigate])
  async function removeDraft(project: Project) {
    if (project.status !== 'draft' && project.status !== 'rejected') return
    if (!window.confirm('¿Eliminar definitivamente este borrador?')) return
    setError('')
    // An RLS-denied DELETE can return success with zero affected rows; never
    // hide the project until the database confirms that its draft was deleted.
    const { data: deleted, error: deleteError } = await supabase.from('creator_projects').delete()
      .eq('id', project.id).in('status', ['draft', 'rejected']).select('id').maybeSingle()
    if (deleteError || !deleted) { setError('No se eliminó el borrador. Puede que haya cambiado de estado; actualizá tu biblioteca y volvé a intentarlo.'); return }
    setProjects((items) => items.filter((item) => item.id !== project.id))
  }
  return <PlatformFrame>
    <SEO title="Mi espacio creativo · XETHKIOZ" url="/mis-proyectos" noIndex />
    <main className="xk-creator-inner"><p className="xk-creator-eyebrow">TU BIBLIOTECA PERSONAL</p><h1>Mi espacio creativo.</h1><p className="xk-creator-lead">Administrá tus fichas, borradores y solicitudes. Los archivos siguen bajo tu control en tu nube.</p>
      <Link className="xk-creator-primary" to="/publicar">+ Nueva publicación</Link>
      {error && <p className="xk-creator-state" role="alert">{error}</p>}
      {loading ? <p className="xk-creator-state">Cargando tu biblioteca…</p> : !projects.length ? !error && <p className="xk-creator-state">Todavía no creaste ninguna publicación. Empezá compartiendo tu primer proyecto.</p> : <div className="xk-creator-drafts">{projects.map((project) => <article key={project.id}><div><small>{kindLabel(project.category)} · {project.status === 'draft' ? 'Borrador' : project.status === 'pending_review' ? 'En revisión' : project.status === 'published' ? 'Publicado' : 'Requiere correcciones'}</small><h2>{project.title || 'Borrador sin título'}</h2><p>{project.summary || 'Completá los detalles cuando tengas lista tu idea.'}</p>{project.status === 'rejected' && project.rejection_reason && <p className="xk-creator-message">Motivo: {project.rejection_reason}</p>}</div><div className="xk-creator-draft-actions">{project.status === 'published' ? <Link to={'/proyecto/' + project.id}>Ver publicación ↗</Link> : project.status === 'pending_review' ? <span className="xk-creator-pending-label">En revisión · edición bloqueada</span> : <Link to={'/publicar/' + project.id}>Editar →</Link>}{(project.status === 'draft' || project.status === 'rejected') && <button type="button" onClick={() => void removeDraft(project)}>Eliminar borrador</button>}</div></article>)}</div>}
    </main>
  </PlatformFrame>
}


/** Public profiles deliberately derive identity only from approved project metadata.
 * A visitor cannot enumerate private accounts, drafts or email addresses. */
export function CreatorPublicProfile() {
  const { id } = useParams()
  // Do not query arbitrary account identifiers. Public profiles consist only
  // of approved projects, never auth users, email addresses or private drafts.
  const validId = Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
  const { items: projects, loading, error, hasMore, loadingMore, loadMore } =
    usePublishedProjects('todos', '', 24, validId ? id : undefined, validId)
  const errorMessage = !validId ? 'Perfil no disponible.'
    : !isSupabaseConfigured ? 'Los perfiles todavía están en preparación.'
    : error
  const name = projects[0]?.author_name || 'Creador XETHKIOZ'
  return <PlatformFrame>
    <SEO title={name + ' · Perfil de creador'} description={'Creaciones públicas de ' + name + ' en XETHKIOZ.'} url={validId ? '/creador/' + id : '/explorar'} noIndex={loading || projects.length === 0} />
    <main className="xk-creator-inner">
      <Link className="xk-creator-back" to="/explorar">← Volver al catálogo</Link>
      <section className="xk-creator-profile-hero">
        <div className="xk-creator-profile-avatar" aria-hidden="true">✦</div>
        <div><p className="xk-creator-eyebrow">PERFIL PÚBLICO · XETHKIOZ</p><h1>{name}</h1>
          <p className="xk-creator-lead">{projects.length
            ? 'Mostrando ' + projects.length + ' creaciones públicas y aprobadas.'
            : 'Descubrí los trabajos que este creador comparte con la comunidad.'}</p>
        </div>
      </section>
      {loading ? <p role="status" className="xk-creator-state">Cargando perfil…</p> :
        errorMessage && !projects.length ? <p role="alert" className="xk-creator-state">{errorMessage}</p> :
        !projects.length ? <p className="xk-creator-state">No hay publicaciones públicas de este creador.</p> :
        <ProjectGrid items={projects} loading={false} error={errorMessage} />}
      {hasMore && !loading && <div className="xk-creator-more"><button type="button" disabled={loadingMore} onClick={() => void loadMore()}>{loadingMore ? 'Cargando…' : errorMessage ? 'Reintentar cargar más' : 'Mostrar más creaciones'}</button></div>}
    </main>
  </PlatformFrame>
}
