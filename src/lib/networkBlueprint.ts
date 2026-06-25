export const networkReadiness = [
  {
    title: 'Portal principal',
    status: 'RC activo',
    detail: 'Gaming & Technology continúa como portada principal de XETHKIOZ Network, con noticias, streaming, comunidad y contenido multimedia.',
  },
  {
    title: 'Science Lab',
    status: 'Separado visualmente',
    detail: 'División formal para informes, fuentes verificables, nivel de evidencia y lectura más institucional.',
  },
  {
    title: 'Green Node',
    status: 'Nodo oculto',
    detail: 'Acceso mediante wisp verde, transición portal, terminal, Linux, programación, ciberseguridad educativa y misterios documentales.',
  },
  {
    title: 'CMS + Roles',
    status: 'Base lista',
    detail: 'Estructura preparada para admin, editor, moderador, autor, donador y sistema de XP/reputación.',
  },
]

export const scienceEditorialChecks = [
  'Identificar fuente primaria o institucional.',
  'Distinguir paper revisado, preprint, informe, comunicado o divulgación.',
  'Declarar fecha, autor y nivel de evidencia.',
  'Evitar titulares absolutos cuando la evidencia sea preliminar.',
  'Agregar contexto para público general sin perder precisión.',
]

export const scienceReportFields = [
  { label: 'Fuente', value: 'source_name + source_url' },
  { label: 'Evidencia', value: 'Divulgación / Informe / Paper / Preprint / Institucional' },
  { label: 'Trazabilidad', value: 'DOI, organismo, paper o repositorio cuando exista' },
  { label: 'Revisión', value: 'Borrador → revisión → publicado → archivado' },
]

export const greenNodeCommands = [
  {
    input: 'whoami',
    output: ['visitor', 'clearance_level=GREEN', 'network_scope=xethkioz'],
  },
  {
    input: 'sudo truth',
    output: ['truth requires evidence', 'speculation_mode=flagged', 'publish_policy=documentary_only'],
  },
  {
    input: 'matrix',
    output: ['rendering glitch layer...', 'neon_channel=active', 'portal_stability=87%'],
  },
  {
    input: '42',
    output: ['answer accepted', 'unlock: analyst_fragment', 'remember: question everything'],
  },
  {
    input: 'wisp',
    output: ['wisp_signal=active', 'portal_hint=type greennode anywhere', 'route=/green-node'],
  },
  {
    input: 'ubuntu',
    output: ['ubuntu_notes=mounted', 'focus=terminal + open source + homelab', 'risk=educational_only'],
  },
]

export const greenNodeProtocol = [
  'No enseñar intrusión, evasión o daño.',
  'Priorizar Linux, programación, defensa, OSINT ético y verificación.',
  'Separar hechos comprobados, hipótesis y narrativas especulativas.',
  'Mantener estética hacker sin promover actividad ilegal.',
  'Toda noticia o misterio debe etiquetarse como hecho, hipótesis, rumor o análisis documental.',
]

export const greenNodeAccessLog = [
  { event: 'wisp-click', label: 'Wisp flotante', detail: 'Entrada inmersiva recomendada para usuarios que descubren el EGG.' },
  { event: 'keyboard-sequence', label: 'greennode', detail: 'Secuencia secreta preparada para desbloqueo rápido desde cualquier página.' },
  { event: 'terminal-command', label: 'sudo truth', detail: 'Comando simbólico para activar contenido documental y logros futuros.' },
]

export const networkLinkChecklist = [
  'Header: rutas visibles revisadas para portal principal, Science Lab, CMS, roles y comunidad.',
  'Footer: redes oficiales y accesos internos centralizados desde siteConfig.',
  'Wisp: acceso especial a Green Node sin saturar el menú principal.',
  'News Engine: fuentes externas solo con atribución, resumen propio y revisión humana.',
  'Science Lab: informes con fuente, evidencia y contexto editorial.',
]

export const dynamicNewsPipeline = [
  'RSS/API externa → titulares + fuente original + imagen permitida',
  'CMS propio → contenido original de XETHKIOZ con SEO completo',
  'IA futura → resumen, etiquetas, borrador y verificación editorial',
  'Publicación → portal correcto + redes + sitemap + OpenGraph',
]
