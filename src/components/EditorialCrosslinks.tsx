import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'

/** Compact editorial footer; the game is a separate destination, not a service offer. */
export default function EditorialCrosslinks() {
  const { lang, localizePath } = useLang()
  const es = lang === 'es'
  return (
    <section className="xke-crosslinks" aria-label={es ? 'Seguir XETHKIOZ' : 'Follow XETHKIOZ'}>
      <div>
        <strong>{es ? 'La conversación sigue.' : 'The conversation continues.'}</strong>
        <p>{es ? 'Gaming, tecnología y creación independiente. Descubrí también el portal de nuestro juego.' : 'Gaming, technology and independent creation. Explore our game in its own dedicated portal.'}</p>
      </div>
      <nav aria-label={es ? 'Web, Threads y nuestro juego' : 'Website, Threads and our game'}>
        <a href="https://www.xethkioz.com.ar">Web</a>
        <a href="https://www.threads.com/@xethkioz" target="_blank" rel="noopener noreferrer">Threads <span aria-hidden="true">↗</span></a>
        <Link to={localizePath('/world-of-xethkioz')}>World of Xethkioz <span aria-hidden="true">→</span></Link>
      </nav>
    </section>
  )
}
