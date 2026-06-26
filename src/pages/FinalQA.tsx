
import SEO from '../components/SEO'
import PublicChatHealthPanel from '../components/PublicChatHealthPanel'
import NetworkFinalQaPanel from '../components/NetworkFinalQaPanel'
import DatabaseBaselinePanel from '../components/DatabaseBaselinePanel'
import LinkAuditPanel from '../components/LinkAuditPanel'

export default function FinalQA() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO title="Final QA" description="Revisión final de enlaces, base de datos, rutas y estado LIVE de XETHKIOZ Network." url="/qa" />
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-neon/25 bg-ink-300 p-6 md:p-9 shadow-[0_0_48px_rgba(138,43,226,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-4xl">
          <p className="section-eyebrow">Release Candidate Control</p>
          <h1 className="font-display text-3xl md:text-6xl font-black gradient-text-purple mb-4">Final QA Board</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Tablero de revisión para evitar publicar con links rotos, SQL incompleto, rutas ocultas sin documentar o secciones sin checklist.
          </p>
        </div>
      </section>
      <div className="space-y-8">
        <NetworkFinalQaPanel />
        <DatabaseBaselinePanel />
        <LinkAuditPanel />
        <PublicChatHealthPanel />
      </div>
    </div>
  )
}
