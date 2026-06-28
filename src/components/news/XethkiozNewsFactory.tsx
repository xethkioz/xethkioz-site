import type { CSSProperties } from 'react'
import type { ArticleRow, CategoryConfigRow } from '../../services/cms/databaseSchema'
import { resolveCategoryConfig } from '../../services/cms/databaseSchema'
import type { PortalEventBusLike } from '../../engines/world/sandbox/portalEventContracts'
import { useNewsHydration } from '../../hooks/useNewsHydration'

export type NewsFactoryVariant = 'web' | 'instagram' | 'threads' | 'wide'

export interface NewsQuickSpec {
  label: string
  value: string
}

export interface NewsLowerBlock {
  type: 'comparison' | 'roadmap' | 'top' | 'deal' | 'generic'
  title: string
  items: string[]
}

export interface NewsSocialBranding {
  instagram?: string
  tiktok?: string
  threads?: string
  website: string
}

export interface XethkiozNewsFactoryProps {
  article?: ArticleRow
  category?: CategoryConfigRow
  highlightKeyword?: string
  specs?: NewsQuickSpec[]
  lowerBlock?: NewsLowerBlock
  socials: NewsSocialBranding
  variant?: NewsFactoryVariant
  formattedDate?: string
  hydration?: {
    enabled?: boolean
    eventBus?: PortalEventBusLike
  }
}

function splitTitleByKeyword(title: string, keyword?: string) {
  if (!keyword) return { before: title, match: '', after: '' }

  const index = title.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase())
  if (index === -1) return { before: title, match: '', after: '' }

  return {
    before: title.slice(0, index),
    match: title.slice(index, index + keyword.length),
    after: title.slice(index + keyword.length),
  }
}

function formatDateFromIso(isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getVariantShellClass(variant: NewsFactoryVariant) {
  if (variant === 'instagram') return 'aspect-[4/5] max-h-[1350px] max-w-[1080px]'
  if (variant === 'threads') return 'aspect-[16/9] max-w-[1200px]'
  if (variant === 'wide') return 'aspect-[16/9] max-w-[1600px]'
  return 'min-h-[760px] max-w-[1440px]'
}

export function XethkiozNewsFactory({
  article,
  category,
  highlightKeyword,
  specs = [],
  lowerBlock,
  socials,
  variant = 'web',
  formattedDate,
  hydration,
}: XethkiozNewsFactoryProps) {
  const hydrationState = useNewsHydration({
    enabled: hydration?.enabled ?? !article,
    eventBus: hydration?.eventBus,
  })
  const hydratedArticle = article ?? hydrationState.newsData?.featured?.article
  const resolvedArticle = hydratedArticle ?? null

  if (!resolvedArticle) {
    return (
      <article className={`relative isolate mx-auto flex w-full items-center justify-center overflow-hidden rounded-[2rem] border border-violet-500/25 bg-[#0B0A0F] p-8 text-white shadow-[0_0_70px_rgba(124,58,237,0.22)] ${getVariantShellClass(variant)}`}>
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-violet-300">XETHKIOZ NEWS</p>
          <h1 className="mt-3 text-3xl font-black uppercase">{hydrationState.isLoading ? 'Hidratando CMS...' : 'Sin noticias cargadas'}</h1>
          {hydrationState.error ? <p className="mt-3 text-sm text-red-300">{hydrationState.error.message}</p> : null}
        </div>
      </article>
    )
  }

  const resolvedCategory = category ?? hydrationState.newsData?.featured?.category ?? resolveCategoryConfig(resolvedArticle.category_id)
  const resolvedDate = formattedDate ?? formatDateFromIso(resolvedArticle.release_date)
  const title = splitTitleByKeyword(resolvedArticle.title, highlightKeyword)
  const safeSpecs = specs.slice(0, 6)
  const safeLowerItems = lowerBlock?.items.slice(0, 5) ?? []

  return (
    <article
      className={`relative isolate mx-auto flex w-full overflow-hidden rounded-[2rem] border border-violet-500/25 bg-[#0B0A0F] text-white shadow-[0_0_70px_rgba(124,58,237,0.22)] ${getVariantShellClass(variant)}`}
      style={{ '--xeth-category-color': resolvedCategory.color_code } as CSSProperties}
      aria-label={`XETHKIOZ News: ${resolvedArticle.title}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(168,85,247,0.28),transparent_32%),radial-gradient(circle_at_78%_8%,rgba(249,115,22,0.24),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-violet-400 to-cyan-300" />

      <div className="relative z-10 grid h-full w-full grid-rows-[auto_minmax(0,1fr)_13%]">
        <header className="flex items-center justify-between border-b border-violet-500/15 bg-black/35 px-6 py-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/40 bg-orange-500/10 font-black text-orange-300 shadow-[0_0_24px_rgba(249,115,22,0.25)]">
              X
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-violet-200/80">XETHKIOZ NEWS</p>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Gaming Is My Passion</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right font-mono text-[10px] uppercase tracking-[0.18em]">
            <span className="hidden text-slate-400 md:inline">{resolvedDate}</span>
            <span className="rounded-full border px-3 py-1 text-white shadow-[0_0_18px_rgba(255,255,255,0.08)]" style={{ borderColor: resolvedCategory.color_code, color: resolvedCategory.color_code }}>
              {resolvedCategory.name}
            </span>
          </div>
        </header>

        <section className="grid min-h-0 grid-cols-1 gap-4 p-5 md:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)] md:p-7">
          <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/50">
            <img src={resolvedArticle.main_image} alt={resolvedArticle.title} className="absolute inset-0 h-full w-full object-cover opacity-80" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A0F] via-[#0B0A0F]/35 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,10,15,0.92)_0%,rgba(11,10,15,0.34)_45%,rgba(11,10,15,0.08)_100%)]" />

            <div className="relative z-10 flex h-full max-w-4xl flex-col justify-end gap-4 p-6 md:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-orange-300">Beyond The Game</p>
              <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                {title.before}
                {title.match ? <span style={{ color: resolvedCategory.color_code }}> {title.match}</span> : null}
                {title.after}
              </h1>
              {resolvedArticle.subtitle ? <h3 className="max-w-3xl text-lg font-semibold text-slate-100 md:text-2xl">{resolvedArticle.subtitle}</h3> : null}
              <p className="max-w-3xl border-l-2 pl-4 text-sm leading-relaxed text-slate-300 md:text-base" style={{ borderColor: resolvedCategory.color_code }}>
                {resolvedArticle.summary}
              </p>
            </div>
          </div>

          <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
            <div className="rounded-[1.25rem] border border-violet-500/20 bg-[#16141F]/80 p-5 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-300">Lectura rápida</p>
              <div className="mt-4 space-y-3">
                {safeSpecs.length > 0 ? (
                  safeSpecs.map((spec) => (
                    <div key={`${spec.label}-${spec.value}`} className="rounded-xl border border-white/10 bg-black/25 p-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">{spec.label}</span>
                      <p className="mt-1 text-sm font-bold text-slate-100"><span style={{ color: resolvedCategory.color_code }}>✓</span> {spec.value}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Sin specs rápidas cargadas desde CMS.</p>
                )}
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-orange-500/20 bg-black/45 p-5 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-orange-300">{lowerBlock?.title ?? 'Bloque editorial flexible'}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {safeLowerItems.length > 0 ? (
                  safeLowerItems.map((item) => (
                    <li key={item} className="flex gap-2"><span style={{ color: resolvedCategory.color_code }}>▣</span><span>{item}</span></li>
                  ))
                ) : (
                  <li>Comparativas, roadmaps, tops u ofertas se inyectan desde el CMS.</li>
                )}
              </ul>
            </div>
          </aside>
        </section>

        <footer className="relative flex items-center justify-between border-t border-white/10 bg-black px-6 py-3 md:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">Safe Area Redes 12-15%</p>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-white">XETHKIOZ</p>
          </div>
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">
            {socials.instagram ? <span>IG {socials.instagram}</span> : null}
            {socials.tiktok ? <span>TT {socials.tiktok}</span> : null}
            {socials.threads ? <span>TH {socials.threads}</span> : null}
            <span className="text-orange-300">{socials.website}</span>
          </div>
        </footer>
      </div>
    </article>
  )
}

export default XethkiozNewsFactory
