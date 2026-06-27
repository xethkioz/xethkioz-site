import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

interface ShortVideoFeed {
  id: number
  title: string
  likes: string
}

const videos: Record<'es' | 'en', ShortVideoFeed[]> = {
  es: [
    { id: 1, title: 'Cuando el código compila al primer intento 💀', likes: '1.2K' },
    { id: 2, title: 'Gatos vs Impresoras 3D (Cyberpunk Edition)', likes: '840' },
    { id: 3, title: 'Setup gamer de bajo presupuesto en el año 3000', likes: '2.5K' },
    { id: 4, title: 'El bug más divertido encontrado en el último parche', likes: '910' },
  ],
  en: [
    { id: 1, title: 'When code compiles on the first try 💀', likes: '1.2K' },
    { id: 2, title: 'Cats vs 3D printers (Cyberpunk Edition)', likes: '840' },
    { id: 3, title: 'Budget gaming setup in year 3000', likes: '2.5K' },
    { id: 4, title: 'The funniest bug from the last patch', likes: '910' },
  ],
}

const copy = {
  es: {
    back: '⏴ Volver al Núcleo',
    label: 'FUSION_ALPHA_2.0 // PORTAL_FUN',
    title: 'El portal más liviano del ecosistema',
    subtitle: 'Zona comunitaria para reír, compartir ideas y subir creaciones de forma ágil.',
    feed: '// Viral Shorts Matrix // 4 Ventanas Verticales',
  },
  en: {
    back: '⏴ Back to Core',
    label: 'FUSION_ALPHA_2.0 // PORTAL_FUN',
    title: 'The lightest portal in the ecosystem',
    subtitle: 'Community area to laugh, share ideas and upload creations quickly.',
    feed: '// Viral Shorts Matrix // 4 Vertical Windows',
  },
} as const

export function FunPortal() {
  const { lang } = useLang()
  const ui = copy[lang]
  const shortVideos = useMemo(() => videos[lang], [lang])

  return (
    <div className="relative min-h-screen bg-fusionBg pb-12 text-gray-300 selection:bg-fusionAccent-tech-secondary/30">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 pt-24 sm:px-6">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.22em] text-fusionAccent-tech-secondary hover:underline">{ui.back}</Link>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">{ui.label}</div>
      </header>
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-12 sm:px-6">
        <section className="panel-cyber flex flex-col gap-2 border-l-2 border-l-fusionAccent-tech-secondary p-8">
          <h1 className="text-4xl font-black uppercase tracking-wide text-white">{ui.title}</h1>
          <p className="max-w-2xl text-sm text-gray-400">{ui.subtitle}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">{ui.feed}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shortVideos.map((video) => (
              <article key={video.id} className="panel-cyber group mx-auto flex aspect-[9/16] w-full max-w-[260px] flex-col justify-between overflow-hidden transition duration-300 hover:border-fusionAccent-tech-secondary/50">
                <div className="relative flex flex-1 items-center justify-center border-b border-fusionSurface-muted bg-fusionBg">
                  <span className="text-3xl opacity-40 transition-transform group-hover:scale-110" aria-hidden="true">▶</span>
                  <div className="absolute bottom-2 right-3 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-fusionAccent-tech-secondary">♥ {video.likes}</div>
                </div>
                <div className="bg-fusionSurface-base p-3">
                  <p className="truncate text-xs font-semibold tracking-wide text-white">{video.title}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default FunPortal
