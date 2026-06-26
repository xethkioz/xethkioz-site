const levels = [
  { tier: 'Visitante', xp: '0 XP', benefit: 'Lectura y acceso publico.' },
  { tier: 'Miembro', xp: '100 XP', benefit: 'Perfil, comentarios y chat general.' },
  { tier: 'Colaborador', xp: '750 XP', benefit: 'Puede proponer noticias y reportar fuentes.' },
  { tier: 'Donador', xp: 'Apoyo + reputacion', benefit: 'Insignia, color de nombre y acceso anticipado.' },
  { tier: 'Embajador', xp: '3.000 XP', benefit: 'Misiones, eventos y menciones comunitarias.' },
  { tier: 'Moderador temporal', xp: 'Confianza + historial', benefit: 'Permisos limitados por tiempo y revision del staff.' },
  { tier: 'Editor', xp: 'Staff', benefit: 'Publicacion de contenido y gestion editorial.' },
]

const xpEvents = ['Lectura verificada', 'Comentario util', 'Reaccion recibida', 'Compartir contenido', 'Participar en chat', 'Asistir a directo', 'Aporte de fuente', 'Reporte de bug']

export default function CommunityProgressionMatrix() {
  return (
    <section className="glass rounded-3xl border border-white/10 p-5 md:p-7">
      <p className="section-eyebrow">Community OS</p>
      <h2 className="font-display text-2xl md:text-3xl font-black text-white">XP, insignias y moderacion temporal</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
        La progresion premia participacion real. Las donaciones suman beneficios, pero la moderacion requiere confianza, historial positivo y aprobacion del equipo.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {levels.map((level, index) => (
            <div key={level.tier} className="grid grid-cols-1 gap-2 border-b border-white/10 bg-black/25 p-4 last:border-b-0 md:grid-cols-[.45fr_.35fr_1fr]">
              <strong className="text-white"><span className="mr-2 text-orange">{index + 1}</span>{level.tier}</strong>
              <span className="text-sm font-bold text-neon">{level.xp}</span>
              <span className="text-sm text-gray-400">{level.benefit}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <h3 className="font-display text-xl font-black text-white">Eventos que generan XP</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {xpEvents.map((event) => (
              <span key={event} className="rounded-full border border-orange/20 bg-orange/10 px-3 py-1.5 text-xs font-bold text-orange">{event}</span>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-neon/20 bg-neon/5 p-4 text-sm leading-relaxed text-neon/80">
            Regla central: reputacion primero, dinero despues. Nadie obtiene moderacion solo por donar.
          </div>
        </div>
      </div>
    </section>
  )
}
