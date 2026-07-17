import { Link } from 'react-router-dom'
import { SOCIAL_LINKS } from '../lib/siteConfig'

export default function Footer() {
  return (
    <footer className="xk-footer-clean border-t border-white/10 bg-[#0A0A0F] px-5 py-10 text-gray-400">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div><p className="font-black tracking-[.14em] text-white">XETHKIOZ</p><span className="mt-3 block max-w-md text-sm leading-6">Gaming, tecnología, ciencia, humor y archivos extraños dentro de un universo independiente creado en Argentina.</span><Link to="/support" className="mt-4 inline-flex font-mono text-[10px] font-black uppercase tracking-[.16em] text-orange-300">Apoyar el proyecto →</Link></div>
        <nav aria-label="Información"><p className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-violet-300">Confianza</p><div className="mt-3 grid gap-2 text-sm"><Link to="/about">Quiénes somos</Link><Link to="/editorial-policy">Política editorial</Link><Link to="/privacy">Privacidad y cookies</Link><Link to="/contact">Contacto y sponsors</Link></div></nav>
        <nav aria-label="Redes"><p className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-cyan-300">Señales externas</p><div className="mt-3 grid grid-cols-2 gap-2 text-sm">{SOCIAL_LINKS.filter((item) => item.name !== 'Web').slice(0, 6).map((item) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer">{item.name}</a>)}</div><a href="/feed.xml" className="mt-3 inline-flex text-sm text-orange-200">RSS de noticias</a></nav>
      </div>
      <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-center font-mono text-[9px] uppercase tracking-[0.12em]">© 2026 Alexis Ivan Diaz Sellanes Santajulia · XETHKIOZ · Todos los derechos reservados.</p>
    </footer>
  )
}
