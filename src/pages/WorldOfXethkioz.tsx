import { Navigate, useLocation } from 'react-router-dom'
import { useLang } from '../lib/LangContext'

// Compatibility only: the universe no longer adds an extra entry page.
export default function WorldOfXethkioz() {
  const { localizePath } = useLang()
  const { search, hash } = useLocation()
  const destinationHash = hash === '#universo' ? '#historia' : hash
  return <Navigate replace to={`${localizePath('/world-of-xethkioz/elemental-realms')}${search}${destinationHash}`}/>
}
