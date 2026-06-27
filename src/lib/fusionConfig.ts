export const FUSION_VERSION = '7.0.0-fusion-alpha.1.6-functionality-core'
export const FUSION_LABEL = 'Fusion Alpha 1.6'
export const FUSION_STAGE = 'Functionality Core · CMS/News/Community/Profile/Progress Preview'

export const PUBLIC_ROUTES = [
  { path: '/', name: 'Home', status: 'public-core', owner: 'core' },
  { path: '/gaming', name: 'Gaming Hub', status: 'public-portal', owner: 'games' },
  { path: '/science', name: 'Science Lab', status: 'public-portal', owner: 'science' },
  { path: '/fun', name: 'Fun Portal', status: 'public-portal', owner: 'fun' },
  { path: '/green-node', name: 'Green Node', status: 'hidden-portal', owner: 'wisp' },
  { path: '/news', name: 'News Engine', status: 'preview-module', owner: 'content' },
  { path: '/community', name: 'Community Engine', status: 'preview-module', owner: 'community' },
  { path: '/profile', name: 'Profile Hub', status: 'preview-module', owner: 'community' },
  { path: '/cms', name: 'CMS Studio', status: 'preview-module', owner: 'editorial' },
] as const

export const LEGACY_ROUTE_REDIRECTS = [
  { from: '/news', to: '/gaming', reason: 'News content is temporarily collapsed into Gaming Hub.' },
  { from: '/community', to: '/fun', reason: 'Community/fun content is temporarily collapsed into Fun Portal.' },
  { from: '/admin', to: '/', reason: 'Admin is locked until CMS/Auth are rebuilt.' },
  { from: '/cms', to: '/', reason: 'CMS is locked until data contracts are approved.' },
] as const

export const FUSION_GUARDRAILS = [
  'main must remain deployable',
  'no visual rewrite without approved layered design',
  'no SQL execution during alpha cleanup',
  'Green Wisp remains an Easter Egg/entity, not a menu item',
  'global controls must render outside portal pages',
  'Wisp must be a reusable entity component with states, not a hardcoded Home-only button',
  'HUD state must be global and persistent, not local to Header only',
  'Home must be composed from React/CSS layers, never from a flattened full-page image',
  'Live candidates must keep all public routes accessible and readable on mobile',
  'Wisp must remain visible globally through AppShell, not only inside Home',
  'Login state must be persistent and clearly marked as preview until Auth is connected',
  'Portal Engine must expose visual identity, panel hints, transition behavior, and accessible navigation per portal',
  'Green Node access remains a Wisp/Goblin Easter Egg and must not become a normal menu shortcut',
  'Wisp Engine must expose persistent state, events, energy and future AI integration hooks',
  'Visual and audio assets must be inventoried before being promoted to Live',
  'SQL remains audit-only until migrations are consolidated and approved',
  'CMS, news, community, profile and progress features stay mock/local until backend contracts are approved',
  'Dynamic content must be data-driven and i18n-aware before connecting Supabase',
] as const
