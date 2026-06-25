import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import type { Article, Category, Stream, MediaItem, SocialLink, Author } from './types'
import { fallbackArticles, fallbackCategories, fallbackStreams, fallbackMedia, fallbackSocialLinks, fallbackAuthors } from './mockData'

interface QueryState<T> {
  data: T
  loading: boolean
  error: Error | null
}

const MAX_RETRIES = 3
const RETRY_DELAY = 800

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withRetry<T>(
  operation: () => Promise<{ data: T | null; error: { message: string } | null }>,
  retries = MAX_RETRIES
): Promise<{ data: T | null; error: Error | null }> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const result = await operation()
      if (result.error) throw new Error(result.error.message)
      return { data: result.data, error: null }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown Supabase error')
      if (attempt < retries - 1) await delay(RETRY_DELAY * (attempt + 1))
    }
  }

  return { data: null, error: lastError }
}

function normalizeSearch(value?: string) {
  return value?.trim().replace(/[%_,]/g, '')
}

export function useArticles(opts?: {
  categorySlug?: string
  portal?: string
  authorSlug?: string
  featured?: boolean
  trending?: boolean
  editorsPick?: boolean
  popular?: boolean
  limit?: number
  search?: string
}) {
  const [state, setState] = useState<QueryState<Article[]>>({ data: [], loading: true, error: null })
  const optsKey = useMemo(() => JSON.stringify(opts ?? {}), [opts])

  const fetchData = useCallback(async () => {
    const currentOpts = JSON.parse(optsKey) as NonNullable<typeof opts>
    setState((s) => ({ ...s, loading: true, error: null }))

    const { data, error } = await withRetry(async () => {
      let query = supabase
        .from('articles')
        .select('*, category:categories(*), author:authors(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (currentOpts.limit) query = query.limit(currentOpts.limit)
      if (currentOpts.featured) query = query.eq('is_featured', true)
      if (currentOpts.trending) query = query.eq('is_trending', true)
      if (currentOpts.editorsPick) query = query.eq('is_editors_pick', true)
      if (currentOpts.popular) query = query.eq('is_popular', true)

      const safeSearch = normalizeSearch(currentOpts.search)
      if (safeSearch) query = query.or(`title.ilike.%${safeSearch}%,excerpt.ilike.%${safeSearch}%`)

      return query
    })

    let result = ((data as Article[]) || [])
    if (error || result.length === 0) result = fallbackArticles
    if (currentOpts.featured) result = result.filter((a) => a.is_featured)
    if (currentOpts.trending) result = result.filter((a) => a.is_trending)
    if (currentOpts.editorsPick) result = result.filter((a) => a.is_editors_pick)
    if (currentOpts.popular) result = result.filter((a) => a.is_popular)
    if (currentOpts.categorySlug) result = result.filter((a) => a.category?.slug === currentOpts.categorySlug)
    if (currentOpts.portal) result = result.filter((a) => a.category?.portal === currentOpts.portal)
    if (currentOpts.authorSlug) result = result.filter((a) => a.author?.slug === currentOpts.authorSlug)
    if (currentOpts.limit) result = result.slice(0, currentOpts.limit)

    setState({ data: result, loading: false, error: null })
  }, [optsKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    articles: state.data,
    loading: state.loading,
    error: state.error,
    retry: fetchData,
  }
}

export function useArticle(slug?: string) {
  const [state, setState] = useState<QueryState<Article | null>>({ data: null, loading: true, error: null })

  const fetchData = useCallback(async () => {
    if (!slug) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () =>
      supabase
        .from('articles')
        .select('*, category:categories(*), author:authors(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
    )

    setState({ data: (data as Article | null) || fallbackArticles.find((a) => a.slug === slug) || null, loading: false, error: null })
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { article: state.data, loading: state.loading, error: state.error, retry: fetchData }
}

export function useCategories(portal?: string) {
  const [state, setState] = useState<QueryState<Category[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => {
      let query = supabase.from('categories').select('*').order('sort_order')
      if (portal) query = query.eq('portal', portal)
      return query
    })
    setState({ data: ((data as Category[]) || []).length ? (data as Category[]) : fallbackCategories.filter((c) => !portal || c.portal === portal), loading: false, error: null })
  }, [portal])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { categories: state.data, loading: state.loading, error: state.error, retry: fetchData }
}

export function useAuthors() {
  const [state, setState] = useState<QueryState<Author[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => supabase.from('authors').select('*').order('name'))
    setState({ data: ((data as Author[]) || []).length ? (data as Author[]) : fallbackAuthors, loading: false, error: null })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { authors: state.data, loading: state.loading, error: state.error, retry: fetchData }
}

export function useAuthor(slug?: string) {
  const [state, setState] = useState<QueryState<Author | null>>({ data: null, loading: true, error: null })

  const fetchData = useCallback(async () => {
    if (!slug) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => supabase.from('authors').select('*').eq('slug', slug).single())
    setState({ data: (data as Author | null) || fallbackAuthors.find((a) => a.slug === slug) || null, loading: false, error: null })
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { author: state.data, loading: state.loading, error: state.error, retry: fetchData }
}

export function useStreams(opts?: { platform?: string; featured?: boolean; live?: boolean }) {
  const [state, setState] = useState<QueryState<Stream[]>>({ data: [], loading: true, error: null })
  const optsKey = useMemo(() => JSON.stringify(opts ?? {}), [opts])

  const fetchData = useCallback(async () => {
    const currentOpts = JSON.parse(optsKey) as NonNullable<typeof opts>
    setState((s) => ({ ...s, loading: true, error: null }))

    const { data, error } = await withRetry(async () => {
      let query = supabase.from('streams').select('*').order('published_at', { ascending: false })
      if (currentOpts.platform) query = query.eq('platform', currentOpts.platform)
      if (currentOpts.featured) query = query.eq('is_featured', true)
      if (currentOpts.live) query = query.eq('is_live', true)
      return query
    })

    
    let result = ((data as Stream[]) || [])
    if (error || result.length === 0) result = fallbackStreams
    if (currentOpts.platform) result = result.filter((s) => s.platform === currentOpts.platform)
    if (currentOpts.featured) result = result.filter((s) => s.is_featured)
    if (currentOpts.live) result = result.filter((s) => s.is_live)
    setState({ data: result, loading: false, error: null })
  }, [optsKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { streams: state.data, loading: state.loading, error: state.error, retry: fetchData }
}

export function useMedia(type?: string) {
  const [state, setState] = useState<QueryState<MediaItem[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => {
      let query = supabase.from('media_items').select('*').order('created_at', { ascending: false })
      if (type) query = query.eq('type', type)
      return query
    })
    
    let result = ((data as MediaItem[]) || [])
    if (error || result.length === 0) result = fallbackMedia
    if (type) result = result.filter((m) => m.type === type)
    setState({ data: result, loading: false, error: null })
  }, [type])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { media: state.data, loading: state.loading, error: state.error, retry: fetchData }
}

export function useSocialLinks() {
  const [state, setState] = useState<QueryState<SocialLink[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => supabase.from('social_links').select('*').order('sort_order'))
    setState({ data: ((data as SocialLink[]) || []).length ? (data as SocialLink[]) : fallbackSocialLinks, loading: false, error: null })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { socials: state.data, loading: state.loading, error: state.error, retry: fetchData }
}
