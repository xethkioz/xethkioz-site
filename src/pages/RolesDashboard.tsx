import SEO from '../components/SEO'
import RoleLadder from '../components/RoleLadder'

export default function RolesDashboard() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Roles y Escalafón"
        description="Sistema base de roles, XP, insignias y moderación temporal de XETHKIOZ."
        url="/roles"
      />

      <section className="relative overflow-hidden rounded-3xl border border-neon/25 bg-ink-300 p-6 md:p-8 mb-8 shadow-[0_0_48px_rgba(168,85,247,0.12)]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <p className="section-eyebrow">XETHKIOZ Community OS</p>
          <h1 className="font-display text-3xl md:text-6xl font-black gradient-text mb-4">Escalafón, premios y moderación</h1>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            Base funcional para convertir la participación en progreso visible: XP, insignias, roles, beneficios y elegibilidad para moderación temporal según actividad positiva y confianza.
          </p>
        </div>
      </section>

      <RoleLadder />
    </div>
  )
}
