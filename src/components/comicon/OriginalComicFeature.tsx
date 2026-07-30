import { useState } from 'react'
import SafeImage from '../SafeImage'
import { originalComic } from '../../data/comiconCatalog'
import '../../pages/ComicUniverseExpansion.css'

type Props = {
  lang: 'es' | 'en'
}

const copy = {
  es: {
    eyebrow: 'XETHKIOZ ORIGINAL // SERIE 01',
    title: 'Cómic original',
    available: 'Prólogo disponible',
    planned: 'En desarrollo',
    chapters: 'Capítulos de la primera saga',
    read: 'Leer prólogo',
    close: 'Cerrar lector',
    reader: 'Lector vertical · Prólogo',
    continue: 'Continuará en el Capítulo 01',
    note: 'Historia original de XETHKIOZ. La serie crecerá con nuevas páginas, capítulos y portadas desde el portal COMICON.',
  },
  en: {
    eyebrow: 'XETHKIOZ ORIGINAL // SERIES 01',
    title: 'Original comic',
    available: 'Prologue available',
    planned: 'In development',
    chapters: 'First saga chapters',
    read: 'Read prologue',
    close: 'Close reader',
    reader: 'Vertical reader · Prologue',
    continue: 'Continued in Chapter 01',
    note: 'An original XETHKIOZ story. The series will grow with new pages, chapters and covers inside the COMICON portal.',
  },
} as const

export default function OriginalComicFeature({ lang }: Props) {
  const [readerOpen, setReaderOpen] = useState(false)
  const t = copy[lang]
  const prologue = originalComic.chapters[0]

  return (
    <section className="xk-comicon-original" aria-labelledby="comicon-original-title" data-original-comic={originalComic.slug}>
      <header>
        <p>{t.eyebrow}</p>
        <h2 id="comicon-original-title">{t.title}</h2>
      </header>

      <div className="xk-comicon-original-feature">
        <figure>
          <SafeImage
            src="/assets/xethkioz-light-shadow-comic-anime.webp"
            fallback="/assets/portal-comicon-world.svg"
            alt={originalComic.title[lang]}
            loading="lazy"
            fetchPriority="low"
          />
          <figcaption>{originalComic.saga[lang]}</figcaption>
        </figure>

        <div className="xk-comicon-original-copy">
          <span>{t.available}</span>
          <h3>{originalComic.title[lang]}</h3>
          <p>{originalComic.synopsis[lang]}</p>
          <button
            type="button"
            aria-expanded={readerOpen}
            aria-controls="xk-original-comic-reader"
            onClick={() => setReaderOpen((current) => !current)}
          >
            {readerOpen ? t.close : t.read} <b aria-hidden="true">{readerOpen ? '×' : '→'}</b>
          </button>
          <small>{t.note}</small>
        </div>
      </div>

      <div className="xk-comicon-chapter-strip" aria-label={t.chapters}>
        {originalComic.chapters.map((chapter) => (
          <article key={chapter.id} data-status={chapter.status}>
            <span>{chapter.number}</span>
            <div>
              <b>{chapter.title[lang]}</b>
              <small>{chapter.status === 'available' ? t.available : t.planned}</small>
            </div>
          </article>
        ))}
      </div>

      {readerOpen ? (
        <div id="xk-original-comic-reader" className="xk-comicon-reader" role="region" aria-label={t.reader}>
          <header><span>{prologue.number}</span><h3>{prologue.title[lang]}</h3></header>
          <div className="xk-comicon-panels">
            {prologue.panels.map((panel, index) => (
              <article key={`${panel.tone}-${index}`} data-tone={panel.tone}>
                {index === 4 ? (
                  <SafeImage
                    src="/assets/xethkioz-light-shadow-comic-anime.webp"
                    fallback="/assets/portal-comicon-world.svg"
                    alt=""
                    loading="lazy"
                    fetchPriority="low"
                  />
                ) : null}
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{panel.caption[lang]}</p>
              </article>
            ))}
          </div>
          <footer>{t.continue}</footer>
        </div>
      ) : null}
    </section>
  )
}
