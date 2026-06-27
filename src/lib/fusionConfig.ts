export const FUSION_VERSION = '7.0.0-fusion-alpha.1.0-live-candidate'
export const FUSION_LABEL = 'Fusion Alpha 1.0'
export const FUSION_STAGE = 'Live Candidate · World Gate Foundation'

export const PUBLIC_ROUTES = [
  { path: '/', name: 'Home', status: 'public-core', owner: 'core' },
  { path: '/gaming', name: 'Gaming Hub', status: 'public-portal', owner: 'games' },
  { path: '/science', name: 'Science Lab', status: 'public-portal', owner: 'science' },
  { path: '/fun', name: 'Fun Portal', status: 'public-portal', owner: 'fun' },
  { path: '/green-node', name: 'Green Node', status: 'hidden-portal', owner: 'wisp' },
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
] as const
