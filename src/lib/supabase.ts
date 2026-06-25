import { createClient } from '@supabase/supabase-js'

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://pascicauudfyydzknoop.supabase.co'

const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_baha-MZOxBr-2pQGaXlcwA_edqFjj-_'

if (!url || !key || url.includes('placeholder') || key === 'placeholder') {
  throw new Error('Supabase no está configurado correctamente.')
}

export const supabase = createClient(url, key)
