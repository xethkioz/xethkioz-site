import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { CmsNewsDatabase } from './databaseSchema'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'placeholder-anon-key-for-local-fallback-only'

function isValidSupabaseUrl(value?: string): value is string {
  return Boolean(value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value))
}

function isValidAnonKey(value?: string): value is string {
  return Boolean(
    value &&
      value.length > 80 &&
      !value.toLowerCase().includes('placeholder') &&
      !value.toLowerCase().includes('your-anon-key'),
  )
}

export const isCmsSupabaseConfigured = isValidSupabaseUrl(SUPABASE_URL) && isValidAnonKey(SUPABASE_ANON_KEY)

export const cmsSupabaseEnvironment = Object.freeze({
  urlConfigured: isValidSupabaseUrl(SUPABASE_URL),
  anonKeyConfigured: isValidAnonKey(SUPABASE_ANON_KEY),
  ready: isCmsSupabaseConfigured,
} satisfies {
  readonly urlConfigured: boolean
  readonly anonKeyConfigured: boolean
  readonly ready: boolean
})

const clientUrl = isCmsSupabaseConfigured ? SUPABASE_URL : FALLBACK_SUPABASE_URL
const clientAnonKey = isCmsSupabaseConfigured ? SUPABASE_ANON_KEY : FALLBACK_SUPABASE_ANON_KEY

if (!isCmsSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[XETHKIOZ CMS Supabase] VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY no están configuradas. News Hydration queda en fallback seguro.',
  )
}

export type CmsSupabaseClient = SupabaseClient<CmsNewsDatabase>

export const cmsSupabaseClient: CmsSupabaseClient = createClient<CmsNewsDatabase>(clientUrl, clientAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 8,
    },
  },
  global: {
    headers: {
      'x-application-name': 'xethkioz-news-hydration',
    },
  },
})
