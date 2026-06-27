import type { FusionPortalId } from '../../lib/fusionContent'

export type PortalTheme = 'gaming' | 'science' | 'green' | 'fun'
export type PortalStatus = 'online' | 'maintenance' | 'comingSoon' | 'locked'
export type PortalUnlockCondition = 'always' | 'wispWatching'

export interface PortalMetadata {
  id: FusionPortalId
  titleKey: 'games' | 'science' | 'green' | 'fun'
  code: string
  route: string
  theme: PortalTheme
  engine: 'GamingEngine' | 'ScienceEngine' | 'GreenEngine' | 'FunEngine'
  status: PortalStatus
  unlockCondition: PortalUnlockCondition
  order: number
  hidden?: boolean
  requiresAuth?: boolean
  tags: string[]
}

export const portalRegistry: PortalMetadata[] = [
  {
    id: 'gaming',
    titleKey: 'games',
    code: '01 / PORTAL',
    route: '/gaming',
    theme: 'gaming',
    engine: 'GamingEngine',
    status: 'online',
    unlockCondition: 'always',
    order: 10,
    tags: ['games', 'streams', 'guides'],
  },
  {
    id: 'science',
    titleKey: 'science',
    code: '02 / PORTAL',
    route: '/science',
    theme: 'science',
    engine: 'ScienceEngine',
    status: 'online',
    unlockCondition: 'always',
    order: 20,
    tags: ['science', 'ai', 'technology'],
  },
  {
    id: 'green',
    titleKey: 'green',
    code: '03 / HIDDEN',
    route: '/green-node',
    theme: 'green',
    engine: 'GreenEngine',
    status: 'online',
    unlockCondition: 'wispWatching',
    order: 30,
    hidden: true,
    tags: ['linux', 'security', 'wisp'],
  },
  {
    id: 'fun',
    titleKey: 'fun',
    code: '04 / PORTAL',
    route: '/fun',
    theme: 'fun',
    engine: 'FunEngine',
    status: 'online',
    unlockCondition: 'always',
    order: 40,
    tags: ['fun', 'memes', 'adventures'],
  },
]

export function getPortalRegistry() {
  return [...portalRegistry].sort((a, b) => a.order - b.order)
}

export function canEnterPortal(portal: PortalMetadata, context: { wispMood?: string }) {
  if (portal.status !== 'online') return false
  if (portal.unlockCondition === 'always') return true
  if (portal.unlockCondition === 'wispWatching') {
    return context.wispMood === 'watching' || context.wispMood === 'connected' || context.wispMood === 'guiding' || context.wispMood === 'GREEN_MODE'
  }
  return false
}
