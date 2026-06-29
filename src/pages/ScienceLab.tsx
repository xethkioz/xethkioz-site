import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

type NewsItem = { title: string; summary: string; tag: string }
type SectionBlock = { id: string; title: string; text: string; items: NewsItem[] }

const content: Record<'es' | 'en', { title: string; description: string; back: string; open: string; status: string; blocks: SectionBlock[] }> = {
  es: {
    title: 'Tecnología / Ciencia',
    description: 'Laboratorio técnico para IA, ciencia, hardware, software e infraestructura verificable.',
    back: 'Volver al núcleo',
    open: 'Abrir laboratorio',
    status: 'Estado: sección conectada a paneles categorizados de prueba para validar publicación y lectura.',
    blocks: [
      { id: 'ai', title: 'IA / Modelos', text: 'Análisis, prompts, automatización y modelos locales.', items: [
        { title: 'IA local para creadores independientes', summary: 'Prueba editorial sobre modelos locales, límites de GPU y flujo real de producción.', tag: 'IA local' },
        { title: 'Prompts como sistema de trabajo', summary: 'Entrada demo para explicar prompts reutilizables, documentación y control de calidad.', tag: 'Prompts' },
        { title: 'Automatización sin perder criterio humano', summary: 'Nota de prueba para separar eficiencia, revisión editorial y riesgos de publicar sin control.', tag: 'Workflow' },
        { title: 'Modelos livianos ganan utilidad práctica', summary: 'Bloque demo sobre herramientas que funcionan en PCs de consumo.', tag: 'Modelos' },
        { title: 'IA y noticias: verificación primero', summary: 'Artículo de prueba para cubrir imágenes, fuentes y desinformación digital.', tag: 'Verificación' },
      ] },
      { id: 'science', title: 'Ciencia', text: 'Fuentes, evidencia, pensamiento crítico y contexto.', items: [
        { title: 'Cómo leer una fuente científica sin perderse', summary: 'Demo para enseñar resumen, método, muestra y límites de un estudio.', tag: 'Fuentes' },
        { title: 'Evidencia, hipótesis y especulación', summary: 'Plantilla para no vender teoría como hecho dentro del ecosistema.', tag: 'Método' },
        { title: 'Divulgación clara para comunidad gamer', summary: 'Entrada de prueba para conectar ciencia con tecnología cotidiana.', tag: 'Divulgación' },
        { title: 'Datos abiertos para investigar mejor', summary: 'Nota demo sobre repositorios, datasets y lectura responsable.', tag: 'Datos' },
        { title: 'Ciencia visual: explicar sin saturar', summary: 'Bloque preparado para gráficos simples, comparativas y contexto.', tag: 'Visual' },
      ] },
      { id: 'tech', title: 'Tecnología', text: 'Hardware, software, infraestructura, streaming y rendimiento.', items: [
        { title: 'GPUs entre gaming, IA y creación', summary: 'Prueba para comparar uso real de placas gráficas en juegos y modelos.', tag: 'GPU' },
        { title: 'Streaming estable con bajo ruido técnico', summary: 'Nota demo sobre configuración, bitrate, overlays y rendimiento.', tag: 'Streaming' },
        { title: 'Infraestructura simple para crecer', summary: 'Entrada de prueba sobre hosting, DNS, despliegues y backups.', tag: 'Web' },
        { title: 'Windows, Linux y herramientas híbridas', summary: 'Bloque demo para usuarios que quieren producir sin complicarse.', tag: 'Sistemas' },
        { title: 'Seguridad básica para creadores', summary: 'Artículo de prueba sobre contraseñas, 2FA y separación de cuentas.', tag: 'Seguridad' },
      ] },
    ],
  },
  en: {
    title: 'Technology / Science',
    description: 'Technical lab for AI, science, hardware, software and verifiable infrastructure.',
    back: 'Back to core',
    open: 'Open lab',
    status: 'Status: section connected to categorized test panels for publication and reading validation.',
    blocks: [
      { id: 'ai', title: 'AI / Models', text: 'Analysis, prompts, automation and local models.', items: [
        { title: 'Local AI for independent creators', summary: 'Editorial test about local models, GPU limits and real production workflow.', tag: 'Local AI' },
        { title: 'Prompts as a work system', summary: 'Demo entry for reusable prompts, documentation and quality control.', tag: 'Prompts' },
        { title: 'Automation without losing human judgment', summary: 'Test note separating efficiency, editorial review and publishing risks.', tag: 'Workflow' },
        { title: 'Lightweight models gain practical value', summary: 'Demo block about tools that run on consumer PCs.', tag: 'Models' },
        { title: 'AI and news: verification first', summary: 'Test article about images, sources and digital misinformation.', tag: 'Verification' },
      ] },
      { id: 'science', title: 'Science', text: 'Sources, evidence, critical thinking and context.', items: [
        { title: 'How to read a scientific source', summary: 'Demo to explain summary, method, sample and study limits.', tag: 'Sources' },
        { title: 'Evidence, hypothesis and speculation', summary: 'Template to avoid presenting theory as fact.', tag: 'Method' },
        { title: 'Clear science for gaming communities', summary: 'Test entry connecting science with everyday tech.', tag: 'Outreach' },
        { title: 'Open data for better research', summary: 'Demo note about repositories, datasets and responsible reading.', tag: 'Data' },
        { title: 'Visual science without overload', summary: 'Block prepared for simple charts, comparisons and context.', tag: 'Visual' },
      ] },
      { id: 'tech', title: 'Technology', text: 'Hardware, software, infrastructure, streaming and performance.', items: [
        { title: 'GPUs across gaming, AI and creation', summary: 'Test comparing real GPU use in games and models.', tag: 'GPU' },
        { title: 'Stable streaming with low technical noise', summary: 'Demo note about settings, bitrate, overlays and performance.', tag: 'Streaming' },
        { title: 'Simple infrastructure to grow', summary: 'Test entry about hosting, DNS, deployments and backups.', tag: 'Web' },
        { title: 'Windows, Linux and hybrid tools', summary: 'Demo block for users who want to produce without friction.', tag: 'Systems' },
        { title: 'Basic security for creators', summary: 'Test article about passwords, 2FA and account separation.', tag: 'Security' },
      ] },
    ],
  },
}

export default function ScienceLab() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]

  return (
    <>
      <SEO title={`${t.title} · XETHKIOZ`} description={t.description} url="/science" />
      <section className="xk-page xk-blueprint px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="xk-section-panel rounded-[2rem] border border-blue-400/45 bg-[#06111f]/80 p-6 shadow-[0_0_28px_rgba(59,130,246,.18)] md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#32FF8A]">DATA_TERMINAL // BLUEPRINT</p>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-blue-300/40 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-blue-100">{lang.toUpperCase()}</button>
            </div>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.16em] text-white md:text-6xl">{t.title}</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-blue-100/80">{t.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.blocks.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveId(item.id)} className={`xk-card rounded-3xl border p-5 text-left shadow-[0_0_16px_rgba(139,92,246,.12)] transition ${active.id === item.id ? 'border-[#32FF8A]/70 bg-[#031006]/80' : 'border-blue-300/30 bg-black/50 hover:border-blue-200/70'}`}>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8B5CF6]">{item.title}</p>
                <p className="mt-4 font-mono text-sm leading-relaxed text-gray-300">{item.text}</p>
                <span className="mt-4 inline-flex font-mono text-[10px] uppercase tracking-[0.18em] text-[#32FF8A]">{t.open}</span>
              </button>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-blue-300/25 bg-black/55 p-5 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blue-200">{active.title} // 5 demo news</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {active.items.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]">{item.tag}</span>
                  <h3 className="mt-3 text-base font-black uppercase text-white">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-gray-300">{item.summary}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-8 rounded-3xl border border-[#32FF8A]/25 bg-black/45 p-5 font-mono text-xs leading-relaxed text-gray-300">{t.status}</div>
          <Link to="/" className="mt-8 inline-flex rounded-full border border-blue-300/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#32FF8A] hover:text-[#32FF8A]">{t.back}</Link>
        </div>
      </section>
    </>
  )
}
