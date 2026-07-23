import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

let homeStyles: Promise<void> | null = null
let greenNodeStyles: Promise<void> | null = null

export function loadRouteStyles(pathname: string): Promise<void> {
  if (pathname === '/') {
    homeStyles ??= import('../generated/home-shell.css').then(() => undefined)
    return homeStyles
  }

  if (pathname === '/green-node' || pathname.startsWith('/green-node/')) {
    greenNodeStyles ??= import('../generated/green-node-shell.css').then(() => undefined)
    return greenNodeStyles
  }

  return Promise.resolve()
}

export default function RouteCssLoader() {
  const { pathname } = useLocation()

  useEffect(() => {
    void loadRouteStyles(pathname)
  }, [pathname])

  return null
}
