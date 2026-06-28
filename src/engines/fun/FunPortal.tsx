import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

interface ShortVideoFeed {
  id: number
  title: string
  likes: string
  route: string
}

const videos: Record<'es' | 'en', ShortVideoFeed[]> = {
  es: [
    { id: 1, title: 'Memes gamer de la comunidad', likes: 'Base', route: '/community' },
    { id: 2, title: 'Clips cortos para redes', likes: 'Soon', route: '/news' },
    { id: 3, title: 'Ideas visuales para XETHKIOZ', likes: 'Lab', route: '/profile' },
    { id: 4, title: 'Humor, aventuras y rarezas', likes: 'Fun', route: '/fun' },
  ],
  en: [
    { id: 1, title: 'Gaming memes from the community', likes: 'Base', route: '/community' },
    { id: 2, title: 'Short clips for social media', likes: 'Soon', route: '/news' },
    { id: 3, title: 'Visual ideas for XETHKIOZ', likes: 'Lab', route: '/profile' },
    { id: 4, title: 'Humor, adventures and oddities', likes: 'Fun', route: '/fun' },
  ],
}

const copy = {
  es: {
    back: '⏴ Volver al Núcleo',
    label: 'XETHKIOZ // FUN_PORTAL',
    title: 'Memes, ocio y comunidad',
    subtitle: 'Un sector liviano para humor gamer, clips, ideas visuales y contenido social sin mezclarlo con noticias serias.',
    feed: '// Matriz visual comunitaria',
    open: 'Abrir',
  },
  en: {
    back: '⏴ Back to Core',
    label: 'XETHKIOZ // FUN_PORTAL',
    title: 'Memes, fun and community',
    subtitle: 'A lightweight sector for gaming humor, clips, visual ideas and social content without mixing it with serious news.',
    feed: '// Community visual matrix',
    open: 'Open',
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
              <Link key={video.id} to={video.route} className="panel-cyber group mx-auto flex aspect-[9/16] w-full max-w-[260px] flex-col justify-between overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-fusionAccent-tech-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fusionAccent-tech-secondary">
                <div className="relative flex flex-1 items-center justify-center border-b border-fusionSurface-muted bg-[radial-gradient(circle_at_center,rgba(255,126,41,0.18),transparent_58%),#0A0A0F]">
                  <span className="text-3xl opacity-45 transition-transform group-hover:scale-110" aria-hidden="true">▶</span>
                  <div className="absolute bottom-2 right-3 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-fusionAccent-tech-secondary">{video.likes}</div>
                </div>
                <div className="bg-fusionSurface-base p-3">
                  <p className="truncate text-xs font-semibold tracking-wide text-white">{video.title}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-fusionAccent-tech-secondary">{ui.open}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default FunPortal
