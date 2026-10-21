import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
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
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port || value.length > 2048) return false
    const host = url.hostname.toLowerCase()
    return host.includes('.') && host !== 'localhost'
      && !host.endsWith('.localhost') && !host.endsWith('.local') && !host.endsWith('.internal')
      && !/^(127|10|0|169\.254|192\.168)\./.test(host)
      && !/^172\.(1[6-9]|2\d|3[01])\./.test(host)
      && host !== '::1' && !host.startsWith('[')
  } catch {
    return false
  }
}
function creatorLogin(redirect: string) {
  return '/account?mode=signin&redirect=' + encodeURIComponent(redirect)
}
function PlatformFrame({ children }: { children: ReactNode }) {
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
        <span>© {new Date().getFullYear()} XETHKIOZ · Creá, compartí, descubrí.</span>
        <nav aria-label="Información"><Link to="/privacy">Privacidad</Link><Link to="/editorial-policy">Reglas de publicación</Link><Link to="/account">Mi cuenta</Link></nav>
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
function usePublishedProjects() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    if (!isSupabaseConfigured) {
      setError('El catálogo todavía no está conectado.')
      setLoading(false)
      return
    }
    void supabase.from('creator_projects').select('id, author_id, author_name, title, summary, category, external_url, cover_url, license, tags, status, created_at')
      .eq('status', 'published').order('created_at', { ascending: false }).limit(48)
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) setError('Estamos preparando la apertura del catálogo.')
        else setItems((data ?? []) as Project[])
        setLoading(false)
      })
    return () => { active = false }
  }, [])
  return { items, loading, error }
}
function ProjectGrid({ items, loading, error }: { items: Project[]; loading: boolean; error: string }) {
  if (loading) return <p className="xk-creator-state" role="status">Cargando proyectos…</p>
  if (error) return <p className="xk-creator-state" role="status">{error}</p>
  if (!items.length) return <div className="xk-creator-state"><h3>Un espacio para nuevas ideas</h3><p>Todavía no hay proyectos publicados y aprobados. El catálogo crecerá con los primeros creadores.</p><Link to="/publicar">Presentá tu proyecto →</Link></div>
  return <div className="xk-creator-grid">{items.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
}

export function CreatorHome() {
  const { items, loading, error } = usePublishedProjects()
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
  const { items, loading, error } = usePublishedProjects()
  const initialCategory = new URLSearchParams(window.location.search).get('categoria') || 'todos'
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  const filtered = items.filter((item) => (category === 'todos' || item.category === category)
    && (item.title + ' ' + item.summary + ' ' + item.tags.join(' ')).toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')))
  return <PlatformFrame>
    <SEO title="Explorar proyectos · XETHKIOZ" description="Explorá videojuegos, programas, videos y herramientas de la comunidad." url="/explorar" />
    <main className="xk-creator-inner"><p className="xk-creator-eyebrow">EL CATÁLOGO DE LA COMUNIDAD</p><h1>Descubrí lo próximo.</h1><p className="xk-creator-lead">Creaciones compartidas por personas de todo el mundo. Publicaciones revisadas antes de aparecer.</p>
      <label className="xk-creator-search"><span aria-hidden="true">⌕</span><span className="sr-only">Buscar proyectos</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar juegos, programas, videos, creadores…" /></label>
      <div className="xk-creator-pills" role="group" aria-label="Filtrar por categoría">{categories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.icon} {item.label}</button>)}</div>
      <ProjectGrid items={filtered} loading={loading} error={error} />
    </main>
  </PlatformFrame>
}

export function CreatorProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [reportMessage, setReportMessage] = useState('')
  useEffect(() => {
    let active = true
    if (!id || !isSupabaseConfigured) { setError('Proyecto no disponible.'); return }
    void supabase.from('creator_projects').select('*').eq('id', id).eq('status', 'published').maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError || !data) setError('Proyecto no encontrado o aún no aprobado.')
        else setProject(data as Project)
      })
    return () => { active = false }
  }, [id])
  async function reportProject() {
    if (!project) return
    const { data } = await supabase.auth.getUser()
    if (!data.user) { setReportMessage('Iniciá sesión para reportar este proyecto.'); return }
    const { error: reportError } = await supabase.from('creator_project_reports').insert({ project_id: project.id, reporter_id: data.user.id, reason: 'needs_review' })
    setReportMessage(reportError ? 'No fue posible registrar el reporte; puede que ya lo hayas reportado.' : 'Reporte recibido para revisión.')
  }
  return <PlatformFrame>
    <SEO title={project ? project.title + ' · XETHKIOZ' : 'Proyecto · XETHKIOZ'} url={id ? '/proyecto/' + id : '/explorar'} />
    <main className="xk-creator-inner"><Link to="/explorar" className="xk-creator-back">← Volver al catálogo</Link>
      {error && <p className="xk-creator-state" role="alert">{error}</p>}
      {!error && !project && <p className="xk-creator-state">Cargando proyecto…</p>}
      {project && <article className="xk-creator-detail"><span className="xk-creator-eyebrow">{kindLabel(project.category)} · POR {project.author_name}</span><h1>{project.title}</h1><p className="xk-creator-lead">{project.summary}</p>
        <div className="xk-creator-pills">{project.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        <p><strong>Licencia:</strong> {project.license}</p>
        <p>El archivo está alojado fuera de XETHKIOZ, en la nube del creador. Revisá los permisos y la procedencia del archivo antes de descargarlo o ejecutarlo.</p>
        <a className="xk-creator-primary" href={safeCloudLink(project.external_url) ? project.external_url : undefined} target="_blank" rel="noopener noreferrer nofollow" aria-disabled={!safeCloudLink(project.external_url)}>Abrir en la nube del creador ↗</a>
        <div className="xk-creator-report"><button type="button" onClick={() => void reportProject()}>Reportar publicación</button><span role="status">{reportMessage}</span></div>
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
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    async function load() {
      const { data } = await supabase.auth.getUser()
      if (!active) return
      if (!data.user) { navigate(creatorLogin(id ? '/publicar/' + id : '/publicar'), { replace: true }); return }
      setUserId(data.user.id)
      setAuthorName(String(data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'Creador').slice(0, 70))
      if (id) {
        const { data: project } = await supabase.from('creator_projects').select('*').eq('id', id).eq('author_id', data.user.id).maybeSingle()
        if (!active) return
        if (!project || !['draft', 'pending_review', 'rejected'].includes(project.status)) {
          navigate('/mis-proyectos', { replace: true }); return
        }
        setForm({ title: project.title, summary: project.summary, category: project.category, external_url: project.external_url, license: project.license, tags: (project.tags || []).join(', ') })
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
    if (form.title.trim().length < 4 || form.title.trim().length > 100 || form.summary.trim().length < 20 || form.summary.trim().length > 1200) {
      setMessage('Título: 4–100 caracteres. Descripción: 20–1200 caracteres.'); return
    }
    if (!safeCloudLink(form.external_url)) { setMessage('Ingresá un enlace HTTPS público y válido de tu nube.'); return }
    setBusy(true)
    const payload = { title: form.title.trim(), summary: form.summary.trim(), category: form.category, external_url: form.external_url.trim(), license: form.license.trim().slice(0, 80), tags, author_id: userId, author_name: authorName, status, published_at: null }
    const result = id
      ? await supabase.from('creator_projects').update(payload).eq('id', id).eq('author_id', userId)
      : await supabase.from('creator_projects').insert(payload)
    setBusy(false)
    if (result.error) { setMessage('No pudimos guardar la publicación. Revisá la conexión o la configuración del catálogo.'); return }
    navigate('/mis-proyectos?guardado=1')
  }
  return <PlatformFrame>
    <SEO title="Publicar una creación · XETHKIOZ" url="/publicar" />
    <main className="xk-creator-inner xk-creator-form-page"><Link className="xk-creator-back" to="/mis-proyectos">← Mi espacio</Link><p className="xk-creator-eyebrow">ESTUDIO DE CREACIÓN</p><h1>{id ? 'Editar mi proyecto' : 'Compartí tu creación.'}</h1>
      <p className="xk-creator-lead">Tu archivo sigue guardado en Google Drive, Dropbox, OneDrive o tu nube. XETHKIOZ muestra la ficha y el enlace después de una revisión.</p>
      {!ready ? <p className="xk-creator-state">Verificando tu cuenta…</p> : <form className="xk-creator-form" onSubmit={(event) => { event.preventDefault(); void submit('pending_review') }}>
        <label>Título<input required maxLength={100} minLength={4} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ej.: Mi videojuego de aventuras" /></label>
        <label>Tipo de creación<select value={form.category} onChange={(e) => set('category', e.target.value as Kind)}>{categories.filter((item) => item.id !== 'todos').map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <label>Contá de qué se trata<textarea required maxLength={1200} minLength={20} rows={6} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="¿Qué creaste? ¿Cómo funciona? ¿Usaste inteligencia artificial?" /></label>
        <div className="xk-creator-cloud-instructions"><strong>01. Guardá el archivo en tu propia nube</strong><p>Elegí un proveedor, subí allí tu programa, juego, video o proyecto y generá un enlace compartido de solo lectura.</p><div><a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/u/0/my-drive">Abrir Google Drive ↗</a><a target="_blank" rel="noopener noreferrer" href="https://onedrive.live.com/">Abrir OneDrive ↗</a><a target="_blank" rel="noopener noreferrer" href="https://www.dropbox.com/home">Abrir Dropbox ↗</a></div></div>
        <label>02. Pegá el enlace público de solo lectura<input required type="url" value={form.external_url} onChange={(e) => set('external_url', e.target.value)} placeholder="https://drive.google.com/file/d/…" /><small>No pegues enlaces privados, contraseñas, tokens ni archivos que no tengas derecho a distribuir. XETHKIOZ no puede cambiar los permisos de tu nube.</small></label>
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
    const { error: deleteError } = await supabase.from('creator_projects').delete().eq('id', project.id)
    if (deleteError) { setError('No fue posible eliminar este borrador.'); return }
    setProjects((items) => items.filter((item) => item.id !== project.id))
  }
  return <PlatformFrame>
    <SEO title="Mi espacio creativo · XETHKIOZ" url="/mis-proyectos" />
    <main className="xk-creator-inner"><p className="xk-creator-eyebrow">TU BIBLIOTECA PERSONAL</p><h1>Mi espacio creativo.</h1><p className="xk-creator-lead">Administrá tus fichas, borradores y solicitudes. Los archivos siguen bajo tu control en tu nube.</p>
      <Link className="xk-creator-primary" to="/publicar">+ Nueva publicación</Link>
      {loading ? <p className="xk-creator-state">Cargando tu biblioteca…</p> : error ? <p className="xk-creator-state" role="alert">{error}</p> : !projects.length ? <p className="xk-creator-state">Todavía no creaste ninguna publicación. Empezá compartiendo tu primer proyecto.</p> : <div className="xk-creator-drafts">{projects.map((project) => <article key={project.id}><div><small>{kindLabel(project.category)} · {project.status === 'draft' ? 'Borrador' : project.status === 'pending_review' ? 'En revisión' : project.status === 'published' ? 'Publicado' : 'Requiere correcciones'}</small><h2>{project.title}</h2><p>{project.summary}</p></div><div className="xk-creator-draft-actions">{project.status === 'published' ? <Link to={'/proyecto/' + project.id}>Ver publicación ↗</Link> : <Link to={'/publicar/' + project.id}>Editar →</Link>}{(project.status === 'draft' || project.status === 'rejected') && <button type="button" onClick={() => void removeDraft(project)}>Eliminar borrador</button>}</div></article>)}</div>}
    </main>
  </PlatformFrame>
}
