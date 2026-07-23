import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'
import { usePrivacyConsent } from '../lib/PrivacyConsentContext'

const copy = {
  es: {
    seoTitle: 'Privacidad y cookies',
    seoDescription: 'Cómo XETHKIOZ trata datos, medición, publicidad, formularios y preferencias de navegación.',
    eyebrow: 'TRUST CENTER // PRIVACIDAD',
    title: 'Tu información no es combustible del Nexus.',
    intro: 'Esta política explica de forma directa qué datos puede procesar XETHKIOZ y para qué. Última actualización: 23 de julio de 2026.',
    sections: [
      ['Datos que podés proporcionar', 'Si creás una cuenta, comentás, pedís un presupuesto o te suscribís, podemos procesar los datos necesarios para esa acción: correo, nombre visible, mensaje, preferencias y actividad asociada a tu cuenta. No solicitamos contraseñas por mensajes ni almacenamos datos de pago en esta web.'],
      ['Preferencias esenciales y consentimiento', 'El idioma, la sesión, la seguridad, el progreso local y tu decisión de privacidad pueden requerir almacenamiento esencial. La analítica y el marketing están desactivados por defecto y solo se habilitan después de una elección explícita. Podés aceptar, rechazar o configurar cada categoría.'],
      ['Analítica opcional', 'Si autorizás Analítica, XETHKIOZ puede activar Vercel Analytics, medición propia de visitas y, cuando estén configurados, Google Analytics y Microsoft Clarity. La medición propia puede procesar durante un máximo de 30 días la ruta, dirección IP, país o región aproximados, navegador, sistema operativo, dispositivo, idioma y tamaño de pantalla. Excluye bots conocidos y no registra contraseñas, mensajes, formularios, GPS ni el texto que escribís.'],
      ['Publicidad, afiliados y marketing', 'Los espacios patrocinados se identifican como publicidad o sponsor y pueden mostrarse sin seguimiento personalizado. Un enlace afiliado puede generar una comisión sin aumentar el precio. Meta Pixel y futuras mediciones publicitarias solo se cargan cuando autorizás Marketing. Antes de habilitar anuncios personalizados se informarán proveedores y opciones adicionales.'],
      ['Registros técnicos esenciales', 'Vercel, Supabase y otros proveedores de infraestructura pueden conservar registros operativos mínimos para entregar la web, prevenir abuso y resolver errores, aunque rechaces la analítica opcional. Estos registros se rigen también por las políticas de cada proveedor y no se utilizan desde XETHKIOZ para publicidad personalizada.'],
      ['Pagos y aportes', 'PayPal y Mercado Pago procesan las donaciones en sus propias plataformas. XETHKIOZ no recibe ni guarda números de tarjeta, credenciales bancarias o claves de esas cuentas.'],
      ['Tus decisiones y derechos', 'Podés no crear una cuenta, rechazar comunicaciones opcionales, cambiar el consentimiento y solicitar acceso, corrección o eliminación de datos vinculados a vos. Para ejercer estos derechos usá Contacto e indicá el correo asociado.'],
      ['Menores de edad', 'XETHKIOZ no está dirigido a menores de 13 años y no busca recopilar deliberadamente información personal de ese grupo. Si una persona responsable detecta un registro indebido, puede solicitar su revisión o eliminación desde Contacto.'],
      ['Seguridad, retención y cambios', 'Aplicamos permisos mínimos, controles de acceso, protección de formularios y límites de retención. Ningún sistema es invulnerable. Si una modificación material afecta el uso de datos, esta página mostrará una nueva fecha de actualización y, cuando corresponda, se solicitará una nueva decisión.'],
    ],
    preferencesTitle: 'Controlar categorías',
    preferencesText: 'Abrí el panel para revisar Analítica y Marketing. Si revocás una categoría activa, la página se recarga para detener sus herramientas.',
    preferencesAction: 'ABRIR PREFERENCIAS',
    accessTitle: 'Acceso y consultas',
    accessText: 'Para consultar, corregir o eliminar información vinculada a tu cuenta o a una solicitud comercial, escribí desde la página de Contacto usando el correo asociado. XETHKIOZ puede pedir una verificación razonable de identidad antes de modificar datos privados.',
  },
  en: {
    seoTitle: 'Privacy and cookies',
    seoDescription: 'How XETHKIOZ handles data, analytics, advertising, forms and browsing preferences.',
    eyebrow: 'TRUST CENTER // PRIVACY',
    title: 'Your information is not fuel for the Nexus.',
    intro: 'This policy explains directly which data XETHKIOZ may process and why. Last updated: July 23, 2026.',
    sections: [
      ['Information you may provide', 'When you create an account, comment, request a quote or subscribe, we may process the information needed for that action: email, display name, message, preferences and activity associated with your account. We never request passwords through messages and do not store payment information on this website.'],
      ['Essential preferences and consent', 'Language, session, security, local progress and your privacy decision may require essential storage. Analytics and marketing are disabled by default and are only enabled after an explicit choice. You may accept, reject or configure each category.'],
      ['Optional analytics', 'When you authorize Analytics, XETHKIOZ may enable Vercel Analytics, first-party visit measurement and, when configured, Google Analytics and Microsoft Clarity. First-party measurement may process for no more than 30 days the route, IP address, approximate country or region, browser, operating system, device, language and screen size. It excludes known bots and does not record passwords, messages, forms, GPS or text you enter.'],
      ['Advertising, affiliates and marketing', 'Sponsored placements are identified as advertising or sponsor content and may appear without personalized tracking. Affiliate links may generate a commission without increasing the price. Meta Pixel and future advertising measurement load only when you authorize Marketing. Providers and additional options will be disclosed before personalized ads are enabled.'],
      ['Essential technical logs', 'Vercel, Supabase and other infrastructure providers may retain minimum operational logs to deliver the website, prevent abuse and resolve errors even when optional analytics are rejected. Those logs are also governed by each provider’s policies and are not used by XETHKIOZ for personalized advertising.'],
      ['Payments and contributions', 'PayPal and Mercado Pago process donations on their own platforms. XETHKIOZ does not receive or store card numbers, banking credentials or passwords for those accounts.'],
      ['Your choices and rights', 'You may choose not to create an account, decline optional communications, change consent and request access, correction or deletion of information linked to you. Use the Contact page and identify the associated email address.'],
      ['Children', 'XETHKIOZ is not directed to children under 13 and does not knowingly seek personal information from that group. A parent or guardian who identifies an improper registration may request review or deletion through Contact.'],
      ['Security, retention and changes', 'We apply least-privilege permissions, access controls, form protection and retention limits. No system is invulnerable. If a material change affects data use, this page will display a new update date and, when appropriate, request a new decision.'],
    ],
    preferencesTitle: 'Control categories',
    preferencesText: 'Open the panel to review Analytics and Marketing. Disabling an active category reloads the page to stop its tools.',
    preferencesAction: 'OPEN PREFERENCES',
    accessTitle: 'Access and inquiries',
    accessText: 'To access, correct or delete information linked to your account or a commercial request, contact us through the Contact page using the associated email address. XETHKIOZ may request reasonable identity verification before modifying private information.',
  },
} as const

export default function Privacy() {
  const { lang } = useLang()
  const { openSettings } = usePrivacyConsent()
  const t = copy[lang]

  return (
    <main className="xk-trust-page mx-auto max-w-5xl px-4 py-12 text-white sm:px-6">
      <SEO title={t.seoTitle} description={t.seoDescription} url="/privacy" />
      <header aria-labelledby="privacy-title">
        <p>{t.eyebrow}</p>
        <h1 id="privacy-title">{t.title}</h1>
        <p className="xk-trust-lead">{t.intro}</p>
      </header>

      {t.sections.map(([title, description]) => (
        <section key={title} aria-labelledby={`privacy-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
          <h2 id={`privacy-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{title}</h2>
          <p>{description}</p>
        </section>
      ))}

      <section aria-labelledby="privacy-preferences-control-title">
        <h2 id="privacy-preferences-control-title">{t.preferencesTitle}</h2>
        <p>{t.preferencesText}</p>
        <button type="button" onClick={openSettings} className="mt-4 rounded-full border border-orange-400 bg-orange-400/10 px-5 py-3 font-mono text-[10px] font-black tracking-[.14em] text-orange-200 transition hover:bg-orange-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">{t.preferencesAction}</button>
      </section>

      <section aria-labelledby="privacy-access-title">
        <h2 id="privacy-access-title">{t.accessTitle}</h2>
        <p>{t.accessText}</p>
      </section>
    </main>
  )
}
