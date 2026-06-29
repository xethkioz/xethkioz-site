import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type FunArticle = {
  title: string
  summary: string
  tag: string
}

type FunCategory = {
  id: string
  title: string
  text: string
  badge: string
  articles: FunArticle[]
}

type FunCopy = {
  seoTitle: string
  seoDescription: string
  eyebrow: string
  title: string
  description: string
  success: string
  openLabel: string
  selectedLabel: string
  readLabel: string
  back: string
  categories: FunCategory[]
}

const copy: Record<'es' | 'en', FunCopy> = {
  es: {
    seoTitle: 'Memes · XETHKIOZ',
    seoDescription: 'Sección de memes, clips y humor categorizado de XETHKIOZ.',
    eyebrow: 'MEME_CORE // HUMOR CONTROLADO',
    title: 'Memes',
    description: 'Zona amarilla del ecosistema: memes, clips, leyendas y descansos. Ahora cada bloque abre su propio contenido.',
    success: 'chascarrillo.exe ejecutado con éxito',
    openLabel: 'Abrir bloque',
    selectedLabel: 'Bloque activo',
    readLabel: 'Ver más contenido',
    back: 'Volver antes de que se ponga serio',
    categories: [
      {
        id: 'memes',
        title: 'Memes rápidos',
        text: 'Humor gamer, bugs, builds rotos y vida digital.',
        badge: 'meme.log',
        articles: [
          { title: 'Cuando el build falla pero ya dijiste “está todo OK”', summary: 'Humor interno del ecosistema para clips, Threads y posts cortos.', tag: 'Build fail' },
          { title: '404 de sueño, 200 de ganas', summary: 'Formato de meme para jornadas largas de diseño, código y streaming.', tag: 'Dev life' },
          { title: 'El Wisp no buguea: aparece donde quiere', summary: 'Chiste recurrente del personaje oculto del ecosistema.', tag: 'Wisp lore' },
        ],
      },
      {
        id: 'clips',
        title: 'Clips y videos',
        text: 'Momentos de stream, reacciones, shorts y escenas raras.',
        badge: 'clip.queue',
        articles: [
          { title: 'Triple kill en vivo', summary: 'Plantilla para clips competitivos de Mobile Legends, Warzone o Fortnite.', tag: 'Live clip' },
          { title: 'Reacción gamer honesta', summary: 'Formato corto para doblar noticias o trailers con opinión propia.', tag: 'Reaction' },
          { title: 'Errores épicos de directo', summary: 'Humor para cortes donde la transmisión, el chat o el juego deciden romperse.', tag: 'Stream fail' },
        ],
      },
      {
        id: 'legends',
        title: 'Leyendas y rarezas',
        text: 'Duendes, historias digitales, teorías livianas y cultura geek.',
        badge: 'weird.fun',
        articles: [
          { title: 'Duendes y videojuegos', summary: 'Contenido narrativo para mezclar fantasía, IA, humor y gaming.', tag: 'Duendes' },
          { title: 'Mitos de internet gamer', summary: 'Historias virales, rumores y creepypastas tratados en tono divertido.', tag: 'Internet lore' },
          { title: 'El archivo raro de la semana', summary: 'Sección flexible para cosas absurdas, curiosas o inexplicables.', tag: 'Rarezas' },
        ],
      },
    ],
  },
  en: {
    seoTitle: 'Memes · XETHKIOZ',
    seoDescription: 'XETHKIOZ categorized memes, clips and humor section.',
    eyebrow: 'MEME_CORE // CONTROLLED HUMOR',
    title: 'Memes',
    description: 'The yellow zone of the ecosystem: memes, clips, legends and breaks. Each block now opens its own content.',
    success: 'joke.exe executed successfully',
    openLabel: 'Open block',
    selectedLabel: 'Active block',
    readLabel: 'View more content',
    back: 'Back before it gets serious',
    categories: [
      {
        id: 'memes',
        title: 'Quick memes',
        text: 'Gaming humor, bugs, broken builds and digital life.',
        badge: 'meme.log',
        articles: [
          { title: 'When the build fails but you already said “all good”', summary: 'Internal ecosystem humor for clips, Threads and short posts.', tag: 'Build fail' },
          { title: '404 sleep, 200 motivation', summary: 'Meme format for long design, code and streaming days.', tag: 'Dev life' },
          { title: 'The Wisp is not bugged: it appears where it wants', summary: 'Recurring joke for the hidden character of the ecosystem.', tag: 'Wisp lore' },
        ],
      },
      {
        id: 'clips',
        title: 'Clips and videos',
        text: 'Stream moments, reactions, shorts and weird scenes.',
        badge: 'clip.queue',
        articles: [
          { title: 'Triple kill live', summary: 'Template for competitive clips from Mobile Legends, Warzone or Fortnite.', tag: 'Live clip' },
          { title: 'Honest gamer reaction', summary: 'Short format for covering news or trailers with your own take.', tag: 'Reaction' },
          { title: 'Epic stream fails', summary: 'Humor for cuts where the stream, chat or game decides to break.', tag: 'Stream fail' },
        ],
      },
      {
        id: 'legends',
        title: 'Legends and weird stuff',
        text: 'Goblins, digital stories, light theories and geek culture.',
        badge: 'weird.fun',
        articles: [
          { title: 'Goblins and video games', summary: 'Narrative content mixing fantasy, AI, humor and gaming.', tag: 'Goblins' },
          { title: 'Gaming internet myths', summary: 'Viral stories, rumors and creepypastas handled with a fun tone.', tag: 'Internet lore' },
          { title: 'Weird file of the week', summary: 'Flexible section for absurd, curious or unexplained things.', tag: 'Weird' },
        ],
      },
    ],
  },
}

export default function FunPortal() {
  const { lang } = useLang()
  const t = copy[lang]
  const [selectedId, setSelectedId] = useState(t.categories[0].id)
  const activeCategory = useMemo(() => t.categories.find((category) => category.id === selectedId) ?? t.categories[0], [selectedId, t.categories])

  return (
    <>
      <SEO title={t.seoTitle} description={t.seoDescription} url="/fun" />
      <section className="xk-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel overflow-hidden rounded-[2rem] border border-yellow-300/45 bg-[linear-gradient(135deg,rgba(234,179,8,.16),rgba(139,92,246,.12),rgba(50,255,138,.08))] p-6 shadow-[0_0_28px_rgba(234,179,8,.16)] md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">{t.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">{t.description}</p>
            <div className="mt-6 inline-flex rounded-full border border-yellow-300/40 bg-black/35 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-yellow-200">
              {t.success}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.categories.map((category) => {
              const isActive = category.id === activeCategory.id
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedId(category.id)}
                  className={`xk-card rounded-3xl border bg-black/55 p-5 text-left transition hover:-translate-y-1 hover:rotate-[.35deg] ${isActive ? 'border-[#32FF8A]/60 shadow-[0_0_24px_rgba(50,255,138,.18)]' : 'border-yellow-300/30 hover:shadow-[0_0_18px_rgba(234,179,8,.18)]'}`}
                  aria-pressed={isActive}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF6B1A]">{isActive ? t.selectedLabel : t.openLabel}</p>
                  <h2 className="mt-3 text-xl font-black uppercase text-white">{category.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-gray-200">{category.text}</p>
                </button>
              )
            })}
          </div>

          <section className="mt-8 rounded-3xl border border-yellow-300/30 bg-black/55 p-5 shadow-[0_0_24px_rgba(234,179,8,.12)] md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#FF6B1A]">{activeCategory.badge}</p>
            <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white">{activeCategory.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">{activeCategory.text}</p>
              </div>
              <Link to="/news" className="inline-flex rounded-full border border-yellow-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-yellow-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.readLabel}</Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {activeCategory.articles.map((article) => (
                <article key={article.title} className="rounded-2xl border border-yellow-300/20 bg-white/[0.04] p-5 transition hover:border-[#32FF8A]/50 hover:bg-white/[0.07]">
                  <span className="rounded-full border border-[#FF6B1A]/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#FF6B1A]">{article.tag}</span>
                  <h3 className="mt-4 text-lg font-black uppercase leading-tight text-white">{article.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-200">{article.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <Link to="/" className="mt-8 inline-flex rounded-full border border-yellow-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-yellow-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">
            {t.back}
          </Link>
        </div>
      </section>
    </>
  )
}
