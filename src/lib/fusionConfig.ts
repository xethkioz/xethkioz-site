export const FUSION_VERSION = '11.0.0'
export const FUSION_LABEL = 'XETHKIOZ 11.0'
export const FUSION_STAGE = 'World Gate · harmony release candidate'

export const PUBLIC_ROUTES = [
  { path: '/', name: 'Home', status: 'public-core', owner: 'core' },
  { path: '/gaming', name: 'Gaming Hub', status: 'public-portal', owner: 'games' },
  { path: '/science', name: 'Science Lab', status: 'public-portal', owner: 'science' },
  { path: '/fun', name: 'Fun Portal', status: 'public-portal', owner: 'fun' },
  { path: '/creacion-web', name: 'Creación Web', status: 'public-service', owner: 'commercial' },
  { path: '/green-node', name: 'Green Node', status: 'hidden-portal', owner: 'wisp' },
  { path: '/news', name: 'News Engine', status: 'preview-module', owner: 'content' },
  { path: '/community', name: 'Community Engine', status: 'preview-module', owner: 'community' },
  { path: '/nexus-city', name: 'Nexus City', status: 'public-social-alpha', owner: 'community' },
  { path: '/profile', name: 'Profile Hub', status: 'preview-module', owner: 'community' },
  { path: '/cms', name: 'CMS Studio', status: 'preview-module', owner: 'editorial' },
] as const

export const LEGACY_ROUTE_REDIRECTS = [
  { from: '/web-creation', to: '/creacion-web', reason: 'Canonical Spanish service route.' },
  { from: '/register', to: '/account', reason: 'Account creation is centralized in the stable account gateway.' },
  { from: '/admin', to: '/cms', reason: 'Editorial administration is centralized in the protected CMS.' },
] as const

export const FUSION_GUARDRAILS = [
  'main must remain deployable',
  'no visual rewrite without approved layered design',
  'database changes must be additive, migrated, reviewed and protected by RLS',
  'Green Wisp remains an Easter Egg/entity, not a menu item',
  'global controls must render outside portal pages',
  'Wisp must be a reusable entity component with states, not a hardcoded Home-only button',
  'HUD state must be global and persistent, not local to Header only',
  'Home must be composed from React/CSS layers, never from a flattened full-page image',
  'Live candidates must keep all public routes accessible and readable on mobile',
  'Wisp must remain visible globally through AppShell, not only inside Home',
  'Login state must be persistent, network-failure tolerant and backed by one canonical Supabase client',
  'Portal Engine must expose visual identity, panel hints, transition behavior, and accessible navigation per portal',
  'Green Node access remains a Wisp/Goblin Easter Egg and must not become a normal menu shortcut',
  'Wisp Engine must expose persistent state, events, energy and future AI integration hooks',
  'Visual and audio assets must be inventoried before being promoted to Live',
  'SQL migrations must remain idempotent and production-safe',
  'CMS, news, community, profile and progress features must preserve their Supabase and local-fallback contracts',
  'Dynamic content must be data-driven and i18n-aware before connecting Supabase',
  'Home V5 must keep modular hierarchy: hero, portals, updates, Wisp panel, community status and content signals.',
  'Portal metadata must come from Portal Registry instead of hardcoded Home arrays.',
  'New visual constants must be introduced through Design Tokens before being used by components.',
  'Social cosmetics must use earned, server-verifiable currency until moderation, age, refund and anti-fraud controls are operational.',
  'Nexus City must preserve report, block and safe-chat paths before enabling direct user-to-user commerce.',
] as const
