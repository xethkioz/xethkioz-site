import type { WispEvent } from './realtimeCommunity'

export function addWispXp(
  points: number,
  eventType: WispEvent['type'] = 'visit',
  route = typeof window !== 'undefined' ? window.location.pathname : '/',
) {
  void import('./realtimeCommunity')
    .then((module) => module.addWispXp(points, eventType, route))
    .catch(() => {
      // Wisp progression is optional when the social module cannot be loaded.
    })
}
