import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import SafeImage from '../components/SafeImage'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { useLang } from '../lib/LangContext'
import { addWispXp } from '../lib/realtimeCommunity'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle } from '../services/news/publicNewsService'

const content = {
  es: { description: 'El lado más caótico de internet: memes, clips y rarezas servidos como un episodio anime fuera de control.', badge: 'CAOS AUTORIZADO', back: 'Escapar del caos', stream: 'TRANSMISIÓN ILEGAL DE HUMOR', read: 'Ver el episodio', react: 'JAJA +1', reacted: 'REACCIÓN ENVIADA', chaos: 'CAOSÓMETRO', unleash: 'Liberar caos', chaosLines: ['El algoritmo encontró un meme prohibido.', 'Un duende digital robó el Wi-Fi del servidor.', 'La dignidad abandonó el chat. Todo funciona.', 'El Wisp se rio. Esto ya es preocupante.'], blocks: [{ id: 'memes', code: '01', title: 'Memes rápidos', icon: '爆' }, { id: 'clips', code: '02', title: 'Clips y videos', icon: '映' }, { id: 'legends', code: '03', title: 'Rarezas', icon: '怪' }] },
  en: { description: 'The most chaotic side of the internet: memes, clips and oddities served like an out-of-control anime episode.', badge: 'CHAOS AUTHORIZED', back: 'Escape the chaos', stream: 'ILLEGAL HUMOR BROADCAST', read: 'Watch episode', react: 'LOL +1', reacted: 'REACTION SENT', chaos: 'CHAOS METER', unleash: 'Unleash chaos', chaosLines: ['The algorithm found a forbidden meme.', 'A digital gremlin stole the server Wi-Fi.', 'Dignity left the chat. Everything works.', 'The Wisp laughed. This is concerning.'], blocks: [{ id: 'memes', code: '01', title: 'Quick memes', icon: '爆' }, { id: 'clips', code: '02', title: 'Clips & videos', icon: '映' }, { id: 'legends', code: '03', title: 'Oddities', icon: '怪' }] },
} as const

export default function FunPortal() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState<string>('memes')
  const [reacted, setReacted] = useState<Set<string>>(() => new Set())
  const [chaosIndex, setChaosIndex] = useState(0)
  const [published, setPublished] = useState<PublicNewsArticle[]>([])
  const seen = new Set<string>()
  const articles = [...published, ...getCuratedExternalNews('community')].filter((article) => !seen.has(article.slug) && Boolean(seen.add(article.slug))).slice(0, 7)

  useEffect(() => {
    let alive = true
    void fetchPublishedNews('community').then((next) => { if (alive) setPublished(next) }).catch(() => undefined)
    return () => { alive = false }
  }, [])

  function selectBlock(id: string) { setActiveId(id); addWispXp(2, 'portal', `/fun#${id}`) }
  function react(slug: string) {
    if (reacted.has(slug)) return
    setReacted((current) => new Set(current).add(slug))
    addWispXp(1, 'mission', `/fun#reaction-${slug}`)
  }
  function unleashChaos() {
    setChaosIndex((current) => (current + 1) % t.chaosLines.length)
    addWispXp(1, 'mission', '/fun#chaos-meter')
  }

  return <>
    <SEO title="Memes · XETHKIOZ" description={t.description} url="/fun" />
    <main className="xk-page xk-anime-page xk-anime-memes px-4 py-8 sm:px-6 lg:px-8">
      <div className="xk-manga-burst" aria-hidden="true" />
      <div className="xk-meme-ambient" aria-hidden="true"><i /><i /><i /><b>!</b><b>?</b><b>爆</b></div>
      <div className="mx-auto max-w-7xl">
        <section className="xk-anime-hero xk-meme-hero">
          <SafeImage src="/assets/identity/memes-anime-chaos-v1.webp" fallback="/images/articles/community.svg" alt="Espíritu anime de internet saliendo de un teléfono con energía de meme" className="xk-anime-hero-media" />
          <div className="xk-anime-hero-shade" /><div className="xk-halftone" aria-hidden="true" />
          <div className="xk-meme-hero-sprites" aria-hidden="true"><span>HA!</span><span>?!</span><span>LOL</span></div>
          <div className="xk-anime-hero-content">
            <div className="flex items-center justify-between gap-4"><p className="xk-meme-warning">⚠ MEME_CORE.EXE</p><button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="xk-sticker-button">{lang.toUpperCase()}</button></div>
            <p className="xk-anime-kanji xk-meme-kanji" aria-hidden="true">混沌</p>
            <h1 className="xk-meme-title" data-text="MEMES">MEMES!</h1>
            <p className="xk-speech-bubble">{t.description}</p>
            <span className="xk-chaos-stamp">{t.badge}</span>
          </div>
        </section>

        <div className="xk-meme-marquee" aria-hidden="true"><div>MEME SIGNAL ◆ REACTION OVERLOAD ◆ INTERNET CULTURE ◆ MEME SIGNAL ◆ REACTION OVERLOAD ◆ INTERNET CULTURE ◆</div></div>

        <section className="xk-manga-tabs" aria-label="Meme channels">
          {t.blocks.map((block) => <button key={block.id} onClick={() => selectBlock(block.id)} aria-pressed={activeId === block.id} className="xk-manga-tab"><span>{block.icon}</span><small>CH.{block.code}</small><b>{block.title}</b></button>)}
        </section>

        <section className="xk-chaos-console" aria-label={t.chaos}>
          <div className="xk-chaos-gauge"><div><span>{t.chaos}</span><b>{[87, 96, 73][t.blocks.findIndex((block) => block.id === activeId)]}%</b></div><i><em style={{ width: `${[87, 96, 73][t.blocks.findIndex((block) => block.id === activeId)]}%` }} /></i><small>MEME_CORE // {activeId.toUpperCase()} // UNSTABLE</small></div>
          <div className="xk-chaos-output"><span aria-hidden="true">☄</span><p>{t.chaosLines[chaosIndex]}</p><button type="button" onClick={unleashChaos}>{t.unleash} →</button></div>
        </section>

        <section className="mt-12">
          <div className="xk-anime-section-title xk-meme-section-title"><span>LIVE!</span><h2>{t.stream}</h2><i /></div>
          <div className="xk-meme-bento">{articles.map((article, index) => <article key={article.slug} className={`xk-meme-card xk-meme-card-${index + 1}${reacted.has(article.slug) ? ' is-reacted' : ''}`}>
            <div className="xk-meme-image-wrap"><SafeImage src={article.cover_image_url} fallback="/news/memes/argentina-duendes-cuartos.svg" alt={article.cover_image_alt || article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span>{['LOL!', 'WTF?!', 'JAJA', 'NOOO', 'GG!', 'BRUH', 'XD'][index % 7]}</span></div>
            <div className="xk-meme-copy"><small>EP.{String(index + 1).padStart(2, '0')} // {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</small><h3>{article.title}</h3>{index === 0 && <p>{article.summary}</p>}<div><Link to={`/news/${article.slug}`}>{t.read} →</Link><button onClick={() => react(article.slug)} disabled={reacted.has(article.slug)}>{reacted.has(article.slug) ? t.reacted : t.react}</button></div></div>
          </article>)}</div>
        </section>

        <div className="mt-10"><PublicAdSlot slotId="section-sidebar" fallbackLabel="XETHKIOZ FUN SPONSOR" /></div>
        <Link to="/" className="xk-sticker-button mt-8 inline-flex">{t.back}</Link>
      </div>
    </main>
  </>
}
