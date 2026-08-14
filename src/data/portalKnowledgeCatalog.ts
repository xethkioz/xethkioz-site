export type KnowledgeLang = 'es' | 'en'
export type KnowledgeSector = 'gaming' | 'science' | 'comicon' | 'green' | 'pets' | 'web' | 'nexus'

type LocalizedText = Record<KnowledgeLang, string>

export type PortalKnowledgeGuide = {
  id: string
  eyebrow: LocalizedText
  title: LocalizedText
  intro: LocalizedText
  steps: Record<KnowledgeLang, string[]>
  limit: LocalizedText
  sourceLabel: string
  sourceUrl: string
}

export const portalKnowledgeCatalog: Record<KnowledgeSector, PortalKnowledgeGuide[]> = {
  gaming: [
    {
      id: 'gaming-account-shield',
      eyebrow: { es: 'Cuenta segura', en: 'Account safety' },
      title: { es: 'Blindá tu cuenta antes de comprar o intercambiar', en: 'Protect your account before buying or trading' },
      intro: {
        es: 'Un inventario valioso también es una identidad digital. Steam recomienda proteger el correo asociado, usar Steam Guard y desconfiar de enlaces que prometen premios o ítems.',
        en: 'A valuable inventory is also a digital identity. Steam recommends securing the linked email, using Steam Guard and distrusting links that promise prizes or items.',
      },
      steps: {
        es: ['Activá Steam Guard desde la configuración de seguridad.', 'Protegé también el correo asociado con una contraseña única y segundo factor.', 'Entrá a la tienda escribiendo la dirección o desde la aplicación; no desde mensajes inesperados.', 'Si perdiste acceso, usá el flujo oficial de recuperación y cambiá primero la clave del correo.'],
        en: ['Enable Steam Guard in security settings.', 'Protect the linked email with a unique password and a second factor.', 'Open the store from the app or by typing its address, not from unexpected messages.', 'If access is lost, use the official recovery flow and change the email password first.'],
      },
      limit: {
        es: 'Steam Guard reduce el riesgo, pero no valida intercambios ni recupera por sí solo objetos entregados voluntariamente. El soporte nunca necesita que le compartas códigos de acceso.',
        en: 'Steam Guard reduces risk, but it does not validate trades or automatically recover voluntarily transferred items. Support never needs your access codes.',
      },
      sourceLabel: 'Steam Support · Account security recommendations',
      sourceUrl: 'https://help.steampowered.com/en/faqs/view/6639-EB3C-EC79-FF60',
    },
    {
      id: 'gaming-accessibility-check',
      eyebrow: { es: 'Elegir mejor', en: 'Choose better' },
      title: { es: 'Revisá accesibilidad antes de comprar un juego', en: 'Check accessibility before buying a game' },
      intro: {
        es: 'Los requisitos personales no se resumen en “fácil” o “difícil”. Xbox publica etiquetas para identificar funciones visuales, auditivas, de entrada y de jugabilidad antes de decidir.',
        en: 'Personal requirements cannot be reduced to “easy” or “hard.” Xbox publishes tags that identify visual, audio, input and gameplay features before a decision.',
      },
      steps: {
        es: ['Definí qué barrera necesitás resolver: texto, color, audio, controles o ritmo.', 'Buscá las etiquetas de accesibilidad en la ficha del juego.', 'Confirmá el detalle dentro de “Capacidades” y revisá si la función está en todas las plataformas.', 'Si existe demo o devolución, probá la configuración en una sesión real.'],
        en: ['Identify the barrier you need to address: text, color, audio, controls or pace.', 'Look for accessibility tags on the game page.', 'Confirm the details under Capabilities and whether the feature exists on every platform.', 'When a demo or refund option exists, test the settings in a real session.'],
      },
      limit: {
        es: 'Una etiqueta indica que existe una función, no que vaya a cubrir todas las necesidades. La implementación puede variar entre versiones, periféricos y actualizaciones.',
        en: 'A tag indicates that a feature exists, not that it covers every need. Implementation may differ between versions, peripherals and updates.',
      },
      sourceLabel: 'Xbox Support · Game accessibility feature tags',
      sourceUrl: 'https://support.xbox.com/en-US/help/account-profile/accessibility/game-accessibility-features',
    },
  ],
  science: [
    {
      id: 'science-citizen-project',
      eyebrow: { es: 'Participación real', en: 'Real participation' },
      title: { es: 'Cómo sumarte a un proyecto de ciencia ciudadana', en: 'How to join a citizen-science project' },
      intro: {
        es: 'NASA reúne proyectos abiertos en los que una observación, una clasificación o una medición hecha con teléfono o computadora puede contribuir a una investigación.',
        en: 'NASA gathers open projects where an observation, classification or measurement made with a phone or computer can contribute to research.',
      },
      steps: {
        es: ['Elegí un proyecto por tema, tiempo disponible y herramientas requeridas.', 'Leé el protocolo completo antes de registrar la primera observación.', 'Conservá fecha, ubicación y condiciones cuando el proyecto las solicite.', 'Enviá datos aunque el resultado parezca “normal”: la ausencia también puede ser información útil.'],
        en: ['Choose a project by subject, available time and required tools.', 'Read the full protocol before recording the first observation.', 'Keep date, location and conditions whenever the project requests them.', 'Submit data even when the result looks ordinary: an absence can also be useful information.'],
      },
      limit: {
        es: 'Participar no convierte una observación aislada en una conclusión científica. La calidad depende de seguir el protocolo y del análisis conjunto realizado por el equipo responsable.',
        en: 'Participation does not turn one observation into a scientific conclusion. Quality depends on following the protocol and on the responsible team’s combined analysis.',
      },
      sourceLabel: 'NASA Science · Citizen Science',
      sourceUrl: 'https://science.nasa.gov/citizen-science/',
    },
    {
      id: 'science-ai-risk',
      eyebrow: { es: 'IA con criterio', en: 'Thoughtful AI' },
      title: { es: 'Evaluá una herramienta de IA antes de confiar en ella', en: 'Evaluate an AI tool before trusting it' },
      intro: {
        es: 'El marco de NIST organiza el riesgo en cuatro funciones: gobernar, mapear, medir y gestionar. Sirve para pasar de la fascinación inicial a preguntas verificables.',
        en: 'The NIST framework organizes risk into four functions: govern, map, measure and manage. It turns initial excitement into verifiable questions.',
      },
      steps: {
        es: ['Definí para qué decisión se usará la salida y quién puede verse afectado.', 'Mapeá datos de entrada, contexto, posibles sesgos y consecuencias de un error.', 'Medí precisión y fallos con ejemplos representativos, no sólo con una demostración ideal.', 'Establecé revisión humana, registro de incidentes y una forma clara de detener el sistema.'],
        en: ['Define what decision will use the output and who may be affected.', 'Map input data, context, possible bias and the consequences of an error.', 'Measure accuracy and failures with representative examples, not only an ideal demo.', 'Set human review, incident records and a clear way to stop the system.'],
      },
      limit: {
        es: 'El AI RMF es voluntario y no certifica que una herramienta sea segura, justa o legal. Debe combinarse con pruebas del caso concreto y las normas aplicables.',
        en: 'The AI RMF is voluntary and does not certify that a tool is safe, fair or lawful. Combine it with case-specific testing and applicable rules.',
      },
      sourceLabel: 'NIST · AI Risk Management Framework',
      sourceUrl: 'https://www.nist.gov/itl/ai-risk-management-framework',
    },
  ],
  comicon: [
    {
      id: 'comicon-marvel-entry',
      eyebrow: { es: 'Ruta de lectura', en: 'Reading route' },
      title: { es: 'Empezá Marvel sin leer décadas de continuidad', en: 'Start Marvel without reading decades of continuity' },
      intro: {
        es: 'Marvel Unlimited organiza arcos y personajes mediante listas de lectura. La clave es elegir una puerta de entrada y consultar contexto sólo cuando realmente haga falta.',
        en: 'Marvel Unlimited organizes arcs and characters through reading lists. The key is choosing one entry point and looking up context only when it is truly needed.',
      },
      steps: {
        es: ['Elegí un personaje, equipo o evento que ya te interese.', 'Abrí una lista editorial y empezá por el primer número indicado.', 'Leé el arco completo antes de saltar a referencias antiguas.', 'Guardá lo que te gustó y seguí al guionista o dibujante, no sólo al personaje.'],
        en: ['Choose a character, team or event you already care about.', 'Open an editorial reading list and start with its first listed issue.', 'Finish the arc before jumping to older references.', 'Save what you liked and follow the writer or artist, not only the character.'],
      },
      limit: {
        es: 'El catálogo y la disponibilidad cambian por región y tipo de suscripción. Una lista propone un recorrido; no existe un único orden obligatorio para disfrutar los cómics.',
        en: 'Catalog and availability vary by region and subscription. A list suggests a route; there is no single mandatory order for enjoying comics.',
      },
      sourceLabel: 'Marvel · How to read comics the Marvel Unlimited way',
      sourceUrl: 'https://www.marvel.com/articles/comics/how-to-read-comics-the-marvel-unlimited-way',
    },
    {
      id: 'comicon-dc-entry',
      eyebrow: { es: 'Punto de entrada', en: 'Entry point' },
      title: { es: 'Armá una primera ruta de lectura en DC', en: 'Build a first DC reading route' },
      intro: {
        es: 'DC agrupa colecciones de inicio por héroe, universo y etapa. Eso permite comenzar con una historia completa sin convertir la continuidad en una barrera.',
        en: 'DC groups starting collections by hero, universe and era. This lets readers begin with a complete story without turning continuity into a barrier.',
      },
      steps: {
        es: ['Elegí héroe, tono o formato antes que una cronología completa.', 'Usá una colección “Where to Start” como mapa inicial.', 'Terminá un tomo o arco y anotá qué autores querés seguir.', 'Recién después explorá eventos relacionados o etapas anteriores.'],
        en: ['Choose a hero, tone or format before attempting a complete chronology.', 'Use a Where to Start collection as the initial map.', 'Finish one volume or arc and note which creators you want to follow.', 'Only then explore related events or earlier eras.'],
      },
      limit: {
        es: 'DC Universe Infinite no está disponible del mismo modo en todos los países. Verificá región, idioma, dispositivos y condiciones antes de suscribirte.',
        en: 'DC Universe Infinite is not available in the same way in every country. Check region, language, devices and terms before subscribing.',
      },
      sourceLabel: 'DC Universe Infinite · Where to Start',
      sourceUrl: 'https://www.dcuniverseinfinite.com/collections/cc-where-to-start-collections',
    },
  ],
  green: [
    {
      id: 'green-account-baseline',
      eyebrow: { es: 'Defensa cotidiana', en: 'Everyday defense' },
      title: { es: 'La base mínima para proteger tus cuentas', en: 'The minimum baseline for protecting accounts' },
      intro: {
        es: 'CISA concentra cuatro hábitos de alto impacto: reconocer phishing, usar contraseñas fuertes, activar autenticación multifactor y mantener el software actualizado.',
        en: 'CISA focuses on four high-impact habits: recognize phishing, use strong passwords, enable multifactor authentication and keep software updated.',
      },
      steps: {
        es: ['Usá una contraseña distinta por servicio y guardala en un administrador confiable.', 'Activá MFA; preferí una app autenticadora o llave de seguridad cuando estén disponibles.', 'Antes de abrir un enlace inesperado, verificá remitente, dominio y contexto por otro canal.', 'Instalá actualizaciones automáticas en sistema, navegador y aplicaciones sensibles.'],
        en: ['Use a different password for every service and store it in a trusted manager.', 'Enable MFA; prefer an authenticator app or security key when available.', 'Before opening an unexpected link, verify sender, domain and context through another channel.', 'Enable automatic updates for the operating system, browser and sensitive apps.'],
      },
      limit: {
        es: 'Ninguna medida aislada elimina el riesgo. Si sospechás una intrusión, cambiá credenciales desde un dispositivo confiable, cerrá sesiones y contactá al proveedor oficial.',
        en: 'No single measure removes all risk. If you suspect a compromise, change credentials from a trusted device, close sessions and contact the official provider.',
      },
      sourceLabel: 'CISA · Secure Our World',
      sourceUrl: 'https://www.cisa.gov/secure-our-world',
    },
    {
      id: 'green-web-risk',
      eyebrow: { es: 'Seguridad web', en: 'Web security' },
      title: { es: 'Usá OWASP Top 10 como inicio, no como certificado', en: 'Use OWASP Top 10 as a starting point, not a certificate' },
      intro: {
        es: 'OWASP Top 10:2025 resume riesgos críticos como control de acceso roto, mala configuración, fallas de cadena de suministro e inyección.',
        en: 'OWASP Top 10:2025 summarizes critical risks such as broken access control, security misconfiguration, supply-chain failures and injection.',
      },
      steps: {
        es: ['Mapeá cada función sensible, dato y dependencia externa.', 'Probá autorización en servidor: ocultar un botón no protege una acción.', 'Reducí configuraciones por defecto y mantené un inventario de dependencias.', 'Registrá eventos de seguridad y ensayá cómo responder a un incidente.'],
        en: ['Map every sensitive function, data set and external dependency.', 'Test authorization on the server: hiding a button does not protect an action.', 'Reduce default configurations and keep a dependency inventory.', 'Log security events and rehearse the incident-response path.'],
      },
      limit: {
        es: 'Cumplir una lista no demuestra seguridad. El Top 10 es concientización y priorización; un sistema real requiere modelado de amenazas, pruebas y revisión continua.',
        en: 'Completing a checklist does not prove security. The Top 10 supports awareness and prioritization; a real system needs threat modeling, testing and continuous review.',
      },
      sourceLabel: 'OWASP · Top 10:2025',
      sourceUrl: 'https://owasp.org/Top10/2025/',
    },
  ],
  pets: [
    {
      id: 'pets-rabies',
      eyebrow: { es: 'Salud preventiva', en: 'Preventive health' },
      title: { es: 'Vacunación antirrábica: qué controlar y cuándo consultar', en: 'Rabies vaccination: what to check and when to ask for help' },
      intro: {
        es: 'La rabia es prevenible, pero exige un esquema sostenido. SENASA indica vacunar perros y gatos desde los tres meses y revacunar cada año.',
        en: 'Rabies is preventable, but requires a sustained schedule. SENASA advises vaccinating dogs and cats from three months of age and yearly thereafter.',
      },
      steps: {
        es: ['Revisá la libreta sanitaria y la fecha de la última dosis.', 'Consultá a una veterinaria habilitada si no conocés los antecedentes.', 'Guardá el certificado para viajes, mordeduras o controles.', 'Ante contacto con un murciélago u otro animal sospechoso, evitá tocarlo y pedí indicaciones sanitarias.'],
        en: ['Check the health record and last dose date.', 'Ask a licensed veterinarian when the history is unknown.', 'Keep the certificate for travel, bites or inspections.', 'After contact with a bat or suspicious animal, avoid touching it and seek public-health guidance.'],
      },
      limit: {
        es: 'La guía no reemplaza una consulta veterinaria ni confirma campañas municipales. Publicamos fechas locales sólo cuando las anuncia la institución responsable.',
        en: 'This guide does not replace veterinary care or confirm local campaigns. Local dates should only be published after the responsible institution announces them.',
      },
      sourceLabel: 'SENASA · Consideraciones generales y legislación sobre rabia',
      sourceUrl: 'https://www.argentina.gob.ar/senasa/consideraciones-generales-y-legislacion',
    },
    {
      id: 'pets-responsible-care',
      eyebrow: { es: 'Convivencia', en: 'Living together' },
      title: { es: 'Tenencia responsable como rutina diaria', en: 'Responsible care as a daily routine' },
      intro: {
        es: 'Cuidar incluye salud, identificación, control reproductivo, traslado seguro y una convivencia que evite abandono o riesgos para terceros.',
        en: 'Care includes health, identification, reproductive control, safe transport and coexistence that avoids abandonment or risks to others.',
      },
      steps: {
        es: ['Mantené identificación visible y contacto actualizado.', 'Usá correa y traslado seguro; no permitas que deambule solo.', 'Planificá vacunación, desparasitación y castración con profesionales.', 'Conservá una foto reciente y datos físicos claros por si se pierde.'],
        en: ['Keep visible identification and current contact details.', 'Use a lead and safe transport; do not allow roaming.', 'Plan vaccination, parasite control and neutering with professionals.', 'Keep a recent photo and clear physical details in case the animal goes missing.'],
      },
      limit: {
        es: 'El Decreto 1088/2011 fija principios nacionales; ordenanzas, turnos y servicios concretos varían según el municipio.',
        en: 'Decree 1088/2011 establishes national principles; local ordinances, appointments and services vary by municipality.',
      },
      sourceLabel: 'Argentina.gob.ar · Decreto 1088/2011',
      sourceUrl: 'https://www.argentina.gob.ar/normativa/nacional/decreto-1088-2011-184639/texto',
    },
    {
      id: 'pets-abuse-report',
      eyebrow: { es: 'Acción segura', en: 'Safe action' },
      title: { es: 'Cómo actuar ante maltrato animal', en: 'How to respond to animal abuse' },
      intro: {
        es: 'El maltrato y la crueldad animal pueden denunciarse. La prioridad es proteger a la víctima sin exponerte ni destruir evidencia útil.',
        en: 'Animal abuse and cruelty can be reported. The priority is protecting the victim without exposing yourself or destroying useful evidence.',
      },
      steps: {
        es: ['Si ocurre en la vía pública, llamá al 911 y describí el lugar con precisión.', 'No enfrentes a una persona violenta; registrá fecha, lugar y hechos desde una posición segura.', 'Denunciá en comisaría o fiscalía y aportá fotos, videos o testigos si existen.', 'Pedí constancia o número de actuación para hacer seguimiento.'],
        en: ['If it is happening in public, call 911 and describe the location precisely.', 'Do not confront a violent person; record date, place and facts from a safe position.', 'Report it to police or prosecutors and provide photos, video or witnesses when available.', 'Ask for a report or case number for follow-up.'],
      },
      limit: {
        es: 'No publiques datos personales ni acusaciones sin intervención de la autoridad. La denuncia formal permite investigar y reduce riesgos.',
        en: 'Do not publish personal data or accusations without authority involvement. A formal report enables investigation and reduces risk.',
      },
      sourceLabel: 'Derecho Fácil · Maltrato a los animales',
      sourceUrl: 'https://www.argentina.gob.ar/justicia/derechofacil/leysimple/maltrato-animales',
    },
  ],
  web: [
    {
      id: 'web-accessibility',
      eyebrow: { es: 'Calidad inclusiva', en: 'Inclusive quality' },
      title: { es: 'Revisá una web con los cuatro principios WCAG', en: 'Review a website with the four WCAG principles' },
      intro: {
        es: 'WCAG 2.2 ordena la accesibilidad en contenido perceptible, operable, comprensible y robusto. Es una base concreta para diseñar y probar.',
        en: 'WCAG 2.2 organizes accessibility around perceivable, operable, understandable and robust content. It is a practical basis for design and testing.',
      },
      steps: {
        es: ['Confirmá contraste, texto alternativo y contenido que no dependa sólo del color.', 'Recorré toda la interfaz usando únicamente teclado.', 'Revisá títulos, etiquetas, mensajes de error y orden de lectura.', 'Combiná herramientas automáticas con pruebas manuales y personas usuarias.'],
        en: ['Confirm contrast, alternative text and content that does not depend on color alone.', 'Navigate the entire interface using only a keyboard.', 'Review headings, labels, error messages and reading order.', 'Combine automated tools with manual testing and user feedback.'],
      },
      limit: {
        es: 'Una auditoría automática detecta sólo parte de los problemas. La conformidad requiere evaluación humana y no garantiza por sí sola una experiencia excelente.',
        en: 'An automated audit detects only some issues. Conformance requires human evaluation and does not by itself guarantee an excellent experience.',
      },
      sourceLabel: 'W3C · Web Content Accessibility Guidelines 2.2',
      sourceUrl: 'https://www.w3.org/TR/WCAG22/',
    },
    {
      id: 'web-vitals',
      eyebrow: { es: 'Rendimiento real', en: 'Real performance' },
      title: { es: 'Medí experiencia con datos de usuarios, no sólo laboratorio', en: 'Measure experience with user data, not only lab tests' },
      intro: {
        es: 'Core Web Vitals resume carga, interacción y estabilidad visual. web.dev recomienda observar el percentil 75 y separar móviles y escritorio.',
        en: 'Core Web Vitals summarize loading, interaction and visual stability. web.dev recommends observing the 75th percentile and separating mobile and desktop.',
      },
      steps: {
        es: ['Registrá LCP, INP y CLS en producción con medición de campo.', 'Segmentá por ruta, dispositivo y versión para encontrar regresiones.', 'Usá laboratorio para reproducir el problema, no para reemplazar datos reales.', 'Fijá presupuesto de rendimiento y comprobalo antes de cada despliegue.'],
        en: ['Record LCP, INP and CLS in production with field measurement.', 'Segment by route, device and version to find regressions.', 'Use lab tests to reproduce the issue, not to replace real-world data.', 'Set a performance budget and check it before each deployment.'],
      },
      limit: {
        es: 'Una puntuación única no representa a toda la audiencia. Pocos datos, extensiones, red o dispositivo pueden distorsionar una sesión.',
        en: 'A single score does not represent the whole audience. Small samples, extensions, network or device conditions can distort a session.',
      },
      sourceLabel: 'web.dev · Web Vitals',
      sourceUrl: 'https://web.dev/articles/vitals',
    },
  ],
  nexus: [
    {
      id: 'nexus-personal-data',
      eyebrow: { es: 'Identidad digital', en: 'Digital identity' },
      title: { es: 'Compartí menos datos y conservá más control', en: 'Share less data and keep more control' },
      intro: {
        es: 'La AAIP recomienda entender qué datos se entregan, para qué se usan y qué huella dejan. En una comunidad, la privacidad empieza antes de publicar.',
        en: 'Argentina’s AAIP recommends understanding what data is shared, how it is used and what footprint it leaves. In a community, privacy starts before posting.',
      },
      steps: {
        es: ['Evitá publicar domicilio, rutina, documentos o ubicación en tiempo real.', 'Usá avatar y nombre de comunidad cuando no sea necesario identificarte legalmente.', 'Revisá permisos, visibilidad del perfil y política de privacidad.', 'Si un dato deja de ser necesario, pedí su corrección o eliminación por el canal oficial.'],
        en: ['Avoid posting addresses, routines, documents or real-time location.', 'Use an avatar and community name when legal identification is unnecessary.', 'Review permissions, profile visibility and the privacy policy.', 'When data is no longer needed, request correction or deletion through the official channel.'],
      },
      limit: {
        es: 'Borrar una publicación no garantiza que desaparezcan copias o capturas. Ante suplantación, amenaza o difusión de datos sensibles, preservá evidencia y buscá ayuda formal.',
        en: 'Deleting a post does not guarantee that copies or screenshots disappear. For impersonation, threats or sensitive-data exposure, preserve evidence and seek formal help.',
      },
      sourceLabel: 'AAIP · Nuestro Mundo Digital',
      sourceUrl: 'https://www.argentina.gob.ar/aaip/nuestro-mundo-digital-guia-pedagogica-y-guia-para-adolescentes',
    },
    {
      id: 'nexus-community-safety',
      eyebrow: { es: 'Convivencia segura', en: 'Safer communities' },
      title: { es: 'Bloquear, reportar y preservar evidencia', en: 'Block, report and preserve evidence' },
      intro: {
        es: 'Las herramientas de seguridad funcionan mejor cuando se usan temprano. Discord reúne controles para mensajes, bloqueo, reportes, contenido sensible y acompañamiento familiar.',
        en: 'Safety tools work best when used early. Discord brings together controls for messages, blocking, reports, sensitive content and family support.',
      },
      steps: {
        es: ['Cortá la interacción si alguien insiste, amenaza o pide información privada.', 'Bloqueá la cuenta y ajustá quién puede enviarte mensajes o solicitudes.', 'Conservá enlaces, identificadores, fechas y capturas sin redistribuir el contenido.', 'Reportá dentro de la plataforma y acudí a una persona adulta o autoridad si existe riesgo inmediato.'],
        en: ['End the interaction if someone persists, threatens or asks for private information.', 'Block the account and adjust who can send messages or requests.', 'Keep links, identifiers, dates and screenshots without redistributing the content.', 'Report in the platform and contact a trusted adult or authority when there is immediate danger.'],
      },
      limit: {
        es: 'Un reporte de plataforma no reemplaza una emergencia ni garantiza un resultado inmediato. No respondas con hostigamiento ni difundas material sensible para “exponer” a otra persona.',
        en: 'A platform report does not replace emergency services or guarantee an immediate outcome. Do not retaliate or redistribute sensitive material to expose someone.',
      },
      sourceLabel: 'Discord · Safety Library',
      sourceUrl: 'https://discord.com/safety-library',
    },
  ],
}

