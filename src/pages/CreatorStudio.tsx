import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { STREAM_LINKS } from '../lib/siteConfig'

const creatorModules = [
  { icon: '🎥', title: 'OBS y escenas', body: 'Escenas, overlays, chat, alertas, capturas y organización para directos en Kick, Twitch y YouTube.' },
  { icon: '🎙️', title: 'Audio y voz', body: 'Checklist de micrófono, música sin copyright, volumen, filtros y ambiente para cada portal.' },
  { icon: '📱', title: 'Shorts y reels', body: 'Flujo para convertir directos, noticias y clips en contenido para TikTok, Instagram, YouTube y Threads.' },
  { icon: '🧰', title: 'Herramientas IA', body: 'Automatización para miniaturas, títulos, descripciones, hashtags, guiones y resúmenes.' },
]

const checklist = [
  'Crear plantilla de directo para gaming, noticias, Science Lab y Green Node.',
  'Centralizar links de Kick, Twitch, YouTube, TikTok e Instagram.',
  'Preparar miniaturas 16:9 y verticales para shorts.',
  'Documentar configuraciones OBS y escenas reutilizables.',
]

export default function CreatorStudio() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Creator Studio"
        description="XETHKIOZ Creator Studio: OBS, streaming, audio, video, clips, shorts y herramientas para producción de contenido."
        url="/creator-studio"
        image="/images/articles/media-studio.svg"
      />

      <section className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-ink-300 p-6 md:p-10 shadow-[0_0_60px_rgba(168,85,247,.16)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(168,85,247,.2),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(255,106,0,.14),transparent_34%)]" />
        <div className="relative max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-purple-300">XETHKIOZ Network / Creator Division</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-black text-white">Creator Studio</h1>
          <p className="mt-4 max-w-3xl text-gray-300 leading-relaxed">
            Centro operativo para streaming, OBS, overlays, clips, shorts, audio, cámaras, miniaturas y contenido multiplataforma. La meta es que todo lo que se publique en redes salga desde una base ordenada.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={STREAM_LINKS.kick} target="_blank" rel="noreferrer" className="btn-primary text-sm">Abrir Kick</a>
            <a href={STREAM_LINKS.twitch} target="_blank" rel="noreferrer" className="btn-secondary text-sm">Abrir Twitch</a>
            <Link to="/chat-overlay" className="btn-secondary text-sm">Overlay OBS</Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {creatorModules.map((module) => (
          <article key={module.title} className="glass rounded-2xl border border-purple-400/15 p-5">
            <span className="text-3xl">{module.icon}</span>
            <h2 className="mt-3 font-display text-xl font-black text-white">{module.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{module.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 glass rounded-2xl border border-white/10 p-5">
        <p className="section-eyebrow">Checklist operativo</p>
        <h2 className="font-display text-2xl font-black text-white">Producción lista para escalar</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <p key={item} className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-gray-300">{item}</p>
          ))}
        </div>
      </section>
    </div>
  )
}
