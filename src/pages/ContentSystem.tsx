
import SEO from '../components/SEO'
import ContentOpsDashboard from '../components/ContentOpsDashboard'
import DailyNewsSourcesPanel from '../components/DailyNewsSourcesPanel'
import NetworkFinalQaPanel from '../components/NetworkFinalQaPanel'
import EditorialCommandCenter from '../components/EditorialCommandCenter'

export default function ContentSystem() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Content System"
        description="Sistema editorial RC2.3 para XETHKIOZ Network: noticias propias, fuentes externas, informes, videos, comunidad y Green Node."
        url="/content-system"
        image="/images/articles/cms-panel.svg"
      />
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-orange/25 bg-ink-300 p-6 md:p-9 shadow-[0_0_48px_rgba(255,106,0,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl">
          <p className="section-eyebrow">XETHKIOZ RC2.3</p>
          <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">Content System</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Base editorial para cerrar el paso entre maqueta y portal vivo: contenido propio, radar externo con atribución, informes Science Lab, videos funcionales, comunidad y Green Node sin mezclar reglas ni estilos.
          </p>
        </div>
      </section>
      <div className="space-y-8">
        <EditorialCommandCenter />
        <ContentOpsDashboard />
        <DailyNewsSourcesPanel />
        <NetworkFinalQaPanel />
      </div>
    </div>
  )
}
