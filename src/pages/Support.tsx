import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { DONATION_LINKS } from '../lib/siteConfig'

const paypalUrl = DONATION_LINKS.paypal
const mercadoPagoUrl = DONATION_LINKS.mercadoPago

export default function Support() {
  const sponsorOptions = [
    'Logo o mención en secciones seleccionadas',
    'Presencia en artículos, videos o streams',
    'Campañas para gaming, tecnología, IA o comunidad',
    'Espacios para marcas locales, regionales o digitales',
  ]

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SEO
        title="Apoyá XETHKIOZ"
        description="Donaciones, patrocinios y colaboraciones para ayudar a crecer el proyecto XETHKIOZ."
        url="/support"
      />

      <section className="relative overflow-hidden rounded-3xl glass border border-orange/25 p-6 md:p-10 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange/15 via-transparent to-neon/15 pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="section-eyebrow">XETHKIOZ SUPPORT</p>
            <h1 className="font-display text-3xl md:text-5xl font-black gradient-text mb-4">
              Apoyá el crecimiento del proyecto
            </h1>
            <p className="text-gray-300 leading-relaxed mb-6">
              XETHKIOZ es una plataforma independiente de gaming, tecnología, IA, streaming y comunidad. Cada aporte ayuda a sostener la web, mejorar el contenido y construir nuevas funciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-center">
                Donar con PayPal
              </a>
              <a href={mercadoPagoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-center">
                Donar con Mercado Pago
              </a>
            </div>
          </div>

          <div className="glass-strong rounded-2xl border border-white/10 p-6">
            <div className="text-5xl mb-4">💜</div>
            <h2 className="font-display text-xl font-bold text-white mb-3">¿En qué ayuda tu aporte?</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>✅ Mantener online xethkioz.com.ar.</li>
              <li>✅ Crear noticias, análisis, videos y carruseles.</li>
              <li>✅ Mejorar la comunidad, perfiles y comentarios.</li>
              <li>✅ Financiar herramientas, IA, hosting y producción.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass border border-white/10 rounded-2xl p-6 card-hover">
          <div className="text-3xl mb-3">🎮</div>
          <h2 className="font-display text-lg font-bold text-white mb-2">Donaciones</h2>
          <p className="text-sm text-gray-400 mb-4">Para quienes quieren acompañar el proyecto de forma directa.</p>
          <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-orange hover:neon-text-orange">Aportar ahora →</a>
        </div>

        <div className="glass border border-orange/20 rounded-2xl p-6 card-hover">
          <div className="text-3xl mb-3">🤝</div>
          <h2 className="font-display text-lg font-bold text-white mb-2">Patrocinios</h2>
          <p className="text-sm text-gray-400 mb-4">Para marcas, negocios, empresas o creadores que quieran aparecer en XETHKIOZ.</p>
          <Link to="/contact" className="text-sm text-orange hover:neon-text-orange">Consultar patrocinio →</Link>
        </div>

        <div className="glass border border-neon/20 rounded-2xl p-6 card-hover">
          <div className="text-3xl mb-3">🚀</div>
          <h2 className="font-display text-lg font-bold text-white mb-2">Colaboraciones</h2>
          <p className="text-sm text-gray-400 mb-4">Para trabajar contenido, entrevistas, streams, notas o proyectos audiovisuales.</p>
          <Link to="/contact" className="text-sm text-neon hover:neon-text-purple">Proponer colaboración →</Link>
        </div>
      </section>

      <section className="glass border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold gradient-text-purple mb-4">Opciones para patrocinadores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sponsorOptions.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="text-orange">✦</span>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
