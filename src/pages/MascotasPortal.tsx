import { FormEvent, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const localities = ['Puan', 'Darregueira', 'Bordenave', 'Villa Iris', 'Felipe Solá', '17 de Agosto', 'Azopardo', 'Erize', 'San Germán']

type AnimalPost = {
  id: string
  type: 'Perdido' | 'Encontrado' | 'Adopción'
  name: string
  species: string
  locality: string
  zone: string
  description: string
  phone: string
  castrated: string
  createdAt: string
}

const demoPosts: AnimalPost[] = [
  { id: 'demo-1', type: 'Perdido', name: 'Luna', species: 'Perra', locality: 'Puan', zone: 'Zona céntrica', description: 'Mediana, pelaje negro y collar rojo. Publicación demostrativa.', phone: '', castrated: 'Sí', createdAt: '2026-08-01' },
  { id: 'demo-2', type: 'Encontrado', name: 'Sin nombre', species: 'Gato', locality: 'Darregueira', zone: 'Cerca de la plaza', description: 'Manso, atigrado y aparentemente joven. Publicación demostrativa.', phone: '', castrated: 'Desconocido', createdAt: '2026-08-01' },
  { id: 'demo-3', type: 'Adopción', name: 'Toby', species: 'Perro', locality: 'Bordenave', zone: 'Hogar de tránsito', description: 'Sociable, tamaño mediano y listo para conocer una familia. Publicación demostrativa.', phone: '', castrated: 'Sí', createdAt: '2026-08-01' },
]

const fauna = [
  ['Zorro pampeano', 'Mamífero nativo que ayuda a controlar roedores. No debe alimentarse ni perseguirse.'],
  ['Peludo y mulita', 'Armadillos propios de la región. Protegelos evitando la caza y reduciendo la velocidad en caminos rurales.'],
  ['Ñandú', 'Ave corredora de pastizales. Conservá su hábitat y nunca retires huevos o pichones.'],
  ['Carancho y chimango', 'Rapaces y carroñeras esenciales para limpiar el ambiente y controlar poblaciones.'],
  ['Tero y lechuzas', 'Aves frecuentes en campos y pueblos. Respetá nidos, árboles y zonas de descanso.'],
  ['Coipo y aves de laguna', 'Habitantes de humedales. Evitá residuos, perros sueltos y acercamientos innecesarios.'],
]

const careGuides = [
  {
    id: 'vacunacion-antirrabica',
    eyebrow: 'Salud preventiva',
    title: 'Vacunación antirrábica: qué controlar y cuándo consultar',
    intro: 'La rabia es prevenible, pero exige un esquema sostenido. SENASA indica la vacunación de perros y gatos desde los tres meses de edad y la revacunación anual.',
    steps: [
      'Revisá la libreta sanitaria y anotá la fecha de la última dosis.',
      'Consultá a una veterinaria habilitada si el animal nunca fue vacunado o si no conocés sus antecedentes.',
      'Guardá el certificado: puede ser necesario ante viajes, mordeduras o controles.',
      'Si hubo contacto con un murciélago u otro animal sospechoso, evitá tocarlo y buscá indicaciones sanitarias de inmediato.',
    ],
    limit: 'Esta guía no reemplaza una consulta veterinaria ni confirma campañas municipales. Las fechas locales deben publicarse sólo cuando el municipio o la institución responsable las anuncien.',
    sourceLabel: 'SENASA · Consideraciones generales y legislación sobre rabia',
    sourceUrl: 'https://www.argentina.gob.ar/senasa/consideraciones-generales-y-legislacion',
  },
  {
    id: 'tenencia-responsable',
    eyebrow: 'Convivencia',
    title: 'Tenencia responsable: una rutina que protege al animal y a la comunidad',
    intro: 'La tenencia responsable no termina en dar alimento. Incluye salud, identificación, control reproductivo, movimiento seguro y una convivencia que evite abandono o riesgos para terceros.',
    steps: [
      'Mantené identificación visible y un número de contacto actualizado.',
      'Usá correa y medios de traslado seguros fuera del hogar; no permitas que deambule solo.',
      'Planificá controles veterinarios, vacunación, desparasitación y castración con profesionales.',
      'Prepará una foto reciente y datos físicos claros para actuar rápido si se pierde.',
    ],
    limit: 'El Decreto 1088/2011 establece un programa nacional y principios de tenencia responsable. Las ordenanzas, turnos y servicios concretos pueden variar según el municipio.',
    sourceLabel: 'Argentina.gob.ar · Decreto 1088/2011',
    sourceUrl: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1088-2011-184639/texto',
  },
  {
    id: 'maltrato-animal',
    eyebrow: 'Acción segura',
    title: 'Cómo actuar ante una situación de maltrato animal',
    intro: 'El maltrato y la crueldad animal pueden denunciarse. Lo más importante es proteger a la víctima sin exponerte ni destruir evidencia útil para la intervención.',
    steps: [
      'Si el hecho está ocurriendo en la vía pública, llamá al 911 y describí la ubicación con precisión.',
      'No enfrentes a una persona violenta. Registrá fecha, lugar y hechos desde una posición segura.',
      'Presentá la denuncia en una comisaría o fiscalía; llevá fotografías, videos o testigos si existen.',
      'Pedí una constancia o número de actuación para poder hacer seguimiento.',
    ],
    limit: 'No publiques datos personales ni acusaciones sin intervención de la autoridad. Una denuncia formal permite investigar; una exposición en redes puede agravar riesgos o afectar el procedimiento.',
    sourceLabel: 'Derecho Fácil · Maltrato a los animales',
    sourceUrl: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/maltrato-animales',
  },
] as const

function readPosts(): AnimalPost[] {
  try {
    const value = window.localStorage.getItem('huellas-puan.posts')
    return value ? JSON.parse(value) : demoPosts
  } catch {
    return demoPosts
  }
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-700 text-2xl text-white shadow-sm" aria-hidden="true">🐾</span>
      <div>
        <p className="text-xl font-black text-emerald-950">Huellas de Puan</p>
        <p className="text-sm text-emerald-800">Red comunitaria animal</p>
      </div>
    </div>
  )
}

export default function MascotasPortal() {
  const location = useLocation()
  const [posts, setPosts] = useState<AnimalPost[]>(readPosts)
  const [filter, setFilter] = useState('Todas')
  const [notice, setNotice] = useState('')
  const section = location.pathname.replace('/mascotas', '').split('/').filter(Boolean)[0] ?? 'inicio'

  const visiblePosts = useMemo(() => filter === 'Todas' ? posts : posts.filter((post) => post.locality === filter), [filter, posts])

  const savePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next: AnimalPost = {
      id: crypto.randomUUID(),
      type: String(data.get('type')) as AnimalPost['type'],
      name: String(data.get('name') || 'Sin nombre'),
      species: String(data.get('species')),
      locality: String(data.get('locality')),
      zone: String(data.get('zone')),
      description: String(data.get('description')),
      phone: String(data.get('phone')),
      castrated: String(data.get('castrated')),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    const updated = [next, ...posts.filter((post) => !post.id.startsWith('demo-'))]
    setPosts(updated)
    window.localStorage.setItem('huellas-puan.posts', JSON.stringify(updated))
    event.currentTarget.reset()
    setNotice('La publicación quedó guardada en este dispositivo. En la siguiente etapa se conectará con la base comunitaria.')
  }

  const nav = [
    ['inicio', 'Inicio'], ['publicar', 'Publicar'], ['perdidos', 'Perdidos'], ['encontrados', 'Encontrados'], ['adopciones', 'Adopciones'], ['castraciones', 'Castraciones'], ['fauna-flora', 'Fauna y flora'],
  ]

  const category = section === 'perdidos' ? 'Perdido' : section === 'encontrados' ? 'Encontrado' : section === 'adopciones' ? 'Adopción' : null
  const listedPosts = category ? visiblePosts.filter((post) => post.type === category) : visiblePosts

  return (
    <div className="min-h-screen bg-[#f7f3e8] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#fffdf7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/mascotas" aria-label="Ir al inicio de Huellas de Puan"><Logo /></Link>
          <Link to="/" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Volver a XETHKIOZ</Link>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 md:px-6" aria-label="Secciones de Huellas de Puan">
          {nav.map(([path, label]) => (
            <Link key={path} to={path === 'inicio' ? '/mascotas' : `/mascotas/${path}`} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold ${section === path ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 shadow-sm'}`}>{label}</Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {section === 'inicio' && (
          <>
            <section className="rounded-[2rem] bg-emerald-900 px-6 py-10 text-white shadow-xl md:px-12 md:py-16">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-200">Puan y localidades cercanas</p>
              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Cada publicación puede ayudar a que un animal vuelva a casa.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-emerald-50">Un espacio simple para encontrar animales, ofrecer adopciones, consultar castraciones y proteger nuestra fauna.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link to="/mascotas/publicar" className="rounded-2xl bg-orange-500 px-5 py-5 text-center text-lg font-black text-white shadow hover:bg-orange-600">Perdí un animal</Link>
                <Link to="/mascotas/publicar" className="rounded-2xl bg-sky-500 px-5 py-5 text-center text-lg font-black text-white shadow hover:bg-sky-600">Encontré un animal</Link>
                <Link to="/mascotas/adopciones" className="rounded-2xl bg-white px-5 py-5 text-center text-lg font-black text-emerald-900 shadow hover:bg-emerald-50">Quiero adoptar</Link>
                <Link to="/mascotas/castraciones" className="rounded-2xl bg-amber-300 px-5 py-5 text-center text-lg font-black text-amber-950 shadow hover:bg-amber-400">Ver castraciones</Link>
              </div>
            </section>
            <section className="mt-10">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl font-black text-emerald-950">Publicaciones recientes</h2><p className="mt-1 text-slate-600">Información de la comunidad, ordenada de forma clara.</p></div><select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 font-semibold"><option>Todas</option>{localities.map((place) => <option key={place}>{place}</option>)}</select></div>
              <PostGrid posts={listedPosts} />
            </section>
            <section className="mt-12" aria-labelledby="huellas-guides-title">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Guías verificadas · revisión 13/08/2026</p>
              <h2 id="huellas-guides-title" className="mt-2 text-3xl font-black text-emerald-950">Cuidar también es saber cómo actuar</h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">Información práctica, explicada con límites claros y respaldada por organismos oficiales. Abrí cada guía para ver los pasos completos.</p>
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {careGuides.map((guide) => <CareGuide key={guide.id} guide={guide} />)}
              </div>
            </section>
          </>
        )}

        {section === 'publicar' && (
          <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-lg md:p-10">
            <h1 className="text-3xl font-black text-emerald-950">Crear una publicación</h1>
            <p className="mt-2 text-slate-600">Completá solo la información necesaria. No publiques una dirección particular exacta.</p>
            {notice && <p className="mt-5 rounded-xl bg-emerald-100 p-4 font-semibold text-emerald-900" role="status">{notice}</p>}
            <form onSubmit={savePost} className="mt-8 grid gap-5">
              <Field label="Tipo de publicación"><select name="type" required className="input"><option>Perdido</option><option>Encontrado</option><option>Adopción</option></select></Field>
              <div className="grid gap-5 sm:grid-cols-2"><Field label="Nombre"><input name="name" className="input" placeholder="Ej.: Luna o Sin nombre" /></Field><Field label="Especie"><select name="species" required className="input"><option>Perro</option><option>Gato</option><option>Otro</option></select></Field></div>
              <div className="grid gap-5 sm:grid-cols-2"><Field label="Localidad"><select name="locality" required className="input">{localities.map((place) => <option key={place}>{place}</option>)}</select></Field><Field label="Zona aproximada"><input name="zone" required className="input" placeholder="Ej.: centro, barrio, ruta" /></Field></div>
              <Field label="Descripción"><textarea name="description" required rows={5} className="input" placeholder="Color, tamaño, collar, comportamiento y cualquier dato útil." /></Field>
              <div className="grid gap-5 sm:grid-cols-2"><Field label="¿Está castrado?"><select name="castrated" className="input"><option>Sí</option><option>No</option><option>Desconocido</option></select></Field><Field label="Teléfono o WhatsApp"><input name="phone" required inputMode="tel" className="input" placeholder="Solo se mostrará en el detalle" /></Field></div>
              <label className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-950"><input type="checkbox" required className="mt-1 h-5 w-5" />Confirmo que la información es real y autorizo mostrar el contacto en esta publicación.</label>
              <button type="submit" className="min-h-14 rounded-2xl bg-emerald-700 px-6 text-lg font-black text-white hover:bg-emerald-800">Publicar información</button>
            </form>
          </section>
        )}

        {category && <section><h1 className="text-4xl font-black text-emerald-950">Animales {category === 'Adopción' ? 'en adopción' : category.toLowerCase() + 's'}</h1><p className="mt-2 text-slate-600">Filtrá por localidad y contactá directamente desde cada publicación.</p><div className="my-6"><select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 font-semibold"><option>Todas</option>{localities.map((place) => <option key={place}>{place}</option>)}</select></div><PostGrid posts={listedPosts} /></section>}

        {section === 'castraciones' && <section><h1 className="text-4xl font-black text-emerald-950">Castraciones y cuidado responsable</h1><p className="mt-2 max-w-3xl leading-relaxed text-slate-600">No publicamos fechas o turnos sin confirmación de la institución responsable. Mientras se completa la agenda local, esta sección ofrece criterios seguros para prepararse y reconocer qué dato debe verificarse.</p><div className="mt-8 grid gap-5 md:grid-cols-2"><InfoCard title="Antes de pedir un turno" text="Consultá edad, estado de salud, ayuno, traslado y cuidados posteriores con la veterinaria o campaña que realizará el procedimiento. No uses indicaciones reenviadas como reemplazo de esa evaluación." /><InfoCard title="Cómo validamos una campaña" text="La publicación debe indicar organismo responsable, lugar, fecha, horario, cupos, requisitos y un canal oficial de contacto. Si falta alguno, se mostrará como dato pendiente y no como turno confirmado." /></div><div className="mt-8 max-w-3xl"><CareGuide guide={careGuides[1]} open /></div></section>}

        {section === 'fauna-flora' && <section><h1 className="text-4xl font-black text-emerald-950">Fauna y flora de nuestra región</h1><p className="mt-2 max-w-3xl text-slate-600">Conocer las especies locales ayuda a protegerlas y evita acciones que pueden dañarlas.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{fauna.map(([name, text]) => <InfoCard key={name} title={name} text={text} />)}</div><div className="mt-8 rounded-3xl bg-sky-100 p-6 md:p-8"><h2 className="text-2xl font-black text-sky-950">Cómo cuidar el ambiente</h2><p className="mt-3 leading-relaxed text-sky-950">No arrojes residuos en lagunas o caminos, respetá nidos y madrigueras, evitá incendios, no captures fauna silvestre y mantené a tus mascotas controladas cerca de humedales y áreas rurales.</p></div></section>}
      </main>
      <footer className="mt-12 border-t border-emerald-900/10 bg-white px-4 py-8 text-center text-sm text-slate-600"><p className="font-bold text-emerald-900">Huellas de Puan</p><p className="mt-1">Proyecto comunitario independiente para Puan y la zona.</p></footer>
      <style>{`.input{width:100%;min-height:3rem;border:1px solid #cbd5e1;border-radius:.75rem;background:white;padding:.75rem 1rem;font-size:1rem;outline:none}.input:focus{border-color:#047857;box-shadow:0 0 0 3px rgba(16,185,129,.18)}`}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 font-bold text-slate-800"><span>{label}</span>{children}</label> }
function InfoCard({ title, text }: { title: string; text: string }) { return <article className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-emerald-950">{title}</h2><p className="mt-3 leading-relaxed text-slate-600">{text}</p></article> }
function CareGuide({ guide, open = false }: { guide: (typeof careGuides)[number]; open?: boolean }) {
  return (
    <details open={open} className="group rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm">
      <summary className="cursor-pointer list-none pr-8 marker:hidden">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{guide.eyebrow}</span>
        <h3 className="mt-2 text-xl font-black leading-tight text-emerald-950">{guide.title}</h3>
        <p className="mt-3 leading-relaxed text-slate-600">{guide.intro}</p>
        <span className="mt-4 inline-block text-sm font-black text-emerald-800 group-open:hidden">Abrir guía completa +</span>
      </summary>
      <div className="mt-5 border-t border-emerald-900/10 pt-5">
        <ol className="grid gap-3 pl-5 text-sm leading-relaxed text-slate-700">
          {guide.steps.map((step) => <li key={step} className="pl-1">{step}</li>)}
        </ol>
        <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><strong>Límite de la guía:</strong> {guide.limit}</p>
        <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 block rounded-2xl border border-emerald-700 px-4 py-3 text-sm font-black text-emerald-800 hover:bg-emerald-50">Fuente oficial: {guide.sourceLabel} ↗</a>
      </div>
    </details>
  )
}
function PostGrid({ posts }: { posts: AnimalPost[] }) { return posts.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{posts.map((post) => <article key={post.id} className="overflow-hidden rounded-3xl bg-white shadow-sm"><div className={`px-5 py-3 text-sm font-black ${post.type === 'Perdido' ? 'bg-orange-100 text-orange-900' : post.type === 'Encontrado' ? 'bg-sky-100 text-sky-900' : 'bg-emerald-100 text-emerald-900'}`}>{post.type}</div><div className="p-6"><h3 className="text-2xl font-black text-slate-900">{post.name}</h3><p className="mt-1 font-semibold text-emerald-800">{post.species} · {post.locality}</p><p className="mt-4 leading-relaxed text-slate-600">{post.description}</p><dl className="mt-5 grid gap-2 text-sm"><div><dt className="inline font-bold">Zona: </dt><dd className="inline">{post.zone}</dd></div><div><dt className="inline font-bold">Castrado: </dt><dd className="inline">{post.castrated}</dd></div></dl>{post.phone && <a href={`https://wa.me/54${post.phone.replace(/\D/g, '')}`} className="mt-5 block rounded-xl bg-emerald-700 px-4 py-3 text-center font-black text-white">Contactar por WhatsApp</a>}</div></article>)}</div> : <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">Todavía no hay publicaciones en esta categoría.</div> }
