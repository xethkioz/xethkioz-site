import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Lang, type Translation } from './i18n'

interface LangContextType { lang: Lang; setLang: (l: Lang) => void; t: Translation }

const LangContext = createContext<LangContextType | undefined>(undefined)

const getInitialLang = (): Lang => {
  if (typeof window === 'undefined') return 'es'
  const saved = window.localStorage.getItem('xethkioz.lang')
  return saved === 'en' ? 'en' : 'es'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang)
  const t = translations[lang] as Translation

  useEffect(() => {
    window.localStorage.setItem('xethkioz.lang', lang)
    document.documentElement.lang = lang === 'es' ? 'es-AR' : 'en'
  }, [lang])

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
