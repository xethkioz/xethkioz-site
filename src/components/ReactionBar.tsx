import { useMemo, useState } from 'react'

const reactions = [
  { key: 'like', label: 'Me gusta', icon: '🔥' },
  { key: 'hype', label: 'Hype', icon: '⚡' },
  { key: 'think', label: 'Interesante', icon: '🧠' },
  { key: 'share', label: 'Compartir', icon: '🚀' },
]

export default function ReactionBar({ articleId }: { articleId: string }) {
  const storageKey = `xethkioz_reactions_${articleId}`
  const [active, setActive] = useState<string | null>(() => {
    try { return localStorage.getItem(storageKey) } catch { return null }
  })

  const baseCounts = useMemo(() => {
    const seed = articleId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return {
      like: 80 + (seed % 410),
      hype: 45 + (seed % 260),
      think: 30 + (seed % 180),
      share: 12 + (seed % 90),
    }
  }, [articleId])

  const pick = (key: string) => {
    const next = active === key ? null : key
    setActive(next)
    try {
      if (next) localStorage.setItem(storageKey, next)
      else localStorage.removeItem(storageKey)
    } catch {}
  }

  return (
    <aside className="mt-10 rounded-2xl border border-orange/25 bg-ink-300/80 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <p className="section-eyebrow">COMUNIDAD</p>
          <h3 className="font-display text-xl font-bold text-white">Reaccioná a la nota</h3>
        </div>
        <p className="text-xs text-gray-500">Base Alpha 3 preparada para Supabase Realtime.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {reactions.map((reaction) => {
          const isActive = active === reaction.key
          const count = baseCounts[reaction.key as keyof typeof baseCounts] + (isActive ? 1 : 0)
          return (
            <button
              key={reaction.key}
              type="button"
              onClick={() => pick(reaction.key)}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                isActive
                  ? 'border-orange bg-orange/15 text-white shadow-[0_0_20px_rgba(255,106,0,.18)]'
                  : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-orange/40 hover:bg-orange/10'
              }`}
            >
              <span className="text-2xl block mb-1">{reaction.icon}</span>
              <span className="font-display text-sm font-bold block">{reaction.label}</span>
              <span className="text-xs text-gray-500">{count.toLocaleString()} reacciones</span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
