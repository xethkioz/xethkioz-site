import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEO from '../components/SEO'
import { UniverseTransitRail } from '../components/universe/UniverseTransitRail'
import NexusSocialLoop from '../components/nexus/NexusSocialLoop'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { addWispXp, getWispProgress, usePresence } from '../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

type CosmeticSlot = 'outfit' | 'aura' | 'accessory'
type CosmeticRarity = 'starter' | 'rare' | 'epic'

type Cosmetic = {
  id: string
  slot: CosmeticSlot
  name: { es: string; en: string }
  detail: { es: string; en: string }
  price: number
  color: string
  rarity: CosmeticRarity
}

type AvatarState = {
  skin: string
  hair: string
  outfit: string
  aura: string
  accessory: string
  owned: string[]
  spent: number
}

const STORAGE_KEY = 'xethkioz.nexus-city.avatar.v1'

const cosmetics: Cosmetic[] = [
  { id: 'outfit-nexus-runner', slot: 'outfit', name: { es: 'Nexus Runner', en: 'Nexus Runner' }, detail: { es: 'Chaqueta violeta de explorador.', en: 'Violet explorer jacket.' }, price: 0, color: '#8b5cf6', rarity: 'starter' },
  { id: 'outfit-cyber-ronin', slot: 'outfit', name: { es: 'Cyber Ronin', en: 'Cyber Ronin' }, detail: { es: 'Armadura urbana del distrito Asia.', en: 'Urban armor from the Asia district.' }, price: 180, color: '#22d3ee', rarity: 'rare' },
  { id: 'outfit-void-cultist', slot: 'outfit', name: { es: 'Cultista del Vacío', en: 'Void Cultist' }, detail: { es: 'Textura oscura infectada por el Wisp.', en: 'Dark texture infected by the Wisp.' }, price: 320, color: '#32ff8a', rarity: 'epic' },
  { id: 'aura-neon-pulse', slot: 'aura', name: { es: 'Pulso Neón', en: 'Neon Pulse' }, detail: { es: 'Energía violeta y naranja.', en: 'Violet and orange energy.' }, price: 0, color: '#f97316', rarity: 'starter' },
  { id: 'aura-green-malware', slot: 'aura', name: { es: 'Malware Verde', en: 'Green Malware' }, detail: { es: 'Código corrupto del Green Node.', en: 'Corrupted Green Node code.' }, price: 240, color: '#32ff8a', rarity: 'rare' },
  { id: 'accessory-visor-zero', slot: 'accessory', name: { es: 'Visor Zero', en: 'Zero Visor' }, detail: { es: 'HUD cian para leer la ciudad.', en: 'Cyan HUD for reading the city.' }, price: 90, color: '#22d3ee', rarity: 'rare' },
  { id: 'accessory-demon-horns', slot: 'accessory', name: { es: 'Cuernos Wisp', en: 'Wisp Horns' }, detail: { es: 'Señal demonio-malware.', en: 'Demon-malware signal.' }, price: 260, color: '#32ff8a', rarity: 'epic' },
]

const defaultAvatar: AvatarState = {
  skin: '#c98f68',
  hair: 'spikes',
  outfit: 'outfit-nexus-runner',
  aura: 'aura-neon-pulse',
  accessory: 'none',
  owned: ['outfit-nexus-runner', 'aura-neon-pulse'],
  spent: 0,
}

const districts = [
  { id: 'lobby', glyph: '中央', tone: '#f97316', es: 'Plaza Nexus', en: 'Nexus Plaza', room: 'general', detailEs: 'Encuentros, anuncios y nuevos exploradores.', detailEn: 'Meetups, announcements and new explorers.' },
  { id: 'gaming', glyph: '遊戯', tone: '#a855f7', es: 'Gaming District', en: 'Gaming District', room: 'gaming', detailEs: 'Parties, builds, directos y desafíos.', detailEn: 'Parties, builds, streams and challenges.' },
  { id: 'science', glyph: '未来', tone: '#22d3ee', es: 'Future Lab', en: 'Future Lab', room: 'science', detailEs: 'Proyectos, IA, gadgets y aprendizaje.', detailEn: 'Projects, AI, gadgets and learning.' },
  { id: 'fun', glyph: '笑街', tone: '#fb923c', es: 'Chaos Alley', en: 'Chaos Alley', room: 'fun', detailEs: 'Memes, eventos y duelos absurdos.', detailEn: 'Memes, events and absurd battles.' },
]

const cityCopy = {
  es: {
    seoTitle: 'Nexus City · Mundo social',
    seoDescription: 'Creá tu avatar XETHKIOZ, explorá distritos, reunite con la comunidad y desbloqueá cosméticos con tu actividad.',
    heroKicker: 'NEXUS CITY // MUNDO VIVO 03',
    heroTitle: 'Tu identidad entra al mundo.',
    heroText: 'Un lobby social propio de XETHKIOZ: avatar, distritos, chat, progresión e inventario. No es otra red social; es el punto humano de la Red de Portales.',
    enterAtrium: 'ENTRAR AL ATRIO VIVO',
    createAvatar: 'CREAR AVATAR',
    openCapsule: 'ABRIR MI CÁPSULA',
    online: 'EN LÍNEA',
    worldStatus: 'ESTADO DEL MUNDO // ALPHA',
    atriumEyebrow: 'MUNDO OFICIAL // SIEMPRE ABIERTO',
    atriumTitle: 'El Atrio ya está encendido.',
    atriumText: 'Entrá sin crear una cápsula. Mové tu avatar, activá objetos, hacé gestos y conversá con quienes estén conectados.',
    crossThreshold: 'CRUZAR EL UMBRAL',
    liveSignal: 'SEÑAL ACTIVA',
    avatarPreview: 'Vista previa del avatar XETHKIOZ',
    playerId: 'ID_JUGADOR',
    guest: 'EXPLORADOR_INVITADO',
    shards: 'FRAGMENTOS NEXUS',
    avatarEyebrow: 'LAB_AVATAR // FORJA DE IDENTIDAD',
    avatarTitle: 'Construí tu versión del Nexus',
    skin: 'Piel',
    hair: 'Cabello',
    skinOption: 'Tono de piel',
    hairNames: { spikes: 'Puntas', wave: 'Ondulado', cyber: 'Cyber' } as Record<string, string>,
    rarity: { starter: 'inicial', rare: 'raro', epic: 'épico' } as Record<CosmeticRarity, string>,
    slots: { outfit: 'atuendo', aura: 'aura', accessory: 'accesorio' } as Record<CosmeticSlot, string>,
    equipped: 'EQUIPADO',
    equip: 'EQUIPAR',
    connect: 'CONECTAR CUENTA PARA GUARDAR',
    mapEyebrow: 'MAPA_MUNDO // RED NEÓN TOKIO',
    mapTitle: 'Elegí dónde aparecer',
    mapText: 'Cada distrito conserva su identidad, pero comparte avatar, actividad, chat y reputación.',
    room: 'SALA',
    enterRoom: 'ENTRAR A LA SALA',
    roadmapEyebrow: 'ECONOMÍA SEGURA // DESPLIEGUE POR FASES',
    roadmapTitle: 'Primero comunidad. Después comercio.',
    roadmapText: 'Esta Alpha usa Nexus Shards obtenidos por actividad. Los pagos con dinero real permanecerán desactivados hasta incorporar moderación 24/7, controles de edad, términos, reembolsos y protección antifraude.',
    roadmap: ['Avatar e inventario', 'Pasaporte y cápsula', 'Contactos y seguridad', 'Tienda segura'],
    states: ['ACTIVO', 'ACTIVO', 'BETA', 'BLOQUEADO'],
  },
  en: {
    seoTitle: 'Nexus City · Social world',
    seoDescription: 'Create your XETHKIOZ avatar, explore districts, meet the community and unlock cosmetics through activity.',
    heroKicker: 'NEXUS CITY // LIVING WORLD 03',
    heroTitle: 'Your identity enters the world.',
    heroText: 'A XETHKIOZ social lobby with avatars, districts, chat, progression and inventory. Not another social network: the human hub of the Portal Network.',
    enterAtrium: 'ENTER THE LIVE ATRIUM',
    createAvatar: 'CREATE AVATAR',
    openCapsule: 'OPEN MY CAPSULE',
    online: 'ONLINE',
    worldStatus: 'WORLD STATUS // ALPHA',
    atriumEyebrow: 'OFFICIAL WORLD // ALWAYS OPEN',
    atriumTitle: 'The Atrium is already online.',
    atriumText: 'Enter without creating a capsule. Move your avatar, activate objects, use gestures and chat with whoever is online.',
    crossThreshold: 'CROSS THE THRESHOLD',
    liveSignal: 'LIVE SIGNAL',
    avatarPreview: 'XETHKIOZ avatar preview',
    playerId: 'PLAYER_ID',
    guest: 'GUEST_EXPLORER',
    shards: 'NEXUS SHARDS',
    avatarEyebrow: 'AVATAR_LAB // IDENTITY FORGE',
    avatarTitle: 'Build your Nexus self',
    skin: 'Skin',
    hair: 'Hair',
    skinOption: 'Skin tone',
    hairNames: { spikes: 'Spikes', wave: 'Wave', cyber: 'Cyber' } as Record<string, string>,
    rarity: { starter: 'starter', rare: 'rare', epic: 'epic' } as Record<CosmeticRarity, string>,
    slots: { outfit: 'outfit', aura: 'aura', accessory: 'accessory' } as Record<CosmeticSlot, string>,
    equipped: 'EQUIPPED',
    equip: 'EQUIP',
    connect: 'CONNECT ACCOUNT TO SAVE',
    mapEyebrow: 'WORLD MAP // TOKYO NEON NETWORK',
    mapTitle: 'Choose where to spawn',
    mapText: 'Every district keeps its identity while sharing avatars, activity, chat and reputation.',
    room: 'ROOM',
    enterRoom: 'ENTER ROOM',
    roadmapEyebrow: 'SAFE ECONOMY // PHASED RELEASE',
    roadmapTitle: 'Community first. Commerce later.',
    roadmapText: 'This Alpha uses Nexus Shards earned through activity. Real-money payments stay disabled until 24/7 moderation, age controls, terms, refunds and anti-fraud protections are ready.',
    roadmap: ['Avatar and inventory', 'Passport and capsule', 'Contacts and safety', 'Safe store'],
    states: ['ACTIVE', 'ACTIVE', 'BETA', 'LOCKED'],
  },
} as const

function readAvatar(): AvatarState {
  if (typeof window === 'undefined') return defaultAvatar
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
    return { ...defaultAvatar, ...stored, owned: Array.isArray(stored.owned) ? stored.owned : defaultAvatar.owned }
  } catch {
    return defaultAvatar
  }
}

export default function NexusCity() {
  const { lang } = useLang()
  const t = cityCopy[lang]
  const { account } = useHud()
  const location = useLocation()
  const presence = usePresence(location.pathname, 'nexus-city')
  const [avatar, setAvatar] = useState<AvatarState>(readAvatar)
  const [cloudReady, setCloudReady] = useState(false)
  const [notice, setNotice] = useState('')
  const xp = getWispProgress().xp
  const totalShards = 250 + Math.floor(xp / 5)
  const balance = Math.max(0, totalShards - avatar.spent)
  const isConnected = account.status === 'connected'
  const selected = useMemo(() => Object.fromEntries(cosmetics.map((item) => [item.id, item])), [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(avatar))
  }, [avatar])

  useEffect(() => {
    if (!isConnected || !account.userId || !isSupabaseConfigured) {
      setCloudReady(false)
      return
    }
    let active = true
    supabase.from('nexus_avatar_profiles').select('state').eq('user_id', account.userId).maybeSingle().then(({ data, error }) => {
      if (!active) return
      const remoteState = data?.state
      if (!error && remoteState && typeof remoteState === 'object') setAvatar((current) => ({ ...current, ...(remoteState as Partial<AvatarState>) }))
      setCloudReady(!error)
    })
    return () => { active = false }
  }, [account.userId, isConnected])

  useEffect(() => {
    if (!cloudReady || !account.userId || !isConnected || !isSupabaseConfigured) return
    const timer = window.setTimeout(() => {
      void supabase.from('nexus_avatar_profiles').upsert({ user_id: account.userId, state: avatar, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    }, 450)
    return () => window.clearTimeout(timer)
  }, [account.userId, avatar, cloudReady, isConnected])

  useEffect(() => {
    const day = new Date().toISOString().slice(0, 10)
    const key = `xethkioz.nexus-city.visit.${day}`
    if (window.localStorage.getItem(key)) return
    window.localStorage.setItem(key, '1')
    addWispXp(15, 'portal', '/nexus-city')
  }, [])

  const equip = (item: Cosmetic) => {
    if (!avatar.owned.includes(item.id)) return
    setAvatar((current) => ({ ...current, [item.slot]: item.id }))
    setNotice(lang === 'es' ? `${item.name.es} equipado.` : `${item.name.en} equipped.`)
  }

  const acquire = (item: Cosmetic) => {
    if (!isConnected) {
      setNotice(lang === 'es' ? 'Iniciá sesión para conservar inventario y canjes.' : 'Sign in to keep inventory and redemptions.')
      return
    }
    if (avatar.owned.includes(item.id)) return equip(item)
    if (balance < item.price) {
      setNotice(lang === 'es' ? 'Todavía no tenés suficientes Nexus Shards.' : 'You do not have enough Nexus Shards yet.')
      return
    }
    setAvatar((current) => ({ ...current, owned: [...current.owned, item.id], spent: current.spent + item.price, [item.slot]: item.id }))
    addWispXp(5, 'mission', `/nexus-city#cosmetic-${item.id}`)
    setNotice(lang === 'es' ? `${item.name.es} desbloqueado.` : `${item.name.en} unlocked.`)
  }

  const openRoom = (room: string) => {
    window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room } }))
    addWispXp(2, 'mission', `/nexus-city#room-${room}`)
  }

  const outfit = selected[avatar.outfit]
  const aura = selected[avatar.aura]
  const accessory = selected[avatar.accessory]
  const avatarStyle = {
    '--avatar-skin': avatar.skin,
    '--avatar-outfit': outfit?.color || '#8b5cf6',
    '--avatar-aura': aura?.color || '#f97316',
    '--avatar-accessory': accessory?.color || '#22d3ee',
  } as CSSProperties

  return (
    <>
      <SEO title={t.seoTitle} description={t.seoDescription} url="/nexus-city" tags={['virtual world', 'gaming community', 'avatars', 'Nexus City', 'XETHKIOZ']} />
      <main className="xk-city-page">
        <section className="xk-city-hero" aria-labelledby="nexus-city-title">
          <div className="xk-city-grid" aria-hidden="true" />
          <div className="xk-city-hero-copy">
            <p>{t.heroKicker}</p>
            <h1 id="nexus-city-title">{t.heroTitle}</h1>
            <span>{t.heroText}</span>
            <div><Link to="/nexus-city/room/xethkioz">{t.enterAtrium} ↗</Link><a href="#avatar-lab">{t.createAvatar} ↓</a><a href="#social-loop">{t.openCapsule} ↓</a></div>
          </div>
          <div className="xk-city-signal" aria-label={`${presence.onlineTotal} ${t.online}`}><i aria-hidden="true" /><span>{presence.onlineTotal} {t.online}</span><b>{t.worldStatus}</b></div>
        </section>

        <UniverseTransitRail />

        <section className="xk-city-atrium" aria-labelledby="atrium-title">
          <div><p>{t.atriumEyebrow}</p><h2 id="atrium-title">{t.atriumTitle}</h2><span>{t.atriumText}</span><Link to="/nexus-city/room/xethkioz">{t.crossThreshold} →</Link></div>
          <div className="xk-atrium-preview" aria-hidden="true"><i className="is-arcade">▣</i><i className="is-console">⌁</i><i className="is-plant">♧</i><i className="is-portal">◉</i><b>中央</b><span>{t.liveSignal}</span></div>
        </section>

        <section id="avatar-lab" className="xk-avatar-lab" aria-labelledby="avatar-lab-title">
          <div className="xk-avatar-stage" style={avatarStyle}>
            <div className={`xk-avatar xk-hair-${avatar.hair}`} role="img" aria-label={t.avatarPreview}>
              <i className="xk-avatar-aura" aria-hidden="true" /><i className="xk-avatar-shadow" aria-hidden="true" />
              <span className="xk-avatar-hair" aria-hidden="true" /><span className="xk-avatar-head" aria-hidden="true"><b /><b /><em /></span>
              <span className="xk-avatar-body" aria-hidden="true"><i /></span><span className="xk-avatar-legs" aria-hidden="true"><i /><i /></span>
              {avatar.accessory !== 'none' ? <span className={`xk-avatar-accessory ${avatar.accessory}`} aria-hidden="true" /> : null}
            </div>
            <div className="xk-avatar-id"><small>{t.playerId}</small><strong>{isConnected ? account.name : t.guest}</strong><span>{balance} ◈ {t.shards}</span></div>
          </div>

          <div className="xk-avatar-console">
            <p>{t.avatarEyebrow}</p>
            <h2 id="avatar-lab-title">{t.avatarTitle}</h2>
            <div className="xk-avatar-basics">
              <fieldset><legend>{t.skin}</legend>{['#f0c7a5', '#c98f68', '#8d5a3b', '#593622', '#8be9d4'].map((skin, index) => <button key={skin} type="button" aria-label={`${t.skinOption} ${index + 1}`} aria-pressed={avatar.skin === skin} onClick={() => setAvatar((current) => ({ ...current, skin }))} style={{ background: skin }} />)}</fieldset>
              <fieldset><legend>{t.hair}</legend>{['spikes', 'wave', 'cyber'].map((hair) => <button key={hair} type="button" aria-label={t.hairNames[hair]} aria-pressed={avatar.hair === hair} onClick={() => setAvatar((current) => ({ ...current, hair }))}>{t.hairNames[hair]}</button>)}</fieldset>
            </div>
            <div className="xk-cosmetic-grid">
              {cosmetics.map((item) => {
                const owned = avatar.owned.includes(item.id)
                const equipped = avatar[item.slot] === item.id
                return <article key={item.id} style={{ '--item-color': item.color } as CSSProperties}>
                  <small>{t.rarity[item.rarity]} // {t.slots[item.slot]}</small><h3>{item.name[lang]}</h3><p>{item.detail[lang]}</p>
                  <button type="button" onClick={() => owned ? equip(item) : acquire(item)} disabled={equipped}>{equipped ? t.equipped : owned ? t.equip : `${item.price} ◈`}</button>
                </article>
              })}
            </div>
            {notice ? <p className="xk-city-notice" role="status" aria-live="polite" aria-atomic="true">{notice}</p> : null}
            {!isConnected ? <Link className="xk-city-login" to="/account?mode=signin">{t.connect} →</Link> : null}
          </div>
        </section>

        <section className="xk-city-districts" aria-labelledby="districts-title">
          <div><p>{t.mapEyebrow}</p><h2 id="districts-title">{t.mapTitle}</h2><span>{t.mapText}</span></div>
          <div>{districts.map((district) => <article key={district.id} style={{ '--district': district.tone } as CSSProperties}><i aria-hidden="true">{district.glyph}</i><small>{t.room} // {district.id.toUpperCase()}</small><h3>{lang === 'es' ? district.es : district.en}</h3><p>{lang === 'es' ? district.detailEs : district.detailEn}</p><button type="button" onClick={() => openRoom(district.room)}>{t.enterRoom} ↗</button></article>)}</div>
        </section>

        <div id="social-loop"><NexusSocialLoop lang={lang} account={account} avatar={avatar} onNotice={setNotice} /></div>

        <section className="xk-city-roadmap" aria-labelledby="city-roadmap-title">
          <div><p>{t.roadmapEyebrow}</p><h2 id="city-roadmap-title">{t.roadmapTitle}</h2><span>{t.roadmapText}</span></div>
          <ol>{t.roadmap.map((step, index) => <li key={step}><b>0{index + 1}</b><span>{step}</span><strong>{t.states[index]}</strong></li>)}</ol>
        </section>
      </main>
    </>
  )
}
