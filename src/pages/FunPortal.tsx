import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type NewsItem = { title: string; summary: string; tag: string }
type SectionBlock = { id: string; title: string; text: string; items: NewsItem[] }

const content: Record<'es' | 'en', { title: string; description: string; back: string; badge: string; open: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Memes',
    description: 'Humor, clips, rarezas y descanso visual dentro del ecosistema XETHKIOZ.',
    back: 'Volver antes de que se ponga serio',
    badge: 'chascarrillo.exe ejecutado con éxito',
    open: 'Abrir caos',
    blocks: [
      { id: 'memes', title: 'Memes rápidos', text: 'Chistes internos, bugs, frases y humor de comunidad.', items: [
        { title: 'Cuando el build falla después del “ya está”', summary: 'Formato demo para memes del desarrollo y la vida real del proyecto.', tag: 'dev meme' },
        { title: 'El Wisp aparece donde quiere', summary: 'Nota de prueba para humor narrativo del ecosistema.', tag: 'wisp' },
        { title: '404 de sueño, 200 de ganas', summary: 'Entrada demo para contenido corto y compartible.', tag: 'estado' },
        { title: 'La IA no entendió “más simple”', summary: 'Meme demo sobre prompts, resultados raros y edición final.', tag: 'IA' },
        { title: 'Cuando la web deploya y vos no tocaste nada', summary: 'Bloque de humor para creadores que viven entre GitHub y Vercel.', tag: 'deploy' },
      ] },
      { id: 'clips', title: 'Clips y videos', text: 'Momentos cortos para TikTok, Reels, Shorts y Threads.', items: [
        { title: 'Clip gamer: victoria inesperada', summary: 'Plantilla demo para transformar jugadas en microhistorias.', tag: 'clip' },
        { title: 'Setup cyberpunk en 10 segundos', summary: 'Nota de prueba para videos de ambiente, luces y branding.', tag: 'setup' },
        { title: 'Reacción rápida a noticia absurda', summary: 'Formato para humor con gaming, tecnología o IA.', tag: 'react' },
        { title: 'Duendes digitales y glitch visual', summary: 'Demo para piezas de fantasía, misterio y cultura pop.', tag: 'fantasía' },
        { title: 'Fails del creador independiente', summary: 'Bloque para clips honestos del proceso de creación.', tag: 'fail' },
      ] },
      { id: 'legends', title: 'Leyendas y rarezas', text: 'Contenido extraño, historias, curiosidades y misterio liviano.', items: [
        { title: 'La leyenda del botón que nadie toca', summary: 'Historia demo para esconder guiños dentro de la web.', tag: 'easter egg' },
        { title: 'Duendes, bosque y videojuegos', summary: 'Entrada de prueba para combinar folklore con cultura gamer.', tag: 'duendes' },
        { title: 'El NPC que sabe demasiado', summary: 'Bloque narrativo para futuros eventos interactivos.', tag: 'NPC' },
        { title: 'Archivos raros encontrados en el portal', summary: 'Demo para piezas de misterio sin presentarlas como hechos.', tag: 'raro' },
        { title: 'Cuando el meme se vuelve lore', summary: 'Nota de prueba para convertir humor recurrente en identidad de marca.', tag: 'lore' },
      ] },
    ],
  },
  en: {
    title: 'Memes',
    description: 'Humor, clips, oddities and visual breaks inside the XETHKIOZ ecosystem.',
    back: 'Back before it gets serious',
    badge: 'joke.exe executed successfully',
    open: 'Open chaos',
    blocks: [
      { id: 'memes', title: 'Quick memes', text: 'Inside jokes, bugs, quotes and community humor.', items: [
        { title: 'When the build fails after “it is done”', summary: 'Demo format for development and real project life memes.', tag: 'dev meme' },
        { title: 'The Wisp appears wherever it wants', summary: 'Test note for ecosystem narrative humor.', tag: 'wisp' },
        { title: '404 sleep, 200 motivation', summary: 'Demo entry for short shareable content.', tag: 'status' },
        { title: 'The AI did not understand “simpler”', summary: 'Demo meme about prompts, weird outputs and final editing.', tag: 'AI' },
        { title: 'When the site deploys and you touched nothing', summary: 'Humor block for creators living between GitHub and Vercel.', tag: 'deploy' },
      ] },
      { id: 'clips', title: 'Clips and videos', text: 'Short moments for TikTok, Reels, Shorts and Threads.', items: [
        { title: 'Gaming clip: unexpected win', summary: 'Demo template to turn plays into micro-stories.', tag: 'clip' },
        { title: 'Cyberpunk setup in 10 seconds', summary: 'Test note for ambience, lights and branding videos.', tag: 'setup' },
        { title: 'Quick reaction to absurd news', summary: 'Format for humor with gaming, tech or AI.', tag: 'react' },
        { title: 'Digital goblins and visual glitch', summary: 'Demo for fantasy, mystery and pop culture pieces.', tag: 'fantasy' },
        { title: 'Independent creator fails', summary: 'Block for honest clips about the creation process.', tag: 'fail' },
      ] },
      { id: 'legends', title: 'Legends and oddities', text: 'Strange content, stories, curiosities and light mystery.', items: [
        { title: 'The legend of the button nobody touches', summary: 'Demo story to hide references inside the site.', tag: 'easter egg' },
        { title: 'Goblins, forest and videogames', summary: 'Test entry combining folklore with gaming culture.', tag: 'goblins' },
        { title: 'The NPC who knows too much', summary: 'Narrative block for future interactive events.', tag: 'NPC' },
        { title: 'Strange files found in the portal', summary: 'Demo for mystery pieces without presenting them as facts.', tag: 'odd' },
        { title: 'When the meme becomes lore', summary: 'Test note for turning recurring humor into brand identity.', tag: 'lore' },
      ] },
    ],
  },
}

export default function FunPortal() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/fun" />
      <section className="xk-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel overflow-hidden rounded-[2rem] border border-yellow-300/45 bg-[linear-gradient(135deg,rgba(234,179,8,.16),rgba(139,92,246,.12),rgba(50,255,138,.08))] p-6 shadow-[0_0_28px_rgba(234,179,8,.16)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">MEME_CORE // HUMOR CONTROLADO</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-yellow-300/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">{t.description}</p>
            <div className="mt-6 inline-flex rounded-full border border-yellow-300/40 bg-black/35 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-yellow-200">{t.badge}</div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={`xk-card rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:rotate-[.35deg] ${active.id === item.id ? 'border-[#32FF8A]/70 bg-[#031006]/80' : 'border-yellow-300/30 bg-black/55 hover:shadow-[0_0_18px_rgba(234,179,8,.18)]'}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF6B1A]">{item.title}</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-200">{item.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-yellow-300/25 bg-black/55 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-yellow-200">{active.title} // 5 demo news</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {active.items.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF6B1A]">{item.tag}</span>
                  <h3 className="mt-3 text-base font-black uppercase text-white">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <Link to="/" className="mt-8 inline-flex rounded-full border border-yellow-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-yellow-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
        </div>
      </section>
    </>
  )
}
