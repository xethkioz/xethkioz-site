import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    let id: string
    try { id = decodeURIComponent(hash.slice(1)) } catch { return }
    let finished = false
    const observer = new MutationObserver(() => scroll())
    const scroll = () => {
      if (finished) return
      const target = document.getElementById(id)
      if (!target) return
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
      finished = true; observer.disconnect()
    }
    // Lazy route content may not be mounted when the language or path changes.
    observer.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true })
    const frame = window.requestAnimationFrame(scroll)
    const timeout = window.setTimeout(() => observer.disconnect(), 3000)
    return () => { finished = true; observer.disconnect(); window.cancelAnimationFrame(frame); window.clearTimeout(timeout) }
  }, [pathname, hash])
  return null
}
