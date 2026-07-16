import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import SEO from '../components/SEO'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle, type PublicNewsCategory } from '../services/news/publicNewsService'

type NodeBlock = { id: string; title: string; text: string; signal: string; category: PublicNewsCategory; steps: readonly string[] }

type GreenCopy = {
  title: string
  description: string
  close: string
  status: string
  open: string
  active: string
  articleTitle: string
  read: string
  explore: string
  liveSignal: string
  sync: string
  loading: string
  blocks: readonly NodeBlock[]
}

const content: Record<'es' | 'en', GreenCopy> = {
  es: {
    title: 'Green Node',
    description: 'Archivo clandestino donde código, ocultismo digital y teorías imposibles se examinan sin confundir evidencia con ficción.',
    close: 'Cerrar portal',
    status: 'PROTOCOLO DE VERDAD: toda conspiración se etiqueta como ficción, hipótesis o evidencia. Green Node investiga el misterio; no fabrica certezas.',
    open: 'Abrir nodo',
    active: 'Nodo activo',
    articleTitle: 'ARCHIVOS INTERCEPTADOS // evidencia y anomalías',
    read: 'Leer completa',
    explore: 'Explorar archivo completo',
    liveSignal: 'Entidad Wisp infectando el nodo',
    sync: 'Frecuencia clandestina interceptada',
    loading: 'Descifrando archivos restringidos…',
    blocks: [
      { id: 'linux', title: 'Grimorios de código', text: 'Linux, terminales y software libre tratados como el lenguaje secreto de la máquina.', signal: 'GRIMOIRE_0X', category: 'green', steps: ['Descifrar el sistema sin romperlo', 'Dominar permisos, procesos y terminal', 'Crear un entorno recuperable antes del ritual'] },
      { id: 'programming', title: 'Ocultismo digital', text: 'Patrones, automatizaciones y símbolos algorítmicos escondidos bajo la interfaz.', signal: 'SIGIL.EXE', category: 'programming', steps: ['Separar patrón real de coincidencia', 'Construir experimentos pequeños y verificables', 'Registrar cada mutación del código'] },
      { id: 'privacy', title: 'Conspiraciones de red', text: 'Vigilancia, rastros digitales y relatos clandestinos examinados con criterio técnico.', signal: 'BLACK_SIGNAL', category: 'tech', steps: ['Identificar qué datos son observables', 'Distinguir capacidad técnica de especulación', 'Proteger cuentas con 2FA, claves únicas y backups'] },
      { id: 'research', title: 'Archivo de anomalías', text: 'Expedientes, rarezas y teorías marcadas según su nivel real de evidencia.', signal: 'EVIDENCE_13', category: 'science', steps: ['Guardar fuente, autor y fecha', 'Etiquetar evidencia, inferencia, ficción u opinión', 'Cambiar la conclusión cuando cambien los datos'] },
    ],
  },
  en: {
    title: 'Green Node',
    description: 'A clandestine archive where code, digital occultism and impossible theories are examined without confusing evidence with fiction.',
    close: 'Close portal',
    status: 'TRUTH PROTOCOL: every conspiracy is labeled as fiction, hypothesis or evidence. Green Node investigates mystery; it does not manufacture certainty.',
    open: 'Open node',
    active: 'Active node',
    articleTitle: 'INTERCEPTED FILES // evidence and anomalies',
    read: 'Read full article',
    explore: 'Explore full archive',
    liveSignal: 'Wisp entity infecting the node',
    sync: 'Clandestine frequency intercepted',
    loading: 'Decrypting restricted files…',
    blocks: [
      { id: 'linux', title: 'Code grimoires', text: 'Linux, terminals and open source treated as the machine’s secret language.', signal: 'GRIMOIRE_0X', category: 'green', steps: ['Decode the system without breaking it', 'Master permissions, processes and terminal', 'Create a recoverable environment before the ritual'] },
      { id: 'programming', title: 'Digital occultism', text: 'Patterns, automations and algorithmic symbols hidden beneath the interface.', signal: 'SIGIL.EXE', category: 'programming', steps: ['Separate real patterns from coincidence', 'Build small verifiable experiments', 'Record every mutation in the code'] },
      { id: 'privacy', title: 'Network conspiracies', text: 'Surveillance, digital traces and clandestine stories examined with technical judgment.', signal: 'BLACK_SIGNAL', category: 'tech', steps: ['Identify which data is observable', 'Separate technical capability from speculation', 'Protect accounts with 2FA, unique keys and backups'] },
      { id: 'research', title: 'Anomaly archive', text: 'Files, oddities and theories marked by their actual level of evidence.', signal: 'EVIDENCE_13', category: 'science', steps: ['Save source, author and date', 'Label evidence, inference, fiction or opinion', 'Change conclusions when the data changes'] },
    ],
  },
}

export default function GreenNode() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const [publishedArticles, setPublishedArticles] = useState<PublicNewsArticle[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [deepMode, setDeepMode] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLines, setTerminalLines] = useState<string[]>(['GREEN_NODE v13.6 // terminal simulada', 'Escribí “help” para listar comandos seguros.'])

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetchPublishedNews('green'),
      fetchPublishedNews('programming'),
      fetchPublishedNews('tech'),
      fetchPublishedNews('science'),
    ]).then((groups) => {
      if (!mounted) return
      const seen = new Set<string>()
      setPublishedArticles(groups.flat().filter((article) => {
        if (seen.has(article.slug)) return false
        seen.add(article.slug)
        return true
      }))
    }).catch(() => {
      if (mounted) setPublishedArticles([])
    }).finally(() => {
      if (mounted) setLoadingNews(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const articles = useMemo(() => {
    const curated = [...getCuratedExternalNews('tech'), ...getCuratedExternalNews('science')]
    const seen = new Set<string>()
    const merged = [...publishedArticles, ...curated].filter((article) => {
      if (seen.has(article.slug)) return false
      seen.add(article.slug)
      return true
    })
    const matching = merged.filter((article) => article.category === active.category)
    return (matching.length ? matching : merged).slice(0, 6)
  }, [active.category, publishedArticles])

  function runTerminalCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const command = terminalInput.trim().toLowerCase()
    if (!command) return
    const responses: Record<string, string> = {
      help: 'COMANDOS: listar_archivos · decodificar_archivo · protocolo_verdad · deep_mode · limpiar',
      listar_archivos: 'GRIMOIRE_0X  SIGIL.EXE  BLACK_SIGNAL  EVIDENCE_13',
      decodificar_archivo: 'EVIDENCE_13 desbloqueado. La anomalía se abre como hipótesis, nunca como certeza.',
      protocolo_verdad: 'ACTIVO: evidencia ≠ inferencia ≠ ficción. Verificá fuente, autor, fecha y contexto.',
      deep_mode: `DEEP_MODE ${deepMode ? 'ya estaba activo' : 'activado'}. La interfaz cambia; la evidencia no.`,
    }
    if (command === 'limpiar') {
      setTerminalLines(['Terminal limpia. El archivo conserva sus fuentes.'])
    } else {
      setTerminalLines((current) => [...current.slice(-5), `> ${command}`, responses[command] ?? 'COMANDO NO RECONOCIDO. Usá “help”.'])
    }
    if (command === 'decodificar_archivo') setActiveId('research')
    if (command === 'deep_mode') setDeepMode(true)
    setTerminalInput('')
  }

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/green-node" />
      <section className={`xk-green-shell px-4 py-12 sm:px-6 lg:px-8${deepMode ? ' xk-deep-mode' : ''}`}>
        <div className="xk-green-matrix" aria-hidden="true" />
        <div className="mx-auto max-w-7xl">
          <div className="xk-green-frame xk-occult-frame rounded-[2rem] bg-black/78 p-6 md:p-10">
            <SafeImage src="/assets/identity/green-node-occult-malware-v1.webp" fallback="/images/articles/tech.svg" alt="Entidad Wisp de malware ocultista dentro de un archivo de servidores" className="xk-occult-hero-image" />
            <div className="xk-occult-veil" aria-hidden="true" />
            <div className="xk-occult-sigil" aria-hidden="true"><i /><i /><i /><span>13</span></div>
            <div className="xk-classified-stamp" aria-hidden="true">CLASSIFIED // LEVEL ∆</div>
            <div className="xk-green-content">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#32FF8A]/70">BLACK_ARCHIVE // WISP_INFECTION_ACCEPTED</p>
                <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-[#32FF8A]/50 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10">{lang.toUpperCase()}</button>
              </div>
              <div className="mt-6">
                <div className="xk-occult-copy">
                  <p className="xk-occult-eyebrow">DOSSIER 13 / REALITY BREACH</p>
                  <h1 className="xk-occult-title">{t.title}</h1>
                  <p className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-[#B9FFD1] md:text-base">{t.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2 font-mono text-[9px] font-black uppercase tracking-[0.18em]">
                    <span className="rounded-full border border-[#32FF8A]/35 bg-[#32FF8A]/[0.07] px-3 py-2 text-[#32FF8A]">● {t.liveSignal}</span>
                    <span className="rounded-full border border-white/10 px-3 py-2 text-[#B9FFD1]/65">{t.sync}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {t.blocks.map((node) => (
                  <button key={node.id} type="button" onClick={() => setActiveId(node.id)} aria-pressed={active.id === node.id} className={`group rounded-2xl border p-5 text-left font-mono shadow-[0_0_18px_rgba(50,255,138,.12)] transition hover:-translate-y-1 ${active.id === node.id ? 'border-[#D8FFE8]/70 bg-[#0A2612]' : 'border-[#32FF8A]/35 bg-[#031006]/80 hover:border-[#32FF8A]/80'}`}>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/55">◬ {node.signal}</p>
                    <h2 className="mt-3 text-lg font-black uppercase tracking-[0.12em] text-[#D8FFE8]">{node.title}</h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{node.text}</p>
                    <span className="mt-4 inline-flex text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
                  </button>
                ))}
              </div>

              <section className="xk-green-terminal" aria-labelledby="green-terminal-title">
                <header><div><i /><i /><i /></div><p id="green-terminal-title">root@xethkioz:~/black_archive</p><button type="button" aria-pressed={deepMode} onClick={() => setDeepMode((current) => !current)}>{deepMode ? 'SALIR DEEP MODE' : 'ACTIVAR DEEP MODE'}</button></header>
                <div className="xk-terminal-screen" role="log" aria-live="polite" aria-relevant="additions">{terminalLines.map((line, index) => <p key={`${line}-${index}`}><span>{index === terminalLines.length - 1 ? '›' : '·'}</span>{line}</p>)}</div>
                <form onSubmit={runTerminalCommand}><label htmlFor="green-command" className="sr-only">Comando de la terminal simulada</label><span aria-hidden="true">visitor@green-node:~$</span><input id="green-command" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} autoComplete="off" spellCheck={false} maxLength={40} placeholder="help" /><button type="submit">EJECUTAR ↵</button></form>
                <small>SIMULACIÓN SEGURA: esta consola no ejecuta código ni accede a tu dispositivo.</small>
              </section>

              {deepMode && <aside className="xk-deep-reveal" role="status"><p>ARCHIVO ∆ REVELADO</p><b>La teoría más seductora también necesita evidencia.</b><span>Seguí la señal escondida: fecha → autor → fuente → contradicción.</span></aside>}

              <section className="mt-6 overflow-hidden rounded-2xl border border-[#32FF8A]/35 bg-[radial-gradient(circle_at_90%_10%,rgba(50,255,138,.13),transparent_32%),rgba(3,16,6,.88)] p-5 font-mono md:p-7" aria-live="polite">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#32FF8A]/60">{t.active} // {active.signal}</p>
                    <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-[#D8FFE8] md:text-3xl">{active.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#B9FFD1]/75">{active.text}</p>
                  </div>
                  <Link to={`/news?category=${active.category}`} className="shrink-0 rounded-full border border-[#32FF8A]/45 px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10">{t.explore} →</Link>
                </div>
                <ol className="mt-6 grid gap-3 md:grid-cols-3">
                  {active.steps.map((step, index) => <li key={step} className="flex gap-3 rounded-xl border border-[#32FF8A]/15 bg-black/35 p-4 text-xs leading-6 text-[#B9FFD1]/80"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#32FF8A]/30 text-[9px] font-black text-[#32FF8A]">0{index + 1}</span><span>{step}</span></li>)}
                </ol>
              </section>

              <section className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{t.articleTitle}</p>
                {loadingNews ? <p className="mt-4 text-xs text-[#B9FFD1]/60">{t.loading}</p> : null}
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {articles.map((article) => (
                    <article key={article.slug} className="group overflow-hidden rounded-2xl border border-[#32FF8A]/20 bg-[#031006]/80 p-5 transition hover:-translate-y-1 hover:border-[#32FF8A]/70">
                      {article.cover_image_url ? <SafeImage src={article.cover_image_url} fallback="/images/articles/tech.svg" alt={article.cover_image_alt || article.title} className="mb-4 aspect-[16/8] w-full rounded-xl object-cover transition duration-700 group-hover:scale-[1.025]" /> : null}
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]/70">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                      <h3 className="mt-3 text-sm font-black uppercase text-[#D8FFE8]">{article.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{article.summary}</p>
                      <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
                    </article>
                  ))}
                </div>
              </section>

              <div className="mt-8">
                <PublicAdSlot slotId="section-sidebar" fallbackLabel="XETHKIOZ GREEN NODE SPONSOR" />
              </div>

              <div className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono text-xs leading-relaxed text-[#B9FFD1]">{t.status}</div>

              <Link to="/" className="mt-8 inline-flex rounded-full border border-[#32FF8A]/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_18px_rgba(50,255,138,.24)]">{t.close}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
