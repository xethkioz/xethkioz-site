import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { getCuratedExternalNews } from '../services/news/curatedExternalNews'
import { formatPublicNewsDate } from '../services/news/publicNewsService'

type NodeBlock = { id: string; title: string; text: string }

const content: Record<'es' | 'en', { title: string; description: string; close: string; status: string; open: string; articleTitle: string; read: string; blocks: NodeBlock[] }> = {
  es: {
    title: 'Green Node',
    description: 'Nodo para Linux, programación, buenas prácticas digitales y documentación.',
    close: 'Cerrar portal',
    status: 'Estado: sección conectada a lectura técnica ampliada con fuentes visibles.',
    open: 'Abrir nodo',
    articleTitle: 'Green Node // técnica y documentación',
    read: 'Leer completa',
    blocks: [
      { id: 'linux', title: 'Linux / Open Source', text: 'Bases limpias para usuarios nuevos, herramientas libres y cultura open source.' },
      { id: 'programming', title: 'Programación', text: 'Rutas de aprendizaje, web, scripts, automatización y buenas prácticas.' },
      { id: 'privacy', title: 'Higiene digital educativa', text: 'Cuentas, contraseñas, 2FA y orden básico para creadores.' },
      { id: 'research', title: 'Documentación', text: 'Archivo, fuentes, notas, seguimiento y límites editoriales claros.' },
    ],
  },
  en: {
    title: 'Green Node',
    description: 'Node for Linux, programming, digital good practices and documentation.',
    close: 'Close portal',
    status: 'Status: section connected to expanded technical reading with visible sources.',
    open: 'Open node',
    articleTitle: 'Green Node // tech and documentation',
    read: 'Read full article',
    blocks: [
      { id: 'linux', title: 'Linux / Open Source', text: 'Clean basics for new users, free tools and open-source culture.' },
      { id: 'programming', title: 'Programming', text: 'Learning paths, web, scripts, automation and good practices.' },
      { id: 'privacy', title: 'Digital hygiene', text: 'Accounts, passwords, 2FA and basic order for creators.' },
      { id: 'research', title: 'Documentation', text: 'Archives, sources, notes, tracking and clear editorial limits.' },
    ],
  },
}

export default function GreenNode() {
  const { lang, setLang } = useLang()
  const t = content[lang]
  const [activeId, setActiveId] = useState(t.blocks[0].id)
  const active = t.blocks.find((item) => item.id === activeId) ?? t.blocks[0]
  const articles = [...getCuratedExternalNews('tech'), ...getCuratedExternalNews('science')]

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
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#32FF8A]/70">{t.articleTitle}</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {articles.map((article) => (
                    <article key={article.slug} className="rounded-2xl border border-[#32FF8A]/20 bg-[#031006]/80 p-5 transition hover:-translate-y-1 hover:border-[#32FF8A]/70">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#32FF8A]/70">{article.category} · {formatPublicNewsDate(article.published_at ?? article.created_at, lang)}</span>
                      <h3 className="mt-3 text-sm font-black uppercase text-[#D8FFE8]">{article.title}</h3>
                      <p className="mt-3 text-xs leading-relaxed text-[#B9FFD1]/80">{article.summary}</p>
                      <Link to={`/news/${article.slug}`} className="mt-5 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-100 hover:bg-orange-500/10">{t.read}</Link>
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
