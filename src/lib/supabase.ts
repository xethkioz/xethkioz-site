import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isLikelyUrl(value?: string) {
  return !!value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value)
}

function isLikelyAnonKey(value?: string) {
  return !!value && value.length > 80 && !value.includes('placeholder') && !value.includes('your-anon-key')
}

export const isSupabaseConfigured = isLikelyUrl(envUrl) && isLikelyAnonKey(envKey)

const url = isSupabaseConfigured ? envUrl : 'https://placeholder.supabase.co'
const key = isSupabaseConfigured ? envKey : 'placeholder-anon-key-for-local-fallback-only'

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 12,
    },
  },
})
