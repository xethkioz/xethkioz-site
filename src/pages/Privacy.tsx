import SEO from '../components/SEO'
import { useLang } from '../lib/LangContext'

const copy = {
  es: {
    seoTitle: 'Privacidad y cookies',
    seoDescription: 'Cómo XETHKIOZ trata datos, medición, publicidad, formularios y preferencias de navegación.',
    eyebrow: 'TRUST CENTER // PRIVACIDAD',
    title: 'Tu información no es combustible del Nexus.',
    intro: 'Esta política explica de forma directa qué datos puede procesar XETHKIOZ y para qué. Última actualización: 20 de julio de 2026.',
    sections: [
      ['Datos que podés proporcionar', 'Si creás una cuenta, comentás, pedís un presupuesto o te suscribís, podemos procesar los datos necesarios para esa acción: correo, nombre visible, mensaje, preferencias y actividad asociada a tu cuenta. No solicitamos contraseñas por mensajes ni almacenamos datos de pago en esta web.'],
      ['Medición y almacenamiento local', 'La web puede usar medición de audiencia para conocer páginas visitadas, dispositivo aproximado, rendimiento y errores. También usa almacenamiento local para preferencias, progreso del Wisp y estado de sesión. Las herramientas externas solo se activan cuando están configuradas por el administrador.'],
      ['Registros técnicos de funcionamiento', 'Para detectar errores, abuso y problemas de compatibilidad podemos conservar durante un máximo de 30 días la fecha, ruta visitada, dirección IP, país o región aproximados, navegador, sistema operativo, tipo de dispositivo, idioma y tamaño de pantalla. No registramos mediante este sistema contraseñas, mensajes, formularios, coordenadas GPS ni el contenido que escribís. Los registros son privados, solo pueden ser consultados por ADMIN y se usan para seguridad y funcionamiento.'],
      ['Publicidad, afiliados y terceros', 'Los espacios patrocinados se identifican como publicidad o sponsor. Un enlace afiliado puede generar una comisión para XETHKIOZ sin aumentar el precio para el visitante y se marcará como tal. Si en el futuro se activa una red como Google AdSense, esta política se actualizará para informar proveedores, cookies y opciones de consentimiento antes de habilitar anuncios personalizados.'],
      ['Pagos y aportes', 'PayPal y Mercado Pago procesan las donaciones en sus propias plataformas. XETHKIOZ no recibe ni guarda números de tarjeta, credenciales bancarias o claves de esas cuentas.'],
      ['Tus decisiones y derechos', 'Podés no crear una cuenta, rechazar comunicaciones opcionales y solicitar acceso, corrección o eliminación de los datos vinculados a vos. Para ejercer estos derechos usá la página de contacto e indicá el correo asociado.'],
      ['Menores de edad', 'XETHKIOZ no está dirigido a menores de 13 años y no busca recopilar deliberadamente información personal de ese grupo. Si una persona responsable detecta un registro indebido, puede solicitar su revisión o eliminación desde Contacto.'],
      ['Seguridad, retención y cambios', 'Aplicamos permisos mínimos, controles de acceso y protección de formularios. Ningún sistema es invulnerable; los proveedores técnicos pueden conservar registros operativos según sus propias políticas. Si una modificación material afecta el uso de datos, esta página mostrará una nueva fecha de actualización.'],
    ],
    accessTitle: 'Acceso y consultas',
    accessText: 'Para consultar, corregir o eliminar información vinculada a tu cuenta o a una solicitud comercial, escribí desde la página de Contacto usando el correo asociado. XETHKIOZ puede pedir una verificación razonable de identidad antes de modificar datos privados.',
  },
  en: {
    seoTitle: 'Privacy and cookies',
    seoDescription: 'How XETHKIOZ handles data, analytics, advertising, forms and browsing preferences.',
    eyebrow: 'TRUST CENTER // PRIVACY',
    title: 'Your information is not fuel for the Nexus.',
    intro: 'This policy explains directly which data XETHKIOZ may process and why. Last updated: July 20, 2026.',
    sections: [
      ['Information you may provide', 'When you create an account, comment, request a quote or subscribe, we may process the information needed for that action: email, display name, message, preferences and activity associated with your account. We never request passwords through messages and do not store payment information on this website.'],
      ['Analytics and local storage', 'The website may use audience measurement to understand visited pages, approximate device type, performance and errors. It also uses local storage for preferences, Wisp progress and session state. External tools are only enabled when configured by the administrator.'],
      ['Technical operation logs', 'To detect errors, abuse and compatibility problems, we may retain for no more than 30 days the date, visited route, IP address, approximate country or region, browser, operating system, device type, language and screen size. This system does not record passwords, messages, form contents, GPS coordinates or the text you enter. Logs are private, available only to ADMIN and used for security and operation.'],
      ['Advertising, affiliates and third parties', 'Sponsored placements are identified as advertising or sponsor content. An affiliate link may generate a commission for XETHKIOZ without increasing the visitor’s price and will be labeled accordingly. If a network such as Google AdSense is enabled in the future, this policy will be updated to identify providers, cookies and consent options before personalized advertising is activated.'],
      ['Payments and contributions', 'PayPal and Mercado Pago process donations on their own platforms. XETHKIOZ does not receive or store card numbers, banking credentials or passwords for those accounts.'],
      ['Your choices and rights', 'You may choose not to create an account, decline optional communications and request access, correction or deletion of information linked to you. To exercise these rights, use the Contact page and identify the associated email address.'],
      ['Children', 'XETHKIOZ is not directed to children under 13 and does not knowingly seek personal information from that group. A parent or guardian who identifies an improper registration may request review or deletion through Contact.'],
      ['Security, retention and changes', 'We apply least-privilege permissions, access controls and form protections. No system is invulnerable, and technical providers may retain operational logs under their own policies. If a material change affects data use, this page will display a new update date.'],
    ],
    accessTitle: 'Access and inquiries',
    accessText: 'To access, correct or delete information linked to your account or a commercial request, contact us through the Contact page using the associated email address. XETHKIOZ may request reasonable identity verification before modifying private information.',
  },
} as const

export default function Privacy() {
  const { lang } = useLang()
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

      <section aria-labelledby="privacy-access-title">
        <h2 id="privacy-access-title">{t.accessTitle}</h2>
        <p>{t.accessText}</p>
      </section>
    </main>
  )
}
