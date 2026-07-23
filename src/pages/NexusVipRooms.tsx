import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'
import './NexusVipRooms.css'

type VipTheme = 'violet' | 'cyan' | 'orange' | 'green'
type VipRoom = {
  id: string
  owner_id: string
  codename: string
  theme: VipTheme
  status: 'active' | 'closed'
  expires_at: string
  created_at: string
}
type VipMember = {
  room_id: string
  user_id: string
  invited_by: string
  status: 'invited' | 'active' | 'declined'
  created_at: string
}
type VipMessage = {
  id: string
  room_id: string
  sender_id: string
  body: string
  created_at: string
}
type DirectoryProfile = { user_id: string; handle: string; display_name: string }
type Relationship = { requester_id: string; addressee_id: string }

const themes: VipTheme[] = ['violet', 'cyan', 'orange', 'green']
const roomWords = {
  es: {
    first: ['Cometa', 'Obsidiana', 'Neblina', 'Fénix', 'Eclipse', 'Wisp'],
    second: ['Silencioso', 'Violeta', 'Errante', 'Secreto', 'Nómada', 'Nocturno'],
  },
  en: {
    first: ['Comet', 'Obsidian', 'Mist', 'Phoenix', 'Eclipse', 'Wisp'],
    second: ['Silent', 'Violet', 'Wandering', 'Secret', 'Nomad', 'Nocturnal'],
  },
} as const

const copy = {
  es: {
    title: 'Salas VIP por invitación · Nexus City',
    description: 'Salas efímeras y privadas para contactos aceptados. Nadie entra sin una invitación y una aceptación explícita.',
    eyebrow: 'NEXUS CITY // CANAL PRIVADO',
    heading: 'Umbral VIP aleatorio',
    intro: 'Creá una sala con identidad aleatoria, invitá contactos verificados y conversá durante un máximo de siete días.',
    back: 'Volver a la Gran Sala',
    signinTitle: 'Necesitás una identidad Nexus',
    signinText: 'Las salas privadas no admiten visitantes anónimos. Iniciá sesión para crear, recibir o aceptar invitaciones.',
    signin: 'Iniciar sesión',
    create: 'Crear sala aleatoria',
    creating: 'Creando…',
    rooms: 'Tus salas',
    invitations: 'Invitaciones pendientes',
    emptyRooms: 'Todavía no tenés una sala activa.',
    emptyInvites: 'No hay invitaciones pendientes.',
    owner: 'Anfitrión',
    expires: 'Expira',
    enter: 'Entrar',
    close: 'Cerrar sala',
    accept: 'Aceptar',
    decline: 'Rechazar',
    invite: 'Invitar contacto',
    chooseContact: 'Elegí un contacto',
    noContacts: 'Primero necesitás un contacto aceptado en Nexus City.',
    inviteSent: 'Invitación enviada.',
    roomCreated: 'Sala privada creada.',
    roomClosed: 'Sala cerrada.',
    chat: 'Canal privado',
    chatEmpty: 'La sala está en silencio.',
    message: 'Mensaje',
    placeholder: 'Escribí una señal privada…',
    send: 'Enviar',
    members: 'Miembros',
    policyTitle: 'Privacidad, no privilegio',
    policyText: 'VIP significa acceso por invitación. No se vende la posibilidad de hablar; cualquier monetización futura se limitará a temas y cosméticos.',
    support: 'Apoyar el universo',
    unavailable: 'El servicio privado no está disponible.',
  },
  en: {
    title: 'Invite-only VIP rooms · Nexus City',
    description: 'Ephemeral private rooms for accepted contacts. Nobody enters without an invitation and explicit acceptance.',
    eyebrow: 'NEXUS CITY // PRIVATE CHANNEL',
    heading: 'Random VIP threshold',
    intro: 'Create a room with a random identity, invite verified contacts and talk for up to seven days.',
    back: 'Back to the Grand Hall',
    signinTitle: 'You need a Nexus identity',
    signinText: 'Private rooms do not accept anonymous visitors. Sign in to create, receive or accept invitations.',
    signin: 'Sign in',
    create: 'Create random room',
    creating: 'Creating…',
    rooms: 'Your rooms',
    invitations: 'Pending invitations',
    emptyRooms: 'You do not have an active room yet.',
    emptyInvites: 'There are no pending invitations.',
    owner: 'Host',
    expires: 'Expires',
    enter: 'Enter',
    close: 'Close room',
    accept: 'Accept',
    decline: 'Decline',
    invite: 'Invite contact',
    chooseContact: 'Choose a contact',
    noContacts: 'You need an accepted Nexus City contact first.',
    inviteSent: 'Invitation sent.',
    roomCreated: 'Private room created.',
    roomClosed: 'Room closed.',
    chat: 'Private channel',
    chatEmpty: 'The room is silent.',
    message: 'Message',
    placeholder: 'Write a private signal…',
    send: 'Send',
    members: 'Members',
    policyTitle: 'Privacy, not privilege',
    policyText: 'VIP means invite-only access. The ability to talk is not for sale; any future monetization will be limited to themes and cosmetics.',
    support: 'Support the universe',
    unavailable: 'The private service is unavailable.',
  },
} as const

function randomRoomName(lang: 'es' | 'en') {
  const words = roomWords[lang]
  const first = words.first[Math.floor(Math.random() * words.first.length)]
  const second = words.second[Math.floor(Math.random() * words.second.length)]
  return `${first} ${second}`
}

function formatDate(value: string, lang: 'es' | 'en') {
  const date = new Date(value)
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export default function NexusVipRooms() {
  const { lang } = useLang()
  const { account } = useHud()
  const t = copy[lang]
  const userId = account.userId
  const [rooms, setRooms] = useState<VipRoom[]>([])
  const [members, setMembers] = useState<VipMember[]>([])
  const [messages, setMessages] = useState<VipMessage[]>([])
  const [profiles, setProfiles] = useState<Record<string, DirectoryProfile>>({})
  const [contacts, setContacts] = useState<DirectoryProfile[]>([])
  const [activeRoomId, setActiveRoomId] = useState('')
  const [inviteContactId, setInviteContactId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(Boolean(userId))
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function loadLobby() {
    if (!userId || !isSupabaseConfigured) return
    setLoading(true)
    setError('')
    const [roomResult, memberResult, relationshipResult] = await Promise.all([
      supabase.from('nexus_vip_rooms').select('id,owner_id,codename,theme,status,expires_at,created_at').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('nexus_vip_room_members').select('room_id,user_id,invited_by,status,created_at').order('created_at', { ascending: false }),
      supabase.from('nexus_relationships').select('requester_id,addressee_id').eq('status', 'accepted').or(`requester_id.eq.${userId},addressee_id.eq.${userId}`),
    ])

    if (roomResult.error || memberResult.error || relationshipResult.error) {
      setError(t.unavailable)
      setLoading(false)
      return
    }

    const nextRooms = (roomResult.data ?? []) as VipRoom[]
    const nextMembers = (memberResult.data ?? []) as VipMember[]
    const relationships = (relationshipResult.data ?? []) as Relationship[]
    const contactIds = relationships.map((relation) => relation.requester_id === userId ? relation.addressee_id : relation.requester_id)
    const visibleIds = [...new Set([...nextRooms.map((room) => room.owner_id), ...nextMembers.map((member) => member.user_id), ...contactIds])]
    const profileResult = visibleIds.length
      ? await supabase.from('nexus_public_directory').select('user_id,handle,display_name').in('user_id', visibleIds)
      : { data: [], error: null }
    const nextProfiles = (profileResult.data ?? []) as DirectoryProfile[]

    setRooms(nextRooms)
    setMembers(nextMembers)
    setProfiles(Object.fromEntries(nextProfiles.map((profile) => [profile.user_id, profile])))
    setContacts(nextProfiles.filter((profile) => contactIds.includes(profile.user_id)))
    setActiveRoomId((current) => current && nextRooms.some((room) => room.id === current) ? current : '')
    setLoading(false)
  }

  useEffect(() => {
    void loadLobby()
    // Lobby reloads when the authenticated identity or language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, userId])

  const invitations = useMemo(
    () => members.filter((member) => member.user_id === userId && member.status === 'invited'),
    [members, userId],
  )
  const accessibleRooms = useMemo(
    () => rooms.filter((room) => room.owner_id === userId || members.some((member) => member.room_id === room.id && member.user_id === userId && member.status === 'active')),
    [members, rooms, userId],
  )
  const activeRoom = rooms.find((room) => room.id === activeRoomId) ?? null
  const activeMembers = members.filter((member) => member.room_id === activeRoomId && member.status === 'active')
  const ownedRooms = rooms.filter((room) => room.owner_id === userId)

  useEffect(() => {
    if (!activeRoomId || !userId) {
      setMessages([])
      return
    }
    let mounted = true
    void supabase.from('nexus_vip_messages').select('id,room_id,sender_id,body,created_at').eq('room_id', activeRoomId).order('created_at', { ascending: true }).limit(100).then(({ data, error: queryError }) => {
      if (!mounted) return
      if (queryError) setError(t.unavailable)
      else setMessages((data ?? []) as VipMessage[])
    })

    const channel = supabase.channel(`nexus-vip-room:${activeRoomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'nexus_vip_messages', filter: `room_id=eq.${activeRoomId}` }, ({ new: row }) => {
        const next = row as VipMessage
        setMessages((current) => current.some((item) => item.id === next.id) ? current : [...current.slice(-99), next])
      })
      .subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [activeRoomId, t.unavailable, userId])

  async function createRoom() {
    if (!userId || creating) return
    setCreating(true)
    setError('')
    setNotice('')
    const theme = themes[Math.floor(Math.random() * themes.length)]
    const { data, error: createError } = await supabase
      .from('nexus_vip_rooms')
      .insert({ owner_id: userId, codename: randomRoomName(lang), theme })
      .select('id,owner_id,codename,theme,status,expires_at,created_at')
      .single()
    if (createError || !data) setError(createError?.message || t.unavailable)
    else {
      setNotice(t.roomCreated)
      setActiveRoomId((data as VipRoom).id)
      await loadLobby()
    }
    setCreating(false)
  }

  async function respondInvitation(roomId: string, status: 'active' | 'declined') {
    if (!userId) return
    setError('')
    const { error: responseError } = await supabase
      .from('nexus_vip_room_members')
      .update({ status, responded_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .eq('status', 'invited')
    if (responseError) setError(responseError.message)
    else {
      if (status === 'active') setActiveRoomId(roomId)
      await loadLobby()
    }
  }

  async function inviteContact(roomId: string) {
    if (!userId || !inviteContactId) return
    setError('')
    setNotice('')
    const { error: inviteError } = await supabase.from('nexus_vip_room_members').insert({
      room_id: roomId,
      user_id: inviteContactId,
      invited_by: userId,
      status: 'invited',
    })
    if (inviteError) setError(inviteError.message)
    else {
      setNotice(t.inviteSent)
      setInviteContactId('')
      await loadLobby()
    }
  }

  async function closeRoom(roomId: string) {
    if (!userId) return
    const { error: closeError } = await supabase.from('nexus_vip_rooms').update({ status: 'closed', updated_at: new Date().toISOString() }).eq('id', roomId).eq('owner_id', userId)
    if (closeError) setError(closeError.message)
    else {
      setActiveRoomId('')
      setNotice(t.roomClosed)
      await loadLobby()
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = message.trim().slice(0, 280)
    if (!body || !userId || !activeRoomId) return
    setError('')
    const { error: sendError } = await supabase.from('nexus_vip_messages').insert({ room_id: activeRoomId, sender_id: userId, body })
    if (sendError) setError(sendError.message)
    else setMessage('')
  }

  return (
    <main className="xk-vip-page">
      <SEO title={t.title} description={t.description} url="/nexus-city/vip" />
      <header className="xk-vip-hero">
        <Link to="/nexus-city/room/xethkioz">← {t.back}</Link>
        <small>{t.eyebrow}</small>
        <h1>{t.heading}</h1>
        <p>{t.intro}</p>
      </header>

      {!userId ? (
        <section className="xk-vip-signin">
          <span aria-hidden="true">◆</span><h2>{t.signinTitle}</h2><p>{t.signinText}</p>
          <Link to="/account?mode=signin&redirect=%2Fnexus-city%2Fvip">{t.signin} →</Link>
        </section>
      ) : (
        <section className="xk-vip-layout" aria-busy={loading}>
          <aside className="xk-vip-lobby">
            <button type="button" onClick={() => void createRoom()} disabled={creating || ownedRooms.length >= 3}>{creating ? t.creating : `${t.create} (${ownedRooms.length}/3)`}</button>
            <div>
              <h2>{t.invitations}</h2>
              {invitations.length === 0 ? <p>{t.emptyInvites}</p> : invitations.map((invitation) => {
                const room = rooms.find((item) => item.id === invitation.room_id)
                if (!room) return null
                return (
                  <article key={`${invitation.room_id}-${invitation.user_id}`} className={`is-${room.theme}`}>
                    <strong>{room.codename}</strong>
                    <span>{t.owner}: {profiles[room.owner_id]?.display_name || 'Nexus'}</span>
                    <div><button type="button" onClick={() => void respondInvitation(room.id, 'active')}>{t.accept}</button><button type="button" onClick={() => void respondInvitation(room.id, 'declined')}>{t.decline}</button></div>
                  </article>
                )
              })}
            </div>
            <div>
              <h2>{t.rooms}</h2>
              {accessibleRooms.length === 0 ? <p>{t.emptyRooms}</p> : accessibleRooms.map((room) => (
                <article key={room.id} className={`is-${room.theme}${activeRoomId === room.id ? ' is-active' : ''}`}>
                  <strong>{room.codename}</strong>
                  <span>{t.expires}: {formatDate(room.expires_at, lang)}</span>
                  <div>
                    <button type="button" onClick={() => setActiveRoomId(room.id)}>{t.enter}</button>
                    {room.owner_id === userId ? <button type="button" onClick={() => void closeRoom(room.id)}>{t.close}</button> : null}
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <section className={`xk-vip-room${activeRoom ? ` is-${activeRoom.theme}` : ''}`}>
            {activeRoom ? (
              <>
                <header><small>PRIVATE_ROOM // {activeRoom.theme.toUpperCase()}</small><h2>{activeRoom.codename}</h2><span>{t.members}: {activeMembers.length + 1}</span></header>
                {activeRoom.owner_id === userId ? (
                  <div className="xk-vip-invite">
                    <select value={inviteContactId} onChange={(event) => setInviteContactId(event.target.value)} aria-label={t.chooseContact}>
                      <option value="">{contacts.length ? t.chooseContact : t.noContacts}</option>
                      {contacts.filter((contact) => !members.some((member) => member.room_id === activeRoom.id && member.user_id === contact.user_id && member.status !== 'declined')).map((contact) => <option key={contact.user_id} value={contact.user_id}>{contact.display_name} · @{contact.handle}</option>)}
                    </select>
                    <button type="button" disabled={!inviteContactId} onClick={() => void inviteContact(activeRoom.id)}>{t.invite}</button>
                  </div>
                ) : null}
                <div className="xk-vip-chat" aria-label={t.chat} aria-live="polite">
                  {messages.length === 0 ? <p>{t.chatEmpty}</p> : messages.map((item) => <article key={item.id}><strong>{item.sender_id === userId ? account.name : profiles[item.sender_id]?.display_name || 'Nexus'}</strong><p>{item.body}</p><time dateTime={item.created_at}>{formatDate(item.created_at, lang)}</time></article>)}
                </div>
                <form onSubmit={sendMessage}><label htmlFor="vip-message">{t.message}</label><div><input id="vip-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={280} placeholder={t.placeholder} /><button type="submit" disabled={!message.trim()}>{t.send}</button></div></form>
              </>
            ) : <div className="xk-vip-room-empty"><span aria-hidden="true">◇</span><p>{t.emptyRooms}</p></div>}
          </section>
        </section>
      )}

      {notice ? <p className="xk-vip-notice" role="status">{notice}</p> : null}
      {error ? <p className="xk-vip-error" role="alert">{error}</p> : null}
      <aside className="xk-vip-policy"><div><strong>{t.policyTitle}</strong><p>{t.policyText}</p></div><Link to="/support">{t.support} →</Link></aside>
    </main>
  )
}
