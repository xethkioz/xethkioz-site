import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import GreenNodeWispGuide, { type GreenNodeView } from '../components/GreenNodeWispGuide'
import SEO from '../components/SEO'
import PublicAdSlot from '../components/ads/PublicAdSlot'
import { PortalPulseRail } from '../components/PortalPulseRail'
import { NexusDistrict } from '../components/NexusDistrict'
import { greenNodeDossiers, type GreenDossierCategory } from '../data/greenNodeDossiers'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { fetchPublishedNews, formatPublicNewsDate, type PublicNewsArticle, type PublicNewsCategory } from '../services/news/publicNewsService'
import './GreenNodeDossiers.css'

type NodeBlock = {
  id: string
  title: string
  text: string
  signal: string
  category: PublicNewsCategory
  steps: readonly string[]
}

type GreenCopy = {
  title: string
  description: string
  heroAlt: string
  switchLanguage: string
  switchCode: string
  close: string
  status: string
  open: string
  active: string
  nodeSelector: string
  articleTitle: string
  read: string
  explore: string
  liveSignal: string
  sync: string
  loading: string
  empty: string
  dossier: string
  sponsor: string
  views: {
    aria: string
    overview: string
    overviewDetail: string
    dossiers: string
    dossiersDetail: string
    terminal: string
    terminalDetail: string
    signals: string
    signalsDetail: string
  }
  access: {
    aria: string
    disclaimer: string
    stages: readonly string[]
    descriptions: readonly string[]
  }
  loop: {
    eyebrow: string
    title: string
    description: string
    items: readonly { code: string; title: string; detail: string; to: string; action: string }[]
  }
  terminal: {
    initial: readonly string[]
    commandLabel: string
    run: string
    safe: string
    enableDeep: string
    disableDeep: string
    clear: string
    unknown: string
    responses: {
      help: string
      list: string
      decode: string
      truth: string
      deepActive: string
      deepAlreadyActive: string
      anonUnlock: string
      declassifiedUnlock: string
      correlationLocked: string
      correlationOpen: string
    }
  }
  dossiers: {
    eyebrow: string
    title: string
    description: string
    level: string
    source: string
    confirmed: string
    unresolved: string
    locked: string
    unlock: string
    all: string
    hacktivism: string
    police: string
    declassified: string
    mystery: string
    documented: string
    disputed: string
    unverified: string
    search: string
    searchPlaceholder: string
    showing: string
    noResults: string
  }
  investigation: {
    eyebrow: string
    title: string
    description: string
    read: string
    files: string
    signals: string
    recovered: string
    clearance: string
    fragments: readonly { id: string; code: string; hint: string }[]
    finalLocked: string
    finalReady: string
    finalCommand: string
    finalTitle: string
    finalText: string
    reset: string
  }
  reveal: {
    eyebrow: string
    title: string
    description: string
  }
  blocks: readonly NodeBlock[]
}

const content: Record<'es' | 'en', GreenCopy> = {
  es: {
    title: 'Green Node',
    description: 'Archivo clandestino donde código, ocultismo digital y teorías imposibles se examinan sin confundir evidencia con ficción.',
    heroAlt: 'Entidad Wisp de malware ocultista dentro de un archivo de servidores',
    switchLanguage: 'Cambiar a inglés',
    switchCode: 'EN',
    close: 'Cerrar portal',
    status: 'PROTOCOLO DE VERDAD: toda conspiración se etiqueta como ficción, hipótesis o evidencia. Green Node investiga el misterio; no fabrica certezas.',
    open: 'Abrir nodo',
    active: 'Nodo activo',
    nodeSelector: 'Archivos de Green Node',
    articleTitle: 'ARCHIVOS INTERCEPTADOS // evidencia y anomalías',
    read: 'Leer completa',
    explore: 'Explorar archivo completo',
    liveSignal: 'Entidad Wisp infectando el nodo',
    sync: 'Frecuencia clandestina interceptada',
    loading: 'Descifrando archivos restringidos…',
    empty: 'ARCHIVO VACÍO // No hay señales verificadas disponibles para este nodo.',
    dossier: 'DOSSIER 13 / BRECHA DE REALIDAD',
    sponsor: 'SPONSOR DE XETHKIOZ GREEN NODE',
    views: { aria: 'Elegir sección de Green Node', overview: 'PUERTA DE ENTRADA', overviewDetail: 'Mapa del archivo y protocolo de verdad', dossiers: 'EXPEDIENTES', dossiersDetail: 'Casos reales, operaciones y conspiraciones', terminal: 'TERMINAL', terminalDetail: 'Comandos, niveles y señales ocultas', signals: 'INTERCEPCIONES', signalsDetail: 'Noticias y análisis del nodo' },
    access: {
      aria: 'Simulación visual de acceso a Green Node',
      disclaimer: 'SIMULACIÓN VISUAL // NO SE ACCEDE A TU DISPOSITIVO',
      stages: ['INTERCEPTANDO SEÑAL', 'RASTRO FANTASMA DETECTADO', 'INTEGRIDAD COMPROMETIDA', 'ABRIENDO GREEN NODE'],
      descriptions: ['Buscando una frecuencia que no debería existir…', 'La entidad respondió desde el otro lado.', 'Inyectando sombras en la interfaz…', 'Acceso visitante concedido.'],
    },
    loop: {
      eyebrow: 'BLACK_LOOP // LA SEÑAL TE ESTÁ MIRANDO',
      title: 'No leas el archivo: intervenilo',
      description: 'Green Node cobra vida cuando decidís qué descifrar, qué evidencia contrastar y hasta dónde activar el modo profundo.',
      items: [
        { code: '>_', title: 'Usar la terminal', detail: 'Comandos simulados, sin tocar tu dispositivo', to: '/green-node?view=terminal#terminal', action: 'Decodificar' },
        { code: '13', title: 'Abrir expedientes', detail: 'Ocultismo, red y anomalías documentadas', to: '/green-node?view=dossiers#classified-files', action: 'Investigar' },
        { code: 'EYE', title: 'Cruzar evidencia', detail: 'Distinguir fuente, hipótesis y ficción', to: '/green-node?view=signals#evidence', action: 'Contrastar' },
      ],
    },
    terminal: {
      initial: ['GREEN_NODE v13.6 // terminal simulada', 'Escribí “help” para listar comandos seguros.'],
      commandLabel: 'Comando de la terminal simulada',
      run: 'EJECUTAR',
      safe: 'SIMULACIÓN SEGURA: esta consola no ejecuta código ni accede a tu dispositivo.',
      enableDeep: 'ACTIVAR DEEP MODE',
      disableDeep: 'SALIR DEEP MODE',
      clear: 'Terminal limpia. El archivo conserva sus fuentes.',
      unknown: 'COMANDO NO RECONOCIDO. Usá “help”.',
      responses: {
        help: 'COMANDOS: listar_archivos · interceptar_anon · desclasificar · decodificar_archivo · protocolo_verdad · deep_mode · limpiar/clear',
        list: 'GRIMOIRE_0X  SIGIL.EXE  BLACK_SIGNAL  EVIDENCE_13',
        decode: 'EVIDENCE_13 desbloqueado. La anomalía se abre como hipótesis, nunca como certeza.',
        truth: 'ACTIVO: evidencia ≠ inferencia ≠ ficción. Verificá fuente, autor, fecha y contexto.',
        deepActive: 'DEEP_MODE activado. La interfaz cambia; la evidencia no.',
        deepAlreadyActive: 'DEEP_MODE ya estaba activo. La interfaz cambia; la evidencia no.',
        anonUnlock: 'CLEARANCE 02 concedido. Expedientes policiales y red Anonymous disponibles.',
        declassifiedUnlock: 'CLEARANCE 03 concedido. Proyectos desclasificados y archivo de anomalías disponibles.',
        correlationLocked: 'CORRELACIÓN INCOMPLETA. Faltan señales en el archivo.',
        correlationOpen: 'CORRELACIÓN_13 completa. Ninguna fuente aislada demuestra una teoría total: seguí actores, fechas, incentivos y contradicciones.',
      },
    },
    dossiers: {
      eyebrow: 'VAULT_13 // INTELIGENCIA ABIERTA', title: 'Expedientes clasificados', description: 'Veinte casos reales, operaciones policiales, programas desclasificados y misterios. Cada archivo separa lo confirmado de lo que todavía está discutido.', level: 'Nivel de acceso', source: 'Abrir fuente primaria', confirmed: 'CONFIRMADO', unresolved: 'LÍMITE / DUDA', locked: 'ARCHIVO CIFRADO', unlock: 'Consultá “help” en la terminal para elevar el acceso.', all: 'Todos', hacktivism: 'Hacktivismo', police: 'Casos policiales', declassified: 'Desclasificados', mystery: 'Misterios', documented: 'DOCUMENTADO', disputed: 'DISPUTADO', unverified: 'NO VERIFICADO', search: 'Buscar por caso, código, fecha o tema', searchPlaceholder: 'Ej: Anonymous, ransomware, CIA, vigilancia…', showing: 'expedientes visibles', noResults: 'No encontramos un expediente con esa señal.',
    },
    investigation: {
      eyebrow: 'INVESTIGACIÓN_13 // PROGRESO LOCAL', title: 'Seguí las señales que otros pasan por alto', description: 'Abrí expedientes, contrastá el protocolo y encontrá tres fragmentos. El progreso queda sólo en este dispositivo.', read: 'Expedientes examinados', files: 'archivos', signals: 'Señales recuperadas', recovered: 'SEÑAL RECUPERADA', clearance: 'Acceso',
      fragments: [
        { id: 'ghost', code: 'GHOST-14', hint: 'Rastreá el primer operativo de Anonymous.' },
        { id: 'mirror', code: 'MIRROR-07', hint: 'Ejecutá el protocolo que separa evidencia de ficción.' },
        { id: 'orbit', code: 'ORBIT-69', hint: 'Buscá el proyecto que catalogó 12.618 reportes.' },
      ],
      finalLocked: 'La correlación permanece cifrada.', finalReady: 'SEÑAL COMPLETA // ejecutá el comando oculto', finalCommand: 'correlacion_13', finalTitle: 'No existe una teoría maestra: existen patrones que deben probarse.', finalText: 'Las operaciones documentadas comparten fechas, actores, métodos e incentivos verificables. Cuando falta uno de esos enlaces, el misterio sigue siendo una hipótesis.', reset: 'Borrar progreso de investigación',
    },
    reveal: {
      eyebrow: 'ARCHIVO ∆ REVELADO',
      title: 'La teoría más seductora también necesita evidencia.',
      description: 'Seguí la señal escondida: fecha → autor → fuente → contradicción.',
    },
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
    heroAlt: 'Occult malware Wisp entity inside a server archive',
    switchLanguage: 'Switch to Spanish',
    switchCode: 'ES',
    close: 'Close portal',
    status: 'TRUTH PROTOCOL: every conspiracy is labeled as fiction, hypothesis or evidence. Green Node investigates mystery; it does not manufacture certainty.',
    open: 'Open node',
    active: 'Active node',
    nodeSelector: 'Green Node files',
    articleTitle: 'INTERCEPTED FILES // evidence and anomalies',
    read: 'Read full article',
    explore: 'Explore full archive',
    liveSignal: 'Wisp entity infecting the node',
    sync: 'Clandestine frequency intercepted',
    loading: 'Decrypting restricted files…',
    empty: 'EMPTY ARCHIVE // No verified signals are available for this node.',
    dossier: 'DOSSIER 13 / REALITY BREACH',
    sponsor: 'XETHKIOZ GREEN NODE SPONSOR',
    views: { aria: 'Choose a Green Node section', overview: 'ENTRY GATE', overviewDetail: 'Archive map and truth protocol', dossiers: 'CASE FILES', dossiersDetail: 'Real cases, operations and conspiracies', terminal: 'TERMINAL', terminalDetail: 'Commands, clearance and hidden signals', signals: 'INTERCEPTS', signalsDetail: 'Node news and analysis' },
    access: {
      aria: 'Visual simulation of Green Node access',
      disclaimer: 'VISUAL SIMULATION // YOUR DEVICE IS NOT ACCESSED',
      stages: ['INTERCEPTING SIGNAL', 'GHOST TRACE DETECTED', 'INTEGRITY COMPROMISED', 'OPENING GREEN NODE'],
      descriptions: ['Searching for a frequency that should not exist…', 'The entity answered from the other side.', 'Injecting shadows into the interface…', 'Visitor access granted.'],
    },
    loop: {
      eyebrow: 'BLACK_LOOP // THE SIGNAL IS WATCHING',
      title: 'Do not just read the archive: intervene',
      description: 'Green Node comes alive when you decide what to decode, which evidence to compare and how far to activate Deep Mode.',
      items: [
        { code: '>_', title: 'Use the terminal', detail: 'Simulated commands that never touch your device', to: '/green-node?view=terminal#terminal', action: 'Decode' },
        { code: '13', title: 'Open case files', detail: 'Documented occultism, networks and anomalies', to: '/green-node?view=dossiers#classified-files', action: 'Investigate' },
        { code: 'EYE', title: 'Cross-check evidence', detail: 'Separate sources, hypotheses and fiction', to: '/green-node?view=signals#evidence', action: 'Compare' },
      ],
    },
    terminal: {
      initial: ['GREEN_NODE v13.6 // simulated terminal', 'Type “help” to list safe commands.'],
      commandLabel: 'Simulated terminal command',
      run: 'RUN',
      safe: 'SAFE SIMULATION: this console does not execute code or access your device.',
      enableDeep: 'ENABLE DEEP MODE',
      disableDeep: 'EXIT DEEP MODE',
      clear: 'Terminal cleared. The archive keeps its sources.',
      unknown: 'UNKNOWN COMMAND. Use “help”.',
      responses: {
        help: 'COMMANDS: listar_archivos · interceptar_anon · desclasificar · decodificar_archivo · protocolo_verdad · deep_mode · limpiar/clear',
        list: 'GRIMOIRE_0X  SIGIL.EXE  BLACK_SIGNAL  EVIDENCE_13',
        decode: 'EVIDENCE_13 unlocked. The anomaly opens as a hypothesis, never as certainty.',
        truth: 'ACTIVE: evidence ≠ inference ≠ fiction. Verify source, author, date and context.',
        deepActive: 'DEEP_MODE enabled. The interface changes; the evidence does not.',
        deepAlreadyActive: 'DEEP_MODE was already active. The interface changes; the evidence does not.',
        anonUnlock: 'CLEARANCE 02 granted. Law-enforcement and Anonymous network files are available.',
        declassifiedUnlock: 'CLEARANCE 03 granted. Declassified projects and anomaly files are available.',
        correlationLocked: 'INCOMPLETE CORRELATION. Signals are still missing from the archive.',
        correlationOpen: 'CORRELATION_13 complete. No isolated source proves a total theory: follow actors, dates, incentives and contradictions.',
      },
    },
    dossiers: {
      eyebrow: 'VAULT_13 // OPEN INTELLIGENCE', title: 'Classified case files', description: 'Twenty real cases, law-enforcement operations, declassified programs and mysteries. Every file separates confirmed facts from what remains disputed.', level: 'Clearance level', source: 'Open primary source', confirmed: 'CONFIRMED', unresolved: 'LIMIT / DOUBT', locked: 'ENCRYPTED FILE', unlock: 'Use “help” in the terminal to raise your clearance.', all: 'All', hacktivism: 'Hacktivism', police: 'Law enforcement', declassified: 'Declassified', mystery: 'Mysteries', documented: 'DOCUMENTED', disputed: 'DISPUTED', unverified: 'UNVERIFIED', search: 'Search by case, code, date or topic', searchPlaceholder: 'E.g. Anonymous, ransomware, CIA, surveillance…', showing: 'visible files', noResults: 'No case file matches that signal.',
    },
    investigation: {
      eyebrow: 'INVESTIGATION_13 // LOCAL PROGRESS', title: 'Follow the signals other people overlook', description: 'Open case files, test the truth protocol and recover three fragments. Progress remains only on this device.', read: 'Case files examined', files: 'files', signals: 'Signals recovered', recovered: 'SIGNAL RECOVERED', clearance: 'Clearance',
      fragments: [
        { id: 'ghost', code: 'GHOST-14', hint: 'Trace the first Anonymous operation.' },
        { id: 'mirror', code: 'MIRROR-07', hint: 'Run the protocol that separates evidence from fiction.' },
        { id: 'orbit', code: 'ORBIT-69', hint: 'Find the project that catalogued 12,618 reports.' },
      ],
      finalLocked: 'The correlation remains encrypted.', finalReady: 'SIGNAL COMPLETE // run the hidden command', finalCommand: 'correlacion_13', finalTitle: 'There is no master theory: there are patterns that must be tested.', finalText: 'Documented operations share verifiable dates, actors, methods and incentives. When one of those links is missing, the mystery remains a hypothesis.', reset: 'Erase investigation progress',
    },
    reveal: {
      eyebrow: 'FILE ∆ REVEALED',
      title: 'The most seductive theory still needs evidence.',
      description: 'Follow the hidden signal: date → author → source → contradiction.',
    },
    blocks: [
      { id: 'linux', title: 'Code grimoires', text: 'Linux, terminals and open source treated as the machine’s secret language.', signal: 'GRIMOIRE_0X', category: 'green', steps: ['Decode the system without breaking it', 'Master permissions, processes and terminal', 'Create a recoverable environment before the ritual'] },
      { id: 'programming', title: 'Digital occultism', text: 'Patterns, automations and algorithmic symbols hidden beneath the interface.', signal: 'SIGIL.EXE', category: 'programming', steps: ['Separate real patterns from coincidence', 'Build small verifiable experiments', 'Record every mutation in the code'] },
      { id: 'privacy', title: 'Network conspiracies', text: 'Surveillance, digital traces and clandestine stories examined with technical judgment.', signal: 'BLACK_SIGNAL', category: 'tech', steps: ['Identify which data is observable', 'Separate technical capability from speculation', 'Protect accounts with 2FA, unique keys and backups'] },
      { id: 'research', title: 'Anomaly archive', text: 'Files, oddities and theories marked by their actual level of evidence.', signal: 'EVIDENCE_13', category: 'science', steps: ['Save source, author and date', 'Label evidence, inference, fiction or opinion', 'Change conclusions when the data changes'] },
    ],
  },
}

const GREEN_PROGRESS_KEY = 'xethkioz.green-investigation.v1'

type GreenProgress = {
  clearance: 1 | 2 | 3
  read: string[]
  signals: string[]
  final: boolean
}

const GREEN_HASH_VIEWS: Readonly<Record<string, GreenNodeView>> = {
  '#archive': 'dossiers',
  '#terminal': 'terminal',
  '#evidence': 'signals',
}

function readGreenProgress(): GreenProgress {
  const fallback: GreenProgress = { clearance: 1, read: [], signals: [], final: false }
  try {
    const value = JSON.parse(window.localStorage.getItem(GREEN_PROGRESS_KEY) ?? 'null') as Partial<GreenProgress> | null
    if (!value) return fallback
    return {
      clearance: value.clearance === 2 || value.clearance === 3 ? value.clearance : 1,
      read: Array.isArray(value.read) ? value.read.filter((item): item is string => typeof item === 'string') : [],
      signals: Array.isArray(value.signals) ? value.signals.filter((item): item is string => typeof item === 'string') : [],
      final: value.final === true,
    }
  } catch {
    return fallback
  }
}

export default function GreenNode() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const hashView = GREEN_HASH_VIEWS[location.hash.toLowerCase()]
  const activeView = requestedView === 'dossiers' || requestedView === 'terminal' || requestedView === 'signals' ? requestedView : hashView ?? 'overview'
  const requestedNode = searchParams.get('node')
  const [activeId, setActiveId] = useState<string>(() => t.blocks.some((item) => item.id === requestedNode) ? requestedNode! : t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const activeIndex = Math.max(0, t.blocks.findIndex((item) => item.id === active.id))
  const [publishedArticles, setPublishedArticles] = useState<PublicNewsArticle[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [deepMode, setDeepMode] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLines, setTerminalLines] = useState<string[]>(() => [...t.terminal.initial])
  const [accessSequence, setAccessSequence] = useState(0)
  const [clearance, setClearance] = useState<1 | 2 | 3>(() => readGreenProgress().clearance)
  const [readDossiers, setReadDossiers] = useState<Set<string>>(() => new Set(readGreenProgress().read))
  const [signalFragments, setSignalFragments] = useState<Set<string>>(() => new Set(readGreenProgress().signals))
  const [finalReveal, setFinalReveal] = useState(() => readGreenProgress().final)
  const [dossierFilter, setDossierFilter] = useState<'all' | GreenDossierCategory>('all')
  const [dossierQuery, setDossierQuery] = useState('')
  const accessIndex = Math.min(accessSequence, 3)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const intervals = reducedMotion ? [80, 140, 200, 260] : [520, 1080, 1680, 2450]
    const timers = intervals.map((delay, index) => window.setTimeout(() => setAccessSequence(index + 1), delay))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    setTerminalLines([...t.terminal.initial])
    setTerminalInput('')
  }, [lang])

  useEffect(() => {
    if (requestedNode && t.blocks.some((item) => item.id === requestedNode)) setActiveId(requestedNode)
  }, [requestedNode, t.blocks])

  useEffect(() => {
    if (accessSequence < 4 || !location.hash) return
    const targetId = decodeURIComponent(location.hash.slice(1))
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId)
      if (!target) return
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
      target.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [accessSequence, activeView, location.hash])

  useEffect(() => {
    try {
      window.localStorage.setItem(GREEN_PROGRESS_KEY, JSON.stringify({ clearance, read: [...readDossiers], signals: [...signalFragments], final: finalReveal }))
    } catch {
      // The investigation remains usable for this session when storage is restricted.
    }
  }, [clearance, finalReveal, readDossiers, signalFragments])

  useEffect(() => {
    if (activeView !== 'signals') return
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
    return () => { mounted = false }
  }, [activeView])

  function selectView(view: GreenNodeView) {
    const next = new URLSearchParams(searchParams)
    next.set('view', view)
    setSearchParams(next)
    window.requestAnimationFrame(() => document.getElementById('green-view-content')?.focus({ preventScroll: true }))
  }

  function openNode(nodeId: string) {
    setActiveId(nodeId)
    const next = new URLSearchParams(searchParams)
    next.set('view', 'signals')
    next.set('node', nodeId)
    setSearchParams(next)
    window.requestAnimationFrame(() => document.getElementById('green-view-content')?.focus({ preventScroll: true }))
  }

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

  const dossiers = useMemo(() => {
    const query = dossierQuery.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return greenNodeDossiers.filter((item) => {
      if (dossierFilter !== 'all' && item.category !== dossierFilter) return false
      if (!query) return true
      return `${item.code} ${item.period} ${item.title[lang]} ${item.summary[lang]} ${item.confirmed[lang]} ${item.unresolved[lang]}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query)
    })
  }, [dossierFilter, dossierQuery, lang])
  const investigationComplete = signalFragments.size === t.investigation.fragments.length

  function recoverSignal(id: string) {
    setSignalFragments((current) => current.has(id) ? current : new Set(current).add(id))
  }

  function markDossierRead(id: string) {
    setReadDossiers((current) => current.has(id) ? current : new Set(current).add(id))
    if (id === 'anonymous-payback') recoverSignal('ghost')
    if (id === 'project-blue-book') recoverSignal('orbit')
  }

  function resetInvestigation() {
    setClearance(1)
    setReadDossiers(new Set())
    setSignalFragments(new Set())
    setFinalReveal(false)
    try { window.localStorage.removeItem(GREEN_PROGRESS_KEY) } catch { /* Optional local persistence. */ }
  }

  function runTerminalCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const command = terminalInput.trim().toLowerCase()
    if (!command) return
    const responses: Record<string, string> = {
      help: t.terminal.responses.help,
      listar_archivos: t.terminal.responses.list,
      decodificar_archivo: t.terminal.responses.decode,
      protocolo_verdad: t.terminal.responses.truth,
      deep_mode: deepMode ? t.terminal.responses.deepAlreadyActive : t.terminal.responses.deepActive,
      interceptar_anon: t.terminal.responses.anonUnlock,
      desclasificar: t.terminal.responses.declassifiedUnlock,
      correlacion_13: investigationComplete ? t.terminal.responses.correlationOpen : t.terminal.responses.correlationLocked,
    }
    if (command === 'limpiar' || command === 'clear') {
      setTerminalLines([t.terminal.clear])
    } else {
      setTerminalLines((current) => [...current.slice(-5), `> ${command}`, responses[command] ?? t.terminal.unknown])
    }
    if (command === 'decodificar_archivo') setActiveId('research')
    if (command === 'deep_mode') setDeepMode(true)
    if (command === 'interceptar_anon') setClearance((current) => current < 2 ? 2 : current)
    if (command === 'desclasificar') setClearance(3)
    if (command === 'protocolo_verdad') recoverSignal('mirror')
    if (command === 'correlacion_13' && investigationComplete) setFinalReveal(true)
    setTerminalInput('')
  }

  function moveNodeFocus(currentIndex: number, direction: 1 | -1) {
    const nextIndex = (currentIndex + direction + t.blocks.length) % t.blocks.length
    const next = t.blocks[nextIndex]
    setActiveId(next.id)
    document.getElementById(`green-tab-${next.id}`)?.focus()
  }

  return (
    <>
      <SEO title={t.title} description={t.description} url="/green-node" />
      {accessSequence < 4 ? <div className="xk-green-access-sequence" role="status" aria-live="polite" aria-label={t.access.aria}>
        <div className="xk-access-noise" aria-hidden="true" />
        <p>{t.access.disclaimer}</p>
        <h2>{t.access.stages[accessIndex]}</h2>
        <div aria-hidden="true"><i style={{ width: `${[12, 39, 71, 100][accessIndex]}%` }} /></div>
        <span>{t.access.descriptions[accessIndex]}</span>
        <code>0x66 :: W1SP :: SAFE_SIMULATION</code>
      </div> : null}

      <main className={`xk-green-shell px-4 py-12 sm:px-6 lg:px-8${deepMode ? ' xk-deep-mode' : ''}`}>
        <div className="xk-green-matrix" aria-hidden="true" />
        <div className="mx-auto max-w-7xl">
          <section className="xk-green-frame xk-occult-frame rounded-[2rem] bg-black/78 p-6 md:p-10" aria-labelledby="green-title">
            <SafeImage src="/assets/identity/green-node-occult-malware-v1.webp" fallback="/images/articles/tech.svg" alt={t.heroAlt} className="xk-occult-hero-image" loading="eager" fetchPriority="high" />
            <div className="xk-occult-veil" aria-hidden="true" />
            <div className="xk-occult-sigil" aria-hidden="true"><i /><i /><i /><span>13</span></div>
            <div className="xk-classified-stamp" aria-hidden="true">CLASSIFIED // LEVEL ∆</div>
            <div className="xk-green-content">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#32FF8A]/70">BLACK_ARCHIVE // WISP_INFECTION_ACCEPTED</p>
                <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-[#32FF8A]/50 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10" aria-label={t.switchLanguage} title={t.switchLanguage}>{t.switchCode}</button>
              </div>
              <div className="mt-6">
                <div className="xk-occult-copy">
                  <p className="xk-occult-eyebrow">{t.dossier}</p>
                  <h1 id="green-title" className="xk-occult-title">{t.title}</h1>
                  <p className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-[#B9FFD1] md:text-base">{t.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2 font-mono text-[9px] font-black uppercase tracking-[0.18em]">
                    <span className="rounded-full border border-[#32FF8A]/35 bg-[#32FF8A]/[0.07] px-3 py-2 text-[#32FF8A]"><span aria-hidden="true">●</span> {t.liveSignal}</span>
                    <span className="rounded-full border border-white/10 px-3 py-2 text-[#B9FFD1]/65">{t.sync}</span>
                  </div>
                </div>
              </div>

              <NexusDistrict tone="green" />

              <nav className="xk-green-view-nav" aria-label={t.views.aria}>
                {([
                  ['overview', t.views.overview, t.views.overviewDetail, '◬'],
                  ['dossiers', t.views.dossiers, t.views.dossiersDetail, '13'],
                  ['terminal', t.views.terminal, t.views.terminalDetail, '>_'],
                  ['signals', t.views.signals, t.views.signalsDetail, '⌁'],
                ] as const).map(([view, label, detail, glyph]) => <button key={view} type="button" aria-pressed={activeView === view} onClick={() => selectView(view)}><span aria-hidden="true">{glyph}</span><b>{label}</b><small>{detail}</small></button>)}
              </nav>

              <GreenNodeWispGuide activeView={activeView} ready={accessSequence >= 4} onNavigate={selectView} />

              <div id="green-view-content" className={`xk-green-view is-${activeView}`} tabIndex={-1}>

              {activeView === 'overview' ? <>
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" role="tablist" aria-label={t.nodeSelector}>
                {t.blocks.map((node, index) => (
                  <button
                    key={node.id}
                    id={`green-tab-${node.id}`}
                    type="button"
                    role="tab"
                    aria-selected={active.id === node.id}
                    aria-controls="signal-archive"
                    tabIndex={active.id === node.id ? 0 : -1}
                    onClick={() => openNode(node.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveNodeFocus(index, 1) }
                      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveNodeFocus(index, -1) }
                    }}
                    className={`group rounded-2xl border p-5 text-left font-mono shadow-[0_0_18px_rgba(50,255,138,.12)] transition hover:-translate-y-1 ${active.id === node.id ? 'border-[#D8FFE8]/70 bg-[#0A2612]' : 'border-[#32FF8A]/35 bg-[#031006]/80 hover:border-[#32FF8A]/80'}`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/55"><span aria-hidden="true">◬</span> {node.signal}</p>
                    <h2 className="mt-3 text-lg font-black uppercase tracking-[0.12em] text-[#D8FFE8]">{node.title}</h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{node.text}</p>
                    <span className="mt-4 inline-flex text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
                  </button>
                ))}
              </div>

              <PortalPulseRail tone="green" eyebrow={t.loop.eyebrow} title={t.loop.title} description={t.loop.description} items={t.loop.items} />
              <aside className="xk-green-overview-brief"><small>{t.status}</small><div><button type="button" onClick={() => selectView('dossiers')}>{t.views.dossiers} →</button><button type="button" onClick={() => selectView('terminal')}>{t.views.terminal} →</button></div></aside>
              </> : null}

              {activeView === 'terminal' ? <>
              <section id="terminal" className="xk-green-terminal scroll-mt-28" aria-labelledby="green-terminal-title" tabIndex={-1}>
                <header><div aria-hidden="true"><i /><i /><i /></div><p id="green-terminal-title">root@xethkioz:~/black_archive</p><button type="button" aria-pressed={deepMode} onClick={() => setDeepMode((current) => !current)}>{deepMode ? t.terminal.disableDeep : t.terminal.enableDeep}</button></header>
                <div className="xk-terminal-screen" role="log" aria-live="polite" aria-relevant="additions">{terminalLines.map((line, index) => <p key={`${line}-${index}`}><span aria-hidden="true">{index === terminalLines.length - 1 ? '›' : '·'}</span>{line}</p>)}</div>
                <form onSubmit={runTerminalCommand}><label htmlFor="green-command" className="sr-only">{t.terminal.commandLabel}</label><span aria-hidden="true">visitor@green-node:~$</span><input id="green-command" value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} autoComplete="off" spellCheck={false} maxLength={40} placeholder="help" /><button type="submit">{t.terminal.run} ↵</button></form>
                <small>{t.terminal.safe}</small>
              </section>

              {deepMode && <aside className="xk-deep-reveal" role="status"><p>{t.reveal.eyebrow}</p><b>{t.reveal.title}</b><span>{t.reveal.description}</span></aside>}
              </> : null}

              {activeView === 'dossiers' ? <>
              <section id="archive" className="xk-green-investigation scroll-mt-28" aria-labelledby="green-investigation-title" tabIndex={-1}>
                <header>
                  <div><small>{t.investigation.eyebrow}</small><h2 id="green-investigation-title">{t.investigation.title}</h2><p>{t.investigation.description}</p></div>
                  <button type="button" onClick={resetInvestigation}>{t.investigation.reset}</button>
                </header>
                <div className="xk-investigation-stats" aria-live="polite">
                  <div><span>{t.investigation.read}</span><b>{readDossiers.size} / {greenNodeDossiers.length}</b><i><em style={{ width: `${(readDossiers.size / greenNodeDossiers.length) * 100}%` }} /></i><small>{t.investigation.files}</small></div>
                  <div><span>{t.investigation.signals}</span><b>{signalFragments.size} / {t.investigation.fragments.length}</b><i><em style={{ width: `${(signalFragments.size / t.investigation.fragments.length) * 100}%` }} /></i><small>{t.investigation.clearance} 0{clearance}</small></div>
                </div>
                <ol className="xk-signal-fragments">
                  {t.investigation.fragments.map((fragment, index) => {
                    const recovered = signalFragments.has(fragment.id)
                    return <li key={fragment.id} className={recovered ? 'is-recovered' : ''}><span>0{index + 1}</span><div><b>{recovered ? fragment.code : '████-██'}</b><small>{recovered ? t.investigation.recovered : fragment.hint}</small></div></li>
                  })}
                </ol>
                <div className={`xk-correlation-core${investigationComplete ? ' is-ready' : ''}${finalReveal ? ' is-open' : ''}`}>
                  <span aria-hidden="true">∆13</span>
                  <div><small>{investigationComplete ? t.investigation.finalReady : t.investigation.finalLocked}</small>{investigationComplete && !finalReveal ? <code>{t.investigation.finalCommand}</code> : null}{finalReveal ? <><h3>{t.investigation.finalTitle}</h3><p>{t.investigation.finalText}</p></> : null}</div>
                </div>
              </section>

              <section className="xk-dossier-vault scroll-mt-28" id="classified-files" aria-labelledby="classified-files-title">
                <header className="xk-dossier-vault-head">
                  <div><small>{t.dossiers.eyebrow}</small><h2 id="classified-files-title">{t.dossiers.title}</h2><p>{t.dossiers.description}</p></div>
                  <div className="xk-clearance-meter" aria-label={`${t.dossiers.level}: ${clearance}/3`}><span>{t.dossiers.level}</span><b>0{clearance} / 03</b><i style={{ '--clearance': `${clearance * 33.333}%` } as React.CSSProperties} /></div>
                </header>
                <nav className="xk-dossier-filters" aria-label={t.dossiers.title}>
                  {([
                    ['all', t.dossiers.all], ['hacktivism', t.dossiers.hacktivism], ['law-enforcement', t.dossiers.police], ['declassified', t.dossiers.declassified], ['mystery', t.dossiers.mystery],
                  ] as const).map(([id, label]) => <button key={id} type="button" aria-pressed={dossierFilter === id} onClick={() => setDossierFilter(id)}>{label}</button>)}
                </nav>
                <div className="xk-dossier-search"><label><span>{t.dossiers.search}</span><input type="search" value={dossierQuery} onChange={(event) => setDossierQuery(event.target.value)} placeholder={t.dossiers.searchPlaceholder} /></label><b>{dossiers.length} / {greenNodeDossiers.length} {t.dossiers.showing}</b></div>
                <div className="xk-dossier-grid">
                  {dossiers.map((dossier) => dossier.clearance <= clearance ? (
                    <details key={dossier.id} className={`xk-dossier-card is-${dossier.evidence}${readDossiers.has(dossier.id) ? ' is-read' : ''}`} onToggle={(event) => { if (event.currentTarget.open) markDossierRead(dossier.id) }}>
                      <summary><div><small>{dossier.code} // {dossier.period}</small><h3>{dossier.title[lang]}</h3></div><span>{t.dossiers[dossier.evidence]}</span></summary>
                      <div className="xk-dossier-body"><p>{dossier.summary[lang]}</p><div className="xk-dossier-facts"><div><b>{t.dossiers.confirmed}</b><span>{dossier.confirmed[lang]}</span></div><div><b>{t.dossiers.unresolved}</b><span>{dossier.unresolved[lang]}</span></div></div><a className="xk-dossier-source" href={dossier.sourceHref} target="_blank" rel="noopener noreferrer">{t.dossiers.source}: {dossier.sourceLabel} ↗</a></div>
                    </details>
                  ) : (
                    <article key={dossier.id} className="xk-dossier-locked"><div><b>████ // {t.dossiers.locked} // LVL 0{dossier.clearance}</b><span>{t.dossiers.unlock}</span><a href="#terminal">root@green-node:~$ help ↑</a></div></article>
                  ))}
                </div>
                {!dossiers.length ? <p className="xk-dossier-no-results" role="status">{t.dossiers.noResults}</p> : null}
              </section>
              </> : null}

              {activeView === 'signals' ? <>
              <section id="signal-archive" className="mt-6 scroll-mt-28 overflow-hidden rounded-2xl border border-[#32FF8A]/35 bg-[radial-gradient(circle_at_90%_10%,rgba(50,255,138,.13),transparent_32%),rgba(3,16,6,.88)] p-5 font-mono md:p-7" role="tabpanel" aria-labelledby={`green-tab-${active.id}`} aria-live="polite">
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

              <section id="evidence" className="mt-8 scroll-mt-28 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono" aria-labelledby="evidence-title" tabIndex={-1}>
                <p id="evidence-title" className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{t.articleTitle}</p>
                {loadingNews ? <p className="mt-4 text-xs text-[#B9FFD1]/60" role="status" aria-live="polite">{t.loading}</p> : null}
                {articles.length > 0 ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {articles.map((article) => (
                    <article key={article.slug} className="group overflow-hidden rounded-2xl border border-[#32FF8A]/20 bg-[#031006]/80 p-5 transition hover:-translate-y-1 hover:border-[#32FF8A]/70">
                      {article.cover_image_url ? <SafeImage src={article.cover_image_url} fallback="/images/articles/tech.svg" alt={article.cover_image_alt || article.title} className="mb-4 aspect-[16/8] w-full rounded-xl object-cover transition duration-700 group-hover:scale-[1.025]" /> : null}
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]/70">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                      <h3 className="mt-3 text-sm font-black uppercase text-[#D8FFE8]">{article.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{article.summary}</p>
                      <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
                    </article>
                  ))}
                </div> : !loadingNews ? <p className="xk-empty-signal" role="status">{t.empty}</p> : null}
              </section>
              </> : null}

              </div>

              <div className="mt-8"><PublicAdSlot slotId="section-sidebar" fallbackLabel={t.sponsor} /></div>
              <div className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono text-xs leading-relaxed text-[#B9FFD1]">{t.status}</div>
              <Link to="/" className="mt-8 inline-flex rounded-full border border-[#32FF8A]/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_18px_rgba(50,255,138,.24)]">{t.close}</Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
