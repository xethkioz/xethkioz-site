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
type ReportCategory = 'harassment' | 'spam' | 'unsafe-content' | 'impersonation' | 'other'

const outfitColors: Record<string, string> = {
  'outfit-nexus-runner': '#8b5cf6',
  'outfit-cyber-ronin': '#22d3ee',
  'outfit-void-cultist': '#32ff8a',
}
const auraColors: Record<string, string> = { 'aura-neon-pulse': '#f97316', 'aura-green-malware': '#32ff8a' }

const copy = {
  es: {
    loading: 'NEXUS // DECODIFICANDO PASAPORTE…',
    missingTitle: 'Pasaporte no disponible',
    missingDescription: 'Este Pasaporte Nexus no existe o no es público.',
    missingCode: 'ERROR // SEÑAL_NO_ENCONTRADA',
    missingHeading: 'Esta señal no está disponible.',
    missingText: 'Puede ser privada, haber cambiado de identificador o todavía no existir.',
    passport: 'Pasaporte Nexus',
    publicDescription: 'Pasaporte público en Nexus City.',
    route: 'PASAPORTE PÚBLICO // RUTA VERIFICADA',
    playerSignal: 'SEÑAL DE JUGADOR',
    online: 'NEXUS EN LÍNEA',
    identity: 'IDENTIDAD // SEÑAL PÚBLICA',
    emptyBio: 'Este explorador todavía no escribió su historia.',
    language: 'Idioma',
    lastSignal: 'Última señal',
    destination: 'Destino',
    visitCapsule: 'VISITAR CÁPSULA',
    openChat: 'ABRIR CHAT',
    editPassport: 'EDITAR PASAPORTE',
    connect: 'CONECTAR',
    safety: 'SEGURIDAD',
    signInRequired: 'Iniciá sesión para usar las funciones sociales.',
    signalError: 'No se pudo enviar la señal.',
    signalSent: 'Solicitud de contacto enviada.',
    blockError: 'No se pudo aplicar el bloqueo.',
    blocked: 'Explorador bloqueado. No recibirá señales tuyas.',
    reportMin: 'Contanos qué ocurrió en al menos 10 caracteres.',
    reportError: 'No se pudo enviar el reporte.',
    reportSent: 'Reporte privado enviado a moderación.',
    safetyEyebrow: 'CONFIANZA Y SEGURIDAD // CANAL PRIVADO',
    safetyTitle: 'Protegé tu experiencia',
    safetyText: 'El reporte es privado. Incluí contexto concreto; no publiques datos personales.',
    reason: 'Motivo',
    detail: 'Qué ocurrió',
    detailPlaceholder: 'Describí el hecho concreto sin incluir datos personales.',
    sendReport: 'ENVIAR REPORTE PRIVADO',
    blockExplorer: 'BLOQUEAR EXPLORADOR',
    reportCategories: {
      harassment: 'Acoso',
      spam: 'Spam',
      'unsafe-content': 'Contenido inseguro',
      impersonation: 'Suplantación de identidad',
      other: 'Otro',
    } as Record<ReportCategory, string>,
    avatar: 'Avatar de',
  },
  en: {
    loading: 'NEXUS // DECODING PASSPORT…',
    missingTitle: 'Passport unavailable',
    missingDescription: 'This Nexus Passport does not exist or is not public.',
    missingCode: 'ERROR // SIGNAL_NOT_FOUND',
    missingHeading: 'This signal is unavailable.',
    missingText: 'It may be private, renamed or not created yet.',
    passport: 'Nexus Passport',
    publicDescription: 'Public passport in Nexus City.',
    route: 'PUBLIC PASSPORT // VERIFIED ROUTE',
    playerSignal: 'PLAYER SIGNAL',
    online: 'NEXUS ONLINE',
    identity: 'IDENTITY // PUBLIC SIGNAL',
    emptyBio: 'This explorer has not written their story yet.',
    language: 'Language',
    lastSignal: 'Last signal',
    destination: 'Destination',
    visitCapsule: 'VISIT CAPSULE',
    openChat: 'OPEN CHAT',
    editPassport: 'EDIT PASSPORT',
    connect: 'CONNECT',
    safety: 'SAFETY',
    signInRequired: 'Sign in to use social features.',
    signalError: 'Could not send the signal.',
    signalSent: 'Contact request sent.',
    blockError: 'Could not apply the block.',
    blocked: 'Explorer blocked. They will not receive your signals.',
    reportMin: 'Tell us what happened in at least 10 characters.',
    reportError: 'Could not send the report.',
    reportSent: 'Private report sent to moderation.',
    safetyEyebrow: 'TRUST & SAFETY // PRIVATE CHANNEL',
    safetyTitle: 'Protect your experience',
    safetyText: 'Reports are private. Add specific context and do not include personal information.',
    reason: 'Reason',
    detail: 'What happened',
    detailPlaceholder: 'Describe the specific event without including personal information.',
    sendReport: 'SEND PRIVATE REPORT',
    blockExplorer: 'BLOCK EXPLORER',
    reportCategories: {
      harassment: 'Harassment',
      spam: 'Spam',
      'unsafe-content': 'Unsafe content',
      impersonation: 'Impersonation',
      other: 'Other',
    } as Record<ReportCategory, string>,
    avatar: 'Avatar of',
  },
} as const

function safeHandle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24)
}

export default function NexusPassport() {
  const { handle = '' } = useParams()
  const { lang } = useLang()
  const t = copy[lang]
  const { account } = useHud()
  const publicHandle = safeHandle(handle)
  const [profile, setProfile] = useState<PassportRow | null>(null)
  const [pageState, setPageState] = useState<PageState>('loading')
  const [notice, setNotice] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportCategory, setReportCategory] = useState<ReportCategory>('harassment')
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
    setNotice(t.signInRequired)
    return false
  }

  const requestContact = async () => {
    if (!profile || isOwn || !requireAccount() || !account.userId) return
    const { error } = await supabase.from('nexus_relationships').upsert({ requester_id: account.userId, addressee_id: profile.user_id, status: 'pending', updated_at: new Date().toISOString() }, { onConflict: 'requester_id,addressee_id' })
    setNotice(error ? t.signalError : t.signalSent)
  }

  const blockExplorer = async () => {
    if (!profile || isOwn || !requireAccount() || !account.userId) return
    const { error } = await supabase.from('nexus_relationships').upsert({ requester_id: account.userId, addressee_id: profile.user_id, status: 'blocked', updated_at: new Date().toISOString() }, { onConflict: 'requester_id,addressee_id' })
    setNotice(error ? t.blockError : t.blocked)
  }

  const sendReport = async () => {
    if (!profile || isOwn || !requireAccount() || !account.userId) return
    const detail = reportDetail.trim()
    if (detail.length < 10) {
      setNotice(t.reportMin)
      return
    }
    const { error } = await supabase.from('nexus_safety_reports').insert({ reporter_id: account.userId, subject_user_id: profile.user_id, category: reportCategory, detail: detail.slice(0, 1200) })
    if (error) {
      setNotice(t.reportError)
      return
    }
    setReportDetail('')
    setReportOpen(false)
    setNotice(t.reportSent)
  }

  const openChat = () => window.dispatchEvent(new CustomEvent('xethkioz:nexus-chat-open', { detail: { room: 'general' } }))
  const locale = lang === 'es' ? 'es-AR' : 'en-US'

  if (pageState === 'loading') return <main className="xk-passport-page" aria-busy="true"><p className="xk-passport-loading" role="status" aria-live="polite">{t.loading}</p></main>

  if (pageState === 'missing' || !profile) return <main className="xk-passport-page"><SEO title={t.missingTitle} description={t.missingDescription} url={`/nexus-city/u/${publicHandle}`} /><section className="xk-passport-missing" aria-labelledby="passport-missing-title"><small>{t.missingCode}</small><h1 id="passport-missing-title">{t.missingHeading}</h1><p>{t.missingText}</p><Link to="/nexus-city">← NEXUS CITY</Link></section></main>

  const description = profile.status_text || profile.bio || `${t.publicDescription} @${profile.handle}`

  return <main className="xk-passport-page" style={avatarStyle}>
    <SEO title={`${profile.display_name} · ${t.passport}`} description={description} url={`/nexus-city/u/${profile.handle}`} tags={['Nexus City', 'XETHKIOZ', 'avatar', profile.handle]} />
    <section className="xk-public-passport" aria-labelledby="public-passport-title">
      <header><Link to="/nexus-city">← NEXUS CITY</Link><span>{t.route}</span><b>{profile.locale.toUpperCase()}</b></header>
      <div className="xk-public-passport-grid">
        <div className="xk-public-avatar-stage">
          <div className="xk-public-avatar" role="img" aria-label={`${t.avatar} ${profile.display_name}`}><i aria-hidden="true" /><span aria-hidden="true" /><b aria-hidden="true" /><em aria-hidden="true" /></div>
          <p><small>{t.playerSignal}</small><strong>@{profile.handle}</strong><span>{profile.status_text || t.online}</span></p>
        </div>
        <div className="xk-public-passport-copy">
          <small>{t.identity}</small><h1 id="public-passport-title">{profile.display_name}</h1><blockquote>{profile.bio || t.emptyBio}</blockquote>
          <dl><div><dt>{t.language}</dt><dd>{profile.locale.toUpperCase()}</dd></div><div><dt>{t.lastSignal}</dt><dd><time dateTime={profile.updated_at}>{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(profile.updated_at))}</time></dd></div><div><dt>{t.destination}</dt><dd>NEXUS CITY</dd></div></dl>
          <div className="xk-passport-actions"><Link to={`/nexus-city/room/${profile.handle}`}>{t.visitCapsule}</Link><button type="button" onClick={openChat}>{t.openChat}</button>{isOwn ? <Link to="/nexus-city#social-loop">{t.editPassport}</Link> : <><button type="button" onClick={requestContact}>+ {t.connect}</button><button type="button" className="is-safety" aria-expanded={reportOpen} aria-controls="passport-safety-panel" onClick={() => setReportOpen((current) => !current)}>{t.safety}</button></>}</div>
          {notice ? <p className="xk-passport-notice" role="status" aria-live="polite" aria-atomic="true">{notice}</p> : null}
        </div>
      </div>

      {reportOpen && !isOwn ? <section id="passport-safety-panel" className="xk-passport-safety" aria-labelledby="safety-title"><div><small>{t.safetyEyebrow}</small><h2 id="safety-title">{t.safetyTitle}</h2><p>{t.safetyText}</p></div><label>{t.reason}<select value={reportCategory} onChange={(event) => setReportCategory(event.target.value as ReportCategory)}>{(Object.keys(t.reportCategories) as ReportCategory[]).map((category) => <option key={category} value={category}>{t.reportCategories[category]}</option>)}</select></label><label>{t.detail}<textarea value={reportDetail} onChange={(event) => setReportDetail(event.target.value.slice(0, 1200))} maxLength={1200} minLength={10} placeholder={t.detailPlaceholder} /></label><div><button type="button" onClick={sendReport}>{t.sendReport}</button><button type="button" onClick={blockExplorer}>{t.blockExplorer}</button></div></section> : null}
    </section>
  </main>
}
