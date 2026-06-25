import { createClient } from '@supabase/supabase-js'

const url = 'https://pascicauudfyydzknoop.supabase.co'

const key =
  'sb_publishable_baha-MZOxBr-2pQGaXlcwA_edqFjj-_'

export const supabase = createClient(url, key)