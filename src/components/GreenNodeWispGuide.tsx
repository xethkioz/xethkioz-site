import { useEffect, useRef, useState } from 'react'
import SafeImage from './SafeImage'
import { useLang } from '../lib/LangContext'
import { WISP_GREEN_GUIDE_EVENT, WISP_GREEN_GUIDE_STORAGE_KEY } from '../lib/wispGuide'
import './GreenNodeWispGuide.css'

export type GreenNodeView = 'overview' | 'dossiers' | 'terminal' | 'signals'

type GuideStep = {
  view: GreenNodeView
  eyebrow: string
  title: string
  description: string
  tip: string
}

type GuideCopy = {
  closedEyebrow: string
  closedTitle: string
  status: string
  close: string
  previous: string
  next: string
  finish: string
  skip: string
  progress: string
  steps: readonly GuideStep[]
}

const copy: Record<'es' | 'en', GuideCopy> = {
  es: {
    closedEyebrow: 'WISP // GUÍA DISPONIBLE',
    closedTitle: '¿Necesitás ayuda para recorrer Green Node?',
    status: 'CANAL DE ASISTENCIA ACTIVO',
    close: 'Cerrar la guía de WISP',
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Entendido',
    skip: 'Omitir recorrido',
    progress: 'Progreso de la guía',
    steps: [
      {
        view: 'overview',
        eyebrow: 'PUERTA DE ENTRADA // MAPA DEL NODO',
        title: 'Yo te voy a guiar por Green Node',
        description: 'Esta portada reúne cuatro rutas. Podés entrar a expedientes documentados, usar una terminal simulada o revisar intercepciones agrupadas por tema.',
        tip: 'Green Node no accede a tu PC ni ejecuta comandos reales. Toda la experiencia ocurre dentro de la web.',
      },
      {
        view: 'dossiers',
        eyebrow: 'EXPEDIENTES // INVESTIGACIÓN_13',
        title: 'Abrí casos y contrastá sus fuentes',
        description: 'Usá el buscador o los filtros, abrí un expediente y compará “Confirmado” con “Límite / duda”. Cada caso leído suma progreso y algunos esconden fragmentos de señal.',
        tip: 'El enlace naranja abre la fuente primaria. Los archivos cifrados requieren subir el nivel de acceso desde la Terminal.',
      },
      {
        view: 'terminal',
        eyebrow: 'TERMINAL // SIMULACIÓN SEGURA',
        title: 'Escribí help para descubrir los comandos',
        description: 'La terminal sirve para desbloquear niveles, activar Deep Mode y recuperar señales. Empezá con “help”; luego probá los comandos que WISP te muestre.',
        tip: 'No es una consola real: no instala nada, no lee archivos y no toca tu dispositivo.',
      },
      {
        view: 'signals',
        eyebrow: 'INTERCEPCIONES // NODOS TEMÁTICOS',
        title: 'Acá aparece el contenido de cada nodo',
        description: 'Cuando tocás “Abrir nodo” en la portada, WISP te trae a esta sección. Vas a encontrar pasos iniciales, noticias y análisis relacionados con la señal elegida.',
        tip: 'Las etiquetas separan evidencia, hipótesis y ficción para evitar presentar una teoría como un hecho.',
      },
      {
        view: 'dossiers',
        eyebrow: 'MISIÓN // CORRELACIÓN_13',
        title: 'Tu objetivo es recuperar tres fragmentos',
        description: 'Leé los expedientes indicados, ejecutá el protocolo de verdad y buscá el proyecto correcto. Cuando tengas las tres señales, la Terminal revelará el comando final.',
        tip: 'El progreso se guarda sólo en este dispositivo. Podés borrarlo cuando quieras desde Investigación_13.',
      },
    ],
  },
  en: {
    closedEyebrow: 'WISP // GUIDE AVAILABLE',
    closedTitle: 'Need help navigating Green Node?',
    status: 'ASSISTANCE CHANNEL ACTIVE',
    close: 'Close WISP guide',
    previous: 'Previous',
    next: 'Next',
    finish: 'Got it',
    skip: 'Skip tour',
    progress: 'Guide progress',
    steps: [
      {
        view: 'overview',
        eyebrow: 'ENTRY GATE // NODE MAP',
        title: 'I will guide you through Green Node',
        description: 'This entry point has four routes. You can open documented case files, use a simulated terminal or review intercepts grouped by topic.',
        tip: 'Green Node does not access your computer or execute real commands. The entire experience stays inside the website.',
      },
      {
        view: 'dossiers',
        eyebrow: 'CASE FILES // INVESTIGATION_13',
        title: 'Open cases and cross-check their sources',
        description: 'Use search or filters, open a case and compare “Confirmed” with “Limit / doubt”. Every file you read adds progress, and some hide signal fragments.',
        tip: 'The orange link opens the primary source. Encrypted files require a higher clearance from the Terminal.',
      },
      {
        view: 'terminal',
        eyebrow: 'TERMINAL // SAFE SIMULATION',
        title: 'Type help to discover the commands',
        description: 'The terminal unlocks clearance levels, enables Deep Mode and recovers signals. Start with “help”, then try the commands WISP reveals.',
        tip: 'This is not a real console: it installs nothing, reads no files and never touches your device.',
      },
      {
        view: 'signals',
        eyebrow: 'INTERCEPTS // TOPIC NODES',
        title: 'This is where each node opens',
        description: 'When you press “Open node” on the entry page, WISP brings you here. You will find first steps, news and analysis related to the selected signal.',
        tip: 'Labels separate evidence, hypotheses and fiction so a theory is never presented as fact.',
      },
      {
        view: 'dossiers',
        eyebrow: 'MISSION // CORRELATION_13',
        title: 'Your objective is to recover three fragments',
        description: 'Read the indicated files, run the truth protocol and find the correct project. Once all three signals are recovered, the Terminal will reveal the final command.',
        tip: 'Progress is stored only on this device. You can erase it at any time from Investigation_13.',
      },
    ],
  },
}

function guideWasCompleted() {
  try {
    return window.localStorage.getItem(WISP_GREEN_GUIDE_STORAGE_KEY) === 'complete'
  } catch {
    return false
  }
}

type GreenNodeWispGuideProps = {
  activeView: GreenNodeView
  ready: boolean
  onNavigate: (view: GreenNodeView) => void
}

export default function GreenNodeWispGuide({ activeView, ready, onNavigate }: GreenNodeWispGuideProps) {
  const { lang } = useLang()
  const t = copy[lang]
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const panelRef = useRef<HTMLElement>(null)
  const autoOpened = useRef(false)
  const step = t.steps[stepIndex]

  useEffect(() => {
    if (!ready || autoOpened.current || guideWasCompleted()) return
    autoOpened.current = true
    const matchingStep = t.steps.findIndex((item) => item.view === activeView)
    const timer = window.setTimeout(() => {
      setStepIndex(matchingStep >= 0 ? matchingStep : 0)
      setOpen(true)
    }, 420)
    return () => window.clearTimeout(timer)
  }, [activeView, ready, t.steps])

  useEffect(() => {
    const reopenGuide = () => {
      const matchingStep = t.steps.findIndex((item) => item.view === activeView)
      setStepIndex(matchingStep >= 0 ? matchingStep : 0)
      setOpen(true)
      window.requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }))
    }
    window.addEventListener(WISP_GREEN_GUIDE_EVENT, reopenGuide)
    return () => window.removeEventListener(WISP_GREEN_GUIDE_EVENT, reopenGuide)
  }, [activeView, t.steps])

  function showStep(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(t.steps.length - 1, nextIndex))
    setStepIndex(boundedIndex)
    onNavigate(t.steps[boundedIndex].view)
  }

  function rememberCompletion() {
    try { window.localStorage.setItem(WISP_GREEN_GUIDE_STORAGE_KEY, 'complete') } catch { /* The guide remains dismissible for this visit. */ }
    setOpen(false)
  }

  if (!open) {
    return (
      <aside ref={panelRef} className="xk-wisp-guide-launcher" aria-label={t.closedTitle}>
        <button type="button" onClick={() => { setOpen(true); showStep(0) }}>
          <SafeImage src="/assets/identity/wisp-digital-specter-v1.webp" fallback="/images/articles/tech.svg" alt="" aria-hidden="true" />
          <span><small>{t.closedEyebrow}</small><b>{t.closedTitle}</b></span>
          <i aria-hidden="true">?</i>
        </button>
      </aside>
    )
  }

  return (
    <section ref={panelRef} className="xk-wisp-guide" aria-labelledby="wisp-guide-title" aria-live="polite">
      <div className="xk-wisp-guide-entity" aria-hidden="true">
        <span />
        <SafeImage src="/assets/identity/wisp-digital-specter-v1.webp" fallback="/images/articles/tech.svg" alt="" />
      </div>
      <div className="xk-wisp-guide-dialogue">
        <header>
          <p><span aria-hidden="true">●</span> {t.status}</p>
          <button type="button" onClick={rememberCompletion} aria-label={t.close} title={t.close}>×</button>
        </header>
        <div className="xk-wisp-guide-progress" aria-label={`${t.progress}: ${stepIndex + 1}/${t.steps.length}`}>
          {t.steps.map((item, index) => <button key={`${item.view}-${index}`} type="button" className={index === stepIndex ? 'is-active' : index < stepIndex ? 'is-complete' : ''} onClick={() => showStep(index)} aria-label={`${index + 1}: ${item.title}`} aria-current={index === stepIndex ? 'step' : undefined}><span>{index + 1}</span></button>)}
        </div>
        <p className="xk-wisp-guide-eyebrow">{step.eyebrow}</p>
        <h2 id="wisp-guide-title">{step.title}</h2>
        <p className="xk-wisp-guide-copy">{step.description}</p>
        <aside><b>WISP_TIP</b><span>{step.tip}</span></aside>
        <footer>
          <button type="button" className="is-skip" onClick={rememberCompletion}>{t.skip}</button>
          <div>
            {stepIndex > 0 ? <button type="button" onClick={() => showStep(stepIndex - 1)}>← {t.previous}</button> : null}
            <button type="button" className="is-primary" onClick={() => stepIndex === t.steps.length - 1 ? rememberCompletion() : showStep(stepIndex + 1)}>{stepIndex === t.steps.length - 1 ? t.finish : t.next} {stepIndex < t.steps.length - 1 ? '→' : '✓'}</button>
          </div>
        </footer>
      </div>
    </section>
  )
}
