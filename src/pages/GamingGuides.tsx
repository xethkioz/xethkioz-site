import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'

const worlds = [
  { code: 'AZEROTH', title: 'World of Warcraft', games: 'Retail · Classic', image: '/images/articles/wow-midnight.svg', color: '#f59e0b', description: 'Clases, profesiones, equipo, oro, mazmorras, raids y rutas para volver sin sentirse perdido.', routes: ['Empezar o volver', 'Clases y especializaciones', 'Equipo y endgame'] },
  { code: 'WRAECLAST', title: 'Path of Exile', games: 'Path of Exile 1 · Path of Exile 2', image: '/images/articles/pc-gaming.svg', color: '#ef4444', description: 'Builds explicadas, ligas, economía, filtros, crafting y progresión con decisiones claras.', routes: ['PoE 1', 'PoE 2', 'Builds y economía'] },
  { code: 'ALBION', title: 'Albion Online', games: 'Mundo abierto · PvP · Economía', image: '/images/articles/open-world.svg', color: '#eab308', description: 'Armas, recolección, refinado, islas, facciones, zonas negras y juego en grupo.', routes: ['Primeros pasos', 'Economía', 'PvP y gremios'] },
  { code: 'SANCTUARY', title: 'Diablo', games: 'Diablo II Resurrected · Diablo IV', image: '/images/articles/gaming-hub.svg', color: '#fb7185', description: 'Leveleo, temporadas, runas, objetos, builds y endgame para las dos experiencias centrales.', routes: ['Diablo II', 'Diablo IV', 'Temporadas y builds'] },
  { code: 'TAMRIEL', title: 'The Elder Scrolls Online', games: 'PvE · PvP · Exploración', image: '/images/articles/mmorpg-asia.svg', color: '#22d3ee', description: 'Clases, líneas de habilidades, crafting, narrativa, dungeons, trials y Cyrodiil.', routes: ['Inicio en Tamriel', 'Builds y crafting', 'Dungeons y PvP'] },
]

export default function GamingGuides() {
  return <main className="xk-guides-world min-h-screen px-4 py-10 text-white sm:px-6 lg:px-8">
    <SEO title="Guías de juegos · XETHKIOZ" description="Guías de World of Warcraft, Path of Exile, Albion Online, Diablo y The Elder Scrolls Online." url="/gaming/guides" />
    <div className="mx-auto max-w-7xl">
      <nav className="xk-guides-breadcrumb"><Link to="/gaming">Gaming</Link><span>/</span><b>Archivo de guías</b></nav>
      <header className="xk-guides-hero"><div><p>OASIS 3.0 // BIBLIOTECA DE MUNDOS</p><h1>Cinco universos.<br /><span>Guías que sí sirven.</span></h1><p>Menos juegos, más profundidad. Cada guía explicará qué hacer, por qué hacerlo, para quién sirve y qué puede cambiar con un parche.</p></div><div className="xk-guides-orbit" aria-hidden="true"><i /><i /><i /><span>5<br /><small>MUNDOS</small></span></div></header>
      <section className="xk-guides-principles" aria-label="Criterios de las guías"><span>✓ PASOS CLAROS</span><span>✓ FECHA Y VERSIÓN</span><span>✓ NIVEL RECOMENDADO</span><span>✓ SIN COPIAR A CIEGAS</span></section>
      <section className="xk-guide-world-grid" aria-label="Juegos principales">{worlds.map((world, index) => <article key={world.code} className="xk-guide-world-card" style={{ '--guide': world.color } as CSSProperties}><div className="xk-guide-world-image"><SafeImage src={world.image} fallback="/images/articles/gaming.svg" alt={`Universo de ${world.title}`} className="h-full w-full object-cover" /><span>WORLD_0{index + 1}</span></div><div className="xk-guide-world-copy"><small>{world.code} // {world.games}</small><h2>{world.title}</h2><p>{world.description}</p><div>{world.routes.map((route) => <span key={route}>{route}</span>)}</div><Link to={`/news?category=gaming&game=${encodeURIComponent(world.title)}`}>Explorar archivo <b>→</b></Link></div></article>)}</section>
      <section className="xk-gaming-radar-split"><div><p>RADAR EXTERIOR // MÁS ALLÁ DE LOS CINCO MUNDOS</p><h2>Novedades, próximos lanzamientos y tendencias</h2><span>Los juegos base viven en Guías. Todo lo nuevo, lo viral y lo que todavía está por salir vive en un radar separado para no mezclar información estable con actualidad.</span></div><Link to="/news?category=gaming">Abrir radar mundial →</Link></section>
    </div>
  </main>
}
