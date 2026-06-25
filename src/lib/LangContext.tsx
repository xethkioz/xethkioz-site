import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type Translation } from './i18n'
interface LangContextType { lang: Lang; setLang: (l: Lang) => void; t: Translation }
const LangContext = createContext<LangContextType | undefined>(undefined)
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es')
  const t = translations[lang] as Translation
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}
export function useLang() { const ctx = useContext(LangContext); if (!ctx) throw new Error('useLang must be used within LangProvider'); return ctx }
