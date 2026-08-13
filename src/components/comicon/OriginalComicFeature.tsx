import { useMemo, useState } from 'react'
import SafeImage from '../SafeImage'
import { originalComicSaga, type ComicChapter, type ComicPanel } from '../../data/originalComicSaga'
import '../../pages/ComicUniverseExpansion.css'

type Props = {
  lang: 'es' | 'en'
}

type ReadableChapter = ComicChapter & { panels: readonly ComicPanel[] }

const copy = {
  es: {
    eyebrow: 'XETHKIOZ ORIGINAL // SERIE 01',
    title: 'Cómic original',
    available: 'Disponible',
    planned: 'En desarrollo',
    chapters: 'Capítulos de la primera saga',
    read: 'Abrir lector',
    close: 'Cerrar lector',
    reader: 'Lector vertical',
    continue: 'Continuará',
    complete: 'Fin del contenido disponible',
    note: 'Historia original de XETHKIOZ. El prólogo y los capítulos 01 y 02 ya pueden leerse completos dentro del portal COMICON.',
    latest: 'Última entrega',
    next: 'Próximo episodio',
    released: 'Publicado',
    availableCount: 'capítulos disponibles',
    choose: 'Seleccionar capítulo',
  },
  en: {
    eyebrow: 'XETHKIOZ ORIGINAL // SERIES 01',
    title: 'Original comic',
    available: 'Available',
    planned: 'In development',
    chapters: 'First saga chapters',
    read: 'Open reader',
    close: 'Close reader',
    reader: 'Vertical reader',
    continue: 'Continued',
    complete: 'End of available content',
    note: 'An original XETHKIOZ story. The prologue and Chapters 01 and 02 can now be read in full inside the COMICON portal.',
    latest: 'Latest episode',
    next: 'Next episode',
    released: 'Released',
    availableCount: 'chapters available',
    choose: 'Select chapter',
  },
} as const

export default function OriginalComicFeature({ lang }: Props) {
  const readableChapters = useMemo(
    () => originalComicSaga.chapters.filter(
      (chapter): chapter is ReadableChapter => chapter.status === 'available' && Array.isArray(chapter.panels),
    ),
    [],
  )
  const [selectedChapterId, setSelectedChapterId] = useState(readableChapters[0]?.id ?? '')
  const [readerOpen, setReaderOpen] = useState(false)
  const t = copy[lang]
  const selectedChapter = readableChapters.find((chapter) => chapter.id === selectedChapterId) ?? readableChapters[0]
  const chapterIndex = originalComicSaga.chapters.findIndex((chapter) => chapter.id === selectedChapter?.id)
  const nextChapter = chapterIndex >= 0 ? originalComicSaga.chapters[chapterIndex + 1] : null
  const latestChapter = readableChapters.at(-1)
  const upcomingChapter = originalComicSaga.chapters.find((chapter) => chapter.status === 'planned' && chapter.scheduledFor)
  const dateLocale = lang === 'es' ? 'es-AR' : 'en-US'
  const formatDate = (value?: string) => value
    ? new Intl.DateTimeFormat(dateLocale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`))
    : ''

  function selectChapter(chapter: ReadableChapter) {
    setSelectedChapterId(chapter.id)
    setReaderOpen(true)
    window.requestAnimationFrame(() => document.getElementById('xk-original-comic-reader')?.focus({ preventScroll: true }))
  }

  return (
    <section className="xk-comicon-original" aria-labelledby="comicon-original-title" data-original-comic={originalComicSaga.slug}>
      <header>
        <p>{t.eyebrow}</p>
        <h2 id="comicon-original-title">{t.title}</h2>
      </header>

      <div className="xk-comicon-original-feature">
        <figure>
          <SafeImage
            src="/assets/xethkioz-light-shadow-comic-anime.webp"
            fallback="/assets/portal-comicon-world.svg"
            alt={originalComicSaga.title[lang]}
            loading="lazy"
            fetchPriority="low"
          />
          <figcaption>{originalComicSaga.saga[lang]}</figcaption>
        </figure>

        <div className="xk-comicon-original-copy">
          <span>{originalComicSaga.cadence[lang]} · {readableChapters.length} {t.availableCount}</span>
          <h3>{originalComicSaga.title[lang]}</h3>
          <p>{originalComicSaga.synopsis[lang]}</p>
          <button
            type="button"
            aria-expanded={readerOpen}
            aria-controls="xk-original-comic-reader"
            onClick={() => setReaderOpen((current) => !current)}
          >
            {readerOpen ? t.close : t.read} <b aria-hidden="true">{readerOpen ? '×' : '→'}</b>
          </button>
          <small>{t.note} {latestChapter?.releaseDate ? `${t.latest}: ${latestChapter.title[lang]} · ${formatDate(latestChapter.releaseDate)}.` : ''} {upcomingChapter?.scheduledFor ? `${t.next}: ${formatDate(upcomingChapter.scheduledFor)}.` : ''}</small>
        </div>
      </div>

      <div className="xk-comicon-chapter-strip" role="group" aria-label={`${t.chapters}. ${t.choose}`}>
        {originalComicSaga.chapters.map((chapter) => {
          const readable = readableChapters.find((item) => item.id === chapter.id)
          return (
            <button
              key={chapter.id}
              type="button"
              className="xk-comicon-chapter-card"
              data-status={chapter.status}
              data-selected={selectedChapter?.id === chapter.id}
              disabled={!readable}
              aria-pressed={readable ? selectedChapter?.id === chapter.id : undefined}
              onClick={() => readable && selectChapter(readable)}
            >
              <span>{chapter.number}</span>
              <span>
                <b>{chapter.title[lang]}</b>
                <small>{readable ? `${t.released} · ${formatDate(chapter.releaseDate)}` : `${t.planned}${chapter.scheduledFor ? ` · ${formatDate(chapter.scheduledFor)}` : ''}`}</small>
              </span>
            </button>
          )
        })}
      </div>

      {readerOpen && selectedChapter ? (
        <div
          id="xk-original-comic-reader"
          className="xk-comicon-reader"
          role="region"
          tabIndex={-1}
          aria-label={`${t.reader} · ${selectedChapter.title[lang]}`}
        >
          <header><span>{selectedChapter.number}</span><h3>{selectedChapter.title[lang]}</h3></header>
          <div className="xk-comicon-panels">
            {selectedChapter.panels.map((panel, index) => (
              <article key={`${selectedChapter.id}-${panel.tone}-${index}`} data-tone={panel.tone}>
                {panel.art === 'identity' ? (
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
          <footer>{nextChapter ? `${t.continue}: ${nextChapter.title[lang]}` : t.complete}</footer>
        </div>
      ) : null}
    </section>
  )
}
