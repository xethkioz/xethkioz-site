export const homeKpis = [
  { label: 'Threads impact', value: '1.6M+', detail: 'visualizaciones verificadas por la comunidad' },
  { label: 'RC Strategy', value: 'RC3', detail: 'cambios grandes, auditables y con un deploy único' },
  { label: 'Content OS', value: '6', detail: 'verticales editoriales conectadas al mismo CMS' },
  { label: 'Community Core', value: '24/7', detail: 'chat público, presencia y progresión Wisp' },
] as const

export const homePortals = [
  {
    title: 'Gaming Hub',
    eyebrow: 'portal principal',
    path: '/gaming',
    icon: '🎮',
    accent: 'orange',
    description: 'Noticias, tops, esports, MMORPG, Xbox, PC, mobile, Asia Gaming y cultura gamer adulta.',
    tags: ['LoL', 'Mobile Legends', 'Pokémon', 'MMORPG', 'GTA VI', 'Xbox'],
  },
  {
    title: 'Tech Lab',
    eyebrow: 'tecnología aplicada',
    path: '/tech',
    icon: '⚡',
    accent: 'purple',
    description: 'Hardware, IA, software, streaming tech, automatización y herramientas para creadores.',
    tags: ['IA', 'Hardware', 'Supabase', 'Netlify', 'OBS', 'Creators'],
  },
  {
    title: 'Science Lab',
    eyebrow: 'divulgación responsable',
    path: '/science',
    icon: '🔬',
    accent: 'blue',
    description: 'Ciencia, evidencia, fake news, pensamiento crítico y explicación clara para público general.',
    tags: ['Medicina', 'Espacio', 'Papers', 'Fuentes', 'IA científica'],
  },
  {
    title: 'Green Node',
    eyebrow: 'matriz técnica',
    path: '/green-node',
    icon: '🟢',
    accent: 'green',
    description: 'Linux, Ubuntu, programación, redes, ciberseguridad defensiva, criptografía y OSINT educativo.',
    tags: ['Linux', 'Ubuntu', 'Docker', 'Redes', 'Cripto', 'TOR educativo'],
  },
] as const

export const editorialLanes = [
  { label: 'Gaming', route: '/gaming', detail: 'Noticias, tops, clips, comunidad y análisis.', state: 'Core' },
  { label: 'Tecnología', route: '/tech', detail: 'IA, hardware, software y herramientas.', state: 'Core' },
  { label: 'Ciencia', route: '/science', detail: 'Evidencia, fuentes y divulgación limpia.', state: 'Formal' },
  { label: 'Green Node', route: '/green-node', detail: 'Matriz Linux, redes y ciberseguridad educativa.', state: 'Matrix' },
  { label: 'Streaming', route: '/streaming', detail: 'Kick, Twitch, OBS, overlays y clips.', state: 'Live' },
  { label: 'CMS Studio', route: '/cms', detail: 'Borradores, roles, SEO y publicación.', state: 'Admin' },
] as const

export const greenNodeMatrix = [
  { group: 'Sistemas', items: ['Ubuntu', 'Linux', 'Windows', 'Terminal', 'Open Source', 'Homelab'] },
  { group: 'Programación', items: ['React', 'TypeScript', 'Python', 'APIs', 'Bases de datos', 'Automatización'] },
  { group: 'Infraestructura', items: ['Docker', 'Nginx', 'VPS', 'Cloudflare', 'Backups', 'Monitoreo'] },
  { group: 'Seguridad educativa', items: ['Ciberseguridad defensiva', 'Redes', 'Criptografía', 'OSINT ético', 'TOR informativo', 'Hardening'] },
  { group: 'Exploración', items: ['IA', 'Ciencia', 'Ingeniería', 'Hardware', 'Misterios', 'OVNIs documentales'] },
  { group: 'Contenido', items: ['Noticias automáticas', 'Guías', 'Laboratorio', 'Fuentes', 'Checklist', 'Publicación CMS'] },
] as const
