import type { SupabaseClient } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase, supabaseEnvironment } from '../supabaseClient'
import type { CmsNewsDatabase } from './databaseSchema'

export type CmsSupabaseClient = SupabaseClient<CmsNewsDatabase>

// Authentication must have exactly one browser owner. Reusing the canonical
// client prevents competing refresh timers and storage listeners from making
// one route appear signed out while another still has a valid session.
export const cmsSupabaseClient = supabase as CmsSupabaseClient
export const isCmsSupabaseConfigured = isSupabaseConfigured
export const cmsSupabaseEnvironment = supabaseEnvironment
