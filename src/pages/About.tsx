import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    seoTitle: 'La historia de XETHKIOZ',
    seoDescription: 'La historia, identidad y misión detrás de XETHKIOZ: gaming, tecnología y cultura digital desde Argentina.',
    eyebrow: 'ORIGIN FILE // ARGENTINA',
    title: 'No quería hacer otra página. Quería construir una red de portales.',
    intro: 'XETHKIOZ nace de una vida atravesada por los videojuegos, el trabajo, la tecnología y la necesidad de crear algo propio. Un lugar donde cada sección se sienta distinta, pero todas formen parte de la misma ciudad digital.',
    creator: 'CREATOR // ALEXIS DÍAZ',
    adultGamer: 'La mirada de un gamer adulto',
    storyOne: 'No escribo desde una oficina corporativa ni desde un personaje inventado. Trabajo en salud, soy padre, juego cuando el tiempo lo permite y sigo sintiendo la misma curiosidad por los mundos virtuales, las nuevas tecnologías y las historias extrañas.',
    storyTwo: 'Por eso XETHKIOZ no busca competir por publicar primero a cualquier precio. Busca explicar mejor, separar el dato del rumor y convertir cada visita en una experiencia con identidad.',
    districts: [
      ['01 // 遊戯区', 'Gaming', 'Noticias, misiones, builds, comunidad y señales de Asia vistas desde la experiencia real de quien juega.'],
      ['02 // 未来区', 'Ciencia y tecnología', 'Herramientas, IA y descubrimientos explicados con fuentes, contexto y utilidad práctica.'],
      ['03 // 笑街', 'FUN', 'Memes, clips y caos compartible. El sector que recuerda que internet también existe para reírse.'],
      ['13 // 禁制区', 'Green Node', 'Privacidad, hacking defensivo, documentos y misterios analizados sin vender ficción como evidencia.'],
    ],
    manifesto: 'MANIFIESTO',
    mission: 'El objetivo es que XETHKIOZ crezca como medio, comunidad, estudio creativo y red narrativa independiente. Con luces, portales y energía; también con responsabilidad, humanidad y una voz reconocible.',
    dossiers: 'Explorar dossiers',
    community: 'Entrar a la comunidad',
    support: 'Apoyar el proyecto',
  },
  en: {
    seoTitle: 'The XETHKIOZ story',
    seoDescription: 'The story, identity and mission behind XETHKIOZ: gaming, technology and digital culture from Argentina.',
    eyebrow: 'ORIGIN FILE // ARGENTINA',
    title: 'I did not want to build another page. I wanted to build a portal network.',
    intro: 'XETHKIOZ comes from a life shaped by games, work, technology and the need to create something of my own. A place where every section feels different while remaining part of the same digital city.',
    creator: 'CREATOR // ALEXIS DÍAZ',
    adultGamer: 'An adult gamer’s perspective',
    storyOne: 'I do not write from a corporate office or through an invented persona. I work in healthcare, I am a father, I play when time allows and I still feel the same curiosity for virtual worlds, new technologies and unusual stories.',
    storyTwo: 'That is why XETHKIOZ does not compete to publish first at any cost. It aims to explain better, separate facts from rumors and turn every visit into an experience with identity.',
    districts: [
      ['01 // 遊戯区', 'Gaming', 'News, missions, builds, community and signals from Asia seen through the real experience of someone who plays.'],
      ['02 // 未来区', 'Science and technology', 'Tools, AI and discoveries explained with sources, context and practical value.'],
      ['03 // 笑街', 'FUN', 'Memes, clips and shareable chaos. The district that remembers the internet also exists for laughter.'],
      ['13 // 禁制区', 'Green Node', 'Privacy, defensive hacking, documents and mysteries examined without selling fiction as evidence.'],
    ],
    manifesto: 'MANIFESTO',
    mission: 'The goal is for XETHKIOZ to grow as a publication, community, creative studio and independent narrative network. With lights, portals and energy, but also responsibility, humanity and a recognizable voice.',
    dossiers: 'Explore dossiers',
    community: 'Enter the community',
    support: 'Support the project',
  },
} as const

export default function About() {
  const { lang } = useLang()
  const t = copy[lang]

  return <main className="xk-about-universe mx-auto max-w-6xl px-4 py-12 text-white sm:px-6">
    <SEO title={t.seoTitle} description={t.seoDescription} url="/about" />
    <section className="xk-about-hero" aria-labelledby="about-title"><p>{t.eyebrow}</p><h1 id="about-title">{t.title}</h1><span>{t.intro}</span></section>
    <section className="xk-about-story" aria-labelledby="about-story-title"><div><p>{t.creator}</p><h2 id="about-story-title">{t.adultGamer}</h2></div><div><p>{t.storyOne}</p><p>{t.storyTwo}</p></div></section>
    <section className="xk-about-districts" aria-label={lang === 'es' ? 'Distritos de XETHKIOZ' : 'XETHKIOZ districts'}>{t.districts.map(([code, title, description]) => <article key={code}><small>{code}</small><h2>{title}</h2><p>{description}</p></article>)}</section>
    <section className="xk-about-manifesto" aria-labelledby="about-manifesto-title"><p>{t.manifesto}</p><h2 id="about-manifesto-title">Gaming Is My Passion.<br />Beyond The Game.</h2><span>{t.mission}</span><div><Link to="/news">{t.dossiers} →</Link><Link to="/community">{t.community} →</Link><Link to="/support">{t.support} →</Link></div></section>
  </main>
}
