import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'placeholder-anon-key-for-local-fallback-only';

const isValidSupabaseUrl = (value?: string): value is string =>
  Boolean(value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(value));

const isValidAnonKey = (value?: string): value is string => {
  if (!value) return false;

  const normalized = value.trim();
  const lower = normalized.toLowerCase();

  if (lower.includes('placeholder') || lower.includes('your-anon-key')) return false;

  // Supabase now supports short publishable keys such as sb_publishable_*.
  // Older projects may still expose long JWT anon keys beginning with eyJ.
  return normalized.startsWith('sb_publishable_') || (normalized.startsWith('eyJ') && normalized.length > 80);
};

export const isSupabaseConfigured =
  isValidSupabaseUrl(SUPABASE_URL) && isValidAnonKey(SUPABASE_ANON_KEY);

export const supabaseEnvironment = {
  urlConfigured: isValidSupabaseUrl(SUPABASE_URL),
  anonKeyConfigured: isValidAnonKey(SUPABASE_ANON_KEY),
  ready: isSupabaseConfigured,
} as const;

const clientUrl = isSupabaseConfigured ? SUPABASE_URL : FALLBACK_SUPABASE_URL;
const clientAnonKey = isSupabaseConfigured ? SUPABASE_ANON_KEY : FALLBACK_SUPABASE_ANON_KEY;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[XETHKIOZ Supabase] VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY no están configuradas o usan placeholders. El cliente queda en modo fallback local.'
  );
}

export const supabase: SupabaseClient = createClient(clientUrl, clientAnonKey, {
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
  global: {
    headers: {
      'x-application-name': 'xethkioz-fusion-platform',
    },
  },
});
