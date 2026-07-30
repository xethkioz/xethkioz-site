import { useEffect, useMemo, useState } from 'react'
import { comiconCatalog, type ComiconCatalogChannel, type ComiconCatalogKind } from '../../data/comiconCatalog'

type ChannelFilter = 'all' | ComiconCatalogChannel
type KindFilter = 'all' | ComiconCatalogKind

type Props = {
  lang: 'es' | 'en'
  channel: ChannelFilter
}

const kindOrder: KindFilter[] = ['all', 'guide', 'analysis', 'comic', 'timeline', 'fan']

const copy = {
  es: {
    eyebrow: 'EDITORIAL_LIBRARY // 36',
    title: 'Biblioteca del multiverso',
    description: 'Treinta y seis rutas editoriales iniciales para convertir en noticias, guías, análisis, historietas o especiales desde el CMS de XETHKIOZ.',
    filter: 'Filtrar por formato',
    count: 'rutas disponibles',
    inspect: 'Abrir ficha',
    selected: 'Ficha editorial seleccionada',
    development: 'Lista para desarrollar',
    developmentText: 'Esta ficha funciona como base editorial. Puede crecer como publicación del CMS, serie de artículos, cómic corto o especial multimedia sin modificar el diseño del portal.',
    more: 'Mostrar más contenido',
    allShown: 'Biblioteca completa visible',
    kinds: {
      all: 'Todo', guide: 'Guías', analysis: 'Análisis', comic: 'Cómics', timeline: 'Cronologías', fan: 'Cultura fan',
    },
    channels: { marvel: 'Marvel', dc: 'DC Universe', anime: 'Anime + Manga', screen: 'Cine + Series', comics: 'Cómics + Fan' },
  },
  en: {
    eyebrow: 'EDITORIAL_LIBRARY // 36',
    title: 'Multiverse library',
    description: 'Thirty-six starter editorial routes ready to become news, guides, analysis, comic stories or specials through the XETHKIOZ CMS.',
    filter: 'Filter by format',
    count: 'available routes',
    inspect: 'Open card',
    selected: 'Selected editorial card',
    development: 'Ready for development',
    developmentText: 'This card is an editorial foundation. It can grow into a CMS publication, article series, short comic or multimedia special without changing the portal layout.',
    more: 'Show more content',
    allShown: 'Complete library visible',
    kinds: {
      all: 'All', guide: 'Guides', analysis: 'Analysis', comic: 'Comics', timeline: 'Timelines', fan: 'Fan culture',
    },
    channels: { marvel: 'Marvel', dc: 'DC Universe', anime: 'Anime + Manga', screen: 'Movies + TV', comics: 'Comics + Fans' },
  },
} as const

export default function ComiconLibrary({ lang, channel }: Props) {
  const [kind, setKind] = useState<KindFilter>('all')
  const [visibleCount, setVisibleCount] = useState(12)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const t = copy[lang]

  const filteredItems = useMemo(
    () => comiconCatalog.filter((item) => (channel === 'all' || item.channel === channel) && (kind === 'all' || item.kind === kind)),
    [channel, kind],
  )

  useEffect(() => {
    setVisibleCount(12)
    setSelectedId(null)
  }, [channel, kind])

  const visibleItems = filteredItems.slice(0, visibleCount)
  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null
  const hasMore = visibleItems.length < filteredItems.length

  return (
    <section className="xk-comicon-library" aria-labelledby="comicon-library-title" data-catalog-count={comiconCatalog.length}>
      <header>
        <div>
          <p>{t.eyebrow}</p>
          <h2 id="comicon-library-title">{t.title}</h2>
        </div>
        <span>{t.description}</span>
      </header>

      <div className="xk-comicon-library-toolbar">
        <div role="group" aria-label={t.filter}>
          {kindOrder.map((itemKind) => (
            <button
              key={itemKind}
              type="button"
              aria-pressed={kind === itemKind}
              onClick={() => setKind(itemKind)}
            >
              {t.kinds[itemKind]}
            </button>
          ))}
        </div>
        <strong>{filteredItems.length} {t.count}</strong>
      </div>

      <div className="xk-comicon-library-layout">
        <div className="xk-comicon-library-grid">
          {visibleItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="xk-comicon-library-card"
              data-channel={item.channel}
              data-selected={selectedItem?.id === item.id}
              aria-label={`${t.inspect}: ${item.title[lang]}`}
              onClick={() => setSelectedId(item.id)}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <i aria-hidden="true">{item.glyph}</i>
              <small>{t.channels[item.channel]} · {t.kinds[item.kind]}</small>
              <b>{item.title[lang]}</b>
            </button>
          ))}
        </div>

        {selectedItem ? (
          <aside className="xk-comicon-library-detail" aria-live="polite">
            <p>{t.selected}</p>
            <span aria-hidden="true">{selectedItem.glyph}</span>
            <small>{t.channels[selectedItem.channel]} · {t.kinds[selectedItem.kind]}</small>
            <h3>{selectedItem.title[lang]}</h3>
            <div>{selectedItem.summary[lang]}</div>
            <strong>{t.development}</strong>
            <p>{t.developmentText}</p>
          </aside>
        ) : null}
      </div>

      <footer>
        {hasMore ? (
          <button type="button" onClick={() => setVisibleCount((current) => current + 12)}>{t.more} ↓</button>
        ) : (
          <span>{t.allShown}</span>
        )}
      </footer>
    </section>
  )
}
