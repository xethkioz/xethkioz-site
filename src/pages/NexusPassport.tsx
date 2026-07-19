import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { useHud } from '../lib/HudContext'
import { useLang } from '../lib/LangContext'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient'

type PassportRow = {
  user_id: string
  handle: string
  display_name: string
  bio: string
  status_text: string
  locale: string
  avatar_state: Record<string, unknown>
  updated_at: string
}

type PageState = 'loading' | 'ready' | 'missing'

const outfitColors: Record<string, string> = {
  'outfit-nexus-runner': '#8b5cf6',
  'outfit-cyber-ronin': '#22d3ee',
  'outfit-void-cultist': '#32ff8a',
}
const auraColors: Record<string, string> = { 'aura-neon-pulse': '#f97316', 'aura-green-malware': '#32ff8a' }

function safeHandle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24)
}

export default function NexusPassport() {
  const { handle = '' } = useParams()
  const { lang } = useLang()
  const { account } = useHud()
  const publicHandle = safeHandle(handle)
  const [profile, setProfile] = useState<PassportRow | null>(null)
  const [pageState, setPageState] = useState<PageState>('loading')
  const [notice, setNotice] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportCategory, setReportCategory] = useState('harassment')
  const [reportDetail, setReportDetail] = useState('')
  const connected = account.status === 'connected' && Boolean(account.userId)
  const isOwn = Boolean(profile && account.userId === profile.user_id)

  useEffect(() => {
    if (!publicHandle || !isSupabaseConfigured) {
      setPageState('missing')
      return
    }
    let active = true
    setPageState('loading')
    supabase.from('nexus_public_directory')
      .select('user_id,handle,display_name,bio,status_text,locale,avatar_state,updated_at')
      .eq('handle', publicHandle).maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error || !data) {
          setProfile(null)
          setPageState('missing')
          return
        }
        setProfile(data as PassportRow)
        setPageState('ready')
      })
    return () => { active = false }
  }, [publicHandle])

  const avatarStyle = useMemo(() => {
    const state = profile?.avatar_state || {}
    return {
      '--passport-skin': String(state.skin || '#c98f68'),
      '--passport-outfit': outfitColors[String(state.outfit)] || '#8b5cf6',
      '--passport-aura': auraColors[String(state.aura)] || '#f97316',
    } as CSSProperties
  }, [profile])

  const requireAccount = () => {
    if (connected && account.userId) return true
    setNotice(lang === 'es' ? 'Iniciá sesión para usar las funciones sociales.' : 'Sign in to use social features.')
    return false
  }

  const requestContact = async () => {
    if (!profile || isOwn || !requireAccount() || !account.userId) return
    const { error } = await supabase.from('nexus_relationships').upsert({ requester_id: account.userId, addressee_id: profile.user_id, status: 'pending', updated_at: new Date().toISOString() }, { onConflict: 'requester_id,addressee_id' })
    setNotice(error ? (lang === 'es' ? 'No se pudo enviar la señal.' : 'Could not send the signal.') : (lang === 'es' ? 'Solicitud de contacto enviada.' : 'Contact request sent.'))
  }

  const blockExplorer = async () => {
    if (!profile || isOwn || !requireAccount() || !account.userId) return
    const { error } = await supabase.from('nexus_relationships').upsert({ requester_id: account.userId, addressee_id: profile.user_id, status: 'blocked', updated_at: new Date().toISOString() }, { onConflict: 'requester_id,addressee_id' })
    setNotice(error ? (lang === 'es' ? 'No se pudo aplicar el bloqueo.' : 'Could not apply the block.') : (lang === 'es' ? 'Explorador bloqueado. No recibirá señales tuyas.' : 'Explorer blocked. They will not receive your signals.'))
  }

  const sendReport = async () => {
    if (!profile || isOwn || !requireAccount() || !account.userId) return
    const detail = reportDetail.trim()
    if (detail.length < 10) {
      setNotice(lang === 'es' ? 'Contanos qué ocurrió en al menos 10 caracteres.' : 'Tell us what happened in at least 10 characters.')
      return
    }
    const { error } = await supabase.from('nexus_safety_reports').insert({ reporter_id: account.userId, subject_user_id: profile.user_id, category: reportCategory, detail: detail.slice(0, 1200) })
    if (error) {
      setNotice(lang === 'es' ? 'No se pudo enviar el reporte.' : 'Could not send the report.')
      return
    }
    setReportDetail('')
    setReportOpen(false)
    setNotice(lang === 'es' ? 'Reporte privado enviado a moderación.' : 'Private report sent to moderation.')
  }

  const openChat = () => window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))

  if (pageState === 'loading') return <main className="xk-passport-page"><p className="xk-passport-loading">NEXUS // DECODING PASSPORT…</p></main>

  if (pageState === 'missing' || !profile) return <main className="xk-passport-page"><SEO title="Pasaporte no disponible" description="Este Pasaporte Nexus no existe o no es público." url={`/nexus-city/u/${publicHandle}`} /><section className="xk-passport-missing"><small>ERROR // SIGNAL_NOT_FOUND</small><h1>{lang === 'es' ? 'Esta señal no está disponible.' : 'This signal is unavailable.'}</h1><p>{lang === 'es' ? 'Puede ser privada, haber cambiado de identificador o todavía no existir.' : 'It may be private, renamed or not created yet.'}</p><Link to="/nexus-city">← NEXUS CITY</Link></section></main>

  return <main className="xk-passport-page" style={avatarStyle}>
    <SEO title={`${profile.display_name} · Pasaporte Nexus`} description={profile.status_text || profile.bio || `Pasaporte público de @${profile.handle} en Nexus City.`} url={`/nexus-city/u/${profile.handle}`} tags={['Nexus City', 'XETHKIOZ', 'avatar', profile.handle]} />
    <section className="xk-public-passport">
      <header><Link to="/nexus-city">← NEXUS CITY</Link><span>PUBLIC PASSPORT // VERIFIED ROUTE</span><b>{profile.locale.toUpperCase()}</b></header>
      <div className="xk-public-passport-grid">
        <div className="xk-public-avatar-stage">
          <div className="xk-public-avatar" aria-label={lang === 'es' ? `Avatar de ${profile.display_name}` : `${profile.display_name}'s avatar`}><i /><span /><b /><em /></div>
          <p><small>PLAYER SIGNAL</small><strong>@{profile.handle}</strong><span>{profile.status_text || 'NEXUS ONLINE'}</span></p>
        </div>
        <div className="xk-public-passport-copy">
          <small>IDENTITY // PUBLIC SIGNAL</small><h1>{profile.display_name}</h1><blockquote>{profile.bio || (lang === 'es' ? 'Este explorador todavía no escribió su historia.' : 'This explorer has not written their story yet.')}</blockquote>
          <dl><div><dt>{lang === 'es' ? 'Idioma' : 'Language'}</dt><dd>{profile.locale.toUpperCase()}</dd></div><div><dt>{lang === 'es' ? 'Última señal' : 'Last signal'}</dt><dd>{new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', { dateStyle: 'medium' }).format(new Date(profile.updated_at))}</dd></div><div><dt>{lang === 'es' ? 'Destino' : 'Destination'}</dt><dd>NEXUS CITY</dd></div></dl>
          <div className="xk-passport-actions"><Link to={`/nexus-city/room/${profile.handle}`}>{lang === 'es' ? 'VISITAR CÁPSULA' : 'VISIT CAPSULE'}</Link><button type="button" onClick={openChat}>{lang === 'es' ? 'ABRIR CHAT' : 'OPEN CHAT'}</button>{isOwn ? <Link to="/nexus-city#social-loop">{lang === 'es' ? 'EDITAR PASAPORTE' : 'EDIT PASSPORT'}</Link> : <><button type="button" onClick={requestContact}>+ {lang === 'es' ? 'CONECTAR' : 'CONNECT'}</button><button type="button" className="is-safety" onClick={() => setReportOpen((current) => !current)}>{lang === 'es' ? 'SEGURIDAD' : 'SAFETY'}</button></>}</div>
          {notice ? <p className="xk-passport-notice" role="status">{notice}</p> : null}
        </div>
      </div>

      {reportOpen && !isOwn ? <section className="xk-passport-safety" aria-labelledby="safety-title"><div><small>TRUST & SAFETY // PRIVATE CHANNEL</small><h2 id="safety-title">{lang === 'es' ? 'Protegé tu experiencia' : 'Protect your experience'}</h2><p>{lang === 'es' ? 'El reporte es privado. Incluí contexto concreto; no publiques datos personales.' : 'Reports are private. Add specific context; do not include personal information.'}</p></div><label>{lang === 'es' ? 'Motivo' : 'Reason'}<select value={reportCategory} onChange={(event) => setReportCategory(event.target.value)}><option value="harassment">HARASSMENT</option><option value="spam">SPAM</option><option value="unsafe-content">UNSAFE CONTENT</option><option value="impersonation">IMPERSONATION</option><option value="other">OTHER</option></select></label><label>{lang === 'es' ? 'Qué ocurrió' : 'What happened'}<textarea value={reportDetail} onChange={(event) => setReportDetail(event.target.value.slice(0, 1200))} maxLength={1200} /></label><div><button type="button" onClick={sendReport}>{lang === 'es' ? 'ENVIAR REPORTE PRIVADO' : 'SEND PRIVATE REPORT'}</button><button type="button" onClick={blockExplorer}>{lang === 'es' ? 'BLOQUEAR EXPLORADOR' : 'BLOCK EXPLORER'}</button></div></section> : null}
    </section>
  </main>
}
