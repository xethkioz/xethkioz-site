import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

type SectionId = 'gaming' | 'science' | 'fun'

const sections: Array<{
  id: SectionId
  title: string
  route: string
  palette: string
  eyebrow: string
  description: string
  points: string[]
  cardClass: string
}> = [
  {
    id: 'gaming',
    title: 'Juegos',
    route: '/gaming',
    palette: 'Rojo • Morado • Verde',
    eyebrow: 'PIXEL MODE',
    description: 'Noticias, comunidades, guías, MMORPG, esports y radar gamer con estética pixel art premium.',
    points: ['Gaming Hub limpio', 'Rutas reparadas', 'Diseño arcade legible'],
    cardClass: 'border-red-500/40 bg-[linear-gradient(135deg,rgba(239,68,68,.18),rgba(139,92,246,.12),rgba(50,255,138,.08))]',
  },
  {
    id: 'science',
    title: 'Tecnología/Ciencia',
    route: '/science',
    palette: 'Azul • Morado • Verde',
    eyebrow: 'DATA TERMINAL',
    description: 'Tecnología, IA, ciencia y análisis con diseño frío, técnico y calculador.',
    points: ['Blueprint UI', 'Contenido verificable', 'Menos ruido visual'],
    cardClass: 'border-blue-400/40 bg-[linear-gradient(135deg,rgba(59,130,246,.18),rgba(139,92,246,.12),rgba(50,255,138,.07))]',
  },
  {
    id: 'fun',
    title: 'Memes',
    route: '/fun',
    palette: 'Amarillo • Morado • Verde',
    eyebrow: 'JAJA.EXE',
    description: 'Cosas graciosas, memes, clips y descansos visuales sin ensuciar la experiencia principal.',
    points: ['Humor controlado', 'Animación sutil', 'Formato social'],
    cardClass: 'border-yellow-300/40 bg-[linear-gradient(135deg,rgba(234,179,8,.18),rgba(139,92,246,.12),rgba(50,255,138,.08))]',
  },
]

export default function Home() {
  const [active, setActive] = useState<SectionId>('gaming')
  const activeSection = sections.find((section) => section.id === active) || sections[0]

  return (
    <>
      <SEO
        title="XETHKIOZ Web v1.0 · Juegos, Tecnología/Ciencia y Memes"
        description="XETHKIOZ Web v1.0 rediseñada: tres secciones principales, navegación limpia, Wisp orgánico y Green Node aislado."
        url="/"
        image="/images/articles/xethkioz-cover.svg"
      />
      <div className="xk-page">
        <section className="mx-auto flex min-h-[calc(100svh-140px)] max-w-7xl flex-col justify-center gap-10 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#32FF8A]">XETHKIOZ WEB v1.0</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.18em] text-white md:text-6xl">Tres mundos. Una marca.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
              Entrada directa al ecosistema: más rápido, más claro y sin paneles de debug en producción.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {sections.map((section) => {
              const isActive = active === section.id
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActive(section.id)}
                  className={`xk-card group min-h-[260px] rounded-3xl border p-5 text-left transition-transform duration-200 hover:-translate-y-1 ${section.cardClass} ${isActive ? 'shadow-[0_0_28px_rgba(139,92,246,.24)]' : 'opacity-85'}`}
                  aria-expanded={isActive}
                >
                  <span className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-[#FF6B1A]">{section.eyebrow}</span>
                  <h2 className="mt-6 text-3xl font-black uppercase tracking-[0.12em] text-white">{section.title}</h2>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-300">{section.palette}</p>
                  <p className="mt-5 text-sm leading-relaxed text-gray-300">{section.description}</p>
                  {isActive && (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
                      <ul className="space-y-2 text-xs text-gray-300">
                        {section.points.map((point) => <li key={point}>▸ {point}</li>)}
                      </ul>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="xk-section-panel mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-black/35 p-5 text-center shadow-[0_0_18px_rgba(139,92,246,.12)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gray-500">Sección seleccionada</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.14em] text-white">{activeSection.title}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">{activeSection.description}</p>
            <Link to={activeSection.route} className="mt-5 inline-flex rounded-full border border-[#8B5CF6]/60 bg-[#8B5CF6]/10 px-5 py-3 font-mono text-xs font-black uppercase tracking-[0.18em] text-white transition hover:border-[#FF6B1A] hover:text-[#FF6B1A] hover:shadow-[0_0_16px_rgba(255,107,26,.3)]">
              Abrir {activeSection.title}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
