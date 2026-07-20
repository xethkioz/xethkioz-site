import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { HudAccountState } from '../../lib/HudContext'
import { addWispXp } from '../../lib/realtimeCommunity'
import { isSupabaseConfigured, supabase } from '../../services/supabaseClient'

type Lang = 'es' | 'en'
type RoomTheme = 'violet' | 'cyan' | 'orange' | 'green'
type ProfileVisibility = 'public' | 'contacts' | 'private'
type RelationshipStatus = 'pending' | 'accepted' | 'blocked'

type PublicProfile = {
  user_id: string
  handle: string
  display_name: string
  bio: string
  status_text: string
  locale: string
  avatar_state: Record<string, unknown>
  updated_at: string
}

type RoomState = {
  theme: RoomTheme
  furniture: string[]
  access: 'open' | 'contacts' | 'private'
}

type DraftProfile = {
  handle: string
  displayName: string
  bio: string
  statusText: string
  visibility: ProfileVisibility
}

type RelationshipSignal = {
  id: string
  requester_id: string
  addressee_id: string
  status: RelationshipStatus
  peer?: Pick<PublicProfile, 'user_id' | 'handle' | 'display_name' | 'status_text'>
}

const PROFILE_STORAGE = 'xethkioz.nexus-city.passport.v1'
const ROOM_STORAGE = 'xethkioz.nexus-city.room.v1'
const SYSTEM_HANDLES = new Set(['xethkioz', 'nexus', 'admin', 'moderator', 'system'])
const themeColors: Record<RoomTheme, string> = { violet: '#8b5cf6', cyan: '#22d3ee', orange: '#f97316', green: '#32ff8a' }
const auraColors: Record<string, string> = { 'aura-neon-pulse': '#f97316', 'aura-green-malware': '#32ff8a' }
const furniture = [
  { id: 'arcade', glyph: '▣', es: 'Arcade maldita', en: 'Cursed arcade' },
  { id: 'console', glyph: '⌁', es: 'Consola Nexus', en: 'Nexus console' },
  { id: 'plant', glyph: '♧', es: 'Bio-neón', en: 'Bio-neon' },
  { id: 'portal', glyph: '◉', es: 'Mini portal', en: 'Mini portal' },
] as const

const socialCopy = {
  es: {
    fallbackHandle: 'explorador',
    fallbackName: 'Explorador',
    fallbackStatus: 'Recién llegado al Nexus.',
    headingEyebrow: 'BUCLE SOCIAL NEXUS // FASE 02',
    headingTitle: 'Tu lugar. Tu gente. Tu señal.',
    headingText: 'Personalizá una cápsula, publicá tu identidad y conectá con otros exploradores sin exponer correo ni datos privados.',
    passportEyebrow: 'PASAPORTE // IDENTIDAD PÚBLICA',
    passportTitle: 'Pasaporte Nexus',
    handle: 'Identificador público',
    displayName: 'Nombre visible',
    currentSignal: 'Señal actual',
    shortBio: 'Bio breve',
    visibility: 'Visibilidad',
    visibilityOptions: { public: 'Público', contacts: 'Contactos', private: 'Privado' } as Record<ProfileVisibility, string>,
    syncing: 'SINCRONIZANDO…',
    publish: 'PUBLICAR PASAPORTE',
    viewProfile: 'VER PERFIL',
    visitCapsule: 'VISITAR CÁPSULA',
    capsuleEyebrow: 'MI CÁPSULA // CONSTRUCTOR DE SALA',
    capsuleTitle: 'Cápsula personal',
    energy: 'Energía',
    objects: 'Objetos',
    access: 'Acceso',
    themes: { violet: 'Violeta', cyan: 'Cian', orange: 'Naranja', green: 'Verde' } as Record<RoomTheme, string>,
    accessOptions: { open: 'Abierto', contacts: 'Contactos', private: 'Privado' } as Record<RoomState['access'], string>,
    missionsEyebrow: 'BUCLE DIARIO // SEÑAL DE REGRESO',
    missionsTitle: 'Misiones de hoy',
    missions: ['Entrar a Nexus City', 'Sincronizar pasaporte o cápsula', 'Usar un emote en el chat'],
    emoteEyebrow: 'MAZO DE EMOTES // ACCIONES DE CHAT',
    emoteTitle: 'Entrá diciendo algo',
    emotes: ['👋 ¡Llegué al Nexus!', '⚔️ Busco party', '🧪 Tengo una idea', '😂 Modo caos activado', '👁️ Vi algo en Green Node', '🔥 GG'],
    directoryEyebrow: 'SEÑALES PÚBLICAS // DESCUBRIMIENTO',
    directoryTitle: 'Exploradores recientes',
    passport: 'PASAPORTE',
    capsule: 'CÁPSULA',
    connect: 'CONECTAR',
    directoryEmpty: 'La ciudad todavía está esperando sus primeros pasaportes públicos.',
    contactsEyebrow: 'CONSOLA DE CONTACTOS // CONSENTIMIENTO PRIMERO',
    contactsTitle: 'Señales y contactos',
    contactsText: 'Vos decidís quién entra a tu red. Podés aceptar, ignorar o bloquear sin exponer datos privados.',
    incoming: 'ENTRANTE',
    outgoing: 'SALIENTE',
    relationshipStatus: { pending: 'PENDIENTE', accepted: 'ACEPTADA', blocked: 'BLOQUEADA' } as Record<RelationshipStatus, string>,
    privateExplorer: 'Explorador privado',
    nonPublicPassport: 'Pasaporte no público',
    accept: 'ACEPTAR',
    disconnect: 'DESCONECTAR',
    ignore: 'IGNORAR',
    block: 'BLOQUEAR',
    signalsEmpty: 'Sin señales pendientes. Explorá pasaportes públicos para conectar.',
    contactNetworkUpdated: 'Red de contactos actualizada.',
  },
  en: {
    fallbackHandle: 'explorer',
    fallbackName: 'Explorer',
    fallbackStatus: 'New to the Nexus.',
    headingEyebrow: 'NEXUS SOCIAL LOOP // PHASE 02',
    headingTitle: 'Your place. Your people. Your signal.',
    headingText: 'Customize a capsule, publish your identity and connect with explorers without exposing email or private data.',
    passportEyebrow: 'PASSPORT // PUBLIC IDENTITY',
    passportTitle: 'Nexus Passport',
    handle: 'Public handle',
    displayName: 'Display name',
    currentSignal: 'Current signal',
    shortBio: 'Short bio',
    visibility: 'Visibility',
    visibilityOptions: { public: 'Public', contacts: 'Contacts', private: 'Private' } as Record<ProfileVisibility, string>,
    syncing: 'SYNCING…',
    publish: 'PUBLISH PASSPORT',
    viewProfile: 'VIEW PROFILE',
    visitCapsule: 'VISIT CAPSULE',
    capsuleEyebrow: 'MY CAPSULE // ROOM BUILDER',
    capsuleTitle: 'Personal capsule',
    energy: 'Energy',
    objects: 'Objects',
    access: 'Access',
    themes: { violet: 'Violet', cyan: 'Cyan', orange: 'Orange', green: 'Green' } as Record<RoomTheme, string>,
    accessOptions: { open: 'Open', contacts: 'Contacts', private: 'Private' } as Record<RoomState['access'], string>,
    missionsEyebrow: 'DAILY LOOP // RETURN SIGNAL',
    missionsTitle: 'Today’s missions',
    missions: ['Enter Nexus City', 'Sync passport or capsule', 'Use an emote in chat'],
    emoteEyebrow: 'EMOTE DECK // CHAT ACTIONS',
    emoteTitle: 'Enter with a signal',
    emotes: ['👋 I reached the Nexus!', '⚔️ Looking for a party', '🧪 I have an idea', '😂 Chaos mode enabled', '👁️ I saw something in Green Node', '🔥 GG'],
    directoryEyebrow: 'PUBLIC SIGNALS // DISCOVERY',
    directoryTitle: 'Recent explorers',
    passport: 'PASSPORT',
    capsule: 'CAPSULE',
    connect: 'CONNECT',
    directoryEmpty: 'The city is waiting for its first public passports.',
    contactsEyebrow: 'CONTACT CONSOLE // CONSENT FIRST',
    contactsTitle: 'Signals and contacts',
    contactsText: 'You decide who enters your network. Accept, ignore or block without exposing private data.',
    incoming: 'INCOMING',
    outgoing: 'OUTGOING',
    relationshipStatus: { pending: 'PENDING', accepted: 'ACCEPTED', blocked: 'BLOCKED' } as Record<RelationshipStatus, string>,
    privateExplorer: 'Private explorer',
    nonPublicPassport: 'Non-public passport',
    accept: 'ACCEPT',
    disconnect: 'DISCONNECT',
    ignore: 'IGNORE',
    block: 'BLOCK',
    signalsEmpty: 'No pending signals. Explore public passports to connect.',
    contactNetworkUpdated: 'Contact network updated.',
  },
} as const

function safeHandle(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_]/g, '').slice(0, 24)
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { return { ...fallback, ...JSON.parse(window.localStorage.getItem(key) || '{}') } }
  catch { return fallback }
}

export default function NexusSocialLoop({ lang, account, avatar, onNotice }: { lang: Lang; account: HudAccountState; avatar: Record<string, unknown>; onNotice: (message: string) => void }) {
  const t = socialCopy[lang]
  const connected = account.status === 'connected' && Boolean(account.userId)
  const initialHandle = safeHandle(account.name || '') || t.fallbackHandle
  const [profile, setProfile] = useState<DraftProfile>(() => readJson(PROFILE_STORAGE, { handle: initialHandle, displayName: account.name || t.fallbackName, bio: '', statusText: t.fallbackStatus, visibility: 'public' as const }))
  const [room, setRoom] = useState<RoomState>(() => readJson(ROOM_STORAGE, { theme: 'violet' as const, furniture: ['console'], access: 'open' as const }))
  const [directory, setDirectory] = useState<PublicProfile[]>([])
  const [saving, setSaving] = useState(false)
  const [savedToday, setSavedToday] = useState(false)
  const [chatUsed, setChatUsed] = useState(false)
  const [signals, setSignals] = useState<RelationshipSignal[]>([])
  const [relationshipRevision, setRelationshipRevision] = useState(0)

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE, JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    window.localStorage.setItem(ROOM_STORAGE, JSON.stringify(room))
  }, [room])

  useEffect(() => {
    if (!connected || !account.name) return
    setProfile((current) => {
      const defaultHandle = ['explorador', 'explorer'].includes(current.handle)
      const defaultName = ['Explorador', 'Explorer'].includes(current.displayName)
      return defaultHandle && defaultName
        ? { ...current, handle: safeHandle(account.name) || t.fallbackHandle, displayName: account.name }
        : current
    })
  }, [account.name, connected, t.fallbackHandle])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    supabase.from('nexus_public_directory')
      .select('user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at')
      .eq('visibility', 'public')
      .order('updated_at', { ascending: false }).limit(8)
      .then(({ data }) => { if (active && data) setDirectory(data as PublicProfile[]) })
    return () => { active = false }
  }, [savedToday])

  useEffect(() => {
    if (!connected || !account.userId || !isSupabaseConfigured) return
    let active = true
    Promise.all([
      supabase.from('nexus_public_profiles').select('handle,display_name,bio,status_text,visibility').eq('user_id', account.userId).maybeSingle(),
      supabase.from('nexus_rooms').select('room_state,access').eq('owner_id', account.userId).maybeSingle(),
    ]).then(([passportResult, roomResult]) => {
      if (!active) return
      if (passportResult.data) {
        const data = passportResult.data
        setProfile({ handle: data.handle, displayName: data.display_name, bio: data.bio || '', statusText: data.status_text || '', visibility: data.visibility })
      }
      if (roomResult.data?.room_state && typeof roomResult.data.room_state === 'object') {
        setRoom((current) => ({ ...current, ...(roomResult.data?.room_state as Partial<RoomState>), access: roomResult.data?.access as RoomState['access'] }))
      }
    })
    return () => { active = false }
  }, [account.userId, connected])

  useEffect(() => {
    if (!connected || !account.userId || !isSupabaseConfigured) {
      setSignals([])
      return
    }
    let active = true
    const loadSignals = async () => {
      const { data } = await supabase.from('nexus_relationships').select('id,requester_id,addressee_id,status').or(`requester_id.eq.${account.userId},addressee_id.eq.${account.userId}`).neq('status', 'blocked').order('updated_at', { ascending: false }).limit(24)
      if (!active || !data) return
      const peerIds = [...new Set(data.map((row) => row.requester_id === account.userId ? row.addressee_id : row.requester_id))]
      const profiles = peerIds.length ? await supabase.from('nexus_public_directory').select('user_id,handle,display_name,status_text').in('user_id', peerIds) : { data: [] }
      const byId = new Map((profiles.data || []).map((item) => [item.user_id, item]))
      setSignals(data.map((row) => ({ ...row, peer: byId.get(row.requester_id === account.userId ? row.addressee_id : row.requester_id) })) as RelationshipSignal[])
    }
    void loadSignals()
    return () => { active = false }
  }, [account.userId, connected, relationshipRevision])

  const completedMissions = useMemo(() => [true, savedToday, chatUsed], [savedToday, chatUsed])

  const savePassport = async () => {
    if (!connected || !account.userId || !isSupabaseConfigured) {
      onNotice(lang === 'es' ? 'Conectá tu cuenta para publicar el Pasaporte Nexus.' : 'Connect your account to publish your Nexus Passport.')
      return
    }
    const handle = safeHandle(profile.handle)
    if (handle.length < 3) {
      onNotice(lang === 'es' ? 'El identificador necesita al menos 3 caracteres.' : 'The handle needs at least 3 characters.')
      return
    }
    if (SYSTEM_HANDLES.has(handle)) {
      onNotice(lang === 'es' ? 'Ese identificador pertenece al sistema. Elegí uno personal.' : 'That handle belongs to the system. Choose a personal one.')
      return
    }
    setSaving(true)
    const now = new Date().toISOString()
    const { error } = await supabase.from('nexus_public_profiles').upsert({
      user_id: account.userId,
      handle,
      display_name: profile.displayName.trim().slice(0, 40) || account.name,
      bio: profile.bio.trim().slice(0, 280),
      status_text: profile.statusText.trim().slice(0, 80),
      locale: lang,
      visibility: profile.visibility,
      avatar_state: avatar,
      room_state: room,
      updated_at: now,
    }, { onConflict: 'user_id' })
    if (error) {
      setSaving(false)
      onNotice(error.code === '23505' ? (lang === 'es' ? 'Ese identificador ya está ocupado.' : 'That handle is already taken.') : (lang === 'es' ? 'No se pudo sincronizar el pasaporte.' : 'Could not sync the passport.'))
      return
    }
    const { error: roomError } = await supabase.from('nexus_rooms').upsert({
      owner_id: account.userId,
      room_state: { theme: room.theme, furniture: room.furniture },
      access: room.access,
      updated_at: now,
    }, { onConflict: 'owner_id' })
    setSaving(false)
    if (roomError) {
      onNotice(lang === 'es' ? 'El pasaporte se guardó, pero la cápsula no pudo sincronizarse.' : 'The passport was saved, but the capsule could not sync.')
      return
    }
    setProfile((current) => ({ ...current, handle }))
    setSavedToday(true)
    addWispXp(20, 'mission', '/nexus-city#passport')
    onNotice(lang === 'es' ? 'Pasaporte y cápsula sincronizados.' : 'Passport and capsule synchronized.')
  }

  const requestContact = async (target: PublicProfile) => {
    if (!connected || !account.userId) {
      onNotice(lang === 'es' ? 'Iniciá sesión para conectar con exploradores.' : 'Sign in to connect with explorers.')
      return
    }
    if (target.user_id === account.userId) return
    const { error } = await supabase.from('nexus_relationships').upsert({ requester_id: account.userId, addressee_id: target.user_id, status: 'pending', updated_at: new Date().toISOString() }, { onConflict: 'requester_id,addressee_id' })
    if (!error) setRelationshipRevision((current) => current + 1)
    onNotice(error ? (lang === 'es' ? 'No se pudo enviar la señal.' : 'Could not send the signal.') : (lang === 'es' ? `Señal enviada a ${target.display_name}.` : `Signal sent to ${target.display_name}.`))
  }

  const updateSignal = async (signal: RelationshipSignal, action: 'accepted' | 'blocked' | 'delete') => {
    const request = action === 'delete'
      ? supabase.from('nexus_relationships').delete().eq('id', signal.id)
      : supabase.from('nexus_relationships').update({ status: action, updated_at: new Date().toISOString() }).eq('id', signal.id)
    const { error } = await request
    if (!error) setRelationshipRevision((current) => current + 1)
    onNotice(error ? (lang === 'es' ? 'No se pudo actualizar la señal.' : 'Could not update the signal.') : t.contactNetworkUpdated)
  }

  const useEmote = (emote: string) => {
    setChatUsed(true)
    window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general', draft: emote } }))
    addWispXp(3, 'mission', '/nexus-city#emote')
  }

  const toggleFurniture = (id: string) => setRoom((current) => ({ ...current, furniture: current.furniture.includes(id) ? current.furniture.filter((item) => item !== id) : [...current.furniture, id].slice(-4) }))

  return <section className="xk-social-loop" aria-labelledby="social-loop-title">
    <div className="xk-social-heading"><p>{t.headingEyebrow}</p><h2 id="social-loop-title">{t.headingTitle}</h2><span>{t.headingText}</span></div>

    <div className="xk-social-grid">
      <article className="xk-passport-editor" aria-busy={saving}>
        <small>{t.passportEyebrow}</small><h3>{t.passportTitle}</h3>
        <label>{t.handle}<span aria-hidden="true">@</span><input value={profile.handle} onChange={(event) => setProfile((current) => ({ ...current, handle: safeHandle(event.target.value) }))} maxLength={24} autoComplete="username" /></label>
        <label>{t.displayName}<input value={profile.displayName} onChange={(event) => setProfile((current) => ({ ...current, displayName: event.target.value.slice(0, 40) }))} maxLength={40} /></label>
        <label>{t.currentSignal}<input value={profile.statusText} onChange={(event) => setProfile((current) => ({ ...current, statusText: event.target.value.slice(0, 80) }))} maxLength={80} /></label>
        <label>{t.shortBio}<textarea value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value.slice(0, 280) }))} maxLength={280} /></label>
        <label>{t.visibility}<select value={profile.visibility} onChange={(event) => setProfile((current) => ({ ...current, visibility: event.target.value as DraftProfile['visibility'] }))}>{(Object.keys(t.visibilityOptions) as ProfileVisibility[]).map((value) => <option key={value} value={value}>{t.visibilityOptions[value]}</option>)}</select></label>
        <div><button type="button" onClick={savePassport} disabled={saving}>{saving ? t.syncing : t.publish}</button>{connected && profile.handle ? <><Link to={`/nexus-city/u/${profile.handle}`}>{t.viewProfile} ↗</Link><Link to={`/nexus-city/room/${profile.handle}`}>{t.visitCapsule} ↗</Link></> : null}</div>
      </article>

      <article className={`xk-capsule xk-capsule-${room.theme}`}>
        <small>{t.capsuleEyebrow}</small><h3>{t.capsuleTitle}</h3>
        <div className="xk-capsule-room">{room.furniture.map((id) => { const item = furniture.find((entry) => entry.id === id); return item ? <i key={id} className={`is-${id}`} aria-hidden="true">{item.glyph}</i> : null })}<b aria-hidden="true">NX</b></div>
        <div className="xk-room-controls">
          <fieldset><legend>{t.energy}</legend>{(['violet', 'cyan', 'orange', 'green'] as RoomTheme[]).map((theme) => <button key={theme} type="button" aria-label={t.themes[theme]} aria-pressed={room.theme === theme} onClick={() => setRoom((current) => ({ ...current, theme }))} style={{ '--swatch': themeColors[theme] } as CSSProperties} />)}</fieldset>
          <fieldset><legend>{t.objects}</legend>{furniture.map((item) => <button key={item.id} type="button" aria-pressed={room.furniture.includes(item.id)} onClick={() => toggleFurniture(item.id)}><span aria-hidden="true">{item.glyph}</span> {item[lang]}</button>)}</fieldset>
          <label>{t.access}<select value={room.access} onChange={(event) => setRoom((current) => ({ ...current, access: event.target.value as RoomState['access'] }))}>{(Object.keys(t.accessOptions) as RoomState['access'][]).map((value) => <option key={value} value={value}>{t.accessOptions[value]}</option>)}</select></label>
        </div>
      </article>
    </div>

    <div className="xk-social-secondary">
      <article className="xk-city-missions"><small>{t.missionsEyebrow}</small><h3>{t.missionsTitle}</h3>{t.missions.map((mission, index) => <p key={mission} className={completedMissions[index] ? 'is-done' : ''}><b aria-hidden="true">{completedMissions[index] ? '✓' : '○'}</b><span>{mission}</span><em>+{[15, 20, 3][index]} XP</em></p>)}</article>
      <article className="xk-emote-deck"><small>{t.emoteEyebrow}</small><h3>{t.emoteTitle}</h3><div>{t.emotes.map((emote) => <button type="button" key={emote} onClick={() => useEmote(emote)}>{emote}</button>)}</div></article>
    </div>

    <div className="xk-explorer-directory"><div><small>{t.directoryEyebrow}</small><h3>{t.directoryTitle}</h3></div>{directory.length ? <div>{directory.map((item) => <article key={item.user_id}><i aria-hidden="true" style={{ '--profile-aura': auraColors[String(item.avatar_state?.aura)] || '#8b5cf6' } as CSSProperties}>◎</i><small>@{item.handle}</small><h4>{item.display_name}</h4><p>{item.status_text || item.bio || 'NEXUS ONLINE'}</p><div><Link to={`/nexus-city/u/${item.handle}`}>{t.passport}</Link><Link to={`/nexus-city/room/${item.handle}`}>{t.capsule}</Link>{item.user_id !== account.userId ? <button type="button" onClick={() => requestContact(item)}>+ {t.connect}</button> : null}</div></article>)}</div> : <p>{t.directoryEmpty}</p>}</div>

    {connected ? <div className="xk-signal-inbox"><div><small>{t.contactsEyebrow}</small><h3>{t.contactsTitle}</h3><p>{t.contactsText}</p></div>{signals.length ? <div>{signals.map((signal) => {
      const incoming = signal.addressee_id === account.userId
      const peerName = signal.peer?.display_name || t.privateExplorer
      return <article key={signal.id}><span aria-hidden="true">{signal.status === 'accepted' ? '◆' : '◇'}</span><div><small>{incoming ? t.incoming : t.outgoing} // {t.relationshipStatus[signal.status]}</small><h4>{peerName}</h4>{signal.peer ? <Link to={`/nexus-city/u/${signal.peer.handle}`}>@{signal.peer.handle}</Link> : <p>{t.nonPublicPassport}</p>}</div><div>{incoming && signal.status === 'pending' ? <button type="button" onClick={() => updateSignal(signal, 'accepted')}>{t.accept}</button> : null}<button type="button" onClick={() => updateSignal(signal, 'delete')}>{signal.status === 'accepted' ? t.disconnect : t.ignore}</button><button type="button" className="is-danger" onClick={() => updateSignal(signal, 'blocked')}>{t.block}</button></div></article>
    })}</div> : <p className="xk-signal-empty">{t.signalsEmpty}</p>}</div> : null}
  </section>
}
