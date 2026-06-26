import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import NetworkPortalHub from '../components/NetworkPortalHub'
import LinkAuditPanel from '../components/LinkAuditPanel'
import NetworkIntegrityPanel from '../components/NetworkIntegrityPanel'
import DatabaseBaselinePanel from '../components/DatabaseBaselinePanel'
import ContentOpsDashboard from '../components/ContentOpsDashboard'
import NetworkFinalQaPanel from '../components/NetworkFinalQaPanel'
import MilestoneRoadmap from '../components/MilestoneRoadmap'
import DataGovernanceMatrix from '../components/DataGovernanceMatrix'
import CommunityProgressionMatrix from '../components/CommunityProgressionMatrix'
import { networkReadiness, dynamicNewsPipeline } from '../lib/networkBlueprint'

const nextSectors = [
  { icon: '🎮', title: 'Gaming & Technology', body: 'Portal principal con noticias, videos, tendencias, streaming y comunidad gamer.' },
  { icon: '🔬', title: 'Science Lab', body: 'División formal para informes, fuentes verificables, evidencia y divulgación profesional.' },
  { icon: '🟢', title: 'Green Node', body: 'Nodo oculto con Linux, programación, ciberseguridad defensiva, OSINT y misterios documentales.' },
  { icon: '🤖', title: 'AI Lab', body: 'Laboratorio futuro para modelos, prompts, automatización editorial y herramientas de IA.' },
  { icon: '🎥', title: 'Creator Studio', body: 'OBS, Kick, Twitch, YouTube, cámaras, audio, overlays y producción audiovisual.' },
  { icon: '💬', title: 'Community OS', body: 'Perfiles, roles, XP, insignias, salas, moderación y reputación dentro del ecosistema.' },
]

export default function Network() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="XETHKIOZ Network"
        description="Mapa modular del ecosistema XETHKIOZ: Gaming, Tecnología, Science Lab, Green Node, AI Lab, Creator Studio y Comunidad."
        url="/network"
        image="/images/articles/xethkioz-cover.svg"
      />

      <section className="relative mb-8 overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 p-6 md:p-9 shadow-[0_0_48px_rgba(255,106,0,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl">
          <p className="section-eyebrow">Ecosystem Map</p>
          <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">XETHKIOZ Network</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            La web deja de funcionar como un sitio único y pasa a ser una red modular. Cada portal tiene identidad propia, pero todos comparten usuarios, CMS, roles, reputación, comunidad y Supabase.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/content-system" className="btn-primary text-sm">Content OS</Link>
            <Link to="/milestones" className="btn-secondary text-sm">Milestones</Link>
            <Link to="/news-engine" className="btn-secondary text-sm">Motor de noticias</Link>
            <Link to="/science" className="btn-secondary text-sm">Science Lab</Link>
          </div>
        </div>
      </section>

      <div className="mb-8"><NetworkPortalHub /></div>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nextSectors.map((sector) => (
          <article key={sector.title} className="glass rounded-2xl border border-white/10 p-5 transition hover:-translate-y-1 hover:border-orange/40">
            <span className="text-3xl">{sector.icon}</span>
            <h2 className="mt-3 font-display text-xl font-black text-white">{sector.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{sector.body}</p>
          </article>
        ))}
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="glass rounded-2xl border border-white/10 p-5">
          <p className="section-eyebrow">Readiness</p>
          <h2 className="font-display text-2xl font-black text-white">Estado de módulos</h2>
          <div className="mt-4 space-y-3">
            {networkReadiness.map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-white">{item.title}</strong>
                  <span className="rounded-full border border-orange/30 bg-orange/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl border border-white/10 p-5">
          <p className="section-eyebrow">Daily Pipeline</p>
          <h2 className="font-display text-2xl font-black text-white">Noticias vivas sin copiar fuentes</h2>
          <div className="mt-4 space-y-3">
            {dynamicNewsPipeline.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-gray-300">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-black text-ink">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-8"><MilestoneRoadmap /></div>
      <div className="mb-8"><DataGovernanceMatrix /></div>
      <div className="mb-8"><CommunityProgressionMatrix /></div>
      <div className="mb-8"><ContentOpsDashboard /></div>
      <div className="mb-8"><NetworkIntegrityPanel /></div>
      <div className="mb-8"><DatabaseBaselinePanel /></div>
      <div className="mb-8"><NetworkFinalQaPanel /></div>
      <LinkAuditPanel />
    </div>
  )
}
