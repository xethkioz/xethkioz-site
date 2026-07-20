import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    seoTitle: 'Política editorial',
    seoDescription: 'Fuentes, correcciones, IA, publicidad y criterios editoriales de XETHKIOZ.',
    eyebrow: 'TRUST CENTER // PROTOCOLO EDITORIAL',
    title: 'La identidad puede ser fantástica. Los datos no.',
    intro: 'XETHKIOZ mezcla gaming, ciencia, tecnología, humor y misterio dentro de una Red de Portales con identidad propia. Esa ambientación nunca debe convertir una hipótesis en un hecho.',
    sections: [
      ['Fuentes y contexto', 'Priorizamos anuncios oficiales, documentación técnica, organismos públicos, publicaciones científicas y fuentes primarias. Cuando una noticia parte de otra cobertura, buscamos identificarla claramente. Los enlaces originales permanecen visibles en cada dossier siempre que estén disponibles.'],
      ['Confirmado, interpretación y rumor', 'Separamos el dato confirmado de la lectura editorial, la hipótesis, el rumor y la ficción. En Green Node, “no identificado” no significa extraterrestre y “documento oficial” no significa que cada afirmación del documento haya sido validada.'],
      ['Flujo editorial', 'El contenido pasa por borrador, revisión de estructura y fuentes, control de portada y texto alternativo, y aprobación antes de publicarse. El CMS puede bloquear la publicación cuando faltan profundidad, capítulos o fuentes verificables.'],
      ['Uso de inteligencia artificial', 'La IA puede ayudar a investigar, ordenar, traducir o preparar borradores. No es una fuente ni decide por sí sola qué se publica. El contenido asistido debe contrastarse con los enlaces citados, evitar información inventada y conservar revisión humana antes de hacerse público.'],
      ['Correcciones', 'Si aparece un error material, el contenido debe corregirse sin ocultar el cambio relevante. Fechas, cifras, nombres, enlaces rotos y atribuciones tienen prioridad de revisión. Cuando una corrección cambia la conclusión central, debe indicarse de forma visible.'],
      ['Publicidad e independencia', 'Los sponsors, campañas y enlaces afiliados se identifican. Una relación comercial no compra una conclusión editorial ni permite presentar publicidad como noticia. Las reseñas y recomendaciones deben declarar conflictos relevantes.'],
      ['Humor y comunidad', 'FUN puede exagerar, parodiar y jugar con el absurdo, pero no debe usar el humor para hostigar personas, difundir información privada o disfrazar acusaciones como memes. La participación comunitaria también está sujeta a moderación y seguridad.'],
    ],
    categoryTitle: 'Criterios por categoría',
    categories: [
      ['Gaming', 'Distinguir anuncios oficiales, filtraciones, rumores y opinión. Las guías deben indicar versión, plataforma o contexto cuando sea relevante.'],
      ['Ciencia y tecnología', 'Priorizar fuentes primarias, documentación y consenso disponible. Evitar presentar una correlación, demostración parcial o comunicado comercial como conclusión definitiva.'],
      ['FUN', 'Dejar claro cuándo una pieza es humor, parodia o exageración. No fabricar citas ni atribuir hechos falsos a personas reales.'],
      ['Green Node', 'Etiquetar evidencia, inferencia, hipótesis, ficción y opinión. La atmósfera oscura nunca sustituye el protocolo de verdad.'],
    ],
    contactTitle: 'Correcciones y contacto',
    contactText: 'Para señalar un error, una atribución incorrecta o un conflicto no declarado, usá la página de Contacto e incluí el enlace del contenido y una explicación concreta. La solicitud será revisada de forma humana.',
  },
  en: {
    seoTitle: 'Editorial policy',
    seoDescription: 'Sources, corrections, AI, advertising and editorial standards at XETHKIOZ.',
    eyebrow: 'TRUST CENTER // EDITORIAL PROTOCOL',
    title: 'The identity can be fantastic. The facts cannot.',
    intro: 'XETHKIOZ combines gaming, science, technology, humor and mystery within a Portal Network with its own identity. That atmosphere must never turn a hypothesis into a fact.',
    sections: [
      ['Sources and context', 'We prioritize official announcements, technical documentation, public institutions, scientific publications and primary sources. When an article begins with another outlet’s reporting, we seek to identify it clearly. Original links remain visible in each dossier whenever available.'],
      ['Confirmed facts, interpretation and rumor', 'We separate confirmed information from editorial interpretation, hypotheses, rumors and fiction. In Green Node, “unidentified” does not mean extraterrestrial, and an “official document” does not mean every claim in that document has been validated.'],
      ['Editorial workflow', 'Content moves through draft, structure and source review, cover and alternative-text checks, and approval before publication. The CMS may block publication when depth, chapters or verifiable sources are missing.'],
      ['Use of artificial intelligence', 'AI may assist with research, organization, translation or draft preparation. It is not a source and does not decide what is published. Assisted content must be checked against cited links, avoid fabricated information and receive human review before becoming public.'],
      ['Corrections', 'When a material error is found, the content should be corrected without hiding the relevant change. Dates, figures, names, broken links and attribution receive priority. When a correction changes the central conclusion, it should be disclosed visibly.'],
      ['Advertising and independence', 'Sponsors, campaigns and affiliate links are identified. A commercial relationship does not purchase an editorial conclusion or allow advertising to be presented as news. Reviews and recommendations must disclose relevant conflicts.'],
      ['Humor and community', 'FUN may exaggerate, parody and play with absurdity, but humor must not be used to harass people, spread private information or disguise accusations as memes. Community participation is also subject to moderation and safety controls.'],
    ],
    categoryTitle: 'Standards by category',
    categories: [
      ['Gaming', 'Distinguish official announcements, leaks, rumors and opinion. Guides should identify the version, platform or context when relevant.'],
      ['Science and technology', 'Prioritize primary sources, documentation and the available consensus. Do not present correlation, partial demonstrations or commercial announcements as definitive conclusions.'],
      ['FUN', 'Make clear when a piece is humor, parody or exaggeration. Never fabricate quotes or attribute false events to real people.'],
      ['Green Node', 'Label evidence, inference, hypothesis, fiction and opinion. The dark atmosphere never replaces the truth protocol.'],
    ],
    contactTitle: 'Corrections and contact',
    contactText: 'To report an error, incorrect attribution or undisclosed conflict, use the Contact page and include the content link with a specific explanation. The request will receive human review.',
  },
} as const

export default function EditorialPolicy() {
  const { lang } = useLang()
  const t = copy[lang]

  return (
    <main className="xk-trust-page mx-auto max-w-5xl px-4 py-12 text-white sm:px-6">
      <SEO title={t.seoTitle} description={t.seoDescription} url="/editorial-policy" />
      <header aria-labelledby="editorial-policy-title">
        <p>{t.eyebrow}</p>
        <h1 id="editorial-policy-title">{t.title}</h1>
        <p className="xk-trust-lead">{t.intro}</p>
      </header>

      {t.sections.map(([title, description], index) => (
        <section key={title} aria-labelledby={`editorial-section-${index + 1}`}>
          <h2 id={`editorial-section-${index + 1}`}>{title}</h2>
          <p>{description}</p>
        </section>
      ))}

      <section aria-labelledby="editorial-categories-title">
        <h2 id="editorial-categories-title">{t.categoryTitle}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {t.categories.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="editorial-contact-title">
        <h2 id="editorial-contact-title">{t.contactTitle}</h2>
        <p>{t.contactText}</p>
      </section>
    </main>
  )
}
