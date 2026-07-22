import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { XethkiozAuthorizedSession } from '../../services/auth/authSchema'
import { isSupabaseConfigured, supabase } from '../../services/supabaseClient'

type Lang = 'es' | 'en'
type RelationshipRow = { requester_id: string; addressee_id: string }
type DirectoryRow = { user_id: string; handle: string; display_name: string }
type ConversationRow = { id: string; participant_a: string; participant_b: string; updated_at: string }
type DirectMessageRow = { id: string; conversation_id: string; sender_id: string; body: string; created_at: string }

const copy = {
  es: {
    title: 'Mensajes privados',
    intro: 'Solo entre contactos aceptados. La conversación no es visible para moderadores: al reportar, se envía únicamente una copia del mensaje señalado.',
    login: 'Iniciá sesión y publicá tu Pasaporte Nexus para usar mensajes privados.',
    empty: 'Todavía no tenés contactos aceptados. Conectá con alguien desde Nexus City.',
    select: 'Elegí un contacto para abrir la conversación.',
    placeholder: 'Mensaje privado…',
    send: 'Enviar',
    report: 'Reportar',
    confirm: '¿Reportar este mensaje? Se enviará una copia a moderación.',
    reported: 'Mensaje enviado a la cola privada de moderación.',
    error: 'No se pudo completar la acción. Revisá la conexión e intentá de nuevo.',
    loading: 'Sincronizando contactos…',
  },
  en: {
    title: 'Private messages',
    intro: 'Accepted contacts only. Moderators cannot browse the conversation: reporting sends only a copy of the selected message.',
    login: 'Sign in and publish your Nexus Passport to use private messages.',
    empty: 'You have no accepted contacts yet. Connect with someone in Nexus City.',
    select: 'Choose a contact to open the conversation.',
    placeholder: 'Private message…',
    send: 'Send',
    report: 'Report',
    confirm: 'Report this message? A copy will be sent to moderation.',
    reported: 'Message sent to the private moderation queue.',
    error: 'The action could not be completed. Check the connection and try again.',
    loading: 'Syncing contacts…',
  },
} as const

const cleanText = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 500)

function conversationPair(userId: string, peerId: string) {
  return userId < peerId ? { participant_a: userId, participant_b: peerId } : { participant_a: peerId, participant_b: userId }
}

export default function NexusDirectMessages({ lang, session }: { lang: Lang; session: XethkiozAuthorizedSession | null }) {
  const t = copy[lang]
  const userId = session?.userId
  const [contacts, setContacts] = useState<DirectoryRow[]>([])
  const [conversations, setConversations] = useState<ConversationRow[]>([])
  const [activePeerId, setActivePeerId] = useState('')
  const [activeConversationId, setActiveConversationId] = useState('')
  const [messages, setMessages] = useState<DirectMessageRow[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(Boolean(userId))
  const [notice, setNotice] = useState('')

  const activePeer = useMemo(() => contacts.find((contact) => contact.user_id === activePeerId), [activePeerId, contacts])

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    void (async () => {
      const [relationshipResult, conversationResult] = await Promise.all([
        supabase.from('nexus_relationships').select('requester_id,addressee_id').eq('status', 'accepted').or(`requester_id.eq.${userId},addressee_id.eq.${userId}`),
        supabase.from('nexus_direct_conversations').select('id,participant_a,participant_b,updated_at').or(`participant_a.eq.${userId},participant_b.eq.${userId}`).order('updated_at', { ascending: false }),
      ])
      if (!active) return
      if (relationshipResult.error || conversationResult.error) {
        setNotice(t.error)
        setLoading(false)
        return
      }
      const relationships = (relationshipResult.data ?? []) as RelationshipRow[]
      const peerIds = relationships.map((row) => row.requester_id === userId ? row.addressee_id : row.requester_id)
      if (peerIds.length) {
        const profileResult = await supabase.from('nexus_public_directory').select('user_id,handle,display_name').in('user_id', peerIds)
        if (active && !profileResult.error) setContacts((profileResult.data ?? []) as DirectoryRow[])
      } else {
        setContacts([])
      }
      setConversations((conversationResult.data ?? []) as ConversationRow[])
      setLoading(false)
    })()
    return () => { active = false }
  }, [t.error, userId])

  useEffect(() => {
    if (!activeConversationId || !isSupabaseConfigured) {
      setMessages([])
      return
    }
    let active = true
    void supabase.from('nexus_direct_messages').select('id,conversation_id,sender_id,body,created_at').eq('conversation_id', activeConversationId).order('created_at', { ascending: true }).limit(100).then(({ data, error }) => {
      if (!active) return
      if (error) setNotice(t.error)
      else setMessages((data ?? []) as DirectMessageRow[])
    })
    const channel = supabase.channel(`nexus-dm-${activeConversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'nexus_direct_messages', filter: `conversation_id=eq.${activeConversationId}` }, ({ new: row }) => {
        const message = row as DirectMessageRow
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message].slice(-100))
      })
      .subscribe()
    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [activeConversationId, t.error])

  const openConversation = async (peerId: string) => {
    if (!userId) return
    setActivePeerId(peerId)
    setNotice('')
    const existing = conversations.find((conversation) => conversation.participant_a === peerId || conversation.participant_b === peerId)
    if (existing) {
      setActiveConversationId(existing.id)
      return
    }
    const pair = conversationPair(userId, peerId)
    const insertResult = await supabase.from('nexus_direct_conversations').insert(pair).select('id,participant_a,participant_b,updated_at').maybeSingle()
    if (!insertResult.error && insertResult.data) {
      const conversation = insertResult.data as ConversationRow
      setConversations((current) => [conversation, ...current])
      setActiveConversationId(conversation.id)
      return
    }
    const retry = await supabase.from('nexus_direct_conversations').select('id,participant_a,participant_b,updated_at').eq('participant_a', pair.participant_a).eq('participant_b', pair.participant_b).maybeSingle()
    if (retry.error || !retry.data) setNotice(t.error)
    else setActiveConversationId((retry.data as ConversationRow).id)
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = cleanText(draft)
    if (!body || !userId || !activeConversationId) return
    setDraft('')
    const { error } = await supabase.from('nexus_direct_messages').insert({ conversation_id: activeConversationId, sender_id: userId, body })
    if (error) {
      setDraft(body)
      setNotice(t.error)
    }
  }

  const reportMessage = async (message: DirectMessageRow) => {
    if (!userId || !activePeerId || !window.confirm(t.confirm)) return
    const { error } = await supabase.from('nexus_safety_reports').insert({
      reporter_id: userId,
      subject_user_id: message.sender_id,
      category: 'harassment',
      detail: `Mensaje privado reportado en conversación ${activeConversationId.slice(0, 8)}.`,
      direct_message_id: message.id,
      evidence_snapshot: message.body,
    })
    setNotice(error ? t.error : t.reported)
  }

  if (!userId) return <div className="rounded-2xl border border-violet-400/25 bg-violet-500/[.06] p-4 text-xs leading-5 text-violet-100/80"><b className="block text-white">{t.title}</b><span>{t.login}</span></div>

  return <section className="grid gap-3" aria-label={t.title}>
    <p className="rounded-xl border border-white/10 bg-black/30 p-3 text-[10px] leading-4 text-white/55">{t.intro}</p>
    {notice ? <p className="rounded-xl border border-orange-300/25 bg-orange-400/10 p-3 text-[10px] text-orange-100" role="status">{notice}</p> : null}
    {loading ? <p className="p-4 text-center text-xs text-white/50">{t.loading}</p> : null}
    {!loading && contacts.length === 0 ? <p className="p-4 text-center text-xs text-white/50">{t.empty}</p> : null}
    {contacts.length ? <div className="flex gap-2 overflow-x-auto pb-1" aria-label={t.title}>{contacts.map((contact) => <button key={contact.user_id} type="button" onClick={() => void openConversation(contact.user_id)} aria-pressed={activePeerId === contact.user_id} className={`shrink-0 rounded-xl border px-3 py-2 text-left text-[10px] ${activePeerId === contact.user_id ? 'border-cyan-300 bg-cyan-400/10 text-white' : 'border-white/10 text-white/60'}`}><b className="block">{contact.display_name}</b><span>@{contact.handle}</span></button>)}</div> : null}
    {!activeConversationId && contacts.length ? <p className="p-4 text-center text-xs text-white/45">{t.select}</p> : null}
    {activeConversationId ? <>
      <div className="max-h-[290px] min-h-40 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-black/35 p-3" aria-live="polite">
        {messages.map((message) => <article key={message.id} className={`rounded-xl border p-3 ${message.sender_id === userId ? 'ml-8 border-violet-400/25 bg-violet-500/10' : 'mr-8 border-cyan-400/20 bg-cyan-500/[.06]'}`}><div className="flex items-start justify-between gap-3"><b className="text-[10px] text-white/65">{message.sender_id === userId ? (session?.email?.split('@')[0] || 'YO') : activePeer?.display_name || 'CONTACTO'}</b>{message.sender_id !== userId ? <button type="button" onClick={() => void reportMessage(message)} className="text-[9px] uppercase text-rose-300/70 hover:text-rose-200">{t.report}</button> : null}</div><p className="mt-2 break-words text-xs leading-5">{message.body}</p></article>)}
      </div>
      <form onSubmit={sendMessage} className="grid grid-cols-[1fr_auto] gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} placeholder={t.placeholder} className="rounded-xl border border-white/10 bg-black/55 px-3 py-3 text-xs outline-none focus:border-cyan-300" /><button type="submit" className="rounded-xl border border-cyan-300/35 bg-cyan-400/10 px-3 text-[10px] font-black uppercase text-cyan-100">{t.send}</button></form>
    </> : null}
  </section>
}
