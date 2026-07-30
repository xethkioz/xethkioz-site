import { useEffect, useMemo, useState } from 'react'
import SafeImage from '../SafeImage'
import './ComiconLibraryReal.css'
import {
  fetchPublishedComiconCatalog,
  type ComiconCatalogChannel,
  type ComiconCatalogEntityType,
  type ComiconCatalogItem,
} from '../../services/comicon/publicComiconCatalogService'

type ChannelFilter = 'all' | ComiconCatalogChannel
type EntityFilter = 'all' | ComiconCatalogEntityType

type Props = {
  lang: 'es' | 'en'
  channel: ChannelFilter
}

const entityOrder: EntityFilter[] = ['all', 'hero', 'villain', 'antihero', 'team', 'comic', 'manga', 'screen']

const copy = {
  es: {
    eyebrow: 'REAL_DATABASE // 40',
    title: 'Archivo de héroes y obras',
    description: 'Fichas reales y verificables de héroes, villanos, antihéroes, equipos, cómics, manga y adaptaciones. Cada entrada conserva fuentes y datos editoriales.',
    filter: 'Filtrar por categoría',
    count: 'fichas disponibles',
    inspect: 'Abrir ficha',
    selected: 'Ficha del archivo seleccionada',
    loading: 'Sincronizando el archivo COMICON…',
    empty: 'No hay fichas publicadas en este filtro.',
    more: 'Mostrar más fichas',
    allShown: 'Archivo completo visible',
    publisher: 'Editorial / estudio',
    universe: 'Universo',
    identity: 'Identidad',
    debut: 'Primera aparición',
    creators: 'Creadores',
    facts: 'Datos clave',
    sources: 'Fuentes',
    source: 'Fuente oficial',
    entities: {
      all: 'Todo',
      hero: 'Héroes',
      villain: 'Villanos',
      antihero: 'Antihéroes',
      team: 'Equipos',
      comic: 'Cómics',
      manga: 'Manga',
      screen: 'Cine + Series',
    },
    channels: { marvel: 'Marvel', dc: 'DC Universe', anime: 'Anime + Manga', screen: 'Cine + Series', comics: 'Cómics + Autor' },
  },
  en: {
    eyebrow: 'REAL_DATABASE // 40',
    title: 'Heroes and works archive',
    description: 'Real, verifiable profiles for heroes, villains, antiheroes, teams, comics, manga and adaptations. Every entry preserves sources and editorial data.',
    filter: 'Filter by category',
    count: 'available profiles',
    inspect: 'Open profile',
    selected: 'Selected archive profile',
    loading: 'Synchronizing the COMICON archive…',
    empty: 'No published profiles match this filter.',
    more: 'Show more profiles',
    allShown: 'Complete archive visible',
    publisher: 'Publisher / studio',
    universe: 'Universe',
    identity: 'Identity',
    debut: 'First appearance',
    creators: 'Creators',
    facts: 'Key facts',
    sources: 'Sources',
    source: 'Official source',
    entities: {
      all: 'All',
      hero: 'Heroes',
      villain: 'Villains',
      antihero: 'Antiheroes',
      team: 'Teams',
      comic: 'Comics',
      manga: 'Manga',
      screen: 'Movies + TV',
    },
    channels: { marvel: 'Marvel', dc: 'DC Universe', anime: 'Anime + Manga', screen: 'Movies + TV', comics: 'Comics + Authors' },
  },
} as const

function sourceLabel(url: string, fallback: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    return hostname || fallback
  } catch {
    return fallback
  }
}

export default function ComiconLibrary({ lang, channel }: Props) {
  const [entity, setEntity] = useState<EntityFilter>('all')
  const [visibleCount, setVisibleCount] = useState(12)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [items, setItems] = useState<ComiconCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const t = copy[lang]

  useEffect(() => {
    let active = true
    setLoading(true)
    void fetchPublishedComiconCatalog()
      .then((nextItems) => {
        if (active) setItems(nextItems)
      })
      .catch(() => {
        if (active) setItems([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const filteredItems = useMemo(
    () => items.filter((item) => (channel === 'all' || item.channel === channel) && (entity === 'all' || item.entity_type === entity)),
    [channel, entity, items],
  )

  useEffect(() => {
    setVisibleCount(12)
    setSelectedId(null)
  }, [channel, entity])

  const visibleItems = filteredItems.slice(0, visibleCount)
  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null
  const hasMore = visibleItems.length < filteredItems.length

  return (
    <section className="xk-comicon-library" aria-labelledby="comicon-library-title" data-catalog-count={items.length}>
      <header>
        <div>
          <p>{t.eyebrow}</p>
          <h2 id="comicon-library-title" tabIndex={-1}>{t.title}</h2>
        </div>
        <span>{t.description}</span>
      </header>

      <div className="xk-comicon-library-toolbar">
        <div role="group" aria-label={t.filter}>
          {entityOrder.map((itemEntity) => (
            <button
              key={itemEntity}
              type="button"
              aria-pressed={entity === itemEntity}
              onClick={() => setEntity(itemEntity)}
            >
              {t.entities[itemEntity]}
            </button>
          ))}
        </div>
        <strong>{filteredItems.length} {t.count}</strong>
      </div>

      {loading ? <p className="xk-comicon-loading" role="status">{t.loading}</p> : null}
      {!loading && filteredItems.length === 0 ? <p className="xk-comicon-loading">{t.empty}</p> : null}

      {!loading && selectedItem ? (
        <div className="xk-comicon-library-layout">
          <div className="xk-comicon-library-grid">
            {visibleItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="xk-comicon-library-card xk-comicon-library-card-real"
                data-channel={item.channel}
                data-entity={item.entity_type}
                data-selected={selectedItem.id === item.id}
                aria-label={`${t.inspect}: ${item.title}`}
                onClick={() => setSelectedId(item.id)}
              >
                <SafeImage
                  src={item.image_url}
                  fallback="/assets/portal-comicon-world.svg"
                  alt=""
                  loading="lazy"
                  fetchPriority="low"
                />
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <small>{t.channels[item.channel]} · {t.entities[item.entity_type]}</small>
                <b>{item.title}</b>
                <em>{item.publisher}</em>
              </button>
            ))}
          </div>

          <aside className="xk-comicon-library-detail xk-comicon-library-detail-real" aria-live="polite">
            <p>{t.selected}</p>
            <SafeImage
              src={selectedItem.image_url}
              fallback="/assets/portal-comicon-world.svg"
              alt={selectedItem.image_alt}
              loading="lazy"
              fetchPriority="low"
            />
            <small>{t.channels[selectedItem.channel]} · {t.entities[selectedItem.entity_type]}</small>
            <h3>{selectedItem.title}</h3>
            <div>{selectedItem.summary[lang]}</div>

            <dl>
              <div><dt>{t.publisher}</dt><dd>{selectedItem.publisher}</dd></div>
              {selectedItem.universe ? <div><dt>{t.universe}</dt><dd>{selectedItem.universe}</dd></div> : null}
              {selectedItem.identity ? <div><dt>{t.identity}</dt><dd>{selectedItem.identity}</dd></div> : null}
              {selectedItem.debut ? <div><dt>{t.debut}</dt><dd>{selectedItem.debut}</dd></div> : null}
              {selectedItem.creators.length ? <div><dt>{t.creators}</dt><dd>{selectedItem.creators.join(' · ')}</dd></div> : null}
            </dl>

            {selectedItem.facts[lang].length ? (
              <section aria-label={t.facts}>
                <h4>{t.facts}</h4>
                <ul>{selectedItem.facts[lang].map((fact) => <li key={fact}>{fact}</li>)}</ul>
              </section>
            ) : null}

            {selectedItem.source_urls.length ? (
              <footer>
                <h4>{t.sources}</h4>
                <div>
                  {selectedItem.source_urls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                      {sourceLabel(url, t.source)} ↗
                    </a>
                  ))}
                </div>
              </footer>
            ) : null}
          </aside>
        </div>
      ) : null}

      {!loading && selectedItem ? (
        <footer>
          {hasMore ? (
            <button type="button" onClick={() => setVisibleCount((current) => current + 12)}>{t.more} ↓</button>
          ) : (
            <span>{t.allShown}</span>
          )}
        </footer>
      ) : null}
    </section>
  )
}
