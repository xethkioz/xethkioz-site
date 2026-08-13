import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import InternetSOS from '../components/green/InternetSOS'
import { useLang } from '../lib/LangContext'
import { useWisp } from '../providers/WispProvider'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle } from '../services/news/publicNewsService'
import './GreenNodeHub.css'

const quickHelp = [
  {
    code: 'PHISH',
    title: '¿Este mensaje es una estafa?',
    text: 'Aprendé a separar logo, remitente, enlace y dominio real antes de ingresar datos.',
    href: '/news',
  },
  {
    code: 'PHONE',
    title: 'Perdí o me robaron el celular',
    text: 'Orden de recuperación: localizar, bloquear, proteger cuentas, línea, sesiones y evidencia.',
    href: '/news',
  },
  {
    code: 'ACCOUNT',
    title: 'Creo que entraron a una cuenta',
    text: 'Priorizá correo principal, cierre de sesiones, cambio de credenciales y segundo factor.',
    href: '/news',
  },
  {
    code: 'WIFI',
    title: 'Estoy usando Wi-Fi público',
    text: 'Reducí exposición: HTTPS, actualizaciones, compartir desactivado y operaciones sensibles postergadas.',
    href: '/news',
  },
] as const

const labCards = [
  { code: '>_', title: 'Terminal segura', text: 'Aprendé conceptos de terminal y Linux en una simulación que no ejecuta comandos en tu dispositivo.' },
  { code: 'TLS', title: 'HTTPS sin mitos', text: 'Qué protege TLS, qué no demuestra el candado y por qué el dominio sigue importando.' },
  { code: 'KEY', title: 'Passkeys y MFA', text: 'Autenticación resistente al phishing, recuperación y errores comunes explicados sin vender humo.' },
  { code: 'HASH', title: 'Integridad de archivos', text: 'SHA-256, firmas, repositorios oficiales y qué puede comprobar cada mecanismo.' },
] as const

export default function GreenNodeHub() {
  const { lang } = useLang()
  const { triggerGreenPortal } = useWisp()
  const navigate = useNavigate()
  const [radar, setRadar] = useState<PublicNewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchPublishedNews('green')
      .then((items) => { if (active) setRadar(items.slice(0, 6)) })
      .catch(() => { if (active) setRadar([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const openVault = () => {
    triggerGreenPortal()
    window.setTimeout(() => navigate('/green-node/vault'), 420)
  }

  const es = lang === 'es'

  return (
    <>
      <SEO
        title="Green Node Protect · Seguridad, privacidad e Internet SOS"
        description="Green Node Protect de XETHKIOZ: herramientas locales, guías de seguridad digital, privacidad, Linux, alertas verificadas y un Vault 13 separado del contenido factual."
        url="/green-node"
        image="/assets/identity/green-node-occult-malware-v1.webp"
      />
      <main className="xk-gn2">
        <div className="xk-gn2-grid" aria-hidden="true" />
        <div className="xk-gn2-shell">
          <section className="xk-gn2-hero" aria-labelledby="green-node-v11-title">
            <div className="xk-gn2-hero-copy">
              <p className="xk-gn2-kicker">XK-13 // GREEN NODE PROTECT</p>
              <h1 id="green-node-v11-title">GREEN <span>NODE</span></h1>
              <p>{es ? 'Seguridad digital para personas reales: detectar riesgos, entender qué cambió y saber qué hacer sin convertir cada alerta en pánico.' : 'Digital safety for real people: detect risk, understand what changed and know what to do without turning every alert into panic.'}</p>
              <div className="xk-gn2-status">
                <span>PROTECT // PUBLIC</span>
                <span>RADAR // VERIFIED</span>
                <span>LAB // LOCAL-FIRST</span>
                <span>VAULT 13 // WISP</span>
              </div>
            </div>
            <div className="xk-gn2-manifesto">
              <strong>{es ? 'PROTOCOLO DE VERDAD' : 'TRUTH PROTOCOL'}</strong>
              <p>{es ? 'Hecho, inferencia, hipótesis y ficción se presentan como cosas distintas. Las herramientas locales no envían contraseñas, códigos 2FA, archivos ni URLs a XETHKIOZ.' : 'Facts, inference, hypotheses and fiction are treated as different things. Local tools do not send passwords, 2FA codes, files or URLs to XETHKIOZ.'}</p>
            </div>
          </section>

          <nav className="xk-gn2-nav" aria-label={es ? 'Zonas de Green Node' : 'Green Node zones'}>
            <a href="#protect"><b>01</b><span>PROTECT<small>{es ? 'Resolver problemas' : 'Solve problems'}</small></span></a>
            <a href="#radar"><b>02</b><span>RADAR<small>{es ? 'Cambios y alertas' : 'Changes and alerts'}</small></span></a>
            <a href="#lab"><b>03</b><span>LAB<small>{es ? 'Aprender y probar' : 'Learn and test'}</small></span></a>
            <button type="button" onClick={openVault}><b>13</b><span>VAULT<small>{es ? 'Archivo clasificado' : 'Classified archive'}</small></span></button>
          </nav>

          <section id="protect" className="xk-gn2-section" aria-labelledby="protect-title">
            <div className="xk-gn2-section-head"><div><p>01 // PROTECT</p><h2 id="protect-title">{es ? 'Primero resolvemos el problema.' : 'Solve the problem first.'}</h2></div><span>{es ? 'Guías accionables antes que teoría.' : 'Actionable guidance before theory.'}</span></div>
            <div className="xk-gn2-help-grid">
              {quickHelp.map((item) => <Link key={item.code} to={item.href}><b>{item.code}</b><strong>{item.title}</strong><span>{item.text}</span><small>{es ? 'ABRIR GUÍAS →' : 'OPEN GUIDES →'}</small></Link>)}
            </div>
            <InternetSOS />
          </section>

          <section id="radar" className="xk-gn2-section" aria-labelledby="radar-title">
            <div className="xk-gn2-section-head"><div><p>02 // SECURITY RADAR</p><h2 id="radar-title">{es ? 'Qué cambió y qué tenés que hacer.' : 'What changed and what you need to do.'}</h2></div><Link to="/news">{es ? 'VER NEWS RADAR →' : 'OPEN NEWS RADAR →'}</Link></div>
            {loading ? <p className="xk-gn2-loading">{es ? 'Sincronizando señales verificadas…' : 'Syncing verified signals…'}</p> : null}
            {!loading && radar.length === 0 ? <p className="xk-gn2-loading">{es ? 'No hay intercepciones publicadas en este momento.' : 'No published interceptions right now.'}</p> : null}
            <div className="xk-gn2-radar-grid">
              {radar.map((article) => <Link key={article.id} to={`/news/${article.slug}`}>
                <div><span>GREEN NODE</span><time>{formatPublicNewsDate(article.published_at, lang)}</time></div>
                <strong>{article.title}</strong>
                <p>{article.summary ?? (es ? 'Abrí el dossier para revisar contexto y fuentes.' : 'Open the dossier for context and sources.')}</p>
                <small>{article.source_urls.length ? `${article.source_urls.length} ${es ? 'fuente(s)' : 'source(s)'}` : (es ? 'Revisar evidencia' : 'Review evidence')}</small>
              </Link>)}
            </div>
          </section>

          <section id="lab" className="xk-gn2-section" aria-labelledby="lab-title">
            <div className="xk-gn2-section-head"><div><p>03 // LAB</p><h2 id="lab-title">{es ? 'Entender antes de tocar.' : 'Understand before changing.'}</h2></div><span>{es ? 'Linux, web, privacidad y criptografía aplicada.' : 'Linux, web, privacy and applied cryptography.'}</span></div>
            <div className="xk-gn2-lab-grid">
              {labCards.map((item) => <article key={item.code}><b>{item.code}</b><strong>{item.title}</strong><p>{item.text}</p></article>)}
            </div>
          </section>

          <section className="xk-gn2-vault" aria-labelledby="vault-title">
            <div><p>13 // VAULT</p><h2 id="vault-title">{es ? 'El archivo oscuro no desaparece. Se vuelve más claro.' : 'The dark archive stays. Its rules become clearer.'}</h2><span>{es ? 'Dossiers, operaciones documentadas, misterios y anomalías permanecen separados del contenido de seguridad práctica. Cada expediente conserva su nivel de evidencia.' : 'Dossiers, documented operations, mysteries and anomalies remain separate from practical security content. Every file keeps its evidence level.'}</span></div>
            <button type="button" onClick={openVault}>{es ? 'INTERCEPTAR WISP Y ABRIR VAULT 13' : 'INTERCEPT WISP AND OPEN VAULT 13'}</button>
          </section>
        </div>
      </main>
    </>
  )
}
