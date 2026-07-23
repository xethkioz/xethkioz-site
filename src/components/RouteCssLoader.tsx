import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type StylePromise = Promise<void>

let homeStyles: StylePromise | null = null
let gamingFunStyles: StylePromise | null = null
let gamingSectionsStyles: StylePromise | null = null
let scienceStyles: StylePromise | null = null
let greenNodeStyles: StylePromise | null = null
let nexusDistrictStyles: StylePromise | null = null
let editorialStyles: StylePromise | null = null
let funNexusStyles: StylePromise | null = null
let passportStyles: StylePromise | null = null
let roomStyles: StylePromise | null = null

function loadOnce(current: StylePromise | null, loader: () => Promise<unknown>): StylePromise {
  return current ?? loader().then(() => undefined)
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

export function loadRouteStyles(pathname: string): Promise<void> {
  const styles: StylePromise[] = []

  if (pathname === '/') {
    homeStyles = loadOnce(homeStyles, () => import('../generated/home-shell.css'))
    styles.push(homeStyles)
  }

  if (pathname === '/gaming' || pathname === '/fun') {
    gamingFunStyles = loadOnce(gamingFunStyles, () => import('../generated/gaming-fun-shell.css'))
    styles.push(gamingFunStyles)
  }

  if (pathname === '/gaming') {
    gamingSectionsStyles = loadOnce(gamingSectionsStyles, () => import('../generated/gaming-sections-shell.css'))
    styles.push(gamingSectionsStyles)
  }

  if (pathname === '/science') {
    scienceStyles = loadOnce(scienceStyles, () => import('../generated/science-shell.css'))
    styles.push(scienceStyles)
  }

  if (pathname === '/green-node' || pathname.startsWith('/green-node/')) {
    greenNodeStyles = loadOnce(greenNodeStyles, () => import('../generated/green-node-shell.css'))
    styles.push(greenNodeStyles)
  }

  if (isPortalRoute(pathname)) {
    nexusDistrictStyles = loadOnce(nexusDistrictStyles, () => import('../generated/nexus-district-shell.css'))
    styles.push(nexusDistrictStyles)
  }

  if (isEditorialRoute(pathname)) {
    editorialStyles = loadOnce(editorialStyles, () => import('../generated/editorial-shell.css'))
    styles.push(editorialStyles)
  }

  if (pathname === '/fun') {
    funNexusStyles = loadOnce(funNexusStyles, () => import('../generated/fun-nexus-shell.css'))
    styles.push(funNexusStyles)
  }

  if (pathname.startsWith('/nexus-city/u/')) {
    passportStyles = loadOnce(passportStyles, () => import('../generated/passport-shell.css'))
    styles.push(passportStyles)
  }

  if (pathname.startsWith('/nexus-city/room/') && pathname !== '/nexus-city/room/xethkioz') {
    roomStyles = loadOnce(roomStyles, () => import('../generated/room-shell.css'))
    styles.push(roomStyles)
  }

  return Promise.all(styles).then(() => undefined)
}

export default function RouteCssLoader() {
  const { pathname } = useLocation()

  useEffect(() => {
    void loadRouteStyles(pathname)
  }, [pathname])

  return null
}
