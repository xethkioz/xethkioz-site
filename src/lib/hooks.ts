import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from './supabase'
import type { Article, Category, Stream, MediaItem, SocialLink, Author } from './types'

interface QueryState<T> {
  data: T
  loading: boolean
  error: Error | null
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

async function withRetry<T>(
  operation: () => Promise<{ data: T | null; error: { message: string } | null }>,
  retries = MAX_RETRIES
): Promise<{ data: T | null; error: Error | null }> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await operation()
      if (result.error) {
        throw new Error(result.error.message)
      }
      return { data: result.data, error: null }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown error')
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (attempt + 1)))
      }
    }
  }
  return { data: null, error: lastError }
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
  const optsRef = useRef(JSON.stringify(opts))

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => {
      let q = supabase
        .from('articles')
        .select('*, category:categories(*), author:authors(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (opts?.limit) q = q.limit(opts.limit)
      if (opts?.featured) q = q.eq('is_featured', true)
      if (opts?.trending) q = q.eq('is_trending', true)
      if (opts?.editorsPick) q = q.eq('is_editors_pick', true)
      if (opts?.popular) q = q.eq('is_popular', true)
      if (opts?.search) q = q.or(`title.ilike.%${opts.search}%,excerpt.ilike.%${opts.search}%`)

      return q
    })

    if (error) {
      setState({ data: [], loading: false, error })
    } else {
      let r = (data as Article[]) || []
      if (opts?.categorySlug) r = r.filter((a) => a.category?.slug === opts.categorySlug)
      if (opts?.portal) r = r.filter((a) => a.category?.portal === opts.portal)
      if (opts?.authorSlug) r = r.filter((a) => a.author?.slug === opts.authorSlug)
      setState({ data: r, loading: false, error: null })
    }
  }, [opts])

  useEffect(() => {
    const currentOpts = JSON.stringify(opts)
    if (currentOpts !== optsRef.current) {
      optsRef.current = currentOpts
      fetchData()
    }
  }, [fetchData, opts])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { articles: state.data, loading: state.loading, error: state.error, retry }
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
    setState({ data: data as Article | null, loading: false, error })
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { article: state.data, loading: state.loading, error: state.error, retry }
}

export function useCategories(portal?: string) {
  const [state, setState] = useState<QueryState<Category[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => {
      let q = supabase.from('categories').select('*').order('sort_order')
      if (portal) q = q.eq('portal', portal)
      return q
    })
    setState({ data: (data as Category[]) || [], loading: false, error })
  }, [portal])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { categories: state.data, loading: state.loading, error: state.error, retry }
}

export function useAuthors() {
  const [state, setState] = useState<QueryState<Author[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () =>
      supabase.from('authors').select('*').order('name')
    )
    setState({ data: (data as Author[]) || [], loading: false, error })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { authors: state.data, loading: state.loading, error: state.error, retry }
}

export function useAuthor(slug?: string) {
  const [state, setState] = useState<QueryState<Author | null>>({ data: null, loading: true, error: null })

  const fetchData = useCallback(async () => {
    if (!slug) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () =>
      supabase.from('authors').select('*').eq('slug', slug).single()
    )
    setState({ data: data as Author | null, loading: false, error })
  }, [slug])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { author: state.data, loading: state.loading, error: state.error, retry }
}

export function useStreams(opts?: { platform?: string; featured?: boolean; live?: boolean }) {
  const [state, setState] = useState<QueryState<Stream[]>>({ data: [], loading: true, error: null })
  const optsRef = useRef(JSON.stringify(opts))

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => {
      let q = supabase.from('streams').select('*').order('published_at', { ascending: false })
      if (opts?.platform) q = q.eq('platform', opts.platform)
      if (opts?.featured) q = q.eq('is_featured', true)
      if (opts?.live) q = q.eq('is_live', true)
      return q
    })
    setState({ data: (data as Stream[]) || [], loading: false, error })
  }, [opts])

  useEffect(() => {
    const currentOpts = JSON.stringify(opts)
    if (currentOpts !== optsRef.current) {
      optsRef.current = currentOpts
      fetchData()
    }
  }, [fetchData, opts])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { streams: state.data, loading: state.loading, error: state.error, retry }
}

export function useMedia(type?: string) {
  const [state, setState] = useState<QueryState<MediaItem[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () => {
      let q = supabase.from('media_items').select('*').order('created_at', { ascending: false })
      if (type) q = q.eq('type', type)
      return q
    })
    setState({ data: (data as MediaItem[]) || [], loading: false, error })
  }, [type])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { media: state.data, loading: state.loading, error: state.error, retry }
}

export function useSocialLinks() {
  const [state, setState] = useState<QueryState<SocialLink[]>>({ data: [], loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const { data, error } = await withRetry(async () =>
      supabase.from('social_links').select('*').order('sort_order')
    )
    setState({ data: (data as SocialLink[]) || [], loading: false, error })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(() => fetchData(), [fetchData])

  return { socials: state.data, loading: state.loading, error: state.error, retry }
}
