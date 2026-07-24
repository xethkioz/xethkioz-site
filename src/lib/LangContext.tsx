import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translations, type Lang, type Translation } from './i18n'
import { isEnglishPath, isLocalizedPublicPath, localizedPath as buildLocalizedPath } from './localizedRoutes'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  localizePath: (path: string) => string
  t: Translation
}

const LangContext = createContext<LangContextType | undefined>(undefined)
const STORAGE_KEY = 'xethkioz.lang'

const getInitialLang = (): Lang => {
  if (typeof window === 'undefined') return 'es'
  if (isEnglishPath(window.location.pathname)) return 'en'
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es'
  } catch {
    return 'es'
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [preferredLang, setPreferredLang] = useState<Lang>(getInitialLang)
  const routeLang: Lang | null = isEnglishPath(location.pathname) ? 'en' : null
  const lang = routeLang ?? preferredLang
  const t = translations[lang] as Translation

  useEffect(() => {
    if (routeLang && routeLang !== preferredLang) setPreferredLang(routeLang)
  }, [preferredLang, routeLang])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // URL remains the canonical language source when storage is unavailable.
    }
    document.documentElement.lang = lang === 'es' ? 'es-AR' : 'en'
  }, [lang])

  useEffect(() => {
    if (lang !== 'en' || isEnglishPath(location.pathname) || !isLocalizedPublicPath(location.pathname)) return
    const destination = buildLocalizedPath(`${location.pathname}${location.search}${location.hash}`, 'en')
    navigate(destination, { replace: true })
  }, [lang, location.hash, location.pathname, location.search, navigate])

  const value = useMemo<LangContextType>(() => ({
    lang,
    t,
    setLang: (next) => {
      setPreferredLang(next)
      const current = `${location.pathname}${location.search}${location.hash}`
      const destination = buildLocalizedPath(current, next)
      if (destination !== current) navigate(destination)
    },
    toggleLang: () => {
      const next: Lang = lang === 'es' ? 'en' : 'es'
      setPreferredLang(next)
      const current = `${location.pathname}${location.search}${location.hash}`
      const destination = buildLocalizedPath(current, next)
      if (destination !== current) navigate(destination)
    },
    localizePath: (path) => buildLocalizedPath(path, lang),
  }), [lang, location.hash, location.pathname, location.search, navigate, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
