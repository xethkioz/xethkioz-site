import { useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation()
  if (location.pathname === '/') return null

  return (
    <footer className="xk-footer-clean border-t border-white/10 bg-[#0A0A0F] px-4 py-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400">
      © 2026 Alexis Ivan Diaz Sellanes Santajulia. XETHKIOZ Web v1.0. Todos los derechos reservados.
    </footer>
  )
}
