import { Link } from 'react-router-dom'
import { useLang } from '../lib/LangContext'
import SEO from './SEO'
import './GreenNodeEntry.css'

// An explicit entry to public educational content, never an authorization boundary.
export default function GreenNodeEntry({ onEnter }: { onEnter: () => void }) {
  const { lang, localizePath } = useLang()
  const es = lang === 'es'
  return <main className="xk-green-entry" aria-labelledby="green-entry-title">
    <SEO title="Green Node" description={es ? 'Programación, Linux y seguridad digital con un enfoque educativo y responsable.' : 'Programming, Linux and digital security with a responsible educational approach.'} url="/green-node" />
    <section>
      <p className="xk-green-entry-eyebrow">XETHKIOZ / GREEN NODE</p>
      <span className="xk-green-entry-sigil" aria-hidden="true">◇</span>
      <h1 id="green-entry-title">{es ? 'El conocimiento abre caminos.' : 'Knowledge opens new paths.'}</h1>
      <p>{es ? 'Entrá al espacio de programación, Linux y seguridad digital. Veyr te acompaña con un recorrido educativo, sin necesidad de crear una cuenta.' : 'Enter our space for programming, Linux and digital security. Veyr guides you through an educational journey. No account is required.'}</p>
      <div><button type="button" onClick={onEnter}>{es ? 'Entrar a Green Node' : 'Enter Green Node'} <span aria-hidden="true">↗</span></button><Link to={localizePath('/')}>{es ? 'Volver a XETHKIOZ' : 'Back to XETHKIOZ'}</Link></div>
      <small>{es ? 'Contenido público. Aprender, verificar y cuidar la privacidad.' : 'Public content. Learn, verify and respect privacy.'}</small>
    </section>
  </main>
}
