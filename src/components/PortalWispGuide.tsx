import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import './PortalWispGuide.css'

export type PortalWispVariant = 'fun' | 'gaming'
type WispEnergy = 'light' | 'joy' | 'fire' | 'arcane' | 'ice'

type GuideStep = {
  destination: string
  energy: WispEnergy
  eyebrow: string
  title: string
  description: string
  tip: string
  action?: { label: string; to: string }
}

type GuideCopy = {
  name: string
  identity: string
  launcher: string
  status: string
  close: string
  previous: string
  next: string
  finish: string
  skip: string
  progress: string
  tipLabel: string
  steps: readonly GuideStep[]
}

const copy: Record<'es' | 'en', Record<PortalWispVariant, GuideCopy>> = {
  es: {
    fun: {
      name: 'LÚMINA', identity: 'WISP DE LUZ Y RISA', launcher: 'Tocame y te muestro todo Memes y Diversión', status: 'CANAL DE DIVERSIÓN ACTIVO', close: 'Cerrar la guía de Lúmina', previous: 'Anterior', next: 'Siguiente', finish: '¡Entendido!', skip: 'Omitir recorrido', progress: 'Progreso de la guía de Diversión', tipLabel: 'CHISPA DE LÚMINA',
      steps: [
        { destination: 'play', energy: 'light', eyebrow: 'BIENVENIDA // DOS EXPERIENCIAS', title: 'Soy Lúmina, tu Wisp de luz y risa', description: 'Diversión tiene dos entradas: Modo Juego abre Plaza Nexus, misiones y mundo social; Modo Memes reúne humor, clips y contenido para compartir.', tip: 'Podés cerrar esta explicación. Para volver a verla, sólo tenés que tocarme otra vez.' },
        { destination: 'play', energy: 'joy', eyebrow: 'MODO JUEGO // PLAZA NEXUS', title: 'Explorá un mundo social estilo RPG portátil', description: 'Caminá por la Plaza, entrá a Casa Wisp, usá consumibles, hablá en la Gran Sala y cruzá el umbral de salas privadas por invitación.', tip: 'La tienda usa fragmentos ganados jugando; las donaciones no compran poder ni acceso social.' },
        { destination: 'memes-arcade', energy: 'joy', eyebrow: 'ARCADE // HUMOR INTERACTIVO', title: 'Generá chistes, mantené una racha y votá batallas', description: 'Elegí humor gamer, adulto o de trabajo; pedí otra dosis de caos y participá en duelos de memes. Todo funciona sin cuenta.', tip: 'La racha y los votos son parte de la sesión de juego; no se envían datos personales.' },
        { destination: 'memes-clips', energy: 'light', eyebrow: 'CLIPS // SEÑALES SOCIALES', title: 'Reproducí el clip semanal y seguí las redes oficiales', description: 'Clips separa el momento destacado de los accesos a TikTok, Threads, Instagram y YouTube para que puedas continuar donde prefieras.', tip: 'Los enlaces externos están identificados y abren en otra pestaña.' },
        { destination: 'memes-wall', energy: 'joy', eyebrow: 'MURO // TODO EL CONTENIDO', title: 'Leé, reaccioná y compartí cada publicación', description: 'El Muro reúne las piezas completas de Meme Core. Podés abrir el episodio, sumar una reacción o compartirlo directamente.', tip: 'Lúmina recuerda la finalización sólo en este dispositivo; no necesita cuenta.', action: { label: 'Entrar a la comunidad', to: '/community' } },
      ],
    },
    gaming: {
      name: 'WISP ELEMENTAL', identity: 'FUEGO // ARCANO // HIELO', launcher: 'Activame y te explico todo el portal de Juegos', status: 'NÚCLEO ELEMENTAL SINCRONIZADO', close: 'Cerrar la guía del Wisp Elemental', previous: 'Anterior', next: 'Siguiente', finish: 'Entrar al juego', skip: 'Omitir recorrido', progress: 'Progreso de la guía de Juegos', tipLabel: 'CONSEJO ELEMENTAL',
      steps: [
        { destination: 'overview', energy: 'arcane', eyebrow: 'NÚCLEO ARCANO // MAPA DEL PORTAL', title: 'Tres energías para recorrer Gaming', description: 'Fuego detecta novedades y directos, Arcano organiza guías y builds, e Hielo analiza señales y decisiones antes de entrar a un nuevo mundo.', tip: 'El color cambia con la explicación: cada elemento representa un tipo de contenido.' },
        { destination: 'overview', energy: 'ice', eyebrow: 'INICIO // ELEGÍ UNA RUTA', title: 'La portada abre sólo lo que necesitás', description: 'Desde Inicio podés ir a Guías, Radar, Directos o Comunidad. Las secciones pesadas se montan únicamente cuando las elegís.', tip: 'Esto mantiene Gaming claro y rápido tanto en PC como en celular.' },
        { destination: 'guides', energy: 'arcane', eyebrow: 'ARCANO // GUÍAS Y BUILDS', title: 'Prepará tu personaje con una ruta completa', description: 'La rotación muestra los juegos principales; la biblioteca completa ordena juego, clase y build con habilidades, estadísticas, equipo, rotación, versión y fuente.', tip: 'Usá Builds por clase para una configuración y Rutas generales para leveleo, economía o endgame.', action: { label: 'Abrir biblioteca completa', to: '/gaming/guides' } },
        { destination: 'live', energy: 'fire', eyebrow: 'FUEGO // DIRECTOS Y VIDEO', title: 'Seguí la señal de Kick y los últimos VOD', description: 'El radar indica si el CMS marcó un directo activo. Si el canal está en espera, mantiene disponibles Kick y YouTube.', tip: 'El estado distingue una señal confirmada en el CMS de un simple enlace al canal.' },
        { destination: 'news', energy: 'fire', eyebrow: 'FUEGO + HIELO // RADAR GAMER', title: 'Revisá lanzamientos, industria y Asia Gaming', description: 'Las transmisiones del Nexus reúnen noticias con fecha y fuente. También siguen Corea, Japón, China y SEA antes de que sus tendencias lleguen a LATAM.', tip: 'Comprobá región y fecha: un estreno asiático no siempre implica lanzamiento global.', action: { label: 'Abrir todas las noticias', to: '/news?category=gaming' } },
        { destination: 'community', energy: 'ice', eyebrow: 'HIELO // COMUNIDAD Y ARMERÍA', title: 'Buscá escuadrón, compartí builds y revisá el setup', description: 'Esta zona concentra la comunidad, la biblioteca, el radar de estrenos y una armería que sólo publicará hardware cuando esté confirmado.', tip: 'El recorrido se guarda sólo en este dispositivo y podés reabrirlo tocando al Wisp Elemental.', action: { label: 'Entrar al Nexus', to: '/community' } },
      ],
    },
  },
  en: {
    fun: {
      name: 'LUMINA', identity: 'WISP OF LIGHT AND LAUGHTER', launcher: 'Tap me and I will explain Memes and Fun', status: 'FUN CHANNEL ACTIVE', close: 'Close Lumina guide', previous: 'Previous', next: 'Next', finish: 'Got it!', skip: 'Skip tour', progress: 'Fun guide progress', tipLabel: 'LUMINA SPARK',
      steps: [
        { destination: 'play', energy: 'light', eyebrow: 'WELCOME // TWO EXPERIENCES', title: 'I am Lumina, your Wisp of light and laughter', description: 'Fun has two entrances: Game Mode opens Nexus Plaza, missions and the social world; Meme Mode brings together humor, clips and shareable content.', tip: 'Close this explanation whenever you want. Tap me again to reopen it.' },
        { destination: 'play', energy: 'joy', eyebrow: 'GAME MODE // NEXUS PLAZA', title: 'Explore a handheld-style social RPG world', description: 'Walk across the Plaza, enter Wisp House, use consumables, talk in the Grand Hall and cross into invite-only private rooms.', tip: 'The shop uses shards earned through play; donations never buy power or social access.' },
        { destination: 'memes-arcade', energy: 'joy', eyebrow: 'ARCADE // INTERACTIVE HUMOR', title: 'Generate jokes, build a streak and vote in battles', description: 'Choose gaming, adult or work humor, request another dose of chaos and join meme battles. No account is needed.', tip: 'Streaks and votes are part of the play session; no personal data is sent.' },
        { destination: 'memes-clips', energy: 'light', eyebrow: 'CLIPS // SOCIAL SIGNALS', title: 'Play the weekly clip and follow official channels', description: 'Clips separates the featured moment from TikTok, Threads, Instagram and YouTube shortcuts.', tip: 'External links are identified and open in another tab.' },
        { destination: 'memes-wall', energy: 'joy', eyebrow: 'WALL // ALL CONTENT', title: 'Read, react and share every post', description: 'The Wall gathers complete Meme Core posts. Open an episode, add a reaction or share it directly.', tip: 'Lumina stores completion only on this device; no account is needed.', action: { label: 'Enter the community', to: '/community' } },
      ],
    },
    gaming: {
      name: 'ELEMENTAL WISP', identity: 'FIRE // ARCANE // ICE', launcher: 'Activate me and I will explain the Games portal', status: 'ELEMENTAL CORE SYNCHRONIZED', close: 'Close Elemental Wisp guide', previous: 'Previous', next: 'Next', finish: 'Enter the game', skip: 'Skip tour', progress: 'Games guide progress', tipLabel: 'ELEMENTAL TIP',
      steps: [
        { destination: 'overview', energy: 'arcane', eyebrow: 'ARCANE CORE // PORTAL MAP', title: 'Three energies to navigate Gaming', description: 'Fire detects news and live signals, Arcane organizes guides and builds, and Ice analyzes signals before entering a new world.', tip: 'Color changes with the explanation: each element represents a content type.' },
        { destination: 'overview', energy: 'ice', eyebrow: 'START // CHOOSE A ROUTE', title: 'The home screen opens only what you need', description: 'Start gives direct access to Guides, Radar, Live and Community. Heavy sections mount only after you select them.', tip: 'This keeps Gaming clear and fast on desktop and mobile.' },
        { destination: 'guides', energy: 'arcane', eyebrow: 'ARCANE // GUIDES AND BUILDS', title: 'Prepare your character with a complete route', description: 'The rotation shows key games; the complete library organizes game, class and build with skills, stats, gear, rotation, version and source.', tip: 'Use Builds by class for a setup and General routes for leveling, economy or endgame.', action: { label: 'Open complete library', to: '/gaming/guides' } },
        { destination: 'live', energy: 'fire', eyebrow: 'FIRE // LIVE AND VIDEO', title: 'Follow the Kick signal and latest VOD', description: 'The radar shows whether the CMS marked a live broadcast. When the channel is idle, Kick and YouTube remain available.', tip: 'Status separates a CMS-confirmed signal from a simple channel link.' },
        { destination: 'news', energy: 'fire', eyebrow: 'FIRE + ICE // GAMING RADAR', title: 'Review releases, industry and Asia Gaming', description: 'Nexus transmissions gather dated, sourced news and follow Korea, Japan, China and SEA before trends reach LATAM.', tip: 'Check region and date: an Asian release does not always imply a global launch.', action: { label: 'Open all news', to: '/news?category=gaming' } },
        { destination: 'community', energy: 'ice', eyebrow: 'ICE // COMMUNITY AND ARMORY', title: 'Find a squad, share builds and inspect the setup', description: 'This area brings together community, guides, the release radar and an armory that publishes hardware only after confirmation.', tip: 'The tour stays on this device. Reopen it by tapping the Elemental Wisp.', action: { label: 'Enter Nexus', to: '/community' } },
      ],
    },
  },
}

const completionKeys: Record<PortalWispVariant, string> = {
  fun: 'xethkioz.fun.wisp-guide.v1',
  gaming: 'xethkioz.gaming.wisp-guide.v1',
}

function PortalWispVisual({ variant, energy }: { variant: PortalWispVariant; energy: WispEnergy }) {
  return <span className="xk-portal-wisp-visual" data-variant={variant} data-energy={energy} aria-hidden="true"><span className="xk-portal-wisp-aura" /><span className="xk-portal-wisp-orbit is-outer" /><span className="xk-portal-wisp-orbit is-inner" /><span className="xk-portal-wisp-core"><i className="xk-portal-wisp-eye is-left" /><i className="xk-portal-wisp-eye is-right" /><i className="xk-portal-wisp-mouth" /><i className="xk-portal-wisp-sigil">✦</i></span><span className="xk-portal-wisp-tail is-one" /><span className="xk-portal-wisp-tail is-two" /><span className="xk-portal-wisp-particles">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</span></span>
}

type PortalWispGuideProps = {
  variant: PortalWispVariant
  activeDestination: string
  onNavigate: (destination: string) => void
}

export default function PortalWispGuide({ variant, activeDestination, onNavigate }: PortalWispGuideProps) {
  const { lang } = useLang()
  const t = copy[lang][variant]
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const panelRef = useRef<HTMLElement>(null)
  const step = t.steps[stepIndex]

  function showStep(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(t.steps.length - 1, nextIndex))
    setStepIndex(boundedIndex)
    onNavigate(t.steps[boundedIndex].destination)
  }

  function rememberCompletion() {
    try { window.localStorage.setItem(completionKeys[variant], 'complete') } catch { /* The guide remains dismissible for this visit. */ }
    setOpen(false)
  }

  function reopenGuide() {
    const matchingStep = t.steps.findIndex((item) => item.destination === activeDestination)
    setStepIndex(matchingStep >= 0 ? matchingStep : 0)
    setOpen(true)
    window.requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }))
  }

  if (!open) return <aside ref={panelRef} className="xk-portal-wisp-launcher" data-variant={variant} aria-label={t.launcher}><button type="button" onClick={reopenGuide}><PortalWispVisual variant={variant} energy={variant === 'fun' ? 'light' : 'arcane'} /><span><small>{t.identity}</small><b>{t.launcher}</b></span><i aria-hidden="true">?</i></button></aside>

  return <section ref={panelRef} className="xk-portal-wisp-guide" data-variant={variant} data-energy={step.energy} aria-labelledby={`${variant}-wisp-guide-title`} aria-live="polite">
    <div className="xk-portal-wisp-entity"><PortalWispVisual variant={variant} energy={step.energy} /><span><b>{t.name}</b><small>{t.identity}</small></span></div>
    <div className="xk-portal-wisp-dialogue">
      <header><p><span aria-hidden="true">●</span> {t.status}</p><button type="button" onClick={rememberCompletion} aria-label={t.close} title={t.close}>×</button></header>
      <div className="xk-portal-wisp-progress" aria-label={`${t.progress}: ${stepIndex + 1}/${t.steps.length}`}>{t.steps.map((item, index) => <button key={`${item.energy}-${index}`} type="button" className={index === stepIndex ? 'is-active' : index < stepIndex ? 'is-complete' : ''} onClick={() => showStep(index)} aria-label={`${index + 1}: ${item.title}`} aria-current={index === stepIndex ? 'step' : undefined}><span>{index + 1}</span></button>)}</div>
      <p className="xk-portal-wisp-eyebrow">{step.eyebrow}</p><h2 id={`${variant}-wisp-guide-title`}>{step.title}</h2><p className="xk-portal-wisp-copy">{step.description}</p><aside><b>{t.tipLabel}</b><span>{step.tip}</span></aside>
      <footer><button type="button" className="is-skip" onClick={rememberCompletion}>{t.skip}</button><div>{step.action ? <Link to={step.action.to}>{step.action.label} ↗</Link> : null}{stepIndex > 0 ? <button type="button" onClick={() => showStep(stepIndex - 1)}>← {t.previous}</button> : null}<button type="button" className="is-primary" onClick={() => stepIndex === t.steps.length - 1 ? rememberCompletion() : showStep(stepIndex + 1)}>{stepIndex === t.steps.length - 1 ? t.finish : t.next} {stepIndex < t.steps.length - 1 ? '→' : '✓'}</button></div></footer>
    </div>
  </section>
}
