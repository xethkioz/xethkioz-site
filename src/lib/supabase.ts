import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const fallbackUrl = 'https://pgjkqydeoevonhbpjbkj.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnamtxeWRlb2V2b25oYnBqYmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjI3MjYsImV4cCI6MjA5NzgzODcyNn0.BTrZwYb2BtpFjvZsMj_RdqNERIolqQMDzujeacPoagI'

function isLikelyUrl(value?: string) {
  return !!value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value)
}

function isLikelyAnonKey(value?: string) {
  return !!value && value.length > 80 && !value.includes('placeholder') && !value.includes('your-anon-key')
}

const url = isLikelyUrl(envUrl) ? envUrl : fallbackUrl
const key = isLikelyAnonKey(envKey) ? envKey : fallbackKey

export const isSupabaseConfigured = isLikelyUrl(url) && isLikelyAnonKey(key)

export const supabase = createClient(url, key, {
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
})
