import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type NewsItem = { title: string; summary: string; tag: string }
type NodeBlock = { id: string; title: string; text: string; items: NewsItem[] }

const content: Record<'es' | 'en', { title: string; description: string; close: string; status: string; open: string; blocks: NodeBlock[] }> = {
  es: {
    title: 'Green Node',
    description: 'Nodo oculto para Linux, programación, privacidad educativa e investigación documental.',
    close: 'Cerrar portal',
    status: 'Seguridad editorial: este nodo opera separado de Juegos, Tecnología/Ciencia y Memes. Sus efectos visuales no se heredan fuera de esta sección.',
    open: 'Abrir nodo',
    blocks: [
      { id: 'linux', title: 'Linux / Open Source', text: 'Bases limpias para usuarios nuevos, herramientas libres y cultura open source.', items: [
        { title: 'Primeros comandos para no perderse en Linux', summary: 'Noticia demo para explicar terminal, carpetas y comandos seguros.', tag: 'terminal' },
        { title: 'Distribuciones amigables para empezar', summary: 'Entrada de prueba para comparar opciones simples y uso cotidiano.', tag: 'distros' },
        { title: 'Open source como camino de aprendizaje', summary: 'Bloque demo sobre comunidad, documentación y práctica real.', tag: 'open source' },
        { title: 'Herramientas libres para creadores', summary: 'Nota de prueba sobre edición, captura, automatización y productividad.', tag: 'tools' },
        { title: 'Backups básicos antes de tocar sistema', summary: 'Artículo demo para enseñar cuidado antes de experimentar.', tag: 'backup' },
      ] },
      { id: 'programming', title: 'Programación', text: 'Rutas de aprendizaje, web, scripts, automatización y buenas prácticas.', items: [
        { title: 'HTML, CSS y React sin humo', summary: 'Demo para iniciar con estructura, componentes y deploys simples.', tag: 'frontend' },
        { title: 'Scripts útiles para creadores', summary: 'Entrada de prueba sobre automatizar tareas repetitivas sin romper nada.', tag: 'scripts' },
        { title: 'Git como línea de tiempo del proyecto', summary: 'Bloque demo para explicar commits, ramas y backups reales.', tag: 'git' },
        { title: 'APIs: conectar piezas del ecosistema', summary: 'Nota de prueba para publicar contenido, leer datos y controlar errores.', tag: 'api' },
        { title: 'Documentar para que otra IA entienda', summary: 'Artículo demo sobre README, changelog y fuente única de verdad.', tag: 'docs' },
      ] },
      { id: 'privacy', title: 'Privacidad digital educativa', text: 'Higiene digital, cuentas, contraseñas, 2FA y seguridad defensiva.', items: [
        { title: 'Separar cuentas personales y de marca', summary: 'Demo para ordenar accesos, permisos y recuperación.', tag: 'cuentas' },
        { title: '2FA como base mínima de seguridad', summary: 'Entrada de prueba sobre autenticadores, backup codes y riesgos comunes.', tag: '2FA' },
        { title: 'Contraseñas largas y gestores seguros', summary: 'Bloque demo para explicar buenas prácticas sin tecnicismos.', tag: 'passwords' },
        { title: 'Qué datos no publicar como creador', summary: 'Nota educativa sobre doxxing, capturas y metadatos.', tag: 'privacidad' },
        { title: 'Checklist defensivo para streamers', summary: 'Artículo demo para proteger cuentas, overlays y paneles públicos.', tag: 'streaming' },
      ] },
      { id: 'research', title: 'Investigación documental', text: 'OSINT seguro, fuentes públicas, archivo, contraste y límites claros.', items: [
        { title: 'Investigar con fuentes públicas sin cruzar límites', summary: 'Demo educativo para ordenar búsquedas, archivo y evidencia.', tag: 'OSINT' },
        { title: 'Distinguir fuente primaria, copia y rumor', summary: 'Entrada de prueba para mejorar verificación antes de publicar.', tag: 'fuentes' },
        { title: 'Guardar evidencia sin exponer datos sensibles', summary: 'Bloque demo sobre capturas, enlaces y cuidado de privacidad.', tag: 'archivo' },
        { title: 'Cronologías para entender casos complejos', summary: 'Nota de prueba para armar líneas de tiempo verificables.', tag: 'timeline' },
        { title: 'Hipótesis no es conclusión', summary: 'Artículo demo para marcar límites editoriales con claridad.', tag: 'criterio' },
      ] },
    ],
  },
  en: {
    title: 'Green Node',
    description: 'Hidden node for Linux, programming, educational privacy and documentary research.',
    close: 'Close portal',
    status: 'Editorial safety: this node operates separately from Games, Technology/Science and Memes. Its visual effects do not leak outside this section.',
    open: 'Open node',
    blocks: [
      { id: 'linux', title: 'Linux / Open Source', text: 'Clean basics for new users, free tools and open-source culture.', items: [
        { title: 'First Linux commands without getting lost', summary: 'Demo news to explain terminal, folders and safe commands.', tag: 'terminal' },
        { title: 'Beginner-friendly distributions', summary: 'Test entry comparing simple options and everyday use.', tag: 'distros' },
        { title: 'Open source as a learning path', summary: 'Demo block about community, documentation and real practice.', tag: 'open source' },
        { title: 'Free tools for creators', summary: 'Test note about editing, capture, automation and productivity.', tag: 'tools' },
        { title: 'Basic backups before touching the system', summary: 'Demo article to teach caution before experimenting.', tag: 'backup' },
      ] },
      { id: 'programming', title: 'Programming', text: 'Learning paths, web, scripts, automation and good practices.', items: [
        { title: 'HTML, CSS and React without smoke', summary: 'Demo to start with structure, components and simple deploys.', tag: 'frontend' },
        { title: 'Useful scripts for creators', summary: 'Test entry about automating repetitive tasks safely.', tag: 'scripts' },
        { title: 'Git as the project timeline', summary: 'Demo block explaining commits, branches and real backups.', tag: 'git' },
        { title: 'APIs: connecting ecosystem pieces', summary: 'Test note for publishing content, reading data and handling errors.', tag: 'api' },
        { title: 'Document so another AI understands', summary: 'Demo article about README, changelog and single source of truth.', tag: 'docs' },
      ] },
      { id: 'privacy', title: 'Educational digital privacy', text: 'Digital hygiene, accounts, passwords, 2FA and defensive security.', items: [
        { title: 'Separate personal and brand accounts', summary: 'Demo to organize access, permissions and recovery.', tag: 'accounts' },
        { title: '2FA as the minimum security base', summary: 'Test entry about authenticators, backup codes and common risks.', tag: '2FA' },
        { title: 'Long passwords and safe managers', summary: 'Demo block to explain good practices without jargon.', tag: 'passwords' },
        { title: 'What creators should not publish', summary: 'Educational note about doxxing, screenshots and metadata.', tag: 'privacy' },
        { title: 'Defensive checklist for streamers', summary: 'Demo article to protect accounts, overlays and public panels.', tag: 'streaming' },
      ] },
      { id: 'research', title: 'Documentary research', text: 'Safe OSINT, public sources, archive, contrast and clear limits.', items: [
        { title: 'Research public sources without crossing lines', summary: 'Educational demo for organizing searches, archives and evidence.', tag: 'OSINT' },
        { title: 'Separate primary source, copy and rumor', summary: 'Test entry to improve verification before publishing.', tag: 'sources' },
        { title: 'Save evidence without exposing sensitive data', summary: 'Demo block about screenshots, links and privacy care.', tag: 'archive' },
        { title: 'Timelines for complex cases', summary: 'Test note for building verifiable timelines.', tag: 'timeline' },
        { title: 'Hypothesis is not conclusion', summary: 'Demo article to clearly mark editorial limits.', tag: 'judgment' },
      ] },
    ],
  },
}

export default function GreenNode() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/green-node" />
      <section className="xk-green-shell px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-green-frame rounded-[2rem] bg-black/78 p-6 md:p-10">
            <div className="xk-green-content">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#32FF8A]/70">REALITY_OVERRIDE // WISP_ACCESS_GRANTED</p>
                <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-[#32FF8A]/50 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10">{lang.toUpperCase()}</button>
              </div>
              <h1 className="mt-5 font-mono text-4xl font-black uppercase tracking-[0.18em] text-[#D8FFE8] md:text-6xl">{t.title}</h1>
              <p className="mt-5 max-w-3xl font-mono text-sm leading-relaxed text-[#B9FFD1] md:text-base">{t.description}</p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {t.blocks.map((node) => (
                  <button key={node.id} type="button" onClick={() => setActiveId(node.id)} className={`rounded-2xl border p-5 text-left font-mono shadow-[0_0_18px_rgba(50,255,138,.12)] transition hover:-translate-y-1 ${active.id === node.id ? 'border-[#D8FFE8]/70 bg-[#0A2612]' : 'border-[#32FF8A]/35 bg-[#031006]/80 hover:border-[#32FF8A]/80'}`}>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/55">node.signal</p>
                    <h2 className="mt-3 text-lg font-black uppercase tracking-[0.12em] text-[#D8FFE8]">{node.title}</h2>
                    <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{node.text}</p>
                    <span className="mt-4 inline-flex text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
                  </button>
                ))}
              </div>

              <section className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{active.title} // 5 demo news</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {active.items.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-[#32FF8A]/20 bg-[#031006]/80 p-4">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]/70">{item.tag}</span>
                      <h3 className="mt-3 text-sm font-black uppercase text-[#D8FFE8]">{item.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{item.summary}</p>
                    </article>
                  ))}
                </div>
              </section>

              <div className="mt-8 rounded-2xl border border-[#32FF8A]/25 bg-black/70 p-5 font-mono text-xs leading-relaxed text-[#B9FFD1]">{t.status}</div>

              <Link to="/" className="mt-8 inline-flex rounded-full border border-[#32FF8A]/50 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[#D8FFE8] transition hover:bg-[#32FF8A]/10 hover:shadow-[0_0_18px_rgba(50,255,138,.24)]">{t.close}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
