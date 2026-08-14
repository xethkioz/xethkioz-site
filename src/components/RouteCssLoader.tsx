import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

type StylePromise = Promise<void>

const styleCache = new Map<string, StylePromise>()

function loadStyle(key: string, loader: () => Promise<unknown>): StylePromise {
  const cached = styleCache.get(key)
  if (cached) return cached

  const request = loader()
    .then(() => undefined)
    .catch((error) => {
      styleCache.delete(key)
      throw error
    })

  styleCache.set(key, request)
  return request
}

function normalizeRoute(pathname: string) {
  const route = pathname === '/en'
    ? '/'
    : pathname.startsWith('/en/')
      ? pathname.slice(3)
      : pathname
  if (route === '/nexus-city') return '/fun'
  return route
}

function isPortalRoute(pathname: string) {
  return pathname === '/'
    || pathname === '/gaming'
    || pathname === '/science'
    || pathname === '/fun'
    || pathname === '/green-node'
    || pathname.startsWith('/green-node/')
}

function isEditorialRoute(pathname: string) {
  return pathname === '/news'
    || pathname.startsWith('/news/')
    || pathname === '/gaming/guides'
    || pathname === '/about'
    || pathname === '/contact'
    || pathname === '/support'
    || pathname === '/privacy'
    || pathname === '/editorial-policy'
}

export function loadRouteStyles(rawPathname: string): Promise<void> {
  const pathname = normalizeRoute(rawPathname)
  const styles: StylePromise[] = []

  if (pathname === '/') {
    styles.push(loadStyle('home', () => import('../generated/home-shell.css')))
  }

  if (pathname === '/gaming' || pathname === '/fun') {
    styles.push(loadStyle('gaming-fun', () => import('../generated/gaming-fun-shell.css')))
  }

  if (pathname === '/gaming') {
    styles.push(loadStyle('gaming-sections', () => import('../generated/gaming-sections-shell.css')))
  }

  if (pathname === '/science') {
    styles.push(loadStyle('science', () => import('../generated/science-shell.css')))
  }

  if (pathname === '/green-node' || pathname.startsWith('/green-node/')) {
    styles.push(loadStyle('green-node', () => import('../generated/green-node-shell.css')))
  }

  if (isPortalRoute(pathname)) {
    styles.push(loadStyle('nexus-district', () => import('../generated/nexus-district-shell.css')))
  }

  if (isEditorialRoute(pathname)) {
    styles.push(loadStyle('editorial', () => import('../generated/editorial-shell.css')))
  }

  if (pathname === '/fun') {
    styles.push(loadStyle('fun-nexus', () => import('../generated/fun-nexus-shell.css')))
  }

  if (pathname.startsWith('/nexus-city/u/')) {
    styles.push(loadStyle('passport', () => import('../generated/passport-shell.css')))
  }

  if (pathname.startsWith('/nexus-city/room/') && pathname !== '/nexus-city/room/xethkioz') {
    styles.push(loadStyle('room', () => import('../generated/room-shell.css')))
  }

  return Promise.all(styles).then(() => undefined)
}

export default function RouteCssLoader() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    let active = true
    void loadRouteStyles(pathname).catch((error) => {
      if (active) console.error('[XETHKIOZ] Route CSS failed to load:', error)
    })
    return () => { active = false }
  }, [pathname])

  return null
}
