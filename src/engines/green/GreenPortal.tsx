import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../lib/LangContext'

interface KnowledgeNode {
  lvl: string
  title: string
  description: string
  topics: string[]
  category: 'DOCUMENTED' | 'UNVERIFIED' | 'CLASSIFIED'
}

const knowledge: Record<'es' | 'en', KnowledgeNode[]> = {
  es: [
    { lvl: 'LVL 1 - 30', title: 'El camino inicial', description: 'Conceptos fundamentales de sistemas abiertos y entornos de comandos para ingresar al mundo verde.', topics: ['Linux & terminal básica', 'Entornos Ubuntu / Debian', 'Comandos Bash elementales'], category: 'DOCUMENTED' },
    { lvl: 'LVL 31 - 60', title: 'El camino avanzado', description: 'Automatización, scripts avanzados de desarrollo y herramientas de código abierto sin copyright.', topics: ['Scripts en Python y Bash', 'Manejo de Docker y contenedores', 'Herramientas Open Source'], category: 'UNVERIFIED' },
    { lvl: 'LVL 61 - 100', title: 'El camino profundo', description: 'Estudio educativo y responsable sobre privacidad, criptografía y misterios ocultos de internet.', topics: ['Historia de la Deep & Dark Web', 'Criptografía y privacidad de datos', 'Teorías UAP y desclasificados'], category: 'CLASSIFIED' },
  ],
  en: [
    { lvl: 'LVL 1 - 30', title: 'Initial path', description: 'Core concepts of open systems and command environments to enter the green world.', topics: ['Linux & basic terminal', 'Ubuntu / Debian environments', 'Elementary Bash commands'], category: 'DOCUMENTED' },
    { lvl: 'LVL 31 - 60', title: 'Advanced path', description: 'Automation, advanced development scripts and open-source tools without copyright friction.', topics: ['Python and Bash scripts', 'Docker and container handling', 'Open Source tools'], category: 'UNVERIFIED' },
    { lvl: 'LVL 61 - 100', title: 'Deep path', description: 'Responsible educational study about privacy, cryptography and hidden internet mysteries.', topics: ['Deep & Dark Web history', 'Cryptography and data privacy', 'UAP theories and declassified files'], category: 'CLASSIFIED' },
  ],
}

const copy = {
  es: {
    back: '⏴ Volver al Núcleo // Desconectar Terminal _',
    status: 'SECURE_NODE // MATRIX_OVERRIDE_ACTIVE',
    title: 'La Matrix verde de XETHKIOZ',
    subtitle: 'Sección oculta, simplificada y separada del resto. No compite con Gaming, Ciencia o Fun: se descubre tocando el Wisp.',
  },
  en: {
    back: '⏴ Back to Core // Disconnect Terminal _',
    status: 'SECURE_NODE // MATRIX_OVERRIDE_ACTIVE',
    title: 'The green Matrix of XETHKIOZ',
    subtitle: 'Hidden, simplified and isolated section. It does not compete with Gaming, Science or Fun: it is discovered by touching Wisp.',
  },
} as const

export function GreenPortal() {
  const { lang } = useLang()
  const ui = copy[lang]
  const knowledgeTree = useMemo(() => knowledge[lang], [lang])

  return (
    <div className="relative min-h-screen bg-fusionBg pb-12 text-gray-300 selection:bg-fusionAccent-greenNode/30">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.14),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.65),#050505)]" />
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 pt-24 sm:px-6">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.22em] text-fusionAccent-greenNode hover:underline">{ui.back}</Link>
        <div className="animate-pulse font-mono text-[10px] uppercase tracking-[0.22em] text-gray-600">{ui.status}</div>
      </header>
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-12 sm:px-6">
        <section className="panel-cyber flex flex-col gap-2 border-l-2 border-l-fusionAccent-greenNode p-8">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.2)] md:text-4xl">{ui.title}</h1>
          <p className="max-w-3xl text-sm text-gray-400">{ui.subtitle}</p>
        </section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {knowledgeTree.map((node) => (
            <article key={node.lvl} className="panel-cyber group flex min-h-[300px] flex-col justify-between p-6 transition duration-300 hover:border-fusionAccent-greenNode/60 hover:shadow-glow-green">
              <div className="flex items-center justify-between border-b border-fusionSurface-muted pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-fusionAccent-greenNode">{node.lvl}</span>
                <span className="rounded border border-fusionAccent-greenNode/30 px-2 py-0.5 font-mono text-[9px] text-fusionAccent-greenNode">{node.category}</span>
              </div>
              <div className="my-4 flex flex-1 flex-col gap-2">
                <h2 className="text-lg font-bold uppercase text-white transition-colors group-hover:text-fusionAccent-greenNode">{node.title}</h2>
                <p className="text-xs leading-relaxed text-gray-400">{node.description}</p>
              </div>
              <div className="border-t border-fusionSurface-muted pt-3">
                <ul className="flex flex-col gap-1 font-mono text-[11px] text-gray-500">
                  {node.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2"><span className="text-fusionAccent-greenNode">›</span> {topic}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default GreenPortal
