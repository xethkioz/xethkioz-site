import SEO from '../components/SEO'
import MilestoneRoadmap from '../components/MilestoneRoadmap'
import DataGovernanceMatrix from '../components/DataGovernanceMatrix'
import CommunityProgressionMatrix from '../components/CommunityProgressionMatrix'

export default function Milestones() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Milestones | XETHKIOZ Network"
        description="Plan de progreso de XETHKIOZ Network: Core Platform, Content Platform, Community Platform, Creator Ecosystem y Production Ready."
        url="/milestones"
        image="/og-image.svg"
      />

      <section className="relative mb-8 overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 p-6 md:p-9 shadow-[0_0_56px_rgba(255,106,0,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl">
          <p className="section-eyebrow">Project Control</p>
          <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">Plan maestro de progreso</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Esta pagina queda como tablero de administracion conceptual para no perder el rumbo: arquitectura, datos, contenido, comunidad, creator tools y preparacion LIVE.
          </p>
        </div>
      </section>

      <div className="space-y-8">
        <MilestoneRoadmap />
        <DataGovernanceMatrix />
        <CommunityProgressionMatrix />
      </div>
    </div>
  )
}
