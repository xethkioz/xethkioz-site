import { useEffect, useState } from 'react'
import { checkPublicChatHealth } from '../lib/realtimeCommunity'
import { isSupabaseConfigured } from '../lib/supabase'

type Health = { ok: boolean; mode: string; reason: string }

export default function PublicChatHealthPanel() {
  const [health, setHealth] = useState<Health | null>(null)
  useEffect(() => {
    let active = true
    checkPublicChatHealth().then((result) => { if (active) setHealth(result) })
    return () => { active = false }
  }, [])

  const ok = health?.ok
  return (
    <section className={`rounded-3xl border p-5 ${ok ? 'border-green-400/30 bg-green-500/5' : 'border-orange/30 bg-orange/5'}`}>
      <p className="section-eyebrow">RC4 PUBLIC CHAT HEALTH</p>
      <h3 className="font-display text-xl font-black text-white">Estado del chat público</h3>
      <p className="mt-2 text-sm text-gray-300">
        Supabase configurado: <strong className={isSupabaseConfigured ? 'text-green-300' : 'text-orange'}>{isSupabaseConfigured ? 'sí' : 'no'}</strong> ·
        Estado: <strong className={ok ? 'text-green-300' : 'text-orange'}>{health ? (ok ? 'operativo' : 'requiere revisión') : 'verificando...'}</strong>
      </p>
      {health && <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-gray-300">{health.reason}</pre>}
      <p className="mt-3 text-xs text-gray-500">Si aparece "tabla no accesible", aplicá la migración RC4 en Supabase y activá Realtime para xeth_chat_messages.</p>
    </section>
  )
}
