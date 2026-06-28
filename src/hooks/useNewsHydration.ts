import { useEffect, useMemo, useState } from 'react'
import type { PortalEventBusLike } from '../engines/world/sandbox/portalEventContracts'
import {
  NewsDataService,
  newsDataService,
  type NewsDataSnapshot,
} from '../services/cms/newsDataService'

export interface UseNewsHydrationOptions {
  readonly enabled?: boolean
  readonly eventBus?: PortalEventBusLike
  readonly service?: NewsDataService
}

export interface UseNewsHydrationResult {
  readonly isLoading: boolean
  readonly error: Error | null
  readonly newsData: NewsDataSnapshot | null
}

export function useNewsHydration(options: UseNewsHydrationOptions = {}): UseNewsHydrationResult {
  const { enabled = true, eventBus, service } = options
  const stableService = useMemo(() => service ?? (eventBus ? new NewsDataService({ eventBus }) : newsDataService), [eventBus, service])
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const [newsData, setNewsData] = useState<NewsDataSnapshot | null>(() => (enabled ? stableService.getSnapshot() : null))

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return undefined
    }

    let mounted = true
    setIsLoading(true)

    const unsubscribeChange = stableService.onChange((snapshot) => {
      if (!mounted) return
      setNewsData(snapshot)
      setIsLoading(false)
    })
    const unsubscribeError = stableService.onError((nextError) => {
      if (!mounted) return
      setError(nextError)
      setIsLoading(false)
    })
    const realtime = stableService.subscribeRealtime()

    void stableService.fetchInitial().catch((nextError: unknown) => {
      if (!mounted) return
      setError(nextError instanceof Error ? nextError : new Error(String(nextError)))
      setIsLoading(false)
    })

    return () => {
      mounted = false
      unsubscribeChange()
      unsubscribeError()
      realtime.unsubscribe()
    }
  }, [enabled, stableService])

  return Object.freeze({ isLoading, error, newsData })
}
